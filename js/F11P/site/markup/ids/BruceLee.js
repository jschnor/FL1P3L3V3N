function BruceLee() {

	Inherit(this, $id);
	
	var _self = this,
		_elem,
		_content,
		_quote,
		_button,
		_buttontext;

	var _testBox,
		_testlayerA,
		_testlayerB,
		_testText,
		_maxrotate = {x: 20, y: 20},
		_mouse = {
			x: Stage.width/2,
			y: Stage.height/2,
			vx: 0,
			vy: 0
		},
		_rotateY = 0,
		_rotateX = 0,
		_prevRotateY = 0,
		_prevRotateX = 0;

	Global.INTRO = this;

	(function(){
		_init();
		_addQuote();
		_addButton();
		_addTest();
		_setSize();
		_events();
		_animateIn();
	})();

	function _init(){
		console.log('INTRO INIT');

		_elem = _self.element;

		_content = _elem.create('.content');
		// _content.interact(null, null, _onClick);
	}

	function _addTest(){
		_testBox = _elem.create('.testbox');
		_testlayerA = _testBox.create('.testlayer');
		_testlayerB = _testBox.create('.testlayer');
		_testText = _testBox.create('.output');

		_testBox.size(500, 500).setProps({
			x: (Stage.width - 500)/2,
			y: (Stage.height - 500)/2,
			z: 1,
			perspective: 2000
		});

		_testlayerA.size(500, 500).setProps({
			x: 0,
			y: 0,
			transform: 'rotateX( 0deg ) rotateY( 0deg )',
			backgroundColor: 'rgba(128,0,0,0.8)'
		});

		console.log(Config.ASSETS)

		_testlayerB.size(500, 500).setProps({
			x: 0,
			y: 0,
			transform: 'rotateX( 0deg ) rotateY( 0deg ) translateZ( 100px )',
			// backgroundColor: 'rgba(0,64,128,0.5)'
			opacity: 0.7
		}).bg(Config.ASSETS.images+'/brucelee/bruce_1.jpg');

		_testText.size(200, 50).setProps({
			x: 20,
			y: 20,
			z: 999,
			fontSize: '20px',
			color: Config.COLORS.black
		}).bg(Config.COLORS.white);
		_testText.text(_mouse.x + ', ' + _mouse.y);

		// track mouse movement
		document.addEventListener('mousemove', function(event){
			Render.startRender(_updateObj);
			_updateCoords(event);
		}, false);
	}

	function _updateCoords(event){
		// get mouse coords
	    _mouse.x = event.clientX || event.pageX; 
	    _mouse.y = event.clientY || event.pageY;

	    // normalize mouse position values based on Stage center
	    _mouse.vx = ((_mouse.x/(Stage.width - (Stage.width/2))) - 1).toFixed(2);
	    _mouse.vy = ((_mouse.y/(Stage.height - (Stage.height/2))) - 1).toFixed(2);

		// figure out how much to rotate boxes
		// we switch these because the rotateX function actually rotates AROUND the X axis
		// we have to invert the Y value as well so it makes sense visually
		_rotateY = -(_maxrotate.x * _mouse.vx).toFixed(2);
		_rotateX = (_maxrotate.y * _mouse.vy).toFixed(2);

		// log coords into test text box
		_testText.text(_mouse.vx + ', ' + _mouse.vy + '<br />' + _rotateX + ', ' + _rotateY);
	}

	function _updateObj(){
		var lerpX = Utils.lerp(0.05, _prevRotateX, _rotateX);
		var lerpY = Utils.lerp(0.05, _prevRotateY, _rotateY);

		// update previous values
		_prevRotateX = lerpX;
		_prevRotateY = lerpY;

		// update rotation values on test object
		_testlayerA.setProps({
			transform: 'rotateX( '+lerpX+'deg ) rotateY( '+lerpY+'deg )'
		});

		_testlayerB.setProps({
			transform: 'rotateX( '+lerpX+'deg ) rotateY( '+lerpY+'deg ) translateZ( 100px )'
		});

	}

	function _addQuote(){
		_quote = _content.create('.quote');
		_quote.size('100%', 'auto').setProps({
			opacity: 0,
			scale: 0.75,
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.normal,
            textAlign: 'center',
            color: Config.COLORS.white
        });

        var str = '"Hot dogs are nice as long as you don\'t think too much about them."';

        _quote.text(str.toUpperCase());
	}

	function _addButton(){
		_button = _content.create('.enterbutton');
		_button.setProps({
            opacity: 0,
            scale: 0.75
		}).bg(Config.COLORS.white);
		// _button.interact(_onOver, _onOut, _onClick);

		_buttontext = _button.create('.text');
		_buttontext.size('100%', '100%').setProps({
            fontFamily: Config.FONT.name,
            fontWeight: Config.FONT.normal,
            textAlign: 'center'
        });

        _buttontext.text('SKIP INTRO');
	}

	function _events(){
        Evt.resize(_setSize);
    }

    function _onOver(){

    }

    function _onOut(){

    }

    function _onClick(){

    }

    function _setSize(){
    	_elem.size(Stage.width, Stage.height);

    	var _contentWidth = Stage.width * 0.75;
    	var _contentHeight = Stage.height*0.5;
    	var _quotefontsize = _contentWidth * 0.042;
    	var _buttonwidth = Stage.width*0.2;
        var _buttonheight = _buttonwidth*0.15;
        var _buttonfontsize = _buttonheight*0.5;

        _content.size(_contentWidth, _contentHeight).setProps({
        	x: (Stage.width - _contentWidth)/2,
        	y: (Stage.height - _contentHeight)/2
        });

    	_quote.setProps({
    		y: (_contentHeight - (_quotefontsize*3.5))/2,
    		fontSize: _quotefontsize+'px',
    		letterSpacing: _quotefontsize * Config.FONT.spacing.titles + 'px'
    	});

    	_button.size(_buttonwidth, _buttonheight).setProps({
    		x: (_contentWidth - _buttonwidth)/2,
    		y: _contentHeight - _buttonheight
    	});

    	_buttontext.setProps({
            lineHeight: _buttonheight+'px',
            fontSize: _buttonfontsize+'px',
            letterSpacing: _buttonfontsize * Config.FONT.spacing.titles + 'px'
        });
    }

    function _animateIn(){
    	_quote.tween({
    		opacity: 1,
    		scale: 1
    	}, Config.EASING.time, Config.EASING.inout);

    	_button.tween({
    		opacity: 1,
    		scale: 1
    	}, Config.EASING.time, Config.EASING.inout, 1);
    }
}