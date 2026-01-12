# Crypto Stripper Playground

This site implements multiple request/response encryption mechanisms to learn and test the Burp Suite [Crypto Stripper](https://github.com/dfuribez/crypto-stripper) extension.


## Running the site

```bash
cd server
node server.js
```

## Implementations

| Name  | Description | Scripts | Documentation |
| - | - | - | - |
|Asymmetric encryption| RSA encryption with the public key shared via a separate request. | [Scripts](https://github.com/dfuribez/crypto-sripper-playground/tree/master/solutions/asymmetric) | [Documentation](https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-asymmetric-encryption) |
| Symmetric encryption| AES encryption using a randomly generated key. | [Scripts](https://github.com/dfuribez/crypto-sripper-playground/tree/master/solutions/symmetric)| [Documentation](https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-symmetric-encryption) |
| Signature verification| Client-side request signing. |[Scripts](https://github.com/dfuribez/crypto-sripper-playground/tree/master/solutions/signature)| [Documentation](https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-signature-verification) |
| Client side validations | The application performs validations exclusively on the client side, trusting the result of an encrypted server response. |[Scripts](https://github.com/dfuribez/crypto-sripper-playground/tree/master/solutions/client-side)| [Documentation](https://github.com/dfuribez/crypto-stripper/wiki/Bypassing-client-side-validations) |
| User enumeration | A simple scenario designed to showcase the integration of external tools. |[Scripts](https://github.com/dfuribez/crypto-sripper-playground/tree/master/solutions/user-enumeration)| [Documentation](https://github.com/dfuribez/crypto-stripper/wiki/Using-automatic-and-external-tools) |
