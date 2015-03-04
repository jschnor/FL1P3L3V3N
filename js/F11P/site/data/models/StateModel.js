 function StateModel() {
    Inherit(this, Model);

    var _self = this;
    var _currState;

    (function () {
        _startHistory();
        _init();
    })();
    function _startHistory() {

        //first run
        _currState = 'home';

        History.Adapter.bind(window,'statechange', function(){ // Note: We are using statechange instead of popstate
            var __page = History.getState().url.split('/')[3];

            _currState = __page === '' ? 'home' : History.getState().url.split('/')[3];
            _init();
        });
    }
    function _init() {
        var split_state = History.getState().url.split("/");

        _self.page      = split_state[3];
        _self.category  = split_state[4];
        _self.detail    = split_state[5];

        if (Config.DEBUG.all || Config.DEBUG.statemodel) {
            console.log('==========================');
            console.log('STATE MODEL :: INIT');
            console.log(split_state);
            console.log(_self.page);
            console.log('==========================');
        }

        if (_self.category && !_self.category.length) {
            _self.category = null;
        }

        if (_self.detail && !_self.detail.length) {
            _self.detail = null;
        }

        if (_self.page != "home" && _self.page != "intro") {
            _self.page = "home";
        }

        if (Global.CONTAINER) {
            Global.CONTAINER.checkBrowserBack();
        }
    }

    this.setState = function (page, title) {
        var _title;
        if (title === undefined) {
            _title = null
        } else {
            _title = title;
        }

        History.pushState({page: page}, _title, page);
        GATracker.trackPage(page);

    };
};