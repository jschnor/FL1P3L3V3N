Class(function TopBarNavItem(h, j) {
    Inherit(this, View);
    // var f = this;
    var _self = this;
    // var i;
    var _elem;
    // var a;
    var _roll;
    var k, l;
    (function () {
        _initMarkup();
        _textMarkup();
        // c();
        _initInteract()
    })();

    function _initMarkup() {
        // console.log('h')
        // console.log(h)
        // console.log('j')
        // console.log(j)
        // console.log(Config.NAV[j].width);
        _elem = _self.element;
        _elem.css({
            width: Config.NAV[j].width,
            overflow: 'hidden',
            // border: '1px solid red',
            // opacity: .8

        });

        _roll = _elem.create(".bg");
        _roll.size("100%").bg(Config.COLORS.white).css({
            opacity: 0.8,

        }).transform({
            y: -20
        });
    }

    function _textMarkup() {

        k = _elem.create(".text");
        k.fontStyle("GeomSlab703-Medium", 14, Config.COLORS.black);
        // k.size(200, 30).css({
        k.css({
            // color: 'white',
            // border: '1px solid green',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: Config.NAV[j].width,
            textAlign: 'center'
            // cssPadding: '4'
        // }).bg(Config.IMAGES + "sidebar/nav/" + h + "-off.png");
        });

        k.text(h.toUpperCase());
        // console.log(h)

        // console.log('NAV: ' + _spac)
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(n) {
        if (!_self.active) {

            // console.log(n.action);
            // console.log(j);
            // console.log(h);

            _self.events.fire(FlipEvents.HOVER, {
                action: n.action,
                index: j,
                text: h
            })
        }
    }

    function _clickActions() {
        console.log(j, h)
        if (h.toUpperCase() == Global.PAGE && Global.DETAIL_OPEN) {
            _self.events.fire(FEEvents.CLOSE_DETAIL)
        }
        // if (!_self.active || h.toLowerCase() == "contact") {

        if (!_self.active) {
            _self.events.fire(FEEvents.NAV_SELECT, {
                type: Utils.urlstr(h.toLowerCase()),
                index: j
            })
        }


    }

    this.over = function (n) {
        // console.log('OVER: '+_self)
        // console.log(_self)
        // console.log(this)
        // console.log(n);
        // console.log(_self.index);
        _self.hovered = true;

        k.tween({
            color: Config.COLORS.branding
        }, 500, "easeOutSine", 200);
        
        _roll.stopTween().transform({
            y: -20
        }).tween({
            y: 0
        }, 400, "easeInQuart");
    };
    this.out = function (n) {
        _self.hovered = false;

        k.tween({
            color: Config.COLORS.black
        }, 500, "easeOutSine");

        _roll.stopTween().transform({
            y: 0
        }).tween({
            y: 20
        }, 300, "easeOutQuart");
    };
    this.activate = function () {
        _self.active = true;
        // l.stopTween().transform({
        //     x: -225
        // }).tween({
        //     x: 0
        // }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10);
        // l.inner.stopTween().transform({
        //     x: 225
        // }).tween({
        //     x: 0
        // }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10);
    };
    this.deactivate = function () {
        _self.active = false;
        // k.fontStyle("OpenSansSemi", 12, Config.COLORS.branding);
        // l.tween({
        //     x: 225
        // }, 600, "workSlice");
        // l.inner.tween({
        //     x: -225
        // }, 600, "workSlice");
        // k.tween({
        //     opacity: 0.6
        // }, 300, "easeOutSine");
        // a.tween({
        //     x: 225
        // }, 600, "workSlice");
        // _self.delayedCall(function () {
        //     if (f.active) {
        //         return;
        //     }
        //     l.stopTween().transform({
        //         x: -225
        //     });
        //     l.inner.stopTween().transform({
        //         x: 225
        //     });
        //     a.stopTween().transform({
        //         x: -225
        //     })
        // }, 800)
    };
    _self.lock = function () {};
    _self.release = function () {
        i.hit.show();
    };
    this.animateIn = function () {}
});