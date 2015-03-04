(function(){
    $.fn.setZ = function(zindex) {
        var _self = this;

        _self.div.style.zIndex = zindex;
    	
    	return this;
    };
})();