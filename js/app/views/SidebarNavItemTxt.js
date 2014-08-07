Class(function SidebarNavItemTxt(params){
    Inherit(this, View);
    
    var _self = this, _elem, _text, _fontsize = 24;
    
    this.params = params;
    
    (function(){
        _markup();
        _initInteract();
    })();

    function _markup() {
        _elem = _self.element;
        
        _elem.size("100%", _self.params.height).css({
			position: "relative",
            overflow: "hidden"
        });
        
        _text = _elem.create(".text");
        
        _text.fontStyle("OpenSansSemi", _fontsize, Config.COLORS.red);
        _text.size("100%", "auto").center(0,1).css({
            textAlign: "center"
        });

        // set up text scaling vars
        _setSize();
        
        _text.text(Config.NAV[_self.params.index].type.toUpperCase());
    }

    function _setSize(){
        // set up text scaling vars
        var _fontsize = _self.params.totalheight * 0.048;
        var small = (Device.mobile.phone || Stage.height < 600);

        if (small){
            if (_fontsize < 14){
                _fontsize = 14;
            }

            if (!Device.mobile.phone){
                if (_fontsize < 18){
                    _fontsize = 18;
                }
            }
        }

        if (_fontsize > 24){
            _fontsize = 24;
        }

        _text.transform({
            y: -_fontsize/3,
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            fontSize: _fontsize,
            letterSpacing: _fontsize*0.174,
            lineHeight: _fontsize*0.8
        });
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }
    
    function _hoverActions(mouseevent){
		_self.parent.events.fire(FlipEvents.HOVER, {
            action: mouseevent.action,
            index: _self.params.index,
            text: Config.NAV[_self.params.index].type
       });

        // console.log(mouseevent.action);
        // console.log(_self.params.index);
    }

	function _clickActions(mouseevent) {
		if (_self.params.subnav === true){
			// has subnav, do open
			// fire global event

			_self.parent.events.fire(FEEvents.SUBNAV_TOGGLE, {
				index: _self.params.index,
				text: Config.NAV[_self.params.index].type
			});


		}else{
			// no subnav, plain nav action
			
			// close detail page when clicking navigation items
	        if (Config.NAV[_self.params.index].type.toLowerCase() == Global.PAGE && Global.DETAIL_OPEN) {
	            _self.parent.events.fire(FEEvents.CLOSE_DETAIL);
	        }
	        
	        if (Config.NAV[_self.params.index].type.toLowerCase() == "contact") {
                if (Global.CONTACT.opened === true){
                    _self.events.fire(FEEvents.CONTACT_CLOSE);
                }else{
                    _self.events.fire(FEEvents.CONTACT_OPEN);
                }
	        }
		}
    }
    
    this.animateHeight = function(height){
		_elem.tween({
			height: height
		}, Config.NAVCONFIG.duration, Config.NAVCONFIG.easing);
    };
    
    this.textcolor = function(newcolor, duration, delay){
		_text.tween({
			color: newcolor
		}, duration, Config.NAVCONFIG.easing, delay);
    };
    
	this.resize = function(resize_params){
		// update own parameters
		_self.params.height = resize_params.height;
		_self.params.totalheight = resize_params.totalheight;
		
		_elem.size("100%", _self.params.height);
		
		// set up text scaling vars
        _setSize();
        
        _text.size("100%", "auto").center(0,1);
	};
});