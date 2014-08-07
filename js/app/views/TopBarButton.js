Class(function TopBarButton() {
    Inherit(this, View);
    var c = this;
    var f;
    var a;
    (function () {
        b();
        h();
        e();
        c.delayedCall(g, 500)
    })();

    function b() {
        f = c.element;
        f.size(60, 62).css({
            right: -55,
            top: 0
        }).bg(Config.COLORS.white).transform({
            x: -55
        });
        if (Mobile.phone) {
            f.transformPoint(0, 0).transform({
                scale: 0.8,
                x: -45
            })
        }
    }

    function h() {
        a = [];
        for (var j = 0; j < 3; j++) {
            var k = f.create(".line");
            k.css({
                width: 25,
                height: 4,
                right: 20,
                top: j * 8 + 23,
                overflow: "hidden"
            }).bg("#ccc");
            k.inner = k.create(".inner");
            k.inner.size("100%").bg(Config.COLORS.branding).transform({
                x: j == 1 ? 31 : -31
            });
            a.push(k)
        }
    }

    function g() {
        f.tween({
            x: Device.mobile ? 10 : 0
        }, 500, "easeOutCubic")
    }

    function e() {
        f.interact(d, i)
    }

    function d(k) {
        switch (k.action) {
        case "over":
            for (var j = 0; j < a.length; j++) {
                a[j].inner.tween({
                    x: 0
                }, 500, "easeOutCubic")
            }
            break;
        case "out":
            for (var j = 0; j < a.length; j++) {
                a[j].inner.tween({
                    x: j == 1 ? 31 : -31
                }, 500, "easeOutCubic")
            }
            break
        }
    }

    function i() {
        c.events.fire(FEEvents.TOGGLE_SIDEBAR, {
            open: Global.SIDEBAR_OPEN ? false : true,
            noDelay: true
        })
    }
    this.activate = function () {
        c.active = true;
        f.tween({
            x: Mobile.phone ? -45 : -55
        }, 400, "easeOutCubic");
        a[0].tween({
            rotation: -45,
            y: 8
        }, 500, "easeOutCubic");
        a[1].tween({
            opacity: 0
        }, 500, "easeOutCubic");
        a[2].tween({
            rotation: 45,
            y: -8
        }, 500, "easeOutCubic")
    };
    this.deactivate = function () {
        f.tween({
            x: Device.mobile ? 10 : 0
        }, 600, "easeOutCubic");
        c.active = false;
        for (var j = 0; j < a.length; j++) {
            a[j].tween({
                rotation: 0,
                y: 0,
                opacity: 1
            }, 500, "easeOutCubic");
            a[j].inner.tween({
                x: j == 1 ? 31 : -31
            }, 500, "easeOutCubic", 300)
        }
    }
});