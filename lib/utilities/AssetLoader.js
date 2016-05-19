Class(function AssetLoader() {

	var _self = this,
		_loaded = {
			images: [],
			data: []
		};

	// url (string): what to load
	// type (string): 'json', 'image'
	// callback (function): runs after item is loaded, receives the loaded item as parameter
	function _load(url, type, callback){
		if (typeof url !== 'string'){
			if (Config.DEBUG.loader){
				console.warn('AssetLoader: Invalid URL supplied to _load().');
			}
		}else{

			switch (type){
				case 'image':
				case 'img':
				// make sure we haven't already loaded this image
				var _isLoaded = false;
				_loaded.images.forEach(function(element, index){
					if (element.src == url || element.src == window.location.protocol + '//' + window.location.hostname + url){
						_isLoaded = true;
					}
				});

				if (_isLoaded === false){
					var _newImage = new Image();

					_newImage.onload = function(){
						// send newly loaded image to callback
						if (typeof callback == 'function'){
							callback(_newImage);
						}

						// push new image
						_loaded.images.push(_newImage);
					};

					_newImage.onerror = function(error){
						if (typeof callback == 'function'){
							if (Config.DEBUG.loader){
								console.error('AssetLoader: Image skipped (load error): '+url);
							}
							callback(false);
						}
					};

					_newImage.src = url;
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						if (Config.DEBUG.loader){
							console.log('AssetLoader: Image skipped (already loaded): '+url);
						}
						callback(false);
					}
				}
				break;

				case 'json':
				// make sure we haven't already loaded this data
				var _isLoaded = false;

				if (Device.system.localStorage && Config.useLocalStorage !== false){
					// check localStorage
					if (LocalStorage.find(url)){
						_isLoaded = true;
					}
				}else{
					_loaded.data.forEach(function(element, index){
						if (element.id === url){
							_isLoaded = true;
						}
					});
				}

				if (_isLoaded === false){
					Ajax.get(url, {}, function(response){
						try {
							var _json = JSON.parse(response);

							// send data to callback
							if (typeof callback == 'function'){
								callback(_json);
							}

							if (Device.system.localStorage && Config.useLocalStorage !== false){
								// put data in web storage
								LocalStorage.add({ id: url, result: _json });
							}else{
								// push new data
								_loaded.data.push({ id: url, result: _json });
							}
						}catch (error){
							if (Config.DEBUG.loader){
								console.error('AssetLoader: Error processing loaded data.');
								console.error(error);
								console.log(response);
							}
						}
					});
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						if (Config.DEBUG.loader){
							console.log('AssetLoader: File skipped (already loaded): '+url);
						}
						callback(false);
					}
				}
				break;

				default:
				// make sure we haven't already loaded this data
				var _isLoaded = false;

				if (Device.system.localStorage && Config.useLocalStorage !== false){
					// check localStorage
					if (LocalStorage.find(url)){
						_isLoaded = true;
					}
				}else{
					_loaded.data.forEach(function(element, index){
						if (element.id === url){
							_isLoaded = true;
						}
					});
				}

				if (_isLoaded === false){
					Ajax.get(url, {}, function(response){
						// send data to callback
						if (typeof callback == 'function'){
							callback(response);
						}
						
						if (Device.system.localStorage && Config.useLocalStorage !== false){
							// put data in web storage
							LocalStorage.add({ id: url, result: response });
						}else{
							// push new data
							_loaded.data.push({ id: url, result: response });
						}
					});
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						if (Config.DEBUG.loader){
							console.log('AssetLoader: File skipped (already loaded): '+url);
						}
						callback(false);
					}
				}
				break;
			}
		}
	}

	this.load = function(url, type, callback){
		_load(url, type, callback);
	};

	// load all the stuff in the manifest
	// manifest should be an array of objects, each with properties "url", "type", and "callback"
	this.loadManifest = function(manifest){
		if (manifest.length > 0){
			manifest.forEach(function(element, index){
				if (typeof element == 'object'){
					if (element.hasOwnProperty('url') && element.hasOwnProperty('type') && element.hasOwnProperty('callback')){
						_load(element.url, element.type, element.callback);
					}else{
						if (Config.DEBUG.loader){
							console.warn('AssetLoader: Manifest element is missing either url, type, or callback property.');
						}
					}
				}else{
					if (Config.DEBUG.loader){
						console.warn('AssetLoader: Invalid manifest element.');
					}
				}
			});
		}else{
			if (Config.DEBUG.loader){
				console.warn('AssetLoader: Nothing in manifest to load.');
			}
		}
	};

	// get all loaded things
	this.getLoaded = function(){
		return _loaded;
	};

	// get a previously loaded image
	this.getImg = this.getImage = function(imgurl){
		for (var i = _loaded.images.length - 1; i >= 0; i--) {
			if (_loaded.images[i].src == imgurl){
				return _loaded.images[i];
			}
		};
	};

	// get previously loaded JSON data
	this.getData = this.getJSON = function(srcurl){
		for (var i = _loaded.data.length - 1; i >= 0; i--) {
			if (_loaded.data[i].id == srcurl){
				return _loaded.data[i].result;
			}
		};
	};

	// get rid of all loaded items
	this.empty = function(){
		_loaded = {
			images: [],
			data: []
		};
	};
}, 'static');