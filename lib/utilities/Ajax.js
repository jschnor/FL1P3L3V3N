Class(function Ajax() {
	
	// basic ajax call method
	//
	// url (string) required. The URL to make the request to
	// dataObj (object) Key-value pairs to send to the url
	// method (string) GET/get or POST/post. Defaults to GET
	// callback (function) a function to run on successful response. receives response text as first argument
	function _call(url, dataObj, method, callback){
		var _queryStr = '';

		if (typeof url != 'string'){
			console.warn('AJAX Error: Request URL not specified.');
			return false;
		}

		if (typeof dataObj == 'object'){
            var _kvPairs = [];
            for (var idx in dataObj){
            	_kvPairs.push(encodeURIComponent(idx)+'='+encodeURIComponent(dataObj[idx]));
            }
            if (_kvPairs.length > 0){
            	_queryStr = _kvPairs.join('&');
            }
		}

		var _xhr = new XMLHttpRequest();

		_xhr.onreadystatechange = function(){
			if (_xhr.readyState == 4 ) {
				if (_xhr.status == 200){
					// OK
					if (typeof callback == 'function'){
						callback(_xhr.responseText);
					}

				}else if(_xhr.status == 400){
					console.warn('AJAX Error: 400 Bad Request');
				}else if (_xhr.status == 404){
					console.warn('AJAX Error: 404 Not Found');
				}else{
					console.warn('AJAX Error: Request failed');
				}
			}
		}

		switch (method){
			case 'POST':
			case 'post':
			if (_queryStr == ''){
				console.warn('AJAX Error: No data to post! Use GET method instead.');
			}else{
				_xhr.open('POST', url, true);
		    	_xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				_xhr.send(_queryStr);
			}
			break;

			case 'GET':
			case 'get':
			default:
			if (_queryStr != ''){
				_xhr.open('GET', url+'?'+_queryStr, true);
			}else{
				_xhr.open('GET', url, true);
			}
        	_xhr.send();
			break;
		}
	}


	this.call = function(url, dataObj, method, callback){
		_call(url, dataObj, method, callback);
	};

	this.get = function(url, dataObj, callback) {
		_call(url, dataObj, 'GET', callback);
	};

	this.post = function(url, dataObj, callback){
		_call(url, dataObj, 'POST', callback);
	};

}, 'static');