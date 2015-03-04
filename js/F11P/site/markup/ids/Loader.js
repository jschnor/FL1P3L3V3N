function Loader(callback) {

	Inherit(this, $id);

	var _self = this,
		_elem = _self.element,
		_text,
		_preload,
		_images = Config.PRELOAD,
		_loadCallback = callback,
		_loaderView,
		_initialScale = 0.85,
		_initialOpacity = 0.25,
		_hidden,
		_is_in = false,
		_loader_out = false;

	Global.LOADER = this;

	(function() {
		_init();
		_renderFonts();
	})();

	function _init() {
		_elem.size(Stage.width, Stage.height).setZ(200);

		// instantiate new PreloadJS
		_preload = new createjs.LoadQueue();

		_preload.on("progress", _handleOverallProgress);
		_preload.setMaxConnections(5);

		// _preload.on("fileload", _onFileLoaded);
		// _preload.on("fileprogress", _handleFileProgress);
		// _preload.on("error", _handleFileError);

		_addLoaderView();
		_animateIn();

		_loadAll();

		Render.startRender(_checkAnimateOut);
	}

	function _addLoaderView(){
		var _fontsize = Device.mobile.phone ? Stage.width * 0.03 : Math.min(Stage.height * 0.04, Stage.width * 0.025);
		var _width = Stage.width;
		var _height = _fontsize*4;

		_text = _elem.create('.intro-text');
		_text.setProps({
			width: _width,
			height: _height,
			x: (Stage.width - _width)/2,
			y: Device.mobile.phone ? Stage.height * 0.28 : (Stage.height - _height)/2,
            fontSize: _fontsize + 'px',
            letterSpacing: _fontsize * Config.FONT.spacing.subtitles + 'px',
			fontFamily: Config.FONT.name,
			// color: Config.COLORS.white,
			color: "transparent",
			textAlign: 'center',
			lineHeight: '1.33em',
			opacity: 0,
			textShadow: "0px 0px 15px " + Config.COLORS.white
		});
		_text.text(Data.LOADER.text.toUpperCase());


		var fontsize = Device.mobile.phone ? Stage.width * 0.03 : Stage.height * (48/1200);

		_loaderView = _elem.create('.loaderview');

		_loaderView.setProps({
			width: fontsize*4,
			height: fontsize*4,
			borderRadius: '50%',
			textShadow: "0px 0px 15px " + Config.COLORS.white,
			x: (Stage.width - (fontsize*4))/2,
			y: (Stage.height - (fontsize*4))*0.6,
			scale: _initialScale,
			opacity: 0
		});
		// }).bg('#181818');

		_loaderText = _loaderView.create('.percent');

		_loaderText.setProps({
			fontFamily: Config.FONT.name,
			fontWeight: Config.FONT.light,
			color: "transparent",
			fontSize: fontsize+'px',
			lineHeight: '1em',
			width: '100%',
			height: fontsize,
			textAlign: 'center',
			x: 0,
			y: (fontsize*3)/2
		});
	}

	// load all assets
	function _loadAll() {
		while (_images.length > 0) {
			var item = _images.shift();
			_preload.loadFile(item);
		}
	}

	// Overall progress handler
	function _handleOverallProgress(event) {
		// console.log('overall progress: ' + _preload.progress);

		var scaleDiff = 1 - _initialScale;
		var opacityDiff = 1 - _initialOpacity;

		_loaderView.tween({
			scale: _initialScale + (scaleDiff*_preload.progress),
			// opacity: _initialOpacity + (opacityDiff*_preload.progress)
		}, 0, Config.EASING.out);

		_loaderText.text((Math.round(_preload.progress * 100)) + '%');
	}

	function _renderFonts() {
		_hidden = _elem.create(".hidden");

		_hidden.css({
			opacity: 0
		});

		var _fonts = ['Raleway', 'FontAwesome'];
		for (var i = 0; i < _fonts.length; i++) {
			var _render = _hidden.create(".a");
			_render.text("a").fontStyle(_fonts[i], 12, "#000");
		}
	}

	// check if we're ready to animate out
	function _checkAnimateOut(){
		if (_preload.progress == 1){
			if (_loader_out === false){
				_animateLoaderOut();
			}

			if (_is_in === true){
				_animateOut();
			}
		}
	}

	function _animateIn(){
		_loaderView.tween({
			opacity: 0.8,
			textShadow: "0px 0px 0px " + Config.COLORS.white
		}, 1, Config.EASING.inout);

		_text.tween({
			opacity: 1,
			textShadow: "0px 0px 0px " + Config.COLORS.white
		}, 2.5, Config.EASING.inout, 0.5, function(){
			_is_in = true;
		});
	}

	function _animateLoaderOut(){
		_loader_out = true;

		_loaderView.tween({
			opacity: 0,
			textShadow: "0px 0px 15px " + Config.COLORS.white
		}, 1, Config.EASING.inout);
	}

	function _animateOut() {
		Render.stopRender(_checkAnimateOut);

		_text.tween({
			y: 0,
			opacity: 0,
			textShadow: "0px 0px 15px " + Config.COLORS.white
		}, 1, Config.EASING.in, 1, function(){
			_loadCallback();
			
			_elem.tween({
				opacity: 0
			}, 1.5, Config.EASING.out, null, function(){
				_elem.setZ(0);

				_self.delayedCall(function(){
					_self.__destroy();
				}, 500);
			});
		});
	}
} 