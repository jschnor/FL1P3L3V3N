Class(function SidebarIcon() {
    Inherit(this, View);
    var _self = this;
    var _elem, _imge, _openIcon, _closeIcon, _menuTitle;
    // var a;
    var g;
    var j, q, c, e;
    // var b = 44;

    Global.SIDEBARICON = this;
    
    (function () {
        _initMarkup();

        _self.delayedCall(function() {
            _animateMarkup();
        }, 100);

        _initResizeAndInteractions();
        _eventSubscribe();
        // h();
        // o();
        // l();
        // j.startRender()
    })();

    function _initMarkup() {
        _elem = _self.element;
        // d.size(90, 90).center(1, 0).css({
        _elem.size(46, 46).css({
            top: Device.mobile.phone ? 10 : 20,
            left: Stage.width - 30,
            opacity: 0,
            // border: '1px solid blue'
        }).setZ(10100);

        
        _closeIcon = _elem.create(".close");
        _closeIcon.size(46, 46).bg(Config.IMAGES + "common/drawer-icon-active.png");
        _closeIcon.css({
            opacity: 0
        });
        
        _openIcon = _elem.create(".open");
        _openIcon.size(46, 46).bg(Config.IMAGES + "common/drawer-icon.png");

        _menuTitle = _elem.create(".title");
        var fontsize = 13;
        _menuTitle.fontStyle("OpenSansLight", fontsize, Config.COLORS.white);
        _menuTitle.size(46, "auto").css({
            top: 46,
            left: 0,
            opacity: 0,
            letterSpacing: fontsize * 0.2
        }).setZ(10100);
        _menuTitle.text("MENU");
        

               
        // _elem.mask(_imge);
        // _test.mask('.bg');
    }



    function _animateMarkup() {
        _elem.tween({
            // left: -100,
            left: Device.mobile.phone ? Stage.width - 56 : Stage.width - 70,
            opacity: 1,
        }, 600, 'easeOutSine');

        _menuTitle.tween({
            opacity: 0.5,
        }, 600, 'easeOutSine');
    }
    

    function _initResizeAndInteractions() {

        _self.events.subscribe(FlipEvents.RESIZE, _onResize);

        _elem.interact(_initRollActions, _clickActions);
        _menuTitle.interact(_initRollActions, _clickActions);

    }
    
    function _initRollActions(e) {
        if (Device.mobile) {
            // no hover on touch devices
            return;
        }
        
        switch (e.action) {
            case "over":
                if (!_self.active) {
                    _openIcon.tween({
                        opacity: 0.8
                    }, 200, 'easeOutQuad');
                }
                break;
            case "out":
                if (!_self.active) {
                     _openIcon.tween({
                        opacity: 1
                    }, 200, 'easeOutQuad');
                }
                break;
        }
    }

    function _clickActions() {
        if (Global.SIDEBAR.opened) {
            _showOpenIcon();
            
            if (Global.CONTACT.opened === true){
                Global.SIDEBAR.closeContact();
                Global.CONTACT.close();
            }
            
            Global.SIDEBAR.close();
        } else {
            _showCloseIcon();
            Global.SIDEBAR.open();
        }
    }

    function _onResize() {
        if (Global.CONTACT.opened){
            _elem.css({
                left: Device.mobile.phone ? Stage.width - 56 - Global.CONTACT.width : Stage.width - 70 - Global.CONTACT.width
            })
        }else{
            _elem.css({
                left: Device.mobile.phone ? Stage.width - 56 : Stage.width - 70
            });
        }
    }

    function _eventSubscribe(){
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _animateOut);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _animateIn);
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

    function o() {
        e = {};
        e.texture = new Image();
        e.texture.src = Config.IMAGES + "loader/letter.png";
        for (var t = 0; t < 2; t++) {
            var u = p.initClass(CanvasTexture, e.texture, b, b);
            u.ox = u.x = j.width / 2 - u.width / 2;
            u.oy = u.y = j.height / 2 - u.height / 2;
            u.alpha = 0;
            j.add(u);
            e["t" + t] = u;
            var s = p.initClass(CanvasGraphics);
            j.add(s);
            s.mask(u);
            s.beginPath();
            if (t == 0) {
                s.moveTo(0, 0);
                s.lineTo(j.width, 0);
                s.lineTo(0, j.height)
            } else {
                s.moveTo(j.width, 0);
                s.lineTo(j.width, j.height);
                s.lineTo(0, j.height)
            }
            s.fill();
            e["m" + t] = s
        }
        u = p.initClass(CanvasTexture, e.texture, b, b);
        u.x = j.width / 2 - u.width / 2;
        u.y = j.height / 2 - u.height / 2;
        u.visible = false;
        j.add(u);
        e.clean = u
    }

    function n() {
        var t = e.t0;
        var s = e.t1;
        t.visible = true;
        s.visible = true;
        a.hide();
        t.alpha = 0;
        s.alpha = 0;
        t.y += 10;
        t.x -= 10;
        s.y -= 10;
        s.x += 10;
        TweenManager.tween(t, {
            alpha: 1,
            x: t.ox,
            y: t.oy
        }, 500, "workOpen");
        TweenManager.tween(s, {
            alpha: 1,
            x: t.ox,
            y: t.oy
        }, 500, "workOpen", 20);
        p.delayedCall(function () {
            t.visible = false;
            s.visible = false;
            a.show()
        }, 520)
    }

    function f() {
        c.clear();
        c.strokeStyle = g.isIn ? Config.COLORS.branding : Config.COLORS.white;
        c.arc(g.radius, g.radius, 360, g.radius / 2, 0, false);
        c.stroke();
        q.clear();
        var t = 180 * g.percent;
        q.strokeStyle = g.isIn ? Config.COLORS.white : Config.COLORS.branding;
        q.arc(g.radius, g.radius, t, g.radius / 2, 0, false);
        q.lineWidth = g.isIn ? g.radius * 0.1 : g.radius * 0.07;
        q.stroke();
        var s = 180 + 180 * g.percent;
        q.arc(g.radius, g.radius, s, g.radius / 2, 180, false);
        q.stroke()
    }

    function k() {}

    function l() {
        d.interact(r, m)
    }

    function r(s) {
        switch (s.action) {
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
        }
    }

    function m() {
        if (!Global.HOME) {
            p.events.fire(FEEvents.NAV_SELECT, {
                type: "home"
            })
        }
    }

    function _animateIn(){
        _elem.stopTween().transform({
            top: -130
        }).tween({
            top: Device.mobile.phone ? 10 : 20
        }, 500, "easeOutQuart");
    }

    function _animateOut(){
        _elem.stopTween().transform({
            top: Device.mobile.phone ? 10 : 20
        }).tween({
            top: -130
        }, 500, "easeOutQuart");
    }

    function _showOpenIcon(){
        _self.active = false;

        // show open icon
        _openIcon.tween({
            opacity: 0.8
        }, 100, 'easeOutQuad');

        _menuTitle.tween({
            opacity: 0.5
        }, 100, 'easeOutQuad');
        
        // hide close icon
        _closeIcon.tween({
            opacity: 0
        }, 100, 'easeOutQuad');
    }

    function _showCloseIcon(){
        _self.active = true;
        
        // hide open icon
        _openIcon.tween({
            opacity: 0
        }, 100, 'easeOutQuad');

        _menuTitle.tween({
            opacity: 0
        }, 100, 'easeOutQuad');
        
        // show close icon
        _closeIcon.tween({
            opacity: 1
        }, 100, 'easeOutQuad');
    }

    this.showOpenIcon = function(){
        _showOpenIcon();
    };

    this.showCloseIcon = function(){
        _showCloseIcon();
    };
    
    this.animateIn = function(){
        _animateIn();
    };

    this.animateOut = function(){
        _animateOut();
    };

    this.openContact = function(){
        _elem.tween({
            left: Device.mobile.phone ? Stage.width - (56 + Global.CONTACT.width) : Stage.width - (70 + Global.CONTACT.width)
        }, 500, "easeOutQuart");
    };

    this.closeContact = function(){
        _elem.tween({
            left: Device.mobile.phone ? Stage.width - 56 : Stage.width - 70
        }, 500, "easeOutQuart");
    };
});