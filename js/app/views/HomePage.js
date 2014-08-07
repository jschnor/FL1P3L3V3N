Class(function HomePage(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe;
    var col1, col2, col3;

    var _container = container;
    var _margin = margin;
    
    var _gutter = 10;

    (function () {

        _main();
        // _getHomeAbout();

        // _onResize();
    })();    

    function _main() {
        
        _self.initClass(HomeMainContent, _container, _margin);
        // _self.initClass(HomeFeatured, _container, _margin);

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
