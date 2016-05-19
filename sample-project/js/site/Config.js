// Global site-specific config

Class(function Config() {
    
    var _self = this;

    (function(){
        _iOS9retinaSizePatch(true);
    })();

    function _iOS9retinaSizePatch(allowUserScaling){
        if (allowUserScaling == true){
            if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
              document.querySelector('meta[name=viewport]')
                .setAttribute(
                  'content', 
                  'initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=9.0001, user-scalable=1'
                );
            }
        }else{
            if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
              document.querySelector('meta[name=viewport]')
                .setAttribute(
                  'content', 
                  'initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=1.0001, user-scalable=0'
                );
            }
        }
    }

    this.useLocalStorage = true;

    // color values
    this.COLORS = {
        black: '#000000',
        white: '#ffffff',
        test: '#00ccff'
    };

    // aspect ratio for scaling images and videos 
    this.ASPECT = 1080 / 1920;

    // CDN URL
    this.S3 = 'https://s3.amazonaws.com/flipeleven/';
    this.PROXY = _self.S3;

    // paths to various asset folders
    this.ASSETS = {
        path: '/assets/',
        images: '/assets/images/',
        videos: '/assets/videos/',
        fonts: '/assets/fonts/'
    };

    // font, weights, and letter spacings
    this.FONTS = {
        default: {
            name: 'Arial',
            normal: 'normal',
            bold: 'bold',
            spacing: {
                // spacings are a multiple of font size
                titles: 0.768,
                subtitles: 0.2,
                normal: 0
            }
        }
    };

    // default easing methods
    this.EASING = {
        type: 'Quad',
        in: 'Quad.easeIn',
        out: 'Quad.easeOut',
        inout: 'Quad.easeInOut',
        outback: 'Back.easeOut'
    };

    // array of assets to pass to the preloader
    this.PRELOAD = [
        _self.ASSETS.images + 'sample.jpg',
    ];

    // array of preloaded assets, stored here and retrieved when needed
    // see site/markup/ids/Loader.js for object structure or console.log this
    this.LOADED = [];

    // debug options central on/off switches
    // it's up to you to use these appropriately in the code
    this.DEBUG = {
        all: false,
        bitobject: false,
        state: false,
        loader: false,
        markup: false,
        scroll: false,
        touch: false,
        fullbg: false
    };
}, 'static');