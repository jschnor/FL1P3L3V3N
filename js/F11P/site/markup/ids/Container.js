Singleton(function Container() {

    Inherit(this, $id);

    var _self = this,
        _elem = _self.element,
        _loader,
        _bgcount = 0,
        _intro,
        _overlay,
        _fullbg,
        _cover,
        _borders,
        _pageclass;
    
    Global.CONTAINER = this;

    (function() {
        _init();
        _preloadSite();
    })();

    function _init() {
        _elem.size(Stage.width, Stage.height).bg(Config.COLORS.black).setProps({
            perspective: 2000
        });
        
        Stage.add(_elem);

        _overlay = _elem.create('.overlay');
        _overlay.size(Stage.width, Stage.height).setProps({
            opacity: 1
        }).bg(Config.COLORS.black).setZ(150);

        Evt.resize(_onResize);
    }

    function _addIntro(){
        _intro = _self.initClass(Intro, _removeOverlay);
    }

    function _preloadSite() {
        Evt.subscribe(_elem, Evt.BG_LOADED, _onBgLoaded);
        _loader = _self.initClass(Loader, _onLoadComplete);
    }

    function _onLoadComplete() {
        // console.log('LOADER CALLBACK');

        // attempt to rescale the stage when mobile chrome is visible
        // on initial load only
        // seems hackish
        if (Device.mobile.phone){
            window.scrollTo( 0, 1 );
            var scrollTop = 1;

            setTimeout(function(){
                window.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
            }, 50);
        }

        // add cover to hide website under some circumstances
        _addCover();

        // add full background
        _fullbg = _self.initClass(FullBackground);

        // set page state
        _pageState();
    }

    function _onBgLoaded(bgindex){
        _bgcount++;

        // see if all background have been loaded
        if (_bgcount == Data.HOME.length){
            // wait for browser to render images
            _self.delayedCall(function(){
                // assume all backgrounds loaded
                // _addIntro();
                _removeOverlay();
            }, 1200);
        }
    }

    function _onResize() {
        _elem.size(Stage.width, Stage.height);
        _overlay.size(Stage.width, Stage.height);

        // Transition.instance().resize();
    }

    function _addCover(){
        _cover = _self.initClass(Cover);
    }

    // SETS GLOBAL PAGES AND INITIALIZES
    // THAT PAGE NAME AS A CLASS
    function _pageState(pagename) {

        var _pagename = pagename;

        if (!_pagename) {
            _pagename = Data.STATE.page;
        }

        var className;


        
        // CURRENTLY, CLASSNAMES AND DATA STATE PAGE NAMES HAVE TO BE
        // THE SAME FOR PROPER ROUTING, SO:
        // _pagename/Global.PAGE must be the same as Data.STATE.page
        // ==========================================================
        // console.log(Data.STATE.page);
        
        switch (Data.STATE.page) {
            case 'home':
            default:
                className = Home;
                break;
        }

        Global.PAGE         = _pagename;
        _pageclass          = _self.initClass(className, null);
        
        _elem.add(_pageclass);

        // give home class time to load everything, then fade in intro message
        // _self.delayedCall(function(){
            // _loader.animateIn(_removeOverlay); // this callback is actually run on the loader's _animateOut.
        // }, 1250);
    }

    function _removeOverlay(){
        _overlay.tween({
            opacity: 0
        }, 1, Config.EASING.out, null, function(){
            _overlay.setProps({
                display: 'none'
            });

            // add borders
            _borders = _self.initClass(Borders);

            Global.HOME.bindScroll();
        });
    }
    
    function _onNavSelect(obj) {

        // CHECK TO SEE IF WE'RE ALREADY ON THIS PAGE
        if (History.getState().data.page == obj.page) {
            return;
        }
        var _title = obj.page == '/' ? 'Home' : Utils.capFirstLetter(obj.page);
        
        if(_pageclass.hasAnimateOut === true) {

            _pageclass.animateOut(function() {

                // if transitions are needed between pages -- next four lines
                Transition.instance().animateIn(function() {

                    _self.delayedCall(function() {

                        _pageclass = _pageclass.destroy();
                        
                        Data.STATE.setState(obj.page, 'F11P | Flipeleven | '+_title);
                        _pageState(Data.STATE.page);

                        

                    // }, Device.browser.firefox ? 1200 : 600);
                    }, 600);

                    _self.delayedCall(function() {
                        Transition.instance().animateOut();
                    }, 800);

                });
            });
        } else {
            // if transitions are needed between pages
            Transition.instance().animateIn(function() {

                Data.STATE.setState(obj.page, 'F11P | Flipeleven | '+_title);
                _pageState(Data.STATE.page);

            });
        }
    }
    

    // THIS RUNS EVERY TIME THE PAGE STATE RUNS
    this.checkBrowserBack = function() {

        if (Global.PAGE.toLowerCase() != Data.STATE.page.toLowerCase() && _pageclass) {
            
            if(_pageclass.hasAnimateOut === true) {
                _pageclass.animateOut(function() {

                    _pageclass = _pageclass.destroy();
                    _pageState(Data.STATE.page);
                });
            } else {
                
                _pageState(Data.STATE.page);
            }
        }
    };
});