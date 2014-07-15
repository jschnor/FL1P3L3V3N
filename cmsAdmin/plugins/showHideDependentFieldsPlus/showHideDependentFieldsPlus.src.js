
/* !!!!!! YOU SHOULDN'T NEED TO EDIT THIS FILE !!!!!! SETTINGS ARE IN CONFIG.PHP !!!!!! REFER TO README.TXT !!!!!! */

(function($){
	var debugOn = false;
	var dbObj = window.showHideDependentFieldsPlusDbObj;

	function update(srcEl,parents) { 
		// console.log('update run');
		// console.log(srcEl);
		// console.log(parents);

		if(!dbObj) return;
		var sn=srcEl.name; // just a shortcut
		var sid = srcEl.id; // just a shortcut

		if(in_array(sn, parents)) return; // avoid looping

		// get defined values. first try by name, then by id (separators)
		if(sn) {
			var definedValsArr = dbObj[sn] ? dbObj[sn] : dbObj[sn.replace(/\[\]$/,'')]; // second part accounts for multi-el naming. eg, checkbox[], select-multiple[]
		} else if(sid) {
			var definedValsArr = dbObj[sid] ? dbObj[sid] : false; 
		}
		if(!definedValsArr) return;

		$.each(definedValsArr, function(defValStr, defValElmArr) { if(typeof defValElmArr == 'String') definedValsArr[defValStr] = [defValElmArr]; }); // just in case

		// gather the current value(s) of matching dom elements
		var elValsArr = [];

		var fieldType = srcEl.type;
		// check for custom field types
		// check for wysiwig
		var tinyMCEObj = window.tinyMCE ? window.tinyMCE : window.tinymce;  // cms builder v2.6+ uses tinyMCE, older versions use tinymce
		var wysiwygId = $('textarea[name="'+sn+'"]').attr('id');
		var wysiwygEd = wysiwygId && tinyMCEObj ? tinyMCEObj.get(wysiwygId) : false;
		if(wysiwygEd && wysiwygEd.length) fieldType = 'wysiwyg';
		// check for separator
		else if($(srcEl).attr('rel') && $(srcEl).attr('rel').match(/(^| )separator( |$)/i)) fieldType = 'separator';

		switch(fieldType) {
			case 'wysiwyg':
				var wysiwygContent = tinyMCEObj.get(wysiwygId).getContent();
				if((!wysiwygEd.isHidden() && wysiwygContent)?true:false) elValsArr.push(wysiwygContent);
				break;
			case 'separator':
				if($(srcEl).css('display')!='none') elValsArr.push( $(srcEl).css('display') );
				break;
			case 'select': 
			case 'select-one': 
			case 'select-multiple':
				domObjArr = $('*[name="'+sn+'"],*[name="'+sn+'[]"],*[name^="'+sn+':"]');
				$('option',domObjArr).filter(':selected').each(function(){ if(this.value) elValsArr.push(this.value); });
				break;
			case 'checkbox': 
			case 'radio':
				$('*[name="'+sn+'"],*[name="'+sn+'[]"],*[name^="'+sn+':"]').each( function() {
					if(this.checked) elValsArr.push(this.value);
				});
				break;
			default:
				// if(this.type!='hidden' && this.value) elValsArr.push(this.value);
		}
		
		// if nothing has a value, apply "_none_"
		// if something has a value, but there is no definition for it, apply "_any_value_"
		// if(!elValsArr.length) {
		// 	console.log(elValsArr.length);
		// 	elValsArr=['_none_'];
		// }
		// else { 
		// 	var valFound = 0;
		// 	$.each(elValsArr,function(i,v){if(definedValsArr[v])valFound=1});
		// 	if(!valFound) elValsArr=['_any_value_'];
		// }
		if(!elValsArr.length) {
			elValsArr=['_none_'];
			
		}
		else { 
			var valFound = 0;
			$.each(elValsArr,function(i,v){if(definedValsArr[v])valFound=1});
			if(!valFound) elValsArr=['_any_value_'];
		}

		
		/*
			// you have to first get a list of elements to show, then go through all defined elements to avoid
			// hiding something from one value that is shown by another.  Example:
			'table' => array(
				'field_name' => array(
					'value1' => array('field2','field3'),
					'value2' => array('field3','field4'),
				),
			),
			// if value of field_name is 'value1', then without first building a list of "shows", the script
			// would first show field2 and field3, then hide field3 and field4
		*/

		// for each value found, see if it has elements to show.  if so, add each element to the show array
		var showArr = [];
		$.each(elValsArr, function(i,elValStr) { 
			if(definedValsArr[elValStr])
				$.each(definedValsArr[elValStr], function(j,showElNameStr) {
					showArr.push(showElNameStr);
				});
		});
		
		// go through all defined values and show/hide any fields they specify
		var procElmObjArr = procElmNamArr = [];
		$.each(definedValsArr, function(definedValStr, elmsArr) { 
			$.each(elmsArr, function(i, elNameStr) {
				var domElm = $('*[name="'+elNameStr+'"],*[name="'+elNameStr+'[]"],*[name^="'+elNameStr+':"],#'+elNameStr+'_iframe,tr#'+elNameStr+'[rel~="separator"]');
				if(!domElm) return true; // just in case
				if(in_array(elNameStr,showArr)) { // active value, show field
					domElm.closest('TR').css('display','table-row');
					$('tr#'+elNameStr).show(); // separator hack
				} else { // inactive value, hide field
					$('tr#'+elNameStr).hide(); // separator hack
					domElm.closest('TR').css('display','none');
				}
				domElm.each( function() { procElmObjArr.push(this); } );
				parents.push(elNameStr);
			});
		});
		for(var i in procElmObjArr) update(procElmObjArr[i], parents);
	}
	
	function in_array(needle, haystack) { return jQuery.inArray(needle,haystack) > -1; }
	function tinyMCEChange(ed) { $('#'+ed.id).change(); }
	function debug(msg) { if(debugOn && window.console) console.log(msg); }

	// initialize
	$(function() { 
		for(fieldName in dbObj) $('[name="'+fieldName+'"],[name="'+fieldName+'[]"]').bind('change',function(){ update(this,[])}).change();
	});
	if(window.tinyMCE) tinyMCE.onAddEditor.add(function(mgr,ed){ed.onChange.add(tinyMCEChange)});  // cms builder v2.6+
	if(window.tinymce) tinymce.onAddEditor.add(function(mgr,ed){ed.onChange.add(tinyMCEChange)});  // older versions of cms builder
	
})(jQuery);
