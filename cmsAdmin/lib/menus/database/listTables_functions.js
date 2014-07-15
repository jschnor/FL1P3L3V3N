
$(document).ready(function(){ init(); });


//
function init() {
  initSortable(null, updateTableOrder);
}

// redirectViaPost: just like `window.location=`, but uses POST
function redirectViaPost(targetUrl, data) {
	var form           = document.createElement("form");
	form.method        = "POST";
	form.action        = targetUrl;
	form.style.display = "none";
	for (var k in data) {
		var field   = document.createElement("textarea");
		field.name  = k;
		field.value = data[k];
		form.appendChild(field);
	}
	document.body.appendChild(form);
	form.submit();
	return form;
}

//
function updateTableOrder(row, table){	
      // get new order
      var rows       = table.tBodies[0].rows;
      var tableNames = '';
      for (var i=0; i<rows.length; i++) {
          var thisName = $("._tableName", rows[i]).val();
          if (thisName) {
            if (tableNames != '') { tableNames += ','; }
            tableNames += thisName;
          }
      }

      // update order
      redirectViaPost('?', {
        menu:     'database',
        action:   'listTables',
        newOrder: tableNames
  });

}

//
function confirmEraseTable(tableName) {

  var isConfirmed = confirm("Delete this menu?\n\nWARNING: All data will be lost!\n ");
  if (isConfirmed) {
    window.location="?menu=database&action=editTable&dropTable=1&tableName=" + tableName;
  }
}

//
function addNewMenu(tablename, fieldname) {

  // set iframe height
  var iframeHeight = 475;
  var windowHeight = document.documentElement.clientHeight;
  if (windowHeight < 200) { iframeHeight = 200; }

  // get url
  var url = "?menu=database&action=addTable"
          + "&TB_iframe=true&width=700&height=" + iframeHeight
          + "&width=" + 625
          + "&modal=true";

  // show thickbox
  var caption    = null;
  var imageGroup = false;
  tb_show(caption, url, imageGroup);
}
