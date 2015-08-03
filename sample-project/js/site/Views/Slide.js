Class(function Slide(data, index) {

    Inherit(this, View);
    
    var _self = this;
    var _elem, _menu, _headline, _bg, _scroll;
    var _scont, _bbg, _button, _btext;
    var _ypos = 0;

    var _hwidth, _hheight, _hscale;

    var _data = data;
    var _index = index;

    this.id = _index;
    this.body = null;

    (function() {


        // TO DO: Look at breaking this up into additional classes:
        // SlideHeadline
        // SlideBody
        // SlideButton

        _init();

        // delay the event assignments to improve performance
        // during the animation
        // _self.delayedCall(function() {

        _eventSubscription();

        // }, 800);


    })();

    function _init() {

        _hwidth     = Device.mobile.phone ? (Mobile.orientation == 'landscape' ? 750 : 500) : 600;
        // _hwidth     = Device.mobile.phone ? 500 : 600;
        _hheight    = Device.mobile ? 104 : 104;
        _hscale     = Device.mobile.phone ? 0.25 : 0.5;


        _elem = _self.element;
        _elem.size(Stage.width, Stage.height).css({
            opacity: 0,
        }).transform({
            skewY: -2
        });
        
        _section = _elem.create('.section');

        _section.size(_hwidth, 'auto').css({
            top: Stage.height/2-(_hheight/2) - 100,
            left: Stage.width/2-(_hwidth/2),
        });

        _self.section = _section;

        var _fontsize;

        if (_data.title !== '') {
            
            _headline = _section.create('.headline');
            
            var _len = _data.title.length;

            if (_len < 16 ) {
                _fontsize = Device.mobile.phone ? 94 : 104;
            } else if (_len >= 16 && _len < 18) {
                _fontsize = 64;
            } else {
                _fontsize = 56;
            }


            _headline.fontStyle('DIN Condensed Bold', _fontsize+'px', 'white');
            _headline.size('100%').css({
                textAlign: 'center',
                lineHeight: (_fontsize-6)+'px',
                position: 'relative'
            });

            _headline.text(_data.title.toUpperCase());

        }

        if (_data.text !== '') {
            _body = _section.create('.body');

            // _body.fontStyle('DIN Condensed Regular', Device.mobile.phone ? '24px' : '16px', 'white');
            _body.fontStyle('DIN Condensed Regular', Device.mobile.phone ? '20px' : '16px', 'white');
            _body.size('100%', 'auto').css({
                // top: _fontsize - 5,
                backfaceVisibility: 'hidden',
                textRendering: 'none',
                letterSpacing: 1.2,
                textAlign: 'left',
                lineHeight: Device.mobile.phone ? '26px' : '22px',
                // border: '1px solid green',
                position: 'relative'
            });
            _body.transform({
                z: 0,
            });
            _body.text(_data.text);

            _self.body = _body;

        }
        if (_data.buttontext !== '') {

            _button = _section.create('.button');

            _button.size(250, 50).css({
                border: '2px solid white',
                overflow: 'hidden',
                top: _data.text === '' ? 0 : 10,
                left: (_hwidth/2)-(250/2),
                cursor: 'pointer',
                position: 'relative',
                marginTop: 20,
            }).setZ(6);


            _bbg = _button.create('.bg');
            _bbg.size(250, 60).css({

                top: 50,
                // position: 'static'
            }).bg('white');

            _btext = _button.create('.text');
            _btext.fontStyle('DIN Condensed Regular', '24px', 'white');
            _btext.size(250, 50).css({
                textAlign: 'center',
                letterSpacing: '4px',
                lineHeight: '54px'
            }).setZ(_index + 1);

            _btext.text(_data.buttontext.toUpperCase());

            _self.button = _button;
        }

        

    }
    
    function _eventSubscription() {
        if (_data.buttontext !== '') {
            if (!Device.mobile){
                Evt.subscribe(_button.div, Evt.MOUSE_OVER, _onOver);
                Evt.subscribe(_button.div, Evt.MOUSE_OUT, _onOut);
                Evt.subscribe(_button.div, Evt.CLICK, _onClick);
            }else{
                TouchUtil.bind(_button, _onClick, false);                

            }
        }

        // Evt.subscribe(_section, Evt.ORIENTATION, _onResize);
    }    
    
    function _onOver(e) {
        // console.log('OVER');
        _bbg.tween({
            top: 0
        }, 0.2, 'Quart.EaseOut');
        _btext.css({
            color: Config.COLORS.branding
        });
    }
    function _onOut(e) {
        _bbg.tween({
            top: -60
        }, 0.2, 'Quart.EaseIn', null, function() {
            _bbg.css({
                top: 50
            });
        });
        _btext.css({
            color: 'white'
        });
    }

    function _onClick(e) {
        // console.log(_data);

        if (_self.parent == Global.HOME) {
            // hard-coded
            if (Device.mobile) {
                // getURL('https://s3.amazonaws.com/flipeleven/videos/Flip11_Reel_103114.mp4');
                getURL(Utils.getAsset(_data.filename, 'video'));
            } else {
                Global.FULLBG.video.element.css({
                    opacity: 0
                })
                Global.FULLBG.video.play(_data.filename, 'video');
            }
        } else if (_self.parent == Global.WORK){
            if (_self.id === 0) {
                Global.WORK.getstarted();
            } else {
                // uses mapped data from actual database
                switch (_data.type){
                    case 'video':
                    if (Device.mobile) {
                        // getURL('https://s3.amazonaws.com/flipeleven/videos/Flip11_Reel_103114.mp4');
                        getURL(Utils.getAsset(_data.video, 'video'));
                    } else {
                        Global.FULLBG.video.play(_data.video, 'video');
                    }
                    break;

                    case 'web':
                    default:
                    getURL(_data.link);
                    break;
                }
            }
        }
    }

    this.destroy = function() {

        if (!Device.mobile){
            Evt.removeEvent(_button.div, Evt.MOUSE_OVER, _onOver);
            Evt.removeEvent(_button.div, Evt.MOUSE_OUT, _onOut);
            Evt.removeEvent(_button.div, Evt.CLICK, _onClick);
        }else{
            // TouchUtil.unbind(_button);
        }

        Evt.removeEvent(window, Evt.ORIENTATION, _onOrientationChange);

        this.__destroy();
    };

});
