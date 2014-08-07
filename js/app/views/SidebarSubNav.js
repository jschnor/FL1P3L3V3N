Class(function SidebarSubNav(subnav_params) {
    Inherit(this, View);
    
    var _self = this, _elem, _navElements;
    var k, b;
    
    this.openHeight = subnav_params.totalheight - (Config.NAV.length * subnav_params.parent_minheight);
    
    (function () {
        _markup();
        _navItems();
        //_eventPageChange();
        //_onPageChange();
    })();

    function _markup(){
        _elem = _self.element;
        
        _elem.size(Global.SIDEBAR.width, _self.openHeight).css({
			position: "relative",
            overflow: "hidden"
        });
        
        /*if (Mobile.os == "iOS") {
            m.size(85, 0).css({
                borderTop: "1px solid" + Config.COLORS.branding
            });
        }*/
    }

    function _navItems() {
        _navElements = [];
        
        for (var i in subnav_params.items){

            // console.log('SIDEBAR SUB NAV :: ' + subnav_params.items);
            // console.log('SIDEBAR SUB NAV :: ' + subnav_params.items);

			if (subnav_params.items.hasOwnProperty(i)){
				var params = {
					index: i,
					text: subnav_params.items[i],
                    parent_text: subnav_params.parent_item,
                    openheight: _self.openHeight,
					totalheight: subnav_params.totalheight,
					totalitems: subnav_params.items.length
				};
				
				var nav_item = _self.initClass(SidebarSubNavItem, params);
				
				//nav_item.events.add(FlipEvents.CLICK, _clickActions);
				//nav_item.events.add(FlipEvents.HOVER, _hoverActions);
				
				_navElements[subnav_params.items[i]] = nav_item;
			}
        }
    }

    function _eventPageChange() {
        _self.events.subscribe(FEEvents.PAGE_CHANGE, _onPageChange);
    }

    function _hoverActions(hoverevent) {
        switch (hoverevent.action) {
        case "over":

            var m = hoverevent.index < b ? -1 : 1;
            _navElements[hoverevent.text].over(m);
            b = hoverevent.index;
            break;
        case "out":
            var o = 0;
            for (var n in _navElements) {
                var p = o < b ? -1 : 1;
                if (_navElements[hoverevent.text].hovered && !_navElements[hoverevent.text].active) {
                    _navElements[hoverevent.text].out(p);
                }
                o++;
            }
            break;
        }
    }

    function _onPageChange() {

		console.log('sidebar onPageChange:');
		console.log(Data.STATE.page);


        var m = _navElements[Data.STATE.page];
        if (m) {
            if (m !== k) {
                if (k) {
                    k.deactivate();
                }
                k = m;
                k.activate();
            }
        } else {
            if (k) {
                k.deactivate();
            }
            k = null;
        }
    }
    
    this.resize = function(resize_params){
		// redefine own height
		_self.openHeight = resize_params.totalheight - (Config.NAV.length * resize_params.parent_minheight);
		
		_elem.size(Global.SIDEBAR.width, _self.openHeight);

        // resize nav items
        for (var i in _navElements) {
            var item_params = {
                openheight: _self.openHeight,
                totalheight: resize_params.totalheight
            };

            _navElements[i].resize(item_params);
        }
	};
    
    this.animateIn = function () {};
    this.release = function () {
        for (var m in _navElements) {
            _navElements[m].release();
        }
    };
});