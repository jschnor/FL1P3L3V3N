$(document).ready(function(){ admin_init(); });

//
function admin_init() {

  // set non-standard attributes
  $('form').attr('autocomplete', 'off');
  $('.setAttr-spellcheck-false').attr('spellcheck', false); // v2.15 remove quotes around false for fix for FF11: http://bugs.jquery.com/ticket/6548
  $('.setAttr-wrap-off').attr('wrap', 'off');

  // add behaviour for "alert" Close buttons
  $(".close").click(function() {
    $(this).parent().fadeTo(400, 0, function () { // Links with the class "close" will close parent
      $(this).slideUp(400);
    });
    return false;
  });

  // add Sidebar Accordian Menu effects (but not if "show expanded menu" is enabled)
  var showExpandedMenu = $('#jquery_showExpandedMenu').length;
  if (!showExpandedMenu) { admin_init_sidebar_accordian_menu(); }

  // Content box tabs:
  $('.content-box .content-box-content div.tab-content').hide(); // Hide the content divs
  $('ul.content-box-tabs li a.default-tab').addClass('current'); // Add the class "current" to the default tab
  $('.content-box-content div.default-tab').show(); // Show the div with class "default-tab"

  $('.content-box ul.content-box-tabs li a').click(function() {  // When a tab is clicked...
    $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
    $(this).addClass('current'); // Add class "current" to clicked tab
    var currentTab = $(this).attr('href'); // Set variable "currentTab" to the value of href of clicked tab
    $(currentTab).siblings().hide(); // Hide all content divs
    $(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
    return false;
  });

  // Override jquery.ajax function to workaround broken HTTP implementation with some hosts (IPowerWeb as of Dec 2011)
  // Reference Links: http://www.bennadel.com/blog/2009-Using-Self-Executing-Function-Arguments-To-Override-Core-jQuery-Methods.htm
  //              ... http://blog.js-development.com/2011/09/testing-javascript-mocking-jquery-ajax.html
  //              ... http://javascriptweblog.wordpress.com/2011/01/18/javascripts-arguments-object-and-beyond/
  //              ... http://docs.jquery.com/Plugins/Authoring
  (function($, origAjax){ // Define overriding method.
    $.ajax = function() {
      origSuccessMethod = arguments[0].success;
      newSuccessMethod  = function(data, textStatus, jqXHR){
          // Detect servers that send the string "0" when no content is sent (eg: IPowerWeb as of Dec 2011)
          // Note: They used to send "Content-Length: 0" and and one byte "0" as the data, but now the Content-Length appears to be set correct.
          // ...   So we'll detect their "Server" content header "Nginx / Varnish" (which is likely related to the problem output) and only modify
          // ...   results from servers that send that and a single "0" as output so as to limit false-positives.
          var isBrokenHttpImplementation = (jqXHR.getResponseHeader('Server') == 'Nginx / Varnish' && data == '0')
                                        || (jqXHR.getResponseHeader('Content-Length') == '0' && data != '');
          if (isBrokenHttpImplementation) { data = ''; } // send no output (as intended)

	  // v2.60 - Disallow content of "0" for jquery ajax
	  // Notes: Broken web/cache servers return "0" if no content is sent (eg: <?php exit; ?>) - With content-length:1 and no server name to match
	  if (data == '0') { data = ''; }
	  
          //console.log(jqXHR.getAllResponseHeaders()); // debug: show all server headers
          //console.log("isBrokenHttpImplementation: " + isBrokenHttpImplementation);
          //console.log("Server: " + jqXHR.getResponseHeader('Server'));
          //console.log("data: " + data);

          return origSuccessMethod.call(this, data, textStatus, jqXHR);
      };

      if (origSuccessMethod) { // only override if calling code has a success method set, otherwise code like this will produce an error since origSuccessMethod is undefined: jQuery("#loadtest").load("changelog.txt");
        arguments[0].success = newSuccessMethod;
      }
      return origAjax.apply(this, arguments);
    }
  })(jQuery, $.ajax);
  // End: Override jquery.ajax

}

function admin_init_sidebar_accordian_menu() {

  // add behaviour for Sidebar Accordian Menu
  $("#main-nav li a.nav-top-item").click(function () { // When a top menu item is clicked...
    $(this).parent().siblings().find("a.nav-top-item").parent().find("ul").slideUp("normal"); // Slide up all sub menus except the one clicked
    $(this).next().slideToggle("normal"); // Slide down the clicked sub menu
    return false;
  });

  // add behaviour for Sidebar Accordion Menu Hover Effect
  $("#main-nav li .nav-top-item").hover(
    function() { $(this).stop().animate({ paddingRight: "25px" }, 200); },
    function() { $(this).stop().animate({ paddingRight: "15px" }); }
  );
}

//
function confirmEraseRecord(menu, num, returnUrl) {
  var message = lang_confirm_erase_record;
  var isConfirmed = confirm(message);
  if (isConfirmed) {
    window.location="?menu=" +menu+ "&action=eraseRecords&selectedRecords[]=" + num + (returnUrl ? ('&returnUrl=' + encodeURIComponent(returnUrl)) : '');
  }
}

function htmlspecialchars( str ) {
  if ( typeof( str ) == 'string' ) {
    str = str.replace( /&/g, '&amp;' );
    str = str.replace( /"/g, '&quot;' );
    str = str.replace( /'/g, '&#039;' );
    str = str.replace( /</g, '&lt;' );
    str = str.replace( />/g, '&gt;' );
  }
  return str;
}

// Javascript sprintf() function
// v0.6 from http://www.diveintojavascript.com/projects/javascript-sprintf
// Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>, All rights reserved.
// License: BSD
function sprintf() {
	var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
	while (f) {
		if (m = /^[^\x25]+/.exec(f)) {
			o.push(m[0]);
		}
		else if (m = /^\x25{2}/.exec(f)) {
			o.push('%');
		}
		else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
			if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
				throw('Too few arguments.');
			}
			if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
				throw('Expecting number but found ' + typeof(a));
			}
			switch (m[7]) {
				case 'b': a = a.toString(2); break;
				case 'c': a = String.fromCharCode(a); break;
				case 'd': a = parseInt(a); break;
				case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
				case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
				case 'o': a = a.toString(8); break;
				case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
				case 'u': a = Math.abs(a); break;
				case 'x': a = a.toString(16); break;
				case 'X': a = a.toString(16).toUpperCase(); break;
			}
			a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
			c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
			x = m[5] - String(a).length - s.length;
			p = m[5] ? str_repeat(c, x) : '';
			o.push(s + (m[4] ? a + p : p + a));
		}
		else {
			throw('Huh ?!');
		}
		f = f.substring(m[0].length);
	}
	return o.join('');
}

// required by sprintf()
function str_repeat(i, m) {
	for (var o = []; m > 0; o[--m] = i);
	return o.join('');
}

