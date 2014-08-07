Class(function TweenManager() {
    // console.log('==========================')
    // console.log(':: Tween Manager')
    // console.log('==========================')

    var f = this;
    var a = [];
    var d, c;
    (function () {
        Flip.ready(b);
        Render.startRender(e)
    })();

    function b() {
        f._dynamicPool = new ObjectPool(DynamicObject, 100)
    }

    function e(j) {

        if (a.length) {
            var g = a.length - 1;
            for (var h = g; h > -1; h--) {
                if (a[h]) {
                    a[h].update(j)
                } else {
                    a.splice(h, 1)
                }
            }
        }
    }

    this._addMathTween = function (g) {
        a.push(g)
    };
    this._removeMathTween = function (h) {
        for (var g = a.length - 1; g > -1; g--) {
            if (h == a[g]) {
                a.splice(g, 1)
            }
        }
    };
    this._initCSS = function (l, j, k, m, h, g, i) {
        return new CSSTween(l, j, k, m, h, g, i)
    };
    this.tween = function (k, i, j, l, h, g, m) {
        if (typeof h !== "number") {
            m = g;
            g = h;
            h = 0
        }
        return new MathTween(k, i, j, l, h, m, g)
    };
    this.clearTween = function (g) {
        if (g._mathTween && g._mathTween.stop) {
            g._mathTween.stop()
        }
    };
    this.clearCSSTween = function (g) {
        if (g && !g._cssTween && g.div._transition) {
            g.div.style[Device.styles.vendorTransition] = "";
            g.div._transition = false
        }
    };
    this.checkTransform = function (h) {
        for (var g = f.Transforms.length - 1; g > -1; g--) {
            if (h == f.Transforms[g]) {
                return true
            }
        }
        return false
    };
    this.addCustomEase = function (j) {
        var h = true;
        if (typeof j !== "object" || !j.name || !j.curve) {
            throw "TweenManager :: setCustomEase requires {name, curve}"
        }
        // console.log('custom eases')
        for (var g = f.CSSEases.length - 1; g > -1; g--) {
            if (j.name == f.CSSEases[g].name) {
                h = false
            }
        }
        if (h) {
            j.values = j.curve.split("(")[1].slice(0, -1).split(",");
            for (g = 0; g < j.values.length; g++) {
                j.values[g] = parseFloat(j.values[g])
            }
            f.CSSEases.push(j)
        }
    };
    this.getEase = function (h, g) {
        var k = f.CSSEases;
        for (var j = k.length - 1; j > -1; j--) {
            if (k[j].name == h) {
                if (g) {
                    return k[j].values
                }
                return k[j].curve
            }
        }
        return false
    };
    this.getAllTransforms = function (g) {
        var k = {};
        for (var h = 0; h < f.Transforms.length; h++) {
            var j = f.Transforms[h];
            var l = g[j];
            if (l !== 0 && typeof l === "number") {
                k[j] = l
            }
        }
        return k
    };
    this.getTransformProperty = function () {
        switch (Device.styles.vendor) {
        case "Moz":
            return "-moz-transform";
            break;
        case "Webkit":
            return "-webkit-transform";
            break;
        case "O":
            return "-o-transform";
            break;
        case "ms":
            return "-ms-transform";
            break;
        default:
            return "transform";
            break
        }
    };
    this.parseTransform = function (i) {
        var h = "";
        var k = "";
        if (typeof i.x !== "undefined" || typeof i.y !== "undefined" || typeof i.z !== "undefined") {
            var g = (i.x || 0);
            var l = (i.y || 0);
            var j = (i.z || 0);
            k += g + "px, ";
            k += l + "px";
            if (Device.tween.css3d) {
                k += ", " + j + "px";
                h += "translate3d(" + k + ")"
            } else {
                h += "translate(" + k + ")"
            }
        }
        if (typeof i.scale !== "undefined") {
            h += "scale(" + i.scale + ")"
        } else {
            if (typeof i.scaleX !== "undefined") {
                h += "scaleX(" + i.scaleX + ")"
            }
            if (typeof i.scaleY !== "undefined") {
                h += "scaleY(" + i.scaleY + ")"
            }
        }
        if (typeof i.rotation !== "undefined") {
            h += "rotate(" + i.rotation + "deg)"
        }
        if (typeof i.rotationX !== "undefined") {
            h += "rotateX(" + i.rotationX + "deg)"
        }
        if (typeof i.rotationY !== "undefined") {
            h += "rotateY(" + i.rotationY + "deg)"
        }
        if (typeof i.rotationZ !== "undefined") {
            h += "rotateZ(" + i.rotationZ + "deg)"
        }
        if (typeof i.skewX !== "undefined") {
            h += "skewX(" + i.skewX + "deg)"
        }
        if (typeof i.skewY !== "undefined") {
            h += "skewY(" + i.skewY + "deg)"
        }
        return h
    };
    this.Class = window.Class
}, "Static");
