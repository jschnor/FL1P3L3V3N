Class(function ObjectPool(b, d) {
    // console.log('< OBJECT POOL >')
    Inherit(this, Component);
    var c = this;
    var a = [];
    this.limit = Math.round(d * 1.25);
    (function () {
        if (b) {
            d = d || 10;
            b = b || Object;
            for (var e = 0; e < d; e++) {
                a.push(new b())
            }
        }
    })();
    this.get = function () {
        if (!a.length && a.length < c.limit) {
            a.push(new b())
        }
        return a.shift()
    };
    this.empty = function () {
        a = []
    };
    this.put = function (e) {
        if (e) {
            a.push(e)
        }
    };
    this.insert = function (f) {
        if (typeof f.push === "undefined") {
            f = [f]
        }
        for (var e = 0; e < f.length; e++) {
            a.push(f[e])
        }
    };
    this.destroy = function () {
        for (var e = 0; e < a.length; e++) {
            if (a[e].destroy) {
                a[e].destroy()
            }
        }
        a = null;
        return this._destroy()
    }
});