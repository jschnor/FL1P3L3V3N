(function () {
    // console.log('SECOND CALL');    
    // console.log(':: Creates many Flip objects');
    // console.log($.fn)
    $.fn.transform = function (b) {
        TweenManager.clearCSSTween(this);
        if (Device.tween.css2d) {
            if (!b) {
                b = this
            } else {
                for (var a in b) {
                    if (typeof b[a] === "number") {
                        this[a] = b[a]
                    }
                }
            }
            if (!this._matrix) {
                this.div.style[Device.styles.vendorTransform] = TweenManager.parseTransform(b)
            } else {
                if (this._matrix.type == "matrix2") {
                    this._matrix.setTRS(this.x, this.y, this.rotation, this.scaleX || this.scale, this.scaleY || this.scale)
                } else {
                    this._matrix.setTRS(this.x, this.y, this.z, this.rotationX, this.rotationY, this.rotationZ, this.scaleX || this.scale, this.scaleY || this.scale, this.scaleZ || this.scale)
                }
                this.div.style[Device.styles.vendorTransform] = this._matrix.getCSS()
            }
        }
        return this
    };

    $.fn.useMatrix3D = function () {
        this._matrix = new Matrix4();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;
        return this
    };

    $.fn.useMatrix2D = function () {
        this._matrix = new Matrix2();
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scale = 1;
        return this
    };

    $.fn.matrix = function (a) {
        this.div.style[Device.styles.vendorTransform] = a;
        return this
    };

    $.fn.accelerate = function () {
        this.__accelerated = true;
        if (!this.z) {
            this.z = 0;
            this.transform()
        }
    };

    $.fn.backfaceVisibility = function (a) {
        if (a) {
            this.div.style[CSS.prefix("BackfaceVisibility")] = ""
        } else {
            this.div.style[CSS.prefix("BackfaceVisibility")] = "hidden"
        }
    };

    $.fn.enable3D = function (b, a, c) {
        this.div.style[CSS.prefix("TransformStyle")] = "preserve-3d";
        if (b) {
            this.div.style[CSS.prefix("Perspective")] = b + "px"
        }
        if (typeof a === "number" || typeof c === "number") {
            this.div.style[CSS.prefix("PerspectiveOrigin")] = (a || 0) + "px " + (c || 0) + "px"
        }
        return this
    };

    $.fn.disable3D = function () {
        this.div.style[CSS.prefix("TransformStyle")] = "";
        this.div.style[CSS.prefix("Perspective")] = "";
        return this
    };

    $.fn.transformPoint = function (a, d, c) {
        var b = "";
        if (typeof a !== "undefined") {
            b += a + "px "
        }
        if (typeof d !== "undefined") {
            b += d + "px "
        }
        if (typeof c !== "undefined") {
            b += c + "px"
        }
        this.div.style[CSS.prefix("TransformOrigin")] = b;
        return this
    };

    $.fn.tween = function (c, d, e, a, f, b) {
        if (typeof a === "boolean") {
            b = a;
            a = 0;
            f = null
        } else {
            if (typeof a === "function") {
                f = a;
                a = 0
            }
        }
        if (typeof f === "boolean") {
            b = f;
            f = null
        }
        if (!a || a < 10) {
            a = 10
        }
        return TweenManager._initCSS(this, c, d, e, a, f, b)
    };

    $.fn.clearTransform = function () {
        if (typeof this.x === "number") {
            this.x = 0
        }
        if (typeof this.y === "number") {
            this.y = 0
        }
        if (typeof this.z === "number") {
            this.z = 0
        }
        if (typeof this.scale === "number") {
            this.scale = 1
        }
        if (typeof this.scaleX === "number") {
            this.scaleX = 1
        }
        if (typeof this.scaleY === "number") {
            this.scaleY = 1
        }
        if (typeof this.rotation === "number") {
            this.rotation = 0
        }
        if (typeof this.rotationX === "number") {
            this.rotationX = 0
        }
        if (typeof this.rotationY === "number") {
            this.rotationY = 0
        }
        if (typeof this.rotationZ === "number") {
            this.rotationZ = 0
        }
        if (typeof this.skewX === "number") {
            this.skewX = 0
        }
        if (typeof this.skewY === "number") {
            this.skewY = 0
        }
        if (!this.__accelerated) {
            this.div.style[Device.styles.vendorTransform] = ""
        } else {
            this.accelerate()
        }
        return this
    };

    $.fn.stopTween = function () {
        if (this._cssTween) {
            this._cssTween.stop()
        }
        if (this._mathTween) {
            this._mathTween.stop()
        }
        return this
    }
})();