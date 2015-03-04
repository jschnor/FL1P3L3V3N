function FullBackgroundImage() {

	Inherit(this, $class);

	var _self = this,
		_elem = _self.element,
		_curr = 0
		_slidesLoaded = false,
		_slides = [],
		_z = 1;
	

	(function() {
		_init();
	})();

	function _init() {
		_elem.size('100%');
	}

	this.loadSlides = function(data, id) {
		
		if (!_slidesLoaded) {
			_slides = [];
			_slidesLoaded = true;
		}

		// create slide elements
		var _slide = _self.initClass(FullBackgroundImageSlide, id);
		_slide.hide();

		_slides.push(_slide);
	};

	this.getFirst = function(){
		_curr = 0;
		_slides[_curr].show(_z);
	};

	this.getNext = function() {
		_slides[_curr].stop();

		_curr++;
		_z++;

		if (_curr > _slides.length - 1) {
			_curr = _slides.length - 1;
		}

		_slides[_curr].show(_z);
	};


	this.getPrev = function() {
		_slides[_curr].stop();
		
		_curr--;
		_z++;

		if (_curr < 0) {
			_curr = 0;
		}

		_slides[_curr].show(_z);
	};

	this.removeSlides = function() {
		_self.delayedCall(function() {
			_elem.css({
				top: 0
			});

			for (var i = 0; i < _slides.length; i++) {
				_slides[i]._parent.removeChild(_slides[i]);
			}

			_slides = null;
			_slidesLoaded = false;
		}, 1000);
	};
};