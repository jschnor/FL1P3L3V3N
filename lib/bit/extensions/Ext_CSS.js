(function(){

    $.fn.css = function(propObject){
        var _self = this;

        TweenLite.set(_self.div, {css: propObject});

        return this;
    };
    
})();