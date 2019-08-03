function getKapuMapWatermark() {
    L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');
            img.src = './img/map-logo.png';
            img.style.width = '60px';
            img.style['margin-bottom'] = '-18px';
            return img;
        },
        onRemove: function(map) {
            // Nothing to do here
        }
    });

    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    };
}

function showMap(map, coords, infos) {

    map.setView(coords, 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            /*attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',*/
            id: 'mapbox.streets'
    }).addTo(map);

    L.marker(coords).addTo(map).bindPopup(infos);

    /*
    L.circle(geo[51.508, -0.11], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
    }).addTo(map).bindPopup("I am a circle.");

    L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
    ]).addTo(map).bindPopup("I am a polygon.");


    var popup = L.popup();

    function onMapClick(e) {
            popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
    }

    map.on('click', onMapClick);
    */
}

function fromTrx(map, trxID ='834e0c2c72e6771944fd9d8bab20e623f6d766856e22c048aa863c545aa1b655') {
    $.get(
        'https://api.kapunode.net/api/transactions/get?id='+trxID,
        {
            nethash:'a28cfbd5475471d9c23186976b17a482138de2c6edfc7daf0919a159d2c524e6',
            version: '2.0.0',
            port: '9701'
        }
    ).done(
        function(data){
            console.log(JSON.stringify(data));
            //showMap(map, [51.508, -0.11]);
            var tmp = new KapuTxTrack();
            tmp.parse(data.transaction.vendorField);
            var coords = tmp.get('coords').slice(0,2);
            var txt = tmp.get('infos');
            showMap(map, coords, txt);
        }
    );
}

function fromVendor(map, vendorSearch='geo%') {
    var like = '';
    if(! vendorSearch.startsWith('geo%')){
        like = 'geo%';
    }
    like += vendorSearch + ((!vendorSearch.endsWith('%'))?'%':'');
    $.get(
        'https://dev.api.kapunode.net/api/transactions?vendorField='+like,
        {
            nethash:'f1ef11be7a879671b3019a785c9a2c9dbd9d800b05644d26ad132275ffe2dd48',
            version: '1.0.1',
            port: '4001'
        }
    ).done(
        function(data){
            console.log(JSON.stringify(data));
            //showMap(map, [51.508, -0.11]);
            
            if(typeof data.transactions === 'object'){
                for(var i=0; i<data.transactions.length; i++){
                    var tmp = new KapuTxTrack();
                    tmp.parse(data.transactions[i].vendorField);
                    var coords = tmp.get('coords').slice(0,2);
                    var txt = tmp.get('infos');
                    showMap(map, coords, txt);
                }
            }
            /*var tmp = new KapuTxTrack();
            tmp.parse(data.transaction.vendorField);
            var coords = tmp.get('coords').slice(0,2);
            var txt = tmp.get('infos');
            showMap(map, coords, txt);*/
        }
    );
}

function fromGeoJSON(map){
    var geoson_url = 'https://raw.githubusercontent.com/garynobles/data/master/sites.geojson';
    $.getJSON(geoson_url,{}).done(
        function(data){
            L.geoJSON(
                data
                ,{
                    onEachFeature: function(feature, layer) {
                        var popupContent =  "<table class=\"featureTable\">" +
                                            "<tr><td><b>ID</b></td><td>"+feature.properties.id+"</td></tr>"+
                                            "<tr><td><b>Site</b></td><td>"+feature.properties.site_name+"</td></tr>"+
                                            "<tr><td><b>Period</b></td><td>"+feature.properties.period+"</td></tr>"+
                                            "<tr><td><b>Type</b></td><td>"+feature.properties.site_type+"</td></tr>"+
                                            "</table>";
                        layer.bindPopup(popupContent);
                    }
                }
            ).addTo(map);
        }
    );
}

function showValidatorResult(ktt, txTextValidator, txTextValidatorResult){
    txTextValidatorResult.html('');
    ktt.parse( txTextValidator.val() );

    var html = '';
    if( 'Array'===typeof ktt.get('coords') || 'object'===typeof ktt.get('coords') ){
        html += '<b>Coordinates:</b>'+JSON.stringify(ktt.get('coords'))+'<br/>';
    }
    if( 'string'===typeof ktt.get('infos') ){
        html += '<b>Infos:</b>'+JSON.stringify(ktt.get('infos'))+'<br/>';
    }

    txTextValidatorResult.html( html );
}
