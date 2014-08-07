Class(function Utils() {
    // console.log('< STATIC UTILS >')
    var d = this;
    if (typeof Float32Array == "undefined") {
        Float32Array = Array
    }
    function a(e) {
        e = parseInt(e, 10);
        if (isNaN(e)) {
            return "00"
        }
        e = Math.max(0, Math.min(e, 255));
        return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16)
    }
    function c(f, e) {
        return b(Math.random(), f, e)
    }
    function b(f, g, e) {
        return g + (e - g) * f
    }
    this.doRandom = function (f, e) {
        return Math.round(c(f - 0.5, e + 0.5))
    };
    this.headsTails = function (f, g) {
        var e = d.doRandom(0, 1);
        if (!e) {
            return f
        } else {
            return g
        }
    };
    this.toDegrees = function (e) {
        return e * (180 / Math.PI)
    };
    this.toRadians = function (e) {
        return e * (Math.PI / 180)
    };
    this.findDistance = function (h, g) {
        var f = g.x - h.x;
        var e = g.y - h.y;
        return Math.sqrt(f * f + e * e)
    };
    this.timestamp = function () {
        var e = Date.now() + d.doRandom(0, 99999);
        return e.toString()
    };
    this.rgbToHex = function (f, e, g) {
        return a(f) + a(e) + a(g)
    };
    this.hexToRGB = function (f) {
        var e = [];
        f.replace(/(..)/g, function (g) {
            e.push(parseInt(g, 16))
        });
        return e
    };
    this.getBackground = function (f) {
        var e = f.css("backgroundImage");
        if (e.length) {
            e = e.replace('("', "(");
            e = e.replace('")', ")");
            e = e.split("(");
            e = e[1].slice(0, -1)
        }
        return e
    };
    this.hitTestObject = function (k, j) {
        var f = k.x,
            o = k.y,
            p = k.width,
            l = k.height;
        var s = j.x,
            i = j.y,
            n = j.width,
            r = j.height;
        var e = f + p,
            m = o + l,
            q = s + n,
            g = i + r;
        if (s >= f && s <= e) {
            if (i >= o && i <= m) {
                return true
            } else {
                if (o >= i && o <= g) {
                    return true
                }
            }
        } else {
            if (f >= s && f <= q) {
                if (i >= o && i <= m) {
                    return true
                } else {
                    if (o >= i && o <= g) {
                        return true
                    }
                }
            }
        }
        return false
    };
    this.randomColor = function () {
        var e = "#" + Math.floor(Math.random() * 16777215).toString(16);
        if (e.length < 7) {
            e = this.randomColor()
        }
        return e
    };
    this.touchEvent = function (g) {
        var f = {};
        f.x = 0;
        f.y = 0;
        if (!g) {
            return f
        }
        if (g.touches || g.changedTouches) {
            if (g.changedTouches.length) {
                f.x = g.changedTouches[0].pageX;
                f.y = g.changedTouches[0].pageY
            } else {
                f.x = g.touches[0].pageX;
                f.y = g.touches[0].pageY
            }
        } else {
            f.x = g.pageX;
            f.y = g.pageY
        }
        return f
    };
    this.clamp = function (f, g, e) {
        return Math.min(Math.max(f, g), e)
    };
    this.nullObject = function (e) {
        if (e.destroy) {
            for (var f in e) {
                if (typeof e[f] !== "undefined") {
                    e[f] = null
                }
            }
        }
        return null
    };
    this.convertRange = function (f, i, g, k, h) {
        var j = (g - i);
        var e = (h - k);
        return (((f - i) * e) / j) + k
    };

    // take a string and convert it for use in a url
    this.urlstr = function(string){
        var str = string.replace(/ /g, "-").toLowerCase();
        var _str = str.replace(/:/g, "");

        return _str;
    };

    this.stripDashes = function(string){
        return string.replace(/-/g, " ").toLowerCase();
    };

    this.stripUnderscore = function(string){
        return string.replace(/_/g, " ").toLowerCase();
    };

    String.prototype.strpos = function (e) {
        return this.indexOf(e) != -1
    };
    String.prototype.clip = function (f, e) {
        return this.length > f ? this.slice(0, f) + e : this
    }
}, "Static");