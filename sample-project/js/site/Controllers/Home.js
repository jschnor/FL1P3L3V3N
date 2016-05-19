Class(function Home() {

    Inherit(this, Controller);
    
    var _self = this,
        _elem = _self.element,
        // _src = 'https://media.giphy.com/media/xT9DPiF2FOAvxvpNXG/giphy.gif';
        _src = 'http://auto-database.com/image/pictures-of-nissan-silvia-s14-1997-124337.jpg';

    Global.HOME = this;

    (function() {
        _init();
        _events();
        _onResize();
        _loadTest();
    })();

    function _init() {
        _elem.setZ(10).bg('#053aac');
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    function _onResize(){
        _elem.size(Stage.width, Stage.height);
    }

    function _loadTest(){
        AssetLoader.load(_src, 'image', _onImgLoaded);
        AssetLoader.load('/js/mock_data.json', 'json', _onJSONLoaded);
    }

    this.load = function(){
        _loadTest();
    };

    this.test = function(){
        
    };

    function _onImgLoaded(img){
        console.dir(img);
        console.log(AssetLoader.getLoaded());
        _elem.bg(_src);
    }

    function _onJSONLoaded(json){
        console.log(json);
    }

    this.destroy = function() {
        Evt.removeEvent(window, Evt.RESIZE, _onResize);
        this.__destroy();
    };
});