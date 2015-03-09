Static(function Utils() {
	
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

	this.urlstr = function(string){
		var str = string.replace(/ /g, "-").toLowerCase();
		var _str = str.replace(/:/g, "");

		return _str;
	};

});