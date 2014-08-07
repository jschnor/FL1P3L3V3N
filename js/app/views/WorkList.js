Class(function WorkList(workdata) {
    Inherit(this, View);
    
    // var f = this;
    var _self = this;
    var _spacing = 0.56;

    // var o;
    // var g;
    var _elem, _el, _test, _button, _prev, _next;

    var _cube, _front, _right, _left, _back, _cubeWidth, _cubeHeight;
    var _rotateDegrees = 90;
    var _rotateIncrement = 0;

    var Q, O, z, L, A, q;
    var t, k, i, j, h;

    var _touchIncrement;
    var e = true;
    // var w = [];
    var _items = [];
    var _scrollspeed = 15;
    
    var a = new Vector2(); // container vector
    var n = new Vector2(); // user scroll vector
    var M = new Vector2();
    var x = new Vector2();
    var r = new Vector2();
    var l = new Vector2();
    var C = new Vector2();

    this.lastHovered = false;
    
    (function () {

        Global.CAN_CLICK = true;

        _markup();
        _initListItems();
        _initScrollAndPosition();
        _positionItems();
        _buttonActions();

        Render.startRender(_moveContainer);
        Render.nextFrame(_animateIn);

    })();

    function _markup() {

        /*console.log('========================');
        console.log('_markup() FROM WORK LIST');
        console.log('========================');*/
        _cubeWidth = Stage.width;
        _cubeHeight = Stage.height;

        _elem = _self.element;
        _elem.size("100%").setZ(10);
        

        _el = _elem.create("container");
        _el.size("100%");
        // _el.size("100%").useMatrix2D();

        /*_test = _elem.create(".test");
        _test.center().css({
            background: Config.COLORS.white,
            color: Config.COLORS.black
        });*/
        
        // _viewport.addChild(_button)

    }
    function _buttonActions() {
        // _prev.interact(_hoverActions, _clickDetailActions);
        // _next.interact(_hoverActions, _clickDetailActions);
    }
    function _hoverActions(_event) {
        console.log('HOVER ACTIONS');
        console.log(_event.action);
        
        switch(_event.action) {
            case 'over':
                // console.log(_event.object);
                _event.object.css({
                    background: 'red'
                });
            break;
            case 'out':
                // console.log(_event.object);
                _event.object.css({
                    background: 'white'
                });
            break;
        }
    }
    function _clickDetailActions(_event) {

        switch(_event.object.div.className) {
            case 'prev':
                ++_rotateIncrement;
                _cube.tween({
                    rotationY: _rotateIncrement*_rotateDegrees,
                }, 800, 'easeOutCubic');
            break;
            case 'next':
                --_rotateIncrement;
                _cube.tween({
                    rotationY: _rotateIncrement*_rotateDegrees,
                }, 800, 'easeOutCubic');
            break;
        }
    }
    
    function _initListItems() {
        // console.log("WorkList _initListItems");
        // console.log(workdata);
        // console.log("========================");

        for (var S = 0; S < workdata.length; S++) {


            // console.log(workdata[S].main_image[0])
            if (workdata[S].main_image[0]) {


                var _indx = workdata[S].num;
                var _w_itm = _self.initClass(WorkListItem, workdata[S], _indx);
                _w_itm.events.add(FlipEvents.CLICK, _clickEvents, _indx);

                _el.add(_w_itm);
                _items.push(_w_itm);
            }
        }

        _indexItems();
    }
    
    
    // REPOSITIONS WORKLISTITEM WHEN SCROLLING
    function _repositionOnDownScroll(w_itm) {

        console.log('========================');
        console.log('_repositionOnDownScroll(T)' + w_itm);
        console.log(w_itm);
        console.log('A');
        console.log(A);
        // console.log(w)
        console.log('========================');


        if (A && !j) {
            return;
        }
        // GET LAST ITEM IN ARRAY
        var _last = _items[_items.length - 1];
        // console.log('S');
        // console.log(S);
        // POSITION PARAMETER 'T' WHERE THE
        // LAST ITEM IS POSITIONED + Q
        w_itm.positionY(_last.y + Q);
        console.log('_last.y + Q');
        console.log(_last.y + Q);
        // ARRAY SHIFT REMOVING FIRST ITEM 'T',
        // THUS SHIFTING THE ENTIRE GROUP ONE AHEAD
        _items.shift();
        // PUSH 'T' BACK INTO THE ARRAY ADDING IT
        // TO THE END
        _items.push(w_itm);
        // REINDEX ITEMS
        _indexItems();
        // console.log(Transition.instance().direction);
    }

    // function R(S) {
    function _repositionOnUpScroll(wkitm) {

        console.log('========================');
        console.log('_repositionOnUpScroll(S)');
        console.log(wkitm);
        console.log(Q);
        console.log('========================');

        if (A && !j) {
            return;
        }
        var T = _items[0];

        wkitm.positionY(T.y - Q);
        
        _items.pop();
        _items.unshift(wkitm);
        _indexItems();
        // console.log(Transition.instance().direction);
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

    function _indexItems() {
        // console.log('========================');
        // console.log('b() FROM WORKLIST');
        // console.log('Assigns an index to the');
        // console.log('_items[] array - length: '+_items.length);
        // console.log('========================');
        for (var S = 0; S < _items.length; S++) {
            _items[S].index = S;
            // console.log(_items[S]);
        }

        //console.log(_items);
    }
    
    // seems to run after scrolling comes to a stop, in either direction
    function H() {
        // var _elX = _el.x;
        var _elY = _el.y;

        a.y = 0;
        // console.log('===================')
        // console.log(a)
        // console.log('===================')
        n.y = 0;
        
        _el.y = 0;
        
        _el.transform();
        
        for (var S = 0; S < _items.length; S++) {
            var _itm = _items[S];
            _itm.positionY(_itm.y + _elY);
        }
        
        s();
        
        _indexItems();
    }
    
    // used when doing an upscroll reposition
    function s() {
        if (k) {
            return;
        }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            //console.log('from s(): _repositionOnUpScroll');
            _repositionOnUpScroll(_items[_items.length - 1], true);
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
           
                for (var S = 0; S < _items.length; S++) {
           
                    _items[S].disable();
           
                }
            }
        }
    }
    
    // _moveContainer is called many times per second
    // used when doing a down scroll reposition
    function _moveContainer(pos) {
        // pos seems to be some kind of value that is related to the position of the work list items.
        // it's a very fine-tuned value
        // could be framerate?
        
        var stage_y = a.y;

        // hover scrolling zones
        // if (!Device.mobile){
        //     var zonewidth = Stage.width*0.1;

        //     // left zone
        //     if (Mouse.y > 130 && Mouse.x >= 0 && Mouse.x <= zonewidth){
        //         n.x += _scrollspeed;
        //     }

        //     // right zone
        //     // if (Mouse.y > 130 && Mouse.x >= Stage.width-zonewidth && Mouse.x <= Stage.width && !Global.SIDEBAR.opened){
        //     if (Mouse.y > 130 && Mouse.x >= Stage.width-zonewidth && Mouse.x <= Stage.width){
        //         n.x -= _scrollspeed;
        //     }
        // }

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
            H();
        }

        v(stage_y, a.y);
        
        _el.y = a.y;
        
        _el.y.toFixed(4);

        if (pos) {
            _el.transform();
        }

        workItemsLength = _items.length - 1;

        for (var S = workItemsLength; S > -1; S--) {
            var workListItem = _items[S];

            // var W = a.y + (workListItem.y + workListItem.height);
            var W = a.y + (workListItem.y + workListItem.height);

            if (pos) {
                workListItem.parallax(_el.y);
            }

            if (W < 0 && scrollDirection == 1 && S === 0) {
                // triggered when stage comes in and when scrolling down
                //console.log('from _moveContainer(): _repositionOnDownScroll');
                _repositionOnDownScroll(workListItem);
            }

            //if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
            if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
                // triggered when stage comes in and when scrolling up
                //console.log('from _moveContainer(): _repositionOnUpScroll');
                _repositionOnUpScroll(workListItem);
            }
        }
    }

    // animate list items out of the way when opening a detail view
    // W is boolean, but appears unused
    function _detailOpenAnim(targetItem, performance_value, W) {
        //console.log("_detailOpenAnim()");
        // var maxwidth = Stage.width*0.5;
        var maxheight = Stage.height*0.5;
        //console.log(3 * _items.length);

        for (var i = 0; i < _items.length; i++) {
            var workListItem = _items[i], x;

            // set up animation values
            x = workListItem.y + (maxwidth * (workListItem.index > targetItem.index ? 1 : -1));
            workListItem.oY = workListItem.y;

            var params = {
                y: x,
                unskew: true
            };

            if (workListItem.index == targetItem.index){
                // expand and move
                var next_y = _items[i+1].y + maxheight;
                var expand = next_y - x;

                params.openthis = true;
                params.expand = expand;

                workListItem.animateOpen(params);
            }else{
                // move only
                workListItem.animateOpen(params);
            }

            /*x = workListItem.x + (maxwidth * (workListItem.index < targetItem.index ? -1 : 1));
            workListItem.oY = workListItem.x;

            console.log(workListItem.index+" tween by "+x);
            workListItem.tween({
                x: x
            }, 3000, Global.CURRENT_PAGE.transition.ease);*/

            /*if (performance_value) {
                workListItem.tween({
                    // y: y
                    x: x
                }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            } else {
                // workListItem.y = y;
                workListItem.x = x;
                if (!Device.mobile) {
                    // workListItem.position(workListItem.y);
                    workListItem.positionX(workListItem.x);
                }
            }*/
        }
    }

    function p() {

        /*console.log('======================');
        console.log('p() FROM WORK LIST');
        console.log('======================');*/

        var S = MathUtil.getSliceHeight();
        var sliceWidth = MathUtil.getSliceWidth();

        H();
        
        for (var U = 0; U < workdata.length; U++) {

            for (var T = 0; T < _items.length; T++) {
                
                if (_items[T].data == workdata[U]) {
                
                    _items[T].index = U;
                
                }
            }
        }

        _items.sort(function (Y, X) {
            return Y.index - X.index;
        });

        /*for (U = 0; U < _items.length; U++) {
            var V = _items[U];
            console.log('===================');
            console.log('V.data');
            console.log(V.data);
            console.log('===================');
            // console.log(V.data);
            if (V.data.perma == Global.CURRENT_PAGE.target.perma) {
                Global.CURRENT_PAGE.target = V;
            }
            V.resize(S);
            V.position((S * 0.58) * U);
        }*/
        
        // loop through list items and apply size and position
        for (var T = 0; T < _items.length; T++) {
            var workListItem = _items[T];
            
            if (workListItem.data.perma == Global.CURRENT_PAGE.target.perma) {
                Global.CURRENT_PAGE.target = workListItem;
            }
        
            //workListItem.resize(S, q ? T : null);
            //workListItem.position((S * 0.58) * T, q ? T : null);
            
            workListItem.resize(S);
            workListItem.positionY((S * _spacing) * T);
        }

        Global.CURRENT_PAGE.target.incoming();

        // Q = _items[1].y - _items[0].y;
        Q = _items[1].y - _items[0].y;

        for (U = 0; U < _items.length; U++) {
            _items[U].setMargin(Q);
        }

        // n.y = -(Global.CURRENT_PAGE.target.y - (Stage.height * 0.3));
        n.y = -(Global.CURRENT_PAGE.target.y - (Stage.height * 0.3));

        // _el.y = 1;
        _el.y = 1;
        _el.oY = 0;
        while (_el.y != 0) {
            _moveContainer();
        }
        _moveContainer(true);
        s();
        var W = Global.CURRENT_PAGE.target;
        // Global.CURRENT_PAGE.origin.x = FEDevice.width / 2 - W.bg.width / 2;
        // Global.CURRENT_PAGE.origin.y = W.getY() + (W.height / 2 - W.bg.height / 2);
        // Global.CURRENT_PAGE.origin.y -= FEDevice.width * 0.0636;
        Global.CURRENT_PAGE.origin.x = FEDevice.width / 2 - W.bg.width / 2;
        Global.CURRENT_PAGE.origin.y = W.getY() + (W.height / 2 - W.bg.height / 2);
        Global.CURRENT_PAGE.origin.y -= FEDevice.width * 0.0636;
    }

    function _initScrollAndPosition() {
        
        _self.events.subscribe(FlipEvents.RESIZE, _positionItems);

        ScrollUtil.link(_setScrollPosition);
        
        if (Device.mobile) {
            Stage.bind("touchstart", D);
            Stage.bind("touchend", u);
            Stage.bind("touchcancel", u);
        }
    }
    // function D() {

    // }
    // function _getCurrentController() {
    //     if (!Global.CURRENT_PAGE) {
    //         switch(Global.PAGE) {
    //             case 'home':
    //                 Global.CURRENT_PAGE = Global.HOME;
    //             break;
    //             case 'directors':
    //             case 'work':
    //                 Global.CURRENT_PAGE = Global.WORK;
    //             break;
    //             case 'reels':
    //                 Global.CURRENT_PAGE = Global.REELS;
    //             break;
    //         }
    //     }

    //     return Global.CURRENT_PAGE;
    // }
    // function E(U, S) {
    function _clickEvents(eventObject, S) {
        console.log("=============================");
        console.log("WORK LIST ::");
        console.log(eventObject);
        console.log(S);
        console.log("=============================");

        Global.CAN_CLICK    = false;
        Render.stopRender(_moveContainer);

        H();

        console.log(Global.CURRENT_PAGE);
        console.log(Global.PAGE);
        
        // Global.CURRENT_PAGE.target  = eventObject.target;
        Global.CURRENT_PAGE.target  = eventObject.target;

        var targetItem     = eventObject.target;
        var targetElement  = targetItem.element;

        var targetCenterY = targetItem.y + (targetElement.height/2);
        var move = (Stage.height/2) - targetCenterY;
        _el.oY = _el.y;

        // center selected slice on screen
        _el.tween({
            y: move
        }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);


        Global.CURRENT_PAGE.origin.x        = FEDevice.width / 2 - targetElement.width / 2;
        Global.CURRENT_PAGE.origin.y        = targetItem.getY() + (targetElement.height / 2);
        Global.CURRENT_PAGE.origin.width    = targetElement.width;
        Global.CURRENT_PAGE.origin.height   = targetElement.height;

        A = true;
        t = eventObject.target;

        // animate slice open
        _detailOpenAnim(targetItem, FEDevice.PERFORMANCE > 0, true);

        _self.delayedCall(function () {
            if (!Device.mobile) {
                _elem.hide();
            } else {
                _elem.css({
                    top: -999999
                });
            }
        }, S ? 1 : Global.CURRENT_PAGE.transition.time*1.4);

        _self.events.fire(FEEvents.SELECT, {
            data: eventObject.target.data
        });
        console.log('WORK LIST :: FIRE SELECT: eventObject.target.data:'+eventObject.target.data);
        console.log('WORK LIST :: eventObject.target');
        console.log(eventObject.target);
        console.log('WORK LIST :: eventObject');
        console.log(eventObject);

    }

    function D(S) {
        if (A) {
            return;
        }
        Stage.bind("touchmove", m);
        l.copyFrom(a);
        M.copyFrom(S);
        z = true;
    }

    // function m(S) {

    //     x.subVectors(S, M);
        
    //     n.y = l.y + x.y;
    //     a.y = n.y;
    //     if (r.y) {
    //         C.subVectors(S, r);
    //         C.time = Date.now();
    //     }
    //     r.subVectors(S, r);
    //     O = r.y > 0 ? -1 : 1;
    //     r.copyFrom(S);
    // }
    function m(S) {

        x.subVectors(S, M);
        
        n.y = l.y + x.y;
        a.y = n.y;
        if (r.y) {
            C.subVectors(S, r);
            C.time = Date.now();
        }
        r.subVectors(S, r);
        O = r.y > 0 ? -1 : 1;
        r.copyFrom(S);
    }

    function u(S) {

        Stage.unbind("touchmove", m);
        
        z = false;
        
        if (C.y) {
        
            C.divide((Date.now() - C.time) || 1);
        
            if (Math.abs(C.y) > 20) {
        
                C.multiply(0.1);
        
            }
        
            if (Mobile.os != "Android") {
        
                n.y += C.y * FEDevice.VELOCITY_MULTIPLIER;
        
            }
        }
        x.clear();
        M.clear();
        r.clear();
        C.clear();
    }

    // function _setScrollPosition(userScrollAmount)
    // userScrollAmount = pretty sure it's the literal scroll value from the device
    // function _setScrollPosition(userScrollAmount) {
    //     if (A) {
    //         return;
    //     }
    //     if (Math.abs(n.y - a.y) < 1000) {
    //      // n.y is amount the element will move?
    //         n.y -= userScrollAmount * 2;
    //     }
    // }

    function _setScrollPosition(userScrollAmount) {
        if (A) {
            return;
        }

        if (Math.abs(n.y - a.y) < 1000) {
            // n.x is amount the element will move
            n.y -= userScrollAmount * 2;
        }
    }

    

    function _positionItems(V) {

        //console.log('=======================');
        //console.log('_positionItems(V) FROM WORK LIST: '+V);
        //console.log(V);
        //console.log('=======================');

        if (A) {
            return i = true;
        }
        var S = MathUtil.getSliceHeight();
        var sliceWidth = MathUtil.getSliceWidth();

        H();
        
        // loop through list items and apply size and position
        for (var T = 0; T < _items.length; T++) {
            var workListItem = _items[T];
        
            //workListItem.resize(S, q ? T : null);
            //workListItem.position((S * 0.58) * T, q ? T : null);
            
            workListItem.resize(S, q ? T : null);
            workListItem.positionY((S * _spacing) * T, q ? T : null);
        }

        // set margin on first item?
        Q = _items[1].y - _items[0].y;
        
        for (T = 0; T < _items.length; T++) {
            _items[T].setMargin(Q);
        }

        q = true;
        k = true;
        clearTimeout(L);
        L = setTimeout(function () {
            k = false;
            s();
        }, 250);
        
        _positionCubeBackgrounds();
    }

    this.resume = function () {
        j = true;
        // Global.BORDER.showBottom();
        if (t && Global.CURRENT_PAGE.target != t) {
            t.resume(true);
        }
        if (i || Global.CURRENT_PAGE.target != t || h) {
            p();
        }
        if (!Device.mobile) {
            _elem.show();
        } else {
            _elem.css({
                top: 0
            });
        }

        h = false;

        _moveContainer();

        j = false;

        if (FEDevice.PERFORMANCE > 0) {

            _detailOpenAnim(Global.CURRENT_PAGE.target, false);
            
            _el.tween({
            
                // y: _el.oY
                y: _el.oY
            
            }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);

        } else {
            
            _el.transform({
            
                // x: 0
                y: 0
            
            });
            
            if (!Device.mobile) {
            
                _elem.show();
            
            }
        }
        for (var S = 0; S < _items.length; S++) {
            var T = _items[S];
            if (T != Global.CURRENT_PAGE.target) {
                T.resumeText();
                T.resume();
            } else {
                T.resumeText(true);
            }
            T.y = T.oY;
            // T.x = T.oY;
            if (FEDevice.PERFORMANCE > 0) {
                T.tween({
                    y: T.y
                    // x: T.x
                }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);
            } else {
                T.positionY(T.y, 0);
                // T.positionX(T.x, 0);
            }
        }
        _self.delayedCall(function () {
            if (FEDevice.PERFORMANCE > 0) {
                for (var U = 0; U < _items.length; U++) {
                    _items[U].element.stopTween();
                }
            } else {
                s();
            }
            Global.CAN_CLICK = true;
            A = false;
            Render.startRender(_moveContainer);
            Global.CURRENT_PAGE.target.resumeActive();
        }, FEDevice.PERFORMANCE > 0 ? Global.CURRENT_PAGE.transition.time : 1);

        s();

        Global.CAN_CLICK = true;
        A = false;
        Render.startRender(_moveContainer);
        Global.CURRENT_PAGE.target.resumeActive();
    };
    
    this.openDeeplink = function (T) {
        
        

        _self.delayedCall(function () {
            
            for (var S = 0; S < _items.length; S++) {
                
                // items data
                if (_items[S].data == T) {
                    console.log('===========================');
                    console.log('_items[S].data');
                    console.log(_items[S]);
                    console.log(_items[S].data);
                    console.log(Global.CURRENT_PAGE);
                    // console.log(_glpg);
                    console.log('===========================');

                    _clickEvents({
                        target: _items[S]
                    }, true);

                    Global.CURRENT_PAGE.loadBackground(_items[S].data, _items[S].num);
                    Global.CURRENT_PAGE.bgresize();
                }
            }
        }, 500);        
    };
    function _hoverSlice(state) {
        for (var i = 0; i < _items.length; i++){
            if (_items[i].num == _self.lastHovered){
                switch (state){
                    case "over":
                    _items[i].over();
                    break;

                    case "out":
                    _items[i].out();
                    break;
                }

                return;
            }
        };
    } 
    // state(string) = "over" or "out"
    this.hoverSlice = function(_state){
        //console.log("WorkList hoverSlice");
        //console.log(_self.lastHovered);
        //console.log(state);
        _hoverSlice(_state);
        // for (var i = 0; i < _items.length; i++){
        //     if (_items[i].num == _self.lastHovered){
        //         switch (state){
        //             case "over":
        //             _items[i].over();
        //             break;

        //             case "out":
        //             _items[i].out();
        //             break;
        //         }

        //         return;
        //     }
        // };
    };

    this.destroy = function () {
        Render.stopRender(_moveContainer);
        return this._destroy();
    };
});