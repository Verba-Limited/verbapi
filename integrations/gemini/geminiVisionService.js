const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBWd4uatDjoDjHfE_RAS2KHqhL4cOjGXPQ");

function fileToGenerativeFile(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType: mimeType,
        },
    }
}
// async function run () {
//     const generativeModel = genAI.getGenerativeModel({ 
//         model: "gemini-1.5-flash",
//         generationConfig: {
//             responseMimeType: "application/json"
//         },
//     });

//     // const prompt = "What is my phone number, first name and last name?";
//     const prompt = "Extract necessary information from the passport image";

//     const imageParts = [fileToGenerativeFile("passportinfo.jpg", "image/jepg")]

//     const result = await generativeModel.generateContent([prompt, ...imageParts]);
//     const text = await result.response.text();
//     console.log(text);   
// }

// run();

exports.getImageInformation = async (passportImage) => {
    console.log("getPassportInformation--->", passportImage);
    // const passportImage = "passportinfo.jpg"
    const generativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        },
    });
    // const prompt = "What is my phone number, first name and last name?";
    const prompt = "Extract necessary information from the passport image";
    const imageParts = [fileToGenerativeFile(passportImage, "image/jepg")]
    const result = await generativeModel.generateContent([prompt, ...imageParts]);
    const text = await result.response.text();
    console.log(text);   
    return JSON.parse(text);
}

exports.getPdfInformation = async (passportImage) => {
    console.log("getPassportInformation--->", passportImage);
    // const passportImage = "passportinfo.jpg"
    const generativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        },
    });
    // const prompt = "What is my phone number, first name and last name?";
    const prompt = "Extract necessary information from the passport image";
    const imageParts = [fileToGenerativeFile(passportImage, "application/pdf")]
    const result = await generativeModel.generateContent([prompt, ...imageParts]);
    const text = await result.response.text();
    console.log(text);   
    return JSON.parse(text);
}