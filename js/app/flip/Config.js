Class(function Config() {
    // console.log('EIGHTH CALL')
    // console.log(':: STATIC - app configuration')

    var a = this, gradient;

    this.S3 = (function () {
        if (window.location.href.strpos(".net") || window.location.href.strpos(":8080")) {
            return "http://activetheory-v2.s3.amazonaws.com/";
        }
        return "";
    })();
    this.PROXY = (function () {
        if (window.location.href.strpos(":8080")) {
            return "http://localhost:8080/cdn/";
        }
        if (window.location.href.strpos("activetheorylab.net")) {
            return "http://activetheory.activetheorylab.net/cdn/";
        }
        if (window.location.href.strpos("activetheory.net")) {
            return "http://activetheory.net/cdn/";
        }
        // if (window.location.href.strpos("dev")) {
        //     return "http://2c.dev/";
        // }
        return ""
    })();
    this.PATH = this.PROXY;
    this.IMAGES = (function () {
        if (window.location.href.strpos(".net")) {
            return a.S3 + "assets/images/";
        }
        return "/assets/images/"
        // return "assets/images/"
    })();

      this.NAV = [
      {
          type: "home",
          width: 42,
          // subnav: ["Sizzle", "Design", "Live Action", "Brand Integration", "Best of 2C Promos"]
          subnav: []
          // subnav: Data.CATEGORIES.getCategoryNameByType(2)
      }, {
          type: "about",
          width: 50,

          // subnav: ["Promos", "Design", "Live Action", "Brand Integration", "Presentations", "Archive"]
          subnav: []
      }, {
          type: "our work",
          width: 78,

          // subnav: ["Culture", "Team", "Contact", "Our Clients"]
          subnav: []
      }, {
          type: "blog",
          width: 38,

          // subnav: ["Visit 2C Content"]
          subnav: []
      }, /*{
    	type: "directors",
          // subnav: ["Brian", "Bart", "Mark", "Kevin"]
    	subnav: []
      },*/ {
    	type: "contact",
        width: 66,

    	subnav: []
      }];
    
    // var _allTypes = Data.CATEGORIES.getAllCategoryTypes();
    // var _allNames = Data.CATEGORIES.getAllCategoryNames();

    // for (var i = 0; i < _allTypes.length; i++) {
    //     console.log('Category: length is '+Data.CATEGORIES.getCategoryByType( _allTypes[i] ).length);
    //     console.log(_allNames[i].toUpperCase());

    //     var _cat = Data.CATEGORIES.getCategoryByType( _allTypes[i] );

    //     for (var j = 0; j < _cat.length; j++) {
    //         console.log(_cat[j].name);
    //     }
        
    // }

    // settings for nav animations
    this.NAVCONFIG = {
		duration: 300,
		easing: "easeInOutQuad",
		delay: 0
    };

    // slice gradients
    //background: -moz-linear-gradient(top,  rgba(76,59,132,0.3) 0%, rgba(76,59,132,0.85) 33%, rgba(76,59,132,0.85) 100%); /* FF3.6+ */
    //background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(76,59,132,0.3)), color-stop(33%,rgba(76,59,132,0.85)), color-stop(100%,rgba(76,59,132,0.85))); /* Chrome,Safari4+ */
    //background: -webkit-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* Chrome10+,Safari5.1+ */
    //background: -o-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* Opera 11.10+ */
    //background: -ms-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* IE10+ */
    //background: linear-gradient(to bottom,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* W3C */
    //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4d4c3b84', endColorstr='#d94c3b84',GradientType=0 ); /* IE6-9 */

    if (Device.vendor !== ""){
        gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%)"; // most browsers
    }else{
        gradient = "linear-gradient(to bottom,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%)"; // W3C
    }

    this.COLORS = {
        white: "#ffffff",
        grey: "#e0e0e0",
        black: "#000000",
        branding: "#199BFF",
        redshade: "#d44317",
        red: "#c3270e",
        darkgrey: "#4b4b51",
        blue: '#199BFF',
        teal: '#1b8c68',
        purple: "#4c3b84",
        bluegrey: "#222c38",
        slicegradient: gradient,
        sliceinnerglow: "inset 0 0 90px rgba(0,78,196,0.2)"
    };
    this.SKEW = 0;

    // this.ASPECT = 576 / 1000
    this.ASPECT = 600 / 1100
}, "Static");

