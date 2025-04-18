var express = require("express")
var CryptoJS = require("crypto-js")
var bodyParser = require("body-parser")

var app = express()

const PORT = 3000


function decryptAES(enc, key) {
    let dec = CryptoJS.AES.decrypt(enc, key).toString(CryptoJS.enc.Utf8);
    return dec
}

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/random", function(req, res) {
    let key = req.headers["x-key"];
    console.log(req.body)
    let password = req.body.password
    res.json({dec: decryptAES(password, key)})
});

app.post("/signed", function(req, res) {
    let h1 = req.headers["x-key"];
    let signature = req.headers["x-signature"];
    let body = JSON.stringify(req.body)

    let combined = h1 + "S3cr37" + body;
    console.log(combined)

    let calculated = CryptoJS.SHA256(combined).toString();

    if (calculated !== signature) {
        res.status(500).send("error")
    } else {
        res.send({status:"OK"})
    }

});

app.get("/enumeration", function(req, res) {
    let key = "supersecretkey";
    let username = req.query["username"];
    console.log(username);

    if (decryptAES(username, key) == "test") {
        res.send({message: username})
    } else {
        res.status(400).send({message: "user not found"})
    }
});

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
});
