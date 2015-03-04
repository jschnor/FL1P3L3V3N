function SlideSidebar(index) {

    Inherit(this, $class);
    
    var _self = this,
        _elem = _self.element,
        _data,
        _subtitle,
        _para;

    (function() {
        _init();
        _setSize();
        _events();
    })();

    function _init(){
        _data = Data.HOME[index];

        _subtitle = _elem.create('.subtitle');
        _subtitle.size('100%', 'auto').setProps({
            color: Config.COLORS.white,
            fontWeight: Config.FONT.semibold
        });
        _subtitle.div.attributes.class.value += ' static';
        _subtitle.text(_data.subtitle.toUpperCase());

        _para = _elem.create('.content');
        _para.size('100%', 'auto').setProps({
            color: Config.COLORS.white,
            fontWeight: Config.FONT.normal
        });
        _para.div.attributes.class.value += ' static static-content';
        _para.text(_data.text);
    }

    function _events(){
        Evt.resize(_setSize);
    }

    function _setSize(){
        var titlefontsize = Device.mobile.phone ? Stage.width * 0.017 : Math.min(Stage.height * 0.027, Stage.width * 0.017);
        var fontsize = Device.mobile.phone ? titlefontsize * 0.75 : titlefontsize * 0.667;
        var buttonheight = (Math.min(Stage.height * 0.018, Stage.width * 0.011)) * 3.93;

        _elem.setProps({
            width: Device.mobile.phone ? Stage.width * 0.28 : Stage.width * 0.208,
            height: Stage.height * 0.611,
            left: 0,
            bottom: 0
        });

        _subtitle.setProps({
            fontSize: titlefontsize + 'px',
            lineHeight: titlefontsize + 'px',
            letterSpacing: titlefontsize * Config.FONT.spacing.subtitles + 'px',
            marginBottom: (titlefontsize * 0.667) + 'px'
        });

        _para.setProps({
            fontSize: fontsize + 'px',
            lineHeight: (fontsize * 1.4) + 'px'
        });
    }
}