Class(function AboutTeam(bgDiff){
    Inherit(this, View);

    var _self = this, _bgDiff = bgDiff, _elem, _bg, _team, _title, _teamsize, _teampadding;
    this.width = 0;

    var _padding = 80, _teamsize = 225;
    
    if (Stage.height < 700){
        _padding = Stage.height * 0.114;
        _teamsize = Stage.height * 0.321;
    }

    var _teampadding = _teamsize*0.177;
    var _maxcontentwidth;
    var _teamMembers = [];

    (function () {
		_init();
        _addBg();
		_addTitle();
		_addTeam();
    })();

    function _init(){
    	//console.log("AboutTeam _init");
    	_team = Data.ABOUT.getTeam();
    	// width of each team member square is 225
    	// margin after each is 40
    	// left and right padding on element is 80

        
    	_self.width = (_team.length * (_teamsize + _teampadding)) + (_padding*2) - _teampadding;
        _maxcontentwidth = _self.width - (_padding*2);

    	_elem = _self.element;
    	_elem.size(_self.width, Stage.height).bg(Config.COLORS.black).transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            outline: "1px solid transparent"
        });

        //console.log(_team);
    }

    function _addBg(){
        _bg = _elem.create(".bg");
        _bg.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW
        }).css({
            opacity: 0.75
        });

        _bg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        _bg.add(_bg.canvas);
        _bg.texture = new Image();
        _bg.texture.src = FEDevice.getAsset(Config.IMAGES + "about/bg-team.jpg", "jpg");

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
        var bottom = 430;
        if (Stage.height < 700){
            fontsize = Stage.height*0.085;
            bottom = Stage.height*0.614;
        }

        _title.fontStyle("LeagueGothic", fontsize, Config.COLORS.white);
        _title.size(_maxcontentwidth, "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            left: _padding,
            bottom: bottom
        });

        _title.text("THE TEAM");
    }

    function _addTeam(){
    	for (var i in _team){
    		// NOW THERE IS AN i IN TEAM!
    		var _teamitem = _self.initClass(TeamMember, i, _teamsize, _padding);
    		_teamMembers.push(_teamitem);
    	}
    }

    this.positionX = function(x_pos){
        _elem.x = this.x = ~~x_pos;
        _elem.transform();
    };

    this.resize = function(bgDiff_resize) {
        _bgDiff = bgDiff_resize;
    	_padding = 80, _teamsize = 225;
    
        if (Stage.height < 700){
            _padding = Stage.height * 0.114;
            _teamsize = Stage.height * 0.321;
        }

        var _teampadding = _teamsize*0.177;

        _self.width = (_team.length * (_teamsize + _teampadding)) + (_padding*2) - _teampadding;
        _maxcontentwidth = _self.width - (_padding*2);

        if (Stage.height < 700){
            _title.size(_maxcontentwidth, "auto").css({
                fontSize: Stage.height*0.085,
                bottom: Stage.height*0.614,
                left: _padding
            });
        }else{
            _title.size(_maxcontentwidth, "auto").css({
                fontSize: 60,
                bottom: 430,
                left: _padding
            });
        }

        _elem.size(_self.width, Stage.height);
        _positionBackground();

        for (var i in _teamMembers){
            _teamMembers[i].resize(i, _teamsize, _padding);
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