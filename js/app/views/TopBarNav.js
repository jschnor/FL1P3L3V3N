Class(function TopBarNav(_ht) {
    Inherit(this, View);
    // var g = this;
    var _self = this;
    var _hght = _ht;

    // var j;
    var _elem, _items;
    var k, b;
    (function () {
        _markup();
        _loadNavi();
        // _animateMarkup();
        _eventPageChange();
        _onPageChange();
        _onResize();
        // _self.delayedCall(function () {
        _animateMarkup();
        // }, 200);

    })();

    function _markup() {

        
        _elem = _self.element;
        _elem.css({
            // height: _hght - 213,
            height: 20,
            width: 360,
            // top: Device.mobile.phone ? 180 : 225,
            top: Device.mobile.phone ? 20 : 68,
            // left: 120,
            left: Stage.width - 330,
            opacity: 0,
            // border: '1px solid red',
            overflow: "hidden"
        });
        // console.log('HEIGHT: '+ _hght - 70)
        // _elem.transform({
        //     skewY: Config.SKEW
        // }).transformPoint(0, 0);

        // var m = _elem.create(".line");
        // m.size(85, 1).bg(Config.COLORS.branding).center(1, 0).css({
        //     top: 10,
        //     opacity: 0.5
        // });

        // if (Mobile.os == "iOS") {
        //     m.size(85, 0).css({
        //         borderTop: "1px solid" + Config.COLORS.branding
        //     });
        // }
    }

    function _loadNavi() {
        // PAGES NOW SET IN CONFIG
        // var _pages = ["about", "work", "case studies", "contact"];
        // var _pages = [];
        var _pages = Config.NAV;

        // console.log(Config.NAV)
        var x = 0;
        _items = [];

        for (var i = 0; i < Config.NAV.length; i++) {
            // console.log(Config.NAV[i].type)
            // _pages.push(Config.NAV[i].type);
            var _item = _self.initClass(TopBarNavItem, Config.NAV[i].type, i);
            _item.events.add(FlipEvents.CLICK, _clickActions);
            _item.events.add(FlipEvents.HOVER, _hoverActions);
            
            // console.log(Config.NAV[i].width);

            _item.css({
                // top: 3 * 43 + (_pages[i] == "contact" ? 40 : 0)
                top: 0,
                width: Config.NAV[i].width,
                height: 17,
                left: x,
                // border: '1px solid blue'
            });

            x += Config.NAV[i].width + 20;

            _items[Config.NAV[i].type] = _item;
        }
    }

    function _animateMarkup() {
        _elem.tween({
            left: Stage.width - 380,
            opacity: 1
        }, 600, "easeOutSine")
    }

    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _repositionNav);
    }

    function _eventPageChange() {
        _self.events.subscribe(FEEvents.PAGE_CHANGE, _onPageChange);
    }

    function _repositionNav() {
        // console.log('hi')
        _elem.css({
            left: Stage.width - 380,
        })
    }

    function _hoverActions(p) {

        switch (p.action) {
            case "over":

                var m = p.index < b ? -1 : 1;
                _items[p.text].over(m);
                b = p.index;

                break;
            case "out":
                var o = 0;
                for (var n in _items) {
                    var m = o < b ? -1 : 1;
                    if (_items[p.text].hovered && !_items[p.text].active) {
                        _items[p.text].out(m);
                    }
                    o++;
                }
                break;
        }

    }

    function _clickActions(m) {
        // if (m.text == "contact") {

        //     if (!Global.CONTACT_OPEN) {
        //         _self.events.fire(FEEvents.TOGGLE_CONTACT, {
        //             open: true
        //         });
        //     }
        // } else {
        //     g.events.fire(FEEvents.NAV_SELECT, {
        //         type: m.text,
        //         index: m.index + 1
        //     });
        // }
    }

    function _onPageChange() {

        var m = _items[Data.STATE.page];
        if (m) {
            if (m !== k) {
                if (k) {
                    k.deactivate();
                }
                k = m;
                k.activate();
            }
        } else {
            if (k) {
                k.deactivate();
            }
            k = null;
        }
    }
    // this.resize = function() {
    //     _resizeEvent()
    // }
    this.animateIn = function () {
        // _elem.
    };
    this.release = function () {
        for (var m in _items) {
            // console.log(this);
            _items[m].release();
        }
    }
});