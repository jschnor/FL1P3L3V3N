function Intro(callback) {

	Inherit(this, $id);
	
	var _self = this,
		_elem = _self.element,
		_scrollCallback = callback,
		_text,
		_arrowbox,
		_arrow,
		_fontsize,
		_width,
		_height;

	var _mouse = {
            x: Stage.width/2,
            y: Stage.height/2,
            vx: 0,
            vy: 0
        },
        _translate = {
            x: 0,
            y: 0,
            prevx: 0,
            prevy: 0
        },
        _rotate = {
            x: 0,
            y: 0,
            prevx: 0,
            prevy: 0
        };

	Global.INTRO = this;

	(function(){
		_init();
		_addText();
		_addArrow();
		_animateIn();
		_setSize();
		_events();
	})();

	function _init(){
		// console.log('INTRO INIT');
		_elem.size(Stage.width, Stage.height).setProps({
			scale: 0.5
		}).setZ(250);
	}

	function _addText(){
		_text = _elem.create('.intro-text');
		_text.setProps({
			fontFamily: Config.FONT.name,
			color: Config.COLORS.white,
			textAlign: 'center',
			lineHeight: '1.33em',
			opacity: 0
		});
		_text.text(Data.LOADER.text.toUpperCase());
	}

	function _addArrow(){
		_arrowbox = _elem.create('.arrow-container');
		_arrowbox.setProps({
			opacity: 0
		});

        _arrow = _self.initClass(ScrollArrow, true, true);
        _arrowbox.add(_arrow);
    }

    function _events(){
		Evt.resize(_setSize);

		// track mouse movement
		if (!Device.mobile){
        	document.addEventListener('mousemove', _onMouseMove);
        }
	}

	function _bindScroll(){
		if (Device.mobile){
            TouchUtil.bind(_elem, _directionHandler);
        }else{
            ScrollUtil.bind(_elem, _directionHandler);
        }
	}

	function _setSize(){
		_fontsize = Math.min(Stage.height * 0.04, Stage.width * 0.025);
		_width = Stage.width;
		_height = _fontsize*4;

		_elem.size(Stage.width, Stage.height);

		_text.setProps({
			width: _width,
			height: _height,
			x: (Stage.width - _width)/2,
			y: (Stage.height - _height)/2,
            fontSize: _fontsize + 'px',
            letterSpacing: _fontsize * Config.FONT.spacing.subtitles + 'px'
        });
	}

	function _onMouseMove(event){
        _updateCoords(event);
        Render.startRender(_updateObj);
    }

    function _updateCoords(event){
        // get mouse coords
        _mouse.x = event.clientX || event.pageX; 
        _mouse.y = event.clientY || event.pageY;

        // normalize mouse position values based on Stage center
        _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
        _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

        // figure out how much to translate elements
        _translate.x = -((Stage.width * Config.MAXTRANSLATE.x) * _mouse.vx).toFixed(2);
        _translate.y = -((Stage.height * Config.MAXTRANSLATE.y) * _mouse.vy).toFixed(2);

        // figure out how much to rotate elements
        // we switch these because the rotateX function actually rotates AROUND the X axis
        // if you want it to 'look at' the mouse, we have to invert the Y value as well so it makes sense visually
        // _rotate.y = -(Config.MAXROTATE.x * _mouse.vx).toFixed(2);
        // _rotate.x = (Config.MAXROTATE.y * _mouse.vy).toFixed(2);
    }

    function _updateObj(){
        var lerpX = Utils.lerp(Config.LERPAMT, _translate.prevx, _translate.x);
        var lerpY = Utils.lerp(Config.LERPAMT, _translate.prevy, _translate.y);
        var pos_x = (Stage.width - _width)/2;
        var pos_y = (Stage.height - _height)/2;

        // update previous values
        _translate.prevx = lerpX;
        _translate.prevy = lerpY;

        // update transform values on element
        _text.setProps({
            transform: 'translate('+(lerpX + pos_x)+'px, '+(lerpY + pos_y)+'px)'
        });
    }

    function _directionHandler(event) {
    	// console.log(event);

    	if (!Device.mobile){
    		if (event.direction == 'down'){
	    		_animateOut();
	    	}
    	}else{
    		if (event.direction == 'up'){
	    		_animateOut();
	    	}
    	}
    }

    function _animateIn(){
		var time = 5;

		_elem.tween({
			scale: 1
		}, time, Config.EASING.out);

		_text.tween({
			opacity: 1
		}, time, Config.EASING.inout);

		_self.delayedCall(_bindScroll, 3000);

		_self.delayedCall(_showArrow, (time*1000)+500);
	}

	function _showArrow(){
		_arrowbox.tween({
			opacity: 1
		}, 2, Config.EASING.out);
	}

	function _animateOut() {
		_stop();

		_elem.tween({
			y: -Stage.height,
			opacity: 0
		}, 1.25, Config.EASING.inout, null, function(){
			_elem.setZ(0);

			if (typeof _scrollCallback == 'function'){
				_scrollCallback();
			}else{
				throw Error('Intro callback is not a function');
			}
		});
	}

	// clean up animations and events
	function _stop(){
		TouchUtil.unbind(_elem);
		
		if (!Device.mobile){
			ScrollUtil.unbind(_elem);
	        Render.stopRender(_updateObj);
	        document.removeEventListener('mousemove', _onMouseMove);
	    }

		_arrow.stop();
    };

    this.animateIn = function(){
		_animateIn();
	};

	this.animateOut = function(){
		_animateOut();
	};
}