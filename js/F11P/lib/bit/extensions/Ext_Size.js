(function(){
      $.fn.size = function(width, height) {

            var _self = this;
            var _width;
            var _height;
            
            // console.log('SIZE :: div: '+_self.div);
            // console.log(_self);
            // console.log(_self.div);

            if (typeof width == 'string') {

                  if (width.slice(-1) == '%') {

                        _width      = width;
                        _height     = !height ? width : height;

                  } else {
                        
                        _width      = Utils.convertToPx(width) ;
                        _height     = !height ? Utils.convertToPx(width) : Utils.convertToPx(height);

                  }

            } else {

                  _width            = Utils.convertToPx(width);
                  _height           = !height ? Utils.convertToPx(width) : Utils.convertToPx(height);

            }

            _self.div.style.width   = _width;
            _self.div.style.height  = _height;
            

            return _self;

      };
})();