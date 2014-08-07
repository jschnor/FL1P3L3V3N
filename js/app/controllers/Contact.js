Class(function Contact(){
	Inherit(this, Controller);

	var _self = this, _elem, _cont, _content, _social;
	_self.width = Device.mobile.phone ? 280 : 350;
    var _startX = Device.mobile ? 0 : Stage.width - _self.width;
    _self.opened = false;

	Global.CONTACT = this;

	(function(){
		_init();
		_markup();
		_getContents();
		_eventSubscribe();
        _addSocial();
	})();

	function _init(){
		// console.log("contact _init()");
		_elem = _self.element;
		_cont = _self.container;
	}

	function _markup(){
        _cont.size(_self.width, Stage.height).bg(Config.COLORS.red).setZ(10000);
        if (!Device.mobile) {
            _cont.css({
                overflow: "hidden"
            });
        }

        _cont.transform({
            x: Stage.width
        });
	}

	function _getContents(){
        _content = _self.initClass(ContactView);
	}

    function _addSocial(){
        _social = _self.initClass(SocialNav, "contact");
    }

	function _eventSubscribe(){
		_self.events.subscribe(FlipEvents.RESIZE, _onResize);
		_self.events.subscribe(FEEvents.CONTACT_OPEN, _open);
		_self.events.subscribe(FEEvents.CONTACT_CLOSE, _close);
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _closeOnVideo);
	}

	function _onResize() {
        if (_self.opened) {
            _cont.size(_self.width, Stage.height).transform({
                x: Stage.width - _self.width
            });
        } else {
            _cont.size(_self.width, Stage.height).transform({
                x: Stage.width
            });
        }

        _content.resize();
    }

    function _open(){
        _self.opened = true;

        _cont.tween({
            x: Stage.width - _self.width
        }, 500, "easeOutQuart");

        // move sidebar and close icon
        Global.SIDEBAR.openContact();
        Global.SIDEBARICON.openContact();
    }

    function _close(){
        _self.opened = false;
        
        _cont.tween({
            x: Stage.width
        }, 500, "easeOutQuart");

        // move sidebar and close icon
        Global.SIDEBAR.closeContact();
        Global.SIDEBARICON.closeContact();

        // _self.delayedCall(function(){
        // Global.SIDEBARICON.showOpenIcon();
        // }, 500);
    }

    function _closeOnVideo(){
        _self.opened = false;
        
        _cont.tween({
            x: Stage.width
        }, 500, "easeOutQuart");

        Global.SIDEBARICON.closeContact();
    }

    this.open = function(){
        _open();
    };
    
    this.close = function(){
        _close();
    };
});