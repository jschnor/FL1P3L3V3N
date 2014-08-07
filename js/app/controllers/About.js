Class(function About() {
    Inherit(this, Controller);

    var _self = this, _elem, _cont, _aboutList;

    //var _wdtl;
    
    Global.ABOUT = this;

    var _vc1    = new Vector2();
    var _vc2    = new Vector2();

    (function () {
        _markup();
        _initAboutView();
        //_eventSubscribe();
        //_handleDeepLink();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.size("100%");
    }
    
    function _initAboutView() {
    	Global.ABOUT.transition = {};
        Global.ABOUT.origin = {};
        Global.ABOUT.textures = {};
        Global.ABOUT.transition.time = 1000;
        Global.ABOUT.transition.ease = "workOpen";

        _elem = _self.element;

        var _dataSet = ["Culture", "Team", "Clients"];
        _aboutList = _self.initClass(AboutList, _dataSet); // put in about sections?
    }


    function _handleDeepLink() {
        console.log("ABOUT CONTROLLER _handleDeepLink() -----------");
        console.log("Page: "+Data.STATE.page);
        console.log("Category: "+Data.STATE.category);
        console.log("Deep: "+Data.STATE.deep);
        console.log("-------------------------------");
        // Data.STATE.deep = 'promos';
        // Data.STATE.deep = 'wake-haunted-hathaways';
        // console.log(Data.STATE.category);
        // if (Data.STATE.category) {

        //     // Global.ABOUT.deeplink = true;
        //     Global.ABOUT.categorylink = true;
        //     // var l = Data.WORK.getDeep(Data.STATE.deep); // TODO: need to change based on page state
        //     var l = Data.WORK.getDeepCategory(Data.STATE.category); // TODO: need to change based on page state
        //     if (!l) {
        //         return;
        //     }
        //     _aboutList.openDeeplink(l);
        // }
        if (Data.STATE.deep) {

            // Global.ABOUT.deeplink = true;
            Global.ABOUT.deeplink = true;
            var _deep = Data.WORK.getDeep(Data.STATE.deep); // TODO: need to change based on page state
            // var l = Data.WORK.getDeepCategory(Data.STATE.category); // TODO: need to change based on page state
            console.log('WORK :: _deep: '+_deep);
            console.log("-------------------------------");


            // if (!_wdtl) {
            //     return;
            // }
            _aboutList.openDeeplink(_deep);
        }
        // Data.STATE.unlock();
    }

    function _eventSubscribe() {
        _aboutList.events.add(FEEvents.SELECT, _detailSelect);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _handleDeepLink);

        //_self.events.subscribe(FEEvents.VIDEO_LOAD, _loadFullVideo);
        //_self.events.subscribe(FEEvents.VIDEO_UNLOAD, _unloadFullVideo);
    }

    /*function _detailSelect(l) {
        Global.DETAIL_OPEN = true;
        console.log('WORK DETAIL INITIATED FROM Work()');

        _wdtl = _self.initClass(WorkDetail, l.data, "work");
        _wdtl.events.add(FEEvents.CLOSE, _close);
    }*/

    /*function _close() {
        console.log('===============')
        console.log('CLOSING TIME!!')
        console.log('===============')
        Global.ABOUT.deeplink = false;
        Global.DETAIL_OPEN = false;

        Data.STATE.setState("work");

        _aboutList.resume();
        
        _wdtl.animateOut(function () {
            _wdtl = _wdtl.destroy();
        });
    }*/

    this.destroy = function () {
        // Global.BORDER.showBottom();
        return this._destroy();
    };
});
