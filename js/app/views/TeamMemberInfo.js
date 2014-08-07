Class(function TeamMemberInfo(index, square){
    Inherit(this, View);

    var _self = this, _elem, _data, _photo, _infobox, _tapcount = 0;
    var _square = _square;
    var _scalefix = _square*1.33;
    var _diff = (_scalefix - _square)/2;
    var _clicked = false;
    var _canhover = true;

    if (Device.mobile){
        _canhover = false;
    }

    (function () {
		_init();
        _addPhoto();
        _addInfoBox();
    })();

    function _init(){
        //console.log("TeamMemberInfo _init");
        _team = Data.ABOUT.getTeam();
        _data = _team[index];
        //console.log(_data);

        _elem = _self.element;

        _elem.size(_square, _square).bg(Config.COLORS.white).css({
            overflow: "hidden"
        });
    }

    function _addPhoto(){
        _photo = _elem.create(".photo");
        _photo.size(_scalefix*2, _scalefix).bg(_data.urlPath).transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            left: -_diff,
            top: -_diff
        });
    }

    function _addInfoBox(){
        _infobox = _elem.create(".infobox");
        var fontsize = 12;
        if (Stage.height < 700){
            fontsize = Stage.height * 0.017;
        }
        _infobox.fontStyle("OpenSansBold", fontsize, Config.COLORS.black);
        _infobox.size(_square-20, _square-20).css({
            left: _square,
            padding: 10
        });

        var infotext = _data.info2.toUpperCase() + '<br /><br />' + _data.info3.toUpperCase() + '<br /><br />' +_data.info4.toUpperCase() + '<br /><br />' +_data.info5.toUpperCase();

        _infobox.text(infotext);
    }

    this.over = function(){
        if (_canhover == true){
            _photo.tween({
                left: -(_diff + _scalefix)
            }, 300, "easeInOutQuad");
        }
    };

    this.out = function(){
        if (_canhover == true){
            _photo.tween({
                left: -_diff
            }, 300, "easeInOutQuad");
        }
    };

    this.click = function(){
        if (Device.mobile){
            switch (_tapcount){
                case 0:
                _tapcount = 1;

                _photo.tween({
                    left: -(_diff + _scalefix)
                }, 300, "easeInOutQuad");
                break;

                case 1:
                _tapcount = 2;

                _photo.stopTween().css({
                    left: -(_diff + _scalefix)
                }).tween({
                    left: -(_diff + _scalefix)*2
                }, 300, "easeInOutQuad");

                _infobox.stopTween().css({
                    left: _square
                }).tween({
                    left: 0
                }, 300, "easeInOutQuad");
                break;

                case 2:
                _photo.stopTween().css({
                    left: -(_diff + _scalefix)*2
                }).tween({
                    left: -_diff
                }, 300, "easeInOutQuad");

                _infobox.stopTween().css({
                    left: 0
                }).tween({
                    left: _square
                }, 300, "easeInOutQuad");

                _tapcount = 0;
                break;
            }
        }else{
            if (_clicked == false){
                // click to show info
                _clicked = true;
                _canhover = false;

                _photo.stopTween().css({
                    left: -(_diff + _scalefix)
                }).tween({
                    left: -(_diff + _scalefix)*2
                }, 300, "easeInOutQuad");

                _infobox.stopTween().css({
                    left: _square
                }).tween({
                    left: 0
                }, 300, "easeInOutQuad");
            }else{
                // click to hide info
                _clicked = false;

                _photo.stopTween().css({
                    left: -(_diff + _scalefix)*2
                }).tween({
                    left: -_diff
                }, 300, "easeInOutQuad");

                _infobox.stopTween().css({
                    left: 0
                }).tween({
                    left: _square
                }, 300, "easeInOutQuad");

                _self.delayedCall(function(){
                    _canhover = true;

                    if (Device.mobile){
                        _canhover = false;
                    }
                }, 300);
            }
        }
    }

    // scale and reposition ????
    this.resize = function(square_resize) {
        _square = square_resize;
       _elem.size(_square, _square);
       _scalefix = _square*1.33;
       _diff = (_scalefix - _square)/2;

       _photo.size(_scalefix*2, _scalefix).css({
            left: -_diff,
            top: -_diff
        });

       var fontsize = 12;
        if (Stage.height < 700){
            fontsize = Stage.height * 0.017;
        }
       _infobox.size(_square-20, _square-20).css({
            left: _square,
            fontSize: fontsize
        });
    };
});