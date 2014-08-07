Class(function WorkDetailSidebar(workIndex) {
    Inherit(this, View);

    var _self = this, _elem, _title, _meta_director, _meta_category, _meta_network, _content, _data;
    
    (function(){
        _markup();
        _addContent();
    })();

    function _markup() {
        _elem = _self.element;
        _elem.size(Global.SIDEBAR.width, Stage.height).bg(Config.COLORS.bluegrey).transform({
            x: -Global.SIDEBAR.width
        }).css({
            overflow: "hidden",
            opacity: 0.85
        });

        //console.log(_data.getWorkByNum(workIndex)); // works
    }

    function _addContent(){

        // title
        _title = _elem.create(".title");
        
        var titlefontsize = Stage.height*0.0782;
        if (Device.mobile.phone){
            if (titlefontsize > 45){
                titlefontsize = 45;
            }
            if (titlefontsize < 25){
                titlefontsize = 25;
            }
        }else{
            if (titlefontsize > 60){
                titlefontsize = 60;
            }
            if (titlefontsize < 40){
                titlefontsize = 40;
            }
        }
        
        _title.fontStyle("LeagueGothic", titlefontsize, Config.COLORS.white);
        _title.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).css({
            position: "relative",
            letterSpacing: titlefontsize*0.016,
            lineHeight: titlefontsize,
            textAlign: "left",
            textTransform: "uppercase",
            marginTop: Device.mobile.phone? Stage.height*0.3:Stage.height*0.35,
            marginBottom: titlefontsize/4
        }).setZ(99).transform({
            z: 1
        });
        console.log('::::::::::::::::::::::')
        console.log('WORK DETAIL SIDEBAR ::')
        console.log(workIndex)

        switch (Data.STATE.page) {
            case 'home':
                _data = Data.HOME;
            break;
            case 'work':
                _data = Data.WORK;
            break;
            case 'reels':
                _data = Data.REELS;
            break;
            case 'content':
                _data = Data.CONTENT;
            break;
        }
        _title.text(_data.getWorkByNum(workIndex).name);

        // meta data
        var metafontsize = 12;
        if (Device.mobile.phone){
            metafontsize = 8;
        }
        
        var metatext = "";

        if (_data.getWorkByNum(workIndex).director != null && _data.getWorkByNum(workIndex).director != ''){

            _meta_director = _elem.create(".meta-director");

            _meta_director.fontStyle("OpenSans", metafontsize, Config.COLORS.grey);
            _meta_director.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).transform({
                skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
            }).css({
                position: "relative",
                lineHeight: Device.mobile.phone? metafontsize*1.3:metafontsize*2,
                textTransform: "uppercase"
            });

            _meta_director.text('Directed by&nbsp;&nbsp;<strong>'+_data.getWorkByNum(workIndex).director+'</strong>');
        }


        if (_data.getWorkByNum(workIndex)['main_categories:label'] != null && _data.getWorkByNum(workIndex)['main_categories:label'] != ''){

            _meta_category = _elem.create(".meta-category");

            _meta_category.fontStyle("OpenSans", metafontsize, Config.COLORS.grey);
            _meta_category.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).transform({
                skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
            }).css({
                position: "relative",
                lineHeight: Device.mobile.phone? metafontsize*1.3:metafontsize*2,
                textTransform: "uppercase"
            });

            _meta_category.text('Category:&nbsp;&nbsp;<strong>'+_data.getWorkByNum(workIndex)['main_categories:label']+'</strong>');
        }


        if (_data.getWorkByNum(workIndex).client != null && _data.getWorkByNum(workIndex).client != ''){

            _meta_network = _elem.create(".meta-network");

            _meta_network.fontStyle("OpenSans", metafontsize, Config.COLORS.grey);
            _meta_network.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).transform({
                skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
            }).css({
                position: "relative",
                lineHeight: Device.mobile.phone? metafontsize*1.3:metafontsize*2,
                textTransform: "uppercase"
            });

            _meta_network.text('Network:&nbsp;&nbsp;<strong>'+_data.getWorkByNum(workIndex).client+'</strong>');
        }

        // content
        _content = _elem.create(".content");
        var contentfontsize = 12;
        if (Device.mobile.phone){
            contentfontsize = 10;
        }
        _content.fontStyle("OpenSans", contentfontsize, Config.COLORS.white);
        _content.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).css({
            position: "relative",
            lineHeight: contentfontsize*1.5,
            marginTop: contentfontsize*1.5
        });
        // console.log("--- Add Work Content ---");
        // console.log(_data.getWorkByNum(workIndex));
        if (Device.mobile.phone){
            _content.text(_data.getWorkByNum(workIndex).excerpt);
        }else{
            _content.text(_data.getWorkByNum(workIndex).content);
        }
    }

    this.animateIn = function(){
        _elem.stopTween().transform({
            x: -Global.SIDEBAR.width
        }).tween({
            x: 0
        }, 500, "easeOutQuart");
    };

    this.animateOut = function(){
        _elem.stopTween().transform({
            x: 0
        }).tween({
            x: -Global.SIDEBAR.width
        }, 500, "easeOutQuart");
    };

    this.resize = function(){
        _elem.size(Global.SIDEBAR.width, Stage.height);

        var titlefontsize = Stage.height*0.0782;
        if (Device.mobile.phone){
            if (titlefontsize > 45){
                titlefontsize = 45;
            }
            if (titlefontsize < 25){
                titlefontsize = 25;
            }
        }else{
            if (titlefontsize > 60){
                titlefontsize = 60;
            }
            if (titlefontsize < 40){
                titlefontsize = 40;
            }
        }

        _title.size(Global.SIDEBAR.width*0.86, "auto").center(1,0).css({
            fontSize: titlefontsize,
            letterSpacing: titlefontsize*0.016,
            lineHeight: titlefontsize,
            marginTop: Device.mobile.phone? Stage.height*0.3:Stage.height*0.35,
            marginBottom: titlefontsize/4
        });
    };
});