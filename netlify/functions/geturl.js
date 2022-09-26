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

let s3 = new AWS.S3({
	accessKeyId: process.env.MY_AWS_ACCESS_KEY,
	secretAccessKey: process.env.MY_AWS_SECRET_KEY,
	region: 'us-west-1',
  signatureVersion: 'v4',
});


// recieve the Netlify function call
/* exports.handler = function (event, context, callback) {
  
  let headers = {
		"Access-Control-Allow-Origin" : process.env.NETLIFY_ACCESS_CONTROL_ALLOW_ORIGIN,
		"Access-Control-Allow-Headers": "Content-Type"
	};
  
  // if its a pre-flight cors check, then return early
  	if ( event.httpMethod === "OPTIONS" ) {
 
		callback(
			null,
			{
				statusCode: 200,
				headers: headers,
				body: JSON.stringify( "OK" )
			}
		);
      		return;
 
	}
  
  try {
  
  // what s3 bucket are the files in?
      const myBucket = process.env.AWS_S3_BUCKET;
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
  
  let response = {
			statusCode: 200,
			body: JSON.stringify(url)
		}
    
   } catch ( error ) {
 
		console.error( error );
 
		var response = {
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message: "Request could not be processed."
			})
		};
 
	}
  
  callback( null, response );
 
}; */


exports.handler = function( event, context, callback ) {
 
	// NOTE: In production (on Netlify), we shouldn't need to deal with CORS headers
	// since the Functions folder is a sub-folder of the Netlify site (same origin).
	// However, in local development, the "netlify-lambda" script serves the Functions
	// from a different port. As such, we need to have the CORS headers locally. In
	// order to keep things simple, we're just going to include them in both places.
	var headers = {
		"Access-Control-Allow-Headers": "Content-Type"
	};
 
	// In the case of a CORS preflight check, just return early.
	if ( event.httpMethod === "OPTIONS" ) {
 
		callback(
			null,
			{
				statusCode: 200,
				headers: headers,
				body: JSON.stringify( "OK" )
			}
		);
		return;
 
	}
 
	try {
 
		var resourceKey = 'The Drip Kit.zip'
 
		// The GET operation will only be valid for the next 60-minutes.
		// --
		// NOTE: Even though the full GET operation is only valid for a week, we can
		// tell the browser to cache the response for longer using the cache-control
		// header (which we are defining via the ResponseCacheControl override).
		var getParams = {
			Bucket: "madeforlifemusicuswest",
			Key: resourceKey,
			Expires: ( 60 * 60 ),
			ResponseCacheControl: "max-age=604800"
		};
 
		var getUrl = s3.getSignedUrl( "getObject", getParams );
 
		var response = {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				getUrl: getUrl
			})
		};
 
	} catch ( error ) {
 
		console.error( error );
 
		var response = {
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message: "Request could not be processed."
			})
		};
 
	}
 
	callback( null, response );
 
}

// ----------------------------------------------------------------------------------- //
 
// I returns the parsed body payload.
// --
// CAUTION: Throws error if body cannot be parsed as JSON.
function parseBody( body, isBase64Encoded ) {
 
	var normalizedBody = isBase64Encoded
		? fromBase64( body )
		: body
	;
 
	return( JSON.parse( normalizedBody ) );
 
}
 
 
// I decode the given base64-encoded value into a utf-8 string.
function fromBase64( encodedValue ) {
 
	return( Buffer.from( encodedValue, "base64" ).toString( "utf8" ) );
 
}
