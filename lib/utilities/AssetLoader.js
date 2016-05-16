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
			console.warn('Invalid URL supplied to AssetLoader.');
		}else{

			switch (type){
				case 'image':
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
					_newImage.src = url;
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						console.warn('File skipped: '+url);
						callback(false);
					}
				}
				break;

				case 'json':
				// make sure we haven't already loaded this data
				var _isLoaded = false;
				_loaded.data.forEach(function(element, index){
					if (element.src === url){
						_isLoaded = true;
					}
				});

				if (_isLoaded === false){
					Ajax.get(url, {}, function(response){
						try {
							var _json = JSON.parse(response);

							// send data to callback
							if (typeof callback == 'function'){
								callback(_json);
							}
							
							// push new data
							_loaded.data.push({ src: url, result: _json });
						}catch (error){
							console.error('Response was not valid JSON.');
							console.error(error);
							console.log(response);
						}
					});
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						console.warn('File skipped: '+url);
						callback(false);
					}
				}
				break;

				default:
				// make sure we haven't already loaded this data
				var _isLoaded = false;
				_loaded.data.forEach(function(element, index){
					if (element.src === url){
						_isLoaded = true;
					}
				});

				if (_isLoaded === false){
					Ajax.get(url, {}, function(response){
						// send data to callback
						if (typeof callback == 'function'){
							callback(response);
						}
						
						// push new data
						_loaded.data.push({ src: url, result: response });
					});
				}else{
					// tell the callback that the file was skipped
					if (typeof callback == 'function'){
						console.warn('File skipped: '+url);
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
						console.warn('Manifest element is missing either url, type, or callback property.');
					}
				}else{
					console.warn('Invalid manifest element.');
				}
			});
		}else{
			console.warn('Nothing in manifest to load.');
		}
	};

	// get rid of all loaded items
	this.empty = function(){
		_loaded = {
			images: [],
			data: []
		};
	};
}, 'static');