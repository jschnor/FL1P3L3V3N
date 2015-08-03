Class(function SiteDevice() {
    
    var _self = this;
    
    // implementation for device specific functionality relating to the site
    (function () {
        
    })();

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
                // break;
            
            case 'image':
                _extension = '.'+type;

                return Config.PROXY + 'images/'+filename+_extension;
                // break;
            
            case 'pdf':
                _extension = '.'+type;

                return Config.PROXY + 'pdf/'+filename+_extension;
                // break;
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
    
}, 'static');