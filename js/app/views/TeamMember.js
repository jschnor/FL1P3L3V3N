Class(function TeamMember(index, square, padding){
    Inherit(this, View);

    var _self = this, _elem, _data, _name, _info;

    var _left = ((square + (square*0.177))*index) + padding;

    if (index == 0){
        _left = padding;
    }

    (function () {
		_init();
        _addName();
        _addInfo();
        _initInteract();
    })();

    function _init(){
        _team = Data.ABOUT.getTeam();
        _data = _team[index];

        _elem = _self.element;

        var bottom = 135;
        if (Stage.height < 700){
            bottom = Stage.height * 0.193;
        }

        _elem.size(square, square).css({
            left: _left,
            bottom: bottom
        });
    }

    function _addName(){
        _name = _elem.create(".name");
        var fontsize = 14;
        if (Stage.height < 700){
            fontsize = Stage.height * 0.02;
        }

        if (fontsize < 9){
            fontsize = 9;
        }
        _name.fontStyle("OpenSansBold", fontsize, Config.COLORS.white);
        _name.css({
            bottom: square + (fontsize*0.75),
            lineHeight: fontsize
        });

        _name.text(_data.info1.toUpperCase());
    }

    function _addInfo(){
        _info = _self.initClass(TeamMemberInfo, index, square);
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(mouseevent) {
        switch (mouseevent.action) {
            case "over":
                _info.over();
                break;
            case "out":
                _info.out();
                break
        }
    }

    function _clickActions() {
        _info.click();
    }

    // scale and reposition
    this.resize = function(index_resize, square_resize, padding_resize) {
        // recalc spacing and size
       _left = ((square_resize + (square_resize*0.177))*index_resize) + padding_resize;

       var bottom = 135;
        if (Stage.height < 700){
            bottom = Stage.height * 0.193;
        }

       _elem.size(square_resize, square_resize).css({
            left: _left,
            bottom: bottom
        });

       var fontsize = 14;
        if (Stage.height < 700){
            fontsize = Stage.height * 0.02;
        }
        if (fontsize < 9){
            fontsize = 9;
        }
        _name.css({
            fontSize: fontsize,
            bottom: square_resize + (fontsize*0.75)
        });

       _info.resize(square_resize);
    };
});