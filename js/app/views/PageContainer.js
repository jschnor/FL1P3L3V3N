Class(function PageContainer() {

    Inherit(this, View);
    
    var _self = this;
    var _elem, _bckg, _cont, _home, _data;
    var i, z;

    var e               = true;
    var _scrollspeed    = 15;
    var _pageMargin     = 200;
    var _buffer         = Stage.height + _pageMargin;
    var a               = new Vector2(); // container vector
    var n               = new Vector2(); // user scroll vector;
    var _pageHeight;

    // this.container;

    (function () {
        _markup();
        _onResize();
        _getContent();
        _initScrollAndPosition();

        Render.startRender(_moveContainer);
        Render.nextFrame(_animateIn);
    })();

    function _markup() {
        // console.log('PAGE CONTAINER :: ');
        _elem = _self.element;
        _elem.size(Stage.width - _pageMargin, Stage.height).css({
            // opacity: 0.2,
            // borderLeft: '5px solid white',
            // borderRight: '5px solid white',
            // background: Config.COLORS.grey,
            left: Stage.width/2 - _elem.width/2
        }).setZ(100);

        _cont = _elem.create('container');
        _cont.css({
            // background: Config.COLORS.black
        });
        _cont.size('100%');
        _self.container = _cont;

        var _bg = _elem.create('bg');
        _bg.size('100%').css({
            // opacity: 0.5,
            // background: Config.COLORS.black
        });

        
    }

    

    function _getContent() {

        _home = _self.initClass(HomePage, _self, _pageMargin);

    }

    // BEGIN SCROLL
    function _moveContainer(pos) {
        // pos seems to be some kind of value that is related to the position of the work list items.
        // it's a very fine-tuned value
        // could be framerate?
        
        var stage_y = a.y;

        // arrow keys
        window.onkeydown = function(event){
            // console.log(event.keyCode);
            switch (event.keyCode){
                case 37:
                // left
                n.y += _scrollspeed;
                break;

                case 39:
                // right
                n.y -= _scrollspeed;
                break;
            }
        };
        
        // it's the lerp!
        a.lerp(n, 0.075);

        if (!z) {
            // identify scroll direction with a simple positive/negative value
            scrollDirection = a.y > stage_y ? -1 : 1;
        }

        if (Math.abs(n.y - a.y) <= 0.1 && a.y !== 0 && !z) {
            // H();
        }

        v(stage_y, a.y);
        
        _cont.y = a.y;
        
        _cont.y.toFixed(4);

        if (pos) {
            _cont.transform();
        }

        // workItemsLength = _items.length - 1;

        // for (var S = workItemsLength; S > -1; S--) {
        //     var workListItem = _items[S];

        //     // var W = a.y + (workListItem.y + workListItem.height);
        //     var W = a.y + (workListItem.y + workListItem.height);

        //     if (pos) {
        //         workListItem.parallax(_el.y);
        //     }

        //     if (W < 0 && scrollDirection == 1 && S === 0) {
        //         // triggered when stage comes in and when scrolling down
        //         //console.log('from _moveContainer(): _repositionOnDownScroll');
        //         _repositionOnDownScroll(workListItem);
        //     }

        //     //if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
        //     if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
        //         // triggered when stage comes in and when scrolling up
        //         //console.log('from _moveContainer(): _repositionOnUpScroll');
        //         _repositionOnUpScroll(workListItem);
        //     }
        // }
    }

    function _initScrollAndPosition() {
        
        // _self.events.subscribe(FlipEvents.RESIZE, _positionItems);

        ScrollUtil.link(_setScrollPosition);
        
        if (Device.mobile) {
            Stage.bind("touchstart", D);
            Stage.bind("touchend", u);
            Stage.bind("touchcancel", u);
        }
    }

    function _setScrollPosition(userScrollAmount) {
        // if (A) {
        //     return;
        // }

        // if (Math.abs(n.y - a.y) < 1000) {
        //     // n.x is amount the element will move
        //     n.y -= userScrollAmount * 2;
        // }
        console.log('PageContainer :: _pageHeight: ' + _pageHeight)

        if (Math.abs(n.y - a.y) < 1000) {
            // n.x is amount the element will move
            n.y -= userScrollAmount * 2;

            if (n.y > 0){
                n.y = 0;
            }

            // _pageHeight == undefined ? _pageHeight = Stage.height : '';

            if (n.y < -(_pageHeight - Stage.height*2 + _buffer)){

                n.y = -(_pageHeight - Stage.height*2 + _buffer);

                
            }
            // console.log(n.y);
            console.log(_pageHeight)
        }
    }

    function _setPageHeight(_height) {
        _pageHeight = _height;
    }

    // used when doing an upscroll reposition
    function s() {
        if (k) {
            return;
        }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            //console.log('from s(): _repositionOnUpScroll');
            // _repositionOnUpScroll(_items[_items.length - 1], true);
        });
    }

    function v(T, V) {

        var U = Math.abs(V - T);

        if (U > 100) {

            return;

        }
        if (U < 5) {

            if (!e) {
            
                e = true;
            
                _elem.mouseEnabled(true);
            
            }
        } else {
           
            if (e) {
           
                e = false;
           
                _elem.mouseEnabled(false);
           
                // for (var S = 0; S < _items.length; S++) {
           
                //     _items[S].disable();
           
                // }
            }
        }
    }

    function H() {
        // var _elX = _el.x;
        var _contY = _cont.y;

        a.y = 0;
        // console.log('===================')
        // console.log('H() CALLED!')
        // console.log('===================')
        n.y = 0;
        
        _cont.y = 0;
        
        _cont.transform();
        
    }

    // used when doing an upscroll reposition
    function s() {
        // if (k) {
        //     return;
        // }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            console.log('from s() ::');
            // _repositionOnUpScroll(_items[_items.length - 1], true);
        });
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeBackground);

        // _setPageHeight(Stage.height);
    }

    function _resizeBackground() {
        _elem.size(Stage.width - _pageMargin, Stage.height).css({
            // width: Stage.width-100,
            // height: Stage.height
        });
    }

    this.setPageHeight = function(_pheight) {
        _setPageHeight(_pheight);
    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});
