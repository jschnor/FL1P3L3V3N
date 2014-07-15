
$(document).ready(function(){
  init();
});

function init() {

  // BUG FIX - In Firefox document.ready (above) fires before thickbox shows the iframe
  // and this causes all the hidden fields not to show.  So as a work-around we try to
  // make a hidden field visible and test if that works, if it doesn't we set a timer
  // and try again after a short delay.
  if (! $('#firefoxFix:visible').length) {
    $('body').append('<div id="firefoxFix" style="display: none"></div>');
  }
  $('#firefoxFix').show();
  if (! $('#firefoxFix:visible').length) {
    setTimeout(function(){ init() }, 250);
    return false;
  }

  // show field options for selected field
  displayOptionsForFieldType('fast');
  displayListTypeOptions();
  initHideShowAdvanced();
  initSubmitFormWithAjax();
  showSpecialFieldDescription();
  updateDefaultDateFields();

  return true;
}

//
function initHideShowAdvanced() {

  // show all
  $('.showLink, .sectionClosedMessage').click( function() {
    $(".sectionClosedMessage:visible").slideUp('normal', function() {
      $(".showLink").hide();
      $(".hideLink").show();
      $(".container").slideDown('normal');
      document.cookie = "showAdvancedFieldEditorOptions=1"; // remember setting for this browser session
    });
  });

  // hide all
  $('.hideLink').click( function() {
    $(".container:visible").slideUp('normal', function() {
      $(".hideLink").hide();
      $(".showLink").show();
      $(".sectionClosedMessage").slideDown('normal');
      document.cookie = "showAdvancedFieldEditorOptions=0"; // remember setting for this browser session
    });
  });
}

//
function initSubmitFormWithAjax() {

  $('#editFieldForm').ajaxForm({
//    beforeSubmit:  formErrorChecking,        // pre-submit callback
    success:       function(responseText) {  // post-submit callback - close window

      // show errors
      if (responseText != '') {
        alert(responseText);
      }

      // if save & copy
      else if ($('#saveAndCopy').val() == 1) {
        $('#saveAndCopy').val('0');      // reset save and copy value (so save works)
        $('#fieldname').val('');         // blank out "old" fieldname so saving creates new field and doesn't change old field
        $('#order').remove();            // remove order so new order value is assigned
        $('#label').val("Copy of " + $('#label').val());
        alert("Saved");
      }

      // close thickbox
      else if (self.parent.tb_remove) {
        self.parent.tb_remove();
        self.parent.updateFieldList();  // automatically closes thickbox
      }

      // debugging
      else {
        alert("Form submitted!");
        window.location.reload();
      }
    },
    error:  function(XMLHttpRequest, textStatus, errorThrown){
      alert("There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")");
    }
  });

  return false;
}

// autofill fieldname for quickadd form
function autoFillBlankFieldName() {
  var fieldLabel    = $('#label').val();
  var oldFieldName  = $('#fieldname').val();
  if (oldFieldName != '') { return; } // don't update if old fieldname already defined

  var fieldName = fieldLabel;
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

  $('#newFieldname').val(fieldName);

}

//
function updateListOptionsFieldnames(tablename) {

  // error checking
  if (tablename == "") { return alert("You must select a tablename!"); }

  // get field pulldowns
  var selectElements = [
    document.getElementById('optionsValueField'),
    document.getElementById('optionsLabelField'),
  ];

  //
  for (var sIndex=0; sIndex<selectElements.length; sIndex++) {
    var selectEl = selectElements[sIndex];

    // remove fieldnames
    while (selectEl.length > 1) { selectEl.remove(1); }

    // add new fieldnames
    var fieldnames = tablesAndFieldnames[tablename];
    for (var fIndex=0; fIndex<fieldnames.length; fIndex++) {
      var fieldname = fieldnames[fIndex];
      var newOption = new Option(fieldname, fieldname);
      selectEl.options[selectEl.options.length] = newOption;
    }
  }
  return false;
}


