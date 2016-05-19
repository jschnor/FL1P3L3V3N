Class(function LocalStorage() {

	var _self = this,
		_storage = false;

	(function(){
		if (Device.system.localStorage && Config.useLocalStorage !== false){
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
			try {
				return JSON.parse(_storage.data);
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	};

	this.set = function(_array){
		if (_storage !== false){
			try {
				_storage.data = JSON.stringify(_array);
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	};

	this.clear = function(){
		if (_storage !== false){
			try {
				_storage.clear();
				return true;
			}catch (e){
				return false;
			}
		}
	};

	// compares an object with objects already in data by JSON encoding them
	function _findByComparison(_object){
		if (_storage !== false){
			try {
				var _data = JSON.parse(_storage.data);

				for (var i = _data.length - 1; i >= 0; i--) {
					var _datastr = JSON.stringify(_data[i]);
					var _objstr = JSON.stringify(_object);

					// data is already saved in localStorage
					if (_datastr == _objstr){
						return _data[i];
					}
				};

				return false;
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	}

	// tries to find an object in the data by an ID value
	// assumes a property called 'id'
	function _findById(_id){
		if (_storage !== false){
			try {
				var _data = JSON.parse(_storage.data);

				for (var i = _data.length - 1; i >= 0; i--) {
					// data is already saved in localStorage
					if (_data[i].id == _id){
						return _data[i];
					}
				};

				return false;
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	}

	this.find = function(_object_or_id){
		if (typeof _object_or_id == 'string' || typeof _object_or_id == 'number'){
			var _find = _findById(_object_or_id);
			if (_find){
				return _find;
			}

			return false;
		}else if (typeof _object_or_id == 'object'){
			var _find = _findByComparison(_object_or_id);
			if (_find){
				return _find;
			}

			if (_object.id){
				var _find = _findById(_object.id);
				if (_find){
					return _find;
				}
			}

			return false;
		}

		return false;
	};

	this.findByComparison = function(_object){
		return _findByComparison(_object);
	};

	this.findById = function(_id){
		return _findById(_id);
	};

	this.add = function(_object){
		if (_storage !== false){

			// check if already saved
			if (_findByComparison(_object)){
				return false;
			}

			if (_object.id){
				if (_findById(_object.id)){
					return false;
				}
			}

			try {
				var _data = JSON.parse(_storage.data);
				_data.push(_object);

				_storage.data = JSON.stringify(_data);
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	};

	this.remove = function(_id){
		if (_storage !== false){
			try {
				var _data = JSON.parse(_storage.data);

				for (var i = _data.length - 1; i >= 0; i--) {
					if (_data[i].id == _id){
						_data.splice(i, 1);
						_storage.data = JSON.stringify(_data);
						return true;
					}
				};

				return false;
			}catch (e){
				return false;
			}
		}else{
			return false;
		}
	};

}, 'static');