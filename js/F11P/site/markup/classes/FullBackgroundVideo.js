function FullBackgroundVideo() {

    Inherit(this, $class);

    var _self = this;
    var _elem, _video, _img;
    var _seek, _playpause, _fullscreen, _close, 
        _vidtime, _scrubbar, _scrubline, _startX, _diff,
        _fadecontrols;
    
    var _isPlaying      = false;
    var _isAmbient      = false;
    var _seekDown       = false;
    var _scrollamount   = 100;
    var _seekvalue      = 0;
    var _ppWidth        = 100;
    var _fsWidth        = 100;
    var _clWidth        = 100;
    var _skWidth        = 100;

    var _isTransition;


    (function() {

        // console.log('FULL BG VIDEO');

        _init();
        // _positionBackground();
        _eventSubscription();

        // console.log(Mobile);
        // console.log('OS: '+Mobile.os);
        // console.log('Version: '+Mobile.version);

    })();

    function _init() {
        _elem = _self.element;
        _elem.size('100%').css({

            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            opacity: 0
            
        }).bg('#000000');

        _video = _elem.create('.video', 'video');

        _video.size('100%').transform({
            scale: 1
        }).css({
            opacity: 0
        });
    }

    function _ambient(filename) {
        
        // console.log('AMBIENT')

        Evt.removeEvent(_video.div, 'canplay', _onFullVideoPlay);
        Evt.removeEvent(_video.div, 'ended', _onFullVideoEnd);

        _video.div.src      = !filename ? Utils.getAsset('Flip11_Reel_103114', 'video') : Utils.getAsset(filename, 'video');

        
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
        // if (!_isPlaying) {
        // _isPlaying = true;
        if (!_isAmbient) {

            _isAmbient = _self.AMBIENT = true;
            _isPlaying = false;
            
            // Global.FULLBG.coverOut();

            if (Config.DEBUG.all || Config.DEBUG.fullbg) {
                console.log('VIDEO BG :: _ambient : canplay');
            }

            // animate it in anyways since safari
            // waits to swap z-index
            _video.tween({
                opacity: 1
            }, 1, 'Quart.EaseOut');
            // }
        }
    }

    function _onFullVideoPlay() {

        // console.log('_onFullVideoPlay :: _isPlaying: '+_isPlaying);

        // _isPlaying = false;

        if (!_isPlaying) {

            _isPlaying = true;
            _isAmbient = _self.AMBIENT = false;

            if (_isTransition) {
                _self.delayedCall(_closeVideo, 4500);
            }

            if (_elem) {
                // Device.mobile ? _elem.css({ opacity: 1 }) : _elem.css({ opacity: 0 });
                _elem.css({ opacity: 0 });
            }
            if (_video) {
                _video.css({ opacity: 1 });
            }
            if (_close) {
                _close.css({ opacity: 0 });
            }
            if (_playpause) {
                _playpause.css({ opacity: 0 });
            }
            if (_seek) {
                _seek.css({ opacity: 0 });
            }
            if (_scrubbar) {
                _scrubbar.css({ opacity: 0 });
            }
            if (_fullscreen) {
                _fullscreen.css({ opacity: 0 });
            }
            if (Config.DEBUG.all || Config.DEBUG.fullbg) {
                console.log('VIDEO BG :: play : canplay');
            }

            _elem.tween({
                opacity: 1
            }, 0.6, 'Quart.EaseOut', null, function() {

                // Animate Out
                //Transition.instance().animateOut();
                // Evt.removeEvent(_video.div, 'ended', _onFullVideoEnd);
                if (_close) {
                    _close.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                }
                if (_playpause) { 
                    _playpause.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                }
                if (_seek) {
                    _seek.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                }
                if (_scrubbar) {
                    _scrubbar.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                }
                if (_fullscreen) {
                    _fullscreen.tween({ opacity: 0.4 }, 0.6, 'Quart.EaseOut');
                }

            });
        }


        
    }
    function _onFullVideoEnd(e) {

        // console.log(e);
        // console.log('VIDEO ENDED');
        _self.delayedCall(_closeVideo, 2000);
        // _isPlaying = false;
        

    }

    function _positionBackground() {

        var _wdth;
        var _hght;
        

        switch(_isTransition) {
            case true:
                
                // This is for the transition/bg video
                _wdth       = ~~ (Stage.width * 1.25);
                _hght       = ~~ (_wdth * Config.ASPECT);

                if (_hght < Stage.height) {
                    // _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
                    _hght   = Stage.height;
                    _wdth   = _hght / Config.ASPECT;
                }

                _wdth       = ~~_wdth;
                _hght       = ~~_hght;

                _video.size(_wdth, _hght).css({
                    top: 0,
                    left: Stage.width / 2 - _wdth / 2,
                    backgroundSize: '100% 100%',

                });

            break;
            case false:

                // This is for the video player
                if ((Stage.height/Stage.width) < Config.ASPECT) {

                    _hght       = Stage.height;
                    _wdth       = ~~ (_hght * 1920/1080);

                    _wdth       = ~~_wdth;
                    _hght       = ~~_hght;

                    _video.size(_wdth, _hght).css({
                        top: Stage.height / 2 - _hght / 2,
                        left: Stage.width / 2 - _wdth / 2,

                    });

                } else {
                    
                    _wdth       = Stage.width;
                    _hght       = ~~ (_wdth * Config.ASPECT);

                    _wdth       = ~~_wdth;
                    _hght       = ~~_hght;

                    _video.size(_wdth, _hght).css({
                        top: Stage.height / 2 - _hght / 2,
                        left: Stage.width / 2 - _wdth / 2,

                    });
                }

            break;
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
        // var imgPath = '/jd/healthalliance/assets/images/';
        if (!_isTransition) {

            if (!Device.mobile) {

                _playpause = _elem.create('.playpause');
                _playpause.size(_ppWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/pause_button.png').setZ(10000).css({
                    top: Stage.height - _ppWidth,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 0,
                    // border: '1px solid white'
                });

                _fullscreen = _elem.create('.fullscreen');
                // _fullscreen.size(_ppWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/pause_button.png').setZ(10000).css({
                _fullscreen.size(_fsWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/expand_button.png').setZ(10000).css({
                    top: Stage.height - _fsWidth,
                    left: Stage.width - _fsWidth,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 0,
                    // border: '1px solid white'
                });

                _close = _elem.create('.close');
                _close.size(_clWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/cancel_button.png').css({
                    left: Stage.width - _clWidth,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0,
                    cursor: "pointer",
                    // border: '1px solid white'
                }).setZ(10000);

                _seek = _elem.create('.seek');
                _seek.size(_skWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/scrubber.png').css({
                    left: _ppWidth - (_skWidth/2),
                    top: Stage.height - _skWidth,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    // opacity: 0.4
                    opacity: 0
                    // border: '1px solid white'
                }).setZ(10001);

                _scrubbar = _elem.create('.scrubbar');
                _scrubbar.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 100).css({
                    left: _ppWidth,
                    top: Stage.height - 100,
                    opacity: 0,
                    overflow: 'hidden'
                    // border: '1px solid red'
                }).setZ(10000);

                _scrubline = _scrubbar.create('.line');
                _scrubline.size(Stage.width - (_ppWidth + (_skWidth/2) + (_fsWidth/2)), 4).bg('white').css({
                    top: 50-2,
                    // borderRight: '1px solid #666666',
                    borderBottom: '1px solid #666666'
                    // opacity: 0.4,
                    // border: '1px solid red'
                });

                // Evt.subscribe(_close.div, Evt.CLICK, _closeVideo);
                // Evt.subscribe(_close.div, Evt.MOUSE_OVER, _onButtonOver);
                // Evt.subscribe(_close.div, Evt.MOUSE_OUT, _onButtonOut);
                _close.interact(_onButtonOver, _onButtonOut, _closeVideo);


                Evt.subscribe(_elem, Evt.MOUSE_MOVE, _onMouseMove);

                Evt.subscribe(_fullscreen.div, Evt.CLICK, _onFullscreenClick);

                // console.log('_video.div');
                // console.log(_video.div);

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

                // Evt.subscribe(_video.div, 'ended', _onFullVideoEnd);

            } else {

                // Evt.subscribe(_video.div, 'timeupdate', function() {
                //     if (_video.div.paused === true || _video.div.ended === true) {
                //         // _isPlaying = true;
                //         console.log(_isPlaying);
                //     } else {
                //         // _isPlaying = false;
                //         console.log(_isPlaying);
                //     }
                // });
                

                _video.div.controls = true;

                _close = _elem.create('.close');
                _close.size(_clWidth, 100).bg(Config.ASSETS.path + '/images/videoplayer/cancel_button.png').css({
                    left: Stage.width - _clWidth,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0,
                    cursor: "pointer",
                    // border: '1px solid white'
                }).setZ(100000);

                _close.interact(_onButtonOver, _onButtonOut, _closeVideo);


                    // Evt.subscribe(_close.div, Evt.MOUSE_OVER, _onButtonOver);
                    // Evt.subscribe(_close.div, Evt.MOUSE_OUT, _onButtonOut);
                    // Evt.subscribe(_elem, Evt.MOUSE_MOVE, _onMouseMove);
                // }


            }

            

        }

    }
    function _eventSubscription() {

        Evt.resize(_onResize);

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
        // console.log(e);

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
            _playpause.bg(Config.ASSETS.path + '/images/videoplayer/pause_button.png');
            _isPlaying = true;

        } else {
            // Pause the video
            _video.div.pause();
            // Update the button image to 'Pause'
            _playpause.bg(Config.ASSETS.path + '/images/videoplayer/play_button.png');
            _isPlaying = false;

        }
    }
    function _onFullscreenClick(e) {


        // Global.FULLSCREEN = true;
        // Device.openFullscreen(_elem);
        // console.log(Device.getFullscreen());
        // console.log(_close);
        // _close.hide();
        // Device.getFullscreen()
        // console.log('_onFullscreenClick: '+Device.getFullscreen());

        if (Device.getFullscreen()) {
            Device.closeFullscreen();
            
            Global.FULLSCREEN = false;

            // _elem.size('100%');
            // _video.transform({
            //     scale: 1.05
            // });
            _close.visible();

            _fullscreen.bg(Config.ASSETS.path + '/images/videoplayer/expand_button.png');
            // _fullscreen.css({
            //     top: Stage.height - _fsWidth,
            //     left: Stage.width - _fsWidth,
            // });
            // clearInterval(q);
            // g.show();
            
            // _close.setZ(10000);
            _onResize();
            // _video.div.controls = false;
            // c.css({
            //     top: ""
            // });
        } else {
            Device.openFullscreen(_elem);

            // _elem.size('100%');
            // _video.transform({
            //     scale: 0.95
            // });

            Global.FULLSCREEN = true;

            _fullscreen.bg(Config.ASSETS.path + '/images/videoplayer/exit_full_screen_button.png');

            _elem.css({
                top: 0
            });
            // console.log(_close)
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
            left: _seekvalue,
            // opacity: 0.4
        });

        
    }
    function _checkForEnd() {
        // console.log(_video.div.ended);
        if (_video.div.ended) {
            // _closeVideo();
        }
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
        // console.log('paused: '+_video.div.paused);
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

        if (!_isTransition && !Device.mobile) {

            _close.tween({
                opacity: 0
            }, 0.5, 'Quart.EaseOut');

            _playpause.tween({
                opacity: 0
            }, 0.5, 'Quart.EaseOut');
            
            _seek.tween({
                opacity: 0
            }, 0.5, 'Quart.EaseOut');
        }

        _elem.tween({
            opacity: 0
        }, 1, 'Quart.EaseOut');

        _video.tween({
            opacity: 0
        }, 0.5, 'Quart.EaseOut', null, function() {
            // _elem.setZ(0);
            // _ambient();
            // if (!_isTransition) {
            
            _isPlaying = false;

            if (!_isTransition && !Device.mobile) {
                
                

                // Evt.removeEvent(_close.div, Evt.CLICK, _closeVideo);
                // Evt.removeEvent(_close.div, Evt.MOUSE_OVER, _onButtonOver);
                // Evt.removeEvent(_close.div, Evt.MOUSE_OUT, _onButtonOut);
                _close.removeInteract(_onButtonOver, _onButtonOut, _closeVideo);

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

            } else {

                // _isPlaying = false;
                // Evt.removeEvent(_video.div, 'timeupdate', _checkForEnd);

                // pause before we remove so the built in controls return to the play position
                if (Device.mobile.tablet) {
                    _video.div.pause();
                }
                

                _close.removeInteract(_onButtonOver, _onButtonOut, _closeVideo);


                // console.log(_isPlaying);
                // Evt.removeEvent(_video.div, 'timeupdate', function() {

                //     if (_video.div.paused === true || _video.div.ended === true) {

                //         _isPlaying = true;

                //     } else {

                //         _isPlaying = false;

                //     }

                // });

                _elem.setZ(0);
                _elem.css({
                    opacity: 0
                });
            }

        });

        
        
        // if (Global.FULLSCREEN) {
        //     // Global.FULLBG.coverOut();
        //     if (!Device.getFullscreen()) {
        //         _elem.setZ(2);
        //         _video.div.src = '';
        //     } else {
        //         _onFullscreenClick();
        //         _ambient();
        //     }
        // }

        _self.delayedCall(function(){
            _elem.setZ(0);
            _video.div.src = '';
        }, 1000);
        
    }
    this.onFocus = function() {
        if(_isPlaying) {
            _video.div.play();
        }
    };
    this.onBlur = function() {
        if(_isPlaying) {
            _video.div.pause();
        }
    };
    this.ambient = function(video) {
        if (video) {
            _ambient(video);
        } else {
            _ambient();
        }
    }
    this.swapZ = function() {

        _elem.setZ(9999);

    }

    this.play = function(video) {

        // this.AMBIENT = false;

        _isTransition = (video == 'mirrorme-portal') ? true : false;

        // Transition.instance().animateIn();
        // console.log('PLAY');

        _positionBackground();

        _video.div.src      =  Utils.getAsset(video, 'video');
        // _video.div.volume   = _videoname == 'mirrorme-portal' ? 0 : 1;
        _video.div.volume   = _isTransition ? 1 : 1;
        _video.div.autoplay = true;
        _video.div.loop     = false;
        // _video.div.controls = Device.mobile.tablet ? true : false;
        _video.div.controls = false;

        // Device.mobile ? console.log('is mobile') : console.log('is not mobile');
        // Device.mobile.tablet ? console.log('tablet') : console.log('not a tablet');

        

        if (Device.mobile) {
            
            _onFullVideoPlay();


        } else {

            Evt.removeEvent(_video.div, 'canplay', _onAmbientVideoPlay);
            Evt.removeEvent(_video.div, 'canplay', _onFullVideoPlay);

            Evt.subscribe(_video.div, 'canplay', _onFullVideoPlay);
        }
        // Evt.subscribe(_video.div, 'ended', function(e) { console.log('ended'); });
        

        _activateVideo();
        // });
        _elem.setZ(9999);
    };
};
