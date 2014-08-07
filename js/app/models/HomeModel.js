Class(function HomeModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    (function () {
        init()
    })();

    function init() {
        // console.log('DATA – PagesModel – LENGTH: ' + pagesdata.pages.length);
        // console.log(pagesdata);
        // console.log(referrer)

        // console.log('==================');
        // console.log('HOME DATA');
        // console.log(_data);
        // console.log('==================');

        // for (var f = 0; f < pagesdata.pages.length; f++) {
        //     // var e = data[f];
        //     // console.log(data[f].name);
        //     // console.log(data[f].name.toUpperCase());
            
        //     // p.data[f].name.toUpperCase() = data[f].name
        //     // a = data[f].name;;
            
        //     // p[pagesdata[f].name.toUpperCase()] = new PageModel(pagesdata[f]);
        //     // new PageModel(pagesdata[f]);

        // }  
    }
    function _getSortedData() {
        var _hmsl = [];
        var _orderedData = [];

        for (var i = 0; i < _data.length; i++) {
            if (_data[i].status) {
                // ACTIVE
                // console.log('ACTIVE');
                // console.log(_data[i].status);

                // if (_data[i]['feature_type'])
                // console.log('_data[i]');
                // console.log(_data[i]);
                // console.log(_data[i]['feature_type']);
                switch(_data[i]['feature_type']) {
                    case '1':
                        // console.log('case 0: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.REELS.getWorkByName(_data[i]['reels:label']) });
                    break;
                    case '2':
                        // console.log('case 2: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.WORK.getWorkByName(_data[i]['promos:label']) });
                    break;
                    case '3':
                        // console.log('case 1: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.CASESTUDIES.getWorkByName(_data[i]['case_studies:label']) });
                    break;

                }
                // console.log(Data.WORK.getWorkByName(_data[i]['feature_type:label']))
                // _hmsl.push(Data.WORK.getWorkByName(_data[i]['feature_type:label']));
                
            }
        }
        _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder) });

        

        for (var j = 0; j < _hmsl.length; j++) {
            // console.log(_data[i].data)
            _orderedData.push(_hmsl[j].data);
        }

        return _orderedData;
    }
    // this.getPageDataByName = function(name) {
    //     // console.log(pagesdata.portfolio)
    //     for (var i = 0; i < pagesdata.pages.length; i++) {
    //       if (pagesdata.pages[i].name == name) {
    //         // console.log(this._data.portfolio[i]);
    //         console.log(pagesdata.pages[i].name.toLowerCase());
    //         //
    //         if (pagesdata.pages[i].name.toLowerCase() == 'our work') {
    //             pagesdata.pages[i].portfolio = pagesdata.portfolio;
    //             // pagesdata.pages[i].push({portfolio: pagesdata.portfolio});
    //         }
    //         return pagesdata.pages[i];
    //       }
    //     }
    // }
    this.getData = function() {
        return _data;
    };
    this.getSortedData = function() {

        // return _getSortedData();
        return _data;

    }
    this.getDeep = function (e) {
        console.log('HOME MODEL :: getDeep: e: '+e);
        // console.log(_getSortedData()[0].permalink);
        
        for (var f = 0; f < _getSortedData().length; f++) {
            var _deep = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f].main_categories) : _getSortedData()[f].permalink;
            console.log(_deep);
            if (_deep == e) {
                console.log('_deep: '+_deep);
                return _deep;
            }
        }
        // return e;
    }
    this.getImageByPageDetail = function (_pageState) {
        for (var f = 0; f < _getSortedData().length; f++) {

            var _pgst = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f]._filename.toLowerCase()) : _getSortedData()[f].permalink;

            
            if (_pgst == _pageState) {
                console.log(_pgst);
                console.log(_pageState);
                console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _getSortedData()[f].main_image[0].urlPath;
            }
        }
    }
    this.getNumByPageDetail = function (_pageState) {
        for (var f = 0; f < _getSortedData().length; f++) {

            var _pgst = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f]._filename.toLowerCase()) : _getSortedData()[f].permalink;

            
            if (_pgst == _pageState) {
                // console.log(_pgst);
                // console.log(_pageState);
                // console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _getSortedData()[f].num;
            }
        }
    }
    this.getWorkByNum = function(_num) {
        var _data = _getSortedData();
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].num == _num) {

                return _data[f];
            }
        }

    }
    this.getDetail = function (e) {
        console.log('HOME MODEL :: getDeep: e: '+e);
        // for (var f = 0; f < data.length; f++) {
        //     if (data[f].permalink == e) {
        //         // console.log(c[f]);
        //         return data[f].permalink;
        //     }
        // }
        // console.log('++++++++++++++++++++++++++++');
        // console.log('WORK MODEL');
        // console.log('e');
        // console.log(e);
        // // console.log(_data);
        // console.log('++++++++++++++++++++++++++++');
        // var _prma = !Data.WORK.getWorkByNum(_detailIndex).permalink ? Data.WORK.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.WORK.getWorkByNum(_detailIndex).permalink;
        // var _ctgy = !Data.STATE.category ? Utils.urlstr(Data.WORK.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

        for (var f = 0; f < _getSortedData().length; f++) {
            // var _deep = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f].main_categories) : _getSortedData()[f].permalink;
            var _deep = Utils.urlstr(_getSortedData()[f]._filename);
            console.log(_deep);
            if (_deep == e) {
                console.log('_deep: '+_deep);
                return _deep;
            }
        }
    };
});