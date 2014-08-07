Class(function Mouse() {
    // console.log('THIRD AGAIN CALL')
    // console.log(':: STATIC – mouse objects and methods')
    var d = this;
    var b;
    this.x = 0;
    this.y = 0;

    function c(g) {
        d.ready = true;
        var f = Utils.touchEvent(g);
        d.x = f.x;
        d.y = f.y
    }
    function a() {
        d.x = d.y = 0
    }
    this.capture = function (e, f) {
        if (b) {
            return false
        }
        b = true;
        d.x = e || 0;
        d.y = f || 0;
        if (!Device.mobile) {
            // console.log('__window object')
            // console.log(__window);

            __window.bind("mousemove", c)
        } else {
            __window.bind("touchend", a);
            __window.bind("touchmove", c);
            __window.bind("touchstart", c)
        }
    };
    this.stop = function () {
        if (!b) {
            return false
        }
        b = false;
        d.x = 0;
        d.y = 0;
        if (!Device.mobile) {
            __window.unbind("mousemove", c)
        } else {
            __window.unbind("touchend", a);
            __window.unbind("touchmove", c);
            __window.unbind("touchstart", c)
        }
    };
    this.preventClicks = function () {
        d._preventClicks = true;
        setTimeout(function () {
            d._preventClicks = false
        }, 500)
    };
    this.preventFireAfterClick = function () {
        d._preventFire = true
    }
}, "Static");