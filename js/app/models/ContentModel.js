Class(function ContentModel(_data) {
    Inherit(this, Model);
    var self = this;

    // var b = _data.portfolio.slice(0);
    var b = _data.slice(0);
    // console.log(b);
    // console.log(data.portfolio);

    (function () {
        _init();
    })();

    function _init() {
        // console.log('DATA WorkModel – LENGTH: '+ data.portfolio.length);
        // console.log(_data);
        // console.log(_data);

        // for (var f = 0; f < _data.portfolio.length; f++) {

        //     var e = _data.portfolio[f];

        //     // console.log(e.name);
        //     for (var i = 0; i < _data.portfolio[f].main_image.length; i++) {
                
        //         // console.log(e.main_image[i].urlPath);
        //         // console.log('e.main_image[i].urlPath');
        //         // console.log(e.main_image.splice(i, 1));
        //         // e.main_image.splice(i, 1);
        //         // c.splice(f, 1)

        //     }
        //     // console.log(e.name);
        //     // if (!e.media.length) {
        //     //     c.splice(f, 1)
        //     // }
        //     // data.portfolio.splice(f, 1);
        //     // console.log('DATA SPLICE');
        //     // console.log(data.splice(f, 1));

        // }
        // return _data;
        // for (var f = 0; f < c.length; f++) {
        //     var e = c[f];
        //     if (!e.media.length) {
        //         c.splice(f, 1)
        //     }
        // }
    }
    this.getOGData = function () {
        // console.log(b);
        return b;
    };
    this.getData = function() {
        return _data;
    };
    this.getImages = function() {
        var images = [];

        for (var f = 0; f < _data.length; f++) {

            // var e = _data[f];

            // console.log(e.name);
            for (var i = 0; i < _data[f].main_image.length; i++) {
                
                if (_data[f].main_image[0].urlPath) {
                    images.push(_data[f].main_image[i].urlPath);
                }
                // images.push(FEDevice.getAsset( e.main_image[i].urlPath, "jpg" ));

            }
        }

        return images;
    };
    this.getDeep = function (e) {
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

        for (var f = 0; f < _data.length; f++) {

            if (_data[f].main_categories.toLowerCase() == e) {

                return Utils.urlstr(_data[f].main_categories.toLowerCase());
            }
        }
    };

    this.getDetail = function (e) {
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

        var _detailLink;

        for (var f = 0; f < _data.length; f++) {


            if (_data[f].permalink == e || Utils.urlstr(_data[f]._filename.toLowerCase()) == e) {

                return _detailLink;
            
            }

        }
    };

    // Not implemented
    // this.getDeepCategory = function (e) {

    //     for (var f = 0; f < _data.length; f++) {
            
    //         if (_data[f].main_categories.toLowerCase() == e) {

    //             console.log(_data[f].main_categories.toLowerCase);
    //             console.log(e);
    //             // console.log(_data[f]);
    //             return _data[f].main_categories.toLowerCase();
    //         }
    //     }
    // };

    this.getWorkByName = function(name) {
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].name == name) {

                return _data[f];
            }
        }
    }

    this.getWorkByNum = function(_num) {
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].num == _num) {

                return _data[f];
            }
        }
    }

    this.getImageByPageDetail = function (pageStateDetail) {
        console.log('REEL MODEL :: pageStateDetail: '+pageStateDetail)
        for (var f = 0; f < _data.length; f++) {

            var _pgst = !_data[f].permalink ? Utils.urlstr(_data[f]._filename.toLowerCase()) : _data[f].permalink;

            
            if (_pgst == pageStateDetail) {
                console.log(_pgst);
                console.log(pageStateDetail);
                console.log(_data[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _data[f].main_image[0].urlPath;
            }
        }
    }

    this.getNumByPageDetail = function (pageStateDetail) {
        for (var f = 0; f < _data.length; f++) {

            var _pgst = !_data[f].permalink ? Utils.urlstr(_data[f]._filename.toLowerCase()) : _data[f].permalink;

            
            if (_pgst == pageStateDetail) {
                // console.log(_pgst);
                // console.log(_pageState);
                // console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _data[f].num;
            }
        }
    }
    this.getImageByFilename = function() {

    }
    this.getNext = function (g, f) {
        var e = _data.indexOf(g);
        e += f;
        if (e < 0) {
            e = _data.length - 1
        }
        if (e > _data.length - 1) {
            e = 0
        }
        return _data[e];
    }
});
