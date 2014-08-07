Class(function StateModel() {
    // console.log(':: STATE MODEL')
    Inherit(this, Model);
    Inherit(this, PushState);

    var _self = this;
    // var _currState;

    (function () {
        _init();
        _updateEvent();
    })();

    function _init() {
        //console.log("StateModel _init");
        //console.log(_self.getState());
        var split_state = _self.getState().split("/");

        _self.page      = split_state[0];
        _self.deep      = split_state[1]; // deprecated
        _self.category  = split_state[1];
        _self.detail    = split_state[2];

        /*if (FEDevice.IE9) {
            if (_self.page == "home") {
                _self.page = "work";
                _self.category = null;
            }
        }*/
        
        // console.log('==========================');
        // console.log('STATE MODEL');
        // console.log(_self.page);
        // console.log(_self.category);
        // console.log(_self.detail);
        // console.log('==========================');

        if (_self.deep && !_self.deep.length) {
            // console.log('STATE MODEL :: _init');
            // console.log('_self.deep = null');
            _self.deep = null;
        }

        if (_self.category && !_self.category.length) {
            _self.category = null;
        }

        if (_self.detail && !_self.detail.length) {
            _self.detail = null;
        }

        // if (d.page != "about" && d.page != "home" && d.page != "work" && d.page != "contact") {
        //     d.page = "home";
        // }

        if (_self.page != "home" && _self.page != "work" && _self.page != "about" && _self.page != "contact" && _self.page != "blog") {
            _self.page = "home";
        }
        // console.log('StateModel :: _self.page: ' + _self.page);
    }

    function _updateEvent() {
        // console.log('StateModel :: _updateEvent()');
        _self.dispatcher.events.add(FlipEvents.UPDATE, _onUpdateEvent);
    }
    function _onUpdateEvent(f) {
        console.log('StateModel :: _onUpdateEvent()');
        _init();
        _self.events.fire(FEEvents.STATE_CHANGE);
    }
    
    this.setState = function (e) {
        console.log('StateModel :: setState');
        console.log(e);
        console.log(this);
        // console.log(this._setState(e));
        console.log('========================');
        // _currState = e;
        GATracker.trackPage(e);
        this._setState(e);
        _init();
        _self.events.fire(FEEvents.PAGE_CHANGE);
    }
    // this.getState = function () {
    //     return _currState;
    // }
});