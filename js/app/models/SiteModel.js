Class(function SiteModel(sitedata, currentsite) {
    Inherit(this, Model);
    var d = this;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    var _siteOne, _siteTwo, _curSite;

    (function () {
        _init();
    })();

    function _init() {

        console.log('SITE MODEL');
        console.log(sitedata);
        _siteOne = sitedata.cc_creative;
        _siteTwo = sitedata.cc_content;

        _setCurrentSite();

    }
    
    function _setCurrentSite(curr) {
        _curSite = !curr ? _siteOne : curr;

        return _curSite;
    }

    // CREATE PUBLIC VARIABLES
    this.creative   = _siteOne;
    this.content    = _siteTwo;

    // SETTERS AND GETTERS
    this.setCurrentSite = function(c) {
        return _setCurrentSite(c);
    }

    this.getCurrentSite = function() {
        return _curSite;
    }
    
    
    // this.getPageDataByName = function(name) {
    //     // console.log(pagesdata.portfolio)
    //     for (var i = 0; i < pagesdata.pages.length; i++) {
    //       if (pagesdata.pages[i].name == name) {
    //         // console.log(this._data.portfolio[i]);
    //         console.log(pagesdata.pages[i].name.toLowerCase());
    //         //
    //         if (pagesdata.pages[i].name.toLowerCase() == 'our work') {
    //             pagesdata.pages[i].portfolio = pagesdata.portfolio;
    //             // pagesdata.pages[i].push({portfolio: pagesdata.portfolio});
    //         }

    //         return pagesdata.pages[i];
    //       }
    //     }
    // }
});