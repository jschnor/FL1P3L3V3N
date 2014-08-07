Class(function CanvasValues(a) {
    Inherit(this, Component);
    var d = this;
    var c = {};
    var b = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (!a) {
        this.data = new Float32Array(6)
    } else {
        this.styled = false
    }
    this.set("shadowOffsetX", function (e) {
        d.styled = true;
        c.shadowOffsetX = e
    });
    this.get("shadowOffsetX", function () {
        return c.shadowOffsetX
    });
    this.set("shadowOffsetY", function (e) {
        d.styled = true;
        c.shadowOffsetY = e
    });
    this.get("shadowOffsetY", function () {
        return c.shadowOffsetY
    });
    this.set("shadowBlur", function (e) {
        d.styled = true;
        c.shadowBlur = e
    });
    this.get("shadowBlur", function () {
        return c.shadowBlur
    });
    this.set("shadowColor", function (e) {
        d.styled = true;
        c.shadowColor = e
    });
    this.get("shadowColor", function () {
        d.styled = true;
        return c.shadowColor
    });
    this.get("values", function () {
        return c
    });
    this.setTRSA = function (f, k, h, j, i, g) {
        var e = this.data;
        e[0] = f;
        e[1] = k;
        e[2] = h;
        e[3] = j;
        e[4] = i;
        e[5] = g
    };
    this.calculate = function (g) {
        var f = g.data;
        var e = this.data;
        e[0] = e[0] + f[0];
        e[1] = e[1] + f[1];
        e[2] = e[2] + f[2];
        e[3] = e[3] * f[3];
        e[4] = e[4] * f[4];
        e[5] = e[5] * f[5]
    };
    this.calculateStyle = function (g) {
        if (!g.styled) {
            return false
        }
        this.styled = true;
        var e = g.values;
        for (var f in e) {
            if (!c[f]) {
                c[f] = e[f]
            }
        }
    };
    this.hit = function (e) {
        b.x = this.data[0];
        b.y = this.data[1];
        b.width = e.width;
        b.height = e.height;
        return b
    }
});
