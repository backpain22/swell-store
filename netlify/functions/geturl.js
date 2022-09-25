// -------------------------------------------------------------------------------------------------------------------
// Multi use Netlify serverless function template to fetch data across a network, such as an aws sr bucket, without  |
// exposing secrets. The purpose is that by offloading this code to a function we are taking it out of the browser   |
// (aka client side), where it would more or less be publicly available(including the sensitive info like secret     |
// access keys), and moving it to the server (aka server side), where it is safe from prying eyes. Remember to use   |
// process.env.MY_ENVIRONMENT_VAR otherwise your sensitive info will still be exposed via your github repo.          |
// -------------------------------------------------------------------------------------------------------------------
// Written by: Scott Clayton                                                                                         |
// -------------------------------------------------------------------------------------------------------------------
// License: MIT                                                                                                      |
// -------------------------------------------------------------------------------------------------------------------

const AWS = require('aws-sdk'); // for obvious reasons

//------------------------------------------------------------
// un- comment if you want to make generic api call instead  |
//------------------------------------------------------------
// const axios = require("axios");                           |
//------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------
// note axios is not necessary, Im using it out of preference, you could use plain xmlhttprequest like so...       |
//------------------------------------------------------------------------------------------------------------------
// const xhr = new xmlhttprequest();                                                                               |
// xhr.open('GET', MY_API_ENDPOINT_URL);                                                                           |
//                                                                                                                 |
// let data = {};                                                                                                  |
// data.myData = "data I want to send in the body";                                                                |
// let myDataVar = "data stored in var I want to send in body";                                                    |
// data.myOtherData = myDataVar;                                                                                   |
// data = JSON.stringify(data);                                                                                    |
//                                                                                                                 |
// xhr.send(data)                                                                                                  |
//                                                                                                                 |
// xhr.onload = function() {                                                                                       |
//    if (xhr.status == 200) {                                                                                     |
//        console.log(xhr.responseText);                                                                           |
//       };                                                                                                        |
//    };                                                                                                           |
// -----------------------------------------------------------------------------------------------------------------

// recieve the Netlify function call
exports.handler = async function (event, context) {
  
  // update aws credentials for url signing
    AWS.config.update({
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
        region: 'us-west-1',
        signatureVersion: 'v4',
      });
  
  // define our s3 params
      const s3 = new AWS.S3();
  // what s3 bucket are the files in?
      const myBucket = "madeforlifemusicuswest";
  // the file name?
      const myKey = "The Drip Kit.zip";
  // how long will the url be valid for?
      const timelimit = 60 * 15; // 15 minutes


 //--------------------------------------------------
 // use this code to Perform an API call.           |
 //--------------------------------------------------
 // const get = () => {                             |
 //   axios.get(URL)                                |
 //     .then((response) =>                         |
 //     {                                           |
 //     console.log(response.data)                  |
 //     pass(response.data)                         |
 //   };                                            |
 // -------------------------------------------------

  //-------------------------------------------------
  // Instead we are using aws-sdk                   |
  // ------------------------------------------------
  
  // call the function to sign the url
      const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket, // pass in the vars for the s3 bucket
        Key: myKey, // and the file name
        Expires: timelimit, // and the time limit
      });
  
  
  return url;

};
