Class(function WorkListItemText(item_data) {
	Inherit(this, View);
	
	var _self = this;
	var _elem, _titletext, _clienttext, _contenttext, _titletextbg;
	
	(function () {
		_init();
		_createText();
	})();

	function _init() {
		_elem = _self.element;
		_elem.css({
			height: "100%",
			width: "100%"
		}).setZ(100);
		_elem.wrapper = _elem.create(".wrapper");
		_elem.wrapper.size("100%");
	}
	
	function _createText() {
		// create title
		_titletext = _elem.wrapper.create(".title");
		_titletext.fontStyle("LeagueGothic", 56, Config.COLORS.white);
		_titletext.size("80%", "auto").css({
			position: "relative",
			left: 0,
			top: "33%",
			lineHeight: 56,
			letterSpacing: 1,
			textAlign: "center",
			opacity: 0.4,
			paddingLeft: "10%",
			paddingRight: "10%"
		});
		
		// insert text
		_titletext.text(item_data.title.toUpperCase());
		
		// create client
		_clienttext = _elem.wrapper.create('.client');
		_clienttext.fontStyle("LeagueGothic", 22, Config.COLORS.white);
		_clienttext.size("80%", "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
			position: "relative",
			left: 0,
			top: "35%",
			lineHeight: 22 * 0.9,
			letterSpacing: 22 * 0.136,
			textAlign: "center",
			opacity: 0.4,
			paddingLeft: "10%",
			paddingRight: "10%"
		});
		
		// insert text
		_clienttext.text(item_data.client.toUpperCase());
		
		// create content
		_contenttext = _elem.wrapper.create('.content');
		_contenttext.fontStyle("OpenSansLight", 12, Config.COLORS.white);
		_contenttext.size("80%", "auto").css({
			position: "relative",
			left: 0,
			top: "31.5%",
			lineHeight: 12 * 1.3333,
			textAlign: "left",
			opacity: 0,
			paddingLeft: "10%",
			paddingRight: "10%"
		});
		
		// insert text
		_contenttext.text(item_data.content);
	}
	
	this.over = function () {
		// if (Device.mobile) {
		// 	return
		// }
		
		// change text colors
		_titletext.stopTween();
		_clienttext.stopTween();
		
		_titletext.tween({
			color: Config.COLORS.white,
			opacity: 1,
			top: "25%"
		}, 300, "easeInOutQuad", 100);
		
		_clienttext.tween({
			color: Config.COLORS.white,
			opacity: 1,
			top: "27%"
		}, 300, "easeInOutQuad", 100);
		
		// display content
		_contenttext.stopTween().transform({
			x: -20
		});
		_contenttext.tween({
			x: 0,
			opacity: 1,
			top: "31%"
		}, 300, "easeInOutQuad", 200);
	};
	
	this.out = function () {
		// if (Device.mobile) {
		// 	return
		// }
		
		// change text colors
		_titletext.stopTween();
		_clienttext.stopTween();
		
		_titletext.tween({
			color: Config.COLORS.white,
			opacity: 0.4,
			top: "33%"
		}, 200, "easeInOutQuad");
		
		_clienttext.tween({
			color: Config.COLORS.white,
			opacity: 0.4,
			top: "35%"
		}, 200, "easeInOutQuad");
		
		// hide content
		_contenttext.stopTween();
		_contenttext.tween({
			x: 30,
			opacity: 0,
			top: "31.5%"
		}, 200, "easeInOutQuad");
	};
	
	// resize
	this.resize = function (parent_width) {
		// size and reposition wrapper
		/*_elem.wrapper.size((parent_width * 0.8), "100%").css({
			paddingLeft: parent_width * 0.1,
			paddingRight: parent_width * 0.1
		});*/
		
		// set up some vars
		var titlescale = Stage.height * 0.082;
		if (titlescale > 56) {
			titlescale = 56;
		}
		if (titlescale < 18) {
			titlescale = 18;
		}
		if (Device.mobile.phone) {
			titlescale = 18;
		}
		var titlelineheightscale = titlescale * 1;
		
		var clientscale = titlescale * 0.468;
		if (clientscale > 22){
			clientscale = 22;
		}
		if (clientscale < 12){
			clientscale = 12;
		}
		if (Device.mobile.phone){
			clientscale = 12;
		}
		var clientlineheightscale = clientscale * 0.9;
		var clientspacingscale = clientscale * 0.136;
		
		var contentscale = titlescale * 0.25;
		if (contentscale < 12){
			contentscale = 12;
		}
		var contentlineheightscale = contentscale * 1.3333;
		
		// resize text on the resize event
		_titletext.css({
			fontSize: titlescale,
			lineHeight: titlelineheightscale
		});
		
		// resize and position client text
		_clienttext.css({
			fontSize: clientscale,
			lineHeight: clientlineheightscale
		});
		
		// resize content
		_contenttext.css({
			fontSize: contentscale,
			lineHeight: contentlineheightscale
		});
	};

	this.unskew = function(){
		_clienttext.tween({
            skewX: 0 // skew correction
        }, Global.WORK.transition.time, Global.WORK.transition.ease)
	};

	this.skew = function(){
		_clienttext.tween({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // skew correction
        }, Global.WORK.transition.time, Global.WORK.transition.ease)
	};
	
	this.show = function () {
		_elem.wrapper.stopTween().clearAlpha();
		/*_titletextbg.transform({
			x: -_titletextbg.width - 1
		});
		_titletextbg.inner.transform({
			x: _titletextbg.width
		});*/
	};
	
	this.animateIn = function () {
		/*_titletextbg.stopTween().transform({
			x: _titletextbg.width + 2
		});
		_titletextbg.inner.stopTween().transform({
			x: -_titletextbg.width - 2
		});*/
		_elem.wrapper.stopTween().css({
			opacity: 0
		}).tween({
			opacity: 1
		}, 500, "easeOutSine", FEDevice.PERFORMANCE > 0 ? 300 : 1);
	};
	
	this.hide = function () {
		_elem.wrapper.css({
			opacity: 0
		});
	}
});