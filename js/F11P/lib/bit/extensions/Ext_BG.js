(function(){
    $.fn.bg = function(background) {
        var _self = this;

        if (!background){
            background = '#ffffff';
        }
        
        var _bg = background;
        var _ext = _bg.slice(-4);

        var _isImage = _ext.substring(1, -1) == '.' ? true : false;

        if (_isImage) {
            _self.div.style.backgroundImage = 'url(' + _bg + ')';

        } else {
              _self.div.style.backgroundColor = background;
        }
        
        return _self;
    };
})();