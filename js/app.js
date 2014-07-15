(function ($){
	$.fn.removeStyle = function (style){
		var search = new RegExp(style + '[^;]+;?', 'g');

		return this.each(function(){
			$(this).attr('style', function(i, style){
				return style.replace(search, '');
			});
		});
	};

	$.fn.inlineStyle = function (prop){
		return this.prop("style")[$.camelCase(prop)];
	};
})(jQuery);

function clean(string) {
	string = string.replace(/ /g, "-"); // Replaces all spaces with hyphens.
	string = string.replace(/[^A-Za-z0-9\-]/g, ''); // Removes special chars.
	return string;
}

$(document).foundation({
	'topbar': {
		custom_back_text: true,       // Set this to false and it will pull the top level link name as the back text
		back_text: '« Back',          // Define what you want your custom back text to be if custom_back_text: true
		mobile_show_parent_link: true // will copy parent links into dropdowns for mobile navigation
	},
	'reveal' : {
		animation_speed: 1000,
		dismiss_modal_class: 'close-modal',
		close_on_background_click: true
	}
});

$(document).ready(function(){
	// CODE THAT CAUSES SOME ISSUES FOR VIMEO PLAYBACK IN FIREFOX
	// HAS TO DO WITH THE DYNAMIC TOP MARGINS FOR THE OFF CANVAS CONTENT
	// AND FLASH PLAYER IN FIREFOX
	$('.left-off-canvas-toggle').bind("click", function() {
		// console.log( Math.round($(document).scrollTop() + 40) );

		$('#video-holder').css({
			'left': '-50%',
			'top': $(window).scrollTop()
		});

		$( "#video-holder" ).stop().animate({
			left: "47%"
		}, 500);
	});

	$("#main-nav section ul li a, .footer .medium-7 ul li a").click(function(e){
		var name = "#" + e.target.id.substring(4);

		// console.log('name')
		// if (name != '#home') {
		e.preventDefault();
		// console.log(e.target.id.substring(4));
		// var name = "#" + e.target.id.substring(4);
		$('html, body').animate({
			scrollTop: $(name).offset().top - 30
		}, 600);
		// }
	});
  
	$('.video-bg').css({
		'height': $(window).height() - $('.first .large-5 .box').height() - 400
	});

	//CODE FOR BIGVIDEO JS
	var bv = new $.BigVideo({useFlashForFirefox:true});
	bv.init();

	// console.log($('body').is('#proposal'));
	// console.log('modernizr ' + Modernizr.touch)

	if($('body').is('#proposal')) {
		bv.show([
			'/assets/videos/Ideas-5-H264-FLIP-WEBSITE-BANNER.mp4'],
			{ambient:true}
		);
	} else {
		bv.show(bigvideo_videos, {ambient:true});
	}

	var lastscroll = $(window).scrollTop();
	$(window).scroll(function(){
		if (lastscroll - $(window).scrollTop() > 0) {
			if (parseInt($('#video-holder').css('top'), 10) > $(window).scrollTop()) {
				$('#video-holder').css({
					'top': $(window).scrollTop()
				});
			}
		} else {
			if ($(window).scrollTop() + $(window).height() > parseInt($('#video-holder').css('top'), 10) + parseInt($('#video-holder').css('height'), 10)) {
				$('#video-holder').css({
					'top': $(window).scrollTop() - ( parseInt($('#video-holder').css('height'), 10) - $(window).height())
				});
			}
		}

		lastscroll = $(window).scrollTop();
	});

	equalheights();
	checkforsticky();

	$(window).resize(function() {
		checkforsticky();
		equalheights();

		$('.video-bg').css({
			'height': $(window).height() - $('.first .large-5 .box').height() - 400
		});
	});

	function equalheights(){
		var highestCol3 = 0;
		var highestCol4 = 0;
		var padding1 = 20;
		var padding2 = 20;
		var padding3 = 70;

		$('#work img, #portfolio img, #recommendation img').hover(function() {
			$(this).parent().find('.panel').toggleClass('hover')
		});

		if ($('#work .panel').length != 0) {
			if ($(window).width() < 1029) {
				padding1 = 20;
			}

			if ($('#work .panel').inlineStyle('height')) {
				$('#work .panel').removeStyle('height');
			}

			highestCol3 = Math.max($('#work .panel').height());
			$('#work .panel').height(highestCol3 + padding1);
		}

		if ($('#recommendation .panel').length != 0) {
			if ($('#recommendation .panel').inlineStyle('height')) {
				$('#recommendation .panel').removeStyle('height');
			}

			highestCol5 = Math.max($('#recommendation .panel').height());
			$('#recommendation .panel').height(highestCol5 + padding3);
		}

		if ($('#portfolio .panel').length != 0) {
			if ($(window).width() < 1029) {
				padding2 = 40;
			}

			if ($('#portfolio .panel').inlineStyle('height')) {
				$('#portfolio .panel').removeStyle('height');
			}

			highestCol4 = Math.max($('#portfolio .panel').height());
			$('#portfolio .panel').height(highestCol4 + padding2);
		}

		if ($('#cost .panel').length != 0) {
			if ($(window).width() < 1029) {
				padding2 = 40;
			}

			if ($('#cost .panel').inlineStyle('height')) {
				$('#cost .panel').removeStyle('height');
			}

			highestCol4 = Math.max($('#cost .panel').height());
			$('#cost .panel').height(highestCol4 + padding2);
		}
	}

	function dynamicpanels() {
		if ($('.work').length != 0) {
			$('.work .panel').bind("click", function() {
				if ($(this).children('a').length != 0) {
					window.location = $(this).find('.tiny.button').attr('href');
				}
			});
		}

		if ($('.callout-2-up').length != 0) {
			$('.callout-2-up .panel').bind("click", function() {
				window.location = $(this).find('.tiny.button').attr('href');
			});
		}
	}

	function checkforsticky() {
		var screen_width = $(window).width();

		if (screen_width <= 720) {
			$('.large-12.columns').find('.contain-to-grid').removeClass('sticky');
			$('body').addClass('f-topbar-fixed');
		} else {
			$('.large-12.columns').find('.contain-to-grid').addClass('sticky');
			$('body').removeClass('f-topbar-fixed');
		}
	}

	// builds detail views for portfolio items and attaches them to the click event on the home page elements
	function buildPortfolio(pf){
		// console.log(pf);
		$.each(pf, function(index, element){
			// console.log(element);

			var element_id = clean(element.name.toLowerCase())+'-'+index;
			$('#'+element_id).bind("click", function(){
				var full_string = "";
				bv.getPlayer().pause();

				// determine type of layout
				switch (element.type){
					case 'Featured':
					full_string =	'<div class="row services-detail">';
					full_string +=	'<div class="row">';
					full_string +=	'<div class="medium-4 columns"><h2>' + element.name + '</h2>';
					full_string +=	element.description_1 + '</div>';
					full_string +=	'<div class="medium-8 columns thumbs">';

					// featured video or image
					if (element.video_embed != "") {
						full_string	+= '<div class="flex-video vimeo widescreen">' + element.video_embed + '</div>';
					} else {
						full_string	+= '<img src="' + element.featured_images[0].urlPath + '" />';
					}

					// additional images
					full_string += '<div class="row">';

					for (var i in element.featured_images){
						if (element.video_embed != ""){
							// show first 4
							if (i < 4){
								full_string += '<div class="medium-3 columns"><img src="' + element.featured_images[i].urlPath + '" /></div>';
							}
						}else{
							// show last 4
							if (i != 0){
								full_string += '<div class="medium-3 columns"><img src="' + element.featured_images[i].urlPath + '" /></div>';
							}
						}
					}

					full_string += '</div>';

					full_string += element.description_2 + '</div></div></div>';

					// put content in element
					$("#video-holder div").replaceWith(full_string);
					break;

					case 'Video':
					full_string +=	'<div class="row services-detail">';
					full_string +=	'<div class="medium-12 columns"><h2>' + element.name + '</h2>';
					full_string +=	'<div class="row"></div>';
					full_string +=	'<div class="flex-video widescreen vimeo">'+element.video_embed+'</div>';

					full_string += '<h3>Services Provided</h3><hr />';

					// loop through service categories
					for (var category in element.services_sorted){
						full_string += '<div class="medium-3 columns"><ul><h5>'+category+'</h5>';

						// loop through services in category
						for (var i in element.services_sorted[category]){
							full_string += "<li>"+element.services_sorted[category][i]+"</li>";
						}

						full_string += "</ul></div>";
					}

					full_string += '</div></div>';

					// put content in element
					$("#video-holder div").replaceWith(full_string);
					break;

					case 'Web':
					default:
					full_string +=	'<div class="row services-detail">';
					full_string +=	'<div class="medium-12 columns"><h2>' + element.name + '</h2>';
					full_string +=	'<div class="row"></div>';
					full_string +=	'<div class="flex-video widescreen vimeo"><img src="'+element.featured_image[0].urlPath+'" alt="'+element.featured_image[0].info1+'" /></div>';
					full_string +=	'<h3>Services Provided</h3><hr />';

					// loop through service categories
					for (var category in element.services_sorted){
						full_string += '<div class="medium-3 columns"><ul><h5>'+category+'</h5>';

						// loop through services in category
						for (var i in element.services_sorted[category]){
							full_string += '<li>'+element.services_sorted[category][i]+'</li>';
						}

						full_string += '</ul></div>';
					}

					full_string += '</div></div>';

					// put content in element
					$("#video-holder div").replaceWith(full_string);
					break;
				}
			});

			/*$('.exit-off-canvas').click(function() {
				// Animate out and replace div
				$( "#video-holder" ).stop().animate({
					left: "-50%"
				}, 200, function() {
					// Animation complete.
					$("#video-holder div").replaceWith("<div></div>");
					$('#video-holder').removeStyle('left');
					$('#video-holder').removeStyle('top');
					bv.getPlayer().play();
				});
			});*/
			
			$('.exit-off-canvas').click(function() {
				// Animate out and replace div
				$( "#video-holder" ).stop().animate({
					left: "-50%"
				}, 750, function() {
					// Animation complete.
					$("#video-holder div").replaceWith("<div></div>");
					$('#video-holder').removeStyle('left');
					$('#video-holder').removeStyle('top');
					bv.getPlayer().play();
				});

				$("#video-holder div").stop().animate({
					opacity: 0
				}, 750);
			});
		});
	}

	// GET JSON DATA
	var jqxhr = $.getJSON( "/js/portfolio.json?" + new Date().getTime() + "=" + Math.floor(Math.random()*99999), function() {
		// console.log("success");
	}).done(function(data) {
		// console.log("second success");
		buildPortfolio(data.portfolio);
	}).fail(function() {
		console.log("Failed to load JSON portfolio data.");
	}).always(function() {
		// console.log("complete");
	});
   
	// Perform other work here ...
	// Set another completion function for the request above
	/*jqxhr.complete(function() {
		// console.log( "second complete" );
	});*/
}); // document.ready


// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30904006-2']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


// contact form stuff
var form = $("#contactForm"),
	submit = $("#submit"),
	name = "",
	email = "",
	comments = "",
	errors,
	x,
	y,
	field,
	tempArray,
	erroneousElement,
	erroneousElementLabel,
	fieldnames,
	updateDisplayMessages = function (arrayOfErrors) {
		var header = $('<h4 class="subheader success"></h4>'),
			x = 0;
		for(x = 0; x < arrayOfErrors.length; x = x + 1){
			header.text(arrayOfErrors[x]);
		}
		header.insertBefore(form);		
	},
	removeErrors = function () {
		$('ul.error,.error span, #contactForm small,h4.subheader.success').remove();
		form.find('*').removeClass('error');
	};

submit.click(function(e){
	e.preventDefault();
	errors = [];
	removeErrors();
	 // console.log("we've got a click");
	$.ajax({
		url: form.attr('action'),
		type: form.attr('method'),
		data: form.serialize()+'&ajax=true',
		success: function(result){
			removeErrors();
			var r = $.parseJSON(result);

			if(r.status === 'field-error'){
				for(x = 0;x < r.messages.length; x = x + 1){
					field = r.messages[x].field;

					switch(field){
						case 'emails':
							fieldnames = r.messages[x].fieldnames;
							for(y = 0;y < fieldnames.length; y = y + 1){
								erroneousElement = $('[name="'+ fieldnames[y] +'"]');
								erroneousElementLabel = $('label[for="'+ fieldnames[y] +'"]');
								erroneousElementLabel.addClass('error');
								erroneousElement.addClass('error');
								erroneousElement.after('<small class="error">'+r.messages[x].message+'</error>');	
							}
							break;
						case 'emailfield':
						case 'confirmemailfield':
							erroneousElement = $('[name="'+ field +'"]');
							erroneousElement.addClass('error');
							erroneousElementLabel = $('label[for="'+ field +'"]');
							erroneousElementLabel.addClass('error');
							erroneousElement.after('<small class="error">'+r.messages[x].message+'</error>');
							break;
						default:
							erroneousElement = $('[name="'+ field +'"]');
							erroneousElement.addClass('error');
							erroneousElementLabel = $('label[for="'+ field +'"]');
							erroneousElementLabel.addClass('error');
							break;
					}
				}
			}

			if(r.status === 'error'){
				tempArray = [];

				for(x = 0;x < r.messages.length; x = x + 1){
					tempArray.push(r.messages[x].message);
				}

				updateDisplayMessages(tempArray);
				// console.log(r);
			}

			if(r.status === 'success'){
				tempArray = [];

				for(x = 0;x < r.messages.length; x = x + 1){
					tempArray.push(r.messages[x].message);
				}

				updateDisplayMessages(tempArray);
				form.hide();
				submit.parent().hide();
				$('#fullnamefield').val("");	
				$('#emailfield').val("");
				$('#confirmemailfield').val("");
				$('#commentsfield').val("");
			}
		}
	});
	
	return false;
});