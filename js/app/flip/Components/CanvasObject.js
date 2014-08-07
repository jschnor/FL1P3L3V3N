Class(function CanvasObject() {
    Inherit(this, Component);
    var a = this;
    this.alpha = 1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.scale = 1;
    this.visible = true;
    this.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.values = new CanvasValues();
    this.styles = new CanvasValues(true);
    this.children = [];
    this.blendMode = "normal";
    this.updateValues = function () {
        this.anchor.tx = this.anchor.x <= 1 ? this.anchor.x * this.width : this.anchor.x;
        this.anchor.ty = this.anchor.y <= 1 ? this.anchor.y * this.height : this.anchor.y;
        this.values.setTRSA(this.x, this.y, Utils.toRadians(this.rotation), this.scale, this.scale, this.alpha);
        if (this._parent.values) {
            this.values.calculate(this._parent.values)
        }
        if (this._parent.styles) {
            this.styles.calculateStyle(this._parent.styles)
        }
    };
    this.render = function (d) {
        if (!this.visible) {
            return false
        }
        this.updateValues();
        if (this.draw) {
            this.draw(d)
        }
        var b = this.children.length;
        for (var c = 0; c < b; c++) {
            this.children[c].render(d)
        }
    };
    this.startDraw = function (d, c) {
        var b = this._canvas.context;
        var i = this.values.data;
        var g = i[0] + (d || 0);
        var f = i[1] + (c || 0);
        b.save();
        b.globalCompositeOperation = this.blendMode || "normal";
        b.translate(g, f);
        b.rotate(i[2]);
        b.scale(i[3], i[4]);
        b.globalAlpha = i[5];
        if (this.styles.styled) {
            var j = this.styles.values;
            for (var h in j) {
                var e = j[h];
                if (e instanceof Color) {
                    b[h] = e.getHexString()
                } else {
                    b[h] = e
                }
            }
        }
    };
    this.endDraw = function () {
        this._canvas.context.restore()
    };
    this.add = function (b) {
        b._canvas = this._canvas;
        b._parent = this;
        this.children.push(b);
        b._z = this.children.length
    };
    this.remove = function (c) {
        c._canvas = null;
        c._parent = null;
        var b = this.children.indexOf(c);
        if (b) {
            this.children.splice(b, 1)
        }
    };
    this.isMask = function () {
        var b = this;
        while (b) {
            if (b.masked) {
                return true
            }
            b = b._parent
        }
        return false
    };
    this.unmask = function () {
        this.masked.mask(null);
        this.masked = null
    };
    this.setZ = function (b) {
        if (!this._parent) {
            throw "CanvasObject :: Must add to parent before setZ"
        }
        this._z = b;
        this._parent.children.sort(function (d, c) {
            return d._z - c._z
        })
    };
    this.hit = function (d) {
        var c = Utils.hitTestObject(d, this.values.hit(this));
        if (c) {
            return this
        }
        for (var b = this.children.length - 1; b > -1; b--) {
            var f = this.children[b];
            c = f.hit(d);
            if (c) {
                return f
            }
        }
        return false
    };
    this.destroy = function () {
        for (var b = 0; b < this.children.length; b++) {
            if (this.children[b].destroy) {
                this.children[b].destroy()
            }
        }
        return Utils.nullObject(this)
    }
});

