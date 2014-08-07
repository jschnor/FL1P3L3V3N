Class(function SidebarNav() {
    Inherit(this, View);
    
    var _self = this, _elem, _navElements;
    var k, b;
    
    this.margins = 0;
    this.height = 0;
    
    (function () {
        _markup();
        _navItems();
        _eventPageChange();
        _onPageChange();
        _initResize();
    })();

    function _markup(){
        _elem = _self.element;
        
        _elem.css({
            overflow: "hidden",
            borderTop: "2px solid "+Config.COLORS.red
        });

        _setSize();
    }

    function _setSize(){
        var small = (Device.mobile.phone || Stage.height < 600);

        _self.margins = 113;
        if (small){
            _self.margins = 65;
        }

        if (Stage.height < 320 || Device.mobile.phone){
            _self.height = Stage.height - _self.margins;
        }else{
            _self.height = Stage.height - (_self.margins*2);
        }

        if (_self.height < 200){
            _self.height = 200;
        }

        if (_self.height > 500){
            _self.height = 500;
        }
        
        // subtract height of borders
        _self.height = _self.height - 12;

        _elem.css({
            width: Global.SIDEBAR.width,
            height: _self.height + (2*Config.NAV.length), // add borders to height based on number of items
            top: _self.margins
        });
    }

    function _navItems() {
        _navElements = [];
        
        var _pages = Data.PAGES.getPagesBySite(Data.SITE.creative);
        var params = {};

        // _getSubNav();

        // for (var i = 1; i < _pages.length; i++) {
        //     console.log(_pages[i]);
        // }

        for (var m = 0; m < Config.NAV.length; m++) {

            params = {
                index: m,
                totalheight: _self.height
            };

            // var is_contact = false;
            switch(Config.NAV[m].type) {
                case 'reels':
                    params.subnav = Data.CATEGORIES.getCategoryNameByType(3);
                break;
                case 'work':
                    params.subnav = Data.CATEGORIES.getCategoryNameByType(0);
                break;
                case 'about us':
                    params.subnav = ["Culture", "Team", "Our Clients"];
                break;
                case '2c content':
                    params.subnav = Data.CATEGORIES.getCategoryNameByType(4);
                break;
                case 'directors':
                    params.subnav = Data.CATEGORIES.getCategoryNameByType(1);
                break;
            }
            
            var nav_item = _self.initClass(SidebarNavItem, params);
            
            nav_item.events.add(FlipEvents.HOVER, _hoverActions);
            nav_item.events.add(FEEvents.SUBNAV_TOGGLE, _subNavToggle);
            
            nav_item.events.add(FEEvents.SUBNAV_EXPAND, _subNavExpand);
            nav_item.events.add(FEEvents.SUBNAV_COLLAPSE, _subNavCollapse);
            
            _navElements[Config.NAV[m].type] = nav_item;
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
            for (n in _navElements) {
                var m = o < b ? -1 : 1;
                if (_navElements[hoverevent.text].hovered) {
                    _navElements[hoverevent.text].out(m);
                }
                o++;
            }
            break;
        }
    }
    
    function _subNavToggle(eventparams){
        // set global value
        if (eventparams.index === Global.SIDEBAR.subnavOpened){
            // if the clicked item is the one that's already open, we must be closing it. set to false.
            Global.SIDEBAR.subnavOpened = false;
        }else{
            // we're going to open the subnav for this one. set to the index of the opened item.
            Global.SIDEBAR.subnavOpened = eventparams.index;
        }
        
        for (n in _navElements) {
            _navElements[n].toggle(eventparams.index);
        }
    }
    
    function _subNavExpand(params){
        for (n in _navElements) {
            _navElements[n].compress();
        }
    }
    
    function _subNavCollapse(params){
        for (n in _navElements) {
            _navElements[n].expand();
        }
    }

    function _onPageChange() {
        // console.log('SidebarNav :: onPageChange: _navElements[Data.STATE.page]');
        // console.log(Data.STATE.page);

        var m = _navElements[Data.STATE.page];
        // console.log('_navElements[Data.STATE.page');
        // console.log(_navElements[Data.STATE.page]);
        // console.log('==========================================================');
        // console.log(_navElements[Data.STATE.page]);
        // if (m) {
        //     if (m !== k) {
        //         if (k) {
        //             k.deactivate()
        //         }
        //         k = m;
        //         k.activate()
        //     }
        // } else {
        //     if (k) {
        //         k.deactivate()
        //     }
        //     k = null
        // }
    }
    
    function _initResize(){
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
    }
    
    function _onResize(){
        // redefine own height
        _setSize();
        
        // loop through nav elements and resize
        var index = 0;
        for (i in _navElements) {
            if (_navElements.hasOwnProperty(i)){
                var params = {
                    index: index,
                    totalheight: _self.height
                };
                
                _navElements[i].resize(params);
                
                index++;
            }
        }
    }
    
    this.animateIn = function () {};
    this.release = function () {
        for (m in _navElements) {
            _navElements[m].release()
        }
    }
});