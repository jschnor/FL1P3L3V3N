Class(function TopBarVideoInfoButton() {
    Inherit(this, View);

    var _self = this, _elem;

    this.canClick = false;
    
    (function(){
        _markup();
        _initInteract();
    })();

    function _markup() {
        _elem = _self.element;
        _elem.fontStyle("OpenSansLight", 20, Config.COLORS.white);
        _elem.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            lineHeight: 28,
            letterSpacing: 3,
            top: 15,
            right: -1000,
            opacity: 0,
            borderBottom: "1px solid "+Config.COLORS.white
        }).setZ(1);

        _elem.text("INFO");
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(mouseevent) {
        // we don't need no hover actions
        // we don't need no mouse control

        /*switch (mouseevent.action) {
        case "over":
            break;
        case "out":
            break
        }*/
    }

    function _clickActions() {
        // hide dat video

        // animate out stuff
        if (_self.canClick === true){
            _self.events.fire(FEEvents.VIDEO_HIDE);
        }
    }

    this.animateIn = function(){
        _self.delayedCall(function(){
            _elem.stopTween().css({
                right: 44,
                opacity: 0
            }).tween({
                right: 94,
                opacity: 0.4
            }, 500, "easeOutQuart");
        }, 1000);

        _self.delayedCall(function(){
            _self.canClick = true;
        }, 1500);
    };

    this.animateOut = function(){
        _self.canClick = false;
        _elem.stopTween().css({
            right: 94,
            opacity: 0.4
        }).tween({
            right: 44,
            opacity: 0
        }, 500, "easeOutQuart");
    };

    /*this.resize = function(){
        var leftAmount = (Stage.width/2)-122;
        if (leftAmount < (Global.SIDEBAR.width + 40)){
            leftAmount = Global.SIDEBAR.width + 40;
        }

        _elem.css({
            top: Stage.height*0.35,
            left: leftAmount
        });
    };*/
});