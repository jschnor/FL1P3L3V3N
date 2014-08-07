Class(function SidebarLogo() {
    Inherit(this, View);
    var p = this;
    var d, g, a;
    var j, q, c, e;
    var b = 44;
    (function () {
        i();
        h();
        o();
        l();
        j.startRender()
    })();

    function i() {
        d = p.element;
        d.size(90, 90).center(1, 0).css({
            top: Device.mobile.phone ? 60 : 80,
            opacity: 1
        });
        a = d.create(".bg");
        a.size(90, 90).bg(Config.IMAGES + "sidebar/logo.png")
    }

    function h() {
        g = d.create(".circle");
        g.radius = b * 1.8;
        g.percent = 0;
        g.isIn = true;
        g.size(g.radius * 2, g.radius * 2).center();
        j = p.initClass(Canvas, g.radius * 2, g.radius * 2, true, null);
        g.addChild(j);
        c = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
        c.anchor = {
            x: 0.5,
            y: 0.5
        };
        c.rotation = 45;
        c.x = b * 1.79;
        c.y = b * -0.72;
        c.lineWidth = g.radius * 0.07;
        j.add(c);
        q = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
        q.anchor = {
            x: 0.5,
            y: 0.5
        };
        q.rotation = 45;
        q.x = b * 1.79;
        q.y = b * -0.72;
        q.lineWidth = g.radius * 0.07;
        j.add(q);
        f()
    }

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
    this.animateIn = function () {}
});