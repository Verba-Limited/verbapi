const { GoogleGenerativeAI } = require("@google/generative-ai");

const controlNameFunctionDeclaration = {
    name: "controlName",
    parameters: {
      type: "OBJECT",
      description: "Set the first name and last name of a person.",
      properties: {
        firstName: {
          type: "STRING",
          description: "The first name of the person.",
        },
        lastName: {
          type: "STRING",
          description: "The last name of the person.",
        },
      },
      required: ["firstName", "lastName"],
    },
};
  
// Executable function code. Put it in a map keyed by the function name
// so that you can call it once you get the name string from the model.
const functions = {
    controlName: ({ firstName, lastName }) => {
        return setNameValues(firstName, lastName)
    }
};

async function setNameValues(firstName, lastName) {
    // This mock API returns the requested naming values
    return {
      firstName: firstName,
      lastName: lastName
    };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generativeModel = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    // Specify the function declaration.
    tools: {
        functionDeclarations: [controlNameFunctionDeclaration],
    },
 });

exports.generateResponse = async (prompt) => {
    const result = await generativeModel.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
}

exports.generateNameResponse = async (prompt) => {
    console.log("generateNameResponse prompt--->", prompt);
    const chat = generativeModel.startChat();
    // const prompt = "Dim the lights so the room feels cozy and warm.";
    // Send the message to the model.
    const result = await chat.sendMessage(prompt);
    // For simplicity, this uses the first function call found.
    console.log("generateNameResponse--->", result);
    console.log("generateNameResponse candidate--->", JSON.stringify(result.response.candidates));
    const call = result.response.functionCalls();
    console.log("generateNameResponse call--->", call);
    if (call) {
        // Call the executable function named in the function call
        // with the arguments specified in the function call and
        // let it call the hypothetical API.
        const apiResponse = await functions[call.name](call.args);
        // Send the API response back to the model so it can generate
        // a text response that can be displayed to the user.
        const result2 = await chat.sendMessage([{functionResponse: {
            name: 'controlName',
            response: apiResponse
        }}]);
        // Log the text response.
        console.log(result2.response.text());
        return result2.response.text();
    }
}
