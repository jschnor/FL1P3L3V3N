function SlideTitle(index) {

    Inherit(this, $class);
    
    var _self = this,
        _elem = _self.element,
        _data,
        _title,
        _line;

    (function() {
        _init();
        _setSize();
        _events();
    })();

    function _init(){
        _data = Data.HOME[index];

        _title = _elem.create('.title');
        _title.size('100%', 'auto').setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.xlight,
            textAlign: 'center',
            color: (_data.type == 'contact') ? Config.COLORS.black : Config.COLORS.white
        });

        _title.text(_data.title.toUpperCase());


        _line = _elem.create('.line');

        if (_data.type == 'contact'){
            _line.setProps({
                opacity: 0.8
            }).bg(Config.COLORS.black);
        }else{
            _line.setProps({
                opacity: 0.4
            }).bg(Config.COLORS.white);
        }
    }

    function _events(){
        Evt.resize(_setSize);
    }

    function _setSize(){
        var height = Stage.height * 0.15;
        var fontsize = Device.mobile.phone ? Stage.width * 0.05 : Math.min(height*0.57, Stage.width * 0.053);

        _elem.setProps({
            width: '100%',
            height: height
        });

        _title.setProps({
            lineHeight: fontsize+'px',
            fontSize: fontsize+'px',
            letterSpacing: fontsize * Config.FONT.spacing.titles + 'px',
            textIndent: fontsize * Config.FONT.spacing.titles + 'px'
        });

        _line.setProps({
            width: '100%',
            height: Math.round(Math.max((Math.min(Stage.height * 0.0022, Stage.width * 0.0013)), 1)),
            left: 0,
            bottom: 0
        });
    }
}