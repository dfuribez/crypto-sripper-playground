// Crypto Stripper
// Examples: https://github.com/dfuribez/crypto-stripper/wiki#examples

let fs = require("fs");
let CryptoJS = require("crypto-js");


// Function that performs the decryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function decrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  // addIssue("name", "details", "remediation", "background", "remediation background")
  // setAnnotation(color.NONE, "Add your annotations here")
  eventLog = ""
  intercept = null // null: follow proxy configuration, true: force interception, false: does not intercept

  // Retrieves the key
  let xKeyHeader = headers.find(h => h.toLowerCase().startsWith("x-key:"))
  console.error(xKeyHeader)
  let key = xKeyHeader.split(": ")[1]
  console.error(key);
  let jsonBody = JSON.parse(body)
  
  // Decrypt the parameters with the key
  jsonBody.username = CryptoJS.AES.decrypt(
    jsonBody.username, key).toString(CryptoJS.enc.Utf8)
  jsonBody.password = CryptoJS.AES.decrypt(
    jsonBody.password, key).toString(CryptoJS.enc.Utf8)

  // Stringify the new body
  body = JSON.stringify(jsonBody)
  console.error(messageId)

  return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog, intercept]
}



// Function that perform encryption
// Learn more: https://github.com/dfuribez/crypto-stripper/wiki/Stripper-scripts
async function encrypt(body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, url, messageId, source) {
  console.error("only use console.error to debug")
  console.error("the use of console.log will cause the process to fail")

  // addIssue("name", "details", "remediation", "background", "remediation background")
  // setAnnotation(color.GREEN, "Add your annotations here")
  eventLog = ""

  // Retrieve the key
  let xKeyHeader = headers.find(h => h.toLowerCase().startsWith("x-key:"))
  let key = xKeyHeader.split(": ")[1]

  let jsonBody = JSON.parse(body)
  
  // Encrypt with the same key
  jsonBody.username = CryptoJS.AES.encrypt(
    jsonBody.username, key).toString()
  jsonBody.password = CryptoJS.AES.encrypt(
    jsonBody.password, key).toString()
  
  // Save the key for later use in the response script
  saveKey(key, messageId)
  // Stringify the new body
  body = JSON.stringify(jsonBody)
    console.error(messageId)

  setAnnotation(color.GREEN, "Decrypted request")

  return [body, headers, urlParameters, httpMethod, host, port, secure, path, statusCode, reasonPhrase, eventLog];
}

function saveKey(key, messageId) {
  let keys = JSON.parse(fs.readFileSync("keys"))
  keys[messageId] = key
  fs.writeFileSync("keys", JSON.stringify(keys))
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
          version: 5,
          host: host,
          port: port,
          secure: secure,
          eventLog: eventLog,
          intercept: intercept,
          issue: issue,
          annotation: annotation
        }
      )
    ).toString("base64")
  )
}

let issue = null
let annotation = null

const color = {
  BLUE: "BLUE",
  CYAN: "CYAN",
  GRAY: "GRAY",
  GREEN: "GREEN",
  MAGENTA: "MAGENTA",
  NONE: "NONE",
  ORANGE: "ORANGE",
  PINK: "PINK",
  RED: "RED",
  YELLOW: "YELLOW"
}

function addIssue(name, detail, remediation, background, remediationBackground){
  issue = {}
  issue.name = name
  issue.detail = detail
  issue.remediation = remediation
  issue.background = background
  issue.remediationBackground = remediationBackground
}

function setAnnotation(color, note) {
  annotation = {}
  annotation.color = color
  annotation.note = note
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
