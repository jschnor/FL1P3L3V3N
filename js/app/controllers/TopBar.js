
Class(function TopBar() {
    // THESE CONTROLLERS END UP BEING ID'S WITH THE NAME
    // OF THE ID GETTING SET AS THE NAME OF THIS CLASS. IN
    // THIS CASE, this.container WOULD EQUAL '#Sidebar'

    Inherit(this, Controller);
    
    var _chld;
    var _cont;
    var _logo, _loc, _nav;
    var _self   = this;
    var _startY = Device.mobile ? 0 : 0;
    _self.height = 90;
    
    Global.TOPBAR = this;

    (function () {
        _markup();
        _getChildren();
        _eventSubscribe();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.css({
            height: _self.height,
            width: "100%",
            // border: '1px solid red'
        }).setZ(10000);

        _cont.css({
            overflow: "hidden"
        });

        var gradient = "";
        if (Device.vendor !== ""){
            gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(0,0,0,0.36) 0%,rgba(0,0,0,0) 100%)"; // most browsers
        }else{
            gradient = "linear-gradient(to bottom,  rgba(0,0,0,0.36) 0%,rgba(0,0,0,0) 100%)"; // W3C
        }

        s = _cont.create(".bg");
        s.size("100%", "100%").css({
            background: Config.COLORS.white,
            opacity: 0.80
        }).setZ(0);
    }
    
    function _getChildren() {
        _logo = _self.initClass(TopBarLogo);
        _nav = _self.initClass(TopBarNav);
        // _loc = _self.initClass(TopBarLocation);
    }

    function _resizeEvent() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeWidth);
    }

    function _resizeWidth() {
        _cont.css({
            width: Stage.width
        });
    }

    function _eventSubscribe(){
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _animateOut);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _animateIn);
    }

    function _animateIn(){
        _cont.stopTween().transform({
            y: -130
        }).tween({
            y: 0
        }, 500, "easeOutQuart");
    }

    function _animateOut(){
        _cont.stopTween().transform({
            y: 0
        }).tween({
            y: -130
        }, 500, "easeOutQuart");
    }
    
    this.animateIn = function(){
        _animateIn();
    };

    this.animateOut = function(){
        _animateOut();
    };

    this.release = function () {
        _chld.release()
    }
});