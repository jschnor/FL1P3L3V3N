Class(function FullBackground() {

	Inherit(this, Controller);

	var _self = this,
		_elem = _self.element,
		_video,
		_image;

	Global.FULLBG = this;

	(function() {
		_init();
	})();

	function _init() {
		_elem.size('100%').css({
			overflow: 'hidden'
		}).setZ(1);

		if (!Device.mobile) {
			_self.video = _video = _self.initClass(FullBackgroundVideo);
		}

		_self.image = _image = _self.initClass(FullBackgroundImage);
	}

	function _swapBG() {

        if (Config.DEBUG.all || Config.DEBUG.fullbg) {
            console.log(Data.STATE.page.toLowerCase());
            console.log(_self.video.div.style.zIndex);
            console.log('==========================');
        }

        if (!Device.mobile) {
            _self.video.element.setProps({ opacity: 0 });
        }
        _self.image.element.setProps({ opacity: 0 });

        switch (Data.STATE.page.toLowerCase()) {
            case 'home':
            case '/':
            	// set video z-index above the image to show video bg on home page
                if (!Device.mobile) {
                    if (_self.video.AMBIENT) {
                        _self.video.element.setProps({ opacity: 1 });
                    } else {
                        _self.video.element.setProps({ opacity: 0 });
                    }
                    _self.video.element.setZ(2);
                }
                
                _self.image.element.setZ(1);
            	break;

            case 'whatever':
            	// some other page with an image bg
                _self.image.element.setProps({ opacity: 1 });
                _self.image.element.setZ(2);
                if (!Device.mobile) {
                    _self.video.element.setZ(1);
                }
            	break;
        }
    }

    this.swapBG = function(){
    	_swapBG();
    };
});