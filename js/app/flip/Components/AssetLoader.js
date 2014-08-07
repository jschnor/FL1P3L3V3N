Class(function AssetLoader(j) {
    Inherit(this, Component);

    // var c = this;
    var _self = this;
    var m = 0;
    var l = 0;
    var e, d, l;
    var f, g;

    (function () {
        e = new Array();
        g = new Array();
        k();
        setTimeout(h, 10)
    })();

    function k() {
        for (var o in j) {
            if (typeof j[o] !== "undefined") {
                // console.log('====================');
                // console.log('j[o]');
                // console.log(j[o]);
                // console.log('====================');
                m++;
                e.push(j[o])
            }
        }
    }

    function h() {
        d = Math.round(m * 0.5);
        for (var o = 0; o < d; o++) {
            a(e[o])
        }
    }

    function b() {
        if (e) {
            var r = [];
            for (var q = 0; q < e.length; q++) {
                var p = false;
                for (var o = 0; o < g.length; o++) {
                    if (g[o] == e[q]) {
                        p = true
                    }
                }
                if (!p) {
                    r.push(e[q])
                }
            }
            if (r.length) {
                console.log("AssetLoader Files Failed To Load:");
                console.log(r)
            }
        }
    }

    function a(s) {
        if (s) {
            var p = s.split("/");
            p = p[p.length - 1];
            var q = p.split(".");
            var r = q[q.length - 1].split("?")[0];
            switch (r) {
            case "html":
                XHR.get(s, function (u) {
                    Flip.HTML[q[0]] = u;
                    n(s)
                }, "text");
                break;
            case "js":
            case "php":
            case undefined:
                var o = document.createElement("script");
                o.type = "text/javascript";
                o.src = s;
                o.async = true;
                __body.addChild(o);
                XHR.get(s, function () {
                    setTimeout(function () {
                        n(s)
                    }, 100)
                }, "text");
                break;
            case "json":
                XHR.get(s, function (u) {
                    Flip.JSON[q[0]] = u;
                    n(s)
                });
                break;
            case "fs":
            case "vs":
            case "frag":
            case "vert":
                XHR.get(s, function (u) {
                    Flip.SHADERS[q[0] + "." + r] = u;
                    n(s)
                }, "text");
                break;
            default:
                var t = new Image();
                t.src = s;
                t.onload = function () {
                    n(s)
                };
                break
            }
        }
    }
    function i() {
        if (l == d && l < m) {
            var p = d;
            d *= 2;
            for (var o = p; o < d; o++) {
                if (e[o]) {
                    a(e[o])
                }
            }
        }
    }
    function n(o) {
        if (e) {
            l++;
            _self.events.fire(FlipEvents.PROGRESS, {
                percent: l / m
            });
            g.push(o);
            clearTimeout(f);
            i();
            if (l == m) {
                _self.complete = true;
                if (_self.events) {
                    _self.events.fire(FlipEvents.COMPLETE)
                }
            } else {
                f = setTimeout(b, 5000)
            }
        }
    }
    this.add = function (o) {
        m += o
    };
    this.trigger = function (o) {
        o = o || 1;
        for (var p = 0; p < o; p++) {
            n("trigger")
        }
    };
    this.destroy = function () {
        j = null;
        l = null;
        e = null;
        l = null;
        d = null;
        if (this._destroy) {
            return this._destroy()
        }
    }
});