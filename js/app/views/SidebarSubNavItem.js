Class(function SidebarSubNavItem(params){
    Inherit(this, View);

    var _self = this, _elem, _text;

    this.params = params;

    (function(){
        _markup();
        _initInteract();
    })();

    function _markup(){
        _elem = _self.element;

        // calculate font scale/element size
        var fontscale = _self.params.totalheight * 0.036;
        if (Device.mobile.phone){
            if (fontscale < 8){
                fontscale = 8;
            }
        }

        if (fontscale > 18){
            fontscale = 18;
        }

        // determine top margin for first item (for centering vertically)
        var topmargin = fontscale;
        if (_self.params.index == 0){
            var itemheight = fontscale + (fontscale*0.8); // each item effectively has a bottom margin
            var allheight = (itemheight*_self.params.totalitems) - fontscale; // remove bottom margin from calculation
            var diff = _self.params.openheight - allheight;

            topmargin = diff/2;
        }

        _elem.size("100%", fontscale*0.8).css({
            position: "relative",
            overflow: "hidden",
            marginTop: topmargin,
            marginBottom: fontscale
        });

        _text = _elem.create(".text");
        _text.fontStyle("OpenSans", fontscale, Config.COLORS.white);
        _text.size("100%", "auto").css({
            textAlign: "center",
            letterSpacing: fontscale*0.222,
            lineHeight: fontscale*0.8
        });
        // _prma = Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) )._filename.toLowerCase();
        _text.text(_self.params.text.toUpperCase());
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);

        // _self.events.add(FlipEvents.HOVER, _hoverActions);
        // _self.events.add(FlipEvents.CLICK, _clickActions);
    }

    function _hoverActions(mouseevent) {
        switch (mouseevent.action){
            case "over":
                _text.tween({
                    color: Config.COLORS.red
                }, 400, "easeOutQuint");
            break;

            case "out":
                _text.tween({
                    color: Config.COLORS.white
                }, 200, "easeOutQuint");
            break;
        }
    }

    function _clickActions(clickevent) {
        // set path text for special cases
        var page_path = '';
        switch (_self.params.parent_text){
            case "about us":
                page_path = "about";
            break;
            case "2c content":
                page_path = "content";
            break;

            default:
                page_path = _self.params.parent_text;
            break;
        }

        if (page_path != 'reels') {
            _self.events.fire(FEEvents.NAV_SELECT, {
                type: Utils.urlstr(page_path) + '/' + Utils.urlstr(_self.params.text),
                index: _self.params.index
            });
        } else {

            /*console.log('===============================================================');
            console.log('SIDEBAR SUBNAV ITEM :: Data.REELS.getWorkByNum:'+Data.REELS.getWorkByNum(2));
            console.log(Data.REELS.getWorkByNum(2));*/
            // console.log('SIDEBAR SUBNAV ITEM :: Data.REELS:'+Data.REELS);
            // console.log(Data.REELS);
            // console.log('_self.params.index: '+_self.params.index);
            /*console.log('_self.params.text: '+ Utils.urlstr(_self.params.text));
            console.log( 'Data.REELS.getNumByPageDetail: '+Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ));
            console.log( 'Data.REELS.getWorkByNum:');
            console.log( Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) ));*/
            // console.log( Utils.urlstr(Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) ).main_categories));

            // console.log('===============================================================');
            // console.log();

            // _prma = !Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) ).permalink ? Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) )._filename.toLowerCase() : Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) ).permalink;
            _prma = Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) )._filename.toLowerCase();
            _ctgy = Utils.urlstr(Data.REELS.getWorkByNum( Data.REELS.getNumByPageDetail( Utils.urlstr(_self.params.text) ) ).main_categories);

            /*console.log(_ctgy);
            console.log(_prma);*/
            // console.log('SIDEBAR SUBNAV ITEM :: '+_prma);
            // // Data.STATE.setState(_page + "/" + _ctgy + '/' + _prma);

            _self.events.fire(FEEvents.NAV_SELECT, {
                // type: Utils.urlstr(page_path) + '/' + Utils.urlstr(_self.params.text),
                type: Utils.urlstr(page_path) + "/" + _ctgy + '/' + _prma,
                index: _self.params.index
            });
        }

        if (Global.CONTACT.opened === true){
            Global.SIDEBAR.closeContact();
            Global.CONTACT.close();
        }
        Global.SIDEBAR.close();
    }

    this.resize = function(resize_params){
    	// update internal parameters
        _self.params.totalheight = resize_params.totalheight;
        _self.params.openheight = resize_params.openheight;

        // calculate font scale/element size
        var fontscale = _self.params.totalheight * 0.036;
        if (Device.mobile.phone){
            if (fontscale < 8){
                fontscale = 8;
            }
        }
        if (fontscale > 18){
            fontscale = 18;
        }

        // determine top margin for first item (for centering vertically)
        var topmargin = fontscale;
        if (_self.params.index == 0){
            var itemheight = fontscale + (fontscale*0.8); // each item effectively has a bottom margin
            var allheight = (itemheight*_self.params.totalitems) - fontscale; // remove bottom margin from calculation
            var diff = _self.params.openheight - allheight;

            topmargin = diff/2;
        }

        _elem.size("100%", fontscale*0.8).css({
            marginTop: topmargin,
            marginBottom: fontscale
        });

        _text.css({
            fontSize: fontscale,
            letterSpacing: fontscale*0.222,
            lineHeight: fontscale*0.8
        });
    };
});