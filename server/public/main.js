let titles = {
  asymmetric: "Asymmetric encryption",
  random: "Random KEY",
  signature: "Request signature",
  enumeration: "User enumeration",
  clientSide: "Client-side validation bypass",
};

let descriptions = {
  asymmetric: ``,
  random: ``,
  signature: ``,
  enumeration: ``,
  clientSide: ``,
};

let links = {
  asymmetric:
    "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-asymmetric-encryption",
  random:
    "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-symmetric-encryption",
  clientSide:
    "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-client-side-validations",
  enumeration:
    "https://github.com/dfuribez/crypto-stripper/wiki/Using-automatic-and-external-tools",
  signature:
    "https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-signature-verification",
};

const functions = {
  asymmetric: asymmetric,
  random: randomKey,
  signature: signature,
  enumeration: enumeration,
  clientSide: clientSide,
};

let endpoint = "";

async function randomKey(username, password) {
  var key = CryptoJS.lib.WordArray.random(32).toString();
  var encUser = CryptoJS.AES.encrypt(username, key).toString();
  var encPass = CryptoJS.AES.encrypt(password, key).toString();

  let request = await fetch("random", {
    method: "post",
    headers: {
      "x-key": key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: encUser,
      password: encPass,
      source: "2",
    }),
  });

  let response = await request.text();

  let decrypted_response = CryptoJS.AES.decrypt(response, key).toString(
    CryptoJS.enc.Utf8,
  );

  document.getElementById("response").innerText = decrypted_response;
}

async function signature(username, password) {
  let key = "S3cr37";
  let random = CryptoJS.lib.WordArray.random(10).toString();
  let body = JSON.stringify({
    username: username,
    password: password,
    source: "2",
  });

  let toBeSigned = random + key + body;

  let signature = CryptoJS.SHA256(toBeSigned).toString();

  let request = await fetch("signed", {
    method: "post",
    headers: {
      "x-key": random,
      "content-type": "application/json",
      "x-signature": signature,
    },
    body: body,
  });

  if (request.status == 200) {
    message = await request.text();
  } else {
    message = "server error";
  }

  document.getElementById("response").innerText = message;
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

async function asymmetric(username, password) {
  let handshakeQuery = await fetch("handshake", { method: "post" });
  let handshake = await handshakeQuery.json();
  let message;

  const encoder = new TextEncoder();

  if (handshake["publicKey"]) {
    try {
      var publicKey = await crypto.subtle.importKey(
        "spki",
        pemToArrayBuffer(handshake.publicKey),
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["encrypt"],
      );
      var user = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoder.encode(username),
      );
      var pass = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoder.encode(password),
      );
      const encUser = btoa(String.fromCharCode(...new Uint8Array(user)));
      const encPass = btoa(String.fromCharCode(...new Uint8Array(pass)));

      let body = { username: encUser, password: encPass };

      let request = await fetch("asymmetric", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let response = await request.json();
      message = response.response;
    } catch (err) {
      message = err;
    }

    document.getElementById("response").innerText = message;
  }
}

async function clientSide(username, password) {
  let request = await fetch("clientSide", { method: "post" });
  let code = request.status;

  let message;

  if (code != 200) {
    message = "Error, try again";
  } else {
    try {
      let response = await request.text();

      let username = CryptoJS.AES.decrypt(response, "supersecret").toString(
        CryptoJS.enc.Utf8,
      );

      if (username == "admin") {
        message = "Well done :)";
      } else {
        message = "not authorized :(";
      }
    } catch (err) {
      message = err.toString();
    }
  }
  document.getElementById("response").innerText = message;
}

async function enumeration(username, password) {
  let encUsername = encodeURIComponent(
    CryptoJS.AES.encrypt(username, "secret").toString(),
  );

  let request = await fetch(`/path/${encUsername}/login`);
  let response = await request.json();

  document.getElementById("response").innerText = response.message;
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

  let link = document.createElement("a");
  link.href = links[source];
  link.textContent = "Documentation.";
  link.target = "_blank";

  document.getElementById("selectiontitle").innerHTML = title;
  document.getElementById("description").innerHTML = description;
  document.getElementById("description").innerHTML = description;

  document.getElementById("link").innerHTML = "";
  document.getElementById("link").appendChild(link);

  document.getElementById("response").innerText = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function main() {
  const fragment = window.location.hash.slice(1);
  if (fragment) {
    selection(fragment);
  } else {
    selection("random");
  }
}
