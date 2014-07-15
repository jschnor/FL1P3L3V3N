
$(document).ready(function(){ init(); });


//
function init() {
  initSortable(null, updateFieldOrder);

  // register tab click function
  $('.tab').click(function() {
    var hash = this.id;
    window.location.hash = hash.replace(/Tab/, "");
    changeTab(this.id);
  });

  // set default tab
  if (window.location.hash) {
    var tabId = window.location.hash + 'Tab';
    tabId = tabId.replace(/#/, '');
    changeTab(tabId);
  }

  //
  showHideIframeHeight();
  $('[name=_linkTarget]').change(function(){
    showHideIframeHeight();
  });

}

//
function updateFieldOrder(row, table){
  // get new order
  var rows     = table.tBodies[0].rows;
  var newOrder = "";
  for (var i=0; i<rows.length; i++) {
      var order = $("._fieldName", rows[i]).val();
      if (order) {
        if (newOrder != "") { newOrder += ","; }
        newOrder += order;
      }
  }

  // save changes via ajax
  $.ajax({
    url: '?',
    type: "POST",
    data: {
      menu:              'database',
      action:            'editTable',
      tableName:         $('#tableName').val(),
      saveFieldOrder:    1,
      newFieldnameOrder: newOrder // force array to string
    },
    error:  function(XMLHttpRequest, textStatus, errorThrown){
      alert("There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")");
    },
    success: function(msg){ if (msg) { alert("Error: " + msg); }}
  });
}

function changeTab(tabId) {

  // change displayed tab
  $(".tab").removeClass("tabOn"); // disable all tabs
  $("#"+tabId).addClass("tabOn"); // make new tab active

  // change displayed content
  var newTabId = "#"+tabId+"Options";
  $(".options:visible").hide(); // hide all options
  $(newTabId).show(); // show new tab options
}


//
function updateFieldList() {
  var tableName = $('#tableName').val();

  // remove first (if open)
  tb_remove();

  // load fieldList
  var url = "?menu=database&action=editTable&tableName=" +tableName+ "&displayFieldList=1";
  $.ajax({
    url: url,
    async: false, // if we don't do this we get an error right after closing thickbox when saving field
    error:  function(XMLHttpRequest, textStatus, errorThrown){
      alert("Error loading fieldlist!");
    },
    success: function(content){
      $("#fieldlistContainer").html(content);

      // initialize sortable rows
      initSortable(null, updateFieldOrder);

      // initialize thickbox links
      tb_init('a.thickbox, area.thickbox, input.thickbox');
    }
  });

}

//
function addField() {

  // set iframe height
  var iframeHeight = 600;
  var windowHeight = document.documentElement.clientHeight;
  if (windowHeight > 0)   { iframeHeight = parseInt(windowHeight * 0.80); }
  if (iframeHeight < 200) { iframeHeight = 200; }
  if (iframeHeight > 600) { iframeHeight = 600; }

  // get url
  var tablename = $('#tableName').val();
  var fieldname = '';
  var url = "?menu=database&action=editTable&addField=1"
          + "&tableName=" +tablename
          + "&fieldname=" +fieldname
          + "&TB_iframe=true&width=700&height=" + iframeHeight
          + "&modal=true";

  // show thickbox
  var caption    = null;
  var imageGroup = false;
  tb_show(caption, url, imageGroup);
}


//
function quickAddField() {
  var tableName  = $('#tableName').val();
  var fieldName  = $('#fieldName').val();
  var fieldLabel = $('#fieldLabel').val();
  var fieldType  = $('#fieldType').val();

  // error checking


  // save field (and report errors)
  var url = "?menu=database&action=editTable&addField=1&save=1&fieldname=&quickadd=1"
          + "&tableName="    + encodeURIComponent(tableName)
          + "&label="        + encodeURIComponent(fieldLabel)
          + "&newFieldname=" + encodeURIComponent(fieldName)
          + "&type="         + encodeURIComponent(fieldType);
  $.ajax({
    url: url,
    error:  function(msg){ alert("There was an error sending the request!"); },
    success: function(msg){
      if (msg) { alert("Error: " + msg); } // only errors are returned
      else {
        $('#fieldName, #fieldLabel').val(""); // blank out quickadd fields
      }

      // refresh field list
      updateFieldList();

      // focus quick add label field
      document.getElementById('fieldLabel').focus();

    }
  });
}

//
function autoFillQuickAddFieldName() {
  var fieldLabel = $('#fieldLabel').val();
  var fieldName  = fieldLabel;

  fieldName = fieldName.toLowerCase();                     // lowercase
  fieldName = fieldName.replace(/[^a-z0-9\_]/ig, '_');   // replace non-alphanumeric
  fieldName = fieldName.replace(/_+/ig, '_');              // remove duplicate underscores
  fieldName = fieldName.replace(/(^_+|_+$)/ig, '');        // remove leading/trailing underscores

  // special cases
  if (fieldLabel == 'createdDate')      { fieldName = fieldLabel; }
  if (fieldLabel == 'createdByUserNum') { fieldName = fieldLabel; }
  if (fieldLabel == 'updatedDate')      { fieldName = fieldLabel; }
  if (fieldLabel == 'updatedByUserNum') { fieldName = fieldLabel; }
  if (fieldLabel == 'publishDate')      { fieldName = fieldLabel; }
  if (fieldLabel == 'removeDate')       { fieldName = fieldLabel; }
  if (fieldLabel == 'neverRemove')      { fieldName = fieldLabel; }
  if (fieldLabel == 'dragSortOrder')    { fieldName = fieldLabel; }

  $('#fieldName').val(fieldName);

}

//
function modifyField(tablename, fieldname) {

  // set iframe height
  var iframeHeight = 600;
  var windowHeight = document.documentElement.clientHeight;
  if (windowHeight > 0)   { iframeHeight = parseInt(windowHeight * 0.80); }
  if (iframeHeight < 200) { iframeHeight = 200; }
  if (iframeHeight > 600) { iframeHeight = 600; }

  // get url
  var url = "?menu=database&action=editTable&editField=1"
          + "&tableName=" +tablename
          + "&fieldname=" +fieldname
          + "&TB_iframe=true&width=700&height=" + iframeHeight
          + "&modal=true";

  // show thickbox
  var caption    = null;
  var imageGroup = false;
  tb_show(caption, url, imageGroup);
}



//
function confirmEraseField(tablename, fieldname, el) {

  // confirm erase field
  var confirmed = confirm("Are you sure you want to erase this field?\n\n"+fieldname+"\n\nWARNING: ALL FIELD DATA WILL BE LOST!\n");
  if (confirmed) {

    // erase field
    $.ajax({
      url: "?menu=database&action=editTable&eraseField=1&tableName=" +tablename+ "&fieldname=" +fieldname,
      error:  function(msg){ alert("There was an error sending the request!"); },
      success: function(msg){ if (msg) { alert("Error: " + msg); }}
    });

    // remove field html
    $(el).closest('tr').remove(); // remove field html
    updateRowBackgroundColors();
  }
}

function updateRowBackgroundColors() { // NOTE: This function is different from listTable_functions.js
  $("table.sortable tr").removeClass('listRowOdd listRowEven');
  $("table.sortable tr:odd:not(.nodrag)").addClass('listRowOdd');
  $("table.sortable tr:even:not(.nodrag)").addClass('listRowEven');
}

function showHideIframeHeight() {
  var linkTarget = $('[name=_linkTarget]').val();
  if (linkTarget == 'iframe') { $('#iframeHeightSpan').show(); }
  else                        { $('#iframeHeightSpan').hide(); }
}
