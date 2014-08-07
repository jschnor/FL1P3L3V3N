Class(function FullscreenBackground() {

    Inherit(this, View);
    
    var _self = this;
    var _elem, _bckg, _hdln, _cont, _play; 
    var new_fullBg, _halftone, _tint, _pcon;
    var i;
    (function () {
        _markup();
        // _animateIn();
        _onResize();
        _getChildren();
        // _getContent();
        // _getChildren01();
        // _getChildren02()
    })();

    function _markup() {
        _elem = _self.element;
        _elem.size(Stage.width, Stage.height).css({
            // opacity: 0,
            // border: '1px solid blue'
            background: Config.COLORS.grey
        }).setZ(100);

        // create halftone overlay
        _halftone = _elem.create("halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(6);
        
        // create tint overlay
        _tint = _elem.create("overlay");
        _tint.size("100%").bg(Config.COLORS.black).css({
            opacity: 0.25
        }).setZ(7);

        //  f.transform({
        //     skewX: Config.SKEW
        // }).transformPoint(0, 0);
        // console.log('HOME VIDEO BG:')
    }

    function _getChildren() {
        var _data = Data.WORK.getData();
        // console.log(_data);

        _loadBackground(_data[0].featured_images[1].urlPath, 0);
        _positionBackground();
    }

    
    
    function _positionBackground() {

        // TODO: FIGURE OUT ASPECT AND SET IT FOR OUR IMAGES
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        new_fullBg.canvas.size(_wdth, _hght);
        new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0, _wdth, _hght);

        // USED TO HELP CENTER
        // if (Mobile.os == "iOS") {
        //     new_fullBg.object.center();
        // } else {
            new_fullBg.css({
                top: Stage.height / 2 - _hght / 2,
                left: FEDevice.width / 2 - _wdth / 2
            }).transform({
                y: 0,
            });
        // }

    }

    function _loadBackground(_img, _ind) {
        new_fullBg = _elem.create("fullbg").css({
            opacity: 0
        });

        new_fullBg.css({
            background: ""
        }).setZ(5);
        
        new_fullBg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        new_fullBg.add(new_fullBg.canvas);
        new_fullBg.texture = new Image();
        new_fullBg.texture.src = FEDevice.getAsset(_img, "jpg");

        new_fullBg.index = _ind;

        new_fullBg.texture.onload = function () {

            _bgIsSet = true;

            new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0);
            _positionBackground();

            new_fullBg.tween({
                opacity: 1
            }, 800, 'easeOutQuad', null, _self.destroyBG);

        };


    }
    function _animateIn() {
        // _elem.tween({
        //     opacity: 1
        // }, 5000, "easeOutQuart")
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeBackground);
    }

    function _resizeBackground() {
        // console.log('hi')
        _elem.css({
            width: Stage.width,
            height: Stage.height
        });
        // _cont.center();
        // _hdln.css({
        //     top: Stage.height - 400,
        // //     left: Stage.width - 600,
        // });

        _positionBackground();
    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});
