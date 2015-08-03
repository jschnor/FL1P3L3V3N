// example of a data model for a section of the site

Class(function HomeModel(_data) {
    
    Inherit(this, Model);
    
    var _self = this;

    function _getSortedData() {
        var _hmsl = [];
        var _orderedData = [];

        for (var i = 0; i < _data.length; i++) {
            if (_data[i].status) {
                // ACTIVE
                // console.log('ACTIVE');
                // console.log(_data[i].status);

                // if (_data[i]['feature_type'])
                // console.log(_data[i]['feature_type']);
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
        _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder); });

        

        for (var j = 0; j < _hmsl.length; j++) {
            // console.log(_data[i].data)
            _orderedData.push(_hmsl[j].data);
        }

        return _orderedData;
    }

    this.getData = function() {
        return _data;
    };

    this.getSortedData = function() {
        return _getSortedData();
    };
});