Class(function LocalStorage() {

	var _self = this,
		_storage = false;

	(function(){
		if (Device.system.localStorage){
			_init();
		}
	})();

	function _init(){
		_storage = window.localStorage;
		if (!_storage.data){
			_storage.data = JSON.stringify([]);
		}
	}

	this.get = function(){
		if (_storage !== false){
			return JSON.parse(_storage.data);
		}else{
			return false;
		}
	};

	this.set = function(_array){
		if (_storage !== false){
			_storage.data = JSON.stringify(_array);
		}else{
			return false;
		}
	};

	this.add = function(_object){
		if (_storage !== false){
			var _data = JSON.parse(_storage.data);

			// check if already saved
			for (var i = _data.length - 1; i >= 0; i--) {
				var _datastr = JSON.stringify(_data[i]);
				var _objstr = JSON.stringify(_object);

				// data is already saved in localStorage
				if (_datastr == _objstr){
					return false;
				}
			};

			_data.push(_object);

			_storage.data = JSON.stringify(_data);
		}else{
			return false;
		}
	};

}, 'static');