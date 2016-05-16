Class(function ErrorLog() {
    
    var _self = this;
    
    this.send = function(errorobj){
    	console.log(errorobj);
    	
        Ajax.post(window.location.protocol+'//'+window.location.host+'/wp-content/plugins/rm-error-log-viewer/log-error.php', { json: JSON.stringify(errorobj) }, function(response){
        	// console.log(response);
        });
    };
    
}, 'static');