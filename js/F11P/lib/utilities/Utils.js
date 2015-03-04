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
    }

});
// window.Utils = new $utils();