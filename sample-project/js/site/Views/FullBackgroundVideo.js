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