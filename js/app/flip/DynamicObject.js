Class(function DynamicObject(a) {
    // console.log('< DYNAMIC >')
    var c;
    for (var b in a) {
        this[b] = a[b]
    }
    this.tween = function (f, g, h, e, i, d) {
        if (typeof e !== "number") {
            d = i;
            i = e;
            e = 0
        }
        this.stopTween();
        if (typeof d !== "function") {
            d = null
        }
        if (typeof i !== "function") {
            i = null
        }
        c = TweenManager.tween(this, f, g, h, e, d, i);
        return c
    };
    this.stopTween = function () {
        if (c && c.stop) {
            c.stop()
        }
    };
    this.copy = function () {
        var e = new DynamicObject();
        for (var d in this) {
            if (typeof this[d] !== "function" && typeof this[d] !== "object") {
                e[d] = this[d]
            }
        }
        return e
    };
    this.clear = function () {
        for (var d in this) {
            if (typeof this[d] !== "function") {
                delete this[d]
            }
        }
        return this
    }
});