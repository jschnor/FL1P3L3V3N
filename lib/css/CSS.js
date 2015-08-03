Class(function CSS() {
    var g = this;
    var f, b, a;
    bit.ready(function () {
        b = "";
        f = document.createElement("style");
        f.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(f);
    });

    function d(j) {
        var i = j.match(/[A-Z]/);
        var k = i ? i.index : null;
        if (k) {
            var l = j.slice(0, k);
            var h = j.slice(k);
            j = l + "-" + h.toLowerCase();
        }
        return j;
    }
    function e(j) {
        var i = j.match(/\-/);
        var l = i ? i.index : null;
        if (l) {
            var m = j.slice(0, l);
            var h = j.slice(l).slice(1);
            var k = h.charAt(0);
            h = h.slice(1);
            h = k.toUpperCase() + h;
            j = m + h;
        }
        return j;
    }
    function c() {
        TweenLite.ticker.removeEventListener('tick', c);
        f.innerHTML = b;
        a = false;
    }
    this._read = function () {
        return b;
    };
    this._write = function (h) {
        b = h;
        if (!a) {
            a = true;

            TweenLite.ticker.addEventListener('tick', c);
            // Render.nextFrame(c);
        }
    };
    this._toCSS = d;
    this.style = function (h, k) {
        var j = h + " {";
        for (var i in k) {
            var m = d(i);
            var l = k[i];
            if (typeof l !== "string" && i != "opacity") {
                l += "px";
            }
            j += m + ":" + l + "!important;";
        }
        j += "}";
        f.innerHTML += j;
    };
    this.get = function (k, h) {
        var q = new Object();
        var n = f.innerHTML.split(k + " {");
        for (var m = 0; m < n.length; m++) {
            var o = n[m];
            if (!o.length) {
                continue;
            }
            var p = o.split("!important;");
            for (var l in p) {
                if (p[l].strpos(":")) {
                    var r = p[l].split(":");
                    if (r[1].slice(-2) == "px") {
                        r[1] = Number(r[1].slice(0, -2));
                    }
                    q[e(r[0])] = r[1];
                }
            }
        }
        if (!h) {
            return q;
        } else {
            return q[h];
        }
    };
    this.textSize = function (k) {
        var j = k.clone();
        j.css({
            position: "relative",
            cssFloat: "left",
            styleFloat: "left",
            marginTop: -99999,
            width: "",
            height: ""
        });
        __body.addChild(j);
        var i = j.div.offsetWidth;
        var h = j.div.offsetHeight;
        j.remove();
        return {
            width: i,
            height: h
        };
    };
    this.prefix = function (h) {
        return Device.styles.vendor === "" ? h[0].toLowerCase() + h.slice(1) : Device.styles.vendor + h;
    };
}, 'static');