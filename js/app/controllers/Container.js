Class(function Container() {

    Inherit(this, Controller);

    var _self   = this;
    var z       = 0;

    var _cont, _load, _elem;
    var _tpbr, _cnct, _icon;
    var _pageclass, _covr;



    (function () {

        Global.CONTAINER = _self.element;

        Mouse.capture();
        _markup();
        
        // PREVIOUSLY ADDED BORDERS, WHICH CALLED SIDEBAR
        // WHICH HAD A DELAYED CALL TO PAGE STATE
        _initLoader();

    })();

    function _markup() {

        _cont = _self.container;

        _cont.size(Stage.width, Stage.height).css({
            overflow: "hidden"
        }).setZ(2);

        Stage.add(_cont);

        
        _elem = _cont.create(".ContainerWrapper");
        _elem.size("100%");

        _covr = _self.initClass(Cover, false);
        Stage.add(_covr);
    }

    // Initializes 'loader' and calls back function after COMPLETE
    function _initLoader() {

        _load = _self.initClass(Loader);
        _load.events.add(FlipEvents.COMPLETE, _initNavigation);

    }

    // RENDERS SIDEBAR
    function _initNavigation() {
        // console.log('INIT SIDEBAR');

        _tpbr = _self.initClass(TopBar, _cont);
        // _icon = _self.initClass(SidebarIcon);
        // _side = _self.initClass(Sidebar);

        // _cnct = _self.initClass(Contact);

        _eventsubscribe();

        _onResize();

        _self.delayedCall(function () {

            // THIS TRANSITION IS A LARGE BLACK BOX THAT IS
            // IMMEDIATELY ADDED TO THE PAGE 
            Transition.instance().resize();

            // THIS SELECTS THE PAGE STATE AND SERVES THE VIEW
            _pageState();

        }, Device.browser.firefox ? 1000 : 500);

        _self.delayedCall(function () {

            // THIS IS THE TRANSITION AFTER
            // LOADING INFORMATION ONTO PAGE
            Transition.instance().animateOut();

            _load = _load.destroy();

        }, Device.browser.firefox ? 1200 : 600);

    }

    // SETS GLOBAL PAGES AND INITIALIZES
    // THAT PAGE NAME AS A CLASS
    function _pageState(pagename) {

        if (!pagename) {
            pagename = Data.STATE.page;
        }

        var className;


        // decide which page to display
        switch (Data.STATE.page) {
            // can we use the same controller for all these?
            case "work":
                className = Work;
                break;
            default:
                className = Home;
                break;
        }

        Global.PAGE         = pagename;
        _pageclass          = _self.initClass(className, null);
        Global.CURRENT_PAGE = _pageclass;
        
        _elem.add(_pageclass);
        
    }

    // function o() {
    function _eventsubscribe() {
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
        _self.events.subscribe(FEEvents.NAV_SELECT, _navSelectCallback);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _setNavSelectCallback);

        if (Device.mobile) {
            _elem.bind("touchstart", A);
        } else {
            _cont.bind("click", p);
        }
    }
    
    function A() {
        if (Global.SIDEBAR_OPEN) {
            h({
                open: false,
                noDelay: true
            })
        }
    }
    function p() {
        if (Global.CONTACT_OPEN) {
            i({
                open: false
            });
        }
    }
    
    function _onResize() {

        var D = Device.mobile ? 0 : 0;
        var C = Stage.width - D;
        var B = Stage.height;

        _cont.size(Stage.width, Stage.height);

        _elem.css({
            left: D,
            width: C,
            height: B
        });

        FEDevice.width = C;
        FEDevice.height = B;

        if (Mobile.phone) {
            if (FEDevice.width > FEDevice.height) {
                _covr.show("landscape");
            } else {
                _covr.hide();
            }
        }
        if (!Device.mobile) {
            if (!window.navigator.msPointerEnabled) {
                if (Stage.width < 580) {
                    _covr.show("smallDesktop");
                } else {
                    _covr.hide();
                }
            }
        }
        _self.events.fire(FEEvents.RESIZE);
    }
    
    function _setNavSelectCallback() {   

        var _type = Data.STATE.page;
        
        if (Data.STATE.deep) {
            _type += '/' + Data.STATE.deep;
        }
        if (Data.STATE.detail) {
            _type += '/' + Data.STATE.detail;
        }


        Data.STATE.unlock();

        _navSelectCallback({
            type: _type 
        });
    }

    function _navSelectCallback(C) {


        if (FEDevice.IE9) {
            if (C.type == "home") {
                C.type = "work"
            }
        }

        if (Global.TRANSITION) {
            _pageclass.element.hide();
        }
        
        _self.type = C.type;

        var B = z < C.index ? 1 : -1;

        z = C.index;

        Global.TRANSITION = true;

        Data.STATE.setState(C.type);


        Transition.instance().animateIn(B, C.type, t);
    }

    function t(pagename) {
        
        console.log(':: CONTAINER t(pagename): '+ _self.type);
        console.log(pagename);

        if (_self.type !== pagename) {
            return;
        }
        
        _pageclass = _pageclass.destroy();
        _pageState(_self.type);

        _self.delayedCall(j, 250);
    }

    function j() {
        if (_self.type !== Global.PAGE) {
            return;
        }

        Transition.instance().animateOut();
        Global.TRANSITION = false;
        // Data.STATE.unlock()
    }
}, "Singleton");