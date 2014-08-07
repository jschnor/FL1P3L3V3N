Class(function AboutModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;

    var _headline = data[0].headline;
    var _subhead = data[0].subhead;
    var _content = data[0].content;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    this.headline = _headline;
    this.subhead = _subhead;
    this.content = _content;

    (function () {
        init()
    })();

    function init() {
        console.log(_data);
    }
    
    this.getData = function() {
        return _data;
    };

    this.getTeam = function() {
        var _team = [];
        var tm_itm;
        for (var i = 0; i < _data.length; i++) {

            //console.log(_data[i].team.length);
            
            tm_itm = _data[i].team;

            // console.log(tm_itm);
            for (var j = 0; j < tm_itm.length; j++) {
                _team.push(tm_itm[j]);
            }
        }
        return _team;
    }

    this.getClients = function() {
        var _clnt = [];
        var ct_itm;

        for (var i = 0; i < _data.length; i++) {
            // console.log(_data[i].clients.length);
            
            ct_itm = _data[i].clients;

            // console.log(tm_itm);
            for (var j = 0; j < ct_itm.length; j++) {
                _clnt.push(ct_itm[j]);
            }
        }
        return _clnt;
    }

});