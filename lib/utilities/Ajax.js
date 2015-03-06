Static(function Ajax() {
	
	var _self = this;

	this.get = function(url, params, callback) {
		var _url = '/response.php';
		if (typeof url == 'string'){
			_url = url;
		}

		if (typeof params == 'object'){
			var query = '?';
			var parts = [];

			for (var key in params){
				if (params.hasOwnProperty(key)){
					parts.push(key + '=' + encodeURIComponent(params[key]));
				}
			}

			query += parts.join('&');
			_url += query;
		}

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 ) {
				if (xhr.status == 200){
					// OK
					if (typeof callback == 'function'){
						callback(xhr.responseText);
					}

				} else if(xhr.status == 400) {
					throw Error('400');
				} else {
					throw Error('AJAX Request failed');
				}
			}
		}

		xhr.open('GET', _url, true);
		xhr.send();
	};


	// TODO: write support for post method
	this.post = function(){
		console.log('POST not supported yet');
	};

});