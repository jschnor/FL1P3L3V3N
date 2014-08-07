
Class(function Sidebar() {
    // THESE CONTROLLERS END UP BEING ID'S WITH THE NAME
    // OF THE ID GETTING SET AS THE NAME OF THIS CLASS. IN
    // THIS CASE, this.container WOULD EQUAL '#Sidebar'

    Inherit(this, Controller);
    
    var _self   = this;
    var _chld, _elem = _self.element;
    var _cont;
    _self.width = Device.mobile.phone ? 230 : 350;
    var _startX = Device.mobile ? 0 : Stage.width - _self.width;
    // ANIMATE THIS INTO VIEW BY CHANGING IT TO ADDITION
    // var _startX = Device.mobile ? 0 : Stage.width + _self.width;
    Global.SIDEBAR = this;

    (function () {
        _markup();
        _getChildren();
        _eventSubscribe();

        // if (!Device.mobile) {
        //     _self.delayedCall(_animateMarkup, 200);
        // }
    })();

    
    function _markup() {
        /*console.log('====================');
        console.log('CONTAINER');
        console.log(_self.container);
        console.log('====================');*/
       
		Global.SIDEBAR.subnavOpened = false;

        _cont = _self.container;
        _cont.size(_self.width, Stage.height).bg(Config.COLORS.branding).setZ(10001);
        // _cont.size(_self.width, Stage.height).bg(Config.COLORS.red).setZ(10000);

        
        if (!Device.mobile) {
            _cont.css({
                overflow: "hidden"
            });
        }
        
        // box shadow based on browser
        /*var box_shadow = "0 0 160px #ffffff";
        switch (Device.vendor){
            case "moz":
            _cont.css({
                mozBoxShadow: box_shadow
            });
            break;
            
            case "webkit":
            _cont.css({
                webkitBoxShadow: box_shadow
            });
            break;
            
            case "ms":
            case "o":
            _cont.css({
                boxShadow: box_shadow
            });
            break;
            
            default:
            _cont.css({
                boxShadow: box_shadow
            });
            break;
        }*/
        

        _cont.transform({
            x: Stage.width + _self.width
        });
    }
    
    function _getChildren() {
		_self.events.subscribe(FlipEvents.RESIZE, _onResize);
        _chld = _self.initClass(SidebarView);
    }
    
    function _onResize() {
        if (_self.opened) {
            if (Global.CONTACT.opened){
                _cont.size(_self.width, Stage.height).transform({
                    x: Stage.width - _self.width - Global.CONTACT.width
                });
            }else{
                _cont.size(_self.width, Stage.height).transform({
                    x: Stage.width - _self.width
                });
            }
        } else {
            _cont.size(_self.width, Stage.height).transform({
                x: Stage.width
            });
        }
    }

    function _eventSubscribe(){
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _close);
    }

    function _open(){
        _self.opened = true;
        // _chld.open();
        _cont.tween({
            x: Stage.width - _self.width
        }, 500, "easeOutQuart");
    }

    function _close(){
        // console.log('SIDEBAR CLOSE CALLED!')
        _self.opened = false;
        // _chld.close();
        _cont.tween({
            x: Stage.width
        }, 500, "easeOutQuart");

        // _self.delayedCall(function(){
        Global.SIDEBARICON.showOpenIcon();
        // }, 500);
    }

    this.open = function () {
        _open();
    };
    
    this.close = function () {
        _close();
    };

    this.openContact = function(){
        _cont.tween({
            x: Stage.width - (_self.width + Global.CONTACT.width)
        }, 500, "easeOutQuart");
    };

    this.closeContact = function(){
        _cont.tween({
            x: Stage.width - _self.width
        }, 500, "easeOutQuart");
    };
    
    this.release = function () {
        _chld.release();
    }
});