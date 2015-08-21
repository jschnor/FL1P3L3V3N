// Global site-specific config

Class(function Config() {
    
    var _self = this;

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
Class(function SiteDevice() {
    
    var _self = this;
    
    // implementation for device specific functionality relating to the site
    (function () {
        
    })();

    this.getAsset = function(filename, type) {

        var _extension;
        var _asset;

        switch(type) {
            case 'video':
                if (Device.browser.chrome) { _extension = '.mp4'; }
                if (Device.browser.firefox) { _extension = '.webm'; }
                if (Device.browser.safari || Device.browser.ie) { _extension = '.mp4'; }
                if (Device.mobile) { _extension = '.mp4'; }

                return Config.PROXY + 'videos/'+filename+_extension;
                // break;
            
            case 'image':
                _extension = '.'+type;

                return Config.PROXY + 'images/'+filename+_extension;
                // break;
            
            case 'pdf':
                _extension = '.'+type;

                return Config.PROXY + 'pdf/'+filename+_extension;
                // break;
        }
    };

    // get an image from the preloaded set
    this.getImg = function(path){
        var imgobj;
        for (var idx = 0; idx < Config.LOADED.length; idx++){
            if (Config.LOADED[idx].id == path){
                imgobj = Config.LOADED[idx].img;
            }
        }

        return imgobj;
    };
    
}, 'static');
Class(function Data() {

    Inherit(this, Model);

    var _self = this;
    var _data;
    var _work;

    bit.ready(function () {
        _setData();
    });

    function _setData(){
        _self.STATE = new StateModel();
    }
}, 'static');
// example of a data model for a section of the site

Class(function HomeModel(_data) {
    
    Inherit(this, Model);
    
    var _self = this;

    function _getSortedData() {
        var _hmsl = [];
        var _orderedData = [];

        for (var i = 0; i < _data.length; i++) {
            if (_data[i].status) {
                // ACTIVE
                // console.log('ACTIVE');
                // console.log(_data[i].status);

                // if (_data[i]['feature_type'])
                // console.log(_data[i]['feature_type']);
                // console.log(_data[i]['feature_type']);
                switch(_data[i]['feature_type']) {
                    case '1':
                        // console.log('case 0: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.REELS.getWorkByName(_data[i]['reels:label']) });
                    break;
                    case '2':
                        // console.log('case 2: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.WORK.getWorkByName(_data[i]['promos:label']) });
                    break;
                    case '3':
                        // console.log('case 1: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.CASESTUDIES.getWorkByName(_data[i]['case_studies:label']) });
                    break;

                }
                // console.log(Data.WORK.getWorkByName(_data[i]['feature_type:label']))
                // _hmsl.push(Data.WORK.getWorkByName(_data[i]['feature_type:label']));
                
            }
        }
        _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder); });

        

        for (var j = 0; j < _hmsl.length; j++) {
            // console.log(_data[i].data)
            _orderedData.push(_hmsl[j].data);
        }

        return _orderedData;
    }

    this.getData = function() {
        return _data;
    };

    this.getSortedData = function() {
        return _getSortedData();
    };
});
Class(function StateModel() {
    Inherit(this, Model);

    var _self = this;
    var _currState;

    (function () {
        _startHistory();
        _init();
    })();
    function _startHistory() {

        //first run
        _currState = 'home';

        History.Adapter.bind(window,'statechange', function(){ // Note: We are using statechange instead of popstate
            var __page = History.getState().url.split('/')[3];

            _currState = __page === '' ? 'home' : History.getState().url.split('/')[3];
            _init();
        });
    }
    function _init() {
        var split_state = History.getState().url.split("/");

        _self.page      = split_state[3];
        _self.category  = split_state[4];
        _self.detail    = split_state[5];

        if (Config.DEBUG.all || Config.DEBUG.state) {
            console.log('==========================');
            console.log('STATE MODEL :: INIT');
            console.log(split_state);
            console.log(_self.page);
            console.log('==========================');
        }

        if (_self.category && !_self.category.length) {
            _self.category = null;
        }

        if (_self.detail && !_self.detail.length) {
            _self.detail = null;
        }

        if (_self.page != "home") {
            _self.page = "home";
        }

        if (Global.CONTAINER) {
            Global.CONTAINER.checkBrowserBack();
        }
    }

    this.setState = function (page, title) {
        var _title;
        if (title === undefined) {
            _title = null
        } else {
            _title = title;
        }

        History.pushState({page: page}, _title, page);
        GATracker.trackPage(page);

    };
});
Class(function FullBackgroundImage() {

    Inherit(this, View);

    var _self = this,
        _elem = _self.element,
        _bg;

    (function() {
        _init();
    })();

    function _init() {
        _elem.size('100%').setProps({
            opacity: 0
        });

        _bg = _elem.create('.background');
        _bg.size('100%').imgbg(Config.ASSETS.images + 'sample.jpg', {
            size: 'cover'
        });
    }

    this.animateIn = function(){
        _elem.tween({
            opacity: 1
        }, 0.5, Config.EASING.inout);
    };

    this.animateOut = function(){
        _elem.tween({
            opacity: 0
        }, 0.5, Config.EASING.inout);
    };
});

