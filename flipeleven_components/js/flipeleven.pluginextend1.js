;(function ($, window, document, undefined) {
  'use strict';

    var methods = {
        init: function (options) {
            alert("here from plugin1");
        },
        func1: function () {
            alert("func1 from plugin1");
        },
        func2: function () {
            alert("func2");
        }
    };

    $.fn.myPlugin = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }

    };

})(jQuery, window, document);