/**
 * Main Site Preloader
 * uses PreloadJS
 * see http://www.createjs.com/PreloadJS for demos and usage
 */

Class(function Loader(callback) {
	 
	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_preload,
		_loader,
		_loaderBar,
		_sizes = {},
		_images = Config.PRELOAD,
		_hidden;

	Global.LOADER = this;

	(function() {
		_init();
		_events();
	})();

	function _init() {
		_elem.setZ(200);

		// used for temporarily storing stuff that we are loading
		_hidden = _elem.create(".hidden");
		_hidden.css({
			opacity: 0
		});

		// instantiate new PreloadJS
		_preload = new createjs.LoadQueue();

		_preload.on("progress", _handleOverallProgress);
		_preload.setMaxConnections(5);

		_preload.on("fileload", _onFileLoaded);
		// _preload.on("fileprogress", _handleFileProgress);
		// _preload.on("error", _handleFileError);

		_renderFonts();

		_addLoader();
		_setSize();
		_animateIn();
	}

	function _addLoader(){
		_loader = _elem.create('.loader');
		_loader.setProps({
			opacity: 0
		});

		_loaderBar = _loader.create('.loaderbar');
		_loaderBar.bg(Config.COLORS.white);
	}

	function _animateIn(){
		_loader.tween({
			opacity: 1
		}, 0.5, Config.EASING.out, 0.25);

		_self.delayedCall(_loadAll, 250);
	}

	// load all assets
	function _loadAll() {
		if (_images.length > 0){
			// load each asset
			while (_images.length > 0) {
				var item = _images.shift();
				_preload.loadFile(item);
			}
		}else{
			// no assets to load
			_animateOut();
		}
	}

	// Overall progress handler
	function _handleOverallProgress(event) {
		if (Config.DEBUG.loader){ console.log('overall progress: ' + _preload.progress); }

		// adjust the length of the loader bar as assets are loaded
		_loaderBar.tween({
			width: _sizes.loaderwidth*_preload.progress
		}, 0.25, Config.EASING.out);

		// you can use the progress value to show text
		// _loaderText.text((Math.round(_preload.progress * 100)) + '%');

		// when finished loading, remove the loader
		if (_preload.progress == 1){
			_animateOut();
		}
	}

	function _onFileLoaded(event){
        // create an image object that will hold the source
        var img = _hidden.create('.img', 'img');
        img.div.src = event.result.src;

        var loaded = {
        	id:  event.item.id,
        	img: img
        };

        // put the image into our set of loaded assets
        Config.LOADED.push(loaded);
    }

	function _renderFonts() {
		for (var type in Config.FONTS){
			if (Config.FONTS.hasOwnProperty(type)){
				var render = _hidden.create('.a');
				render.text('a').setProps({
					fontFamily: Config.FONTS[type].name,
					fontSize: '12px',
					color: Config.COLORS.black
				});
			}
		}
	}

	function _animateOut() {
		_elem.tween({
			opacity: 0
		}, 1, Config.EASING.in, null, function(){
			// try to run the callback function
			if (typeof callback == 'function'){
				callback();
			}

			// remove the loader
			_self.delayedCall(function(){
				_self.__destroy();
			}, 500);
		});
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _setSize(){
		_elem.size(Stage.width, Stage.height);

		// set size values
        _sizes.loaderwidth = Stage.width * (1920/1920);
        _sizes.loaderheight = Stage.height * (1080/1080);
        _sizes.barheight = _sizes.loaderwidth * (30/1080);

        _loader.size(_sizes.loaderwidth, _sizes.loaderheight).setProps({
        	left: (Stage.width - _sizes.loaderwidth)/2,
        	top: (Stage.height - _sizes.loaderheight)/2
        });

        _loaderBar.setProps({
        	left: 0,
        	top: (_sizes.loaderheight - _sizes.barheight)/2,
        	height: _sizes.barheight
        });
	}
});