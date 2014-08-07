Class(function WorkListItem(work_item, index) {
    // work_image = the image source URL

    Inherit(this, View);
    
    // var o = this;
    var _self = this;
    // var f;
    var _elem;
    var _container, _hover, _playButton, _topHit, _bottomHit, new_fullBg;
    var e, margin, c, s; // e is the tint overlay, c is the halftone overlay
    var g, _text, preventHover = false; // g is video, text is text overlay
    // _self.parent._touchIncrement = -1;

    this.y = 0;
    this.active = true;
    this.data = work_item.main_image[0].urlPath;
    this.num = work_item.num;
    this.visible = true;
    
  //   this.dataCollection = {

		// title: Data.WORK.getData()[index].name,
		// image: work_image,
		// director: (Data.WORK.getData()[index].director !== null && typeof Data.WORK.getData()[index].director !== 'undefined') ? Data.WORK.getData()[index].director : 'director',
		// client: (Data.WORK.getData()[index].client !== null && typeof Data.WORK.getData()[index].client !== 'undefined') ? Data.WORK.getData()[index].client : 'network',
		// content: (Data.WORK.getData()[index].content !== null && typeof Data.WORK.getData()[index].content !== 'undefined') ? Data.WORK.getData()[index].content : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

  //   };

    // TO DO: MOVE THIS TO WORK MODEL
    this.dataCollection = {

        title: work_item.name,
        image: work_item.main_image[0].urlPath,
        director: (work_item.director !== null && typeof work_item.director !== 'undefined') ? work_item.director : '',
        client: (work_item.client !== null && typeof work_item.client !== 'undefined') ? work_item.client : '',
        main_category: (work_item.main_category !== null && typeof work_item.main_category !== 'undefined') ? Utils.urlstr(work_item.main_category) : '',
        content: (work_item.excerpt !== null && typeof work_item.excerpt !== 'undefined') ? work_item.excerpt : ''

    };
    
    (function () {

        _init();
        _initSlice();

        _addText();
        _addPlayButton();
    })();

    function _init() {
        /*console.log('===========================================');
        console.log('WORK LIST ITEM: init() - GLOBAL PARAMETER work_image is: ');
        console.log(work_image);
        console.log('===========================================');*/

        _elem = _self.element;
        
        _elem.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            outline: "1px solid transparent"
        });
        
        _container = _elem.create("container");
        _container.transform({
            //skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW,
            outline: "1px solid transparent"
        }).css({
            overflow: "hidden"
        });

        margin = _elem.create("margin");
        // margin.size("100%", 50).css({
        margin.size("100%", "3px").css({
            overflow: "hidden",
        }).setZ(1000);

        // create halftone overlay
        _halftone = _elem.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(6);
        
        // create tint overlay
        _tint = _elem.create("overlay");
        _tint.size("100%").bg(Config.COLORS.black).css({
            opacity: 0.45
        }).setZ(7);

        margin.bg = margin.create("bg");
        margin.bg = margin.bg.size("100%").bg(Config.COLORS.black).css({
            outline: "1px solid transparent"
        }).setZ(2000);
        // create initial background
        // for (var ii in _dataSet) {

        //     for ( var j = 0; j < _dataSet[ii].main_image.length; j++ ) {

        //         if (_dataSet[ii].main_image[j]) {

                    // console.log( _dataSet[ii].main_image[j].urlPath );
                    

        //             return;

        //         }
        //     }
        // }
        _loadBackground( work_item.main_image[0].urlPath, index);
        _self.events.subscribe(FlipEvents.RESIZE, _positionBackground);

    }

    function _initSlice() {
        //background: -moz-linear-gradient(top,  rgba(81,235,228,0.54) 0%, rgba(65,223,211,1) 33%, rgba(34,201,181,1) 100%); /* FF3.6+ */
        //background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(81,235,228,0.54)), color-stop(33%,rgba(65,223,211,1)), color-stop(100%,rgba(34,201,181,1))); /* Chrome,Safari4+ */
        //background: -webkit-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* Chrome10+,Safari5.1+ */
        //background: -o-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* Opera 11.10+ */
        //background: -ms-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* IE10+ */
        //background: linear-gradient(to bottom,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* W3C */
        //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8a51ebe4', endColorstr='#22c9b5',GradientType=0 ); /* IE6-9 */

        // create the hover overlay
        //var gradient = "";
        //var box_shadow = "";
        
        // gradient based on browser
        /*if (Device.vendor !== ""){
            gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%)";
        }else{
            gradient = "linear-gradient(to bottom,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%)";
        }*/
        
        _hover = _container.create("hoveroverlay");
        _hover.size("100%", 0).css({
            background: Config.COLORS.slicegradient,
            bottom: 0
        });
        
        
        // box shadow based on browser
        switch (Device.vendor){
            case "moz":
            _hover.css({
                mozBoxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            case "webkit":
            _hover.css({
                webkitBoxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            case "ms":
            case "o":
            _hover.css({
                boxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            default:
            _hover.css({
                boxShadow: Config.COLORS.sliceinnerglow
            });
            break;
        }
       
        // not sure what cover is or how it's related to performance
        /*if (FEDevice.PERFORMANCE > 0 && (Global.LAB || Device.mobile)) {
            _hover.cover = _hover.create("cover");
            // _hover.cover.size("100%").bg(Config.COLORS.branding).transform({
            _hover.cover.bg(Config.COLORS.branding).transform({
                z: 1
            }).setZ(9).css({
                // BG OPACITY
                // opacity: 0
                opacity: 1
            });
        }*/
        
        if (FEDevice.PERF_TIME > 0 || (Mobile.os == "Android" && Mobile.browser == "Chrome")) {
            // _initAltSlice();
        }
        
        /*e = _elem.create("overlay");
        e.bg(Config.IMAGES + "work/overlay.png").css({
        // e.bg(Config.IMAGES + "work/black.jpg").css({
            opacity: 0.3
        }).setZ(2).transform({
            z: 1
        });*/
        /*c = _elem.create(".halftone");
        c.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(2).transform({
            z: 1
        });*/
        // :: WorkListItemVideo
        // g = _self.initClass(WorkListItemVideo, work_image, null);
        // _hover.add(g);
        // s = _elem.create(".gradient");
        // s.size("100%").css({
        //     width: 800
        // }).bg(Config.IMAGES + "work/gradient.png").setZ(2).transform({
        //     z: 1
        // });
        // _self.bg = _hover;
        
    }
    function _loadBackground(_img, _ind) {

        new_fullBg = _elem.create("fullbg").css({
            opacity: 0
        });

        new_fullBg.css({
            background: ""
        }).setZ(5);

        new_fullBg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        new_fullBg.add(new_fullBg.canvas);

        new_fullBg.texture      = new Image();
        new_fullBg.texture.src  = FEDevice.getAsset(_img, "jpg");

        new_fullBg.index = _ind;

        new_fullBg.texture.onload = function () {

            _bgIsSet = true;

            new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0);
            _positionBackground();

            new_fullBg.tween({
                opacity: 1
            }, 800, 'easeOutQuad', null, _self.destroyBG);

        };
    }

    function _positionBackground() {

        // TODO: FIGURE OUT ASPECT AND SET IT FOR OUR IMAGES
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        new_fullBg.canvas.size(_wdth, _hght);
        new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0, _wdth, _hght);

        // console.log('HOME :: _positionBackground(): new_fullBg: '+new_fullBg);
        // console.log(new_fullBg);
        // console.log(Mobile.os);
        // console.log(Mobile)


        // USED TO HELP CENTER
        // if (Mobile.os == "iOS") {
        //     new_fullBg.object.center();
        // } else {
        // new_fullBg.css({
        //     top: Stage.height / 2 - _hght / 2,
        //     left: FEDevice.width / 2 - _wdth / 2
        // });
        new_fullBg.css({
            top: Stage.height / 2 - _hght / 2,
            left: FEDevice.width / 2 - _wdth / 2
        }).transform({
            y: 0,
        });
        // }

    }
    // create canvas and adds slice background image
    // unused in this application
    // function _initAltSlice() {
    //     /*console.log('===================================');
    //     console.log('WORK LIST ITEM: _initAltSlice()');
    //     console.log('Draws canvas, gets jpg');
    //     // console.log(work_image)
    //     // console.log(_hover)
    //     console.log('===================================');*/

    //     _hover.css({
    //         background: ""
    //     });
    //     _hover.canvas = _self.initClass(Canvas, 100, 100, null);
    //     _hover.add(_hover.canvas);
    //     _hover.texture = new Image();
    //     _hover.texture.src = FEDevice.getAsset(work_item.main_image[0].urlPath, "jpg");

    //     _hover.texture.onload = function () {
    //         // B LOADED!
    //         // _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height);
    //         _hover.canvas.context.drawImage(_hover.texture, 0, 0);
    //     };
    // }

    function _addText() {
        // _text = _self.initClass(WorkListItemText, _self.dataCollection);
        // _text.element.interact(_hoverActions, _clickDetailActions);
    }

    function _hoverActions(mouseevent){
        if (Device.mobile) {
            // no hover on touch devices
            return;
        }
        
        if (preventHover === true || !_self.visible) {
            return false;
        }
        
        if (mouseevent.action == "over"){
            if (_self.parent.lastHovered != index){
                if (_self.parent.lastHovered !== false){
                    // trigger out state of previous slice
                    _self.parent.hoverSlice("out");
                }

                // trigger over state of current slice
                _self.parent.lastHovered = index;
                _self.parent.hoverSlice("over");
            }
        }
    }

    function _clickDetailActions(){
        // CURRENTLY DISABLE FOR CLIENT
        // WHILE WE'RE IN DEV
        // alert('Click to detail still in development');
        // return;
        console.log('=============================');
        console.log('WorkListItem ::');
        console.log('_initClickActions():');
        console.log(work_item.main_image[0].urlPath);
        console.log('=============================');

        if (Device.mobile) {
            
            
            // if (!_touchIncrement){
                console.log('WORK LIST ITEM :: index: ' + index);
                console.log('WORK LIST ITEM :: _touchIncrement: ' + _self.parent._touchIncrement);
                console.log(_self);
                
                

                if (_self.parent._touchIncrement != index) {

                    if (_self.parent.lastHovered !== false){
                        // trigger out state of previous slice
                        _self.parent.hoverSlice("out");
                        _self.parent._touchIncrement = -1;

                    }

                    // trigger over state of current slice
                    _self.parent.lastHovered = index;
                    _self.parent.hoverSlice("over");

                    

                    // console.log(index)

                    _self.parent._touchIncrement = index;

                    return;
                }

            /*} else {
                _touchIncrement = 0;
            }*/
            
        }

        

        
        if (!Global.CAN_CLICK) {
            return false;
        }
        preventHover = true;

        _self.events.fire(FlipEvents.CLICK, {
            data: work_item.main_image[0].urlPath,
            target: _self
        });

        if (FEDevice.PERFORMANCE > 0) {
            // _text.hide();
            if (!Device.mobile && !Device.browser.safari) {
                // BACKGROUND OFF
                _hover.css({
                    opacity: 0
                });
            } else {
                _self.delayedCall(function () {
                    // BACKGROUND OFF
                    _hover.css({
                        opacity: 0
                    });
                }, 100);
            }
        }
        _self.visible = false;
    }

    function _clickPlayActions(){
        _self.events.fire(FEEvents.VIDEO_LOAD, {
            index: index
        });
    }
    
    function _addPlayButton() {
        // _playButton = _self.initClass(WorkListItemPlay);
        // _playButton.element.interact(null, _clickPlayActions);
    }

    this.resize = function (t, u) {
        this.height = t;
        this.barHeight = ~~ (t * 0.56);
        var v = ~~ (FEDevice.width * 1.15);
        var t = ~~ (v * Config.ASPECT);

        if (u && Mobile.tablet && FEDevice.PERFORMANCE === 0) {
            _self.delayedCall(function () {
                _hover.size(v, t - 1).center();
                _elem.size(FEDevice.width, _self.barHeight);
                _container.size(FEDevice.width, _elem.height);
                //e.size(_elem.width, _elem.height);
                if (g) {
                    g.resize(v, t);
                }
                // _text.resize();
                // _playButton.resize();
            }, u * (FEDevice.PERF_TIME ? 50 : 250));
        } else {
            _hover.size(v, t - 1).center();
            _elem.size(FEDevice.width, this.barHeight);
            _container.size(FEDevice.width, _elem.height);
            //e.size(_elem.width, _elem.height);
            if (g) {
                g.resize(v, t);
            }
            // WORK LIST ITEM TEXT REFERENCE
            // _text.resize()
        }
        if (_hover.canvas) {
            _hover.canvas.size(v, t);
            _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height);
        }
        
        
    };
    
    // resize the element by width for vertical slices
    this.resizeWidth = function (width, index) {
    	this.width = width;
        this.barWidth = ~~ (width * 0.56);
        var v = ~~ (FEDevice.height * 1.15);
        var width = ~~ (v * Config.ASPECT);
        
        // if (index && Mobile.tablet && FEDevice.PERFORMANCE === 0) {
        //     _self.delayedCall(function () {
        //         //_hover.size(width - 1, v).center();
        //         _elem.size(_self.barWidth, FEDevice.height);
        //         _container.size(_elem.width, FEDevice.height);
        //         //e.size(_elem.width, _elem.height);
        //         if (g) {
        //             g.resize(width, v);
        //         }

        //         //_topHit.resize();
        //         //_bottomHit.resize();
                
        //         // resize text element
        //         _text.resize(_self.barWidth);
        //         _playButton.resize(_self.barWidth);
        //     }, index * (FEDevice.PERF_TIME ? 50 : 250));
        // } else {
            //_hover.size(width - 1, v).center();
            _elem.size(this.barWidth, FEDevice.height);
            _container.size(_elem.width, FEDevice.height);
            //e.size(_elem.width, _elem.height);
            if (g) {
                g.resize(width, v);
            }

            //_topHit.resize();
            //_bottomHit.resize();
            
            // resize text element
            // _text.resize(_self.barWidth);
            // _playButton.resize(_self.barWidth);
        // }
        if (_hover.canvas) {
            _hover.canvas.size(width, v);
            // THIS SQUISHES THE IMAGE...SO DON'T DO IT
            // _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height)
            _hover.canvas.context.drawImage(_hover.texture, 0.5, 0);
        } 

        
        // if (Global.CURRENT_PAGE.container.children()[index] == index) {
        //     // console.log()    
        //     console.log('Global.CURRENT_PAGE.container.children()[index]');
        //     console.log(Global.CURRENT_PAGE.container.children()[index]);
        
        // }


    };
    
    // position()
    // u = y position
    // t = index?
    this.positionY = function (u, t) {
        _elem.y = this.y = ~~u;
        if (t && Mobile.tablet && FEDevice.PERFORMANCE == 0) {
            _self.delayedCall(function () {
                _elem.transform()
            }, t * (FEDevice.PERF_TIME ? 60 : 300))
        } else {
            _elem.transform();
        }
    };
    
    // set slice's X position for vertical slices
    // this.positionX = function(x_pos, index){
    //     _elem.x = this.x = ~~x_pos;
        
    //     if (index && Mobile.tablet && FEDevice.PERFORMANCE == 0){
    //         _self.delayedCall(function () {
    //             _elem.transform();
    //         }, index * (FEDevice.PERF_TIME ? 60 : 300));
    //     }else{
    //         _elem.transform();
    //     }
    // };

    this.over = function(){
        // slide up hover
        _hover.stopTween().tween({
            height: "100%"
        }, 400, "easeInOutQuad");
        
        Global._timeout = setTimeout(function(){

            // MOVED THIS FUNCTIONALITY TO WORK.JS SO
            // BACKGROUNDS AREN'T MAPPED TO EACH LIST ITEM
            /*console.log('=========================');
            console.log(Global.CURRENT_PAGE);
            console.log(work_item.main_image[0].urlPath);
            console.log(index);
            console.log(work_item.num);
            console.log('=========================');*/

            Global.CURRENT_PAGE.loadBackground(work_item.main_image[0].urlPath, work_item.num);
            Global.CURRENT_PAGE.bgresize();

        }, 600);

        //console.log(_text);
        // trigger text rollover action
        // _text.over();
        
        // trigger play button rollover
        // _playButton.over();
    };

    this.out = function(){
        // slide down hover
        _hover.stopTween().tween({
            height: 0
        }, 300, "easeOutQuad");

        clearTimeout(Global._timeout);

        // trigger text rollover action
        // _text.out();

        // trigger play button rollover
        // _playButton.out();
    };
    
    this.parallax = function (w) {
        /*var t = w + this.y;
        var u = this.height / 2;
        var v = t - (Stage.height / 2);
        _hover.y = v * FEDevice.PARALLAX_MULTIPLIER;
        if (FEDevice.PARALLAX_ITEMS) {
            _hover.transform()
        }*/
    };
    
    // this.getY = function () {
    //     return this.y + _hover.y
    // };
    
    this.getX = function () {
        //return this.x + _hover.x
        return this.x;
    };
    
    this.setMargin = function (u) {
        var t = (u - this.barWidth) + 3;
        margin.size(t, "100%");
        margin.bg.size("100%");
        _elem.size(_elem.width + t, _elem.height);
    };

    // params.openthis = boolean, true if we're opening this one, otherwise we're moving it over
    // params.unskew = boolean, true if we're unskewing everything
    // params.x = integer, how much to move item
    // params.expand = integer, if we're expanding it, the new width of the element
    this.animateOpen = function(params){
        preventHover = true;

        var animTime = Global.CURRENT_PAGE.transition.time*0.4;
        var tweenparams = {
            x: params.x
        };

        if (params.unskew){
            tweenparams.skewX = 0;

            //_text.unskew();
        }

        if (params.openthis){
            tweenparams.width = params.expand;

            _self.delayedCall(function(){
                _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            }, animTime);

            _container.tween({
                opacity: 0
            }, animTime, Global.CURRENT_PAGE.transition.ease);

            // _text.tween({
            //     opacity: 0
            // }, animTime, Global.CURRENT_PAGE.transition.ease);

            // _playButton.tween({
            //     opacity: 0
            // }, animTime, Global.CURRENT_PAGE.transition.ease);

            _hover.tween({
                opacity: 0
            }, animTime, Global.CURRENT_PAGE.transition.ease);
        }else{
            _self.delayedCall(function(){
                _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            }, animTime);
        }

        /*if (params.openthis){
            tweenparams.width = params.expand;
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            // tween interior elements
            _container.tween({
                width: tweenparams.width
            }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            _playButton.animateWidth(tweenparams.width);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }*/
    };

    // params.closethis = boolean, true if we're closing this one, otherwise we're moving it over
    // params.skew = boolean, true if we're skewing everything
    // params.x = integer, how much to move item
    // params.contract = integer, if we're contracting it, the new width of the element
    this.animateClose = function(params){
        var animTime = Global.CURRENT_PAGE.transition.time*0.4;
        var tweenparams = {
            x: params.x
        };

        if (params.skew){
            tweenparams.skewX = (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW;

            // _text.skew();
        }

        if (params.closethis){
            tweenparams.width = params.contract;
            
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            
            _self.delayedCall(function(){
                _container.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);

                // _text.tween({
                //     opacity: 0
                // }, animTime, Global.CURRENT_PAGE.transition.ease);

                _playButton.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);

                _hover.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);
            }, animTime);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }

        /*if (params.closethis){
            tweenparams.width = params.contract;
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            // tween interior elements
            _container.tween({
                width: tweenparams.width
            }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            _playButton.animateWidth(tweenparams.width);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }*/

        preventHover = false;
    };

    this.disable = function () {
        _hoverActions({
            action: "out"
        });
    };
    this.resume = function (t) {
        if (t) {
            preventHover = false;
            _hover.clearAlpha();
        }
        // g.resume();
        /*e.visible().css({
            opacity: 0.5
        });*/
        _hover.stopTween().visible().clearAlpha();
        if (!Device.mobile) {
            _hover.show();
        }
        _self.visible = true;
    };
    this.resumeText = function (t) {
        if (t) {
            // _text.animateIn()
        } else {
            // _text.show()
        }
    };
    this.resumeActive = function () {
        // g.resume();
        preventHover = false;
        _self.visible = true;
        if (FEDevice.PERFORMANCE > 0) {
            _hover.stopTween().visible().clearAlpha();
            //e.visible();
            if (_hover.cover) {
                _hover.cover.css({
                    opacity: 1
                }).tween({
                    opacity: 0
                }, 300, "easeOutCubic");
            }
            if (Mobile.phone) {
                g.element.css({
                    opacity: 0
                });
            }
            if (FEDevice.width > Stage.height) {
                /*e.css({
                    opacity: 0
                }).tween({
                    opacity: 0.5
                }, 300, "easeOutCubic");*/
                /*c.css({
                    opacity: 0
                }).tween({
                    opacity: 1
                }, 300, "easeOutCubic");*/
                s.css({
                    opacity: 0
                }).tween({
                    opacity: 1
                }, 300, "easeOutCubic");
            } else {
                /*e.css({
                    opacity: 0.5
                });*/
                /*c.css({
                    opacity: 1
                });*/
                s.css({
                    opacity: 1
                });
            }
        } else {
            _hover.stopTween().visible().clearAlpha();
            /*e.css({
                opacity: 0.5
            });*/
            /*c.css({
                opacity: 1
            });*/
            s.css({
                opacity: 1
            });
        }
    };
    this.incoming = function () {
        if (FEDevice.PERFORMANCE > 0) {
            _hover.invisible()
        }
        //e.invisible();
        /*e.css({
            opacity: 0
        });*/
        /*c.css({
            opacity: 0
        });*/
        s.css({
            opacity: 0
        });
    }
});