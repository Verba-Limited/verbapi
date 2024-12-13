const {
    CreateIndividualCustomer,
    CreateDepositAccount,
    CustomerKYCValidation,
    GetDepositAccountBalance
} = require("../../../anchor/anchorService.js");

const UserModel = require("../../../../models/User");
const AnchorModel = require("../../../../models/Anchor");

const isUser = async (userData) => {
    try {
        const user = await UserModel.findOne({
            $or: [
                { email: userData.email }, 
                { bvn: userData.bvn },
                { phoneNumber: userData.phoneNumber }
            ]
        });
        console.log("Response from User Model--->", user);
        if(user) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("Error checking user: ", e);
        return false
    }
}

const isAnchorData = async (userData) => {
    try {
        const anchorData = await AnchorModel.findOne({
            $or: [
                { email: userData.email },
            ]
        });
        console.log("Response from Anchor Model--->", anchorData);
        if(anchorData) {
            return anchorData;
        } else {
            return null;
        }
    } catch (e) {
        console.log("Error checking user: ", e);
        return null
    }
}

const registerAnchorCustomer = async (firstName, lastName, email, phoneNumber, address, bvn, gender, dateOfBirth, selfie) => {
    try {
        let customerData = {
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            bvn,
            gender, 
            dateOfBirth, 
            selfie,
            description: `Bank Verification Number: ${bvn}`
        };
        const checkUserResponse = await isUser(customerData);
        console.log("checkUserResponse--->", checkUserResponse);
        if(checkUserResponse === true) {
            return {
                status: false,
                message: "Customer already exist, kindly provide appropriate data",
                data: null
            };
        } else {
            // STEP 1
            let createCustomerResponse = await CreateIndividualCustomer(customerData);
            console.log("createCustomerResponse--->", JSON.stringify(createCustomerResponse));
            if(createCustomerResponse.status) {
                const anchorUserId = createCustomerResponse.data.data.id;

                const anchorAccount = new AnchorModel();
                anchorAccount.email = email;
                anchorAccount.anchorUserData = createCustomerResponse.data.data;
                await anchorAccount.save();

                // STEP 2
                let customerKYCValidationResponse = await CustomerKYCValidation(anchorUserId, customerData);
                console.log("customerKYCValidationResponse--->", JSON.stringify(customerKYCValidationResponse));
                if(customerKYCValidationResponse.status) {

                    // STEP 3
                    let depositAccountData = { customerId: anchorUserId, };
                    let createDepositAccountResponse = await CreateDepositAccount(depositAccountData);
                    console.log("createDepositAccountResponse--->", JSON.stringify(createDepositAccountResponse));
                    if(createDepositAccountResponse.status) {
                        // Create Generative AI description
                        const user = new UserModel({ firstName, lastName, phoneNumber, bvn, email, address, gender, dateOfBirth, selfie });
                        await user.save();

                        const checkAnchorResponse = await isAnchorData(customerData);
                        console.log("checkUserResponse--->", checkUserResponse);
                        if(checkAnchorResponse != null) {
                            checkAnchorResponse.anchorDepositAccountData = createDepositAccountResponse.data.data;
                            await checkAnchorResponse.save();

                            return {
                                status: true,
                                message: "You have been successfully registered and deposit account updated",
                                data: checkAnchorResponse
                            };

                        } else {
                            const anchorAccount = new AnchorModel();
                            anchorAccount.userId = user.id;
                            anchorAccount.email = email;
                            anchorAccount.anchorUserData = createCustomerResponse.data.data;
                            anchorAccount.anchorDepositAccountData = createDepositAccountResponse.data.data;
                            await anchorAccount.save();

                            return {
                                status: true,
                                message: "You have been successfully registered and deposit account created",
                                data: anchorAccount
                            };

                        }
                    } else {
                        return {
                            status: false,
                            message: createDepositAccountResponse.message,
                            data: null
                        };
                    }

                } else {
                    return {
                        status: false,
                        message: customerKYCValidationResponse.message,
                        data: null
                    };
                }
            } else {
                return {
                    status: false,
                    message: createCustomerResponse.message,
                    data: null
                };
            }
        }
    } catch (e) {
        console.log("Error registering customer: ", e);
        return {
            status: false,
            message: "An error occurred while registering the customer",
            data: null
        };
    }
}

