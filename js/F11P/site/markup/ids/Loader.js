function Loader(callback) {
	 
	Inherit(this, $id);

	var _self = this,
		_elem = _self.element,
		_preload,
		_loader,
		_loaderBar,
		_loaderView,
		_loaderMark,
		_loaderText,
		_loaderDot,
		_sizes = {},
		_images = Config.PRELOAD,
		_hidden;

	Global.LOADER = this;

	(function() {
		_init();
		_events();
	})();

	function _init() {
		// console.log('RUN LOADER');

		_elem.setZ(200);

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
		_loaderBar.bg(Config.ASSETS.images+'timeline.png').setProps({
			backgroundSize: '100% 100%'
		});

		_loaderView = _loader.create('.view');
		_loaderView.setProps({
        	x: 0,
        	y: 0
        });

		_loaderText = _loaderView.create('.loader-text');
		_loaderText.setProps({
			fontFamily: Config.FONTS.headings.name,
			color: Config.COLORS.white,
			textAlign: 'center',
			backgroundSize: '100% 100%'
		}).bg(Config.ASSETS.images+'tag-bg.png').setZ(20);

		_loaderMark = _loaderView.create('.mark');
		_loaderMark.bg(Config.ASSETS.images+'timeline-mark.png').setProps({
			backgroundSize: '100% 100%'
		}).setZ(10);

		_loaderDot = _loaderView.create('.dot');
		_loaderDot.bg(Config.COLORS.red).css({
			borderRadius: '50%'
		}).setZ(30);
		_loaderDot.innerDot = _loaderDot.create('.innerdot');
		_loaderDot.innerDot.bg(Config.COLORS.yellow).css({
			borderRadius: '50%'
		});
	}

	function _animateIn(){
		_loader.tween({
			opacity: 1
		}, 0.5, Config.EASING.out, 0.25);

		_self.delayedCall(_loadAll, 250);
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

		_loaderView.tween({
			x: (_sizes.loaderwidth - _sizes.tagwidth)*_preload.progress
		}, 0.25, Config.EASING.out);

		_loaderText.text((Math.round(_preload.progress * 100)) + '%');

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
		var _fonts = [Config.FONTS.headings.name, Config.FONTS.body.name];
		for (var i = 0; i < _fonts.length; i++) {
			var _render = _hidden.create(".a");
			_render.text("a").fontStyle(_fonts[i], 12, "#000");
		}
	}

	function _animateOut() {
		_elem.tween({
			opacity: 0
		}, 1, Config.EASING.in, null, function(){
			if (typeof callback == 'function'){
				callback();
			}

			_self.delayedCall(function(){
				_self.__destroy();
			}, 500);
		});
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _setSize(){
		_elem.size(Stage.innerW, Stage.innerH).setProps({
            top: Global.HEADER.height
        });

        _sizes.loaderwidth = Stage.innerW * (1747/2020);
        _sizes.loaderheight = Stage.innerH * (177/1500);
        _sizes.barheight = _sizes.loaderwidth * (6/1747);

        _loader.size(_sizes.loaderwidth, _sizes.loaderheight).setProps({
        	left: (Stage.innerW - _sizes.loaderwidth)/2,
        	top: (Stage.innerH - _sizes.loaderheight)/2
        });

        _loaderBar.size(_sizes.loaderwidth, _sizes.barheight).setProps({
        	left: 0,
        	top: _sizes.loaderheight * (28/177)
        });

        _sizes.tagwidth = _sizes.loaderwidth * (270/1747);
        _sizes.tagheight = _sizes.tagwidth * (53/270);

        _loaderView.size(_sizes.tagwidth, _sizes.loaderheight);

        _loaderText.size(_sizes.tagwidth, _sizes.tagheight).setProps({
        	left: 0,
        	bottom: 0,
        	lineHeight: _sizes.tagheight + 'px',
        	fontSize: (_sizes.tagheight * 0.66) + 'px',
        	fontWeight: Config.FONTS.headings.bold
        });

        _sizes.markheight = _sizes.loaderheight * (136/177);
        _sizes.markwidth = _sizes.markheight * (3/136);

        _loaderMark.size(_sizes.markwidth, _sizes.markheight).setProps({
        	left: '50%',
        	top: 5
        });

        _sizes.dot = _sizes.loaderheight * (55/177);
        _sizes.innerdot = _sizes.dot * (20/55);

        _loaderDot.size(_sizes.dot, _sizes.dot).setProps({
        	left: (_sizes.tagwidth - _sizes.dot)/2,
        	top: _sizes.loaderheight * (3/177)
        });

        _loaderDot.innerDot.size(_sizes.innerdot, _sizes.innerdot).setProps({
        	left: (_sizes.dot - _sizes.innerdot)/2,
        	top: (_sizes.dot - _sizes.innerdot)/2
        });
	}
} 