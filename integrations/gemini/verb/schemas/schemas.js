const { SchemaType } = require("@google/generative-ai");

const onboardingSchema = {
    name: "onboardUser",
    description: "List of customer information",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        firstName: {
          type: SchemaType.STRING,
          description: "First Name of the customer",
          nullable: false,
        },       
        lastName: {
            type: SchemaType.STRING,
            description: "Last Name of the customer",
            nullable: false,
        },       
        email: {
            type: SchemaType.STRING,
            description: "Email Address of the customer",
            nullable: false,
        },       
        phoneNumber: {
            type: SchemaType.STRING,
            description: "Phone Number of the customer",
            nullable: false,
        },
        address: {
            type: SchemaType.OBJECT,
            properties: {
                country: {
                    type: SchemaType.STRING,
                    description: "Country of the customer",
                    nullable: true,
                },
                state: {
                    type: SchemaType.STRING,
                    description: "State of the customer",
                    nullable: false,
                },
                addressLine_1: {
                    type: SchemaType.STRING,
                    description: "Address Line 1 of the customer",
                    nullable: false,
                },
                addressLine_2: {
                    type: SchemaType.STRING,
                    description: "Address Line 2 of the customer",
                    nullable: true,
                },
                city: {
                    type: SchemaType.STRING,
                    description: "City of the customer",
                    nullable: false,
                },
                postalCode: {
                    type: SchemaType.STRING,
                    description: "Postal Code of the customer",
                    nullable: true,
                }
            }
        },     
        bvn: {
            type: SchemaType.STRING,
            description: "Bank Verification Number of the customer",
            nullable: true,
        },     
        gender: {
            type: SchemaType.STRING,
            description: "Gender of the customer",
            nullable: true,
        },    
        dateOfBirth: {
            type: SchemaType.STRING,
            description: "Date of Birth of the customer",
            nullable: true,
        },    
        selfie: {
            type: SchemaType.STRING,
            description: "Picture or Selfie of the customer",
            nullable: true,
        },
      },
      required: ["firstName", "lastName", "email", "phoneNumber", "bvn", "gender", "dateOfBirth", "selfie"],
    },
};

const accountSchema = {
    name: "accountUser",
    description: "Get customer account information",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        firstName: {
          type: SchemaType.STRING,
          description: "First Name of the customer",
          nullable: true,
        },       
        lastName: {
            type: SchemaType.STRING,
            description: "Last Name of the customer",
            nullable: true,
        },      
        email: {
            type: SchemaType.STRING,
            description: "Email Address of the customer",
            nullable: true,
        },             
        accountNumber: {
            type: SchemaType.STRING,
            description: "Account Number of the customer",
            nullable: true,
        },    
        accountName: {
            type: SchemaType.STRING,
            description: "Account Name of the customer",
            nullable: true,
        },   
        bankName: {
            type: SchemaType.STRING,
            description: "Bank Name of the customer",
            nullable: true,
        }, 
        balance: {
            type: SchemaType.NUMBER,
            description: "Account balance of the customer",
            nullable: true,
        }, 
      },
      required: ["firstName", "lastName", "email", "accountNumber", "accountName", "bankName", "balance"],
    },
};

const sendMoneySchema = {
    name: "sendMoney",
    description: "Send money to recipient account",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        firstName: {
          type: SchemaType.STRING,
          description: "First Name of the customer",
          nullable: true,
        },       
        lastName: {
            type: SchemaType.STRING,
            description: "Last Name of the customer",
            nullable: true,
        },      
        email: {
            type: SchemaType.STRING,
            description: "Email Address of the customer",
            nullable: true,
        },             
        accountNumber: {
            type: SchemaType.STRING,
            description: "Account Number of the recipient",
            nullable: true,
        },    
        accountName: {
            type: SchemaType.STRING,
            description: "Account Name of the recipient",
            nullable: true,
        },   
        bankName: {
            type: SchemaType.STRING,
            description: "Bank Name of the recipient",
            nullable: true,
        }, 
        amount: {
            type: SchemaType.STRING,
            description: "Amount to send to the recipient",
            nullable: true,
        },  
        pin: {
            type: SchemaType.NUMBER,
            description: "Transaction Pin of the recipient",
            nullable: true,
        }, 
      },
      required: ["firstName", "lastName", "email", "accountNumber", "accountName", "bankName", "amount", "pin"],
    },
};

exports.onboardingSchema = onboardingSchema;
exports.accountSchema = accountSchema;
exports.sendMoneySchema = sendMoneySchema;
