Class(function PagesModel() {
    Inherit(this, Model);
    var _self = this;
    // var _data = pagesdata;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    var _pages;

    (function () {
        _init()
    })();

    function _init() {

        // _pages = [];
        // console.log('Data.SITE.getCurrentSite()');
        // console.log(Data.SITE.getCurrentSite());

        // console.log('getPagesBySite(Data.SITE.creative)');
        // console.log( Data.PAGES.getPagesBySite( Data.SITE.creative ) );

        

    }

    this.getAllPages = function() {

        // _pages = [];
        // var _obj = Data.SITE.getCurrentSite();
        // // var _obj = Data.PAGES.getPagesBySite( Data.SITE.creative );

        // for(var _page in _obj) {

        //     console.log(_page);
        //     console.log(_obj[_page]);

        //     _pages.push({ 'name': _page, 'data': _obj[_page] });

        // }

        return _pages;
    }

    this.getPagesBySite = function(__site) {


        _pages = [];
        var _obj = Data.SITE.setCurrentSite(__site);
        // var _obj = Data.SITE.setCurrentSite(__site);
        // console.log('getPagesBySite');
        // console.log('_obj');
        // console.log(_obj);
        // var _obj = Data.PAGES.getPagesBySite( Data.SITE.creative );

        for(var _page in _obj) {

            // console.log(_page);
            // console.log(_obj[_page]);

            _pages.push({ 'name': _page, 'data': _obj[_page] });

        }

        // console.log('getPagesBySite');
        // console.log(_pages);

        return _pages;
    }
});