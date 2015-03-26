(function(){
    /**
     * filter - Apply a CSS3 filter to an element
     * 
     * @param object properties  an object where properties are function names and values are function arguments.
     *
     * for example:
     * _elem.filter({
     *    grayscale: '100%',
     *    contrast: '150%'
     * });
     *
     * NOTE: order is important with multiple effect; a different order will produce a different result
     *
     */
    $.fn.filter = function(properties) {

        var _functions = [];

        // build the css string of functions
        for (var property in properties){
            if (properties.hasOwnProperty(property)){
                _functions.push(property+'('+properties[property]+')');
            }
        }

        var _css = _functions.join(' ');

        // set property based on browser
        if (Device.browser.chrome || Device.browser.safari){
            this.setProps({
                webkitFilter: _css
            });
        }

        if (Device.browser.firefox){
            this.setProps({
                filter: _css
            });
        }

        // IE sux

        return this;
    };
})();