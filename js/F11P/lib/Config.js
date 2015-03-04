Static(function Config() {
    
    var _self = this;

    this.COLORS = {
        black: '#000000',
        white: '#ffffff',
        test: '#8181DE'
    };

    this.ASPECT = 1080 / 1920;
    this.BGASPECT = 1200 / 1920;

    this.S3 = 'https://s3.amazonaws.com/flipeleven/';

    this.PROXY = _self.S3;

    this.ASSETS = {
        path: '/assets',
        images: '/assets/images',
        bgs: '/assets/images/backgrounds',
        home: '/assets/images/home',
        work: '/assets/images/work',
        common: '/assets/images/common'
    };

    // font, weights, and letter spacings
    this.FONT = {
        name: 'Raleway',
        xlight: '200',
        light: '300',
        normal: '400',
        semibold: '600',
        spacing: {
            normal: 0,
            subtitles: 0.2,
            titles: 0.768
        }
    };

    this.EASING = {
        type: 'Quad',
        in: 'Quad.easeIn',
        out: 'Quad.easeOut',
        inout: 'Quad.easeInOut',
        outback: 'Back.easeOut'
    };

    this.MAXROTATE = {x: 20, y: 20}; // maximum number of degrees to rotate an elment with a CSS 3D transform
    this.MAXTRANSLATE = {x: 0.025, y: 0.025}; // maximum distance to translate an element, as a multiple of current stage width or height
    this.LERPAMT = 0.04;

    if (Device.mobile.phone){
        this.PRELOAD = [
            _self.ASSETS.bgs + '/chike-bad-sm.png',
            _self.ASSETS.bgs + '/chike-good-sm.png',
            _self.ASSETS.bgs + '/city-bad-sm.jpg',
            _self.ASSETS.bgs + '/city-good-sm.jpg',
            _self.ASSETS.bgs + '/texture-bad-sm.png',
            _self.ASSETS.bgs + '/texture-good-sm.png',
            _self.ASSETS.bgs + '/city-bright-sm.jpg',
            _self.ASSETS.bgs + '/city-bright-blur-sm.jpg'
        ];
    }else{
        this.PRELOAD = [
            _self.ASSETS.bgs + '/chike-bad.png',
            _self.ASSETS.bgs + '/chike-good.png',
            _self.ASSETS.bgs + '/city-bad.jpg',
            _self.ASSETS.bgs + '/city-good.jpg',
            _self.ASSETS.bgs + '/texture-bad.png',
            _self.ASSETS.bgs + '/texture-good.png',
            _self.ASSETS.bgs + '/city-bright.jpg',
            _self.ASSETS.bgs + '/city-bright-blur.jpg'
        ];
    }

    this.margin = function(){
        var _marginsize = 30;
        return Stage.width*(_marginsize/1920);
    };

    this.DEBUG = {
        all: false,
        statemodel: false,
        markup: false,
        home: false,
        navitem: false,
        bitobject: false,
        slide: false,
        fullbg: false,
        fullbgimage: false,
        scroll: false,
    }
});