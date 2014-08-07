Class(function ContactView() {
    Inherit(this, View);
    
    var _self = this, _elem, _nav, _padding;
    var _heading, _person_1_name, _person_1_info, _person_2_name, _person_2_info, _companyname, _companyinfo, _companyemail, _emailaddress, _companyphone;

    this.width = 0;
    this.height = 0;
    
    (function() {
        _markup();
        _addText();
    })();

    function _markup() {
        _elem = _self.element;
        _setSize();
    }

    function _setSize(){
        var small = (Device.mobile.phone || Stage.height < 600);
        var top;
        
        if(small){
            _padding = 30;
            if (Stage.height < 320 || Device.mobile.phone){
                top = _padding;
                _self.height = Stage.height - (_padding);
            }else{
                top = 65;
                _self.height = Stage.height - (_padding+top);
            }
        }else{
            _padding = 40;
            top = 113;
            _self.height = Stage.height - (_padding+top);
        }

        _self.width = Global.CONTACT.width - (_padding*2);

        _elem.size(_self.width, _self.height).css({
            top: top,
            right: _padding
        });
    }

    function _addText(){
        _heading = _elem.create(".heading");
        _heading.fontStyle("LeagueGothic", 24, Config.COLORS.white);
        _heading.css({
            position: "static",
            lineHeight: 24,
            marginBottom: 24
        });

        _heading.text("We'd like to hear from you.");

        /*_person_1_name = _elem.create(".name1");
        _person_1_name.fontStyle("OpenSansBold", 14, Config.COLORS.white);
        _person_1_name.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            position: "static"
        });

        _person_1_name.text("CHRIS SLOAN");

        _person_1_info = _elem.create(".info1");
        _person_1_info.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _person_1_info.css({
            position: "static",
            marginBottom: 24
        });

        _person_1_info.text("Executive Creative Director/President<br />Phone: (305) 672-8229 ext. 11<br />Email: chris.sloan@2cmedia.com");

        _person_2_name = _elem.create(".name2");
        _person_2_name.fontStyle("OpenSansBold", 14, Config.COLORS.white);
        _person_2_name.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            position: "static"
        });

        _person_2_name.text("CARLA KAUFMAN-SLOAN");

        _person_2_info = _elem.create(".info2");
        _person_2_info.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _person_2_info.css({
            position: "static",
            marginBottom: 32
        });

        _person_2_info.text("Co-President/Executive Producer<br />Phone: (305) 672-8229 ext. 12<br />Email: carla.kaufmansloan@2cmedia.com");*/

        _companyname = _elem.create(".companyname");
        _companyname.fontStyle("LeagueGothic", 24, Config.COLORS.white);
        _companyname.css({
            position: "static",
            lineHeight: 24
        });

        _companyname.text("2C Media");

        _companyinfo = _elem.create(".companyinfo");
        _companyinfo.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _companyinfo.css({
            position: "static",
            marginBottom: 24
        });

        _companyinfo.text("12550 Biscayne Blvd<br />Suite 700<br />N. Miami, FL 33181");

        _companyemail = _elem.create(".companyemail");
        _companyemail.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _companyemail.css({
            position: "static"
        });

        _companyemail.text("Email: ");

        _emailaddress = _companyemail.create(".email");
        _emailaddress.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _emailaddress.css({
            position: "relative",
            display: "inline",
            textDecoration: "underline"
        });

        _emailaddress.text("info@2c.tv");

        _emailaddress.interact(null, function(){
            getURL("mailto:info@2c.tv", "_self");
        });


        _companyphone = _elem.create(".companyphone");
        _companyphone.fontStyle("OpenSansLight", 12, Config.COLORS.white);
        _companyphone.css({
            position: "static"
        });

        _companyphone.text("Phone: (305) 672-8229");
    }

    /*
    We'd like to hear from you.

    Chris Sloan
    Executive Creative Director/President
    Phone: (305) 672-8229 ext. 11
    Email: chris.sloan@2cmedia.com

    Carla Kaufman-Sloan
    Co-President/Executive Producer
    Phone: (305) 672-8229 ext. 12
    Email: carla.kaufmansloan@2cmedia.com

    2C Media
    12550 Biscayne Blvd
    Suite 700
    N. Miami, FL 33181

    Phone: (305) 672-8229
    */

    this.resize = function(){
        _setSize();
    };
});