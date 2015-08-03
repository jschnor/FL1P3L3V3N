Class(function Render() {
	
	Inherit(this, Component);

	var _self = this;
	var _callbacks = [];

	(function() {
	})();

	function _removeCallback(callback) {
		for (var i = 0; i < _callbacks.length; i++) {
			// var __callback = _callbacks[i];
			// console.log(__callback);

			if (_callbacks[i] == callback) {

				var _cb = _callbacks.indexOf(callback);
				if (_cb != -1) {
					_callbacks.splice(_cb, 1);
				}

				TweenLite.ticker.removeEventListener('tick', callback);

			}
		}
	}

	this.startRender = function(callback) {
		
		_callbacks.push(callback);
		TweenLite.ticker.addEventListener('tick', callback);
	
	};

	this.stopRender = function(callback) {

		for (var i = 0; i < _callbacks.length; i++) {
			
			// console.log(_callbacks[i]);

			if (_callbacks[i] == callback) {

				var _cb = _callbacks.indexOf(callback);
				if (_cb != -1) {
					_callbacks.splice(_cb, 1);
				}

				TweenLite.ticker.removeEventListener('tick', callback);
			}
		}

	};

	this.nextFrame = function(callback) {
		// var __callback = callback;

		// _callbacks.push(function(){_removeCallback(callback)});
		// TweenLite.ticker.addEventListener('tick', function(){_removeCallback(callback)});
		_self.startRender(function(){_removeCallback(callback)});

	}



}, 'static')