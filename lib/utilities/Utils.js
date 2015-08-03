Class(function Utils() {
	
	var _self = this;

	this.lerp = function(ratio, start, end) {
		return start + (end - start) * ratio;
	};
	
	this.rand = function(min, max) {
		return this.lerp(Math.random(), min, max);
	};
	
	this.doRandom = function (min, max) {
		return Math.round(this.rand(min - 0.5, max + 0.5));
	};
	
	this.timestamp = function () {
		var _timestamp = Date.now() + _self.doRandom(0, 99999);
		return _timestamp.toString();
	};

	this.convertToPX = this.convertToPx = function(number) {
		var _pixelvalue;

		if (typeof number == 'string' && number.slice(-2) != 'px') {
			_pixelvalue = number + 'px';
		}

		if (typeof number == 'string' && number.slice(-2) != 'px') {
			_pixelvalue = number;
		}
		
		if (typeof number != 'string') {
			_pixelvalue = number + 'px';
		}

		return _pixelvalue;
	};

	this.convertToDeg = function(number) {
		var _degreevalue;

		if (typeof number == 'string' && number.slice(-3) != 'deg') {
			_degreevalue = number + 'deg';
		}

		if (typeof number == 'string' && number.slice(-3) != 'deg') {
			_degreevalue = number;
		}
		
		if (typeof number != 'string') {
			_degreevalue = number + 'deg';
		}

		return _degreevalue;
	};

	this.nullObject = function(obj) {
		if (obj.destroy) {
			for (var f in obj) {
				if (typeof obj[f] !== "undefined") {
					obj[f] = null;
				}
			}
		}
		return null;
	};

	this.ucfirst = this.capFirstLetter = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	this.permalink = function(str){
        return str.replace(/'/gi, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
    };

	this.urlstr = function(string){
		var str = string.replace(/ /g, "-").toLowerCase();
		var _str = str.replace(/:/g, "");

		return _str;
	};

	// @param string filter  name of the CSS3 filter function
	// @param mixed value  value to apply (certain values are converted to percentage or pixels)
	// @param boolean render  if true, returns a CSS3 filter string, else returns an object containing function name and value
	// @param boolean units  if true, applies units to value, converting it to a string
	this.sanitizeFilter = function(filter, value, render, units){
		switch (filter){
            case 'grayscale':
            case 'sepia':
            case 'invert':
            case 'opacity':
            // only positive percentage values between 0 and 100 are allowed
            if (typeof value == 'string'){
                value = parseInt(value.replace(/\D/g,''));
            }
            value = Math.abs(value);
            if (value > 100){ value = 100 }

            if (units === true){
            	value += '%';
            }
            break;

            case 'saturate':
            case 'brightness':
            case 'contrast':
            // only positive percentage values are allowed
            if (typeof value == 'string'){
                value = parseInt(value.replace(/\D/g,''));
            }
            value = Math.abs(value);

            if (units === true){
            	value += '%';
            }
            break;

            case 'blur':
            // only positive pixel values are allowed
            if (typeof value == 'string'){
                value = parseInt(value.replace(/\D/g,''));
            }
            value = Math.abs(value);

            if (units === true){
            	value += 'px';
            }
            break;

            case 'hue-rotate':
            case 'drop-shadow':
            case 'url':
            default:
            // input is used unchanged
            break;
        }

        if (render === true){
        	return filter+'('+value+')';
        }else{
        	return {filter: filter, value: value};
        }
	};

}, 'static');