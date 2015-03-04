Static(function Data() {

    Inherit(this, Model);

    var _self = this;
    var _data;
    var _work;

    bit.ready(function () {
        _setData();
    });

    function _setData(){

        _self.STATE = new StateModel();

        _self.LOADER = {
            text: "Don't change reality.<br />Take it.",
            subtitle: ""
            // text: "A devious curtain falls <br /> over our city. Welcome to the Milwaukee <br /> you have never seen before.",
            // subtitle: "An original series in progress, brought to you by writer T. C. DeWitt along with Flipeleven Original Productions."
        };

        _self.HOME = [
            // content
            {
                type: "normal",
                title: "Mirror Me",
                subtitle: "Identity theft at the highest level",
                text: "The sci-fi drama MIRROR ME follows Jason Thompson, an honorable police officer who is replaced by a sinister variant of himself from a corrupt parallel universe. Jason must portray his dark self while preserving his soul if he is to escape the shadowy inversion of the world he yearns for. As both Jasons face their new realities and as Good Jason claws his way back to home, we witness how a man's situation can alter who he is at his core.",
                bg: Device.mobile.phone ? Config.ASSETS.bgs + "/city-good-sm.jpg" : Config.ASSETS.bgs + "/city-good.jpg",
                tex: Device.mobile.phone ? Config.ASSETS.bgs + "/texture-good-sm.png" : Config.ASSETS.bgs + "/texture-good.png",
                fg: Device.mobile.phone ? Config.ASSETS.bgs + "/chike-good-sm.png" : Config.ASSETS.bgs + "/chike-good.png"
            },

            {
                type: "normal",
                title: "The Project",
                subtitle: "Economic Development",
                text: "MIRROR ME is designed to generate awareness of Milwaukee's film talent while bringing film revenue into the city. The Mirror Me pilot will draw on the talented labor found in Milwaukee. It will then be marketed to on-line media distributors such as Amazon and Netflix to generate awareness of Milwaukee talent and to produce funds for future work.",
                bg: Device.mobile.phone ? Config.ASSETS.bgs + "/city-bad-sm.jpg" : Config.ASSETS.bgs + "/city-bad.jpg",
                tex: Device.mobile.phone ? Config.ASSETS.bgs + "/texture-bad-sm.png" : Config.ASSETS.bgs + "/texture-bad.png",
                fg: Device.mobile.phone ? Config.ASSETS.bgs + "/chike-bad-sm.png" : Config.ASSETS.bgs + "/chike-bad.png"
            },

            {
                type: "contact",
                title: "The Portal",
                subtitle: "Time to meet yourself through the portal.",
                text: "The last step in this process is raising the proper funds.  Only if done right will MIRROR ME serve as an ambassador from Milwaukee's film industry. This pilot will cost $200,000 to make properly; however, through months of passionate dedication, with labor and gear working at cost, and with a group of talented volunteers, we are willing to make that $200,000 pilot for only $60,000. Submit your email to donate or get involved today!",
                bg: Device.mobile.phone ? Config.ASSETS.bgs + "/city-bright-sm.jpg" : Config.ASSETS.bgs + "/city-bright.jpg",
                tex: Device.mobile.phone ? Config.ASSETS.bgs + "/texture-bright-sm.png" : Config.ASSETS.bgs + "/texture-bright.png",
                fg: Device.mobile.phone ? Config.ASSETS.bgs + "/city-bright-blur-sm.jpg" : Config.ASSETS.bgs + "/city-bright-blur.jpg"
            },
        ];
    }
});