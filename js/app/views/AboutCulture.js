Class(function AboutCulture(bgDiff){
    Inherit(this, View);

    var _self = this, _bgDiff = bgDiff, _elem, _bg, _content, _halftone;
    this.width = 1320;

    var _padding = 80;
    if (Stage.height < 700){
        this.width = Stage.height * 1.886;
        _padding = Stage.height * 0.114;
    }

    var _maxcontentwidth = _self.width - (_padding*3);

    (function () {
		_init();
        _addBg();
        _addContent();
    })();

    function _init(){
        //console.log("AboutCulture _init");
    	_elem = _self.element;
    	_elem.size(_self.width, Stage.height).bg(Config.COLORS.black).transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            outline: "1px solid transparent",
            // background: "url("+Config.IMAGES + "about/bg-culture.jpg)",
            // backgroundSize: "cover",
            // backgroundAttachment: "fixed"
        });
    }

    function _addBg(){
        _bg = _elem.create(".bg");
        _bg.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW
        }).css({
            opacity: 0.75
        });

        _bg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        _bg.add(_bg.canvas);
        _bg.texture = new Image();
        _bg.texture.src = FEDevice.getAsset(Config.IMAGES + "about/bg-culture.jpg", "jpg");

        /*_bg.halftone = new Image();
        _bg.halftone.src = FEDevice.getAsset(Config.IMAGES + "work/halftone.png", "png");*/

        _bg.texture.onload = function(){
            _bg.canvas.context.drawImage(_bg.texture, 0, 0);
            _positionBackground();
        };

        /*_bg.halftone.onload = function(){
            _bg.canvas.context.createPattern(_bg.halftone, "repeat");
        };*/

        /*_halftone = _bg.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").css({
            backgroundSize: "4px 4px"
        });*/
    }

    function _positionBackground(){
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height){
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        _bg.canvas.size(_wdth, _hght);
        _bg.canvas.context.drawImage(_bg.texture, 0, 0, _wdth, _hght);
        // _bg.canvas.context.createPattern(_bg.halftone, "repeat");

        _bg.css({
            top: Stage.height / 2 - _hght / 2,
            left: FEDevice.width / 2 - _wdth / 2 - _bgDiff
        }).transform({
            y: 0
        });
    }

    function _addContent(){
        _content = _self.initClass(AboutCultureContent, _maxcontentwidth, _padding);
    }

    this.positionX = function(x_pos){
        _elem.x = this.x = ~~x_pos;
        _elem.transform();
    };

    // scale height only at first - once Stage.height reaches ??? , scale by width also
    this.resize = function(bgDiff_resize) {
        _self.width = 1320;

        _padding = 80;
        if (Stage.height < 700){
            _self.width = Stage.height * 1.886;
            _padding = Stage.height * 0.114;
        }
        _bgDiff = bgDiff_resize;
        _elem.size(_self.width, Stage.height);
        _positionBackground();

        _maxcontentwidth = _self.width - (_padding*3);
        _content.resize(_maxcontentwidth, _padding);
    };

    // call in anim loop to fix background position
    this.moveBG = function(vec){
        _bg.x = -vec;
        _bg.x.toFixed(4);
        _bg.transform();
    };

    this.disable = function (){
        
    };
});