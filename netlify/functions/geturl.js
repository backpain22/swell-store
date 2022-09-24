exports.handler = async function (event, context) {
        const data = {};
        let myurl = ""
        const funcurl = "https://3n3zloc66scb364bt34wywbg4i0nqrzu.lambda-url.us-west-1.on.aws/";
        data.id = "The Drip Kit";
        data.type = ".zip";
        
        let xhr = new XMLHttpRequest();
  
  // 2. Configure it: GET-request for the URL /article/.../load
  xhr.open('GET', funcurl);
  
  // 3. Send the request over the network
  xhr.send(JSON.stringify(data));
  
  // 4. This will be called after the response is received
  xhr.onload = function() {
    if (xhr.status == 200) { // analyze HTTP status of the response
      myurl = responseText;
    }
  };
      
        return myurl;
  };
