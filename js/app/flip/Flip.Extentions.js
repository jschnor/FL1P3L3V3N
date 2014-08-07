(function () {
    // console.log(':: CALLED FIRST')
    
    $.fn.visible = function () {
        this.div.style.visibility = "visible";
        return this
    };
    $.fn.invisible = function () {
        this.div.style.visibility = "hidden";
        return this
    };
    $.fn.setZ = function (a) {
        this.div.style.zIndex = a;
        return this
    };
    $.fn.clearAlpha = function () {
        this.div.style.opacity = "";
        return this
    };
    $.fn.size = function (a, b, c) {
        if (typeof a === "string") {
            if (typeof b === "undefined") {
                b = "100%"
            } else {
                if (typeof b !== "string") {
                    b = b + "px"
                }
            }
            this.div.style.width = a;
            this.div.style.height = b
        } else {
            this.div.style.width = a + "px";
            this.div.style.height = b + "px";
            if (!c) {
                this.div.style.backgroundSize = a + "px " + b + "px"
            }
        }
        this.width = a;
        this.height = b;
        return this
    };
    $.fn.retinaSize = function (a, b) {
        if (typeof a === "string") {
            this.div.style.backgroundSize = a + " " + b
        } else {
            this.div.style.backgroundSize = a + "px " + b + "px"
        }
        return this
    };
    $.fn.mouseEnabled = function (a) {
        this.div.style.pointerEvents = a ? "auto" : "none";
        return this
    };
    $.fn.fontStyle = function (e, c, b, d) {
        var a = new Object();
        if (e) {
            a.fontFamily = e
        }
        if (c) {
            a.fontSize = c
        }
        if (b) {
            a.color = b
        }
        if (d) {
            a.fontStyle = d
        }
        this.css(a);
        return this
    };
    $.fn.bg = function (c, a, d, b) {
        if (!c) {
            return this
        }
        if (!c.strpos(".")) {
            this.div.style.backgroundColor = c
        } else {
            this.div.style.backgroundImage = "url(" + c + ")"
        }
        if (typeof a !== "undefined") {
            a = typeof a == "number" ? a + "px" : a;
            d = typeof d == "number" ? d + "px" : d;
            this.div.style.backgroundPosition = a + " " + d
        }
        if (b) {
            this.div.style.backgroundSize = "";
            this.div.style.backgroundRepeat = b
        }
        return this
    };
    $.fn.center = function (a, c) {
        var b = {};
        if (typeof a === "undefined") {
            b.left = "50%";
            b.top = "50%";
            b.marginLeft = -this.width / 2;
            b.marginTop = -this.height / 2
        } else {
            if (a) {
                b.left = "50%";
                b.marginLeft = -this.width / 2
            }
            if (c) {
                b.top = "50%";
                b.marginTop = -this.height / 2
            }
        }
        this.css(b);
        return this
    };
    $.fn.mask = function (b, a, e, c, d) {
        this.div.style[Device.styles.vendor + "Mask"] = (b.strpos(".") ? "url(" + b + ")" : b) + " no-repeat";
        return this
    };
    $.fn.css = function (d, c) {
        if (typeof c == "boolean") {
            skip = c;
            c = null
        }
        if (typeof d !== "object") {
            if (!c) {
                var b = this.div.style[d];
                if (typeof b !== "number") {
                    if (b.strpos("px")) {
                        b = Number(b.slice(0, -2))
                    }
                    if (d == "opacity") {
                        b = 1
                    }
                }
                if (!b) {
                    b = 0
                }
                return b
            } else {
                this.div.style[d] = c;
                return this
            }
        }
        TweenManager.clearCSSTween(this);
        for (var a in d) {
            var e = d[a];
            if (!(typeof e === "string" || typeof e === "number")) {
                continue
            }
            if (typeof e !== "string" && a != "opacity" && a != "zIndex") {
                e += "px"
            }
            this.div.style[a] = e
        }
        return this
    }
})();