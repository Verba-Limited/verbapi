// const fetch = require('node-fetch');

const { Dojah } = require('dojah-typescript-sdk');

// import { Dojah } from "dojah-typescript-sdk";

const DOJAH_SANDBOX_URL = process.env.DOJAH_SANDBOX_URL;
const DOJAH_APP_ID = process.env.DOJAH_APP_ID;
const DOJAH_TEST_SECRET = process.env.DOJAH_TEST_SECRET;

const dojah = new Dojah({
  basePath: DOJAH_SANDBOX_URL,
  authorization: DOJAH_TEST_SECRET,
  appId: DOJAH_APP_ID,
});

exports.validateBVN = async (bvn) => {
    try {
        const getNormalBvnResponse = await dojah.nigeriaKyc.getBasicBvn({ bvn });
        console.log("getNormalBvnResponse---> ", getNormalBvnResponse.data);
        return {
            status: true,
            message: "success",
            data: getNormalBvnResponse?.data?.entity
        }
    } catch (e) {
        console.log("getSingleBVNResponse error---> ", e.responseBody.error);
        return { 
            status: false,
            message: (e.responseBody.error !== undefined) ? e.responseBody.error: e.message,
            data: null
        };
    }
}

// exports.getSingleBVN = async (bvn) => {
//     try {
//         let options = {
//             method: "GET",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'AppId': DOJAH_APP_ID,
//                 'Authorization': DOJAH_TEST_SECRET,
//             }   
//         }

//         console.log("getSingleBVNOptions---> ", options);

//         const response = await fetch(DOJAH_SANDBOX_URL+'/api/v1/kyc/bvn?bvn='+bvn, options);
//         console.log("getSingleBVNResponse response---> ", response);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         console.log("getSingleBVNResponse result---> ", result);
//         if(result) {
//             return {
//                 status: true,
//                 message: "success",
//                 data: result?.entity
//             }
//         } else {
//             return { 
//                 status: false,
//                 message: response.error,
//                 data: null
//             };
//         }
//     } catch (e) {
//         console.log("getSingleBVNResponse error---> ", e);
//         return { 
//             status: false,
//             message: e,
//             data: null
//         };
//     }
// }
