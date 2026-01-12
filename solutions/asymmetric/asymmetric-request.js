// Crypto Stripper
// Examples: https://github.com/dfuribez/crypto-stripper/wiki#examples

let fs = require("fs");
let crypto = require("crypto");


const GENERATED_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMVeRezXHiwFCOKrp8B8hXyfEv/QqnsSqcjM7iNDyBWeBV5RrXS7HhkiEO9VpK+mLQ1iAEG/aKsNUqKFSkMR02TSr1tOOmDk8EVVd+QAMqN3V4HHJLNrFyXyzb9/kIwy3yNNSJBthziKs9Dh2BqsmuOx84t77fB53uB/aBYISeGr/slg+HghQWTkFTPD8iaWlDI6LJqP/3+Yz3JvHLkOCrOmP8qhMCagKxo3K/NFj7m3YR06NU0Ebc695TfHP2q2+cG7ePdB1Um+8ivdc58zdfeVUa9eOIddSGJWfQZ5dTNcwAyWK3XuzvQwKeIqSHzw/lDtqQswiU5nKaPoD5w65QIDAQAB
-----END PUBLIC KEY-----
`;

const GENERATED_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8xV5F7NceLAUI4qunwHyFfJ8S/9CqexKpyMzuI0PIFZ4FXlGtdLseGSIQ71Wkr6YtDWIAQb9oqw1SooVKQxHTZNKvW046YOTwRVV35AAyo3dXgccks2sXJfLNv3+QjDLfI01IkG2HOIqz0OHYGqya47Hzi3vt8Hne4H9oFghJ4av+yWD4eCFBZOQVM8PyJpaUMjosmo//f5jPcm8cuQ4Ks6Y/yqEwJqArGjcr80WPubdhHTo1TQRtzr3lN8c/arb5wbt490HVSb7yK91znzN195VRr144h11IYlZ9Bnl1M1zADJYrde7O9DAp4ipIfPD+UO2pCzCJTmcpo+gPnDrlAgMBAAECggEADO1XL2KwuJg7IAilyK8d1+ZY3mw2VfZnqMjff89abPFOCQAUh9RenAkMlCxPqR9+OceY1nuqJ/jOyMHobtV4+wkEhI20JbtM8kdNOxCaEt2u5oc0pAbFZqhqoDxk9/kh4rYALN/3IDN3DClZzfrFpzXAkfUTX5AASIsHLpGTr7tuRA1eZzF71YAJEqGhEeeiUhYMGyj56FI2l+zkG2HadvYXk0HIse2vpsVbq0tvx0Tvc7KDQ890Ng5MGIlbFkTnU4lJYmatm29sHDTP13dHrUAJMORf9YxKEH01thpmcQ6joEc6JkTU6K2wVyIy9uFy0XAhBWDd5JLPD/95n4ODYQKBgQDDu7qnKdsz7JDCn6HEKuhIXRXjGcaQE2th4b+FvSoXjVcU1WckfCp63KNxOEHfO0o7xwnAw2rE4Zjhde4v0CTn52LioGWJPhC3y0nMHSDPXevFoJNIxWILrtlaU4dlPB84L7YakbVrTMa38cKJjW9wlyvn7p2Dpyfq4LFNGdW0BwKBgQD25Ni9Mo4m4vt00K6JY0Rz/gx4xeAID+TRgHAOxs4PFb5OQid7lCJjHOUQwKKfN2r+E1jlO+HKade8Ghl4bP3YoSqLhCUdUZLzUqNR5HY52nVP3ff8PfgqFT3LJWISM1AcaWMfG90Uw0jKih4jop2atI1hl6PKsNOuxvpFOmNWswKBgD5XqunXcRQmwyzaP2IF8Jor2+7LpOz64nb4ulHUoHWD9TqThhie28DqSbykGIcLkWdczARzuawf1tvo/gaIm1ip4Fsij3SZKiYAP+8dT/f8iD4YGRFSnRnvhRc6B6P89EynFa98vXYBrEGmZTn+rIIGBFwJKm5mbVZoXtCZ6/E9AoGBAPUMSI7omazBByF3anSUYUHbOle41lZKKCtEFnSkH6tbQmp8QKHocoT7DeQlvoLWx0vsugOz/rQff2+EXBlp3D3iIM8e1pOV/ouhTtaeMjXTvTILNvJWM3TZZl61+PPlmDLK6wXaawELnrjgg2+NHG6Lm/PsRTaNcVz8wzRo8mX/AoGAB1PkrrXatEY19WtMPM/VhBc7KA8Qdqa3EwMKNwH+ypUIjz5QqE76kQq5oK05Hz8IhM+Wd0akS2V9Rjb6hFxgbTsc2GsKOgBhKGPSNXVau5AzOi0zam3KxFZuorNuWrBFBrYN/pHWbygkC5eY6MXvlzevCCsCD7xGzbJWM700tqA=
-----END RSA PRIVATE KEY-----
`;


