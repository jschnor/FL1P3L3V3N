Class(function Data() {

    Inherit(this, Model);

    var _self = this;
    var _data;
    var _work;

    // DATA IS SAVED IN A JS FILE AS A VARIABLE (window.__DATA__)
    // OF JSON DATA WITH SETS OF 'pages' AND 'portfolio' TO MATCH
    // WHAT IS IN CMS BUILDER

    Flip.ready(function () {
        _initData();
        // _parseWork();
        _setData();

        // I DON'T KNOW HOW TO USE THE VIDEO UTIL
        //VideoUtil.init()
    });

    function _initData() {
        _data = window.__DATA__;
        delete window.__DATA__;
    }
    function _setData() {

        _self.STATE = new StateModel();

        console.log('DATA :: _setData : _data:');
        console.log(_data);
        // console.log('_data.portfolio');
        // console.log(_data.portfolio);
        // LOADS CREATIVE BY DEFAULT, OTHERWISE PASS SECOND PARAMETER TO SWITCH SITE/DATA
        // _self.SITE          = new SiteModel(_data);
        // _self.CATEGORIES    = new CategoryModel(_data.categories);

        // _self.PAGES         = new PagesModel();

        // console.log(_data.cc_creative);

        // THIS WILL HAVE TO CHANGE, BUT FOR NOW...JUST PUSH THE WORK
        _self.HOME          = new HomeModel(_data.home);
        _self.ABOUT         = new AboutModel(_data.about);
        _self.BELIEVE         = new BelieveModel(_data.believe);
        _self.TEAM         = new TeamModel(_data.team);
        // _self.REELS         = new ReelModel(_data.cc_creative.reels);
        _self.WORK          = new WorkModel(_data.portfolio);
        // console.log(_data.portfolio)
        // _self.CONTENT       = new ContentModel(_data.cc_content.original_content);

    }
}, "Static");