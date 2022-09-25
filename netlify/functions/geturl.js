// -------------------------------------------------------------------------------------------------------------------
// A Netlify serverless function to fetch a presigned url for time limited access to a file stored in a private      |
// Amazon s3 bucket. The purpose is that by offloading this code to a function we are taking it out of the browser   |
// (aka client side), where it would more or less be publicly available(including the sensitive info like secret     |
// access keys), and moving it to the server (aka server side), where it is safe from prying eyes. Remember to use   |
// process.env.MY_ENVIRONMENT_VAR otherwise your sensitive info will still be exposed via your github repo.          |
// -------------------------------------------------------------------------------------------------------------------
// Written by: Scott Clayton                                                                                         |
// -------------------------------------------------------------------------------------------------------------------
// License: MIT                                                                                                      |
// -------------------------------------------------------------------------------------------------------------------

const AWS = require('aws-sdk'); // for obvious reasons
const axios = require("axios"); // for fetching the data across the network

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
      const myKey = 'The Drip Kit.zip';
  // how long will the url be valid for?
      const timelimit = 60 * 15;

  const pass = (body) => {callback( null, {
    statusCode: 200,
    body: JSON.stringify(body)
  })}

  // Perform the API call.
  const get = () => {
    axios.get(URL)
      .then((response) =>
      {
      console.log(response.data)
      pass(response.data)
    };

      const s3 = new AWS.S3();
      const myBucket = "madeforlifemusicuswest";
      const myKey = 'The Drip Kit.zip';
      const timelimit = 60 * 15;

      const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: timelimit,
      });
  
      const jsonurl = {};
      jsonurl.url = url;
      const myurl = JSON.stringify(jsonurl);

      return myurl;

  };
