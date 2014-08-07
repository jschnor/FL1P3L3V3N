Class(function AboutList(about_sections) {
    Inherit(this, View);
    
    var _self = this, _elem, _cont, _halftone, _aboutCulture, _aboutTeam, _aboutClients, _test, _contX, _aboutWidth;

    var Q, O, z, L, A, q, t, k, i, j, h, e = true;

    var _items = [];
    var _scrollspeed = 15;
    
    var a = new Vector2(); // container vector
    var n = new Vector2(); // user scroll vector
    var M = new Vector2();
    var x = new Vector2();
    var r = new Vector2();
    var l = new Vector2();
    var C = new Vector2();

    this.paddingLeft = 200;

    if (Device.mobile){
        this.paddingLeft = 100;
    }

    //this.lastHovered = false;
    
    (function () {
        Global.CAN_CLICK = true;

        _markup();
        _initListItems();
        _initScrollAndPosition();
        _positionItems();

        Render.startRender(_moveContainer);
        Render.nextFrame(_animateIn);
    })();

    function _markup() {
        _elem = _self.element;
        _elem.size("100%").bg(FEDevice.getAsset(Config.IMAGES + "about/bg.jpg")).css({
            backgroundSize: "cover"
        });

        // container is what is animated on scroll
        _cont = _elem.create("container");
        _cont.size("100%").css({
            paddingLeft: _self.paddingLeft
        }).useMatrix2D();

        /*_test = _elem.create(".test");
        _test.center().css({
            background: Config.COLORS.white,
            color: Config.COLORS.black
        });*/

        // create halftone overlay
        _halftone = _cont.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").css({
            left: -200
        });
    }

    
    function _initListItems() {
        _aboutCulture = _self.initClass(AboutCulture, _self.paddingLeft+20);
        _aboutTeam = _self.initClass(AboutTeam, _aboutCulture.width+_self.paddingLeft+20);
        _aboutClients = _self.initClass(AboutClients, _aboutTeam.width+_aboutCulture.width+_self.paddingLeft+20);

        _cont.add(_aboutCulture);
        _items.push(_aboutCulture);
        _cont.add(_aboutTeam);
        _items.push(_aboutTeam);
        _cont.add(_aboutClients);
        _items.push(_aboutClients);

        // may need to add events to these here

        _indexItems();

        _aboutWidth = _self.paddingLeft + _aboutCulture.width + _aboutTeam.width + _aboutClients.width;
    }

    function _animateIn() {
        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        console.log("AboutList _animateIn");
        console.log(Data.STATE.deep);

        switch (Data.STATE.deep){
            case "culture":
            n.x = 0;
            break;

            case "team":
            n.x = -(_aboutCulture.width);
            break;

            case "our-clients":
            n.x = -(_aboutCulture.width+_aboutTeam.width);
            break;
        }

        a.x = Stage.width * 1; // always come in from left
    }

    function _indexItems() {
        for (var S = 0; S < _items.length; S++) {
            _items[S].index = S;
            // console.log(_items[S]);
        }

        //console.log(_items);
    }

    // controls whether mouse events are enabled during scroll???
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

        var stage_x = a.x;

        // hover scrolling zones
        if (!Device.mobile){
            var zonewidth = Stage.width*0.1;

            // left zone
            if (Mouse.y > 130 && Mouse.x > 0 && Mouse.x <= zonewidth){
                n.x += _scrollspeed;

                if (n.x > 0){
                    n.x = 0;
                }

                if (n.x < -(_aboutWidth - Stage.width - 300)){
                    n.x = -(_aboutWidth - Stage.width - 300);
                }
            }

            // right zone
            if (Mouse.y > 130 && Mouse.x >= Stage.width-zonewidth && Mouse.x <= Stage.width && !Global.SIDEBAR.opened){
                n.x -= _scrollspeed;

                if (n.x > 0){
                    n.x = 0;
                }

                if (n.x < -(_aboutWidth - Stage.width - 300)){
                    n.x = -(_aboutWidth - Stage.width - 300);
                }
            }
        }

        // arrow keys
        window.onkeydown = function(event){
            // console.log(event.keyCode);
            switch (event.keyCode){
                case 37:
                // left
                n.x += _scrollspeed;

                if (n.x > 0){
                    n.x = 0;
                }

                if (n.x < -(_aboutWidth - Stage.width - 300)){
                    n.x = -(_aboutWidth - Stage.width - 300);
                }
                break;

                case 39:
                // right
                n.x -= _scrollspeed;

                if (n.x > 0){
                    n.x = 0;
                }

                if (n.x < -(_aboutWidth - Stage.width - 300)){
                    n.x = -(_aboutWidth - Stage.width - 300);
                }
                break;
            }
        };
        
        // it's the lerp!
        // move a towards n
        a.lerp(n, 0.075);

        if (!z) {
            // identify scroll direction with a simple positive/negative value
            scrollDirection = a.x > stage_x ? -1 : 1;
        }

        _cont.x = a.x;
        _cont.x.toFixed(4);

        v(stage_x, a.x);

        //_test.text(_cont.x+'<br />'+a.x+'<br />'+n.x);

        if (pos) {
            _cont.transform();
        }

        // move backgrounds opposite so they stay fixed
        // (value is inverted inside the public function)
        _aboutCulture.moveBG(a.x);
        _aboutTeam.moveBG(a.x);
        _aboutClients.moveBG(a.x);

        _halftone.x = -a.x;
        _halftone.x.toFixed(4);
        _halftone.transform();
    }

    function p() {
        for (var U = 0; U < about_sections.length; U++) {

            for (var T = 0; T < _items.length; T++) {
                
                if (_items[T].data == about_sections[U]) {
                
                    _items[T].index = U;
                
                }
            }
        }

        _items.sort(function (Y, X) {
            return Y.index - X.index;
        });

        _aboutCulture.resize(_aboutCulture.width);
        _aboutCulture.positionX(0);

        _aboutTeam.resize(_aboutTeam.width);
        _aboutTeam.positionX(_aboutCulture.width);

        _aboutClients.resize(_aboutClients.width);
        _aboutClients.positionX(_aboutTeam.width);

        Global.CURRENT_PAGE.target.incoming();

        n.x = -(Global.CURRENT_PAGE.target.x - (Stage.width * 0.3));

        // _cont.y = 1;
        _cont.x = 1;
        _cont.oY = 0;
        while (_cont.x != 0) {
            _moveContainer();
        }
        _moveContainer(true);
        
        var W = Global.CURRENT_PAGE.target;
        // Global.CURRENT_PAGE.origin.x = FEDevice.width / 2 - W.bg.width / 2;
        // Global.CURRENT_PAGE.origin.y = W.getY() + (W.height / 2 - W.bg.height / 2);
        // Global.CURRENT_PAGE.origin.y -= FEDevice.width * 0.0636;
        Global.CURRENT_PAGE.origin.y = FEDevice.height / 2 - W.bg.height / 2;
        Global.CURRENT_PAGE.origin.x = W.getX() + (W.width / 2 - W.bg.width / 2);
        Global.CURRENT_PAGE.origin.x -= FEDevice.height * 0.0636;
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

    function D(S) {
        // if (A) {
        //     return;
        // }
        Stage.bind("touchmove", m);
        l.copyFrom(a);
        M.copyFrom(S);
        z = true;
    }

    function m(S) {

        x.subVectors(S, M);
        
        n.x = l.x + x.x;

        if (n.x > 0){
            n.x = 0;
        }

        if (n.x < -(_aboutWidth - Stage.width - 300)){
            n.x = -(_aboutWidth - Stage.width - 300);
        }

        a.x = n.x;
        if (r.x) {
            C.subVectors(S, r);
            C.time = Date.now();
        }
        r.subVectors(S, r);
        O = r.x > 0 ? -1 : 1;
        r.copyFrom(S);
    }

    function u(S) {

        Stage.unbind("touchmove", m);
        
        z = false;
        
        if (C.x) {
        
            C.divide((Date.now() - C.time) || 1);
        
            if (Math.abs(C.x) > 20) {
        
                C.multiply(0.1);
        
            }
        
            if (Mobile.os != "Android") {
        
                n.x += C.x * FEDevice.VELOCITY_MULTIPLIER;

                if (n.x > 0){
                    n.x = 0;
                }

                if (n.x < -(_aboutWidth - Stage.width - 300)){
                    n.x = -(_aboutWidth - Stage.width - 300);
                }
        
            }
        }
        x.clear();
        M.clear();
        r.clear();
        C.clear();
    }

    function _setScrollPosition(userScrollAmount) {
        if (A) {
            return;
        }
        
        if (Math.abs(n.x - a.x) < 1000) {
            // n.x is amount the element will move
            n.x -= userScrollAmount * 2;

            if (n.x > 0){
                n.x = 0;
            }

            if (n.x < -(_aboutWidth - Stage.width - 300)){
                n.x = -(_aboutWidth - Stage.width - 300);
            }
        }
        //_test.text(n.x);
    }

    function _positionItems(V) {
        if (A) {
            return i = true;
        }

        // _test.text(_aboutCulture.width+'<br />'+_aboutTeam.width+'<br />'+_aboutClients.width);

        _aboutCulture.resize((_self.paddingLeft+20));
        _aboutCulture.positionX(0);

        _aboutTeam.resize((_aboutCulture.width+_self.paddingLeft+20));
        _aboutTeam.positionX(_aboutCulture.width);

        _aboutClients.resize((_aboutTeam.width+_aboutCulture.width+_self.paddingLeft+20));
        _aboutClients.positionX(_aboutCulture.width+_aboutTeam.width);

        _aboutWidth = _self.paddingLeft + _aboutCulture.width + _aboutTeam.width + _aboutClients.width;

        q = true;
        k = true;
        clearTimeout(L);
        L = setTimeout(function () {
            k = false;
        }, 250);
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
            
            _cont.tween({
            
                // y: _cont.oY
                x: _cont.oY
            
            }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);

        } else {
            
            _cont.transform({
            
                x: 0
                // y: 0
            
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
            // T.y = T.oY;
            T.x = T.oY;
            if (FEDevice.PERFORMANCE > 0) {
                T.tween({
                    // y: T.y
                    x: T.x
                }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);
            } else {
                // T.positionX(T.y, 0);
                T.positionX(T.x, 0);
            }
        }
        _self.delayedCall(function () {
            if (FEDevice.PERFORMANCE > 0) {
                for (var U = 0; U < _items.length; U++) {
                    _items[U].element.stopTween();
                }
            } else {
                
            }
            Global.CAN_CLICK = true;
            A = false;
            Render.startRender(_moveContainer);
            Global.CURRENT_PAGE.target.resumeActive();
        }, FEDevice.PERFORMANCE > 0 ? Global.CURRENT_PAGE.transition.time : 1);

        Global.CAN_CLICK = true;
        A = false;
        Render.startRender(_moveContainer);
        Global.CURRENT_PAGE.target.resumeActive();
    };

    this.destroy = function () {
        Render.stopRender(_moveContainer);
        return this._destroy();
    };
});