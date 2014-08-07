Class(function Color(b) {
    Inherit(this, Component);
    var f = this;
    this.r = 1;
    this.g = 1;
    this.b = 1;
    (function () {
        e(b)
    })();

    function e(g) {
        if (g instanceof Color) {
            d(g)
        } else {
            if (typeof g === "number") {
                c(g)
            }
        }
    }
    function d(g) {
        f.r = g.r;
        f.g = g.g;
        f.b = g.b
    }
    function c(g) {
        g = Math.floor(g);
        f.r = (g >> 16 & 255) / 255;
        f.g = (g >> 8 & 255) / 255;
        f.b = (g & 255) / 255
    }
    function a(i, h, g) {
        if (g < 0) {
            g += 1
        }
        if (g > 1) {
            g -= 1
        }
        if (g < 1 / 6) {
            return i + (h - i) * 6 * g
        }
        if (g < 1 / 2) {
            return h
        }
        if (g < 2 / 3) {
            return i + (h - i) * 6 * (2 / 3 - g)
        }
        return i
    }
    this.set = function (g) {
        e(g);
        return this
    };
    this.setRGB = function (j, i, h) {
        this.r = j;
        this.g = i;
        this.b = h;
        return this
    };
    this.setHSL = function (j, i, g) {
        if (i === 0) {
            this.r = this.g = this.b = g
        } else {
            var m = g <= 0.5 ? g * (1 + i) : g + i - (g * i);
            var k = (2 * g) - m;
            this.r = a(k, m, j + 1 / 3);
            this.g = a(k, m, j);
            this.b = a(k, m, j - 1 / 3)
        }
        return this
    };
    this.getStyle = function () {
        return "rgb(" + ((this.r * 255) | 0) + "," + ((this.g * 255) | 0) + "," + ((this.b * 255) | 0) + ")"
    };
    this.getHex = function () {
        return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0
    };
    this.getHexString = function () {
        return ("000000" + this.getHex().toString(16)).slice(-6)
    };
    this.add = function (g) {
        this.r += g.r;
        this.g += g.g;
        this.b += g.b
    };
    this.mix = function (g, h) {
        this.r = this.r * (1 - h) + (g.r * h);
        this.g = this.g * (1 - h) + (g.g * h);
        this.b = this.b * (1 - h) + (g.b * h)
    };
    this.addScalar = function (g) {
        this.r += g;
        this.g += g;
        this.b += g
    };
    this.multiply = function (g) {
        this.r *= g.r;
        this.g *= g.g;
        this.b *= g.b
    };
    this.multiplyScalar = function (g) {
        this.r *= g;
        this.g *= g;
        this.b *= g
    };
    this.clone = function () {
        return new Color().setRGB(this.r, this.g, this.b)
    }
});