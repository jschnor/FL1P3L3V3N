Class(function Work() {
    // console.log('WORK')
    Inherit(this, Controller);

    var _self = this;
    // var j;
    // var a;
    var _cont, _dataSet, _wlst, _halftone, _tint;
    // var d, e;
    var _work_el, new_fullBg, _wdtl, _video;
    
    Global.WORK = this;

    var _vc1    = new Vector2();
    var _vc2    = new Vector2();

    (function () {
        _markup();
        // b();
        _initWorkView();
        // g()
        _eventSubscribe();
        _handleDeepLink();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.size("100%");
    }

    // function b() {
    //     d = ((!Device.mobile && Device.graphics.webgl) && !Device.browser.ie ? WorkGL : WorkCanvas).instance();
    //     _cont.add(d);
    //     d.resume();
    // }
    
    function _initWorkView() {

        Global.WORK.transition = {};
        Global.WORK.origin = {};
        Global.WORK.textures = {};
        Global.WORK.transition.time = 1000;
        Global.WORK.transition.ease = "workOpen";
        
        //console.log('WORK LIST INITIATED FROM Work()');

        // select data related to given page
        var rawDataSet;
        switch (Data.STATE.page) {
            // case "reels":
            // rawDataSet = Data.REELS.getData();
            // break;

            case "directors":
            rawDataSet = Data.DIRECTORS.getData();
            break;

            case "work":
            default:
            rawDataSet = Data.WORK.getData();
            break;
        }

        // console.log(Data.WORK.getData())
        // filter data by given category
        var filteredDataSet = [];

        // console.log('=======================');
        // console.log('rawDataSet');
        // console.log(rawDataSet);
        // console.log('=======================');

        if (Data.STATE.category || Data.STATE.deep){

            var catwithspaces = Data.STATE.category ? Data.STATE.category.replace(/-/g, " ") : Data.STATE.deep.replace(/-/g, " ");

            var new_index = 0;

            for (var i in rawDataSet){

                if (rawDataSet.hasOwnProperty(i)){

                    if (rawDataSet[i].main_categories.toLowerCase() == catwithspaces){
                        filteredDataSet[new_index] = rawDataSet[i];
                        filteredDataSet[new_index].original_index = i;
                        new_index++;
                    }

                }
            }
        }

        // build work list items from correct data set
        if (filteredDataSet.length > 0){

            // console.log(filteredDataSet);
            // console.log(_getSortedData(filteredDataSet));

            _dataSet = filteredDataSet;

        } else{
            _dataSet = rawDataSet;
        }

        // console.log("_dataSet:");
        // console.log(_dataSet);

        _wlst = _self.initClass(WorkList, _dataSet);
        
        if (Data.STATE.detail) {
            _wlst.element.css({
                opacity: 0
            });
            // console.log(_wlst)
        }

        _work_el = _self.element;
        
        // create halftone overlay
        _halftone = _work_el.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(6);
        
        // create tint overlay
        _tint = _work_el.create("overlay");
        _tint.size("100%").bg(Config.COLORS.black).css({
            opacity: 0.45
        }).setZ(7);
        
        // create initial background
        for (var ii in _dataSet) {

            for (var j = 0; j < _dataSet[ii].main_image.length; j++ ) {

                // console.log(_dataSet[ii].main_image[0]);

                if (_dataSet[ii].main_image[j]) {

                    //console.log(_dataSet[i].main_image[j].urlPath);
                    _loadBackground( _dataSet[ii].main_image[j].urlPath, j );
                    // _positionBackground();
                    _self.events.subscribe(FlipEvents.RESIZE, _positionBackground);

                    // console.log(j)

                    return;

                }
            }
        }
        // _loadBackground( _dataSet[0].main_image[0].urlPath, 0 );
        // 

        


        // LERP = LINEAR INTERPOLATION
        // IN THIS CASE, move _vc2 towards _vc1 by 0.075
        // _vc1.x = 400;
        // _vc1.y = 400;

        // _vc2.lerp(_vc1, 0.075);

        // console.log('_vc1');
        // console.log(_vc1);
        // console.log('_vc2');
        // console.log(_vc2);
        // console.log(_vc1.time)
        // NOTE THAT THIS CONSOLE LOG SHOWED THAT THE X & Y COORDINATES
        // OF VC2 MOVED INCREMENTALLY CLOSER TO VC1'S X & Y. LOOPING OVER
        // THIS EQUATION WOULD KEEP MOVING VC2 TOWARDS VC1

    }

    // function _getSortedData(_data) {
    //     var _hmsl = [];
    //     var _orderedData = [];
    //     console.log('_getSortedData')
    //     console.log(_data)
    //     for (var i = 0; i < _data.length; i++) {
    //         if (_data[i].status) {

    //             _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': _data[i] });
                
    //         }
    //     }
    //     _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder) });
    //     console.log('_hmsl')
    //     console.log(_hmsl)
    //     for (var j = 0; j < _hmsl.length; j++) {
    //         _orderedData.push(_hmsl[j].data);
    //     }
    //     console.log('_orderedData')
    //     console.log(_orderedData)
    //     return _orderedData;
    // }

    function _handleDeepLink() {

        console.log("WORK CONTROLLER _handleDeepLink() -----------");
        console.log("Page: "+Data.STATE.page);
        console.log("Category: "+Data.STATE.category);
        console.log("Deep: "+Data.STATE.deep);
        console.log("-------------------------------");
        // Data.STATE.deep = 'promos';
        // Data.STATE.deep = 'wake-haunted-hathaways';
        // console.log(Data.STATE.category);
        // if (Data.STATE.category) {

        //     // Global.WORK.deeplink = true;
        //     Global.WORK.categorylink = true;
        //     // var l = Data.WORK.getDeep(Data.STATE.deep); // TODO: need to change based on page state
        //     var l = Data.WORK.getDeepCategory(Data.STATE.category); // TODO: need to change based on page state
        //     if (!l) {
        //         return;
        //     }
        //     _wlst.openDeeplink(l);
        // }
        if (Data.STATE.detail) {

            Global.WORK.detaillink = true;
            var _deep = Data.WORK.getDeep(Data.STATE.deep); // TODO: need to change based on page state
            var _detl = Data.WORK.getDetail(Data.STATE.detail); // TODO: need to change based on page state

            console.log('HOME :: Data.WORK.getDeep: ' + _deep);
            console.log('HOME :: Data.WORK.getDetail: ' + _detl);
            // console.log("-------------------------------");
            console.log(Data.STATE.page);
            console.log(Data.STATE.deep);
            console.log(Data.STATE.detail);
            console.log(Data.WORK.getImageByPageDetail(Data.STATE.detail));
            // _wlst.setZ(-1);

            // _wdtl.openDeeplink( Data.HOME.getImageByPageState(Data.STATE.detail) );
            // _detailSelect(Data.STATE.detail);
            // _loadBackground(Data.HOME.getImageByPageState(Data.STATE.detail));

            // _self.events.fire(FEEvents.SELECT, {
            //     data: Data.HOME.getImageByPageState(Data.STATE.detail)
            // });
            _detailSelect({ 'data': Data.WORK.getImageByPageDetail(Data.STATE.detail) });

            _loadBackground(Data.WORK.getImageByPageDetail(Data.STATE.detail), Data.WORK.getNumByPageDetail(Data.STATE.detail));


        }
        // Data.STATE.unlock();

    }

    function _eventSubscribe() {
        _wlst.events.add(FEEvents.SELECT, _detailSelect);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _handleDeepLink);

        _self.events.subscribe(FEEvents.VIDEO_LOAD, _loadFullVideo);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _unloadFullVideo);
    }
    // function _onStateChange() {

    //     if (Data.STATE.page != "work") {
    //         console.log('work return')
    //         console.log('============================')
    //         return;
    //     }

    //     console.log('++++++++++++++++++++++++++++++++');
    //     console.log('WORK:: _onStateChange');
    //     console.log(Data.STATE.page);
        

    //     var _deep = Data.WORK.getDeep(Data.STATE.deep); // TODO: need to change based on page state
    //     console.log('_deep');
    //     console.log(_deep);
    //     console.log(Data.STATE.deep);
    //     console.log('++++++++++++++++++++++++++++++++');
    //     // var l = '/work/promos'
        
    //     // 'k' was WorkDetail, so this checks for the existance
    //     // of a WorkDetail object, without a Data.STATE.deep being
    //     // set, then force closes WorkDetail
    //     if (!Data.STATE.deep && _wdtl) {
    //         console.log('IF 1');
    //         _wdtl.forceClose();
    //     }
    //     if (Data.STATE.deep && !_wdtl) {
    //         console.log('IF 2');
    //         Global.WORK.deeplink = 1;
    //         if (_deep) {
    //             _wlst.openDeeplink(_deep);
    //         }
    //     }
    //     if (Data.STATE.deep && _wdtl && _deep) {
    //         console.log('IF 3');
    //         _wdtl.openDeeplink(_deep);
    //         Data.STATE.lock();
    //         _self.delayedCall(function () {
    //             Data.STATE.unlock();
    //         }, 1250);
    //     }
    // }

    // function f() {
    //     if (Data.STATE.page != "work") {
    //         return
    //     }
    //     // CHECKS TO SEE WHAT THE LAST LAB DEEP STATE
    //     // WAS SET FROM THE APP USING LABMODEL NAMESPACING
    //     var l = Data.WORK.getDeep(Data.STATE.deep);
    //     // IF DEEP STATE IS FALSE, BUT A WORK DETAIL EXISTS
    //     // FORCE CLOSE THE WORK DETAIL
    //     if (!Data.STATE.deep && k) {
    //         k.forceClose()
    //     }
    //     // IF DEEP STATE IS TRUE AND WORK DETAIL DOESN'T
    //     // EXIST, SET WORK CONTROLLER DEEPLINK TO TRUE
    //     if (Data.STATE.deep && !k) {
    //         Global.WORK.deeplink = 1;
    //         // IF THERE L OR DATA STATE DEEP IS DEFINED
    //         // OPEN DEEP LINK CALLED FROM 'e()' WORK LIST
    //         // AND PUSHES L 'DATA STATE DEEP'  
    //         if (l) {
    //             e.openDeeplink(l)
    //         }
    //     }
        
    //     if (Data.STATE.deep && k && l) {
    //         // CHECKS FOR DATA STATE DEEP VALUE
    //         // 'K' CHECKS FOR THE EXISTENCE OF WORK DETAIL
    //         // 'L' CHECKS FOR EXISTANCE OF DATA STATE DEEP
    //         k.openDeeplink(l);
    //         Data.STATE.lock();
    //         g.delayedCall(function () {
    //             Data.STATE.unlock()
    //         }, 1250)
    //     }
    // }

    function _detailSelect(l) {
        Global.DETAIL_OPEN = true;
        console.log('WORK DETAIL INITIATED FROM Work()');

        _wdtl = _self.initClass(WorkDetail, l.data, "work");
        _wdtl.events.add(FEEvents.CLOSE, _close);
    }

    function _close() {

        console.log('===============')
        console.log('CLOSING TIME!!')
        console.log('===============')
        Global.WORK.deeplink = false;
        Global.DETAIL_OPEN = false;

        Data.STATE.setState("work");

        _wlst.resume();
        
        _wdtl.animateOut(function () {
            _wdtl = _wdtl.destroy();
        });
    }

    function _positionBackground() {

        // TODO: FIGURE OUT ASPECT AND SET IT FOR OUR IMAGES
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        new_fullBg.canvas.size(_wdth, _hght);
        new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0, _wdth, _hght);

        // USED TO HELP CENTER
        // if (Mobile.os == "iOS") {
        //     new_fullBg.object.center();
        // } else {
            new_fullBg.css({
                top: Stage.height / 2 - _hght / 2,
                left: FEDevice.width / 2 - _wdth / 2
            }).transform({
                y: 0,
            });
        // }

    }

    function _loadBackground(_img, _ind) {
        console.log("DERP DERP DERP");
        new_fullBg = _work_el.create("fullbg").css({
            opacity: 0
        });

        new_fullBg.css({
            background: ""
        }).setZ(5);
        
        new_fullBg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        new_fullBg.add(new_fullBg.canvas);
        new_fullBg.texture = new Image();
        new_fullBg.texture.src = FEDevice.getAsset(_img, "jpg");

        new_fullBg.index = _ind;

        new_fullBg.texture.onload = function () {

            _bgIsSet = true;

            new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0);
            _positionBackground();

            new_fullBg.tween({
                opacity: 1
            }, 800, 'easeOutQuad', null, _self.destroyBG);

        };


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
    
    // load full screen background image
    this.loadBackground = function(_bgimage, _index) {
        _loadBackground(_bgimage, _index);  
    };

    this.destroyBG = function() {
        // console.log('destroy');
        if (!Global.WORK.detaillink) {
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
