Class(function Canvas(c, e, j) {
    Inherit(this, Component);
    var g = this;
    var n, d, h;
    this.children = [];
    this.offset = {
        x: 0,
        y: 0
    };
    this.retina = j;
    (function () {
        if (j instanceof FlipObject) {
            k(j)
        } else {
            f()
        }
        g.width = c;
        g.height = e;
        a(c, e, j)
    })();

    function k() {
        var o = "c" + Utils.timestamp();
        g.context = document.getCSSCanvasContext("2d", o, c, e);
        g.background = "-" + Device.styles.vendor.toLowerCase() + "-canvas(" + o + ")";
        j.css({
            backgroundImage: g.background
        });
        j = null
    }
    function f() {
        g.div = document.createElement("canvas");
        g.context = g.div.getContext("2d");
        g.object = $(g.div)
    }
    function a(o, r, p) {
        var q = (p ? (window.devicePixelRatio || 1) : 1);
        if (g.div) {
            g.div.width = o * q;
            g.div.height = r * q
        }
        g.width = o;
        g.height = r;
        g.scale = q;
        if (g.object) {
            g.object.size(g.width, g.height)
        }
        if (Device.system.retina && p) {
            g.context.scale(q, q);
            g.div.style.width = o + "px";
            g.div.style.height = r + "px"
        }
    }
    function m(q) {
        q = Utils.touchEvent(q);
        q.x += g.offset.x;
        q.y += g.offset.y;
        q.width = 1;
        q.height = 1;
        var p;
        for (var o = g.children.length - 1; o > -1; o--) {
            p = g.children[o].hit(q)
        }
        return p
    }
    function b(p) {
        var o = m(p);
        h = o;
        if (Device.mobile) {
            o.events.fire(FlipEvents.HOVER, {
                action: "over"
            }, true);
            o.__time = Date.now()
        }
    }
    function i(p) {
        var o = m(p);
        if (!Device.mobile) {
            if (o && d) {
                if (o != d) {
                    d.events.fire(FlipEvents.HOVER, {
                        action: "out"
                    }, true);
                    o.events.fire(FlipEvents.HOVER, {
                        action: "over"
                    }, true);
                    d = o
                }
            } else {
                if (o && !d) {
                    d = o;
                    o.events.fire(FlipEvents.HOVER, {
                        action: "over"
                    }, true)
                } else {
                    if (!o && d) {
                        d.events.fire(FlipEvents.HOVER, {
                            action: "out"
                        }, true);
                        d = null
                    }
                }
            }
        }
    }
    function l(p) {
        var o = m(p);
        if (!Device.mobile) {
            if (o && o == h) {
                o.events.fire(FlipEvents.CLICK, {
                    action: "click"
                }, true)
            }
        } else {
            h.events.fire(FlipEvents.HOVER, {
                action: "out"
            }, true);
            if (o == h) {
                if (Date.now() - h.__time < 750) {
                    o.events.fire(FlipEvents.CLICK, {
                        action: "click"
                    }, true)
                }
            }
        }
        h = null
    }
    this.set("interactive", function (o) {
        if (!n && o) {
            g.object.bind("touchstart", b);
            g.object.bind("touchmove", i);
            g.object.bind("touchend", l)
        } else {
            if (n && !o) {
                g.object.unbind("touchstart", b);
                g.object.unbind("touchmove", i);
                g.object.unbind("touchend", l)
            }
        }
        n = o
    });
    this.get("interactive", function () {
        return n
    });
    this.toDataURL = function () {
        return g.div.toDataURL()
    };
    this.sort = function () {
        _objects.sort(function (p, o) {
            return p.z - o.z
        })
    };
    this.render = function (q) {
        if (!(typeof q === "boolean" && q)) {
            g.clear()
        }
        var o = g.children.length;
        for (var p = 0; p < o; p++) {
            g.children[p].render()
        }
    };
    this.clear = function () {
        g.context.clearRect(0, 0, g.div.width, g.div.height)
    };
    this.add = function (o) {
        o._canvas = this;
        o._parent = this;
        this.children.push(o);
        o._z = this.children.length
    };
    this.remove = function (p) {
        p._canvas = null;
        p._parent = null;
        var o = this.children.indexOf(p);
        if (o) {
            this.children.splice(o, 1)
        }
    };
    this.destroy = function () {
        for (var o = 0; o < this.children.length; o++) {
            if (this.children[o].destroy) {
                this.children[o].destroy()
            }
        }
        return this._destroy()
    };
    this.startRender = function () {
        Render.startRender(g.render)
    };
    this.stopRender = function () {
        // console.log('stopRender')
        Render.stopRender(g.render)
    };
    this.texture = function (p) {
        var o = new Image();
        o.src = p;
        return o
    };
    this.size = a
});
