function Slide(data, index) {

    Inherit(this, $class);
    
    var _self = this,
        _elem = _self.element,
        _cont,
        _title,
        _sidebar,
        _form,
        _padding = {
            top: Stage.height * 0.072,
            right: Stage.width * 0.076,
            bottom: Stage.height * 0.122,
            left: Stage.width * 0.076
        },
        _is_showing = false;

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

    (function() {

        // console.log(data);
        
        _init();

        if (data.type == 'normal' || data.type == 'contact'){
            _addTitle();
        }
        
        if (data.type == 'normal'){
            _addSidebar();
        }

        if (data.type == 'contact'){
            _addForm();
        }

        _setSize();
        _events();
    })();

    function _init(){
        _elem.css({
            overflow: 'hidden'
        });
        _cont = _elem.create('.container');
    }

    function _addTitle(){
        _title = _self.initClass(SlideTitle, index);
        _cont.add(_title);
    }

    function _addSidebar(){
        _sidebar = _self.initClass(SlideSidebar, index);
        _cont.add(_sidebar);
    }

    function _addForm(){
        _form = _cont.create('.form');
        _form.title = _form.create('.title');
        _form.paragraph = _form.create('.text');
        _form.container = _form.create('.container');
        _form.label = _form.container.create('.label');
        _form.label.colon = _form.container.create('.colon');
        _form.field = _form.container.create('.field', 'input');
        _form.button = _form.container.create('.button');
        _form.response = _form.container.create('.response');

        /*_form.setProps({
            border: "1px solid red"
        });*/

        _form.title.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            textAlign: 'center',
            color: Config.COLORS.black
        });
        _form.title.text(data.subtitle.toUpperCase());

        _form.paragraph.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.normal,
            textAlign: 'center',
            lineHeight: '1.4em',
            color: Config.COLORS.black
        });
        _form.paragraph.text(data.text);

        /*_form.container.css({
            border: "1px solid #000000"
        });*/

        _form.label.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            textAlign: 'right',
            lineHeight: '1.3em',
            color: Config.COLORS.black
        });
        _form.label.text('DONATE OR<br/>GET INVOLVED');

        _form.label.colon.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            color: Config.COLORS.black
        });
        _form.label.colon.text(':');

        if (Device.mobile.phone){
            _form.label.colon.setProps({ display: "none" });
        }

        _form.field.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.light,
            color: Config.COLORS.white,
            backgroundColor: Config.COLORS.black,
            opacity: 0.75,
            paddingLeft: '1em',
            paddingRight: '1em'
        });

        _form.field.div.placeholder = "YOUR EMAIL HERE";

        _form.button.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            color: Config.COLORS.black,
            backgroundColor: Config.COLORS.white,
            textAlign: 'center',
            opacity: 0.75
        });
        _form.button.text('SIGN UP');

        _form.button.interact(_onOver, _onOut, _onClick);


        _form.response.setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            color: Config.COLORS.black,
            textAlign: 'right',
            opacity: 0,
            y: 10
        });


        if (Device.mobile){
            /*_form.inputhit = _form.container.create('.inputhit');
            _form.inputhit.interact(null, null, function(){
                _form.field.div.focus();
            });*/
        }
    }

    function _events(){
        Evt.resize(_setSize);

        /*if (data.type == 'contact'){
            _form.field.div.onkeyup = function(event){
                // console.log(event.which);
                _form.field.div.focus();
            }
        }*/
    }

    function _onOver(){
        _form.button.setProps({
            opacity: 0.75
        }).tween({
            opacity: 1
        }, 0.5, Config.EASING.inout);
    }

    function _onOut(){
        _form.button.setProps({
            opacity: 1
        }).tween({
            opacity: 0.75
        }, 0.5, Config.EASING.inout);
    }

    function _onClick(){
        var _email = _form.field.div.value;

        // do AJAX form submission
        var response = Utils.ajax('/sendemail.php', { email: _email }, 'GET', _onAJAXresponse);
    }

    function _onAJAXresponse(response){
        if (response == 'success'){
            _form.response.text('THANKS FOR YOUR INTEREST!');
        }else if (response == 'no email'){
            _form.response.text('PLEASE ENTER YOUR EMAIL.');
        }else{
            _form.response.text('UH-OH. THERE WAS A PROBLEM.');
        }

        _form.response.setProps({
            opacity: 0,
            y: 10
        }).tween({
            opacity: 1,
            y: 0
        }, 0.5, Config.EASING.inout);
    }

    function _onMouseMove(event){
        _updateCoords(event);
        Render.startRender(_updateObj);
    }

    function _setSize(){
        _elem.size(Stage.width, Stage.height);

        if (_is_showing === true && Device.mobile){
            _elem.setProps({
                y: 0
            });
        }

        // scale the content container
        _padding = {
            top: Stage.height * 0.072,
            right: Stage.width * 0.076,
            bottom: Stage.height * 0.122,
            left: Stage.width * 0.076
        };

        var cont_w = Stage.width - (_padding.right + _padding.left);
        var cont_h = Stage.height - (_padding.top + _padding.bottom);

        _cont.size(cont_w, cont_h).setProps({
            x: _padding.left,
            y: _padding.top
        });

        if (data.type == 'contact'){
            var form_size = Device.mobile.phone ? cont_h : Math.min(cont_w * 0.438, cont_h * 0.87);

            _form.size(form_size, form_size).setProps({
                x: (cont_w - form_size)/2,
                y: (cont_h - form_size)/2
            });

            var fontsz = Device.mobile.phone ? Stage.width * 0.015 : Math.min(Stage.height*0.027, Stage.width * 0.015);

            _form.title.setProps({
                width: '100%',
                height: fontsz * 2,
                fontSize: fontsz + 'px',
                lineHeight: '1em',
                letterSpacing: (fontsz * Config.FONT.spacing.subtitles) + 'px',
                textIndent: (fontsz * Config.FONT.spacing.subtitles) + 'px',
                y: Device.mobile.phone ? Stage.height * 0.2 : fontsz*6.5
            });

            _form.paragraph.setProps({
                width: '100%',
                height: 'auto',
                fontSize: Device.mobile.phone ? (Stage.height * 0.024) + 'px' : (fontsz*0.667) + 'px',
                y: Device.mobile.phone ? Stage.height * 0.3 : fontsz*9.5
            });

            var fcwidth = form_size * 0.82;
            var fcheight = form_size * 0.33;
            _form.container.size(fcwidth, fcheight).setProps({
                x: (form_size - fcwidth)/2,
                y: form_size - fcheight
            });

            _form.label.setProps({
                fontSize: (fontsz*0.63)+'px',
                letterSpacing: ((fontsz*0.63) * Config.FONT.spacing.subtitles) + 'px',
                top: fontsz*0.2
            });

            _form.label.colon.setProps({
                fontSize: (fontsz*1.8)+'px',
                top: -(fontsz*0.172),
                left: fcwidth * 0.294
            });

            _form.field.setProps({
                width: fcwidth*0.66,
                height: fontsz*2,
                fontSize: (fontsz*0.75)+'px',
                right: 0,
                letterSpacing: ((fontsz*0.75) * Config.FONT.spacing.subtitles) + 'px',
                textIndent: ((fontsz*0.75) * Config.FONT.spacing.subtitles) + 'px'
            });

            _form.button.setProps({
                width: fcwidth*0.25,
                height: fontsz*2,
                fontSize: (fontsz*0.75)+'px',
                right: 0,
                top: fontsz*2.5,
                border: Math.max(Math.round(fontsz*0.11), 1) + 'px solid ' + Config.COLORS.black,
                lineHeight: (fontsz*1.9) + 'px',
                letterSpacing: ((fontsz*0.75) * Config.FONT.spacing.subtitles) + 'px',
                textIndent: ((fontsz*0.75) * Config.FONT.spacing.subtitles) + 'px'
            });

            _form.response.setProps({
                width: fcwidth*0.7,
                height: fontsz*2,
                fontSize: (fontsz*0.66)+'px',
                top: fontsz*2.5,
                lineHeight: (fontsz*2.33) + 'px',
                letterSpacing: ((fontsz*0.66) * Config.FONT.spacing.subtitles) + 'px'
            });

            if (Device.mobile){
                /*_form.inputhit.setProps({
                    width: fcwidth*0.66,
                    height: fontsz*2,
                    right: 0
                });*/
            }
        }
    }

    function _updateCoords(event){
        // get mouse coords
        _mouse.x = event.clientX || event.pageX; 
        _mouse.y = event.clientY || event.pageY;

        // normalize mouse position values based on Stage center
        _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
        _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

        // figure out how much to translate elements
        _translate.x = -((Stage.width * Config.MAXTRANSLATE.x) * _mouse.vx).toFixed(2);
        _translate.y = -((Stage.height * Config.MAXTRANSLATE.y) * _mouse.vy).toFixed(2);

        // figure out how much to rotate elements
        // we switch these because the rotateX function actually rotates AROUND the X axis
        // if you want it to 'look at' the mouse, we have to invert the Y value as well so it makes sense visually
        _rotate.y = -(Config.MAXROTATE.x * _mouse.vx).toFixed(2);
        _rotate.x = (Config.MAXROTATE.y * _mouse.vy).toFixed(2);
    }

    function _updateObj(){
        var lerpX = Utils.lerp(Config.LERPAMT, _translate.prevx, _translate.x);
        var lerpY = Utils.lerp(Config.LERPAMT, _translate.prevy, _translate.y);

        // update previous values
        _translate.prevx = lerpX;
        _translate.prevy = lerpY;

        // update transform values on element
        _cont.setProps({
            transform: 'translate('+(lerpX+_padding.left)+'px, '+(lerpY+_padding.top)+'px)'
        });
    }

    // move the slide up or down
    // @param integer _dir  The direction to move, either 1 (down) or -1 (up)
    // @param boolean _show  Whether to show the slide or not (i.e. show the slide as it enters the frame, hide as it leaves)
    // @param function _callback  Function to run after animation is complete

    // http://cssdeck.com/labs/motion-blur
    // http://codepen.io/ChrisHoman/pen/BDKzx/
    this.move = function(_dir, _show, _callback){
        var startY = 0;

        if (_show === true){
            if (_dir == -1){
                startY = Stage.height;
            }else{
                startY = -Stage.height;
            }

            _self.start();
            _is_showing = true;
        }else{
            _is_showing = false;
        }

        _elem.setProps({
            y: startY,
            opacity: _show ? 0 : 1
        }).tween({
            y: _show ? 0 : Stage.height * _dir,
            opacity: _show ? 1 : 0,
        }, 0.6, Config.EASING.out, null, function(){
            if (typeof _callback == 'function'){
                _callback();
            }
        });
    };

    this.show = function(){
        _elem.setProps({
            y: 0,
            opacity: 1
        });

        _is_showing = true;
    };

    this.start = function(){
        // start tracking mouse movement
        if (!Device.mobile){
            document.addEventListener('mousemove', _onMouseMove);
        }
    };

    this.stop = function(){
        if (!Device.mobile){
            Render.stopRender(_updateObj);
            document.removeEventListener('mousemove', _onMouseMove);
        }
    };

    this.destroy = function() {
        this.__destroy();
    };
}