// show valid options on page load and when fieldtype is changed
function displayOptionsForFieldType(fast) {

  // show selected elements
  var fieldType = $("#fieldType").val();
  var showList;

  // show options based on field type
  if      (fieldType == 'none')           { showList = ".noOptions, .noValidationRules"; }
  else if (fieldType == 'textfield')      { showList = ".defaultValue, .fieldPrefix, .description, .fieldWidth, .isPasswordField, .requiredValue, .uniqueValue, .minMaxLength, .validationRule, .customColumnType, .indexed"; }
  else if (fieldType == 'textbox')        { showList = ".defaultContent, .fieldPrefix, .description, .textboxHeight, .disableAutoFormat, .requiredValue, .uniqueValue, .minMaxLength, .customColumnType, .indexed"; }
  else if (fieldType == 'wysiwyg')        { showList = ".defaultContent, .fieldPrefix, .description, .textboxHeight, .allowUploads, .requiredValue, .uniqueValue, .minMaxLength, .uploadValidationFields, .advancedUploadDir, .customColumnType, .indexed"; }
  else if (fieldType == 'date')           { showList = ".dateOptions, .fieldPrefix, .description, .requiredValue, .uniqueValue, .indexed"; }
  else if (fieldType == 'list')           { showList = ".defaultValue, .listOptions, .fieldPrefix, .description, .requiredValue, .uniqueValue, .customColumnType, .indexed"; }
  else if (fieldType == 'checkbox')       { showList = ".checkboxOptions, .fieldPrefix, .description, .noValidationRules, .indexed"; }
  else if (fieldType == 'upload')         { showList = ".fieldPrefix, .description, .requiredValue, .uploadValidationFields, .advancedUploadFields, .advancedUploadDir"; }
  else if (fieldType == 'custom')         { showList = ".noOptions, .noValidationRules"; }
  else if (fieldType == 'separator')      { showList = ".separatorOptions, .noValidationRules"; }
  /* advanced fields */
  else if (fieldType == 'relatedRecords') { showList = ".relatedRecordsOptions, .noValidationRules"; }
  else if (fieldType == 'parentCategory') { showList = ".noOptions, .noValidationRules, .indexed"; }
  /* debugging fields */
  else if (fieldType == 'all')            { showList = ".fieldOption"; }
  /* unknown fields */
  else                                    { alert("unknown field type '" +fieldType + "'"); }

  // show options based on table name
  var tableName = $("#tableName").val();
  if (tableName == 'accounts') { showList += ", .myAccountField"; }

  // set slide speed
  var slideSpeed = 'normal';
  if (fast) { slideSpeed = 1; }

  // open sections - slide up, toggle fields, then slide down
  $("#fieldOptionsContainer, #validationRulesContainer, #advancedOptionsContainer").filter(':visible').slideUp(slideSpeed, function() {
    $(this).children(".fieldOption").hide();
    $(this).children(showList).show();
    $(this).slideDown(slideSpeed);
  });

  // closed sections - toggle fields for when section is next opened
  $("#fieldOptionsContainer, #validationRulesContainer, #advancedOptionsContainer").filter(':hidden').each(function() {
    $(this).children(".fieldOption").hide();
    $(this).children(showList).show();
  });

  // disable/enable fields
  if (fieldType == 'separator') { $("#label, #newFieldname").attr('disabled', 'disabled'); }
  else                          { $("#label, #newFieldname").removeAttr('disabled'); }
}

function displayListTypeOptions() {
  // hide all listType options
  $('#optionsTextDiv, #optionsTable, #optionsQueryDiv').hide();

  // show selected listType option
  var optionsType = $('#optionsType').val();
  if (optionsType == 'text')  { $('#optionsTextDiv').show(); }
  if (optionsType == 'table') { $('#optionsTable').show(); }
  if (optionsType == 'query') { $('#optionsQueryDiv').show(); }
}


