let titles = {
    "asymmetric": "Asymmetric encryption",
    "random": "Symmetric encryption",
    "signature": "Request signature",
    "enumeration": "Using external tools",
    "client-side": "Client-side validation bypass"
}

let descriptions = {
    "asymmetric": `Here the login credentials are encrypted using 
    asymmetric encryption <b>RSA</b> with a dynamic public key
    (that can change at any request) returned by the server.
    <br>
    <a target="_blank" href="https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-asymmetric-encryption">Documentation</a>`,

    "random": `Here the login credentials are encrypted using
    symmetric encryption with a random per request generated key.
    The key is shared with the server in a custom header.
    <b>Server's response is encrypted with the same random key</b>
    <br><a href="#">Documentation.</a>`,

    "signature": `Not all requests are "protected" by encryption only
    some developers sign their requests (in the front of course)
    <br><a href="#">Documentation</a>`,

    "enumeration": `<i>Crypto Stripper</i> not only can be used to leverage
    burp's own tools, but it can be used with external tools like fuzzers, 
    SQLMap and your own scripts.
    <br>
    Your mission here is to find the user
    <br><a href="#">See bypass</a>`,

    "client-side": `Sometimes you just need to bypass client-side validations.
    But the developers are way smarter that any attacker and server responses
    are encrypted...
    <br>
    Only a selected few can access the secret. Can you?
    <br>
    <a href="">See bypass</a>
    `
}

const functions = {
    "asymmetric": asymmetric,
    "random": randomKey,
    "signature": signature,
    "enumeration": enumeration,
    "client-side": clientSide
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
        body: JSON.stringify(
            {username: encUser,
                password: encPass,
                source: "2"
            })
    })

    let response = await request.text();

    let decrypted_response = CryptoJS.AES.decrypt(response, key).toString(CryptoJS.enc.Utf8)

    document.getElementById("response").innerText = decrypted_response

}

function signature(username, password) {
    let key = "S3cr37";
    let random = CryptoJS.lib.WordArray.random(10).toString()
    let body = JSON.stringify({
        username: username,
        password: password,
        source: "2"
    });

    let toBeSigned = random + key + body;

    let signature = CryptoJS.SHA256(toBeSigned).toString();

    fetch("signed", {
        method: "post",
        headers: {
            "x-key": random,
            "content-type": "application/json",
            "x-signature": signature
        },
        body: body
    })
}

function enumeration(username) {
    let key = "supersecretkey";
    let enc = CryptoJS.AES.encrypt(username, key).toString()
    fetch(`enumeration/?username=${enc}`,{
        method:"get"
    }
    )
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
    let code = await request.status;

    if (code == 500) {
        document.getElementById("response").innerHTML = "Error"
    } else {
        document.getElementById("response").innerHTML = "Nice :)"
    }
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
    document.getElementById("selectiontitle").innerHTML = title;
    document.getElementById("description").innerHTML = description;
    document.getElementById("response").innerText = ""
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""
}
