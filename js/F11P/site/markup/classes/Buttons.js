function Buttons() {

    Inherit(this, $class);

    var _self = this,
        _elem = _self.element,
        _pdfbutton,
        _videobutton;

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

    (function() {
        _init();
        _setSize();
        _events();
    })();

    function _init() {
        _elem.setZ(999);

        _pdfbutton = _self.initClass(Button, 'OVERVIEW PDF', 'fa-arrow-down', 'down', _pdfCallback);
        _videobutton = _self.initClass(Button, 'THE PROLOGUE', 'fa-play', 'right', _videoCallback);
    }

    function _pdfCallback(){
        getURL(Config.ASSETS.path + '/docs/MirrorMe-Overview.pdf');
    }

    function _videoCallback(){
        // Flip11_Reel_103114
        // console.log('clicked video');
        Global.FULLBG.video.play('mirrorme-prologue');
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
        var pos_x = Stage.width * 0.076;
        var pos_y = Stage.height - ((Stage.height * (63/1200)) + (Stage.height * (90/1200)));

        // update previous values
        _translate.prevx = lerpX;
        _translate.prevy = lerpY;

        // update transform values on element
        _elem.setProps({
            transform: 'translate('+(lerpX + pos_x)+'px, '+(lerpY + pos_y)+'px)'
        });
    }

    function _setSize(){
        var border = Math.round(Math.max((Math.min(Stage.height * 0.0022, Stage.width * 0.0013)), 1));
        var paddingLeft = Stage.width * 0.076;
        var paddingBottom = Stage.height * (90/1200);
        var buttonWidth = (Stage.width/2) - (paddingLeft + Math.min(Stage.width*0.117, Stage.height*0.187));
        var buttonHeight = buttonWidth*0.1;

        _elem.size(buttonWidth, buttonHeight).setProps({
            x: paddingLeft,
            y: Stage.height - (buttonHeight + paddingBottom)
        });

        _videobutton.element.setProps({
            left: 0,
            top: 0
        });

        _pdfbutton.element.setProps({
            left: (buttonWidth/2) - border,
            top: 0
        });
    }
}