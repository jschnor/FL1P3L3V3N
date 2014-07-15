;(function ($, window, document, undefined) {
  'use strict';

    var methods = {
        'func1': function () {
            alert("func1 of myPlugin2");
        }
    }

    $.fn.myPlugin2 = function (method) {
        // Method calling logic
        if (methods[method]) {
            
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if ((typeof method === 'object' || !method) && methods.init) {
            
            return methods.init.apply(this, arguments);
        
        } else {
            try {
                
                return $.fn.foundation.apply(this, arguments);

            } catch (e) {
                
                $.error(e);
            
            }
        }

    }
})(jQuery, window, document);