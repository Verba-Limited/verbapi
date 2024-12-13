const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bvnService = require('../integrations/dojah/dojahService');
const geminiService = require('../integrations/gemini/geminiService');
const geminiVisionService = require('../integrations/gemini/geminiVisionService');

const VerifyBVN = async (bvn) => {
  // const bvnResponse = await bvnService.getSingleBVN(bvn);
  const bvnResponse = await bvnService.validateBVN(bvn);
  console.log("BVN Response------>", );
  if(bvnResponse.status) {
    if(bvnResponse?.data) {
        return {
          firstName: bvnResponse?.data?.first_name?.toLowerCase(),
          middleName: bvnResponse?.data?.middle_name?.toLowerCase(),
          lastName: bvnResponse?.data?.last_name?.toLowerCase()
        }
    } else {
      throw new Error("No data found for the provided BVN");
    }
  } else {
    const message = (bvnResponse?.message !== undefined) ? bvnResponse.message : "Invalid BVN";
    throw new Error(message);
  }
}

exports.registerIntlPassport = async (passportImage) => {
  try {
    console.log("passportImage--->", passportImage);
    const image = passportImage;
    const response = await geminiVisionService.getImageInformation(image?.path);
    console.log("Generated response by AI---> ", response);
    return { success: true, message: "User info successfully extracted", response: response };
  } catch (e) {
    throw new Error("Cannot verify your passort"); 
  }
};

exports.registerUser = async ({ firstName, lastName, phoneNumber, bvn, email, password, prompt }) => {
  // const prompt = "Explain how AI works";
  const response = await geminiService.generateNameResponse(prompt);
  console.log("Generated response by AI---> ", response);

  // check bvn service
  const verifyBvn = await VerifyBVN(bvn);
  console.log("Verifying BVN", verifyBvn);
  if(verifyBvn != null) {
    // if((verifyBvn.firstName === firstName.toLowerCase()) && 
    //   (verifyBvn.lastName === lastName.toLowerCase())) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, phoneNumber, bvn, email, password: hashedPassword });
        await user.save();
        return { success: true, message: "User registered successfully", user };
        
    // } else {
    //   throw new Error("BVN supplied does not correspond your personal details");
    // }
  } else {
    throw new Error("Cannot verify BVN"); 
  }
};

exports.loginUser = async ({ phoneNumber, password }) => {
  const user = await User.findOne({ phoneNumber });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  if(user && !user.isVerified) {
    throw new Error("User not verified yet");
  }
  // Generate token
  const token = jwt.sign({ id: user._id, email: user.email, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { success: true, message: "Login successful", token, user };
};
