// Crypto Stripper
// Examples: https://github.com/dfuribez/crypto-stripper/wiki#examples

let fs = require("fs");
let crypto = require("crypto");


// Function that performs the decryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function decrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  eventLog = ""
  intercept = null // null: follow proxy configuration, true: force interception, false: does not intercept
  
  return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog, intercept]
}


// Function that perform encryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function encrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  eventLog = ""

  // Get the random value
  let header = headers.filter(h => h.toLowerCase().startsWith("x-key:"))
  let xkeyValue = header[0].split(": ")[1]
  console.error("Random: " + xkeyValue)

  // Remove the header x-signature
  let signatureHeader = headers.find(h => h.toLowerCase().startsWith("x-signature:"))
  headers.splice(headers.indexOf(signatureHeader), 1)

  // Prepare the data to sign
  let toSign = xkeyValue + "S3cr37" + body

  console.error(toSign)

  // Calculate the new signature
  let newSignature = crypto.createHash("sha256").update(toSign).digest("hex")

  console.error("new signature: " + newSignature)

  // Set the header with the new signature
  headers.push("x-signature:" + newSignature)

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
