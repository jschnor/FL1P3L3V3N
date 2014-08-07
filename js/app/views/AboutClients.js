Class(function AboutClients(bgDiff){
    Inherit(this, View);

    var _self = this, _bgDiff = bgDiff, _elem, _bg, _data, _title;
    this.width = 0;

    var _padding = 80;
    var _square = 100;
    if (Stage.height < 700){
        _padding = Stage.height * 0.114;
        _square = Stage.height * 0.143;
    }
    var _maxcontentwidth;
    var _clients = [];

    (function () {
		_init();
        _addBg();
		_addTitle();
		_addClients();
    })();

    function _init(){
    	//console.log("AboutClients _init");
    	_data = Data.ABOUT.getData();
        _data = _data[0];

        // width of this element will be based on number of clients divided by 3 rows
        var three = Math.ceil(_data.clients.length/3);
        _self.width = (three * (_square + _padding)) + _padding + 300;
        _maxcontentwidth = _self.width - (_padding*2);

    	_elem = _self.element;
    	_elem.size(_self.width, Stage.height).bg(Config.COLORS.black).transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            outline: "1px solid transparent"
        });
    }

    function _addBg(){
        _bg = _elem.create(".bg");
        _bg.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW
        }).css({
            opacity: 0.9
        });

        _bg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        _bg.add(_bg.canvas);
        _bg.texture = new Image();
        _bg.texture.src = FEDevice.getAsset(Config.IMAGES + "about/bg-clients.jpg", "jpg");

        _bg.texture.onload = function(){
            _bg.canvas.context.drawImage(_bg.texture, 0, 0);
            _positionBackground();
        };

        /*_halftone = _bg.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").css({
            backgroundSize: "4px 4px"
        });*/
    }

    function _positionBackground(){
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height){
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        _bg.canvas.size(_wdth, _hght);
        _bg.canvas.context.drawImage(_bg.texture, 0, 0, _wdth, _hght);

        _bg.css({
            top: Stage.height / 2 - _hght / 2,
            left: FEDevice.width / 2 - _wdth / 2 - _bgDiff
        }).transform({
            y: 0
        });
    }

    function _addTitle(){
    	_title = _elem.create(".title");
        var fontsize = 60;
        var bottom = 480;
        if (Stage.height < 700){
            fontsize = Stage.height*0.085;
            bottom = Stage.height*0.685;
        }
        _title.fontStyle("LeagueGothic", fontsize, Config.COLORS.white);
        _title.size(_maxcontentwidth, "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            left: _padding,
            bottom: bottom
        });

        _title.text("CLIENTS");
    }

    function _addClients(){
    	var row = 1;
    	var rowimg = 1;
    	var three = Math.ceil(_data.clients.length/3);
    	var left = ((_square + (_square*0.8))*(rowimg-1)) + _padding;

    	for (var i in _data.clients){
            var bottom = (_square + (_padding/2))*2;
            if (Stage.height >= 700){
                bottom += 60;
            }else{
                bottom += (Stage.height*0.085);
            }
            
            if (rowimg == three+1){
                rowimg = 1;
                row++;
            }

    		switch(row){
    			case 2:
    			bottom = bottom - (_square + (_padding/2));
    			break;

    			case 3:
    			bottom = bottom - ((_square + (_padding/2))*2);
    			break;
    		}

    		left = ((_square + (_square*0.8))*(rowimg-1)) + _padding;

    		var clientitem = _self.initClass(ClientLogo, i, _data.clients[i].urlPath, left, bottom, rowimg, row);
    		_clients.push(clientitem);

    		rowimg++;
    	}
    }

    this.positionX = function(x_pos){
        _elem.x = this.x = ~~x_pos;
        _elem.transform();
    };

    // resize the element by width for vertical slices
    this.resize = function(bgDiff_resize) {
        _bgDiff = bgDiff_resize;
        if (Stage.height < 700){
            _padding = Stage.height * 0.114;
            _square = Stage.height * 0.143;
        }else{
            _padding = 80;
            _square = 100;
        }

        var row = 1;
        var rowimg = 1;
        var three = Math.ceil(_data.clients.length/3);
        var left = ((_square + (_square*0.8))*(rowimg-1)) + _padding;

        _self.width = (three * (_square + _padding)) + _padding + 300;
        _maxcontentwidth = _self.width - (_padding*2);

        if (Stage.height < 700){
            _title.size(_maxcontentwidth, "auto").css({
                fontSize: Stage.height*0.085,
                bottom: Stage.height*0.685,
                left: _padding
            });
        }else{
            _title.size(_maxcontentwidth, "auto").css({
                fontSize: 60,
                bottom: 480,
                left: _padding
            });
        }

        _elem.size(_self.width, Stage.height);
        _positionBackground();

        for (var i in _clients){
            var bottom = (_square + (_padding/2))*2;
            if (Stage.height >= 700){
                bottom += 60;
            }else{
                bottom += (Stage.height*0.085);
            }
            
            if (rowimg == three+1){
                rowimg = 1;
                row++;
            }

            switch(row){
                case 2:
                bottom = bottom - (_square + (_padding/2));
                break;

                case 3:
                bottom = bottom - ((_square + (_padding/2))*2);
                break;
            }

            left = ((_square + (_square*0.8))*(rowimg-1)) + _padding;

            _clients[i].resize(_square, left, bottom, rowimg, row);

            /*var clientitem = _self.initClass(ClientLogo, i, _data.clients[i].urlPath, left, bottom, rowimg, row);
            _clients.push(clientitem);*/

            rowimg++;
        }
    };

    // call in anim loop to fix background position
    this.moveBG = function(vec){
        _bg.x = -vec;
        _bg.x.toFixed(4);
        _bg.transform();
    };

    this.disable = function (){
        
    };
});