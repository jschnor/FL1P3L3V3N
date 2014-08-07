Class(function CanvasGraphics(h, c) {
    Inherit(this, CanvasObject);
    var e = this;
    var j = {};
    var d = [];
    var a, f;
    this.width = h || 0;
    this.height = c || 0;
    (function () {
        i()
    })();

    function b(l) {
        for (var k in j) {
            var m = j[k];
            if (m instanceof Color) {
                l[k] = m.getHexString()
            } else {
                l[k] = m
            }
        }
    }
    function i() {
        a = new ObjectPool(Array, 25)
    }
    function g() {
        var l = a.get();
        for (var k = 0; k < arguments.length; k++) {
            l[k] = arguments[k]
        }
        d.push(l)
    }
    this.set("strokeStyle", function (k) {
        j.strokeStyle = k
    });
    this.get("strokeStyle", function () {
        return j.strokeStyle
    });
    this.set("fillStyle", function (k) {
        j.fillStyle = k
    });
    this.get("fillStyle", function () {
        return j.fillStyle
    });
    this.set("lineWidth", function (k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function () {
        return j.lineWidth
    });
    this.set("lineWidth", function (k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function () {
        return j.lineWidth
    });
    this.set("lineCap", function (k) {
        j.lineCap = k
    });
    this.get("lineCap", function () {
        return j.lineCap
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("miterLimit", function (k) {
        j.miterLimit = k
    });
    this.get("miterLimit", function () {
        return j.miterLimit
    });
    this.set("font", function (k) {
        j.font = k
    });
    this.get("font", function (k) {
        return j.font
    });
    this.set("textAlign", function (k) {
        j.textAlign = k
    });
    this.get("textAlign", function (k) {
        return j.textAlign
    });
    this.set("textBaseline", function (k) {
        j.textBaseline = k
    });
    this.get("textBaseline", function (k) {
        return j.textBaseline
    });
    this.draw = function (m) {
        if (this.isMask() && !m) {
            return false
        }
        var l = this._canvas.context;
        this.startDraw();
        b(l);
        for (var k = 0; k < d.length; k++) {
            var o = d[k];
            if (!o) {
                continue
            }
            var n = o.shift();
            l[n].apply(l, o);
            o.unshift(n)
        }
        this.endDraw();
        if (f) {
            l.save();
            l.clip();
            f.render(true);
            l.restore()
        }
    };
    this.clear = function () {
        for (var k = 0; k < d.length; k++) {
            d[k].length = 0;
            a.put(d[k])
        }
        d.length = 0
    };
    this.arc = function (m, p, n, l, o, k) {
        if (m && !p) {
            n = m;
            m = 0;
            p = 0
        }
        m = m || 0;
        p = p || 0;
        n = n || 0;
        n -= 90;
        k = k || false;
        o = o || 0;
        o -= 90;
        l = l ? l : this.radius || this.width / 2;
        g("beginPath");
        g("arc", m, p, l, Utils.toRadians(o), Utils.toRadians(n), k)
    };
    this.quadraticCurveTo = function (m, l, k, n) {
        g("quadraticCurveTo", m, l, k, n)
    };
    this.bezierCurveTo = function (m, l, o, n, k, p) {
        g("bezierCurveTo", m, l, o, n, k, p)
    };
    this.fillRect = function (k, n, l, m) {
        g("fillRect", k, n, l, m)
    };
    this.clearRect = function (k, n, l, m) {
        g("clearRect", k, n, l, m)
    };
    this.strokeRect = function (k, n, l, m) {
        g("strokeRect", k, n, l, m)
    };
    this.moveTo = function (k, l) {
        g("moveTo", k, l)
    };
    this.lineTo = function (k, l) {
        g("lineTo", k, l)
    };
    this.stroke = function () {
        g("stroke")
    };
    this.fill = function () {
        if (!f) {
            g("fill")
        }
    };
    this.beginPath = function () {
        g("beginPath")
    };
    this.closePath = function () {
        g("closePath")
    };
    this.fillText = function (m, k, n, l) {
        g("fillText", m, k, n, l)
    };
    this.strokeText = function (m, k, n, l) {
        g("strokeText", m, k, n, l)
    };
    this.mask = function (k) {
        if (!k) {
            return f = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var n = this._parent.children;
        var m = false;
        for (var l = 0; l < n.length; l++) {
            if (k == n[l]) {
                m = true
            }
        }
        if (m) {
            f = k;
            k.masked = this;
            for (l = 0; l < d.length; l++) {
                if (d[l][0] == "fill" || d[l][0] == "stroke") {
                    d[l].length = 0;
                    a.put(d[l]);
                    d.splice(l, 1)
                }
            }
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});
