Class(function VideoOverlayClose() {
    Inherit(this, View);

    var _self = this, _elem;

    this.canClick = false;
    
    (function(){
        _markup();
        _initInteract();
    })();

    function _markup() {
        _elem = _self.element;
        console.log(_self);

        _elem.size(36, 36).bg(Config.IMAGES + "common/video-close.png").css({
            top: Device.mobile.phone ? 72 : 57,
            right: Device.mobile.phone ? 19 : 10,
            opacity: 0
        });
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
        // close the video overlay
        if (_self.canClick === true){
            _self.animateOut();
            _self.events.fire(FEEvents.VIDEO_UNLOAD);

            // _self.parent.destroy();
            
        }
    }
    this.onComplete = function() {
        _clickActions();
    }
    this.animateIn = function(){
        _elem.stopTween().css({
            opacity: 0
        }).tween({
            opacity: 1
        }, 500, "easeOutQuart", function(){
            _self.canClick = true;
        });
    };

    this.animateOut = function(){
        _self.canClick = false;

        _elem.stopTween().css({
            opacity: 1
        }).tween({
            opacity: 0
        }, 500, "easeOutQuart");
    };
});