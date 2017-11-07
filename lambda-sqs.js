'use strict';

const AWS = require('aws-sdk');

const SQS_URL = 'https://sqs.REGION.amazonaws.com/ACCOUNT_NUMBER/SQS_NAME';

AWS.config.update({
    accessKeyId: 'KEY_ID',
    secretAccessKey: 'ACCESS_KEY'
});
let sqs = new AWS.SQS({
    region: 'us-west-2'
});

function processEvent(event, context, callback) {

    function processMessage() {        
        console.info('Received Event', event)

        let params = {
            MessageBody: JSON.stringify(event.body),
            QueueUrl: SQS_URL
        };

        sqs.sendMessage(params, function(error, data) {
            if (error) {
                console.error('Fail to send message' + error);
                return buildCallback(500, error);
            } else {
                console.info('Message sent successfully:', data.MessageId);
                return buildCallback(200, 'Ok');
            }
        });
    }

    function buildCallback(status, message) {
        let response = {
            statusCode: status,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                statusCode: status,
                message: message
            })
        }

        callback(null, response);
    }

    processMessage();
}

exports.handler = (event, context, callback) => {
    processEvent(event, context, callback);
};