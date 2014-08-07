Class(function ClientLogo(index, imagepath, left, bottom, rowimg, row){
    Inherit(this, View);

    var _self = this, _elem, _logo, _test;
    var _square = 100;
    var _padding = 80;
    if (Stage.height < 700){
        _padding = Stage.height * 0.114;
        _square = Stage.height * 0.143;
    }
    

    (function () {
		_init();
        _addLogo();
    })();

    function _init(){
        _elem = _self.element;

        _elem.size(_square, _square).css({
            left: left,
            bottom: bottom
        });

        /*_test = _elem.create(".test");
        _test.css({
            background: Config.COLORS.white,
            color: Config.COLORS.black
        }).setZ(99);

        _test.text(index+'<br />'+left+'<br />'+bottom+'<br />'+rowimg+'<br />'+row);*/
    }

    function _addLogo(){
        _logo = _elem.create(".logo");
        _logo.size(_square, _square).transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW
        }).bg(imagepath).css({
            top: 0
        });
    }

    // scale and reposition ????
    this.resize = function(square, left, bottom, rowimg, row) {
        _square = square;
        // recalc spacing and size
        _elem.size(_square, _square).css({
            left: left,
            bottom: bottom
        });

        _logo.size(_square, _square);
    };
});