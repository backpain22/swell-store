const AWS = require('aws-sdk');

exports.handler = async function (event, context) {
  AWS.config.update({
        accessKeyId: "AKIAXENWTOFB5SXIAQGK",
        secretAccessKey: "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",
        region: 'us-west-1',
        signatureVersion: 'v4',
      });

      const s3 = new AWS.S3();
      const myBucket = "madeforlifemusicuswest";
      const myKey = 'The Drip Kit.zip';
      const timelimit = 60 * 15;

      const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: timelimit,
      });

      return url;

  };
