Class(function SidebarView(parent_width) {
    Inherit(this, View);
    
    var _self = this, _elem, _nav, _social;
    var d, q, o, p;
    var f, e, m;
    
    (function() {
        _markup();
        _loadNav();
        _addSocial();
    })();

    function _markup() {
        _elem = _self.element;
        _elem.size("100%").css({
            width: parent_width
        });
    }
    
    function _loadNav(){
		_nav = _self.initClass(SidebarNav, parent_width);
    }

    function _addSocial(){
        _social = _self.initClass(SocialNav, "sidebar");
    }

    /*function c() {
        e = _self.initClass(SidebarButton);
        _self.events.bubble(e, FlipEvents.CLICK)
    }*/

    // function a() {
    //     m = _self.initClass(SidebarLogo)
    // }

    /*function l() {
        q = _elem.create(".facebook", "a");
        q.div.href = "http://facebook.com/activetheory";
        q.div.target = "_blank";
        q.size(34, 26).bg(Config.IMAGES + "sidebar/fb.png");
        q.center(1, 0).css({
            bottom: Stage.height < 500 ? 25 : 65,
            marginLeft: -40,
            opacity: 0.2,
            display: "block",
            position: "absolute"
        });
        o = _elem.create(".twitter", "a");
        o.div.target = "_blank";
        o.div.href = "http://twitter.com/active_theory";
        o.size(34, 26).bg(Config.IMAGES + "sidebar/tw.png");
        o.center(1, 0).css({
            bottom: Stage.height < 500 ? 25 : 65,
            marginLeft: 0,
            opacity: 0.2,
            display: "block",
            position: "absolute"
        })
    }*/

    // function s() {
    //     f = _self.initClass(SidebarNav, i)
    // }

    /*function h() {
        q.interact(r, j);
        o.interact(r, j);
        _self.events.subscribe(FlipEvents.RESIZE, n)
    }*/

    /*function r(t) {
        p = t.object;
        switch (t.action) {
        case "over":
            p.tween({
                opacity: 0.7
            }, 200, "easeOutSine");
            break;
        case "out":
            p.tween({
                opacity: 0.2
            }, 200, "easeOutSine");
            break
        }
    }*/

    /*function j(u) {
        u.preventDefault();
        var t = u.object.div.href;
        getURL(t, "_blank");
        if (u.object.div.href == "http://facebook.com/activetheory") {
            GATracker.trackEvent("Social Click", "Facebook")
        } else {
            GATracker.trackEvent("Social Click", "Twitter")
        }
    }*/

    /*function n() {
        if (Stage.height < 580) {
            q.hide();
            o.hide()
        } else {
            q.show();
            o.show()
        }
    }*/
    
    /*this.open = function () {
        if (e) {
            e.activate()
        }
    };
    this.close = function () {
        if (e) {
            e.deactivate()
        }
    };
    this.release = function () {
        f.release()
    }*/
});