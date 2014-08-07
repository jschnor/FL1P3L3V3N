Class(function TopBarLogo() {
    Inherit(this, View);
    var _self = this;
    var _elem, _imge;
    // var a;
    var g;
    var j, q, c, e;
    // var b = 44;
    (function () {
        _initMarkup();
        _self.delayedCall(function() {
            _animateMarkup();
        }, 100)
        
        // h();
        // o();
        _initInteract();
        // j.startRender()
    })();

    function _initMarkup() {
        // console.log('TOP BAR LOGO!!')
        _elem = _self.element;
        // d.size(90, 90).center(1, 0).css({

        var logoWidth = 156;
        var logoHeight = 72;
        if (Device.mobile.phone){
            // logosize = 68;
        }

        _elem.size(logoWidth, logoHeight).css({
            top: 10,
            left: -30,
            opacity: 0,
        });
        

        _imge = _elem.create(".bg");
        _imge.size(logoWidth, logoHeight).bg(Config.IMAGES + "common/logo.png");
    }
    
    function _animateMarkup() {
        _elem.tween({
            left: Device.mobile.phone ? 10 : 20,
            opacity: 1,
        }, 600, 'easeOutSine');
    }
    // function h() {
    //     g = d.create(".circle");
    //     g.radius = b * 1.8;
    //     g.percent = 0;
    //     g.isIn = true;
    //     g.size(g.radius * 2, g.radius * 2).center();
    //     j = p.initClass(Canvas, g.radius * 2, g.radius * 2, true, null);
    //     g.addChild(j);
    //     c = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
    //     c.anchor = {
    //         x: 0.5,
    //         y: 0.5
    //     };
    //     c.rotation = 45;
    //     c.x = b * 1.79;
    //     c.y = b * -0.72;
    //     c.lineWidth = g.radius * 0.07;
    //     j.add(c);
    //     q = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
    //     q.anchor = {
    //         x: 0.5,
    //         y: 0.5
    //     };
    //     q.rotation = 45;
    //     q.x = b * 1.79;
    //     q.y = b * -0.72;
    //     q.lineWidth = g.radius * 0.07;
    //     j.add(q);
    //     f()
    // }

    // FOR ROLLOVER ANIMATION
    // function o() {
    //     e = {};
    //     e.texture = new Image();
    //     e.texture.src = Config.IMAGES + "loader/letter.png";
    //     for (var t = 0; t < 2; t++) {
    //         var u = p.initClass(CanvasTexture, e.texture, b, b);
    //         u.ox = u.x = j.width / 2 - u.width / 2;
    //         u.oy = u.y = j.height / 2 - u.height / 2;
    //         u.alpha = 0;
    //         j.add(u);
    //         e["t" + t] = u;
    //         var s = p.initClass(CanvasGraphics);
    //         j.add(s);
    //         s.mask(u);
    //         s.beginPath();
    //         if (t == 0) {
    //             s.moveTo(0, 0);
    //             s.lineTo(j.width, 0);
    //             s.lineTo(0, j.height)
    //         } else {
    //             s.moveTo(j.width, 0);
    //             s.lineTo(j.width, j.height);
    //             s.lineTo(0, j.height)
    //         }
    //         s.fill();
    //         e["m" + t] = s
    //     }
    //     u = p.initClass(CanvasTexture, e.texture, b, b);
    //     u.x = j.width / 2 - u.width / 2;
    //     u.y = j.height / 2 - u.height / 2;
    //     u.visible = false;
    //     j.add(u);
    //     e.clean = u
    // }

    // FOR ROLLOVER ANIMATION
    // function n() {
    //     var t = e.t0;
    //     var s = e.t1;
    //     t.visible = true;
    //     s.visible = true;
    //     a.hide();
    //     t.alpha = 0;
    //     s.alpha = 0;
    //     t.y += 10;
    //     t.x -= 10;
    //     s.y -= 10;
    //     s.x += 10;
    //     TweenManager.tween(t, {
    //         alpha: 1,
    //         x: t.ox,
    //         y: t.oy
    //     }, 500, "workOpen");
    //     TweenManager.tween(s, {
    //         alpha: 1,
    //         x: t.ox,
    //         y: t.oy
    //     }, 500, "workOpen", 20);
    //     p.delayedCall(function () {
    //         t.visible = false;
    //         s.visible = false;
    //         a.show()
    //     }, 520)
    // }

    // FOR ROLLOVER ANIMATION
    // function f() {
    //     c.clear();
    //     c.strokeStyle = g.isIn ? Config.COLORS.branding : Config.COLORS.white;
    //     c.arc(g.radius, g.radius, 360, g.radius / 2, 0, false);
    //     c.stroke();
    //     q.clear();
    //     var t = 180 * g.percent;
    //     q.strokeStyle = g.isIn ? Config.COLORS.white : Config.COLORS.branding;
    //     q.arc(g.radius, g.radius, t, g.radius / 2, 0, false);
    //     q.lineWidth = g.isIn ? g.radius * 0.1 : g.radius * 0.07;
    //     q.stroke();
    //     var s = 180 + 180 * g.percent;
    //     q.arc(g.radius, g.radius, s, g.radius / 2, 180, false);
    //     q.stroke()
    // }

    // function k() {}

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(mouseevent) {
        // we don't need no hover actions
        // we don't need no mouse control

        /*switch (mouseevent.action) {
        case "over":
            n();
            g.isIn = true;
            g.percent = 0;
            TweenManager.tween(g, {
                percent: 1
            }, 300, "easeOutCubic", 0, function () {
                g.isIn = false;
                g.percent = 0;
                TweenManager.tween(g, {
                    percent: 1
                }, 400, "easeInOutQuart", 0, null, f)
            }, f);
            break;
        case "out":
            break
        }*/
    }

    function _clickActions() {
        // if (Data.STATE.deep) {
        //     _self.events.fire(FEEvents.NAV_SELECT, {
        //         type: "home"
        //     });
        // }
        // if (!Global.HOME) {

        //     _self.events.fire(FEEvents.NAV_SELECT, {
        //         type: "home"
        //     });
        // }
    }
    this.animateIn = function () {}
});