window.Config = window.Config || {};
// window.Config.ASSETS = ["assets/images/about/bg.jpg", "assets/images/about/logo.png", "assets/images/common/272737.png", "assets/images/common/f4f4f4.png", "assets/images/common/loader.png", "assets/images/common/rotate.png", "assets/images/favicon.png", "assets/images/home/logo-invert.png", "assets/images/home/logo-wide.png", "assets/images/home/particle-gl.png", "assets/images/home/particle0-gl.jpg", "assets/images/home/particle1-gl.jpg", "assets/images/home/particle2-gl.jpg", "assets/images/home/spark-gl.jpg", "assets/images/loader/letter.png", "assets/images/share/apple-touch-icon.png", "assets/images/share/share.jpg", "assets/images/sidebar/fb.png", "assets/images/sidebar/logo.png", "assets/images/sidebar/nav/about-off.png", "assets/images/sidebar/nav/about-on.png", "assets/images/sidebar/nav/contact-off.png", "assets/images/sidebar/nav/contact-on.png", "assets/images/sidebar/nav/lab-off.png", "assets/images/sidebar/nav/lab-on.png", "assets/images/sidebar/nav/work-off.png", "assets/images/sidebar/nav/work-on.png", "assets/images/sidebar/tw.png", "assets/images/work/black.jpg", "assets/images/work/gradient.png", "assets/images/work/halftone.png", "assets/images/work/overlay.png", "assets/images/work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];
// window.Config.ASSETS = ["assets/images/common/gradient2.png", "assets/images/common/drawer-icon.png", "assets/images/common/drawer-icon-active.png", "assets/images/common/272737.png", "assets/images/common/f4f4f4.png", "assets/images/common/loader.png", "assets/images/common/rotate.png", "assets/images/home/logo-invert.png", "assets/images/home/logo-wide.png", "assets/images/home/particle-gl.png", "assets/images/home/particle0-gl.jpg", "assets/images/home/particle1-gl.jpg", "assets/images/home/particle2-gl.jpg", "assets/images/home/spark-gl.jpg", "assets/images/loader/letter.png", "assets/images/work/black.jpg", "assets/images/work/gradient.png", "assets/images/work/halftone.png", "assets/images/work/overlay.png", "assets/images/work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];
window.Config.ASSETS = ["/assets/images/common/logo.png", "/assets/images/common/loader.png", "/assets/images/common/gradient2.png", "/assets/images/common/drawer-icon.png", "/assets/images/common/drawer-icon-active.png", "/assets/images/common/video-close.png", "/assets/images/common/play-arrow-white.png", "/assets/images/common/play-arrow-purple.png", "/assets/images/common/rotate.png", "/assets/images/home/logo-invert.png", "/assets/images/loader/letter.png", "/assets/images/work/black.jpg", "/assets/images/work/gradient.png", "/assets/images/work/halftone.png", "/assets/images/work/overlay.png", "/assets/images/work/white.png"];
// window.Config.ASSETS = ["common/272737.png", "common/f4f4f4.png", "common/loader.png", "common/rotate.png", "home/logo-invert.png", "home/logo-wide.png", "home/particle-gl.png", "home/particle0-gl.jpg", "home/particle1-gl.jpg", "home/particle2-gl.jpg", "home/spark-gl.jpg", "loader/letter.png", "work/black.jpg", "work/gradient.png", "work/halftone.png", "work/overlay.png", "work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];