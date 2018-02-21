// ADDRESS [1]: ZJn3Fjy5KNqsnEf9uCVhYNrj2CqzGikUK1
// PWD:     hood initial mass heart tone monkey jungle armor jealous comic access fiber

// ADDRESS [2]: ZVDmNWB32n5oEj1gFm5HLbxcGfwPezPRJc
// PWD:     glance visa divorce clay drink chief amount advance join impose inspire tunnel

var DEV_APU_URL = "https://dev.api.kapunode.net";

var KapuFacade = window.KapuFacade = function() {
    this.getNetHash = function(successCallback) {
        var nethash;
        $.ajax({
            url: DEV_APU_URL+"/api/blocks/getNetHash",
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
            success: function(data) {
                if(true===data.success){
                    nethash = data.nethash;
                    successCallback(nethash);
                } else {
                    alert('Error retrieving nethash');
                }
            }
        });
    };

    this.sendTrx = function(recipientId, amount, vendorField, passphrase, successCallback, failCallback) {
        //var amount      = 1000 * Math.pow(10, 8); // 100000000000
        kapuJS.crypto.setNetworkVersion(kapuJS.networks.devnet.pubKeyHash);
        var transaction = kapuJS.transaction.createTransaction(recipientId, amount, vendorField, passphrase, '');
        //var nethash='f1ef11be7a879671b3019a785c9a2c9dbd9d800b05644d26ad132275ffe2dd48'; //https://dev.api.kapunode.net/api/blocks/getNetHash

        var run = function(nethash) {
            $.ajax({
              url: DEV_APU_URL+"/peer/transactions/",
              data: JSON.stringify({ transactions: [transaction] }),
              dataType: "json",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "os": "linux3.2.0-4-amd64",
                "version": "0.3.0",
                "port": 1,
                "nethash": nethash
              },
              success: successCallback,
              fail: failCallback
            });
        };

        this.getNetHash(run);
    };
};