// Function that performs the decryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function decrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  eventLog = ""
  intercept = null // null: follow proxy configuration, true: force interception, false: does not intercept
  
  // If the endpoint is /handshake return the original request
  if (url.includes("https://crypto-stripper-playground.local:3000/handshake")) {
    return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog, intercept]
  }

  var jsonBody = JSON.parse(body);

  // Decrypt using the generated private key
  let password = Buffer.from(jsonBody.password, "base64");
  let username = Buffer.from(jsonBody.username, "base64");

  let decParams = {
    key: GENERATED_PRIVATE_KEY,  // Generated private key
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  };

  let decPassword = crypto.privateDecrypt(decParams, password).toString();
  let decUsername = crypto.privateDecrypt(decParams, username).toString();

  // Generate the new body with the decrypted data
  body = JSON.stringify({ username: decUsername, password: decPassword });

  return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog, intercept]
}


// Function that perform encryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function encrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  eventLog = ""

  // If the endpoint is /handshake return the original request
  if (url.includes("https://crypto-stripper-playground.local:3000/handshake")) {
    return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog, intercept]
  }

  var jsonBody = JSON.parse(body)

  var username = Buffer.from(jsonBody.username)
  var password = Buffer.from(jsonBody.password)

  // Read the original key
  var originalPublicKey = fs.readFileSync("originalKey").toString()

  // Encrypt using the original public key
  var encParams = {
    key: originalPublicKey,  // original public key
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  };

  var username = crypto.publicEncrypt(encParams, username).toString("base64")
  var password = crypto.publicEncrypt(encParams, password).toString("base64")

  console.error(username)

  // Generate the new body
  body = JSON.stringify({username: username, password: password})

  return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog];
}


// DON'T TOUCH THIS
function printJSON(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog=null, intercept=null) {
  console.log(
    Buffer.from(
      JSON.stringify(
        {
          body: body,
          headers: headers,
          urlParameters: urlParameters,
          statusCode: statusCode,
          reasonPhrase: reasonPhrase,
          httpMethod: httpMethod,
          path: path,
          version: 3,
          host: host,
          port: port,
          secure: secure,
          eventLog: eventLog,
          intercept: intercept
        }
      )
    ).toString("base64")
  )
}

async function main() {
  console.error(process.argv[2])
  var jsonData = JSON.parse(fs.readFileSync(process.argv[2]).toString())

  var body = jsonData.body
  var headers = JSON.parse(jsonData.headers)
  var urlParameters = JSON.parse(jsonData.urlParameters)
  var url = jsonData.url
  var messageId = jsonData.messageId
  var statusCode = jsonData.statusCode
  var reasonPhrase = jsonData.reasonPhrase
  var httpMethod = jsonData.httpMethod
  var path = jsonData.path
  var source = jsonData.toolSource
  var host = jsonData.host
  var port = jsonData.port
  var secure = jsonData.secure

  if (jsonData.action == "encrypt") {
    var enc = await encrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source)
    printJSON(...enc)
  } else {
    var dec = await decrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source)
    printJSON(...dec)
  }
}

main()
