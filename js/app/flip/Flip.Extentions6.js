(function () {
    // console.log('SIXTH CALL')
    // console.log(':: touchswipe and click events')
    $.fn.touchSwipe = function (i, c) {
        if (!window.addEventListener) {
            return this
        }
        var d = this;
        var a = 75;
        var k, j;
        var f = false;
        var e = Device.mobile;
        var l = {};
        if (e) {
            if (!c) {
                if (this._events.touchswipe) {
                    this.touchSwipe(null, true)
                }
                this.div.addEventListener("touchstart", b);
                this.div.addEventListener("touchend", h);
                this.div.addEventListener("touchcancel", h);
                this._events.touchswipe = true
            } else {
                this.div.removeEventListener("touchstart", b);
                this.div.removeEventListener("touchend", h);
                this.div.removeEventListener("touchcancel", h);
                this._events.touchswipe = false
            }
        }
        function b(m) {
            var n = Utils.touchEvent(m);
            m.preventDefault();
            if (!d.div) {
                return false
            }
            if (m.touches.length == 1) {
                k = n.x;
                j = n.y;
                f = true;
                d.div.addEventListener("touchmove", g)
            }
        }
        function g(o) {
            if (!d.div) {
                return false
            }
            if (f) {
                var p = Utils.touchEvent(o);
                var n = k - p.x;
                var m = j - p.y;
                l.direction = null;
                l.moving = null;
                l.x = null;
                l.y = null;
                if (Math.abs(n) >= a) {
                    h();
                    if (n > 0) {
                        l.direction = "left"
                    } else {
                        l.direction = "right"
                    }
                } else {
                    if (Math.abs(m) >= a) {
                        h();
                        if (m > 0) {
                            l.direction = "up"
                        } else {
                            l.direction = "down"
                        }
                    } else {
                        l.moving = true;
                        l.x = n;
                        l.y = m
                    }
                }
                if (i) {
                    i(l)
                }
            }
        }
        function h(m) {
            if (!d.div) {
                return false
            }
            k = j = f = false;
            d.div.removeEventListener("touchmove", g)
        }
        return this
    };
    $.fn.touchClick = function (f, l, c) {
        if (!window.addEventListener) {
            return this
        }
        var d = this;
        var n, m;
        var e = Device.mobile;
        var h = this;
        var b = {};
        var g = {};
        if (f === null && l === true) {
            c = true
        }
        if (!c) {
            if (this._events.touchclick) {
                this.touchClick(null, null, true)
            }
            this._events.touchclick = true;
            if (e) {
                this.div.addEventListener("touchmove", i, false);
                this.div.addEventListener("touchstart", a, false);
                this.div.addEventListener("touchend", j, false)
            } else {
                this.div.addEventListener("mousedown", a, false);
                this.div.addEventListener("mouseup", j, false)
            }
        } else {
            if (e) {
                this.div.removeEventListener("touchmove", i, false);
                this.div.removeEventListener("touchstart", a, false);
                this.div.removeEventListener("touchend", j, false)
            } else {
                this.div.removeEventListener("mousedown", a, false);
                this.div.removeEventListener("mouseup", j, false)
            }
            this._events.touchclick = false
        }
        function i(o) {
            if (!d.div) {
                return false
            }
            g = Utils.touchEvent(o);
            if (Utils.findDistance(b, g) > 20) {
                m = true
            } else {
                m = false
            }
        }
        function k(o) {
            var p = Utils.touchEvent(o);
            o.touchX = p.x;
            o.touchY = p.y;
            b.x = o.touchX;
            b.y = o.touchY
        }
        function a(o) {
            if (!d.div) {
                return false
            }
            n = Date.now();
            o.preventDefault();
            o.action = "over";
            o.object = d.div.className == "hit" ? d.parent() : d;
            k(o);
            if (f) {
                f(o)
            }
        }
        function j(q) {
            if (!d.div) {
                return false
            }
            var p = Date.now();
            var o = false;
            q.object = d.div.className == "hit" ? d.parent() : d;
            k(q);
            if (n && p - n < 750) {
                if (Mouse._preventClicks) {
                    return false
                }
                if (l && !m) {
                    o = true;
                    q.action = "click";
                    if (l && !m) {
                        l(q)
                    }
                    if (Mouse.autoPreventClicks) {
                        Mouse.preventClicks()
                    }
                }
            }
            if (f) {
                q.action = "out";
                if (!Mouse._preventFire) {
                    f(q)
                }
            }
            m = false
        }
        return this
    }
})();