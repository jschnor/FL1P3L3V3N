Class(function SidebarNavItem(params){
    Inherit(this, View);
    
    var _self = this, _elem, _bg, _textbox, _text, _subnav, _active = false;
    
    this.params = params;

    this.maxheight = _self.params.totalheight/Config.NAV.length; // initial/uncompressed height: divide total height of nav by number of nav items
    this.minheight = _self.maxheight - (_self.params.totalheight * 0.1); // compressed height: subtract the reduction amount from maxheight
    this.height = _self.maxheight; // initial value
    this.opened = false; // whether a subnav is open on this item
    
    (function(){
        _markup();
        _addText();
        
		if (_self.params.subnav){
			_addSubNav();
        }
    })();

    function _markup() {
        _elem = _self.element;
        
        _elem.size("100%", _self.maxheight).css({
			position: "relative",
            overflow: "hidden",
            borderBottom: "2px solid "+Config.COLORS.red
        });
        
        _bg = _elem.create(".bg");
        _bg.size(Global.SIDEBAR.width*1.2, _self.maxheight).bg(Config.COLORS.red).transform({
            x: -Global.SIDEBAR.width*1.4,
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        });
    }

	function _addText(){
		var text_params = {
			index: _self.params.index,
			height: _self.maxheight, 
			totalheight: _self.params.totalheight
		};
		
		if (_self.params.subnav){
			text_params.subnav = true;
		}else{
			text_params.subnav = false;
		}
		
		_textbox = _self.initClass(SidebarNavItemTxt, text_params);
    }
    
	function _addSubNav(){
		var subnav_params = {
			items: _self.params.subnav,
			parent_item: Config.NAV[_self.params.index].type,
			parent_maxheight: _self.maxheight,
			parent_minheight: _self.minheight,
			parent_height: _self.height,
			totalheight: _self.params.totalheight
		};
		
		_subnav = _self.initClass(SidebarSubNav, subnav_params);
	}
	
	// open submenu
	function _open(){
		// change text color
		_textbox.textcolor(Config.COLORS.white, 150, 0);
		
		// open
		var subnavOpenHeight = _self.params.totalheight - (Config.NAV.length * _self.minheight);
		var newheight = subnavOpenHeight + _self.minheight;
		
		_elem.tween({
			height: newheight
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_bg.tween({
			height: newheight,
			skewX: 0,
			background: Config.COLORS.redshade
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_textbox.animateHeight(_self.minheight);
	}
	
	// close submenu
	function _close(){
		if (Global.SIDEBAR.subnavOpened === false){
			// no subnav open, resize to expanded state
			// change text color
			_textbox.textcolor(Config.COLORS.branding, 150, 0);
			
			_elem.tween({
				height: _self.maxheight
			}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
			
			_bg.tween({
				height: _self.maxheight,
				background: Config.COLORS.red
			}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
			
			_textbox.animateHeight(_self.maxheight);
		}else{
			// subnav open, resize to compressed state
			_elem.tween({
				height: _self.minheight
			}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
			
			_textbox.textcolor(Config.COLORS.red, 150, 50);
	        
	        _bg.tween({
	            x: Global.SIDEBAR.width*1.4,
	            height: _self.minheight,
	            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW,
	            background: Config.COLORS.red
	        }, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
	        
	        _textbox.animateHeight(_self.minheight);
		}
	}
	
	// expand nav item when a submenu is closed
    function _expand(){
		_elem.tween({
			height: _self.maxheight
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_bg.tween({
			height: _self.maxheight
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_textbox.animateHeight(_self.maxheight);
	}
	
	// compress nav item when a submenu is opened
	function _compress(){
		_elem.tween({
			height: _self.minheight
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_bg.tween({
			height: _self.minheight
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
		
		_textbox.animateHeight(_self.minheight);
	}

	function _setActive(){
		_active = true;
	}

	function _setInactive(){
		_active = false;
	}

	this.setActive = function(){
		_setActive();
	};

	this.setInactive = function(){
		_setInactive();
	};
	
	// toggle state of nav item when a subnav is opened/closed
	this.toggle = function(clicked_index){
		if (clicked_index === _self.params.index){
			// this item was clicked
			if (Global.SIDEBAR.subnavOpened === false && _self.opened === true){
				// already open, need to close
				_close();
				_self.opened = false;
			}else if (Global.SIDEBAR.subnavOpened === _self.params.index && _self.opened === false){
				// closed, need to open
				_open();
				_self.opened = true;
			}
		} else {
			// some other item was clicked
			if (Global.SIDEBAR.subnavOpened === false){
				// no subnav open, need to expand
				_expand();
			}else{
				// subnav open, need to close/compress
				if (_self.opened === true){
					_close();
					_self.opened = false;
				}else{
					_compress();
				}
			}
		}
	};
    
	this.resize = function(resize_params){
		var newheight;
		
		_self.params.index = resize_params.index;
		_self.params.totalheight = resize_params.totalheight;
		
		_self.maxheight = _self.params.totalheight/Config.NAV.length;
		_self.minheight = _self.maxheight - (_self.params.totalheight * 0.1);
		
		// set new height
		switch (Global.SIDEBAR.subnavOpened){
			case _self.params.index:
			// this one is open
			var subnavOpenHeight = _self.params.totalheight - (Config.NAV.length * _self.minheight);
			newheight = subnavOpenHeight + _self.minheight;
			_textbox.resize({
				height: _self.minheight,
				totalheight: _self.params.totalheight
			});
			break;
			
			case false:
			// nothing is open
			newheight = _self.maxheight;
			_textbox.resize({
				height: _self.maxheight,
				totalheight: _self.params.totalheight
			});
			break;
			
			default:
			// something else is open
			newheight = _self.minheight;
			_textbox.resize({
				height: _self.minheight,
				totalheight: _self.params.totalheight
			});
			break;
		}
		
		_elem.size("100%", newheight);
        
        _bg.size(Global.SIDEBAR.width*1.2, newheight);
        
        // resize subnav
        if (params.subnav){
	        var subnav_params = {
				parent_maxheight: _self.maxheight,
				parent_minheight: _self.minheight,
				parent_height: newheight,
				totalheight: _self.params.totalheight
			};
	        _subnav.resize(subnav_params);
        }
	};
    
    this.over = function (n) {
        _self.hovered = true;

        if (_self.opened === false && _active === false){
        	_textbox.textcolor(Config.COLORS.branding, 150, 100);
	        
	        _bg.stopTween().transform({
	            x: -Global.SIDEBAR.width*1.4,
	            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
	        }).tween({
	            x: 0 - (Global.SIDEBAR.width*0.1)
	        }, 300, Config.NAVCONFIG.easing);
        }
    };
    
    this.out = function (n) {
        _self.hovered = false;

        if (_self.opened === false && _active === false){
			_textbox.textcolor(Config.COLORS.red, 150, 50);
	        
	        _bg.stopTween().transform({
				skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
	        }).tween({
	            x: Global.SIDEBAR.width*1.4
	        }, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
        }
    };
    
    this.activate = function () {
        _self.active = true;
        console.log("nav item activate");
        /*l.stopTween().transform({
            x: -225
        }).tween({
            x: 0
        }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10);
        l.inner.stopTween().transform({
            x: 225
        }).tween({
            x: 0
        }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10)*/
    };
    
    this.deactivate = function () {
        _self.active = false;
        console.log("nav item deactivate");
        /*k.fontStyle("OpenSansSemi", 12, Config.COLORS.branding);
        l.tween({
            x: 225
        }, 600, "workSlice");
        l.inner.tween({
            x: -225
        }, 600, "workSlice");
        k.tween({
            opacity: 0.6
        }, 300, "easeOutSine");
        _bg.tween({
            x: 225
        }, 600, "workSlice");
        _self.delayedCall(function () {
            if (_self.active) {
                return
            }
            l.stopTween().transform({
                x: -225
            });
            l.inner.stopTween().transform({
                x: 225
            });
            _bg.stopTween().transform({
                x: -225
            })
        }, 800)*/
    };
    
    _self.lock = function () {};
    
    _self.release = function () {
        _elem.hit.show()
    };
    
    this.animateIn = function () {};
});