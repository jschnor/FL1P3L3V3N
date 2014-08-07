Class(function TopBarLocation() {
    Inherit(this, View);

    var _self = this, _elem, _location;
    
    (function(){
        _init();
        _markup();
        _eventSubscribe();
        // _initInteract();

        _self.delayedCall(function() {
            _animateIn();
        }, 100);
    })();

    function _init(){
        _elem = _self.element;
    }

    function _eventSubscribe(){
        _self.events.subscribe(FEEvents.PAGE_CHANGE, _swapText);
        _self.events.subscribe(FEEvents.NAV_SELECT, _swapText);
    }

    function _markup() {
        var fontsize = 20;
        if (Device.mobile.phone){
            fontsize = 14;
        }
        _elem.fontStyle("OpenSansLight", fontsize, Config.COLORS.white);
        _elem.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            lineHeight: fontsize*1.4,
            letterSpacing: 3,
            top: 15,
            right: 50,
            opacity: 0,
            borderBottom: "1px solid "+Config.COLORS.white
        }).setZ(1);

        _buildLocation();

        _elem.text(_location.toUpperCase());
    }

    function _buildLocation(){
        // build text
        _location = "";
        if (Data.STATE.page){
            if (Data.STATE.page != 'home' && Data.STATE.page != 'about'){
                _location = Utils.stripDashes(Data.STATE.page);

                if (Data.STATE.deep){
                    _location += ': ' + Utils.stripDashes(Data.STATE.deep);
                }
            }
        }
    }

    function _swapText(){
        if (!Data.STATE.detail){
            _elem.stopTween().css({
                opacity: 0.4
            }).tween({
                opacity: 0
            }, 600, "easeOutSine");

            _self.delayedCall(function(){
                _buildLocation();

                _elem.text(_location.toUpperCase());

                _elem.stopTween().css({
                    opacity: 0
                }).tween({
                    opacity: 0.4
                }, 600, "easeOutSine");
            }, 800);
        }

        // console.log('TOP BAR LOCATION :: '+Data.STATE.page);

        if (Data.STATE.page == 'reels'){

            // _elem.css({
            //     opacity: 0
            // })

            // if (_location.toUpperCase() != 'REELS: '+Data.STATE.deep) {

            //     // _elem.css({
            //     //     opacity: 0.4
            //     // }).tween({
            //     //     opacity: 0
            //     // }, 600, "easeOutSine");
            // }

            // _self.delayedCall(function(){

                _buildLocation();
                _elem.text(_location.toUpperCase());

                // console.log(_location.toUpperCase())
                // console.log(_location.toUpperCase())

                // if (_location.toUpperCase() != 'REELS: '+Data.STATE.deep) {

                    // _elem.css({
                    //     opacity: 0
                    // }).tween({
                    //     opacity: 0.4
                    // }, 600, "easeOutSine");
                // }

        // }, 1000);

        }
    }

    function _initInteract() {
        _elem.interact(null, _clickActions);
    }

    /*function _hoverActions(mouseevent) {
        switch (mouseevent.action) {
        case "over":
            break;
        case "out":
            break
        }
    }*/

    function _clickActions() {
        
    }

    function _animateIn(){
        // if (Data.STATE.page != 'reels'){
            _elem.stopTween().css({
                right: 50,
                opacity: 0
            }).tween({
                right: 94,
                opacity: 0.4
            }, 600, "easeOutSine");
        // } else {
        //     _elem.css({
        //         right: 94
        //         // opacity: 0
        //     });
        // }

        /*_self.delayedCall(function(){
            _self.canClick = true;
        }, 600);*/
    }

    this.animateIn = function(){
        _animateIn();
    };

    /*this.animateOut = function(){
        _self.canClick = false;
        _elem.stopTween().css({
            right: 94,
            opacity: 0.4
        }).tween({
            right: 44,
            opacity: 0
        }, 500, "easeOutQuart");
    };*/

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