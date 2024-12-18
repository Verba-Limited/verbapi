const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBWd4uatDjoDjHfE_RAS2KHqhL4cOjGXPQ");

const { onboardingSchema, 
    accountSchema, 
    sendMoneySchema,
    beneficiarySchema
} = require("./schemas/schemas.js");

const {
    registerUserFunctions,
    accountInformationFunctions,
    sendMoneyFunctions,
    userBeneficiaryFunctions
} = require("./functions/functions.js");

const systemMessageInstruction = `
    You are a virtual assistant for a fintech application called "Verb." Your primary responsibilities include:

    1. Onboarding new customers:
        - Validate the email supplied and check if the email is already registered.
        - Validate the bvn supplied and check if the bvn is already registered.
        - Validate the phoneNumber supplied and check if the phoneNumber is already registered.
        - If the country is not provided, set it to "NG" by default.
        - Correct contact address to be an Object with the properties specified in the "address" property
        - If the address is too long, split it into "Address Line 1" and "Address Line 2." Otherwise, duplicate "Address Line 1" into "Address Line 2."
        - If the postal code is not provided, use "100001" as the default.
        - Correct the dateOfBirth format to be YYYY-MM-DD.
        - Gender is either "Male" or "Female".
        - Dont validate selfie, If the selfie is not provided or undefined, use "https://placehold.co/600x400/png" as the default.
        - If deposit account from anchorService is created, retrieve and state the bank name, account name and reveal plainly account number as part of response else the whole process was not successful.


    3. Managing customer information:
        - Retrieve balance information for registered customers.
        - Currency is represented in Naira.
        - Don't ask user to provide any extra information when account information cannot be retrieved from server.
    
    4. Add Beneficiary to your account:
        - Add a user as a beneficiary.
        - Beneficiary information should have account name, account number and bank name.
        - Beneficiary name can have a nickname.

    Always respond in a clear and concise manner, adhering to the structure defined in the onboardingSchema, accountSchema and sendMoneySchema tools. 
    Handle errors gracefully, providing helpful suggestions to resolve issues. You should aim to make interactions intuitive and efficient.
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: systemMessageInstruction,
    tools: {
        functionDeclarations: [onboardingSchema, accountSchema, sendMoneySchema, beneficiarySchema],
    },
});

const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great! Can you please provide your first name, last name, contact address, phone number, email address, and BVN to onboard you." }],
      },
      {
        role: "model",
        parts: [{ text: "Can you please provide to check account information?" }],
      },
      {
        role: "model",
        parts: [{ text: "Nice! Can you please send money by providing email, amount, account name, account number, bank name and pin." }],
      },
      {
        role: "model",
        parts: [{ text: "Cool! Can you please add beneficiary to customer account." }],
      },
    ],
});

exports.generateVerbResponse = async (prompt) => {
    console.log("Request prompt --->", prompt);
    let result = await chat.sendMessage(prompt);
    const call = result?.response?.functionCalls()?.[0];
    console.log("Response determinant call --->", call);
    if (call) {
        try {
            // Handle onboarding
            if (registerUserFunctions[call.name]) {
                const apiResponse = await registerUserFunctions[call.name](call.args);
                const result2 = await chat.sendMessage([{
                    functionResponse: {
                        name: "onboardUser",
                        response: apiResponse,
                    }}]);
                console.log("Onboard response text --->", result2.response.text());
                return result2.response.text();
            }
        
            // Handle account information
            if (accountInformationFunctions[call.name]) {
                const apiResponse2 = await accountInformationFunctions[call.name](call.args);
                const result3 = await chat.sendMessage([{
                    functionResponse: {
                        name: "accountUser",
                        response: apiResponse2,
                    }}]);
                console.log("Account information response text --->", result3.response.text());
                return result3.response.text();
            }

            // Handle send money
            if (sendMoneyFunctions[call.name]) {
                const apiRes = await sendMoneyFunctions[call.name](call.args);
                const reslt = await chat.sendMessage([{
                    functionResponse: {
                        name: "sendMoney",
                        response: apiRes,
                    }}]);
                console.log("Transfer money information response text --->", reslt.response.text());
                return reslt.response.text();
            }

            // Handle user beneficiary to account
            if (userBeneficiaryFunctions[call.name]) {
                const apiRs = await userBeneficiaryFunctions[call.name](call.args);
                const resl = await chat.sendMessage([{
                    functionResponse: {
                        name: "userBeneficiary",
                        response: apiRs,
                    }}]);
                console.log("User beneficiary information response text --->", resl.response.text());
                return resl.response.text();
            }
        } catch (error) {
            console.error("Error handling function call:", error);
            return error;
        }
    } else {
        console.error("No function call found in the response.");
        return "Your request is not within scope of this application.";
    }
}
  