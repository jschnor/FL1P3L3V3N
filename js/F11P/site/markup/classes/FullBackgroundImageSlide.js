function FullBackgroundImageSlide(index) {

    Inherit(this, $class);

    var _self = this,
        _elem = _self.element,
        _data,
        _layerindex = 0,
        _bg,
        _tex,
        _fg,
        _data = Data.HOME[index];

    var _mouse = {
            x: Stage.width/2,
            y: Stage.height/2,
            vx: 0,
            vy: 0
        },
        _translate = {
            bg_x: 0,
            bg_y: 0,
            bg_prevx: 0,
            bg_prevy: 0,
            tex_x: 0,
            tex_y: 0,
            tex_prevx: 0,
            tex_prevy: 0,
            fg_x: 0,
            fg_y: 0,
            fg_prevx: 0,
            fg_prevy: 0
        };

    var _multiples = {
        bg: 0.45,
        tex: 0.33,
        fg: (_data.type == 'contact') ? 0.75 : 0.6
    };
    

    (function() {
        _init();
        Render.startRender(_loadBackgrounds);
    })();

    function _init() {
        _elem.size('100%').setProps({
            overflow: 'hidden',
            opacity: 1
        }).setZ(_z);

        _bg = _elem.create('.background');
        _tex = _elem.create('.texture');
        _fg = _elem.create('.foreground');

    }

    function _loadBackgrounds(){
        switch (_layerindex){
            case 0:
            _bg.css({
                backgroundSize: "100% 100%",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }).bg(_data.bg).setZ(10);
            break;

            case 1:
            _tex.css({
                backgroundSize: "100% 100%",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }).bg(_data.tex).setZ(20);
            break;

            case 2:
            if (_data.type == 'contact'){
                _fg.css({
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50%',
                    // border: '1px solid #0000ff'
                }).bg(_data.fg).setZ(30);
            }else{
                _fg.css({
                    backgroundSize: "100% 100%",
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }).bg(_data.fg).setZ(30);
            }

            _stopBackgroundLoading();
            break;
        }

        _layerindex++;
    }

    function _stopBackgroundLoading(){
        Render.stopRender(_loadBackgrounds);
        _layerindex = 0;

        // tell the whole world that this background is loaded
        Evt.fireEvent(null, Evt.BG_LOADED, index);

        _setSizeAndPosition();
        _events();
    }

    function _setSizeAndPosition() {
        var _wdth = ~~ Stage.width;
        var _hght = ~~ (_wdth * Config.BGASPECT);

        if (_hght < Stage.height) {
            _hght = Stage.height;
            _wdth = _hght / Config.BGASPECT;
        }

        _wdth = ~~_wdth;
        _hght = ~~_hght;

        _bg.size(_wdth, _hght).setProps({
            top: (Stage.height - _hght)/2,
            left: (Stage.width - _wdth)/2,
            scale: 1 + Config.MAXTRANSLATE.x // ensure that we always scale up enough to avoid seeing the edges
        });

        _tex.size(_wdth, _hght).setProps({
            top: (Stage.height - _hght)/2,
            left: (Stage.width - _wdth)/2,
            scale: 1 + Config.MAXTRANSLATE.x // ensure that we always scale up enough to avoid seeing the edges
        });

        if (_data.type == 'contact'){
            var basesize = Math.min(Stage.width * 0.371, Stage.height * 0.66);
            var circle_size = Device.mobile.phone ? Stage.height * 0.95 : basesize * 1.18;

            _fg.size(circle_size, circle_size).setProps({
                backgroundSize: (Stage.width * (1 + Config.MAXTRANSLATE.x)) + 'px ' + (Stage.height * (1 + Config.MAXTRANSLATE.y)) + 'px',
                x: (Stage.width - circle_size)/2,
                y: (Stage.height - (circle_size*1.07))/2
            });
        }else{
            _fg.size(_wdth, _hght).setProps({
                top: (Stage.height - _hght)/2,
                left: (Stage.width - _wdth)/2,
                scale: 1 + Config.MAXTRANSLATE.x // ensure that we always scale up enough to avoid seeing the edges
            });
        }
    }
    
    function _events() {
        Evt.resize(_setSizeAndPosition);
    }

    function _updateCoords(event){
        // get mouse coords
        if (!Device.mobile) {
            _mouse.x = event.clientX || event.pageX; 
            _mouse.y = event.clientY || event.pageY;

            // normalize mouse position values based on Stage center
            _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
            _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

            // figure out how much to translate elements
            _translate.bg_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.bg)) * _mouse.vx).toFixed(2);
            _translate.bg_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.bg)) * _mouse.vy).toFixed(2);
            _translate.tex_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.tex)) * _mouse.vx).toFixed(2);
            _translate.tex_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.tex)) * _mouse.vy).toFixed(2);
            _translate.fg_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.fg)) * _mouse.vx).toFixed(2);
            _translate.fg_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.fg)) * _mouse.vy).toFixed(2);
        } else {

            // accelerationX = event.accelerationIncludingGravity.x;
            // accelerationY = event.accelerationIncludingGravity.y;
            // accelerationZ = event.accelerationIncludingGravity.z;

            _mouse.x = event.accelerationIncludingGravity.x; 
            _mouse.y = event.accelerationIncludingGravity.y;

            

            // normalize mouse position values based on Stage center
            _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
            _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

            // figure out how much to translate elements
            _translate.bg_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.bg)) * _mouse.vx).toFixed(2);
            _translate.bg_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.bg)) * _mouse.vy).toFixed(2);
            _translate.tex_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.tex)) * _mouse.vx).toFixed(2);
            _translate.tex_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.tex)) * _mouse.vy).toFixed(2);
            _translate.fg_x = -((Stage.width * (Config.MAXTRANSLATE.x * _multiples.fg)) * _mouse.vx).toFixed(2);
            _translate.fg_y = -((Stage.height * (Config.MAXTRANSLATE.y * _multiples.fg)) * _mouse.vy).toFixed(2);

        }
    }

    function _updateObj(){
        // find lerp values
        var bg_lerpX = Utils.lerp(Config.LERPAMT, _translate.bg_prevx, _translate.bg_x);
        var bg_lerpY = Utils.lerp(Config.LERPAMT, _translate.bg_prevy, _translate.bg_y);
        var tex_lerpX = Utils.lerp(Config.LERPAMT, _translate.tex_prevx, _translate.tex_x);
        var tex_lerpY = Utils.lerp(Config.LERPAMT, _translate.tex_prevy, _translate.tex_y);
        var fg_lerpX = Utils.lerp(Config.LERPAMT, _translate.fg_prevx, _translate.fg_x);
        var fg_lerpY = Utils.lerp(Config.LERPAMT, _translate.fg_prevy, _translate.fg_y);

        // update previous values
        _translate.bg_prevx = bg_lerpX;
        _translate.bg_prevy = bg_lerpY;
        _translate.tex_prevx = tex_lerpX;
        _translate.tex_prevy = tex_lerpY;
        _translate.fg_prevx = fg_lerpX;
        _translate.fg_prevy = fg_lerpY;

        // update transform values on elements
        _bg.setProps({
            transform: 'scale('+(1 + Config.MAXTRANSLATE.x)+') translate('+bg_lerpX+'px, '+bg_lerpY+'px)'
        });

        _tex.setProps({
            transform: 'scale('+(1 + Config.MAXTRANSLATE.x)+') translate('+tex_lerpX+'px, '+tex_lerpY+'px)'
        });

        if (_data.type == 'contact'){
            var circle_size = Math.min(Stage.width * 0.371, Stage.height * 0.66) * 1.18;
            var _x = (Stage.width - circle_size)/2;
            var _y = (Stage.height - (circle_size*1.07))/2;

            _fg.setProps({
                transform: 'translate('+(fg_lerpX + _x)+'px, '+(fg_lerpY + _y)+'px)'
            });
        }else{
            _fg.setProps({
                transform: 'scale('+(1 + Config.MAXTRANSLATE.x)+') translate('+fg_lerpX+'px, '+fg_lerpY+'px)'
            });
        }
    }

    function _onMouseMove(event){
        _updateCoords(event);
        Render.startRender(_updateObj);
    }
    function _onDeviceMove(event) {

        _updateCoords(event);
        Render.startRender(_updateObj);
    }

    this.show = function(_z){
        _elem.setProps({
            opacity: 0
        }).tween({
            opacity: 1
        }, 0.5, Config.EASING.out).setZ(_z);

        // start tracking mouse movement
        if (!Device.mobile){
            document.addEventListener('mousemove', _onMouseMove);
        } else {

            document.addEventListener('ondevicemotion', _onDeviceMove);

        }
    };

    this.hide = function(){
        _elem.tween({
            opacity: 0
        }, 0.1, Config.EASING.out);
    };

    this.stop = function(){
        if (!Device.mobile){
            Render.stopRender(_updateObj);
            document.removeEventListener('mousemove', _onMouseMove);
        }
    };
};
