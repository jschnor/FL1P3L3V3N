// workImage = url of the background image
// type = string, which type of data model to get
Class(function WorkDetail(workImage, type) {
    Inherit(this, View);

    var _self = this, _elem, _detailSection;
    //var n;
    var _prevDetailSection, _nextDetailSection, r, _closeButton, _direction;
    var workModel = type == "work" ? Data.WORK : Data.REELS;

    var w = 0;
    var l = new Vector2();
    var a = new Vector2();
    var u = new Vector2();
    var v = new Vector2();
    var x = new Vector2();
    var s = new Vector2();
    var L, o;

    (function () {
        _init();
        _getChildren();
        //_onResize();
        //Render.startRender(c);
        // J()
    })();

    function _init() {


        console.log('---------------------------');
        console.log('WORK DETAIL :: WorkImage');
        console.log(workImage);
        console.log(type);
        console.log(workModel)
        console.log('---------------------------');

        _elem = _self.element;

        _elem.size("100%").setZ(1);
        // if (FEDevice.PERFORMANCE < 1) {
            _elem.setZ(10);
        // }

    }

    function _getChildren() {
        //_closeButton = _self.initClass(CloseButton);
        _detailSection = _self.initClass(WorkDetailSection, workImage, type);

        var animDelay = Device.system.retina || Device.mobile ? 1030 : 800;
        
        if (FEDevice.PERFORMANCE < 1) {
            animDelay = 1280;
        }

        _self.delayedCall(_detailSection.animateIn, animDelay, true);
        //_self.delayedCall(_getNextPrevious, Global.WORK.transition.time * 1.1);
    }

    function _getNextPrevious() {
        console.log('workModel.getNext(workImage, -1)');
        console.log(workModel.getNext(workImage, -1));
        console.log('===================')
        _prevDetailSection = _self.initClass(WorkDetailSection, workModel.getNext(workImage, -1), true);
        Render.nextFrame(function () {
            _nextDetailSection = _self.initClass(WorkDetailSection, workModel.getNext(workImage, 1), true);
            if (_prevDetailSection.setTitle) {
                _prevDetailSection.setTitle(1);
            }
            if (_nextDetailSection.setTitle) {
                _nextDetailSection.setTitle(-1);
            }
            _onResize();
            H();
        })
    }

    // function J() {
    //     _self.delayedCall(Global.BORDER.hideBottom, 350);
    // }

    function c(N) {
        if (r) {
            return
        }
        a.lerp(l, 0.075);
        if (!Device.mobile) {
            if (N - l.time > 350) {
                l.y = 0;
            }
            if (!L && !Global.LAB) {
                if (Mouse.x || Mouse.y) {
                    if (Mouse.y < 70 && Mouse.x < Stage.width - 70) {
                        if (_direction != "up") {
                            l.y = 70 - Mouse.y;
                        }
                    } else {
                        if (Mouse.y > Stage.height - 70 && Mouse.x < Stage.width - 70) {
                            if (_direction != "down") {
                                l.y = Stage.height - 70 - Mouse.y;
                            }
                        } else {
                            l.y = 0;
                        }
                    }
                }
            }
            if (_direction) {
                if (_direction == "up") {
                    if (Mouse.y > 70) {
                        _direction = null;
                    }
                }
                if (_direction == "down") {
                    if (Mouse.y < Stage.height - 70) {
                        _direction = null;
                    }
                }
            }
            if (l.y < -Stage.height * 0.3) {
                I();
            }
            if (l.y > Stage.height * 0.3) {
                d();
            }
        }
        if (_detailSection.y == 0 && a.y == 0) {
            if (_prevDetailSection) {
                _prevDetailSection.pause();
            }
            if (_nextDetailSection) {
                _nextDetailSection.pause();
            }
        } else {
            _detailSection.scroll(a.y);
            if (_prevDetailSection) {
                _prevDetailSection.scroll(a.y + -(Stage.height - 7));
            }
            if (_nextDetailSection) {
                _nextDetailSection.scroll(a.y + Stage.height - 7);
            }
        }
    }

    function I(N) {
        if (r || !_nextDetailSection) {
            return;
        }
        N = N || 1000;
        r = "up";
        _nextDetailSection.tween(0, N);
        _nextDetailSection.animateIn(false, "bottom");
        _detailSection.tween(-Stage.height);
        _self.delayedCall(j, N);
        w = 0;
    }

    function d(N) {
        if (r || !_prevDetailSection) {
            return;
        }
        N = N || 1000;
        r = "down";
        _prevDetailSection.tween(0, N);
        _prevDetailSection.animateIn(false, "top");
        _detailSection.tween(Stage.height, N);
        _self.delayedCall(j, N + 500);
        w = 0;
    }

    function j() {
        _detailSection.deactivate();
        if (r == "up") {
            _prevDetailSection.destroy();
            _prevDetailSection = _detailSection;
            _detailSection = _nextDetailSection;
            _nextDetailSection = _self.initClass(WorkDetailSection, workModel.getNext(_detailSection.data, 1));
            _nextDetailSection.scroll(Stage.height);
        } else {
            _nextDetailSection.destroy();
            _nextDetailSection = _detailSection;
            _detailSection = _prevDetailSection;
            _prevDetailSection = _self.initClass(WorkDetailSection, workModel.getNext(_detailSection.data, -1));
            _prevDetailSection.scroll(-Stage.height);
        } if (_prevDetailSection.setTitle) {
            _prevDetailSection.setTitle(1);
        }
        if (_nextDetailSection.setTitle) {
            _nextDetailSection.setTitle(-1);
        }
        a.y = 0;
        l.y = 0;
        r = false;
        workImage = _detailSection.data;
        Global.WORK.target = workImage;
        L = false;
    }

    function H() {
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
        _closeButton.events.add(FEEvents.CLOSE, e);
        _self.events.subscribe(FEEvents.CLOSE_DETAIL, e);
        __window.bind("keydown", q);
        ScrollUtil.link(B);
        if (Device.mobile) {
            _elem.bind("touchstart", z);
        } else {
            _elem.bind("mousedown", i);
        }
    }

    function i() {
        if (Mouse.x > Stage.width - 70) {
            return false;
        }
        if (Mouse.y < 70) {
            _direction = "up";
            d();
        } else {
            if (Mouse.y > Stage.height - 70) {
                _direction = "down";
                I();
            }
        }
    }

    function e() {
        _self.closed = true;
        _closeButton.animateOut();
        _self.events.fire(FEEvents.CLOSE);
    }

    function z(N) {
        if (Global.WORK.blockDetailScroll || Global.LOADING_EXPERIMENT) {
            return;
        }
        v.copyFrom(N);
        w = 0;
        __window.bind("touchmove", k);
        __window.bind("touchend", t);
        __window.bind("touchcancel", t);
    }

    function k(N) {
        if (Global.WORK.blockDetailScroll) {
            return t();
        }
        u.subVectors(N, v);
        w++;
        if (w > 10) {
            l.y = u.y;
        }
        if (s.y) {
            x.subVectors(N, s);
            x.time = Date.now();
        }
        if (l.y < -Stage.height * 0.3) {
            I();
            t()
        }
        if (l.y > Stage.height * 0.3) {
            d();
            t();
        }
        s.copyFrom(N);
    }

    function t(O) {
        __window.unbind("touchmove", k);
        __window.unbind("touchend", t);
        __window.unbind("touchcancel", t);
        if (O && x.y) {
            x.divide(Date.now() - x.time || 1).multiply(10);
            var N = true;
            if (Mobile.phone) {
                u.subVectors(O, v);
                if (Math.abs(u.x) > 50 || Math.abs(u.y) < 10) {
                    N = false;
                }
            }
            if (N) {
                if (x.y < -10) {
                    I();
                }
                if (x.y > 10) {
                    d();
                }
            }
        }
        if (O) {
            l.y = 0
        }
        v.clear();
    }

    function q(N) {
        if (r) {
            return;
        }
        if (N.keyCode == 40) {
            I();
        }
        if (N.keyCode == 38) {
            d();
        }
        if (N.keyCode == 27) {
            if (_detailSection.detailOpen) {
                _detailSection.closeDetail()
            } else {
                e()
            }
        }
    }

    function B(O) {
        if (Global.FULLSCREEN) {
            return false
        }
        var N = Date.now();
        if (!r && w > 30 && N - l.time < 500) {
            return
        }
        l.last = l.time - N;
        l.y += -O;
        l.time = N;
        L = true;
        if (o) {
            clearTimeout(o)
        }
        o = setTimeout(function () {
            L = false
        }, 500);
        if (r) {
            w++
        } else {
            w = 0
        }
    }

    function _onResize() {
        if (_prevDetailSection) {
            _prevDetailSection.scroll(-Stage.height)
        }
        if (_nextDetailSection) {
            _nextDetailSection.scroll(Stage.height)
        }
    }
    this.animateOut = function (N) {
        __window.unbind("keydown", q);
        Render.stopRender(c);
        ScrollUtil.unlink(B);
        _detailSection.animateOut();
        _self.delayedCall(N, FEDevice.PERFORMANCE > 0 ? Global.WORK.transition.time : 1)
    };
    this.forceClose = function () {
        e()
    };

    // this.openDeeplink = function (N) {
    //     if (_prevDetailSection && _prevDetailSection.data == N) {
    //         d()
    //     }
    //     if (_nextDetailSection && _nextDetailSection.data == N) {
    //         I()
    //     }


    // };
    this.openDeeplink = function (N) {
        
        if (_prevDetailSection && _prevDetailSection.data == N) {
            d()
        }
        if (_nextDetailSection && _nextDetailSection.data == N) {
            I()
        }


        _self.delayedCall(function () {
            
            // for (var S = 0; S < _items.length; S++) {
                
            //     // items data
            //     if (_items[S].data == N) {
            //         console.log('===========================');
            //         console.log('_items[S].data');
            //         console.log(_items[S]);
            //         console.log(_items[S].data);
            //         console.log(Global.CURRENT_PAGE);
            //         // console.log(_glpg);
            //         console.log('===========================');

            //         _clickEvents({
            //             target: _items[S]
            //         }, true);

                    Global.CURRENT_PAGE.loadBackground(_items[S].data, _items[S].num);
                    Global.CURRENT_PAGE.bgresize();
                // }
            // }
        }, 500);        
    };



    this.destroy = function () {
        __window.unbind("keydown", q);
        Render.stopRender(c);
        ScrollUtil.unlink(B);
        return this._destroy()
    }
});