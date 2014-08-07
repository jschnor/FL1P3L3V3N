Class(function Swipe() {
    // console.log('SWIPE EVENTS')
    var c;
    var b, a;
    this.max = 0;
    this.width = 100;
    this.currentSlide = 0;
    this.saveX = 0;
    this.currentX = 0;
    this.threshold = 0.1;
    this.minDist = 10;
    this.disableY = false;
    this._values = new Object();
    this.__slide = function (e) {
        var f = c.currentSlide;
        c.currentSlide += e;
        var d = -c.currentSlide * c.slideWidth;
        c.swipeContainer.tween({
            x: d
        }, 500, "easeOutCubic");
        c.currentX = d;
        if (f != c.currentSlide && c.slideComplete) {
            c.slideComplete(c.currentSlide)
        }
    };
    this.__start = function (d) {
        if ((!Device.mobile || d.touches.length == 1) && !a) {
            c.swiping = true;
            c.swipeContainer.stopTween();
            c._values.x = Utils.touchEvent(d).x;
            c._values.time = Date.now();
            if (Device.mobile) {
                __window.bind("touchmove", c.__move)
            } else {
                __window.bind("mousemove", c.__move)
            }
            if (c.disableY) {
                b = d.touches[0].pageY
            }
        }
    };
    this.__move = function (g) {
        if ((!Device.mobile || g.touches.length == 1) && !a) {
            if (c.disableY) {
                var i = Utils.touchEvent(g).y;
                if (Math.abs(i - b) > 25) {
                    a = true;
                    if (Device.mobile) {
                        __window.unbind("touchmove", c.__move)
                    } else {
                        __window.unbind("mousemove", c.__move)
                    }
                }
            }
            var d = Utils.touchEvent(g).x;
            var f = d - c._values.x;
            var h = c.saveX + f;
            if (h > 0) {
                f /= 2;
                c._values.snap = "left"
            } else {
                if (h < c.max) {
                    f /= 2;
                    c._values.snap = "right"
                } else {
                    c._values.snap = null
                }
            }
            c.currentX = c.saveX + f;
            c.swipeContainer.x = c.currentX;
            c.swipeContainer.transform();
            if (c.move) {
                c.move(c.currentX, c.currentSlide)
            }
        }
    };
    this.__end = function (j) {
        c.swiping = false;
        if (Device.mobile) {
            __window.unbind("touchmove", c.__move)
        } else {
            __window.unbind("mousemove", c.__move)
        }
        a = false;
        if (a) {
            c.__slide(0)
        } else {
            if (c._values.snap) {
                var f = 0;
                if (c._values.snap == "right") {
                    f = c.max
                }
                c.swipeContainer.tween({
                    x: f
                }, 500, "easeOutCubic");
                c.currentX = f;
                c._values.snap = null
            } else {
                var d = -(c.slideWidth * c.currentSlide + c.slideWidth / 2);
                var i = d + c.slideWidth;
                if (c.currentX < d) {
                    c.__slide(1)
                } else {
                    if (c.currentX > i) {
                        c.__slide(-1)
                    } else {
                        var h = Date.now();
                        var l = Utils.touchEvent(j).x - c._values.x;
                        var k = h - c._values.time;
                        var g = l / k;
                        if (Math.abs(l) >= c.minDist && Math.abs(g) > c.threshold) {
                            if (g < 0) {
                                c.__slide(1)
                            } else {
                                c.__slide(-1)
                            }
                        } else {
                            c.__slide(0)
                        }
                    }
                }
            }
        }
        c._values.x = c._values.time = null;
        c.saveX = c.currentX
    };
    this.addListeners = function (d) {
        c = this;
        c.slideWidth = c.width / c.slides;
        c.max = -c.width + c.slideWidth;
        c.swipeContainer = d;
        d.transform({
            x: 0
        });
        if (Device.mobile) {
            d.bind("touchstart", c.__start);
            __window.bind("touchend", c.__end);
            __window.bind("touchcancel", c.__touchCancel)
        } else {
            d.bind("mousedown", c.__start);
            __window.bind("mouseup", c.__end)
        }
    };
    this.removeListeners = function () {
        var d = c.swipeContainer;
        if (Device.mobile) {
            d.unbind("touchstart", c.__start);
            __window.unbind("touchend", c.__end);
            __window.unbind("touchcancel", c.__touchCancel)
        } else {
            d.unbind("mousedown", c.__start);
            __window.unbind("mouseup", c.__end)
        }
    }
});