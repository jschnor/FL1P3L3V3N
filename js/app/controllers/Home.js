Class(function Home() {

    Inherit(this, Controller);
    
    var _cont, _dataSet, _wlst, _halftone, _tint;
    var _work_el, new_fullBg, _wdtl, _hmsl, _hbck;
    var _pcon;

    var _self   = this;
    Global.HOME = this;
    // var _vc1    = new Vector2();
    // var _vc2    = new Vector2();

    // constructor
    (function () {
        _markup();
        _initWorkView();
        _getSlideData();
        _eventSubscribe();
        _handleDeepLink();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.size("100%").backfaceVisibility();
        // _cont.backfaceVisibility('visible');
    }
    
    function _initWorkView() {

        Global.HOME.transition = {};
        Global.HOME.origin = {};
        Global.HOME.textures = {};
        Global.HOME.transition.time = 1000;
        Global.HOME.transition.ease = "workOpen";

        // select data related to given page
        // var _data;
        // var _hmsl = [];

        if (Data.STATE.detail) {

        }

    }

    function _getSlideData() {

        _dataSet = Data.HOME.getData();

        console.log('HOME :: _getSlideData:');
        console.log(_dataSet);
        
        // _wlst = _self.initClass(WorkList, _dataSet);
        _hbck = _self.initClass(FullscreenBackground);
        _pcon = _self.initClass(PageContainer);
    
        
        _work_el = _self.element;
        
    }

    function _handleDeepLink() {


        if (Data.STATE.detail) {

            Global.HOME.detaillink = true;
            var _deep = Data.HOME.getDeep(Data.STATE.deep); // TODO: need to change based on page state
            var _detl = Data.HOME.getDetail(Data.STATE.detail); // TODO: need to change based on page state

            _detailSelect({ 'data': Data.HOME.getImageByPageDetail(Data.STATE.detail) });



        }

    }

    function _eventSubscribe() {

        // _wlst.events.add(FEEvents.SELECT, _detailSelect);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _handleDeepLink);

        _self.events.subscribe(FEEvents.VIDEO_LOAD, _loadFullVideo);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _unloadFullVideo);
    }

    function _detailSelect(l) {

        Global.DETAIL_OPEN = true;

        var _dat = l.data;

        _wdtl = _self.initClass(WorkDetail, _dat, "home");
        _wdtl.events.add(FEEvents.CLOSE, _close);
    }

    function _close() {

        Global.WORK.detaillink    = false;
        Global.DETAIL_OPEN      = false;

        Data.STATE.setState("work");

        // _wlst.resume();
        
        _wdtl.animateOut(function () {
            _wdtl = _wdtl.destroy();
        });
    }

    

        // functions for loading and unloading the full screen video
    function _loadFullVideo(params){
        //console.log("_loadFullVideo triggered");
        _video = _self.initClass(VideoOverlay, params.index);



        // _self.delayedCall(function(){
        //     _video.animateIn();
        // }, 1000);
    }


    function _unloadFullVideo(){
        //console.log("_unloadFullVideo triggered");

        _video.animateOut();

        _self.delayedCall(function(){
            _video.destroy();
        }, 500);
    }

    this.loadFullVideo = function(_index){
        _loadFullVideo(_index);
    };

    this.unloadFullVideo = function(){
        _unloadFullVideo();
    };

    this.loadBackground = function(_bgimage, _index) {
        
        _loadBackground(_bgimage, _index);
        
    };
    this.destroyBG = function() {
        // console.log('destroy');
        if (!Global.HOME.detaillink) {
            for (var ii = 3; ii < _work_el.children().length; ii++) {
                if (ii != _work_el.children().length - 1) {
                    var xtrabg = _self.container.children()[ii];
                    xtrabg.remove();
                }
            }
        }
    };
    this.bgresize = function() {
        // console.log('RESIZING');
        _positionBackground();
    };
    this.destroy = function () {
        // Global.BORDER.showBottom();
        return this._destroy();
    };
});
