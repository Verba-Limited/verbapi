// const fetch = require('node-fetch');
// import { fetch } from "node-fetch";

// const X_ANCHOR_KEY = process.env.ANCHOR_API_KEY;
const X_ANCHOR_KEY = "J3w3g.30253a81f968f8c1270ad0f756eb7b1fac40bc14be3f9b5f36b82203896e3617a2ee922c0141f2d8bc64d1712aa200f367cd";
const BASE_URL = "https://api.sandbox.getanchor.co/api/v1";

// export const URL_REQUEST = async (url, method, body) => {
const URL_REQUEST = async (url, method, body) => {
    let options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-anchor-key': X_ANCHOR_KEY
        },
        body      
    }

    let k = await fetch(url, options);
    let response = await k.json();
    try {
        return { data: response, error: response?.errors }
    } catch(err) {
        return { data: null, error: err }
    }
}

export const CreateIndividualCustomer = async (p) => {
    try {
        console.log("createIndividualCustomer request--->", p);
        const requestBody = {
            "data": {
                "attributes": {
                    "fullName": {
                        "firstName": p.firstName,
                        "lastName": p.lastName
                    },
                    "email": p.email,
                    "phoneNumber": p.phoneNumber,
                    "address": {
                        "country": p.address.country,
                        "state": p.address.state,
                        "addressLine_1": p.address.addressLine_1,
                        "addressLine_2": p.address.addressLine_2,
                        "city": p.address.city,
                        "postalCode": p.address.postalCode
                    },
                    "description": p.description,
                },
                "type": "IndividualCustomer"
            }
        }
        console.log("createIndividualCustomer BASE_URL--->", BASE_URL);
        console.log("createIndividualCustomer Request--->", JSON.stringify(requestBody));
        let data = await URL_REQUEST(BASE_URL+'/customers', "POST", JSON.stringify(requestBody));
        console.log("createIndividualCustomer Response---> ", JSON.stringify(data));
        if(data && data?.data && (data?.data?.errors == null)) {
            return { 
                status: true,
                message: "success",
                data: data?.data
            };
        } 
        else {
            return {
                status: false,
                message: data?.error,
                data: null
            };
        }
    } catch (e) {
        console.log("createIndividualCustomer catch error---> ", JSON.stringify(e));
        return { 
            status: false,
            message: e,
            data: null
        };
    }
}

export const CustomerKYCValidation = async (customerId, p) => {
    try {
        console.log("customerKYCValidation request--->", p);
        const requestBody = {
            "data": {
                "attributes": {
                    "level": "TIER_2",
                    "level2": {
                        "bvn": p.bvn,
                        "selfie": p.selfie,
                        "gender": p.gender,
                        "dateOfBirth": p.dateOfBirth
                    }
                },
                "type": "Verification"
            }
        }
        console.log("customerKYCValidation BASE_URL--->", BASE_URL);
        console.log("customerKYCValidation Request--->", JSON.stringify(requestBody));
        let data = await URL_REQUEST(BASE_URL+`/customers/${customerId}/verification/individual`, "POST", JSON.stringify(requestBody));
        console.log("customerKYCValidation Response---> ", JSON.stringify(data));
        console.log("---------customerKYCValidation error---> ", data?.data?.errors);
        if(data && data?.data && (data?.data?.errors == null)) {
            return { 
                status: true,
                message: "success",
                data: data?.data
            };
        } 
        else {
            return {
                status: false,
                message: data?.error,
                data: null
            };
        }
    } catch (e) {
        console.log("createDepositAccount catch error---> ", JSON.stringify(e));
        return { 
            status: false,
            message: e,
            data: null
        };
    }
}

export const CreateDepositAccount = async (p) => {
    try {
        console.log("createDepositAccount request--->", p);
        const requestBody = {
            "data": {
                "attributes": {
                    "productName": "SAVINGS"
                },
                "relationships": {
                    "customer": {
                        "data": {
                            "id": p.customerId,
                            "type": "IndividualCustomer"
                        }
                    }
                },
                "type": "DepositAccount"
            }
        }
        console.log("createDepositAccount BASE_URL--->", BASE_URL);
        console.log("createDepositAccount Request--->", JSON.stringify(requestBody));
        let data = await URL_REQUEST(BASE_URL+'/accounts', "POST", JSON.stringify(requestBody));
        console.log("createDepositAccount Response---> ", data);
        console.log("---------createDepositAccount error ooo---> ", data?.data?.errors);
        if(data && data?.data && (data?.data?.errors == null)) {
            return { 
                status: true,
                message: "success",
                data: data?.data
            };
        } 
        else {
            return {
                status: false,
                message: data?.error,
                data: null
            };
        }
    } catch (e) {
        console.log("createDepositAccount catch error---> ", JSON.stringify(e));
        return { 
            status: false,
            message: e,
            data: null
        };
    }
}

export const GetDepositAccountBalance = async (accountId, accountName) => {
    try {
        console.log("getDepositAccountBalance request--->", accountId);
        console.log("getDepositAccountBalance BASE_URL--->", BASE_URL);
        let data = await URL_REQUEST(BASE_URL+`/accounts/balance/${accountId}?include=DepositAccount`, "GET", null);
        console.log("getDepositAccountBalance Response---> ", data);
        console.log("---------getDepositAccountBalance error ooo---> ", data?.data?.errors);
        if(data && data?.data && (data?.data?.errors == null)) {
            return { 
                status: true,
                message: "success",
                data: data?.data
            };
        } 
        else {
            return {
                status: false,
                message: data?.error,
                data: null
            };
        }
    } catch (e) {
        console.log("getDepositAccountBalance catch error---> ", JSON.stringify(e));
        return { 
            status: false,
            message: e,
            data: null
        };
    }
}



