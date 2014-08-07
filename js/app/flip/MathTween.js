Class(function MathTween(j, l, m, b, i, k, n) {
    var h = this;
    var d, a, f;
    var e;
    (function () {
        if (j && l) {
            if (typeof m !== "number") {
                throw "MathTween Requires object, props, time, ease"
            }
            c()
        }
    })();

    function c() {
        if (j._mathTween && j._mathTween.stop) {
            j._mathTween.stop()
        }
        j._mathTween = h;
        TweenManager._addMathTween(h);
        b = TweenManager.MathEasing.convertEase(b);
        d = Date.now();
        d += i;
        f = l;
        a = TweenManager._dynamicPool.get();
        for (var o in f) {
            if (typeof j[o] === "number") {
                a[o] = j[o]
            }
        }
    }
    function g() {
        if (!j && !l) {
            return false
        }
        j._mathTween = null;
        TweenManager._dynamicPool.put(a.clear());
        d = a = f = e = null;
        j = l = m = b = i = k = n = null;
        TweenManager._removeMathTween(h)
    }
    this.start = function (p, q, r, s, o, u, t) {
        j = p;
        l = q;
        m = r;
        b = s;
        i = o;
        k = u;
        n = t;
        h = this;
        c()
    };
    this.update = function (r) {
        if (r < d) {
            return true
        }
        var p = (r - d) / m;
        p = p > 1 ? 1 : p;
        var q;
        if (typeof b === "function") {
            q = b(p)
        } else {
            q = TweenManager.MathEasing.solve(b, p)
        }
        for (var t in a) {
            if (typeof a[t] === "number") {
                var s = a[t];
                var o = f[t];
                j[t] = s + (o - s) * q
            }
        }
        if (k) {
            k(r)
        }
        if (p == 1) {
            if (!e) {
                e = true;
                if (n) {
                    n()
                }
                g()
            }
            return false
        }
        return true
    };
    this.stop = function () {
        g();
        return null
    }
});