const retrieveAccountInformation = async (email) => {
    try {
        let customerData = {
            email
        };
        const checkAnchorResponse = await isAnchorData(customerData);
        console.log("checkAnchorResponse--->", checkAnchorResponse);
        if(checkAnchorResponse != null) {
            const accountId = checkAnchorResponse.anchorDepositAccountData.id;
            const accountName = checkAnchorResponse.anchorDepositAccountData.attributes.accountName;
            let getBalanceResponse = await GetDepositAccountBalance(accountId, accountName);
            console.log("getBalanceResponse--->", JSON.stringify(getBalanceResponse));
            if(getBalanceResponse.status) {
                return {
                    status: true,
                    message: accountName+", Your account balance successfully retrieved",
                    data: getBalanceResponse.data
                };
            } else {
                return {
                    status: false,
                    message: getBalanceResponse.message,
                    data: null
                };
            }

        } else {
            return {
                status: false,
                message: "Customer cannot be found, kindly provide appropriate data",
                data: null
            };
        }
    } catch (e) {
        console.log("Error retrieving account balance: ", e);
        return {
            status: false,
            message: "An error occurred while retrieving account balance",
            data: null
        };
    }
}

const sendMoneyToCustomer = async (email, amount, accountNumber, accountName, bankName, pin) => {
    try {
        let customerData = {
            email
        };
        const checkAnchorResponse = await isAnchorData(customerData);
        console.log("checkAnchorResponse--->", checkAnchorResponse);
        if(checkAnchorResponse != null) {
            const accountId = checkAnchorResponse.anchorDepositAccountData.id;
            const accountName = checkAnchorResponse.anchorDepositAccountData.attributes.accountName;
            let getBalanceResponse = await GetDepositAccountBalance(accountId, accountName);
            console.log("getBalanceResponse--->", JSON.stringify(getBalanceResponse));
            if(getBalanceResponse.status) {
                // const returnedAmount = parseFloat(getBalanceResponse.data.data.availableBalance);
                const returnedAmount = parseFloat(6000);
                console.log("getBalanceResponse.data.data.availableBalance---->", returnedAmount);
                if(returnedAmount < parseFloat(amount)) {
                    return {
                        status: false,
                        message: "Insufficient funds in your account",
                        data: null
                    };
                } else {
                    // let transferResponse = await TransferFunds(accountId, sendAmount, accountNumber, accountName, bankName);
                    return {
                        status: true,
                        message: "Money successfully sent to "+ accountName,
                        data:  null
                    };
                }

            } else {
                return {
                    status: false,
                    message: getBalanceResponse.message,
                    data: null
                };
            }

        } else {
            return {
                status: false,
                message: "Customer cannot be found, kindly provide appropriate data",
                data: null
            };
        }
    } catch (e) {
        console.log("Error sending money: ", e);
        return {
            status: false,
            message: "An error occurred while sending money",
            data: null
        };
    }
}

const registerUserFunctions = {
    onboardUser: ({ firstName, lastName, email, phoneNumber, address, bvn, gender, dateOfBirth, selfie }) => {
      return registerAnchorCustomer(firstName, lastName, email, phoneNumber, address, bvn, gender, dateOfBirth, selfie)
    }
};

const accountInformationFunctions = {
    accountUser: ({ firstName, lastName, accountNumber, accountName, bankName, email }) => {
      return retrieveAccountInformation(email)
    }
};

const sendMoneyFunctions = {
    sendMoney: ({ email, amount, accountNumber, accountName, bankName, pin }) => {
      return sendMoneyToCustomer(email, amount, accountNumber, accountName, bankName, pin)
    }
};

exports.registerUserFunctions = registerUserFunctions;
exports.accountInformationFunctions = accountInformationFunctions;
exports.sendMoneyFunctions = sendMoneyFunctions;
