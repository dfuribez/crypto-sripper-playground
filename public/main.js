let titles = {
  "asymmetric": "Asymmetric encryption",
  "random": "Random KEY",
  "signature": "Request signature",
  "enumeration": "Using external tools",
  "client-side": "Client-side validation bypass",
  "path": "Path segment"
}

let descriptions = {
  "asymmetric": ``,

  "random": `<br><a href="#">Documentation.</a>`,

  "signature": ``,

  "enumeration": `<i>Crypto Stripper</i> not only can be used to leverage
  burp's own tools, but it can be used with external tools like fuzzers, 
  SQLMap and your own scripts.
  <br>
  Your mission here is to find the user`,

  "client-side": ``,

  "path": ""
}

let links = {
  "asymmetric": "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-asymmetric-encryption",
  "random": "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-symmetric-encryption"
}

const functions = {
  "asymmetric": asymmetric,
  "random": randomKey,
  "signature": signature,
  "enumeration": enumeration,
  "client-side": clientSide,
  "path": path
}

let endpoint = "";

async function randomKey(username, password) {
  var key = CryptoJS.lib.WordArray.random(32).toString()
  var encUser = CryptoJS.AES.encrypt(username, key).toString()
  var encPass = CryptoJS.AES.encrypt(password, key).toString()

  let request = await fetch("random", {
    method: "post",
    headers: {
      "x-key": key,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: encUser,
      password: encPass,
      source: "2"
    })
  })

  let response = await request.text();

  let decrypted_response = CryptoJS.AES.decrypt(
    response, key).toString(CryptoJS.enc.Utf8)

  document.getElementById("response").innerText = decrypted_response
}

async function signature(username, password) {
  let key = "S3cr37";
  let random = CryptoJS.lib.WordArray.random(10).toString()
  let body = JSON.stringify({
    username: username,
    password: password,
    source: "2"
  });

  let toBeSigned = random + key + body;

  let signature = CryptoJS.SHA256(toBeSigned).toString();

  let request = await fetch("signed", {
    method: "post",
    headers: {
      "x-key": random,
      "content-type": "application/json",
      "x-signature": signature
    },
    body: body
  })

  if (request.status == 200) {
    message = await request.text()
  } else {
    message = "server error"
  }

  document.getElementById("response").innerText = message
}

function enumeration(username) {
  let key = "supersecretkey";
  let enc = CryptoJS.AES.encrypt(username, key).toString()
  fetch(`enumeration/?username=${enc}`,{
    method:"get"
  })
}

async function asymmetric(username, password) {
  let encrypt = new JSEncrypt()

  let handshakeQuery = await fetch("handshake", {method: "post"});
  let handshake = await handshakeQuery.json();
  let message;

  if (handshake["publicKey"]) {
    try {
      encrypt.setPublicKey(handshake["publicKey"]);

      let encUser = encrypt.encrypt(username)
      let encPass = encrypt.encrypt(password)

      let body = {username: encUser, password: encPass}

      let request = await fetch("asymmetric", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
      })

      let response = await request.json()
      message = response.response
    } catch (err) {
      message = err
    }

    document.getElementById("response").innerText = message
  }
}

async function clientSide(username, password) {
  let request = await fetch("clientSide", {method: "post"});
  let code = request.status;

  let message;

  if (code != 200) {
      message = "Error, try again"
  } else {
    try {
      let response = await request.json()
      let username = CryptoJS.AES.decrypt(
        response.username, "supersecret"
      ).toString(CryptoJS.enc.Utf8)
      if (username == "admin") {
        message = "Well done :)"
      } else {
        message = "not authorized :("
      }
    } catch (err) {
      message = err
    }
  }
  document.getElementById("response").innerText = message
}

async function path(username, password) {
  let encUsername = btoa(CryptoJS.AES.encrypt(username, "secret").toString())
  let encPassword = btoa(CryptoJS.AES.encrypt(password, "secret").toString())


  let request = await fetch(`/path/${encUsername}/${encPassword}/login`);
  let response = await request.json()

  document.getElementById("response").innerText = response
}

function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  functions[endpoint](user, pass);
}

function selection(source) {
  endpoint = source;
  let title = titles[source];
  let description = descriptions[source];

  let link = document.createElement("a")
  link.href = links[source]
  link.textContent = "Documentation."
  link.target = "_blank"

  document.getElementById("selectiontitle").innerHTML = title;
  document.getElementById("description").innerHTML = description;
  document.getElementById("description").innerHTML = description;

  document.getElementById("link").innerHTML = ""
  document.getElementById("link").appendChild(link)
  
  document.getElementById("response").innerText = ""
  document.getElementById("username").value = ""
  document.getElementById("password").value = ""
}
