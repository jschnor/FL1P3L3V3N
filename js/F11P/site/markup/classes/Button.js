/**
 * @param string _text  The text label to go on the button.
 * @param string _iconclass  The FontAwesome icon class to display.
 * @param string _direction  The direction to animate the icon on rollover. 'up', 'down', 'left', 'right'
 * @param function _clickCallback  Function to run on click. Not intended for doing animation, instead use this to go to a URL or something.
 */

function Button(_text, _iconclass, _direction, _clickCallback) {

    Inherit(this, $class);

    var _self = this,
        _elem = _self.element,
        _label,
        _icon,
        _iconshift = 3,
        _time = 0.33,
        _circle;

    (function() {
        _init();
        _buttonText();
        _icon();
        _hoverCircle();
        _setSize();
        _events();
    })();

    function _init() {
        _elem.setProps({
            border: '4px solid '+Config.COLORS.white,
            backgroundColor: 'rgba(0,0,0,0.66)',
            overflow: 'hidden'
        });
        _elem.interact(_onOver, _onOut, _onClick);
    }

    function _buttonText(){
        _label = _elem.create('.text');
        _label.size('100%', '100%').setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.semibold,
            textAlign: 'center',
            color: Config.COLORS.white
        }).setZ(30);

        _label.text(_text.toUpperCase());
    }

    function _icon(){
        _icon = _label.create('.fa', 'span');
        _icon.setProps({
            fontFamily: 'FontAwesome',
            color: Config.COLORS.white,
            marginLeft: '0.33em'
        }).setZ(20);
        _icon.div.attributes.class.value += ' static ' + _iconclass;
    }

    function _hoverCircle(){
        _circle = _elem.create('.circle');
        _circle.setProps({
            borderRadius: '50%',
            scale: 0
        }).bg(Config.COLORS.white).setZ(10);
    }

    function _onOver(){
        _circle.setProps({
            scale: 0,
            opacity: 0
        }).tween({
            scale: 1,
            opacity: 1
        }, _time, Config.EASING.in);

        _label.tween({
            color: Config.COLORS.black
        }, _time, Config.EASING.in);

        _icon.tween({
            color: Config.COLORS.black
        }, _time, Config.EASING.in);

        switch (_direction){
            case 'up':
            _icon.setProps({
                x: 0,
                y: 0
            }).tween({
                y: -_iconshift
            }, _time, Config.EASING.outback);
            break;

            case 'down':
            _icon.setProps({
                x: 0,
                y: 0
            }).tween({
                y: _iconshift
            }, _time, Config.EASING.outback);
            break;

            case 'left':
            _icon.setProps({
                x: 0,
                y: 0
            }).tween({
                x: -_iconshift
            }, _time, Config.EASING.outback);
            break;

            case 'right':
            _icon.setProps({
                x: 0,
                y: 0
            }).tween({
                x: _iconshift
            }, _time, Config.EASING.outback);
            break;
        }
    }

    function _onOut(){
        _circle.tween({
            opacity: 0
        }, _time, Config.EASING.out, null, function(){
            _circle.setProps({
                scale: 0
            });
        });

        _label.tween({
            color: Config.COLORS.white
        }, _time, Config.EASING.out);

        _icon.tween({
            color: Config.COLORS.white
        }, _time, Config.EASING.out);

        _icon.tween({
            x: 0,
            y: 0
        }, _time, Config.EASING.out);
    }

    function _onClick(){

        if (typeof _clickCallback == 'function'){
            _clickCallback();
        }
    }

    function _events(){
        Evt.resize(_setSize);
    }

    function _setSize(){
        var border = Math.round(Math.max((Math.min(Stage.height * 0.0022, Stage.width * 0.0013)), 1));
        var paddingLeft = Stage.width * 0.076;
        var containerWidth = (Stage.width/2) - (paddingLeft + Math.min(Stage.width*0.117, Stage.height*0.187));
        var buttonwidth = containerWidth/2;
        var buttonheight = containerWidth*0.1;
        var fontsize = buttonheight*0.33;
        var circlewidth = buttonwidth*1.05;

        _elem.setProps({
            width: buttonwidth,
            height: buttonheight,
            border: border + 'px solid ' + Config.COLORS.white
        });

        _label.setProps({
            lineHeight: buttonheight+'px',
            fontSize: fontsize+'px',
            letterSpacing: fontsize * Config.FONT.spacing.subtitles + 'px',
            textIndent: fontsize * Config.FONT.spacing.subtitles + 'px'
        });

        _circle.setProps({
            width: circlewidth,
            height: circlewidth,
            x: ((buttonwidth - circlewidth)/2) - border,
            y: ((buttonheight - circlewidth)/2) - border
        });
    }
}