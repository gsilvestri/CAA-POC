//const request = require('request-promise');
var DEV_APU_URL = "https://api.kapunode.net";

var KapuFacade = window.KapuFacade = function () {
    this.getNetHash = function (successCallback) {
        var nethash;
        $.ajax({
            url: DEV_APU_URL + "/api/blocks/getStatus",
            data: {},
            dataType: "json",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "os": "linux3.2.0-4-amd64",
                "version": "0.3.0",
                "port": 1,
                "nethash": "wrong-nethash"
            },
            success: function (data) {
                if (true === data.success) {
                    nethash = data.nethash;
                    successCallback(nethash);
                } else {
                    alert('Error retrieving nethash');
                }
            }
        });
    };

    this.sendTrx = function (recipientId, amount, vendorField, passphrase, successCallback, failCallback) {

        //kapuJS.crypto.setNetworkVersion(kapuJS.networks.devnet.pubKeyHash);
        var transactionRequest = {};
        transactionRequest['transactions'] = [];
        var transaction = kapuJS.transaction.createTransaction(recipientId, amount, vendorField, passphrase, '');
        transactionRequest['transactions'].push(transaction);

        /*
        var transactionsResponse = request({
            url: DEV_APU_URL + "/api/v2/transactions",
            json: transactionsRequest,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "os": "linux3.2.0-4-amd64",
                "version": "2.0.0",
                "port": 9701,
                "nethash": "a28cfbd5475471d9c23186976b17a482138de2c6edfc7daf0919a159d2c524e6"
            }
        });
        console.log('Transactions Response: ' + JSON.stringify(transactionsResponse, null, 4));
        */
        var run = function (nethash) {
            $.ajax({
                url: DEV_APU_URL + "/api/v2/transactions",
                data: JSON.stringify(transactionRequest),
                dataType: "json",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "os": "linux3.2.0-4-amd64",
                    "version": "2.0.0",
                    "port": 9701,
                    "nethash": nethash
                },
                success: successCallback,
                fail: failCallback
            });
        };
        this.getNetHash(run);
    };
};
