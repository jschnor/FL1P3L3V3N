function Cover(){

	Inherit(this, Controller);
	
	var _self = this,
		_elem = _self.element,
		_title,
		_text;

	(function(){
		_init();
		_setSize();
		_events();
	})();

	function _init(){
		_elem.size("100%", "100%").bg(Config.COLORS.black).setZ(999999);

		_title = _elem.create('.covertitle');
		_title.size("90%", "auto").css({
			fontFamily: Config.FONTS.default.name,
			fontWeight: Config.FONTS.default.normal,
			color: Config.COLORS.white,
			left: "5%",
			top: "42%",
			textAlign: "center"
		});

		_title.text('SAMPLE SITE');

		_text = _elem.create('.covermessage');
		_text.size("90%", "auto").css({
			fontFamily: Config.FONTS.default.name,
			fontWeight: Config.FONTS.default.normal,
			color: Config.COLORS.white,
			left: "5%",
			top: "50%",
			textAlign: "center",
			lineHeight: "1.2em"
		});

		if (Mobile.version == 7.1) {
			_text.text("Please ugrade your mobile operating system or visit our site on your desktop browser.");
		} else {
			_text.text("Please make your browser window bigger.<br />Visit us on your mobile device to see the mobile optimized site.");
		}
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _setSize(){
		var titlesize = Stage.width*(22/400);
		var textsize = Stage.width*(15/400);

		_title.css({
			fontSize: titlesize+'px',
			letterSpacing: titlesize * Config.FONTS.default.spacing.titles + 'px',
            textIndent: titlesize * Config.FONTS.default.spacing.titles + 'px'
		});

		_text.size("90%", "auto").css({
			fontSize: textsize+'px'
		});


		if (!Device.mobile){
			if (Stage.width < 640 || Stage.height < 400){
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			} else{
				_elem.css({
					visibility: "hidden",
					opacity: 0
				});
			}
			
		} else {

			if (Mobile.os == 'Android') {
				if (Mobile.version < 4.4) {
					_elem.css({
						visibility: "visible",
						opacity: 1
					});
				} else {
					_elem.css({
						visibility: "hidden",
						opacity: 0
					});
				}
			}

			if (Mobile.os == 'iOS') {
				if (Mobile.version < 7.1) {
					_elem.css({
						visibility: "visible",
						opacity: 1
					});
				} else {
					_elem.css({
						visibility: "hidden",
						opacity: 0
					});
				}
			}

			if (Mobile.os != 'Android' && Mobile.os != 'iOS') {
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			}

			if (Stage.width < Stage.height){
				_text.text("Please rotate your device horizontal.");
				_elem.css({
					visibility: "visible",
					opacity: 1
				});
			}
			
		}
	}
}