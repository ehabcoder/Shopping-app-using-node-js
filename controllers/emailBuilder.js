//batchSend.js
var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
    "sender": { "email": "ehabr518@gmail.com", "name": "Ehab" },
    "subject": "This is my default subject line",
    "htmlContent": "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
    "params": {
        "greeting": "This is the default greeting",
        "headline": "This is the default headline"
    },
    "messageVersions": [
        //Definition for Message Version 1 
        {
            "to": [{
                    "email": "ehabr518@gmail.com",
                    "name": "Ehab Reda"
                },
                {
                    "email": "ehabr518@gmail.com",
                    "name": "Ehab Reda"
                }
            ],
            "htmlContent": "<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
            "subject": "We are happy to be working with you"
        },
    ]

}).then(function(data) {
    console.log(data);
}, function(error) {
    console.error(error);
});