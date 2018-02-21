var KapuTxTrack=function(str){
    this.debug=true;
    this.log("Init KapuTxTrack");
    this.defaultParams={};
    this.params={};
    this.text=str;

    if( 'string'===typeof str){
        this.parse(str);
    }

    this.MAX_LEN = 64;
    this.GEO_LEN = 3 + 12 + 12 +12; // 39
    this.TXT_LEN = this.MAX_LEN - this.GEO_LEN;
    this.GEO_REGEX = new RegExp("^(geo(([+-]?\\d*(\\.\\d+)?){0,3}))$");
    //this.NUM_REGEX = new RegExp("^(\\d*(\\.\\d+)");

    return this;
};

KapuTxTrack.prototype.log=function(msg){
    if(this.debug===false){return;}
    if(typeof console!=="undefined"){console.log("[DEBU] - "+msg);}
};

KapuTxTrack.prototype.isValid=function(str){
    if( "string" !== typeof str ){
        this.log('isValid::Input is not a String');
        return false;
    }

    if( str.length > this.MAX_LEN ){
        this.log('isValid::Input is too long; length must be less or equal '+this.MAX_LEN);
        return false;
    }

    return true;
};

/*
Data format (64 bytes)
- geo (3 bytes)
- latitude (12 bytes)
- longitude (12 bytes)
- others: type ID, description, other useful informations... (37 bytes)
*/

KapuTxTrack.prototype.get=function(key){
    return this.params[key];
};

KapuTxTrack.prototype.parseGeo=function(str){
    if( ! this.isValid(str) ){
        return false;
    }

    if( str.length < this.GEO_LEN ){
        this.log('parseGeo::Input is too short');
        return false;
    }

    var tmp = str.toLowerCase().substr(0,this.GEO_LEN);
    var matches = tmp.match(this.GEO_REGEX);



    if ( matches===null ){
        this.log('parseGeo::Input is not in the right format');
        return false;
    } else {
        if( matches[0].length < this.GEO_LEN ){
            this.log('parseGeo::Input is too short');
            return false;
        }
        this.log('parseGeo::'+JSON.stringify(matches));
        this.log('parseGeo::latitude::'+tmp.substr(3,12));
        this.log('parseGeo::longitude::'+tmp.substr(15,12));
        this.log('parseGeo::altitude::'+tmp.substring(27));
    }

    try{
        this.params.coords = [
                parseFloat(tmp.substr(3,12)),
                parseFloat(tmp.substr(15,12)),
                parseFloat(tmp.substring(27))
        ];
    }catch(err){
        this.log('parseGeo::Cordinates are not numbers');
        return false;
    }

    return this.params.coords;
};

KapuTxTrack.prototype.parseInfos=function(str, geoIsPresent=true){
    if( ! this.isValid(str) ){
        return false;
    }

    if( str.length < this.GEO_LEN ){
        this.params.infos = str;
    }

    if( geoIsPresent!==false && str.toLowerCase().startsWith('geo') && str.length>=this.GEO_LEN) {
        this.params.infos = str.substring(this.GEO_LEN);
    } else {
        this.params.infos = str;
    }

    return this.params.infos;
};

KapuTxTrack.prototype.parse=function(str){
    try {
        delete this.params.coords;
        delete this.params.infos;
    }catch(err){}
    var geoIsPresent = this.parseGeo(str);
    this.parseInfos(str, geoIsPresent);
};
