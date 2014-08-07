Class(function WorkDetailPlay(workIndex) {
    Inherit(this, View);

    var _self = this, _elem, _arrow;
    var _index = workIndex;

    this.canClick = false;
    
    (function(){
        _markup();
        _initInteract();
    })();

    function _markup() {
        _elem.empty();

        _elem = _self.element;
        _elem.fontStyle("OpenSansLight", 103, Config.COLORS.white);
        _elem.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            lineHeight: 103,
            letterSpacing: 3,
            top: Stage.height*0.35,
            left: (Stage.width/2)-172,
            marginTop: -9,
            opacity: 0
        });

        _elem.text("PL&nbsp;&nbsp;Y");

        _arrow = _elem.create(".arrow");
        _arrow.size(45, 74).bg(Config.IMAGES + "common/play-arrow-white.png").css({
            left: 132,
            top: 16
        });

        //console.log(Data.WORK.getData()[workIndex]); // works
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
        // load the video overlay
        console.log('WorkDetailPlay :: workIndex: '+ _index);
        if (_self.canClick === true){
            _self.events.fire(FEEvents.VIDEO_LOAD, {
                index: _index
            });
        }
    }

    this.animateIn = function(){
        var left1 = (Stage.width/2)-172;
        if (left1 < (Global.SIDEBAR.width + 40)){
            left1 = Global.SIDEBAR.width + 40;
        }

        var left2 = (Stage.width/2)-122;
        if (left2 < (Global.SIDEBAR.width + 40)){
            left2 = Global.SIDEBAR.width + 40;
        }

        _self.delayedCall(function(){
            _elem.stopTween().css({
                left: left1,
                opacity: 0
            }).tween({
                left: left2,
                opacity: 1
            }, 500, "easeOutQuart");
        }, 500);

        _self.delayedCall(function(){
            _self.canClick = true;
        }, 1000);
    };
    this.test = function() {
        console.log('PLAY TEST')
    }
    this.setIndex = function(__indx) {
        _index = __indx;
        _elem.empty();

        console.log('PLAY :: SETINDEX: '+_index)

        _markup();
        _initInteract();
    };

    this.animateOut = function(){
        _self.canClick = false;

        var left1 = (Stage.width/2)-122;
        if (left1 < (Global.SIDEBAR.width + 40)){
            left1 = Global.SIDEBAR.width + 40;
        }

        var left2 = (Stage.width/2)-52;
        if (left2 < (Global.SIDEBAR.width + 40)){
            left2 = Global.SIDEBAR.width + 40;
        }

        console.log('ANIMATE OUT');
        _elem.stopTween().css({
            left: left1,
            opacity: 1
        }).tween({
            left: left2,
            opacity: 0
        }, 500, "easeOutQuart");
    };

    this.resize = function(){
        var leftAmount = (Stage.width/2)-122;
        if (leftAmount < (Global.SIDEBAR.width + 40)){
            leftAmount = Global.SIDEBAR.width + 40;
        }

        _elem.css({
            top: Stage.height*0.35,
            left: leftAmount
        });
    };
});