(function(){
    /**
     * filter - Apply a CSS3 filter to an element
     * 
     * @param object properties  an object where properties are function names and values are function arguments.
     *
     * for example:
     * _elem.filter({
     *    grayscale: 100,
     *    contrast: 150
     * });
     *
     * Values are converted to percentages if necessary.
     *
     * NOTE: order is important with multiple effects; a different order will produce a different result
     *
     */
    $.fn.filter = function(properties){
        var _functions = [];

        // build the css string of functions
        for (var property in properties){
            if (properties.hasOwnProperty(property)){
                // correct the value based on which kind of filter is used
                _functions.push(Utils.sanitizeFilter(property, properties[property], true, true));
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

    $.fn.tweenfilter = function(properties, duration, easing) {
        var _self = this;

        // get current filter values
        var _filterCSS, _currentFilters = {};

        if (Device.browser.chrome || Device.browser.safari){
            _filterCSS = _self.div.style.webkitFilter;
        }

        if (Device.browser.firefox){
            _filterCSS = _self.div.style.filter;
        }

        var filters = _filterCSS.split(' ');
        for (var idx = 0; idx < filters.length; idx++){
            // split filter into function name and value
            var filter = filters[idx].replace(')', '');
            var split = filter.split('(');
            var property = split[0], value = split[1];

            var filter = Utils.sanitizeFilter(property, value, false, false);
            
            // build object of current filters
            _currentFilters[filter.filter] = filter.value;
        }

        // set any new properties to zero
        for (var attr in properties){
            if (!_currentFilters.hasOwnProperty(attr)){
                _currentFilters[attr] = 0;
            }
        }

        TweenMax.to(_self.div, duration, {
            ease: easing,

            onUpdate: function(tl){
                // convert timeline progress to a percentage, then normalize
                var _p = Math.round(tl.progress()*100)/100;
                var _functions = [];

                // build the css string of functions
                for (var attr in properties){
                    // find differences between current filter value and desired filter value so we know what to tween and how much
                    // multiply by current progress to find tween value
                    var _diff = (properties[attr] - _currentFilters[attr])*_p;
                    var _tweenval = _currentFilters[attr] + _diff;
                    _functions.push(Utils.sanitizeFilter(attr, _tweenval, true, true));
                }

                // add any functions that aren't being tweened
                for (var attr in _currentFilters){
                    if (!properties.hasOwnProperty(attr)){
                        _functions.push(Utils.sanitizeFilter(attr, _currentFilters[attr], true, true));
                    }
                }

                var _css = _functions.join(' ');

                // set property based on browser
                if (Device.browser.chrome || Device.browser.safari){
                    _self.setProps({
                        webkitFilter: _css
                    });
                }

                if (Device.browser.firefox){
                    _self.setProps({
                        filter: _css
                    });
                }

                // IE sux
            },
            
            onUpdateParams: ["{self}"] // references the tweens timeline
        });

        return _self;
    };
})();