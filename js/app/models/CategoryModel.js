Class(function CategoryModel(data) {

    Inherit(this, Model);
    var self = this;

    // var b = _data.portfolio.slice(0);
    var _data = data;
    var b = _data.slice(0);
    var _ctyp = [];
    var _cnam = [];
    // console.log(b);
    // console.log(data.portfolio);

    (function () {
        _init();
    })();

    function _init() {
        
        for (var i = 0; i < _data.length; i++) {

            if (_ctyp.indexOf( _data[i].category_type ) == -1) {
                _ctyp.push( _data[i].category_type );
            }

            if (_cnam.indexOf( _data[i]['category_type:label'] ) == -1) {
                _cnam.push( _data[i]['category_type:label']);
            }

        }
        // for (var j = 0; j < _data.length; j++)
    }
    this.getOGData = function () {
        // console.log(b);
        return b;
    };
    this.getAllCategoryNames = function() {        
        return _cnam;
    };

    this.getAllCategoryTypes = function() {
        
        return _ctyp;
    }
    this.getCategoryByType = function(cat_type) {

        var _catSet = [];

        for (var i = 0; i < _data.length; i++) {
            // console.log('_data[i].data.length');
            // console.log(_data[i].name);
            // console.log(_data[i]['category_type:label']);

            // console.log(cat_type);
            // console.log(~~_data[i]['category_type']);
            if (_data[i].status.toLowerCase() == 'active') {
                if (~~_data[i]['category_type'] == cat_type) {
                    // console.log('_data[i]')
                    // console.log(_data[i]);
                    if(_catSet.indexOf( _data[i].name ) == -1) {
                        _catSet.push(_data[i]);
                    }
                }
            }
            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            // if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                // return _ctyp[cat_id].name;
            // }
        }
        
        return _catSet;
    };

    this.getCategoryNameByType = function(cat_type) {

        var _catSet = [];

        for (var i = 0; i < _data.length; i++) {
            // console.log('_data[i].data.length');
            // console.log(_data[i].name);
            // console.log(_data[i]['category_type:label']);

            // console.log(cat_type);
            // console.log(~~_data[i]['category_type']);
            if (_data[i].status.toLowerCase() == 'active') {
                if (~~_data[i]['category_type'] == cat_type) {
                    // console.log('_data[i]')
                    // console.log(_data[i]);
                    if(_catSet.indexOf( _data[i].name ) == -1) {
                        _catSet.push(_data[i].name);
                    }
                }
            }
            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            // if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                // return _ctyp[cat_id].name;
            // }
        }
        
        return _catSet;
    }
    // var _allTypes = Data.CATEGORIES.getAllCategoryTypes();
    // var _allNames = Data.CATEGORIES.getAllCategoryNames();

    // for (var i = 0; i < _allTypes.length; i++) {
    //     console.log('Category: length is '+Data.CATEGORIES.getCategoryByType( _allTypes[i] ).length);
    //     console.log(_allNames[i].toUpperCase());

    //     var _cat = Data.CATEGORIES.getCategoryByType( _allTypes[i] );

    //     for (var j = 0; j < _cat.length; j++) {
    //         console.log(_cat[j].name);
    //     }
        
    // }

    this.getCategoryTypeNameByID = function(cat_id) {
        // var __cat = [];

        for (var i = 0; i < _ctyp.length; i++) {

            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                return _ctyp[cat_id].name;
            }
        }
    }

    this.getCategoryTypeIDByName = function(cat_name) {
        // var __cat = [];

        for (var i = 0; i < _ctyp.length; i++) {

            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            if(_ctyp[i].name == cat_name) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[i].id);
                // console.log(_ctyp[i].name);

                return _ctyp[i].id;
            }
        }
    }

    // this.getNext = function (g, f) {
    //     var e = _data.indexOf(g);
    //     e += f;
    //     if (e < 0) {
    //         e = _data.length - 1
    //     }
    //     if (e > _data.length - 1) {
    //         e = 0
    //     }
    //     return _data[e];
    // }
});
