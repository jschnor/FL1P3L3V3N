

Class(function WorkDetailExpandButton() {
    Inherit(this, View);
    var i = this;
    var k, l, a, f;
    var c = 203;
    var d = 40;
    (function () {
        g();
        e();
        b();
        n();
        j()
    })();

    function g() {
        k = i.element;
        k.size(c, d).css({
            top: "50%",
            marginTop: -130,
            left: 80,
            overflow: "hidden",
            padding: (Mobile.os == "iOS") ? "2px 0" : 0,
            outline: "1px solid transparent"
        });
        k.invisible()
    }

    function e() {
        a = k.create(".bg");
        a.size(c, d).bg(Mobile.os == "iOS" ? Config.IMAGES + "common/f4f4f4.png" : Config.COLORS.white).transform({
            x: -10
        }).css({
            outline: "1px solid transparent"
        })
    }

    function b() {
        l = k.create(".text");
        l.fontStyle("OpenSansBold", 12, Config.COLORS.branding);
        l.css({
            width: "100%",
            textAlign: "right",
            right: 52,
            top: "50%",
            marginTop: -6,
            lineHeight: 12,
            letterSpacing: 3
        });
        l.text("EXPAND DETAIL")
    }

    function n() {
        f = k.create(".plus");
        f.fontStyle("OpenSansBold", 16, Config.COLORS.branding);
        f.css({
            right: 32,
            top: "50%",
            marginTop: -9,
            lineHeight: 16
        });
        f.text("+")
    }

    function j() {
        k.interact(h, m)
    }

    function h(o) {
        if (i.clicked) {
            return false
        }
        switch (o.action) {
        case "over":
            a.tween({
                x: 0
            }, 300, "easeOutCirc");
            f.tween({
                x: 10,
                rotation: 180,
                y: 1
            }, 500, "easeOutCirc");
            break;
        case "out":
            a.tween({
                x: -10
            }, 500, "easeOutCirc");
            f.tween({
                x: 0,
                rotation: 0,
                y: 0
            }, 300, "easeOutCirc");
            break
        }
    }

    function m() {
        i.clicked = true;
        a.tween({
            y: d + 2,
            x: -10
        }, 300, "workOpen");
        l.tween({
            x: -10,
            opacity: 0
        }, 300, "workOpen");
        f.tween({
            x: 0,
            rotation: 0,
            y: 0,
            opacity: 0
        }, 300, "workOpen");
        i.events.fire(HydraEvents.CLICK)
    }
    this.reset = function () {
        i.clicked = false;
        a.tween({
            y: 0,
            x: -10
        }, 500, "workOpen");
        l.tween({
            x: -0,
            opacity: 1
        }, 500, "workOpen");
        f.tween({
            x: 0,
            rotation: 0,
            y: 0,
            opacity: 1
        }, 300, "easeOutCirc")
    };
    this.animateIn = function (p, o) {
        if (p) {
            k.transform({
                x: FEDevice.PERFORMANCE > 0 ? -c : -c * 1.5
            });
            l.transform({
                x: -50
            });
            f.transform({
                x: -100
            });
            k.visible();
            k.tween({
                x: 0
            }, 1000, "workOpen");
            l.tween({
                x: 0
            }, 1000, "workOpen", 100);
            f.tween({
                x: 0
            }, 1000, "workOpen")
        } else {
            if (o == "bottom") {
                k.transform({
                    y: 100
                });
                k.visible();
                k.tween({
                    y: 0
                }, 1000, "workOpen", 320)
            } else {
                k.transform({
                    y: -100
                });
                k.visible();
                k.tween({
                    y: 0
                }, 1000, "workOpen", 320)
            }
        }
    };
    this.animateOut = function () {
        k.tween({
            x: -70,
            opacity: 0
        }, 300, "workOpen")
    }
});


