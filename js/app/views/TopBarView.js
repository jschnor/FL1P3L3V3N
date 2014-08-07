Class(function TopBarView(_height) {
    Inherit(this, View);
    // var k = this;
    var _self = this;
    // var b;
    var _elem;
    var _line;
    var d, q, o, p;
    var _navi, _socl, m;

    (function () {
        // console.log('==========================');
        // console.log(':: TobBarView(i)');
        // console.log('==========================');
        _markup();
        // _drawLine();
        /*if (Device.mobile) {
            _getMobileButton();
        }*/
        // a();
        // _getSocialIcons();
        _initNavigation();
        // _resizeEvent();

        

    })();

    function _markup() {

        _elem = _self.element;
        _elem.size("100%").css({
            // height: _height-40
            // opacity: .1
        });
    }

    // function _getMobileButton() {
    //     _socl = _self.initClass(TopBarButton);
    //     _self.events.bubble(_socl, FlipEvents.CLICK);
    // }

    function _drawLine() {
        _line = _elem.create(".line");
        _line.css({
            width: 450,
            height: 2,
            opacity: 0.7,
            // outline: "1px solid red",
            overflow: "hidden"
        }).bg(Config.COLORS.branding).setZ(10);
    }

    
    // function a() {
    //     m = _self.initClass(SidebarLogo)
    // }

    // function _getSocialIcons() {
    //     q = b.create(".facebook", "a");
    //     q.div.href = "http://facebook.com/activetheory";
    //     q.div.target = "_blank";
    //     q.size(34, 26).bg(Config.IMAGES + "sidebar/fb.png");
    //     q.center(1, 0).css({
    //         bottom: Stage.height < 500 ? 25 : 65,
    //         marginLeft: -40,
    //         opacity: 0.2,
    //         display: "block",
    //         position: "absolute"
    //     });
    //     o = b.create(".twitter", "a");
    //     o.div.target = "_blank";
    //     o.div.href = "http://twitter.com/active_theory";
    //     o.size(34, 26).bg(Config.IMAGES + "sidebar/tw.png");
    //     o.center(1, 0).css({
    //         bottom: Stage.height < 500 ? 25 : 65,
    //         marginLeft: 0,
    //         opacity: 0.2,
    //         display: "block",
    //         position: "absolute"
    //     });
    // }

    function _initNavigation() {
        _navi = _self.initClass(TopBarNav, _height);
    }

    

    // function r(t) {
    //     p = t.object;
    //     switch (t.action) {
    //     case "over":
    //         p.tween({
    //             opacity: 0.7
    //         }, 200, "easeOutSine");
    //         break;
    //     case "out":
    //         p.tween({
    //             opacity: 0.2
    //         }, 200, "easeOutSine");
    //         break;
    //     }
    // }

    // function j(u) {
    //     u.preventDefault();
    //     var t = u.object.div.href;
    //     getURL(t, "_blank");

    //     if (u.object.div.href == "http://facebook.com/activetheory") {
    //         GATracker.trackEvent("Social Click", "Facebook");
    //     } else {
    //         GATracker.trackEvent("Social Click", "Twitter");
    //     }
    // }

    function n() {
        if (Stage.height < 580) {
            q.hide();
            o.hide()
        } else {
            q.show();
            o.show()
        }
    }
    // this.open = function () {
    //     if (_socl) {
    //         _socl.activate()
    //     }
    // };
    // this.close = function () {
    //     if (_socl) {
    //         _socl.deactivate()
    //     }
    // };

    this.release = function () {
        _navi.release();
    }
});