function showSpecialFieldDescription() {

  var fieldname   = $('#newFieldname').val();
  var description = "";

  if      (fieldname == 'num')              { description = "<b>Special Fieldname:</b> 'num' is used to uniquely identify records."; }
  else if (fieldname == 'createdDate')      { description = "<b>Special Fieldname:</b> 'createdDate' stores the date the record was created."; }
  else if (fieldname == 'createdByUserNum') { description = "<b>Special Fieldname:</b> 'createdByUserNum' stores 'num' of user who created record."; }
  else if (fieldname == 'updatedDate')      { description = "<b>Special Fieldname:</b> 'updatedDate' stores the date the record was last updated."; }
  else if (fieldname == 'updatedByUserNum') { description = "<b>Special Fieldname:</b> 'updatedByUserNum' stores 'num' of user who last updated record."; }
  else if (fieldname == 'publishDate')      { description = "<b>Special Fieldname:</b> 'publishDate' stores the date the record should be published on website."; }
  else if (fieldname == 'removeDate')       { description = "<b>Special Fieldname:</b> 'removeDate' stores the date the record should be removed from the website."; }
  else if (fieldname == 'neverRemove')      { description = "<b>Special Fieldname:</b> 'neverRemove' indicates the record shouldn't be removed after 'removeDate' date."; }
  else if (fieldname == 'hidden')           { description = "<b>Special Fieldname:</b> 'hidden' indicates the record shouldn't be displayed on website."; }
  else if (fieldname == 'dragSortOrder')    { description = "<b>Special Fieldname:</b> 'dragSortOrder' allows user to drag records in editor list to change their order."; }

  $('#specialFieldDescription').html(description);
}

//
function recreateThumbnails(num) {

  // create query string
  var url = "?";
  url += "menu=database&";
  url += "action=recreateThumbnails&";
  url += "tablename=" + escape($('#tableName').val()) + "&";
  url += "fieldname=" + escape($('#fieldname').val()) + "&";
  url += "maxHeight=" + escape($('#maxThumbnailHeight'+num).val()) + "&";
  url += "maxWidth="  + escape($('#maxThumbnailWidth'+num).val()) + "&";
  url += "thumbNum="  + num + "&";
  url += "offset=";

  // set defaults
  if (!recreateThumbnails['offset'+num])       { recreateThumbnails['offset'+num]       = 0; }
  if (!recreateThumbnails['totalUploads'+num]) { recreateThumbnails['totalUploads'+num] = 'unknown'; }
  $('#recreateThumbnailsErrors'+num).html(''); // clear errors (if clicking 'recreate' multiple times)

  // resize images
  // uncomment to debug
  // window.location = url + recreateThumbnails['offset'+num];
  // return;

  $.ajax({
    url:     url + recreateThumbnails['offset'+num],
    error:   function(msg){ return alert("There was an error sending the request!"); },
    success: function(msg){
      // on finish
      if (msg == 'done') {
        $('#recreateThumbnailsStatus'+num).html("(done)");
        recreateThumbnails['offset'+num]       = 0;
        recreateThumbnails['totalUploads'+num] = 0;
        return;
      }

      // on success - get total uploads
      if (msg.match(/^\d+\/\d+$/g) ) {
        recreateThumbnails['totalUploads'+num] = (msg.split('/'))[1];
      }

      // on error - display last error
      else {
        var regexp      = /^STOPJS:/; // this error prefix tells the thumbnailing routine to stop
        var stopOnError = msg.match(regexp);
        msg = msg.replace(regexp, '');

        $('#recreateThumbnailsErrors'+num).html("Last Error ("+recreateThumbnails['offset'+num]+"): " +msg+ "<br/>\n");
        if (stopOnError) { return; }
      }


      // update status
      var status = '(' +recreateThumbnails['offset'+num]+ '/' +recreateThumbnails['totalUploads'+num]+ ')';
      $('#recreateThumbnailsStatus'+num).html(status);

      // process next image
      recreateThumbnails['offset'+num]++;
      recreateThumbnails(num);
    }
  });
}

//
function updateDefaultDateFields() {

  // show/hide defaultDateString
  var isCustomDate = ($('#defaultDate').val() == 'custom');
  if (isCustomDate) { $('#defaultDateStringAndLink:hidden').show(); }
  else              { $('#defaultDateStringAndLink:visible').hide(); }

  // create query string
  var url = "?";
  url += "menu=database&";
  url += "tablename="         + escape($('#tableName').val()) + "&";
  url += "fieldname="         + escape($('#fieldname').val()) + "&";
  url += "action="            + "previewDefaultDate&";
  url += "defaultDate="       + escape($('#defaultDate').val()) + "&";
  url += "defaultDateString=" + escape($('#defaultDateString').val()) + "&";

  // update date preview
  $('#defaultDatePreview').text('Loading...');
  $.ajax({
    url:     url,
    error:   function(msg) { return alert("There was an error sending the request!"); },
    success: function(msg) { $('#defaultDatePreview').text(msg); }
  });

}
