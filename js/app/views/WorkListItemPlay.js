Class(function WorkListItemPlay() {
	Inherit(this, View);
	
	var _self = this;
	var _elem, _playtext, _playarrow;
	var _smw = 0.432; // playarrow width multiplier
	var _smh = 0.744; // playarrow height multiplier
	this.mouseover = false;
	this.mouseout = true;
	
	(function(){
		_init();
		_addPlayText();
	})();
	
	
	function _init(){
		_elem = _self.element;
		
		_elem.size("100%", Stage.height * 0.194).setZ(200).bg(Config.COLORS.white).transform({
			y: Stage.height + 10
		});
	}

	function _addPlayText(){
		var fontsize = 40;
		_playtext = _elem.create("playtext");
		_playtext.fontStyle("OpenSansLight", fontsize, Config.COLORS.purple);
		_playtext.css({
			letterSpacing: fontsize * 0.3,
			marginTop: "-0.6em",
			opacity: 0
		});
		_playtext.text("PLAY");
		
		_playarrow = _playtext.create("playarrow");
		_playarrow.size((fontsize * _smw), (fontsize * _smh)).bg(Config.IMAGES + "common/play-arrow-purple.png").css({
			right: 0,
			top: fontsize * 0.325
		});
	}
	
	this.resize = function(parent_width){
		_elem.size(parent_width, Stage.height * 0.194);
		
		// position play button
		switch (this.mouseover){
			case true:
			_elem.transform({
				y: Stage.height - _elem.height
			});
			break;
			
			case false:
			_elem.transform({
				y: Stage.height + 10
			});
			break;
		}
		
		_playtext.size((parent_width * 0.5), "auto").center();
		
		var playtextscale;
		if (Stage.width > Stage.height) {
			playtextscale = Stage.height * 0.0667;
		} else {
			playtextscale = Stage.width * 0.042;
		}
		var playtextspacingscale = playtextscale * 0.3;
		
		_playtext.css({
			fontSize: playtextscale,
			letterSpacing: playtextspacingscale
		});
		
		_playarrow.size((playtextscale * _smw), (playtextscale * _smh)).css({
			top: playtextscale * 0.325
		});
	};
	
	// controlled by parent hover
	this.over = function(){
		this.mouseover = true;
		this.mouseout = false;
		
		_elem.stopTween().transform({
			y: Stage.height + 10
		});
		
		_elem.tween({
			y: Stage.height - _elem.height
		}, 350, "easeInOutQuad", 900);
		
		_playtext.stopTween().transform({
			x: -30
		});
		
		_playtext.tween({
			x: 0,
			opacity: 1
		}, 200, "easeInOutQuad", 1100);
	};
	
	// controlled by parent hover
	this.out = function(){
		this.mouseover = false;
		this.mouseout = true;
		
		_elem.stopTween();
		_elem.tween({
			y: Stage.height + 10
		}, 200, "easeInOutQuad", 100);
		
		_playtext.stopTween();
		_playtext.tween({
			x: 30,
			opacity: 0
		}, 150, "easeInOutQuad");
	};

	this.animateWidth = function(width){
		_elem.tween({
			width: width
		}, Global.WORK.transition.time, Global.WORK.transition.ease);
	};
});