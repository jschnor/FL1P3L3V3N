
Class(function Transition() {
    // console.log('tranistion is called - singleton');

    Inherit(this, View);
    var _self           = this;
    f                   = 1;
    _self.direction     = 1;

    var j, k, d, b;
    var m, e, i;
    
    (function () {
        c();
        l();
        h();
        a();
    })();

    function c() {

        j = _self.element;
        j.size("100%").setZ(999).css({
            left: !Device.mobile ? 0 : 0,
            height: "112%",
            top: "-6%"
        });
        // after first call
        // j.transform({
        //     skewY: Config.SKEW
        // }).invisible();
        k = j.create("fill");
        k.size("100%");

        d = j.create("fill");
        d.size("100%").css({
            overflow: "hidden"
        }).bg(Config.COLORS.white);
    }
    function l() {
        b = j.create(".loader");
        b.size(45, 45).center().css({
            // marginLeft: !Device.mobile ? -150 : -22,
            marginTop: -50
        }).invisible();
        b.inner = b.create(".inner");
        b.inner.size(45, 45).bg(Config.IMAGES + "common/loader.png");
        var n = _self.initClass(CSSAnimation, b.inner);
        n.loop = true;
        n.duration = 1000;
        n.ease = "linear";
        n.frames = [{
            rotation: 0
        }, {
            rotation: 360
        }];
        b.anim = n
    }
    function h() {
        _self.events.subscribe(FlipEvents.RESIZE, a);
    }
    function a() {}
    this.animateIn = function (n, o, p) {
        e = o;
        f = n;
        _self.direction = f;
        m = true;
        Global.CONTAINER.addChild(j);
        j.visible();

        k.stopTween().transform({
            y: Stage.height * f * 1.12
        }).tween({
            y: 0
        }, 600, "easeOutQuint");

        d.stopTween().transform({
            y: Stage.height * f * 1.12
        }).tween({
            y: 0
        }, 800, "easeOutQuint", 200);

        b.visible().stopTween().css({
            opacity: 0
        }).transform({
            y: 100 * f
        }).tween({
            y: 0,
            opacity: 1
        }, 800, "easeOutQuart", 200);

        b.anim.play();
        if (i) {
            clearTimeout(i)
        }
        i = setTimeout(function () {
            if (p) {
                p(e);
            }
        }, 1100);
    };
    this.animateOut = function () {
        if (!m) {
            Global.CONTAINER.addChild(j);
        }
        j.visible();
        d.transform({
            y: 0
        }).tween({
            y: -Stage.height * f * 1.12
        }, 600, "easeOutQuint");

        k.transform({
            y: 0
        }).tween({
            y: -Stage.height * f * 1.12
        }, 700, "easeOutQuint", 200, function () {
            Global.CONTAINER.removeChild(j);
            j.invisible();
            m = false;
        });

        _self.delayedCall(function () {
            b.anim.stop();
            b.invisible();
        }, 100);
    };
    this.resize = function () {
        m = true;
        j.visible();
        Global.CONTAINER.addChild(j);
        a()
    }
}, "Singleton");