Static(function Utils() {
    
    var _self = this;

    this.lerp = function(ratio, start, end) {
        return start + (end - start) * ratio;
    }
    
    this.rand = function(min, max) {
        return this.lerp(Math.random(), min, max);
    }
    
    this.doRandom = function (min, max) {
        return Math.round(this.rand(min - 0.5, max + 0.5));
    };
    
    this.timestamp = function () {
        var _timestamp = Date.now() + _self.doRandom(0, 99999);
        return _timestamp.toString();
    }

    this.convertToPX = this.convertToPx = function(number) {
        
        var _pixelvalue;

        if (typeof number == 'string' && number.slice(-2) != 'px') {

            _pixelvalue = number + 'px';
        }
        if (typeof number == 'string' && number.slice(-2) != 'px') {
            _pixelvalue = number;
        }
        
        if (typeof number != 'string') {

            _pixelvalue = number + 'px';

        }

        return _pixelvalue;
         
    };

    this.convertToDeg = function(number) {
        
        var _degreevalue;
        // console.log(number);
        // console.log(number.slice(-2))
        if (typeof number == 'string' && number.slice(-3) != 'deg') {

            _degreevalue = number + 'deg';
        }
        if (typeof number == 'string' && number.slice(-3) != 'deg') {
            _degreevalue = number;
        }
        
        if (typeof number != 'string') {

            _degreevalue = number + 'deg';

        }

        return _degreevalue;
         
    };

    this.nullObject = function(obj) {
        if (obj.destroy) {
            for (var f in obj) {
                if (typeof obj[f] !== "undefined") {
                    obj[f] = null;
                }
            }
        }
        return null;
    };

    this.capFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    this.getAsset = function(filename, type) {

        var _extension;
        var _asset;

        switch(type) {
            case 'video':

                if (Device.browser.chrome) { _extension = '.mp4'; }
                if (Device.browser.firefox) { _extension = '.webm'; }
                if (Device.browser.safari || Device.browser.ie) { _extension = '.mp4'; }
                if (Device.mobile) { _extension = '.mp4'; }

                return Config.PROXY + 'videos/'+filename+_extension;
            
            case 'image':
                
                _extension = '.'+type;

                return Config.PROXY + 'images/'+filename+_extension;
            
            case 'pdf':
                
                _extension = '.'+type;

                return Config.PROXY + 'pdf/'+filename+_extension;
            
        }

    };

    // get an image from the preloaded set
    this.getImg = function(path){
        var imgobj;
        for (var idx = 0; idx < Config.LOADED.length; idx++){
            if (Config.LOADED[idx].id == path){
                imgobj = Config.LOADED[idx].img;
            }
        }

        return imgobj;
    };

    this.urlstr = function(string){
        var str = string.replace(/ /g, "-").toLowerCase();
        var _str = str.replace(/:/g, "");

        return _str;
    };

    // TODO: write support for POST method
    this.ajax = function(url, params, method, callback) {
        var _method = 'GET';
        if (typeof method == 'string'){
            _method = method;
        }

        var _url = '/response.php';
        if (typeof url == 'string'){
            _url = url;
        }

        if (typeof params == 'object'){
            var query = '?';
            var parts = [];

            for (var key in params){
                if (params.hasOwnProperty(key)){
                    // console.log(key);
                    // console.log(params[key]);
                    parts.push(key + '=' + encodeURIComponent(params[key]));
                }
            }

            query += parts.join('&');
            // console.log(query);

            _url += query;
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 ) {
                if (xhr.status == 200){
                    // OK
                    if (typeof callback == 'function'){
                        callback(xhr.responseText);
                    }

                } else if(xhr.status == 400) {
                    throw Error('400');
                } else {
                    throw Error('AJAX Request failed');
                }
            }
        }

        xhr.open(_method, _url, true);
        xhr.send();
    };

    this.COOKIE = {
        // get the value of a cookie
        // @param sKey string  the name of the cookie to get
        get: function (sKey){
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },

        // set the value of a cookie
        // @param sKey string  the name of the new cookie
        // @param sValue string  the value of the new cookie
        // @param vEnd integer  the maximum age of the cookie in seconds
        // @param sPath string  the path the cookie is readable from
        // @param sDomain string  the domain the cookie is readable from
        // @param bSecure boolean  whether to use https
        set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }

            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;

                    case String:
                    sExpires = "; expires=" + vEnd;
                    break;

                    case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
                }
            }

            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },

        // remove/delete a cookie
        // @param sKey string  the name of the cookie
        // @param sPath string  the path the cookie is readable from
        // @param sDomain string  the domain the cookie is readable from
        remove: function (sKey, sPath, sDomain) {
            if (!this.exists(sKey)) { return false; }

            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },

        // check if a cookie exists
        // @param sKey string  the name of the cookie
        exists: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },

        // get a list of all set cookies as an array
        list: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

});