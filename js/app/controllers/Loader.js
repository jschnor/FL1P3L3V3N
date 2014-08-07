
Class(function Loader() {
    // console.log('======================================');
    // console.log('<div id="Loader> :: Controller');
    // console.log('======================================');

    Inherit(this, Controller);

    var _self = this;
    var _cont;
    var _load;
    var _alod, _ptst, _aset;

    (function () {
        _init();
        _getProgressImage(_startLoad);
    })();
    

    function _init() {
        _cont = _self.container;
        // _cont.size("100%").bg( 'white' );
        _cont.size("100%").bg( Config.COLORS.white );
    }
    
    function _startLoad() {
        _load = _self.initClass(LoaderView);
        _self.view   = _load;

        _self.delayedCall( _loadActions, Device.mobile ? 750 : 500 );
    }
    
    function _loadActions() {
        // console.log('MMMMMMMMMMMMMMMMM')
        
        // 'l' IS THE ARRAY EVERYTHING THAT NEEDS TO BE LOADED 
        // GETS PUSHED INTO;
        _aset = [];
        
        // if (Device.graphics.webgl && !Device.mobile) {
        //     l.push(Config.PROXY + "assets/models/home.json")
        // }
        
        // FEDevice.bundleAssets(["common", "shaders", "sidebar", "contact", (Data.STATE.page == "lab" ? "work" : Data.STATE.page) + "/"], l);
        FEDevice.bundleAssets(["common", "shaders"], _aset);
        // l.push(Config.PROXY + "assets/js/lib/three.min.js");
        // _aset.push(Config.PROXY + "/assets/js/lib/three.min.js");

        _loadImages();

        _alod = _self.initClass(AssetLoader, _aset);
        _alod.add(10);

        _alod.events.add(FlipEvents.PROGRESS, _onProgress);
        _alod.events.add(FlipEvents.COMPLETE, _onComplete);

        _ptst = _self.initClass(PerformanceTest);
        _ptst.events.add(FlipEvents.COMPLETE, _assetLoadTrigger);
    }

    // function c(q, r) {
    function _loadImages(q, r) {
        // console.log('================================')
        // console.log('Data.STATE.page: '+Data.STATE.page);
        // console.log('================================')
        // console.log('q: '+q)
        // console.log('r: '+r)
        r = r || _aset;
        
        if (!q) {
            // if (Data.STATE.page == "work") {
            //     q = Data.WORK.getImages();
            // } else {
            //     if (Data.STATE.page == "lab") {
            //         q = Data.LAB.getImages();
            //     }
            // }
        }
        if (q) {
            for (var p = 0; p < q.length; p++) {
                r.push(q[p]);
            }
        }
    }

    function _loadAssets() {
        // console.log('=========================')
        // console.log(Config.ASSETS.length);
        // console.log(d);
        // console.log('=========================')
        var __aset = [];
        for (var i = 0; i < Config.ASSETS.length; i++) {
            __aset.push(FEDevice.parseAsset(Config.ASSETS[i]));
        }
        // _loadImages( Data.WORK.getImages(), __aset);

        for (var i = 0; i < __aset.length; i++) {
            for (var j = 0; j < _aset.length; j++) {
                if (_aset[j].strpos(__aset[i])) {
                    __aset.splice(i, 1);
                }
            }
        }
        _alod.destroy();
        _alod = _self.initClass(AssetLoader, __aset);
    }
    function _getProgressImage(_callback) {
        // console.log('q: ' + q);

        var _image       = new Image();
        // p.src       = Config.IMAGES + "loader/letter.png";
        _image.src       = Config.IMAGES + "loader/letter.png";
        _image.onload    = _callback;
    }

    function _onComplete() {

        _loadAssets();

        _self.delayedCall(function () {


            if (!Device.mobile) {
                // console.log('MOVE');
                _self.delayedCall(_load.move, 500);
            } else {
                // console.log('FADE');
                _self.delayedCall(_load.fade, 250);
            }

        }, 100);

        // REMOVE LOADER AFTER EITHER ANIMATION
        _self.delayedCall(function() {
            _self.events.fire(FlipEvents.COMPLETE);
        }, 500);
    }

    function _onProgress(p) {

        // console.log(p.percent)
        _load.update(p.percent);
    
    }
    function _assetLoadTrigger() {
        _alod.trigger(10);
    }
    this.animateOut = function () {
        _load.animateOut();
    }
});