Class(function FullBackgroundVideo() {

    Inherit(this, View);

    var _self = this,
        _elem = _self.element,
        _video,
        _seek,
        _playpause,
        _fullscreen,
        _close, 
        _vidtime,
        _scrubbar,
        _scrubline,
        _startX,
        _diff,
        _fadecontrols;
    
    var _isPlaying      = false,
        _isAmbient      = false,
        _seekDown       = false,
        _scrollamount   = 100,
        _seekvalue      = 0,
        _ppWidth        = 100,
        _fsWidth        = 100,
        _clWidth        = 100,
        _skWidth        = 100;

    (function() {
        _init();
        _eventSubscription();
    })();

    function _init() {
        _elem.size('100%').css({
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            opacity: 0
        });

        _video = _elem.create('.video', 'video');

        _video.size('100%').transform({
            scale: 1.05
        }).css({
            opacity: 0
        });
    }

    function _ambient(filename) {
        
        Evt.removeEvent(_video.div, 'canplay', _onFullVideoPlay);
        Evt.removeEvent(_video.div, 'ended', _onFullVideoEnd);

        _video.div.src = !filename ? Config.ASSETS.videos+'sample.mp4' : Utils.getAsset(filename, 'video');

        
        if (Config.DEBUG.all || Config.DEBUG.fullbg) {
            console.log(_video.div.src);
            console.log('========================');
        }

        _video.div.volume   = 0;
        _video.div.autoplay = true;
        _video.div.loop     = true;
        _video.div.controls = false;

        Evt.subscribe(_video.div, 'canplay', _onAmbientVideoPlay);

        _positionBackground();
    }

    function _onAmbientVideoPlay() {
        if (!_isAmbient) {

            _isAmbient = _self.AMBIENT = true;
            _isPlaying = false;
            
            Global.FULLBG.coverOut();

            // animate it in anyways since safari
            // waits to swap z-index
            _video.tween({
                opacity: 1
            }, 1, 'Quart.EaseOut');
        }
    }

    function _onFullVideoPlay() {

        if (!_isPlaying) {

            _isPlaying = true;
            _isAmbient = _self.AMBIENT = false;
            _elem.css({ opacity: 0 });
            _video.css({ opacity: 1 });
            _close.css({ opacity: 0 });
            _playpause.css({ opacity: 0 });
            _seek.css({ opacity: 0 });
            _scrubbar.css({ opacity: 0 });
            _fullscreen.css({ opacity: 0 });

            if (Config.DEBUG.all || Config.DEBUG.fullbg) {
                console.log('VIDEO BG :: play : canplay');
            }

            _elem.tween({
                opacity: 1
            }, 0.6, 'Quart.EaseOut', null, function() {

                // Transition.instance().animateOut();

                _close.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                _playpause.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                _seek.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                _scrubbar.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                _fullscreen.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
            });
        }
    }
    function _onFullVideoEnd() {
        _self.delayedCall(_closeVideo, 2000);
    }

    function _positionBackground() {
        var _wdth = ~~ (Stage.width * 1.25);
        var _hght = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght = Stage.height;
            _wdth = _hght / Config.ASPECT;
        }

        _wdth = ~~_wdth;
        _hght = ~~_hght;

        if (_video !== undefined) {
            _video.size(_wdth, _hght).css({
                top: Stage.height / 2 - _hght / 2,
                left: Stage.width / 2 - _wdth / 2,
                backgroundSize: '100% 100%',

            });
        }
    }
    
    function _onResize() {

        _positionBackground();

        if (_playpause !== undefined) {

            _playpause.css({
                top: Stage.height - _ppWidth,
            });
        }

        if (_close !== undefined) {

            _close.css({
                left: Stage.width - _clWidth,
            });
        }

        if (_seek !== undefined) {


            _seek.css({
                left: _ppWidth,
                top: Stage.height - _skWidth,
            });
        }

        if (_scrubbar !== undefined) {

            _scrubbar.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 100).css({
                top: Stage.height - _ppWidth,
            });
            
        }

        if (_fullscreen !== undefined) {
            _fullscreen.css({
                top: Stage.height - _fsWidth,
                left: Stage.width - _fsWidth,
            });
        }
    }

    function _activateVideo() {

        _playpause = _elem.create('.playpause');
        _playpause.size(_ppWidth, 100).bg(Config.ASSETS.images + 'videoplayer/pause_button.png').setZ(10000).css({
            top: Stage.height - _ppWidth,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0
        });

        _fullscreen = _elem.create('.fullscreen');
        _fullscreen.size(_fsWidth, 100).bg(Config.ASSETS.images + 'videoplayer/expand_button.png').setZ(10000).css({
            top: Stage.height - _fsWidth,
            left: Stage.width - _fsWidth,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0
        });

        _close = _elem.create('.close');
        _close.size(_clWidth, 100).bg(Config.ASSETS.images + 'videoplayer/cancel_button.png').css({
            left: Stage.width - _clWidth,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
            cursor: "pointer"
        }).setZ(10000);

        _seek = _elem.create('.seek');
        _seek.size(_skWidth, 100).bg(Config.ASSETS.images + 'videoplayer/scrubber.png').css({
            left: _ppWidth - (_skWidth/2),
            top: Stage.height - _skWidth,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0
        }).setZ(10001);

        _scrubbar = _elem.create('.scrubbar');
        _scrubbar.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 100).css({
            left: _ppWidth,
            top: Stage.height - 100,
            opacity: 0,
            overflow: 'hidden'
        }).setZ(10000);

        _scrubline = _scrubbar.create('.line');
        _scrubline.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 4).bg('white').css({
            top: 50-2,
            borderBottom: '1px solid #666666'
        });

        Evt.subscribe(_close.div, Evt.CLICK, _closeVideo);
        Evt.subscribe(_close.div, Evt.MOUSE_OVER, _onButtonOver);
        Evt.subscribe(_close.div, Evt.MOUSE_OUT, _onButtonOut);
        Evt.subscribe(_elem, Evt.MOUSE_MOVE, _onMouseMove);

        Evt.subscribe(_fullscreen.div, Evt.CLICK, _onFullscreenClick);
        Evt.subscribe(_fullscreen.div, Evt.MOUSE_OVER, _onButtonOver);
        Evt.subscribe(_fullscreen.div, Evt.MOUSE_OUT, _onButtonOut);
        
        Evt.subscribe(_playpause.div, Evt.CLICK, _onPlayPauseClick);
        Evt.subscribe(_playpause.div, Evt.MOUSE_OVER, _onButtonOver);
        Evt.subscribe(_playpause.div, Evt.MOUSE_OUT, _onButtonOut);

        // Event listener for the seek bar
        Evt.subscribe(_video.div, 'timeupdate', _updateSeek);

        Evt.subscribe(_seek.div, Evt.CHANGE, _onSeekChange);
        Evt.subscribe(_seek.div, Evt.MOUSE_DOWN, _onSeekDown);
        Evt.subscribe(_seek.div, Evt.MOUSE_MOVE, _onSeekDrag);
        Evt.subscribe(_seek.div, Evt.MOUSE_UP, _onSeekRelease);

        Evt.subscribe(_seek.div, Evt.MOUSE_OVER, _onButtonOver);
        Evt.subscribe(_seek.div, Evt.MOUSE_OUT, _onButtonOut);

    }

    function _eventSubscription() {

        Evt.subscribe(window, Evt.RESIZE, _onResize);

        Evt.subscribe(window, Evt.BROWSER_FOCUS, function(e) {
            // console.log('hello');
            if (_video !== undefined) {
                switch(e.type) {
                    case 'blur':
                        _self.onBlur();
                    break;
                    case 'focus':
                        // _video.div.play();
                        _self.onFocus();
                    break;
                }
            }
        });
    }

    function _onMouseMove() {

        _playpause.tween({ opacity: 0.4 }, 0.8, 'Quart.EaseOut');
        _seek.tween({ opacity: 0.4 }, 0.8, 'Quart.EaseOut');
        _scrubbar.tween({ opacity: 0.4 }, 0.8, 'Quart.EaseOut');
        _close.tween({ opacity: 0.4 }, 0.8, 'Quart.EaseOut');
        _fullscreen.tween({ opacity: 0.4 }, 0.8, 'Quart.EaseOut');

        clearInterval(_fadecontrols);
        _fadecontrols = setInterval(function() {
            
            _playpause.tween({ opacity: 0 }, 0.4, 'Quart.EaseOut');
            _seek.tween({ opacity: 0 }, 0.4, 'Quart.EaseOut');
            _scrubbar.tween({ opacity: 0 }, 0.4, 'Quart.EaseOut');
            _close.tween({ opacity: 0 }, 0.4, 'Quart.EaseOut');
            _fullscreen.tween({ opacity: 0 }, 0.4, 'Quart.EaseOut');

            clearInterval(_fadecontrols);

        }, 4000);
    }

    function _onButtonOver(e) {
        e.target.$bitObject.tween({
            opacity: 1
        }, 1, 'Quart.EaseOut');
    }

    function _onButtonOut(e) {
        e.target.$bitObject.tween({
            opacity: 0.4
        }, 1, 'Quart.EaseOut');
    }

    function _onPlayPauseClick(e) {

        if (_video.div.paused === true || _video.div.ended === true) {
            // Play the video
            _video.div.play();

            // Update the button image to 'Play'
            _playpause.bg(Config.ASSETS.images + 'videoplayer/pause_button.png');
            _isPlaying = true;
        } else {
            // Pause the video
            _video.div.pause();

            // Update the button image to 'Pause'
            _playpause.bg(Config.ASSETS.images + 'videoplayer/play_button.png');
            _isPlaying = false;
        }
    }

    function _onFullscreenClick(e) {

        if (Device.getFullscreen()) {
            Device.closeFullscreen();
            
            Global.FULLSCREEN = false;

            _elem.size('100%');
            _video.transform({
                scale: 1.05
            });
            _close.visible();

            _fullscreen.bg(Config.ASSETS.images + 'videoplayer/expand_button.png');

            _onResize();
        } else {

            Device.openFullscreen(_elem);

            _elem.size('100%');
            _video.transform({
                scale: 0.95
            });

            Global.FULLSCREEN = true;

            _fullscreen.bg(Config.ASSETS.images + 'videoplayer/exit_full_screen_button.png');

            _elem.css({
                top: 0
            });

            _close.invisible();

            _scrubbar.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 100).css({
                left: _ppWidth,
                top: Stage.height - 100,
            });

            _scrubline.size('100%', 4).bg('white').css({
                top: 50-2,
            });
        }
    }

    function _onSeekChange(e) {
        // Calculate the new time
        _vidtime = _video.div.duration * (_seekvalue / 100);

        // Update the video time
        _video.div.currentTime = _vidtime;
    }

    function _updateSeek(e) {

        // Update the seek bar as the video plays
        // Calculate the slider value
        _seekvalue = (((Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2))) / _video.div.duration) * _video.div.currentTime) + (_ppWidth/2);

        _seek.css({
            left: _seekvalue
        });
    }

    function _onSeekDown(e) {

        // Pause the video when the slider handle is starting to be dragged
        _video.div.pause();
        _seekDown = true;
        _startX = e.clientX;

        _seekvalue = _video.div.duration * ((e.clientX-(_skWidth/2)) / 100);
    }

    function _onSeekDrag(e) {
        if (_seekDown){
            _diff = (e.clientX - _startX) / (Stage.width - _skWidth) * 100;

            if (Math.abs(_diff) > 1){

                if (e.clientX < Stage.width - _skWidth && e.clientX > (_skWidth/2)) {
                    
                    _seek.css({
                        left: e.clientX - (_skWidth/2)
                    });
        
                }
            }

            Evt.subscribe(_scrubbar.div, Evt.MOUSE_MOVE, _onSeekDrag);
        }
    }

    function _onSeekRelease(e) {
        
        // Play the video when the slider handle is dropped
        if (_isPlaying) {
            _video.div.play();
        } else {
            _video.div.pause();
        }
        _seekDown = false;
        if (_diff !== undefined) {
            _video.div.currentTime += _diff;
        }
        Evt.removeEvent(_scrubbar.div, Evt.MOUSE_MOVE, _onSeekDrag);
    }

    function _closeVideo() {

        _close.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut');

        _playpause.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut');
        
        _seek.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut');

        _elem.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut');

        _video.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut', null, function() {
            _ambient();

            Evt.removeEvent(_close.div, Evt.CLICK, _closeVideo);
            Evt.removeEvent(_close.div, Evt.MOUSE_OVER, _onButtonOver);
            Evt.removeEvent(_close.div, Evt.MOUSE_OUT, _onButtonOut);

            Evt.removeEvent(_fullscreen.div, Evt.CLICK, _onFullscreenClick);
            Evt.removeEvent(_fullscreen.div, Evt.MOUSE_OVER, _onButtonOver);
            Evt.removeEvent(_fullscreen.div, Evt.MOUSE_OUT, _onButtonOut);

            Evt.removeEvent(_playpause.div, Evt.CLICK, _onPlayPauseClick);
            Evt.removeEvent(_playpause.div, Evt.MOUSE_OVER, _onButtonOver);
            Evt.removeEvent(_playpause.div, Evt.MOUSE_OUT, _onButtonOut);

            // Event listener for the seek bar
            Evt.removeEvent(_video.div, 'timeupdate', _updateSeek);

            Evt.removeEvent(_seek.div, Evt.CHANGE, _onSeekChange);
            Evt.removeEvent(_seek.div, Evt.MOUSE_DOWN, _onSeekDown);
            Evt.removeEvent(_seek.div, Evt.MOUSE_MOVE, _onSeekDrag);
            Evt.removeEvent(_seek.div, Evt.MOUSE_UP, _onSeekRelease);
            Evt.removeEvent(_seek.div, Evt.MOUSE_OVER, _onButtonOver);
            Evt.removeEvent(_seek.div, Evt.MOUSE_OUT, _onButtonOut);

            _fullscreen.div.remove();
            _playpause.div.remove();
            _close.div.remove();
            _seek.div.remove();
            _scrubbar.div.remove();
        });
        
    }

    this.onFocus = function() {
        _video.div.play();
    };

    this.onBlur = function() {
        _video.div.pause();
    };

    this.ambient = function(video) {
        if (video) {
            _ambient(video);
        } else {
            _ambient();
        }
    };

    this.play = function(video) {

        // Transition.instance().animateIn();

        _positionBackground();

        _video.div.src      = !video ? Config.ASSETS.videos+'sample.mp4' : Utils.getAsset(video, 'video');
        _video.div.volume   = 1;
        _video.div.autoplay = true;
        _video.div.loop     = false;
        _video.div.controls = false;

        Evt.removeEvent(_video.div, 'canplay', _onAmbientVideoPlay);

        Evt.subscribe(_video.div, 'canplay', _onFullVideoPlay);
        Evt.subscribe(_video.div, 'ended', _onFullVideoEnd);
        
        _activateVideo();
        _elem.setZ(9999);
    };
});
Class(function Nav() {

    Inherit(this, View);
    Inherit(this, $slidenav);
    
    var _self = this,
        _elem = _self.element;

    Global.NAV = this;

    (function() {
        _init();
        _events();
        _onResize();
        _animateIn();
    })();

    function _init() {
        _elem.setZ(100);
        _elem.bg('#ffffff');

        // init nav items
        for (var idx = 0; idx < 5; idx++){
            var test = _self.initClass(NavItem, idx);

            if (idx == 0){
                test.activate();
            }
            
            _self.items.push(test);
        }
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    function _onResize(){
        var width = 300;
        var height = 50;
        _elem.size(width, height).setProps({
            left: (Stage.width - width)/2,
            bottom: 20
        });
    }

    function _animateIn(){
        // Global.FULLBG.image.animateIn();
    }

    this.destroy = function() {
        this.__destroy();
    };
});
Class(function NavItem(index) {

    Inherit(this, View);
    
    var _self = this,
        _elem = _self.element;

    _self.index = index;

    (function() {
        _init();
        _setSize();
        _events();
    })();

    function _init() {
        _elem.setProps({
            border: "1px solid #000000",
            borderRadius: "50%"
        }).bg('#ffffff');
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _setSize);

        _elem.interact(null, null, _click);
    }

    function _click(){
        Evt.fireEvent(_elem, Evt.SLIDE_NAVSELECT, {
            index: index
        });
    }

    function _setSize(){
        var dotsize = 20;
        _elem.size(dotsize, dotsize).setProps({
            left: ((300/5)*index) + 20,
            top: 25 - (dotsize/2)
        });
    }

    this.deactivate = function(){
        _elem.bg('#ffffff');
    };

    this.activate = function(){
        _elem.bg('#000000');
    };
});
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

