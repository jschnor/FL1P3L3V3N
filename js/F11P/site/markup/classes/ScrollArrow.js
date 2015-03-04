function ScrollArrow(show_text, is_intro) {

    Inherit(this, $class);

    var _self = this,
        _elem = _self.element,
        _arrowbox,
        _arrows_wrap,
        _arrow1,
        _arrow2,
        _scroll,
        _down,
        _in = false,
        _arrow_width,
        _arrow_height,
        _arrow_thick;

    var _mouse = {
            x: Stage.width/2,
            y: Stage.height/2,
            vx: 0,
            vy: 0
        },
        _translate = {
            x: 0,
            y: 0,
            prevx: 0,
            prevy: 0
        },
        _rotate = {
            x: 0,
            y: 0,
            prevx: 0,
            prevy: 0
        };

    var _multiple = 0.75;

    _self.inverted = false;

    (function() {
        _init();

        if (show_text === true){
            _addText();
        }
        
        _setSize();
        _events();
        _animateIn();
    })();

    function _init(){
        _elem.setZ(999);

        _arrowbox = _elem.create('.arrowbox');
        _arrows_wrap = _arrowbox.create('.arrows-wrap');

        // big arrow
        _arrow1 = _arrows_wrap.create('.arrow1');
        _arrow1.leftside = _arrow1.create('.left');
        _arrow1.rightside = _arrow1.create('.right');

        _arrow1.leftside.setProps({
            backgroundColor: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });

        _arrow1.rightside.setProps({
            backgroundColor: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });

        // small arrow
        _arrow2 = _arrows_wrap.create('.arrow2');
        _arrow2.leftside = _arrow2.create('.left');
        _arrow2.rightside = _arrow2.create('.right');

        _arrow2.leftside.setProps({
            backgroundColor: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });

        _arrow2.rightside.setProps({
            backgroundColor: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });

        _arrowbox.interact(_onOver, _onOut, _onClick);
    }

    function _addText(){
        _scroll = _elem.create('.scroll');
        _scroll.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            color: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });
        _scroll.text('SCROLL');

        _down = _elem.create('.down');
        _down.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            color: _self.inverted ? Config.COLORS.black : Config.COLORS.white
        });
        _down.text('DOWN');
    }

    function _events(){
        Evt.resize(_setSize);

        // track mouse movement
        if (!Device.mobile){
            document.addEventListener('mousemove', _onMouseMove);
        }
    }

    function _onMouseMove(event){
        Render.startRender(_updateObj);
        _updateCoords(event);
    }

    function _updateCoords(event){
        // get mouse coords
        _mouse.x = event.clientX || event.pageX; 
        _mouse.y = event.clientY || event.pageY;

        // normalize mouse position values based on Stage center
        _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
        _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

        // figure out how much to translate elements
        _translate.x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiple)) * _mouse.vx).toFixed(2);
        _translate.y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiple)) * _mouse.vy).toFixed(2);

        // figure out how much to rotate elements
        // we switch these because the rotateX function actually rotates AROUND the X axis
        // if you want it to 'look at' the mouse, we have to invert the Y value as well so it makes sense visually
        _rotate.y = -(Config.MAXROTATE.x * _mouse.vx).toFixed(2);
        _rotate.x = (Config.MAXROTATE.y * _mouse.vy).toFixed(2);
    }

    function _updateObj(){
        var lerpX = Utils.lerp(Config.LERPAMT, _translate.prevx, _translate.x);
        var lerpY = Utils.lerp(Config.LERPAMT, _translate.prevy, _translate.y);
        var pos_x = (Stage.width - _arrow_width)/2;
        var pos_y = Stage.height - (_arrow_height*2.5);

        // update previous values
        _translate.prevx = lerpX;
        _translate.prevy = lerpY;

        // update transform values on element
        _elem.setProps({
            transform: 'translate('+(lerpX + pos_x)+'px, '+(lerpY + pos_y)+'px)'
        });
    }

    function _setSize(){
        _arrow_width = Math.min(Stage.width*0.117, Stage.height*0.187);
        _arrow_height = Stage.height*0.05;
        _arrow_thick = Math.round(Math.max(_arrow_width*0.013, 1));

        _elem.size(_arrow_width, _arrow_height).setProps({
            x: (Stage.width - _arrow_width)/2,
            y: Stage.height - (_arrow_height*2.5)
        });

        _arrowbox.size(_arrow_width, _arrow_height);
        _arrows_wrap.size(_arrow_width, _arrow_height);

        // scale and position arrow parts
        _arrow1.leftside.size(_arrow_width*0.565, _arrow_thick).setProps({
            borderRadius: _arrow_thick+'px',
            transform: 'translate(-'+(_arrow_width * 0.0315)+'px, '+(_arrow_height * 0.47)+'px) rotate(26.5deg)',
        });
        _arrow1.rightside.size(_arrow_width*0.565, _arrow_thick).setProps({
            borderRadius: _arrow_thick+'px',
            transform: 'translate('+(_arrow_width * 0.4684)+'px, '+(_arrow_height * 0.47)+'px) rotate(-26.5deg)',
        });

        _arrow2.leftside.size((_arrow_width*0.565)/5, _arrow_thick).setProps({
            borderRadius: _arrow_thick+'px',
            transform: 'translate('+(_arrow_width * 0.3966)+'px, '+(_arrow_height * 0.083)+'px) rotate(26.5deg)',
        });
        _arrow2.rightside.size((_arrow_width*0.565)/5, _arrow_thick).setProps({
            borderRadius: _arrow_thick+'px',
            transform: 'translate('+(_arrow_width * 0.4905)+'px, '+(_arrow_height * 0.083)+'px) rotate(-26.5deg)',
        });

        if (show_text === true){
            _sizeText();
        }
    }

    function _sizeText(){
        // scale and position text
        var fontsize = Math.min(Stage.width*0.011, Stage.height*0.017);
        _scroll.setProps({
            fontSize: fontsize+'px',
            lineHeight: fontsize+'px',
            letterSpacing: fontsize * Config.FONT.spacing.subtitles + 'px',
            bottom: 0,
            left: -(fontsize*5)
        });

        _down.setProps({
            fontSize: fontsize+'px',
            lineHeight: fontsize+'px',
            letterSpacing: fontsize * Config.FONT.spacing.subtitles + 'px',
            bottom: 0,
            right: -(fontsize*4.1)
        });
    }

    function _onOver(){
        _arrowbox.tween({
            y: _self.inverted ? -7 : 7
        }, 0.5, Config.EASING.outback);
    }

    function _onOut(){
        _arrowbox.tween({
            y: 0
        }, 0.5, Config.EASING.inout);
    }

    function _onClick(){
        if (is_intro){
            Global.INTRO.animateOut();
        }else{
            if (_self.inverted){
                Global.HOME.getUp();
            }else{
                Global.HOME.getDown();
            }
        }
    }

    function _animateIn(){
        /*_elem.tween({
            borderWidth: _bordersize+'px',
            opacity: 0.3
        }, 0.75, Config.EASING.out, 1);*/
    }

    function _animateOut(){
        
    }

    // tween arrows from white to black or vice-versa, and rotate them
    function _invert(){
        var transtime = 0.5;
        var oldcolor = Config.COLORS.white;
        var newcolor = Config.COLORS.black;
        var oldrotate = 0;
        var newrotate = 180;

        if (_self.inverted){
            oldcolor = Config.COLORS.black;
            newcolor = Config.COLORS.white;
            oldrotate = 180;
            newrotate = 0;
        }

        _self.inverted = !_self.inverted;

        _arrow1.leftside.setProps({
            backgroundColor: oldcolor
        }).tween({
            backgroundColor: newcolor
        }, transtime, Config.EASING.inout);

        _arrow1.rightside.setProps({
            backgroundColor: oldcolor
        }).tween({
            backgroundColor: newcolor
        }, transtime, Config.EASING.inout);

        _arrow2.leftside.setProps({
            backgroundColor: oldcolor
        }).tween({
            backgroundColor: newcolor
        }, transtime, Config.EASING.inout);

        _arrow2.rightside.setProps({
            backgroundColor: oldcolor
        }).tween({
            backgroundColor: newcolor
        }, transtime, Config.EASING.inout);

        if (show_text){
            _scroll.setProps({
                color: oldcolor
            }).tween({
                color: newcolor
            }, transtime, Config.EASING.inout);

            _down.setProps({
                color: oldcolor
            }).tween({
                color: newcolor
            }, transtime, Config.EASING.inout);
        }

        _arrows_wrap.setProps({
            rotationX: oldrotate
        }).tween({
            rotationX: newrotate
        }, transtime, Config.EASING.inout);
    }

    this.animateIn = function(){
        _animateIn();
    };

    this.animateOut = function(){
        _animateOut();
    };

    this.invert = function(){
        _invert();
    };

    this.stop = function(){
        if (!Device.mobile){
            Render.stopRender(_updateObj);
            document.removeEventListener('mousemove', _onMouseMove);
        }
    };
}