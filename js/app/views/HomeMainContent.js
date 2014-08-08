Class(function HomeMainContent(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe, _pageHeight;
    var col1, col2, col3;
    
    var _c1_header, _c1_subhead, _c1_content;
    var _c2_header, _c2_list;
    var _c3_header, _c3_photo;

    var _gutter = 10;
    var _container = container;
    var _margin = margin;




    (function () {

        _getHomeMain();
        _getHomeAbout();

        _onResize();
    })();    

    function _getHomeMain() {
        // console.log(Data.HOME.getData());
        var _text = 'A Digital Creative Agency';

        console.log('_container.container' + _container.container)
        console.log(_container.container)

        // _cont.center();
        _play = _container.container.create('play');
        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2,
            background: 'red'
        }).transform({
            // y: (Stage.height/2) - 50,
            // x: (Stage.width/2)
        }).setZ(50);

        _hdln = _container.container.create('headline');
        // _hdln.fontStyle("GeomSlab703-ExtraBoldCondensed", 48, Config.COLORS.white);
        _hdln.fontStyle("GeomSlab703-ExtraBold", 48, Config.COLORS.white);
        _hdln.size(500, 100).css({
            // position: 'relative',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 48,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10),
            left: Stage.width/2 - _hdln.width/2 - _margin/2,
            // paddingTop: 130,

            // height: 'auto'
            // left: -250
            // left: Stage.width - 600,
            border: '1px solid red'
        }).setZ(50);

        _hdln.text(_text);

    }

    function _getHomeAbout() {
        _abot = _container.container.create('about');

        console.log('HOME MAIN CONTENT :: play: ' + parseInt(_play.div.style.top, 10));
        console.log('HOME MAIN CONTENT :: hdln top: ' + _hdln.div.style.top);
        console.log('HOME MAIN CONTENT :: hdln width: ' + _hdln.div.style.width);



        _abot.css({
            position: 'relative',
            width: '100%',
            // height: 2000,
            // left: '-50%',
            // top: Stage.height - 100,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10) + 200,
            color: Config.COLORS.white,
            // background: Config.COLORS.branding,
            borderTop: '2px solid ' + Config.COLORS.white,
            borderBottom: '2px solid ' + Config.COLORS.white
        });

        _col1 = _abot.create('column1');
        _col2 = _abot.create('column2');
        _col3 = _abot.create('column3');

        _dat_about      = Data.ABOUT.getData();
        _dat_believe    = Data.BELIEVE.getData();
        _dat_team       = Data.TEAM.getData();


        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red',

        });

        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _getColumnOneData();
        _getColumnTwoData();
        _getColumnThreeData();

    }

    function _getColumnOneData() {


        _c1_header  = _col1.create('header');
        _c1_header.fontStyle("GeomSlab703-ExtraBold", 40, Config.COLORS.white);
        _c1_subhead = _col1.create('subhead');     
        _c1_subhead.fontStyle("AvenirLight", 24, Config.COLORS.white);
        _c1_content = _col1.create('content');
        _c1_content.css({
            position: 'relative',
        });

        _c1_header.text(_dat_about[0].header.toUpperCase());
        _c1_subhead.text(_dat_about[0].subheader);
        _c1_content.text(_dat_about[0].content);
        
    }

    function _getColumnTwoData() {
        _c2_header  = _col2.create('header');
        _c2_header.fontStyle("GeomSlab703-Medium", 36, Config.COLORS.white);


        for(var j = 0; j < _dat_believe.length; j++) {

            if (j == 0) {
                _c2_list = _col2.create('list');
                _c2_list.fontStyle("AvenirLight", 26, Config.COLORS.white);
                _c2_list.text(_dat_believe[j].name);
                _c2_list.css({
                    position: 'relative',
                    marginTop: 10,
                    paddingLeft: 10,
                    paddingTop: 2,
                    paddingRight: 14,
                    paddingBottom: 5,
                    width: parseInt(_col2.div.style.width, 10) <= (CSS.textSize(_c2_list).width) ? '' : CSS.textSize(_c2_list).width,
                    // width: CSS.textSize(_c2_list).width + 20,
                    background: Config.COLORS.branding,

                });
            } else {
                if (_dat_believe[j].name) {

                    var _c = _c2_list.clone();
                    _c.fontStyle("AvenirLight", 26, Config.COLORS.white);

                    _c.text(_dat_believe[j].name);

                    _c.css({
                    //     position: 'relative',
                        paddingLeft: 10,
                        paddingTop: 2,
                        paddingRight: 0,
                        paddingBottom: 5,
                        width: parseInt(_col2.div.style.width, 10) <= (CSS.textSize(_c).width) ? '' : CSS.textSize(_c).width,
                    //     background: Config.COLORS.branding,
                    //     textWrap: 'normal'
                    });
                    _col2.addChild(_c);

                    console.log('wwww: '+parseInt(_col2.div.style.width, 10))
                    console.log('wwww: '+ (CSS.textSize(_c).width + 20))
                }
            }
        }

        _c2_header.text('Things we believe in');


        
    }

    function _getColumnThreeData() {

        _c3_header  = _col3.create('header');
        _c3_header.fontStyle("GeomSlab703-Medium", 36, Config.COLORS.white);

        _c3_header.text('Flip Profile');

        _c3_image = _col3.create('profile');

        console.log('_dat_team: ' + _dat_team[0]);
        console.log(_dat_team[0].headshot[0].urlPath);

        // function _addPhoto(){
        _c3_photo = _col3.create(".photo");
        _c3_photo.size(300, 250).bg(_dat_team[0].headshot[0].urlPath).css({
            // left: -_diff,
            // top: -_diff
        });
    // }
        // '<h4>' + _dat_team[0].name + '</h4>' +
        // '<h5>' + _dat_team[0].title + '</h5>' +
        // '<h4>Q: </h4><h5>' + _dat_team[0].question + '</h5>' +
        // '<h4>A: </h4><h5>' + _dat_team[0].answer + '</h5>'


        _self.delayedCall(function() {
            
            _pageHeight = (parseInt(_abot.div.style.top, 10) + Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50);
            _abot.css({
                height: Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50
            });
            _container.setPageHeight(_pageHeight);

        }, 100);
        
    }

    function _getList() {
        var _list = '';
        for(var j = 0; j < _dat_believe.length; j++) {

            if (_dat_believe[j].name) {
                _list += '<h5>' + _dat_believe[j].name + '</h5>';
                // console.log(_believe[j].name)
            }
        }
        return _list;
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizePage);
    }

    function _resizePage() {

        _resizeMainAndAbout();
        _container.setPageHeight(_pageHeight);
    
    }
    
    function _resizeMainAndAbout() {

        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2
        });

        _hdln.css({
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10),
            left: Stage.width/2 - _hdln.width/2 - _margin/2,
        });


        _abot.css({
            // top: Stage.height - 100,
            height: Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10) + 200,

        });

        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });
        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        
        _pageHeight = (parseInt(_abot.div.style.top, 10) + Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50);
        _container.setPageHeight(_pageHeight - Stage.height);
        console.log('Stage: '+Stage.height);
        console.log('Page: '+_pageHeight);
        // console.log(_pageHeight);
        // console.log(CSS.textSize(_col1).height);
        // console.log('col1 height: ' + CSS.textSize(_col1).height);
        // console.log('col1 height: ' + (CSS.textSize(_col1).height + 124));
        console.log('col1 height: ' + _col1.div.offsetHeight);

    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});
