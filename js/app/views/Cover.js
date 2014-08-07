Class(function Cover() {
    Inherit(this, View);
    var f = this;
    var g, k, i, j, d, c;
    (function () {
        e();
        if (Device.mobile) {
            h();
        } else {
            b();
        }
    })();

    function e() {
        g = f.element;
        g.size("100%").setZ(999999).bg(Config.COLORS.branding);
        g.hide();
    }
    function h() {
        k = g.create("wrap");
        k.size("100%", 60).center(0, 1).transform({
            y: -30
        });
        k.invisible();
        i = k.create("text");
        i.text("Please rotate your device<br/><br/> to landscape.");
        i.fontStyle("OpenSans", 16, "#fff").css({
            textTransform: "uppercase",
            letterSpacing: 2,
            width: "100%",
            textAlign: "center",
            lineHeight: 16,
            top: 0
        });
        j = k.create("rotate");
        j.size(28, 28).center(1, 0).bg(Config.IMAGES + "common/rotate.png").css({
            bottom: -30
        });
        j.transform({
            rotation: 0
        });
    }
    function b() {
        k = g.create("wrap");
        k.size(400, 260).center();
        k.invisible();
        var l = k.create(".logo");
        l.size(150, 150).bg(Config.IMAGES + "home/logo-invert.png").center(1, 0);
        var m = k.create("text");
        m.fontStyle("OpenSansLight", 13, Config.COLORS.white).css({
            letterSpacing: 1,
            top: 175,
            width: "100%",
            textAlign: "center"
        });
        m.text("Please make your browser bigger.<br/><br/>Visit on your mobile device<br/>to see the mobile optimized site.");
    }
    function a(l) {
        if (d) {
            j.tween({
                rotation: l
            }, 600, "easeInOutCirc", function () {
                a(l + 180);
            });
        }
    }
    this.show = function (l) {

        /*console.log('COVER');
        console.log(Device.mobile.phone);
        console.log(l);*/

        if (Device.mobile.phone) {
            g.hide();
            
            k.invisible();
            if (l == "portrait") {
                d = true;
                j.transform({
                    rotation: 0
                });
                a(180);
            }
        } else {
            g.show();
            k.visible();
            if (l == "landscape") {
                d = true;
                j.transform({
                    rotation: 0
                });
                a(180);
            }
        }
    };
    this.hide = function () {

        /*console.log('COVER');
        console.log(Device.mobile.phone);*/
        // console.log(l);

        if (Device.mobile.phone) {
            g.show();
            k.visible();
            d = true;
            j.transform({
                rotation: 0
            });
            a(180);

        } else {
            g.hide();
            k.invisible();
            d = false;

        }
    }
});
