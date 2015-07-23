(function(){

    $.fn.transform = function(propObject){
      var _self = this;

      TweenLite.set(_self.div, {css: propObject});

      return this;
    }
    
})();