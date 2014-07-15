/* $Hyena v1.2.5 jQuery Plugin || Author: Crusader12 || crusader12.com || Exclusive to CodeCanyon - thanks Cudazi :)  */
(function($){
var Hyena={
	defaults:{
		'status':false,
		'controls':true,
		'on_hover':false,
		'button_size':'20%',
		'control_style':1,
		'control_opacity':'0,0.5',
		'fade_speed':'250,200',
		'player_style':1,
		'player_fade_speed':350,
		'show_button':true,
		'on_timer':'0,0'
	},

/* INITIALIZATION */

init:function(){
	
	/* DROP OUT IF CANVAS IS NOT SUPPORTED */
 	var elem=document.createElement('canvas');
	if(!(!!(elem.getContext && elem.getContext('2d'))))return;

	for(var i=0, l=this.length; i<l; i++){
		var $this=$(this[i]),
			hyData=$this.data('hyena')!=undefined?$this.data('hyena'):false;

		/* MERGE DATA FROM DEFAULTS AND THIS GIF -> REASSIGN TO THIS GIF - ADD CURRENT SOURCE AS DATA ATTR */
		$.data($this,$.extend({},Hyena.defaults,!hyData?{}:hyData||{}));
		$this.data('hyena',$.data($this))
		var oD=$this.data().hyena;

		/* SETUP PLAYER SKIN AND HTML */
		oD.control_style=hyData.player_style!=undefined&&hyData.control_style!=undefined?hyData.control_style:oD.player_style;
		$this.wrap('<div class="hyena_player hyena_player_'+oD.player_style+'"><div class="hyena_frame_'+oD.player_style+'"/>');
		var $Player=$this.parents('div.hyena_player:first');
		
		/* CHECK USER SETTINGS */
		if(oD.on_hover){
			oD.controls=false;
			if($.support.Hyena.isTablet)oD.on_hover=false;
		};		
		
		/* TIMER CONTROL */
		oD.timer_on=parseInt(oD.on_timer.split(',')[0],10);
		oD.timer_off=parseInt(oD.on_timer.split(',')[1],10);
		if(oD.timer_on>0){ oD.show_button=false; oD.controls=false; };
		
		/* SETUP OPTIONAL USER CONTROLS */
		if(oD.controls){ 
			$Player.prepend('<div class="hyena_button_wrapper"><img src="assets/images/controls/'+oD.control_style+'_play.png" class="hyena_button" alt="Play GIF"/></div>');
			
			
			/* SETUP HOVER TO SHOW CONTROLS */		
			$Player.on('mouseenter',function(){
				var oD=$(this).find('img.hyena').data().hyena;
				/* SHOW BUTTON */
				$(this).find('img.hyena_button').attr('src',!oD.status?'assets/images/controls/'+oD.control_style+'_play.png':'assets/images/controls/'+oD.control_style+'_stop.png')
				.fadeTo(parseInt(oD.fade_speed.split(',')[0],10),parseFloat(oD.control_opacity.split(',')[1],10));
				
			}).on('mouseleave',function(){
				$(this).find('img.hyena_button')
				.stop(true,false).fadeTo(parseInt(oD.fade_speed.split(',')[1],10),parseFloat(oD.control_opacity.split(',')[0],10));
			});

			/* START/STOP */
			$Player.find('div.hyena_button_wrapper').css('cursor','pointer').on($.support.Hyena.cEv,function(e){			
				if(e.handled!==true){
					var $Player=$(this).parents('div.hyena_player:first'),
						oD=$Player.find('img.hyena').data().hyena;

					if(oD.timer_on>0)return;

					if(!oD.status){ Hyena.Play($Player,oD);
					}else{ Hyena.Stop($Player,oD,$(this)); };
				};
				return false;
			});			



		/* NO CONTROLS - HOVER EVENTS */
		}else if(oD.on_hover){
			
			$Player.on('mouseenter touchstart',function(){
				var $Player=$(this),
					oD=$Player.find('img.hyena').data().hyena;
				if(oD.status)return;
				Hyena.Play($Player,oD);				
			}).on('mouseleave touchend',function(){
				var $Player=$(this),
					oD=$Player.find('img.hyena').data().hyena;
				if(!oD.status)return;
				Hyena.Stop($Player,oD,false);				
			});
			
			
		/* NO CONTROLS - CLICK EVENTS */
		}else{
			/* ADD EVENT TO PLAY GIF ON CLICK */			
			$Player.css('cursor','pointer').on($.support.Hyena.cEv,function(e){
				if(e.handled!==true){
					var $Player=$(this),
						oD=$Player.find('img.hyena').data().hyena;
						
					if(oD.timer_on>0)return;					

					if(!oD.status){ 
						Hyena.Play($Player,oD);
					}else{ 
						Hyena.Stop($Player,oD,false); 
					};
				};
			});			
		};

		/* SETUP CANVAS AND PREP CONTROLS */
		Hyena.Stop($Player,oD,oD.show_button);
	};
},






/* PLAY ANIMATED GIF */
Play:function($Player,oD){
	if(oD.status)return;

	var $GIF=$Player.find('img.hyena'),
		$canvas=$Player.find('canvas');
	/* HIDE CANVAS AND SHOW GIF */
	$canvas[0].style.display='none';
	$GIF[0].style.visibility='visible';
	$GIF[0].style.display='block';
	/* UPDATE CONTROLS */
	if(!$.support.Hyena.isTablet){
		if(oD.controls)$Player.find('img.hyena_button').attr('src','assets/images/controls/'+oD.control_style+'_stop.png');
	}else{
		$Player.find('img.hyena_button').css('opacity',0);
	};

	/* STOP ON OPTIONAL TIMER */
	if(oD.timer_off>0)oD.stopTimer=setTimeout(function(){ clearTimeout(oD.playTimer);	Hyena.Stop($Player,oD,false); },oD.timer_off);

	oD.status=true;	
},






/* PAUSE ANIMATED GIF */
Stop:function($Player,oD,ShowButton){	
	var $GIF=$Player.find('img.hyena'),
   		img=new Image();		

	/* LOAD ANIMATED GIF TO CANVAS (HTML5 GLITCH ONLY SHOWS FIRST FRAME) */
    img.onload=function(){
		if(!$Player.find('canvas').length)$('<canvas/>').insertBefore($GIF);
				
		/* DRAW TO THE CANVAS */
        var canvas=$Player.find('canvas')[0],
        	context=canvas.getContext('2d'),
			W=$GIF.outerWidth(),
			H=$GIF.outerHeight();
		canvas.width=W;
		canvas.height=H;
		canvas.style.display='block';
        context.drawImage(img,0,0,W,H);
		/* SET PLAYER DIMENSIONS AND FADE IN IF INTIAL LOAD */
		$Player.css({'width':W+'px','height':H+'px'});
		if($Player.css('visibility')==='hidden')$Player.css({'visibility':'visible','opacity':0}).animate({'opacity':1},{duration:parseInt(oD.player_fade_speed,10),queue:false});


		/* INITIAL CONTROLS SETUP */
		if(oD.controls){
			var $PlayButton=$Player.find('img.hyena_button');

			/* SET PLAY BUTTON DIMENSIONS BASED ON SHORTEST DIMENSIONS */
			$Player.find('div.hyena_button_wrapper').css({'width':W,'height':H});
			if(W>H){$PlayButton[0].style.width=W*(parseFloat(oD.button_size,10)/100)+'px';				
			}else{$PlayButton[0].style.height=H*(parseFloat(oD.button_size,10)/100)+'px';};

			if(!ShowButton&&!$.support.Hyena.isTablet&&!$.support.Hyena.isMobile){
				$PlayButton[0].style.display='none';
			}else{ 
				$PlayButton.attr('src',!oD.status?'assets/images/controls/'+oD.control_style+'_play.png':'assets/images/controls/'+oD.control_style+'_stop.png');

				/* AVOID RACE CONDITIONS */
				setTimeout(function(){
					$PlayButton.css({'margin-top':(H-$PlayButton.outerHeight())/2+'px','margin-left':(W-$PlayButton.outerWidth())/2+'px'})
					.fadeTo(parseInt(oD.fade_speed.split(',')[0],10),parseFloat(oD.control_opacity.split(',')[1],10));
				},400);
				
			};
		};		
		/* HIDE ANIMATED GIF */
		$GIF[0].style.visibility='hidden';
		$GIF[0].style.display='none';	

		/* PLAY ON OPTIONAL TIMER */
		if(oD.timer_on>0)oD.playTimer=setTimeout(function(){ clearTimeout(oD.stopTimer); Hyena.Play($Player,oD); },oD.timer_on);
    };
    img.src=$GIF.attr('src');
	oD.status=false;		
},
};

$.fn.Hyena=function(method,options){
	if(Hyena[method]){ return Hyena[method].apply(this,Array.prototype.slice.call(arguments,1));
	}else if(typeof method==='object'||!method){ return Hyena.init.apply(this,arguments);
	}else{ $.error('Method '+method+' does not exist'); }
}})(jQuery);


(function(){
	var doc=document,BD=doc.body||doc.documentElement,tS=BD.style,uA=navigator.userAgent.toLowerCase(),check=false,u=undefined;
	$.support.Hyena={
		'cEv':!!('ontouchstart' in window) ? 'touchstart' :'click',		
		'isTablet':uA.match(/iPad|Android|Kindle|NOOK|tablet/i)!==null,
		'isMobile':(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check=true;
		return check;})(uA||navigator.vendor||window.opera)
}})();