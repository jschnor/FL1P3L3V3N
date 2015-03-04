(function(){
    $.fn.bg = function(background) {
        var _self = this;

        if (!background){
            background = '#ffffff';
        }
        
        var _bg = background;
        var _ext = _bg.slice(-4);

        var _isImage = _ext.substring(1, -1) == '.' ? true : false;

        if (_isImage) {
            _self.div.style.backgroundImage = 'url(' + _bg + ')';

        } else {
              _self.div.style.backgroundColor = background;
        }
        
        return _self;
    };

    // apply an image background
    // @param object params {
    // url: string  the URL of the image (required),
    // preloaded: boolean  whether to use the preloaded asset (default true),
    // repeat: string  css background-repeat value,
    // pos: string  css background-position value,
    // size: string  css background-size value
    // }
    $.fn.imgbg = function(params){
        var _self = this;
        
        // check for repeat or set default
        if (typeof params.repeat != 'string'){
            params.repeat = 'no-repeat';
        }

        // check for position or set default
        if (typeof params.pos != 'string'){
            params.pos = 'center center';
        }

        // check for size or set default
        if (typeof params.size != 'string'){
            params.size = 'auto';
        }

        // check if we should retrieve from preloaded
        if (typeof params.preloaded != 'boolean'){
            params.preloaded = true;
        }

        if (params.preloaded === true){
            var img = Utils.getImg(params.url);
            params.url = img.div.src;
        }

        _self.setProps({
            backgroundImage: 'url("'+params.url+'")',
            backgroundRepeat: params.repeat,
            backgroundPosition: params.pos,
            backgroundSize: params.size
        });

        return _self;
    };
})();