(function(){

    $.fn.css = function(propObject){
        var _self = this;

        // patches
        if (propObject.hasOwnProperty('backgroundSize')){
        	propObject['background-size'] = propObject.backgroundSize;
        	delete propObject.backgroundSize;
        }

        TweenLite.set(_self.div, propObject);

        return this;
    };
    
})();