const verbService = require('../integrations/gemini/verb/verbService');

exports.getService = async ({ prompt }) => {
    const response = await verbService.generateVerbResponse(prompt);
    console.log("Generated response by AI---> ", response);
    if(response != null) {
        return { success: true, message: "response retrieved successfully", response };
    } else {
      throw new Error("Cannot retrieve response verb service"); 
    }
};