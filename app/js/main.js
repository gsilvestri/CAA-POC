$( document ).ready(function() {

    $('#tabsCtrl a[href="#geoTab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    getKapuMapWatermark(); //init watermark
    var map = window.kapuMap = L.map('mapid');
    L.control.watermark({ position: 'bottomleft' }).addTo(map);
    var trxMapDiv = window.trxMapDiv = L.map('trxMapDiv');
    L.control.watermark({ position: 'bottomleft' }).addTo(trxMapDiv);
    var trxSearchMap = window.trxSearchMap = L.map('trxSearchMap');
    L.control.watermark({ position: 'bottomleft' }).addTo(trxSearchMap);

    trxMapDiv.on('locationfound ',function(_event){
        $('#f_Longitude').val( (_event.longitude+'000000000000').substr(0,12));
        $('#f_Latitude').val( (_event.latitude+'000000000000').substr(0,12));
        $('#f_Altitude').val( ('000000000000').substr(0,12));
        showMap(trxMapDiv, [_event.latitude, _event.longitude], "You are here");
    });

    var theMap = $('#mapid');
    fromTrx(map);
    fromGeoJSON(map);

    $('#viewTxCoords').click(function(){
        map.setView([51.508, -0.11], 10);
        var bg = $(this).css("background-color");
        theMap.css('border', '5px solid '+bg);
    });
    var bg = $('#viewTxCoords').css("background-color");
    theMap.css('border', '5px solid '+bg);

    $('#viewGeoJSONCoords').click(function(){
        map.setView([52.7655,4.9277], 10);
        var bg = $(this).css("background-color");
        theMap.css('border', '5px solid '+bg);
    });

    $('#viewZoomOut').click(function(){
        map.setZoom(6);
        var bg = $(this).css("background-color");
        theMap.css('border', '5px solid '+bg);
    });

    var txTextValidator = $('#txTextValidator');
    var txTextValidatorResult = $('#txTextValidatorResult');
    var ktt = new KapuTxTrack(txTextValidator.val());

    txTextValidator.bind('keyup', function(e) {
        showValidatorResult(ktt, txTextValidator, txTextValidatorResult);
    });

    showValidatorResult(ktt, txTextValidator, txTextValidatorResult);


    $( "#f_UseGeo" ).click(function() {
        $( "#useGeoPane" ).toggle( "slow", function() {
          // Animation complete.
        });
        $( "#trxMapDiv" ).toggle( "slow", function() {
          // Animation complete.
        });
    });


    $('#f_UseBrowserGeo').click(function(){
        if ("geolocation" in navigator) {
            trxMapDiv.locate();
        } else {
            /*geolocation IS NOT available */
            alert('Geolocation IS NOT available, check your browser\'s settings');
        }
    });

    $('#f_UpdateResult').click(function(){
        var geo='';
        var msg = $('#f_Message').val();

        if( $('#f_UseGeo').is(":checked")){
            var f_Latitude = ($('#f_Latitude').val()+'000000000000').substr(0,12);
            var f_Longitude = ($('#f_Longitude').val()+'000000000000').substr(0,12);
            var f_Altitude = ($('#f_Altitude').val()+'000000000000').substr(0,12);
            geo = 'geo'+f_Latitude+f_Longitude+f_Altitude;

            var tmp = new KapuTxTrack();
            tmp.parse(geo + msg );
            var coords = tmp.get('coords').slice(0,2);

            trxMapDiv.eachLayer(function (layer) {
                trxMapDiv.removeLayer(layer);
            });
            showMap(trxMapDiv, coords);
            trxMapDiv.setZoom(5);
        }

        $('#f_Result').val( geo + msg );
    });


    $('#f_SendTrx').click(function(){
        var amount = 0;
        var recipientId = $('#f_RecipientId').val();
        var vendorField = $('#f_Result').val();
        var passphrase = $('#f_SenderPWD').val();
        try{amount = parseFloat($('#f_Amount').val()) * Math.pow(10, 8);}catch(err){console.log('Error during amount\'s convertion::'+err);}

        if(amount < 1,00){
            alert('Amount must be greater or equal than 1.00');
            return;
        }

        if( 'string'!==typeof recipientId || recipientId.length!==34){
            alert('Recipient ID must be a string of 34 chars.');
            return;
        }

        var successCallback = function(data){
            console.log('TRX SUCCESS: '+JSON.stringify(data));
            if(false===data.success){
                alert('An error is occurred.');
            } else {
                alert('Transaction is successfull.');
            }
        };

        var failCallback = function(data){
            console.log('TRX FAILED: '+JSON.stringify(data));
            alert('Communication error.');
        };

        var kf = new KapuFacade();
        kf.sendTrx(recipientId, amount, vendorField, passphrase, successCallback, failCallback);  
    });
    
    $('#f_ViewTrx').click(function(){
        var trxID = $('#f_TrxSearcher').val();
        fromTrx(trxSearchMap,trxID);
    });

});
            