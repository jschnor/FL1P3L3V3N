Class(function CanvasTexture(a, b, d) {
    Inherit(this, CanvasObject);
    var f = this;
    var e;
    this.width = b || 0;
    this.height = d || 0;
    (function () {
        c()
    })();

    function c() {
        if (typeof a === "string") {
            var g = a;
            a = new Image();
            a.src = g;
            a.onload = function () {
                if (!f.width && !f.height) {
                    f.width = a.width / (f._canvas && f._canvas.retina ? 2 : 1);
                    f.height = a.height / (f._canvas && f._canvas.retina ? 2 : 1)
                }
            }
        }
        f.texture = a
    }
    this.draw = function (h) {
        var g = this._canvas.context;
        if (this.isMask() && !h) {
            return false
        }
        if (a) {
            this.startDraw(this.anchor.tx, this.anchor.ty);
            g.drawImage(a, -this.anchor.tx, -this.anchor.ty, this.width, this.height);
            this.endDraw()
        }
        if (e) {
            g.globalCompositeOperation = "source-in";
            e.render(true);
            g.globalCompositeOperation = "source-over"
        }
    };
    this.mask = function (g) {
        if (!g) {
            return e = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var k = this._parent.children;
        var j = false;
        for (var h = 0; h < k.length; h++) {
            if (g == k[h]) {
                j = true
            }
        }
        if (j) {
            e = g;
            g.masked = this
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});
