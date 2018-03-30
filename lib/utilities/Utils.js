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

  // make first letter of a string uppercase
  this.ucfirst = this.capFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // make a URL string into a permalink-style string
  this.permalink = function(str){
      return str.replace(/'/gi, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
  };

  this.urlstr = function(string){
    var str = string.replace(/ /g, "-").toLowerCase();
    var _str = str.replace(/:/g, "");

    return _str;
  };

  // parseURI 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License
  this.parseURI = function(str){
    var o = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    },
    m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
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

  this.getCssPrefix = function(){
      var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];

      // Create a temporary DOM object for testing
      var _testDiv = document.createElement('div');

      for (var i = 0; i < prefixes.length; i++){
          // Attempt to set the style
          _testDiv.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

          // Detect if the style was successfully set
          if (_testDiv.style.background){
              _testDiv = null;
              delete _testDiv;
              return prefixes[i]; // return the first one that works so we can default to W3C version if possible
          }
      }

      return '';
  };

  this.randColor = function(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
  };

  this.randRGBA = function(_alpha){
      if (typeof _alpha == 'undefined'){
          _alpha = 1;
      }
      return 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+_alpha+')';
  };

  // NaN test polyfill
  Number.isNaN = Number.isNaN || function(value) {     
    return value !== value;
  }

  this.formatDate = function(format, timestamp) {
      //  discuss at: http://phpjs.org/functions/date/
      // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
      // original by: gettimeofday
      //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: MeEtc (http://yass.meetcweb.com)
      // improved by: Brad Touesnard
      // improved by: Tim Wiel
      // improved by: Bryan Elliott
      // improved by: David Randall
      // improved by: Theriault
      // improved by: Theriault
      // improved by: Brett Zamir (http://brett-zamir.me)
      // improved by: Theriault
      // improved by: Thomas Beaucourt (http://www.webapp.fr)
      // improved by: JT
      // improved by: Theriault
      // improved by: Rafał Kukawski (http://blog.kukawski.pl)
      // improved by: Theriault
      //    input by: Brett Zamir (http://brett-zamir.me)
      //    input by: majak
      //    input by: Alex
      //    input by: Martin
      //    input by: Alex Wilson
      //    input by: Haravikk
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: majak
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Brett Zamir (http://brett-zamir.me)
      // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
      // bugfixed by: Chris (http://www.devotis.nl/)
      //        note: Uses global: php_js to store the default timezone
      //        note: Although the function potentially allows timezone info (see notes), it currently does not set
      //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
      //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
      //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
      //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
      //   returns 1: '09:09:40 m is month'
      //   example 2: date('F j, Y, g:i a', 1062462400);
      //   returns 2: 'September 2, 2003, 2:26 am'
      //   example 3: date('Y W o', 1062462400);
      //   returns 3: '2003 36 2003'
      //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
      //   example 4: (x+'').length == 10 // 2009 01 09
      //   returns 4: true
      //   example 5: date('W', 1104534000);
      //   returns 5: '53'
      //   example 6: date('B t', 1104534000);
      //   returns 6: '999 31'
      //   example 7: date('W U', 1293750000.82); // 2010-12-31
      //   returns 7: '52 1293750000'
      //   example 8: date('W', 1293836400); // 2011-01-01
      //   returns 8: '52'
      //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
      //   returns 9: '52 2011-01-02'

      var that = this;
      var jsdate, f;
      // Keep this here (works, but for code commented-out below for file size reasons)
      // var tal= [];
      var txt_words = [
      'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
      ];
      // trailing backslash -> (dropped)
      // a backslash followed by any character (including backslash) -> the character
      // empty string -> empty string
      var formatChr = /\\?(.?)/gi;
      var formatChrCb = function(t, s) {
      return f[t] ? f[t]() : s;
      };
      var _pad = function(n, c) {
      n = String(n);
      while (n.length < c) {
        n = '0' + n;
      }
      return n;
      };
      f = {
      // Day
      d : function() {
        // Day of month w/leading 0; 01..31
        return _pad(f.j(), 2);
      },
      D : function() {
        // Shorthand day name; Mon...Sun
        return f.l()
          .slice(0, 3);
      },
      j : function() {
        // Day of month; 1..31
        return jsdate.getDate();
      },
      l : function() {
        // Full day name; Monday...Sunday
        return txt_words[f.w()] + 'day';
      },
      N : function() {
        // ISO-8601 day of week; 1[Mon]..7[Sun]
        return f.w() || 7;
      },
      S : function() {
        // Ordinal suffix for day of month; st, nd, rd, th
        var j = f.j();
        var i = j % 10;
        if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
          i = 0;
        }
        return ['st', 'nd', 'rd'][i - 1] || 'th';
      },
      w : function() {
        // Day of week; 0[Sun]..6[Sat]
        return jsdate.getDay();
      },
      z : function() {
        // Day of year; 0..365
        var a = new Date(f.Y(), f.n() - 1, f.j());
        var b = new Date(f.Y(), 0, 1);
        return Math.round((a - b) / 864e5);
      },

      // Week
      W : function() {
        // ISO-8601 week number
        var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
        var b = new Date(a.getFullYear(), 0, 4);
        return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
      },

      // Month
      F : function() {
        // Full month name; January...December
        return txt_words[6 + f.n()];
      },
      m : function() {
        // Month w/leading 0; 01...12
        return _pad(f.n(), 2);
      },
      M : function() {
        // Shorthand month name; Jan...Dec
        return f.F()
          .slice(0, 3);
      },
      n : function() {
        // Month; 1...12
        return jsdate.getMonth() + 1;
      },
      t : function() {
        // Days in month; 28...31
        return (new Date(f.Y(), f.n(), 0))
          .getDate();
      },

      // Year
      L : function() {
        // Is leap year?; 0 or 1
        var j = f.Y();
        return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
      },
      o : function() {
        // ISO-8601 year
        var n = f.n();
        var W = f.W();
        var Y = f.Y();
        return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
      },
      Y : function() {
        // Full year; e.g. 1980...2010
        return jsdate.getFullYear();
      },
      y : function() {
        // Last two digits of year; 00...99
        return f.Y()
          .toString()
          .slice(-2);
      },

      // Time
      a : function() {
        // am or pm
        return jsdate.getHours() > 11 ? 'pm' : 'am';
      },
      A : function() {
        // AM or PM
        return f.a()
          .toUpperCase();
      },
      B : function() {
        // Swatch Internet time; 000..999
        var H = jsdate.getUTCHours() * 36e2;
        // Hours
        var i = jsdate.getUTCMinutes() * 60;
        // Minutes
        // Seconds
        var s = jsdate.getUTCSeconds();
        return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
      },
      g : function() {
        // 12-Hours; 1..12
        return f.G() % 12 || 12;
      },
      G : function() {
        // 24-Hours; 0..23
        return jsdate.getHours();
      },
      h : function() {
        // 12-Hours w/leading 0; 01..12
        return _pad(f.g(), 2);
      },
      H : function() {
        // 24-Hours w/leading 0; 00..23
        return _pad(f.G(), 2);
      },
      i : function() {
        // Minutes w/leading 0; 00..59
        return _pad(jsdate.getMinutes(), 2);
      },
      s : function() {
        // Seconds w/leading 0; 00..59
        return _pad(jsdate.getSeconds(), 2);
      },
      u : function() {
        // Microseconds; 000000-999000
        return _pad(jsdate.getMilliseconds() * 1000, 6);
      },

      // Timezone
      e : function() {
        // Timezone identifier; e.g. Atlantic/Azores, ...
        // The following works, but requires inclusion of the very large
        // timezone_abbreviations_list() function.
        /*              return that.date_default_timezone_get();
         */
        throw 'Not supported (see source code of date() for timezone on how to add support)';
      },
      I : function() {
        // DST observed?; 0 or 1
        // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
        // If they are not equal, then DST is observed.
        var a = new Date(f.Y(), 0);
        // Jan 1
        var c = Date.UTC(f.Y(), 0);
        // Jan 1 UTC
        var b = new Date(f.Y(), 6);
        // Jul 1
        // Jul 1 UTC
        var d = Date.UTC(f.Y(), 6);
        return ((a - c) !== (b - d)) ? 1 : 0;
      },
      O : function() {
        // Difference to GMT in hour format; e.g. +0200
        var tzo = jsdate.getTimezoneOffset();
        var a = Math.abs(tzo);
        return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
      },
      P : function() {
        // Difference to GMT w/colon; e.g. +02:00
        var O = f.O();
        return (O.substr(0, 3) + ':' + O.substr(3, 2));
      },
      T : function() {
        // Timezone abbreviation; e.g. EST, MDT, ...
        // The following works, but requires inclusion of the very
        // large timezone_abbreviations_list() function.
        /*              var abbr, i, os, _default;
        if (!tal.length) {
          tal = that.timezone_abbreviations_list();
        }
        if (that.php_js && that.php_js.default_timezone) {
          _default = that.php_js.default_timezone;
          for (abbr in tal) {
            for (i = 0; i < tal[abbr].length; i++) {
              if (tal[abbr][i].timezone_id === _default) {
                return abbr.toUpperCase();
              }
            }
          }
        }
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            os = -jsdate.getTimezoneOffset() * 60;
            if (tal[abbr][i].offset === os) {
              return abbr.toUpperCase();
            }
          }
        }
        */
        return 'UTC';
      },
      Z : function() {
        // Timezone offset in seconds (-43200...50400)
        return -jsdate.getTimezoneOffset() * 60;
      },

      // Full Date/Time
      c : function() {
        // ISO-8601 date.
        return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
      },
      r : function() {
        // RFC 2822
        return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
      },
      U : function() {
        // Seconds since UNIX epoch
        return jsdate / 1000 | 0;
      }
      };
      this.date = function(format, timestamp) {
      that = this;
      jsdate = (timestamp === undefined ? new Date() : // Not provided
        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
      );
      return format.replace(formatChr, formatChrCb);
      };
      return this.date(format, timestamp);
  };

  this.trim = function(str, charlist) {
    //  discuss at: http://phpjs.org/functions/trim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: mdsjack (http://www.mdsjack.bo.it)
    // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // improved by: Jack
    //    input by: Erkekjetter
    //    input by: DxGx
    // bugfixed by: Onno Marsman
    //   example 1: trim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: trim('Hello World', 'Hdle');
    //   returns 2: 'o Wor'
    //   example 3: trim(16, 1);
    //   returns 3: 6

    var whitespace, l = 0,
    i = 0;
    str += '';

    if (!charlist) {
      // default list
      whitespace =
      ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
      // preg_quote custom list
      charlist += '';
      whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
      if (whitespace.indexOf(str.charAt(i)) === -1) {
        str = str.substring(i);
        break;
      }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
      if (whitespace.indexOf(str.charAt(i)) === -1) {
        str = str.substring(0, i + 1);
        break;
      }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
  };

  this.rtrim = function(str, charlist) {
    //  discuss at: http://phpjs.org/functions/rtrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    //    input by: rem
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rtrim('    Kevin van Zonneveld    ');
    //   returns 1: '    Kevin van Zonneveld'

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
      .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '')
      .replace(re, '');
  };

  this.ltrim = function(str, charlist) {
    //  discuss at: http://phpjs.org/functions/ltrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //   example 1: ltrim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld    '

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
      .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '')
      .replace(re, '');
  };

  // convert Hex color to RGB color
  this.hexToRGB = function(hex, makeString = false){
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (makeString === false){
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }else{
      return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
    }
  };

  // convert RGB color to Hex
  // you can pass a comma-separated RGB string to the first argument (r)
  this.RGBToHex = function(r,g,b){
    if (typeof r == 'string' && !g && !b){
      var rgb = r.split(',');
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    }
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

}, 'static');