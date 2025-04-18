function randomKey(username, pasword) {
    var key = CryptoJS.lib.WordArray.random(32).toString()
    var encUser = CryptoJS.AES.encrypt(username, key).toString()
    var encPass = CryptoJS.AES.encrypt(pasword, key).toString()

    fetch("random", {
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
}

function signature(username, password) {
    let key = "S3cr37";
    let random = CryptoJS.lib.WordArray.random(10).toString()
    let body = JSON.stringify(
        {
            username: username,
        password: password,
        source: "2"
    })

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

function login() {
    console.log("login")
}