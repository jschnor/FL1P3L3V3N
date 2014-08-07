
(function () {
    // console.log('FOURTH CALL');
    // console.log(':: Sets click, hover, press, bind, unbind, etc...events');


    $.fn.click = function (d, a) {
        var c = this;

        function b(f) {
            // console.log('click');
            if (!c.div) {
                return false
            }
            if (Mouse._preventClicks) {
                return false
            }
            f.object = c.div.className == "hit" ? c.parent() : c;
            f.action = "click";
            if (!f.pageX) {
                f.pageX = f.clientX;
                f.pageY = f.clientY
            }
            if (d) {
                d(f)
            }
            if (Mouse.autoPreventClicks) {
                Mouse.preventClicks()
            }
        }
        if (a) {
            if (this._events.click) {
                this.div[Flip.removeEvent](Flip.translateEvent("click"), this._events.click, true);
                this.div.style.cursor = "auto";
                this._events.click = null
            }
        } else {
            if (this._events.click) {
                this.click(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("click"), b, true);
            this.div.style.cursor = "pointer"
        }
        this._events.click = b;
        return this
    };

    $.fn.hover = function (g, a) {
        var f = this;
        var e = false;
        var d;

        function b(j) {
            if (!f.div) {
                return false
            }
            var i = Date.now();
            var h = j.toElement || j.relatedTarget;
            if (d && (i - d) < 5) {
                d = i;
                return false
            }
            d = i;
            j.object = f.div.className == "hit" ? f.parent() : f;
            switch (j.type) {
            case "mouseout":
                j.action = "out";
                break;
            case "mouseleave":
                j.action = "out";
                break;
            default:
                j.action = "over";
                break
            }
            if (e) {
                if (Mouse._preventClicks) {
                    return false
                }
                if (j.action == "over") {
                    return false
                }
                if (j.action == "out") {
                    if (c(f.div, h)) {
                        return false
                    }
                }
                e = false
            } else {
                if (j.action == "out") {
                    return false
                }
                e = true
            }
            if (!j.pageX) {
                j.pageX = j.clientX;
                j.pageY = j.clientY
            }
            if (g) {
                g(j)
            }
        }
        function c(l, j) {
            var h = l.children.length - 1;
            for (var k = h; k > -1; k--) {
                if (j == l.children[k]) {
                    return true
                }
            }
            for (k = h; k > -1; k--) {
                if (c(l.children[k], j)) {
                    return true
                }
            }
        }
        if (a) {
            if (this._events.hover) {
                this.div[Flip.removeEvent](Flip.translateEvent("mouseover"), this._events.hover, true);
                this.div[Flip.removeEvent](Flip.translateEvent("mouseout"), this._events.hover, true);
                this._events.hover = null
            }
        } else {
            if (this._events.hover) {
                this.hover(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("mouseover"), b, true);
            this.div[Flip.addEvent](Flip.translateEvent("mouseout"), b, true)
        }
        this._events.hover = b;
        return this
    };
    $.fn.press = function (d, a) {
        var c = this;

        function b(f) {
            if (!c.div) {
                return false
            }
            f.object = c.div.className == "hit" ? c.parent() : c;
            switch (f.type) {
            case "mousedown":
                f.action = "down";
                break;
            default:
                f.action = "up";
                break
            }
            if (!f.pageX) {
                f.pageX = f.clientX;
                f.pageY = f.clientY
            }
            if (d) {
                d(f)
            }
        }
        if (a) {
            if (this._events.press) {
                this.div[Flip.removeEvent](Flip.translateEvent("mousedown"), this._events.press, true);
                this.div[Flip.removeEvent](Flip.translateEvent("mouseup"), this._events.press, true);
                this._events.press = null
            }
        } else {
            if (this._events.press) {
                this.press(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("mousedown"), b, true);
            this.div[Flip.addEvent](Flip.translateEvent("mouseup"), b, true)
        }
        this._events.press = b;
        return this
    };
    $.fn.bind = function (b, f) {
        if (b == "touchstart") {
            if (!Device.mobile) {
                b = "mousedown"
            }
        } else {
            if (b == "touchmove") {
                if (!Device.mobile) {
                    b = "mousemove"
                }
            } else {
                if (b == "touchend") {
                    if (!Device.mobile) {
                        b = "mouseup"
                    }
                }
            }
        }
        this._events["bind_" + b] = this._events["bind_" + b] || [];
        var d = this._events["bind_" + b];
        var c = {};
        c.callback = f;
        c.target = this.div;
        d.push(c);

        function a(j) {
            var k = Utils.touchEvent(j);
            j.x = k.x;
            j.y = k.y;
            for (var g = 0; g < d.length; g++) {
                var h = d[g];
                if (h.target == j.currentTarget) {
                    h.callback(j)
                }
            }
        }
        if (!this._events["fn_" + b]) {
            this._events["fn_" + b] = a;
            this.div[Flip.addEvent](Flip.translateEvent(b), a, true)
        }
        return this
    };
    $.fn.unbind = function (a, e) {
        if (a == "touchstart") {
            if (!Device.mobile) {
                a = "mousedown"
            }
        } else {
            if (a == "touchmove") {
                if (!Device.mobile) {
                    a = "mousemove"
                }
            } else {
                if (a == "touchend") {
                    if (!Device.mobile) {
                        a = "mouseup"
                    }
                }
            }
        }
        var d = this._events["bind_" + a];
        if (!d) {
            return this
        }
        for (var b = 0; b < d.length; b++) {
            var c = d[b];
            if (c.callback == e) {
                d.splice(b, 1)
            }
        }
        if (this._events["fn_" + a] && !d.length) {
            this.div[Flip.removeEvent](Flip.translateEvent(a), this._events["fn_" + a], true);
            this._events["fn_" + a] = null
        }
        return this
    };
    $.fn.interact = function (c, a, b) {
        if (!this.hit) {
            this.hit = $(".hit");
            this.hit.css({
                width: "100%",
                height: "100%",
                zIndex: 99999,
                top: 0,
                left: 0,
                position: "absolute",
                background: "rgba(255, 255, 255, 0)"
            });
            this.addChild(this.hit)
        }
        if (!Device.mobile) {
            this.hit.hover(c).click(a)
        } else {
            this.hit.touchClick(!b ? c : null, a)
        }
    };
    Flip.eventTypes = ["hover", "press", "click", "touchClick", "touchSwipe"];
    Flip.translateEvent = function (a) {
        if (Flip.addEvent == "attachEvent") {
            switch (a) {
            case "click":
                return "onclick";
                break;
            case "mouseover":
                return "onmouseover";
                break;
            case "mouseout":
                return "onmouseleave";
                break;
            case "mousedown":
                return "onmousedown";
                break;
            case "mouseup":
                return "onmouseup";
                break;
            case "mousemove":
                return "onmousemove";
                break
            }
        }
        return a
    }
})();