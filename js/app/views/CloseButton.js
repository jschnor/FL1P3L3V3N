
Class(function CloseButton(j) {
    Inherit(this, View);
    var e = this;
    var i, b, a, f;
    e.width = 60;
    e.height = 60;
    e.clicked = false;
    (function () {
        c();
        k();
        g();
        if (!j) {
            e.delayedCall(h, 500)
        }
    })();

    function c() {
        i = e.element;
        i.size(e.width, e.height).css({
            top: 0,
            right: 0,
            overflow: "hidden"
        }).setZ(100);
        if (Device.mobile.phone) {
            i.transformPoint(e.width, 0).transform({
                scale: 0.8
            })
        }
        if (!j) {
            i.css({
                borderTop: "3px solid " + Config.COLORS.white,
                borderRight: "3px solid " + Config.COLORS.white
            });
            b = i.create(".bg");
            b.size("100%").bg(Config.IMAGES + "common/f4f4f4.png");
            b.transform({
                y: -e.height
            })
        } else {
            b = i.create(".bg");
            b.size("100%").bg(Config.IMAGES + "common/f4f4f4.png").css({
                opacity: 0.1
            })
        }
    }

    function k() {
        a = i.create(".one");
        a.size(e.width * 0.45, e.width * 0.075).center().css({
            overflow: "hidden"
        });
        a.transform({
            rotation: -45
        });
        a.back = a.create(".back");
        a.back.size("100%").bg("#bbb");
        if (!j) {
            a.back.transform({
                x: -e.width * 0.5
            })
        }
        a.inner = a.create(".inner");
        a.inner.size("100%").bg(Config.COLORS.branding);
        a.inner.transform({
            x: -e.width * 0.5
        });
        f = i.create(".two");
        f.size(e.width * 0.45, e.width * 0.075).center().css({
            overflow: "hidden"
        });
        f.transform({
            rotation: 45
        });
        f.back = f.create(".back");
        f.back.size("100%").bg("#bbb");
        if (!j) {
            f.back.transform({
                x: -e.width * 0.5
            })
        }
        f.inner = f.create(".inner");
        f.inner.size("100%").bg(Config.COLORS.branding);
        f.inner.transform({
            x: e.width * 0.5
        })
    }

    function h() {
        b.tween({
            y: 0
        }, 500, "easeInOutQuart");
        a.back.tween({
            x: 0
        }, 500, "easeOutQuart", 400);
        f.back.tween({
            x: 0
        }, 500, "easeOutQuart", 300)
    }

    function g() {
        i.interact(d, l)
    }

    function d(m) {
        if (e.clicked || Device.mobile) {
            return false
        }
        switch (m.action) {
        case "over":
            a.inner.tween({
                x: 0
            }, 300, "easeOutQuart");
            f.inner.tween({
                x: 0
            }, 600, "easeOutQuart");
            break;
        case "out":
            a.inner.tween({
                x: -e.width * 0.5
            }, 600, "easeOutQuart");
            f.inner.tween({
                x: e.width * 0.5
            }, 300, "easeOutQuart");
            break
        }
    }

    function l() {
        if (e.clicked) {
            return false
        }
        e.clicked = true;
        if (j) {
            e.events.fire(FlipEvents.CLICK);
            a.inner.tween({
                x: -e.width * 0.5
            }, 600, "easeOutQuart");
            f.inner.tween({
                x: e.width * 0.5
            }, 300, "easeOutQuart");
            e.delayedCall(function () {
                e.clicked = false
            }, 1000)
        } else {
            if (Device.mobile) {
                i.tween({
                    y: -e.height
                }, 300, "easeOutCubic", function () {
                    if (FEDevice.PERFORMANCE == 0) {
                        e.events.fire(FEEvents.CLOSE)
                    }
                });
                if (FEDevice.PERFORMANCE > 0) {
                    e.events.fire(FEEvents.CLOSE)
                }
            } else {
                e.events.fire(FEEvents.CLOSE)
            }
        }
    }
    this.animateOut = function () {
        if (Device.mobile) {
            return
        }
        a.inner.tween({
            x: e.width * 0.5
        }, 200, "easeOutQuart");
        f.inner.tween({
            x: -e.width * 0.5
        }, 200, "easeOutQuart");
        a.back.tween({
            x: e.width * 0.5
        }, 300, "easeOutQuart", 100);
        f.back.tween({
            x: -e.width * 0.5
        }, 300, "easeOutQuart", 100);
        b.tween({
            y: -e.height - 5
        }, 600, "easeInOutQuart", 100)
    }
});