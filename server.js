var express = require("express")
var CryptoJS = require("crypto-js")
var bodyParser = require("body-parser")
const crypto = require('crypto');

var app = express()

const PORT = 3000

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAjdOObM7SZbfGpwn+wL0Teb15AvNEro4Cw5VjIr8Wepj0Z/2h
cNyC118OYeGiirZvZsZh1USuaHA4SwJUZ+RrZw4kMbPkBle7foeHbJ7LwKHCNzXq
G6kWFYu9UqX3wtsXbSuibWzH4iIfqEnK+/UUdd1N0BvQGJr4fdrqDAAwVsNHtjvZ
+BGDdIcMe7z8BzgUjRFNKyMxuW+EWg1e5Ab6uKFBKv0Ovzyvz3a0zUcGEOmAXwp/
mqRco5rstAgevvbaMqkr/cqUaWJzhdpSbRX68EIeiTyJxOCZKwa0GIxLFdLmj4W7
c0fNwyXNozYoQDfKVmuJXSTY1bU6km+bmSc7SwIDAQABAoIBADgp/C/oo3c2lMuX
cLQg7DJ8rwxVC/DYOg37/btH0v4PzlHUJfeMy5/Ae/CVKwolfu5DR4DuZubi8df6
fzR5R3MTLZAlPfqpCY3s29tO8z9Aj6nPhvsXNbComvu8z+XxX1CTRApzVqCdhM3f
Eyw9/LFER0lPilQEIr2sUJ0aAgqJSbn2tLMmZW6mD47NzF7avtuFOG0ExfD6WEEA
LsSFNoEeQ2dMI/yg2H2RNG58yMZYr4IJ96tOlyEWCHqFLKKXlxk2XpRxUjNXbmgX
hyLZhx0DRGYPa40/13IiDGpS22KuzNGJQ1hApoe6sCFm+MEYutnv7uVd8P+GIrnR
rfW4SIkCgYEAxdZI1K82xlI1TeAxO6ryxAVvrQS3BVTWTxiZW2KFpNkryT0Bdbuk
Pl+kgyTW8k1NBYGFL+CNRA2/1IVrT1LexOP4GAi2qeCnlXujhjmFLbaD6U4fT0Y9
8KgL7NmtFn9FqOs7z6Bcpi1xby27Zsw+qHcn4ycv8OQnQccf74gR6zcCgYEAt4XE
u3bFNbiId8kYIkicVmVxJ4z3cYMqBNb/Ks6Sne0QR1B6rDEhGPt8/SeuWxbb1ncK
A7Zb7DDWUJGri6YrxlkfiXL5ClG2V55DZEfW5T+3gZg7YvM70cDSaNLoa9c/bcFE
scd06EYjtwvk+DKM6kCdMjebBZSLteWnZ5O/wo0CgYEAj4ogIaBW/6GZ5zzou8AW
j77Z/hDTsdyR+aWBb1qWWLrxF/tZWdChJFhEhppuEjOf1ITa25fzJxNKwalj6JPZ
6cT1topr7el/7eddCAAn7rjkEJyL/vqZ6kgjDuAIw6/oHN0/8i8JydBi4yWtOLKs
K5L4r8k48XC4QvN06lgxmBUCgYAlUQ/1xmrHR6SIJt2/auBPOQVPM3zFGhSbM1Rj
UenCLwgWWCj5hmvidpCtsTnkz7sX2tCwfI4ocq3BaD1ngfx4snqVKkm1bXQUUNwH
MgxiRRh9Q4Uf07GgLwMZyXj1JKmDGb9sHtCIwmpUuBhw12aL42OTaHcfJVtbOz1U
9FgTqQKBgQCczR+fzSTjq3+D4xxzbeAbuulMDOSIeyI4y7o859MeJyLRlKhtiqU1
VRGjPAXpqiQAxTHUZiSpsXtAtigd+7+u6vxUkhyXJWmvkMHPxdBC2q3Pta+I0vYE
5BvC8+0Ev+LXJhphq56YcX2h8oh1L6rS1hrbQZjNYsl+xeCppGUIww==
-----END RSA PRIVATE KEY-----
`
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjdOObM7SZbfGpwn+wL0T
eb15AvNEro4Cw5VjIr8Wepj0Z/2hcNyC118OYeGiirZvZsZh1USuaHA4SwJUZ+Rr
Zw4kMbPkBle7foeHbJ7LwKHCNzXqG6kWFYu9UqX3wtsXbSuibWzH4iIfqEnK+/UU
dd1N0BvQGJr4fdrqDAAwVsNHtjvZ+BGDdIcMe7z8BzgUjRFNKyMxuW+EWg1e5Ab6
uKFBKv0Ovzyvz3a0zUcGEOmAXwp/mqRco5rstAgevvbaMqkr/cqUaWJzhdpSbRX6
8EIeiTyJxOCZKwa0GIxLFdLmj4W7c0fNwyXNozYoQDfKVmuJXSTY1bU6km+bmSc7
SwIDAQAB
-----END PUBLIC KEY-----`;

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

app.post("/asymmetric", function(req, res) {
    let password = Buffer.from(req.body.password, "base64");

    let dec = crypto.privateDecrypt({key: PRIVATE_KEY, padding:crypto.constants.RSA_PKCS1_PADDING}, password).toString();

    res.send({dec: dec});
});

app.post("/handshake", function(req, res) {
    res.send({publicKey: PUBLIC_KEY});
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
