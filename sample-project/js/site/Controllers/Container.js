Class(function Container() {

	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_loader,
		_cover,
		_pageclass,
		_fullbg;
	
	Global.CONTAINER = this;

	(function() {
		_init();
		_onResize();
		_events();
		_preloadSite();
	})();

	function _init() {
		_elem.bg(Config.COLORS.black);
		Stage.add(_elem);
	}

	function _events(){
		Evt.resize(_onResize);
	}

	function _preloadSite() {
		_loader = _self.initClass(Loader, _onLoadComplete);
	}

	function _onLoadComplete() {
		if (Config.DEBUG.loader){ console.log('LOADER CALLBACK'); }

		// attempt to rescale the stage when mobile chrome is visible
		// on initial load only
		// seems hackish ¯\_(ツ)_/¯
		if (Device.mobile.phone){
			window.scrollTo( 0, 1 );
			var scrollTop = 1;

			setTimeout(function(){
				window.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
			}, 50);
		}

		// add cover
		_cover = _self.initClass(Cover);

		// set page state
		_pageState();
	}

	function _onResize() {
		_elem.size(Stage.width, Stage.height);
	}

	// SETS GLOBAL PAGES AND INITIALIZES
	// THAT PAGE NAME AS A CLASS
	function _pageState(pagename) {

		var _pagename = pagename;

		if (!_pagename) {
			_pagename = Data.STATE.page;
		}

		var className;

		// CURRENTLY, CLASSNAMES AND DATA STATE PAGE NAMES HAVE TO BE
		// THE SAME FOR PROPER ROUTING, SO:
		// _pagename/Global.PAGE must be the same as Data.STATE.page
		// ==========================================================
		// console.log(Data.STATE.page);
		
		switch (Data.STATE.page) {
			case 'home':
			default:
				className = Home;
				break;
		}

		Global.PAGE = _pagename;

		_fullbg = _self.initClass(FullBackground);
		_pageclass  = _self.initClass(className);
		
		_elem.add(_fullbg);
		_elem.add(_pageclass);
	}
	

	// THIS RUNS EVERY TIME THE PAGE STATE RUNS
	this.checkBrowserBack = function() {
		if (Global.PAGE.toLowerCase() != Data.STATE.page.toLowerCase() && _pageclass) {
			if(_pageclass.hasAnimateOut === true) {
				_pageclass.animateOut(function() {
					_pageclass = _pageclass.destroy();
					_pageState(Data.STATE.page);
				});
			} else {
				_pageState(Data.STATE.page);
			}
		}
	};

}, 'singleton');