Class(function Test(index) {

    Inherit(this, View);
    // Inherit(this, $slide);
    
    var _self = this,
    	_elem = _self.element,
    	_t1,
    	_t2,
    	_t3,
    	_link,
    	_input;

    (function(){
    	_init();
    })();

    function _init(){
    	_self.index = index;

    	_elem.size('100%').css({
    		textAlign: 'center',
    		fontSize: '48px'
    	}).bg(colorPick(_self.index));
    	_elem.text(textPick(_self.index));

    	if (_self.index == 0){
	    	_t1 = _elem.create('.yellowbox');
	    	_t1.size('25%').setProps({
	    		left: '25%',
	    		top: '25%',
	    		border: '5px solid #ffffff'
	    	}).bg('#F2DB41');

	    	/*_t2 = _t1.create('.redbox');
	    	_t2.size('75%').setProps({
	    		left: '12.5%',
	    		top: '12.5%',
	    		border: '5px solid #ffffff'
	    	}).bg('#ff0000');*/

	    	/*_t3 = _t2.create('.bluebox');
	    	_t3.size('75%').setProps({
	    		left: '12.5%',
	    		top: '12.5%',
	    		border: '5px solid #ffffff'
	    	}).bg('#0000ff');*/

			_t1.interact(function(){
				console.log('over');
			}, function(){
				console.log('out');
			}, function(){
				console.log('click');
				_ajaxTest();
			});

	    	_link = _t1.create('.link', 'a');
	    	_link.setProps({
	    		top: '50%',
	    		right: '10%'
	    	});
	    	_link.text('test link');
	    	_link.div.href = 'http://google.com';

	    	_input = _t1.create('.field', 'input');
	    	_input.size("75%", "25%").setProps({
	    		left: '12.5%',
	    		top: '33%',
	    		color: '#000000'
	    	}).bg('#ffffff');

	    	// console.log(_link);
	    	// console.log(_input);
		}
    }

    function _ajaxTest(){

    	if (window.XMLHttpRequest){
            xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    if (xhr.status == 200){
                    	console.log(xhr.responseText);
                    }else{
                        console.log('ERROR');
                    }
                }
            };

            xhr.open('GET', '/ajaxtest.php');
            xhr.send();
        }
    }

    function colorPick(id) {
		var colors = [
			'#17A4FC',
			'#09E83D',
			'#DEAB04',
			'#0C04DE',
			'#DE0F04',
			'#DE04AB',
			'#A704DE',
			'#04DEC8',
			'#A0DE04',
			'#DE7104'
		];

		return colors[id];
	}

	function textPick(id) {
		var strings = [
			'0 Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			'1 Vivamus semper volutpat dui sed lobortis',
			'2 Pellentesque accumsan porta ipsum eu pretium',
			'3 Nulla at interdum lacus',
			'4 Vivamus eu turpis et risus interdum dignissim feugiat vitae metus',
			'5 Vestibulum vitae pharetra augue',
			'6 Ut congue fermentum neque, vel dapibus nulla viverra vitae',
			'7 Mauris in nisl in ipsum luctus scelerisque',
			'8 Curabitur fermentum nisi vitae ornare venenatis',
			'9 Ut ultrices orci ex, eu rutrum mauris viverra id'
		];

		return strings[id];
	}

	this.animateIn = function(params){
		// console.log('IN');
		// console.log(params);
	};

	this.animateOut = function(params){
		// console.log('OUT');
		// console.log(params);
		// Evt.fireEvent(_elem, Evt.SLIDE_COMPLETE);
	};
});
Class(function Transition() {
    // console.log('tranistion is called - singleton');

    Inherit(this, View);

    var _self = this;
    var _elem, _anim, _centerW, _centerH, _bg;
    var _rotation = 0;
    var _isLooping = false;
    var _center;
    var _size = 200;
    // var _center;

    
    (function () {
        _init();
    })();

    function _init() {
        _elem = _self.element;
        _elem.size('100%').setZ(9000).css({
            left: Device.mobile ? 0 : 0,
        });

        _centerH = Stage.height/2 - _size/2;
        _centerW = Stage.width/2 - _size/2;

        _bg = _elem.create('.bg');

        _bg.size('100%').css({
            // top: _centerH,
            // left: _centerW,
            opacity: 0

        // }).bg('black');
        }).bg(Config.COLORS.branding);

        _anim = _elem.create('.loader');

        _anim.size(_size, _size).css({
            top: _centerH,
            left: _centerW,
            opacity: 0.8

        // }).bg('black');
        }).bg(Config.ASSETS.common + '/loader.png');

        _anim.transform({
            scale: 0.3
        });

    }

    function _visibility(isvisible) {
        
        var _isVisible = isvisible;

        if (_isVisible) {
            
            Global.CONTAINER.element.add(_elem);

            _anim.tween({
                opacity: 0.8
            }, 0.4, 'Quart.EaseIn');

            if (!Device.mobile) {
                if (!Global.FULLBG.video.AMBIENT  || Global.WORK) {
                    _bg.tween({
                        opacity: 0.2
                    }, 0.4, 'Quart.EaseIn');
                } else {
                    _bg.css({
                        opacity: 0
                    })
                }
            }
            

            
            _runloop(true);

            
        
        } else {



            // _anim.tween({
            //     // scale: 2,
            //     opacity: 0
            // }, 0.4, 'Quart.EaseOut', null, function() {

                // _runloop(false);
                // _runloop(true);

                _isLooping = false;
                

                // _self.delayedCall(function() {

                // console.log(Global.CONTAINER)
                Global.CONTAINER.element.removeChild(_elem);

                // }, 600);

                
            // });
        }
        
    }

    function _runloop(islooping) {

        // console.log('run loop');
        // _self.delayedCall(function() {
            _isLooping = islooping;
            // console.log(_isLooping);

            if (_isLooping){
                _rotation += 360;
                _anim.tween({
                    rotation: _rotation
                }, 0.6, 'Linear.easeNone', null, function() {

                    if (_isLooping) {
                        _runloop(true);
                    }

                });
            } else {
                // _runloop(true);
                // _self.delayedCall(function() {
                    _runloop(false);
                // }, 600)
            }
        // });
    }

    this.animateIn = function (callback, parameters) {
        
        // _isVisible = true;
        var _callback   = callback;
        var _parameters = parameters;

        _visibility(true);
        
        if (_callback) {
            _callback(_parameters);
        }
        
    };
    this.animateOut = function (callback, parameters) {

        var _callback = callback;
        var _parameters = parameters;

        _visibility(false);
        
        if (_callback) {
            _self.delayedCall(function() {
                
                _callback(_parameters);

            }, 400);
        }

        if (!Device.mobile) {
            if (Global.FULLBG.video.AMBIENT) {
                _self.delayedCall(function() {
                    // Global
                    Global.FULLBG.coverOut();

                }, 400);
            }
        }

        
        
        
    };
    this.resize = function () {

        _centerH = Stage.height/2 - _size/2;
        _centerW = Stage.width/2 - _size/2;

        _anim.css({
            top: _centerH,
            left: _centerW,

        // }).bg('black');
        });
    };
}, 'singleton');
Class(function Container() {

	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_loader,
		_cover,
		_pageclass,
		_fullbg;
	
	Global.CONTAINER = this;

	(function() {
		_init();
		_onResize();
		_events();
		_preloadSite();
	})();

	function _init() {
		_elem.bg(Config.COLORS.black);
		Stage.add(_elem);
	}

	function _events(){
		Evt.resize(_onResize);
	}

	function _preloadSite() {
		_loader = _self.initClass(Loader, _onLoadComplete);
	}

	function _onLoadComplete() {
		if (Config.DEBUG.loader){ console.log('LOADER CALLBACK'); }

		// attempt to rescale the stage when mobile chrome is visible
		// on initial load only
		// seems hackish ¯\_(ツ)_/¯
		if (Device.mobile.phone){
			window.scrollTo( 0, 1 );
			var scrollTop = 1;

			setTimeout(function(){
				window.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
			}, 50);
		}

		// add cover
		_cover = _self.initClass(Cover);

		// set page state
		_pageState();
	}

	function _onResize() {
		_elem.size(Stage.width, Stage.height);
	}

	// SETS GLOBAL PAGES AND INITIALIZES
	// THAT PAGE NAME AS A CLASS
	function _pageState(pagename) {

		var _pagename = pagename;

		if (!_pagename) {
			_pagename = Data.STATE.page;
		}

		var className;

		// CURRENTLY, CLASSNAMES AND DATA STATE PAGE NAMES HAVE TO BE
		// THE SAME FOR PROPER ROUTING, SO:
		// _pagename/Global.PAGE must be the same as Data.STATE.page
		// ==========================================================
		// console.log(Data.STATE.page);
		
		switch (Data.STATE.page) {
			case 'home':
			default:
				className = Home;
				break;
		}

		Global.PAGE = _pagename;

		_fullbg = _self.initClass(FullBackground);
		_pageclass  = _self.initClass(className);
		
		_elem.add(_fullbg);
		_elem.add(_pageclass);
	}
	

	// THIS RUNS EVERY TIME THE PAGE STATE RUNS
	this.checkBrowserBack = function() {
		if (Global.PAGE.toLowerCase() != Data.STATE.page.toLowerCase() && _pageclass) {
			if(_pageclass.hasAnimateOut === true) {
				_pageclass.animateOut(function() {
					_pageclass = _pageclass.destroy();
					_pageState(Data.STATE.page);
				});
			} else {
				_pageState(Data.STATE.page);
			}
		}
	};

}, 'singleton');
Class(function Cover(){

	Inherit(this, Controller);
	
	var _self = this,
		_elem = _self.element,
		_title,
		_text;

	(function(){
		_init();
		_setSize();
		_events();
	})();

	function _init(){
		_elem.size("100%", "100%").bg(Config.COLORS.black).setZ(999999);

		_title = _elem.create('.covertitle');
		_title.size("90%", "auto").css({
			fontFamily: Config.FONTS.default.name,
			fontWeight: Config.FONTS.default.normal,
			color: Config.COLORS.white,
			left: "5%",
			top: "42%",
			textAlign: "center"
		});

		_title.text('SAMPLE SITE');

		_text = _elem.create('.covermessage');
		_text.size("90%", "auto").css({
			fontFamily: Config.FONTS.default.name,
			fontWeight: Config.FONTS.default.normal,
			color: Config.COLORS.white,
			left: "5%",
			top: "50%",
			textAlign: "center",
			lineHeight: "1.2em"
		});

		if (Mobile.version == 7.1) {
			_text.text("Please ugrade your mobile operating system or visit our site on your desktop browser.");
		} else {
			_text.text("Please make your browser window bigger.<br />Visit us on your mobile device to see the mobile optimized site.");
		}
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _setSize(){
		var titlesize = Stage.width*(22/400);
		var textsize = Stage.width*(15/400);

		_title.css({
			fontSize: titlesize+'px',
			letterSpacing: titlesize * Config.FONTS.default.spacing.titles + 'px',
            textIndent: titlesize * Config.FONTS.default.spacing.titles + 'px'
		});

		_text.size("90%", "auto").css({
			fontSize: textsize+'px'
		});


		if (!Device.mobile){
			if (Stage.width < 640 || Stage.height < 400){
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			} else{
				_elem.css({
					visibility: "hidden",
					opacity: 0
				});
			}
			
		} else {

			if (Mobile.os == 'Android') {
				if (Mobile.version < 4.4) {
					_elem.css({
						visibility: "visible",
						opacity: 1
					});
				} else {
					_elem.css({
						visibility: "hidden",
						opacity: 0
					});
				}
			}

			if (Mobile.os == 'iOS') {
				if (Mobile.version < 7.1) {
					_elem.css({
						visibility: "visible",
						opacity: 1
					});
				} else {
					_elem.css({
						visibility: "hidden",
						opacity: 0
					});
				}
			}

			if (Mobile.os != 'Android' && Mobile.os != 'iOS') {
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			}

			if (Stage.width < Stage.height){
				_text.text("Please rotate your device horizontal.");
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			}
			
		}
	}
});
Class(function FullBackground() {

	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_video,
		_image;

	Global.FULLBG = this;

	(function() {
		_init();
	})();

	function _init() {
		_elem.size('100%').css({
			overflow: 'hidden'
		}).setZ(1);

		if (!Device.mobile) {
			_self.video = _video = _self.initClass(FullBackgroundVideo);
		}

		_self.image = _image = _self.initClass(FullBackgroundImage);
	}

	function _swapBG() {

        if (Config.DEBUG.all || Config.DEBUG.fullbg) {
            console.log(Data.STATE.page.toLowerCase());
            console.log(_self.video.div.style.zIndex);
            console.log('==========================');
        }

        if (!Device.mobile) {
            _self.video.element.setProps({ opacity: 0 });
        }
        _self.image.element.setProps({ opacity: 0 });

        switch (Data.STATE.page.toLowerCase()) {
            case 'home':
            case '/':
            	// set video z-index above the image to show video bg on home page
                if (!Device.mobile) {
                    if (_self.video.AMBIENT) {
                        _self.video.element.setProps({ opacity: 1 });
                    } else {
                        _self.video.element.setProps({ opacity: 0 });
                    }
                    _self.video.element.setZ(2);
                }
                
                _self.image.element.setZ(1);
            	break;

            case 'whatever':
            	// some other page with an image bg
                _self.image.element.setProps({ opacity: 1 });
                _self.image.element.setZ(2);
                if (!Device.mobile) {
                    _self.video.element.setZ(1);
                }
            	break;
        }
    }

    this.swapBG = function(){
    	_swapBG();
    };
});
Class(function Home() {

    Inherit(this, Controller);
    Inherit(this, $slidelist);
    
    var _self = this,
        _elem = _self.element,
        _nav,
        _button;

    Global.HOME = this;

    (function() {
        _init();
        _events();
        _onResize();
        _animateIn();
    })();

    function _init() {
        _elem.setZ(10);

        /*_button = _elem.create('.button');
        _button.setProps({
            border: '5px solid '+Config.COLORS.white
        }).bg(Config.COLORS.test);*/

        // init slides
        for (var idx = 0; idx < 5; idx++){
            var test = _self.initClass(Test, idx);
            _self.slides.push(test);
        }
        _self.initSlides({
            orientation: 'vertical'
        });

        _nav = _self.initClass(Nav);
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
        // _button.interact(_onOver, _onOut, _onClick);
    }

    function _onOver(){
        _button.bg('#ff0000');
    }

    function _onOut(){
        _button.bg(Config.COLORS.test);
    }

    function _onClick(){
        Global.FULLBG.swapBG();
        Global.FULLBG.video.play();
    }

    function _onResize(){
        _elem.size(Stage.width, Stage.height);

        /*var buttonsize = Stage.width * (200/1920);
        _button.size(buttonsize, buttonsize).setProps({
            left: (Stage.width - buttonsize)/2,
            top: (Stage.height - buttonsize)/2
        });*/
    }

    function _animateIn(){
        Global.FULLBG.image.animateIn();
    }

    this.destroy = function() {
        this.__destroy();
    };
});
/**
 * Main Site Preloader
 * uses PreloadJS
 * see http://www.createjs.com/PreloadJS for demos and usage
 */

Class(function Loader(callback) {
	 
	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_preload,
		_loader,
		_loaderBar,
		_sizes = {},
		_images = Config.PRELOAD,
		_hidden;

	Global.LOADER = this;

	(function() {
		_init();
		_events();
	})();

	function _init() {
		_elem.setZ(200);

		// used for temporarily storing stuff that we are loading
		_hidden = _elem.create(".hidden");
		_hidden.css({
			opacity: 0
		});

		// instantiate new PreloadJS
		_preload = new createjs.LoadQueue();

		_preload.on("progress", _handleOverallProgress);
		_preload.setMaxConnections(5);

		_preload.on("fileload", _onFileLoaded);
		// _preload.on("fileprogress", _handleFileProgress);
		// _preload.on("error", _handleFileError);

		_renderFonts();

		_addLoader();
		_setSize();
		_animateIn();
	}

	function _addLoader(){
		_loader = _elem.create('.loader');
		_loader.setProps({
			opacity: 0
		});

		_loaderBar = _loader.create('.loaderbar');
		_loaderBar.bg(Config.COLORS.white);
	}

	function _animateIn(){
		_loader.tween({
			opacity: 1
		}, 0.5, Config.EASING.out, 0.25);

		_self.delayedCall(_loadAll, 250);
	}

	// load all assets
	function _loadAll() {
		if (_images.length > 0){
			// load each asset
			while (_images.length > 0) {
				var item = _images.shift();
				_preload.loadFile(item);
			}
		}else{
			// no assets to load
			_animateOut();
		}
	}

	// Overall progress handler
	function _handleOverallProgress(event) {
		if (Config.DEBUG.loader){ console.log('overall progress: ' + _preload.progress); }

		// adjust the length of the loader bar as assets are loaded
		_loaderBar.tween({
			width: _sizes.loaderwidth*_preload.progress
		}, 0.25, Config.EASING.out);

		// you can use the progress value to show text
		// _loaderText.text((Math.round(_preload.progress * 100)) + '%');

		// when finished loading, remove the loader
		if (_preload.progress == 1){
			_animateOut();
		}
	}

	function _onFileLoaded(event){
        // create an image object that will hold the source
        var img = _hidden.create('.img', 'img');
        img.div.src = event.result.src;

        var loaded = {
        	id:  event.item.id,
        	img: img
        };

        // put the image into our set of loaded assets
        Config.LOADED.push(loaded);
    }

	function _renderFonts() {
		for (var type in Config.FONTS){
			if (Config.FONTS.hasOwnProperty(type)){
				var render = _hidden.create('.a');
				render.text('a').setProps({
					fontFamily: Config.FONTS[type].name,
					fontSize: '12px',
					color: Config.COLORS.black
				});
			}
		}
	}

	function _animateOut() {
		_elem.tween({
			opacity: 0
		}, 1, Config.EASING.in, null, function(){
			// try to run the callback function
			if (typeof callback == 'function'){
				callback();
			}

			// remove the loader
			_self.delayedCall(function(){
				_self.__destroy();
			}, 500);
		});
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _setSize(){
		_elem.size(Stage.width, Stage.height);

		// set size values
        _sizes.loaderwidth = Stage.width * (1920/1920);
        _sizes.loaderheight = Stage.height * (1080/1080);
        _sizes.barheight = _sizes.loaderwidth * (30/1080);

        _loader.size(_sizes.loaderwidth, _sizes.loaderheight).setProps({
        	left: (Stage.width - _sizes.loaderwidth)/2,
        	top: (Stage.height - _sizes.loaderheight)/2
        });

        _loaderBar.setProps({
        	left: 0,
        	top: (_sizes.loaderheight - _sizes.barheight)/2,
        	height: _sizes.barheight
        });
	}
});
Class(function Start() {

	(function() {
    	Container.instance();
    	_transparentOutline();
	})();
    // console.log(Container.instance())
    // console.log('Start');
    // console.log(Mouse)
    // console.log(mouse)
    function _transparentOutline() {
        // console.log('MAIN :: ' + CSS._read());
        // console.log('DEVICE VENDOR :: ' + Device.vendor);
        // console.log(Mobile.os);
        // console.log(Mobile);

        if (Mobile.os !== 'Android') {

            // if (Device.browser.version >= 35 && Device.browser.version <= 36) {
                var _css = '* { outline: 1px solid transparent; }';
                CSS._write(_css);
            // }
            // var _css = CSS._read();
        }
    }
});
// var Start = new Start();