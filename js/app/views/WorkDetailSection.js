Class(function WorkDetailSection(workImage, p) {
    Inherit(this, View);

    var _self = this;
    this._prma = workImage;
    var _elem, _cont, _detailIndex, _sidebar, _playButton;
    var f, b, k, h, i;
    var s;
    this.data = workImage;
    this.y = 0;
    this.detailOpen = false;
    var _data;
    
    (function(){
        
        console.log('---------------------------------------------------');
        console.log('WORK DETAIL SECTION :: workImage: ' + workImage);
        console.log('WORK DETAIL SECTION :: parent:');
        // console.log(parent);
        console.log(Global.PAGE);

        // console.log(this.parent);
        // console.log(_self.parent.);

        console.log('WORK DETAIL SECTION :: p: ' + p);
        console.log('---------------------------------------------------');


        _init();
        _initEvents();
        //a();
        //o();
        //e()
    })();

    function _init() {
        _elem = _self.element;
        _elem.size("100%").css({
            overflow: "hidden"
        });

        // identify the correct data object
        // var workData = Data.WORK.getData();
        // var _data;
        console.log('WORK DETAIL SECTION :: Data.STATE.page: '+Data.STATE.page)

        switch(Data.STATE.page) {
            // case 'home':
            //     _data = Data.HOME.getSortedData();
            // break;
            // case 'case-studies':
            //     _data = Data.HOME.getData();
            // break;
            case "home":
                _data = Data.HOME.getSortedData();
            break;
            case "reels":
                _data = Data.REELS.getData();
            break;
            case "work":
            case "directors":
                _data = Data.WORK.getData();
            break;
            case "content":
                _data = Data.CONTENT.getData();
            break;

        }


        for (var i in _data){
            if (_data[i].main_image.length > 0){
                if (_data[i].main_image[0].urlPath === workImage){
                    console.log(':::::::::::::::::::::::::::::::::::');
                    console.log('WORK DETAIL SECTION ::');
                    console.log('_data[i]:');
                    console.log(_data[i]);
                    console.log(_data[i].num);
                    console.log(_data[i].main_image[0].urlPath);
                    console.log(workImage);

                    _detailIndex = _data[i].num;

                    // console.log(_detailIndex);

                    _sidebar = _self.initClass(WorkDetailSidebar, _detailIndex);
                    _playButton = _self.initClass(WorkDetailPlay, _detailIndex);
    
                }
                // if (_data[i].num == 
            }
        }
        console.log(':::::::::::::::::::::::::::::::::::');

        //console.log(Data.WORK.getData()[_detailIndex]); // works

        /*if (Mobile.phone) {
            _elem.touchSwipe(l);
        }*/

        /*_cont = _elem.create("container");
        _cont.size("100%").setZ(3);
        _cont.transform({
            skewY: Config.SKEW
        }).transformPoint(0, 0);*/

        /*var u = _elem.create(".bottom");
        u.css({
            width: "100%",
            height: 8,
            left: 0,
            bottom: 0
        }).bg(Config.COLORS.black).setZ(99).transform({
            z: 1,
            y: 1
        });*/

        /*var v = _elem.create(".bottom");
        v.css({
            width: "100%",
            height: 8,
            left: 0,
            top: 0
        }).bg(Config.COLORS.black).setZ(99).transform({
            z: 1,
            y: -1
        });*/
    }

    function _initEvents(){
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _animateChildrenOut);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _animateChildrenIn);
    }

    function a() {
        console.log('Adds all details to the page');
        // f = _self.initClass(WorkDetailVideo, workImage, p);
        // f.events.add(FEEvents.MOBILE_GALLERY_UPDATE, g);
        // k = _self.initClass(WorkDetailTitle, workImage, null);
        // if (!Mobile.phone) {
        //     h = _self.initClass(WorkDetailExpandButton, null)
        // }
        // i = _self.initClass(WorkDetailInfo, workImage, null);
        // _cont.add(k);
        // if (h) {
        //     _cont.add(h)
        // }
        // _cont.add(i)
    }

    function e() {
        
        console.log('======================================');
        console.log('e from WORK DETAIL SECTION + n.images');
        console.log(workImage.images);
        console.log(workImage.arguments);
        console.log(workImage);
        console.log(workImage._filename);
        console.log('======================================');

        for (var v = 0; v < workImage.images; v++) {
            var u = new Image();
            u.src = FEDevice.getDetailAsset(workImage, v);
        }
    }

    function o() {
        if (h) {
            h.events.add(FlipEvents.CLICK, t);
        }
    }

    function t() {
        _self.detailOpen = true;
        if (b) {
            b = b.destroy();
        }
        b = _self.initClass(WorkDetailContent, workImage, null);
        b.events.add(FlipEvents.CLICK, c);
        //_cont.add(b);
        f.fadeOut();
        k.expand();
        i.expand();
    }

    // close detail view???
    function c(v) {
        _self.detailOpen = false;
        var u = v && v.quick ? true : false;
        b.animateOut(u, function () {
            b = b.destroy();
        });
        f.fadeIn();
        if (h) {
            _self.delayedCall(h.reset, 300)
        }
        k.reset();
        i.reset();
    }

    function l(u) {
        if (u.direction && (u.direction == "right" || u.direction == "left")) {
            f.swipe(u.direction);
        }
    }

    function g(u) {
        if (u.type == "out") {
            i.tween({
                x: u.dir == "left" ? -Stage.width : Stage.width
            }, 400, "workOpen");
            k.tween({
                x: u.dir == "left" ? -Stage.width : Stage.width
            }, 400, "workOpen");
        } else {
            i.transform({
                x: u.dir == "left" ? Stage.width : -Stage.width
            }).tween({
                x: 0
            }, 400, "workOpen");
            k.transform({
                x: u.dir == "left" ? Stage.width : -Stage.width
            }).tween({
                x: 0
            }, 400, "workOpen");
        }
    }

    function _onResize(){
        _sidebar.resize();
        _playButton.resize();
    }

    function _animateChildrenOut(){
        _sidebar.animateOut();
        _playButton.animateOut();
    }

    function _animateChildrenIn(){
        _sidebar.animateIn();
        _playButton.animateIn();
    }

    // called by WorkDetail to animate the section in
    // calls other animate functions and sets state
    this.animateIn = function (v, u) {

        console.log('======================');
        console.log('ANIMATE IN!');

        console.log('======================');
        console.log('Global.PAGE: ' + Global.PAGE);
        console.log(Global.PAGE);

        console.log('Global.CURRENT_PAGE: ' + Global.CURRENT_PAGE);
        console.log(Global.CURRENT_PAGE);

        console.log(_data);

        console.log(_detailIndex);

        console.log('======================');

        var _prma;
        var _ctgy;
        switch (Global.CURRENT_PAGE) {
            case Global.HOME:
            case Global.WORK:
                _prma = !Data.WORK.getWorkByNum(_detailIndex).permalink ? Data.WORK.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.WORK.getWorkByNum(_detailIndex).permalink;
                _ctgy = !Data.STATE.category ? Utils.urlstr(Data.WORK.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

            break;
            case Global.REELS:
                _prma = Data.REELS.getWorkByNum(_detailIndex)._filename.toLowerCase();
                _ctgy = !Data.STATE.category ? Utils.urlstr(Data.REELS.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

            break;
            case Global.CONTENT:
                _prma = !Data.CONTENT.getWorkByNum(_detailIndex).permalink ? Data.CONTENT.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.CONTENT.getWorkByNum(_detailIndex).permalink;
                _ctgy = !Data.STATE.category ? Utils.urlstr(Data.CONTENT.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

            break;
        }
        // if (Global.CURRENT_PAGE == Global.HOME || Global.CURRENT_PAGE == Global.WORK) {
        // }
        // var _prma = !Data.WORK.getWorkByNum(_detailIndex).permalink ? Data.WORK.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.WORK.getWorkByNum(_detailIndex).permalink;
        // var _ctgy = !Data.STATE.category ? Utils.urlstr(Data.WORK.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

        _sidebar.animateIn();
        _playButton.animateIn();

        // var _page = Data.STATE.page == 'home' || Data.STATE.page == 'featured' ? 'featured' : Data.STATE.page;
        var _page = Data.STATE.page;

        // set browser state
        if (!Device.mobile) {
            console.log('ANIMATE IT DELAY');
            console.log(Data.STATE.page);
            console.log(_page);

            // if (_page == 'home' || _page == 'featured') {
            //     Data.STATE.setState(_page + '/' + _prma);
            // } else {
            //     Data.STATE.setState(_page + "/" + _ctgy + '/' + _prma);
            // }
            Data.STATE.setState(_page + "/" + _ctgy + '/' + _prma);

        } else {

            if (FEDevice.PERFORMANCE > 0) {
                _self.delayedCall(function () {

                    // if (_page == 'home' || _page == 'featured') {
                    //     Data.STATE.setState(_page + '/' + _prma);
                    // } else {
                    //     Data.STATE.setState(_page + "/" + _ctgy + '/' + _prma);
                    // }
                    Data.STATE.setState(_page + "/" + _ctgy + '/' + _prma);

                }, 1000);
            }

        }
    };

    this.animateOut = function () {
        if (FEDevice.PERFORMANCE < 1) {
            _elem.css({
                top: -99999
            });
            f.deactivate();
            return;
        }

        _sidebar.animateOut();
        _playButton.animateOut();

        // f.animateOut();
        // k.animateOut();
        // i.animateOut();
        /*if (h) {
            h.animateOut();
        }*/
        /*if (b) {
            b.animateOut(true, null);
        }*/
    };
    this.deactivate = function () {
        // f.deactivate();
        /*if (b) {
            c()
        }*/
    };
    this.setTitle = function (u) {
        s = u;
        /*if (s == -1) {
            _title.div.style.top = "10px";
            _title.div.style.bottom = "";
        }
        if (s == 1) {
            _title.div.style.top = "";
            _title.div.style.bottom = "10px";
        }*/
    };
    this.scroll = function (w) {
        w.toFixed(4);
        var v = Math.abs(w);
        if (v > Stage.height - 80 && v < Stage.height) {
            var u = (Stage.height - v) / 80;
            //_title.y = s * -20 * u;
            //_title.transform();
            //_title.div.style.opacity = u - 0.1;
        }
        this.y = w;
        _elem.y = w;
        //_cont.y = w * 0.5;
        //_cont.transform();
        _elem.transform();
        // f.resume()
    };
    this.closeDetail = function () {
        c();
    };
    this.pause = function () {
        // f.pause()
    };

    // tween on scroll to next/previous work item???
    this.tween = function (v, u) {
        u = u || 1000;
        this.y = v;
        _elem.tween({
            y: v
        }, u, "workOpen");
        /*_cont.tween({
            y: 0
        }, u, "workOpen");*/
    }
});