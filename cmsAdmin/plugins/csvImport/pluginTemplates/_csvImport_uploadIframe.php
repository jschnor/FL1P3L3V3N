<?php
  // NOTE: This form is based on uploadForm2_iframe.php but modified to be called and displayed through admin.php

  global $CURRENT_USER, $TABLE_PREFIX;

  // Plugin security check
  if (!@$CURRENT_USER)                       { die("You must be logged in to use this feature!"); }
  if (!@$GLOBALS['CURRENT_USER']['isAdmin']) { die("You must be an administrator to use this feature!"); }

  //
  $table           = $GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE']; // hardcoded as it's always the same, ignore: @$_REQUEST['table'];
  $field           = 'csv_upload';                                 // hardcoded as it's always the same, ignore: @$_REQUEST['field'];
  $recordNum       = intval( @$_REQUEST['num'] );
  $preSaveTempId   = @$_REQUEST['preSaveTempId'];
  $submittedForm   = @$_REQUEST['REQUEST_METHOD'] == 'POST' || @$_REQUEST['submitForm'];
  $errorsAndAlerts = '';

  if ($recordNum) {  // if a $recordNum was supplied, ensure that the user owns it before doing anything!
    if (!@$CURRENT_USER) { die("You must login to modify a record!"); }
    $record = mysql_query_fetch_row_assoc("SELECT * FROM {$TABLE_PREFIX}$table WHERE num = '$recordNum'");
    //if (!$record || $record['createdByUserNum'] != $CURRENT_USER['num']) { die("Invalid recordNum"); }
  }

  // error checking
  if (!$recordNum && !$preSaveTempId)        { die("No 'recordNum' or 'preSaveTempId' value was specified!"); }
  if ($submittedForm && !preg_match("/multipart\/form-data/", @$_SERVER['CONTENT_TYPE'])) {
    die("Upload Error: &lt;form&gt; tag must have enctype=\"multipart/form-data\"");
  }

  // save uploads
  foreach (getUploadInfoArrays() as $uploadInfo) { // add uploads
    $errorsAndAlerts .= saveUpload($table, $field, $recordNum, $preSaveTempId, $uploadInfo, $newUploadNums);
  }

  // remove uploads
  if (@$_REQUEST['removeUpload']) { // delete upload
    $uploadNum = @$_REQUEST['removeUpload'];
    removeUpload($uploadNum, $recordNum, $preSaveTempId);
  }

  // load uploads
  $uploads = getUploadRecords($table, $field, $recordNum, $preSaveTempId);

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8" /><?php // Force IE to not use quirks-mode ?>
<title></title>
<style type="text/css">
  body, td { font-family: arial; font-size: 12px; }
</style>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript">

  function submitUploadForm(message) {
    if (message == undefined) { message = "Loading, please wait..."; }
    document.getElementById('uploadField').style.display = 'none'; // hide upload field
    document.getElementById('uploadMessage').innerHTML = message;  // display message
    document.uploadForm.submit();
  }

  function eraseUploadNum(uploadNum) {
    document.uploadForm.removeUpload.value = uploadNum;
    submitUploadForm();
  }

  // resize iframe on load
  $(document).ready(function() {
    autosizeIframe();  // resize on page load
    if (parent.csvImport_updatePreview) { parent.csvImport_updatePreview(); }
  });
  //$(window).load(function()    { autosizeIframe(); }); // resize after all images loaded

  function autosizeIframe() {
    //return false; // disable resizing
    var padding         = 0;
    var contentHeight   = $(document.body).outerHeight(true) + padding;
    //var contentHeight   = $(document).height();
    $(window.frameElement).animate({ height: contentHeight + 'px' }, '100');
  }

  // style upload fields
  $(document).ready(function() {
    var replaceUploadFields = true;
    if (!replaceUploadFields) { return; }
    var uploadTriggerHTML   = "<input type='button' name='null' value='Upload File'/>";
    // NOTE: This works around common browser quirks:
    //       Firefox : Resizing upload fields isn't supported (css width or size="xxx")
    //       IE8     : Clicking on input field gives it focus rather than opening upload dialog and attemps to call onfocus, etc cause security "access denied" errors on upload submit in XP SP2.

    // make upload field transparent, and move off screeen
    var jUploadField = $('input[type=file]');
    jUploadField.css({'background'   : 'transparent',
                      'filter'       : 'alpha(opacity: 0)',
                      '-moz-opacity' : '0.0',
                      'opacity'      : '0.0',      // for debugging set to 0.5
                      'position'     : 'absolute', // allow us to put elements below/on top of field
                      'cursor'       : 'pointer',
                      'top'          : -1000,
                      'left'         : -1000,
                      'z-index'      : '2',        // put this field on top of other fields (even though it's invisible now)
                      'visibility'   : 'visible'   // hide upload field until we style it with style="visiblity: hidden"
                      });

    // add fake upload element
    var jUploadTriggerHTML = $("<span style='border: solid 0px #C00'></span>").html( uploadTriggerHTML ); // add 0px border so IE8 returns height on span instead of 0
    jUploadField.after(jUploadTriggerHTML); // add fake element _below_ upload field

    // on mouse over trigger html put upload button/field under mouse cursor (or off-screen)
    var triggerOffsets = jUploadTriggerHTML.offset();
    var triggerY1 = triggerOffsets.top;
    var triggerY2 = triggerOffsets.top + jUploadTriggerHTML.height();
    var triggerX1 = triggerOffsets.left;
    var triggerX2 = triggerOffsets.left + jUploadTriggerHTML.width();
    $(document).mousemove(function(event) {
      var mouseX          = event.pageX;
      var mouseY          = event.pageY;
      var inTriggerRegion = (triggerX1 <= mouseX && mouseX <= triggerX2) && (triggerY1 <= mouseY && mouseY <= triggerY2);

      // debug
      //document.getElementById('uploadMessage').innerHTML = "MouseX: "+mouseX+", MouseY: "+mouseY+ "<br/>\n"+"TriggerX: "+triggerX1+" to "+triggerX2+ ", TriggerY: "+triggerY1+" to "+triggerY2+ "<br/>\n"+", inTriggerRegion: " +inTriggerRegion+ ",";  // display message

      var offsetTop       = !inTriggerRegion ? -1000 : mouseY - 8;
      var offsetLeft      = !inTriggerRegion ? -1000 : mouseX - jUploadField.width() + 8;
      jUploadField.css({'top': offsetTop, 'left': offsetLeft});
    });

  });
  // END: style upload fields

</script>
</head>
<body style="margin: 0px; padding: 0px;">

<form method="post" name="uploadForm" action="?" enctype="multipart/form-data">
<input type="hidden" name="submitForm"    value="1" />
<input type="hidden" name="_pluginAction" value="<?php echo htmlspecialchars(@$_REQUEST['_pluginAction']) ?>" />
<input type="hidden" name="num"           value="<?php echo $recordNum ?>" />
<input type="hidden" name="preSaveTempId" value="<?php echo $preSaveTempId ?>" />
<input type="hidden" name="removeUpload" id="removeUpload" value="0" />

<div>
    <input type="file" name="<?php echo $field ?>[]" name="<?php echo $field ?>[]" id="uploadField" onchange="submitUploadForm();" size="10"/>
    <span id="uploadMessage" style="clear: both"></span>

    <?php foreach ($uploads as $upload): ?>
      <?php echo $upload['filename'] ?>
      <a href="#" onclick="eraseUploadNum('<?php echo $upload['num'] ?>');">remove</a>
    <?php endforeach ?>

    <?php if (@$errorsAndAlerts): ?>
      <span style="color: #C00; font-weight: bold;"><br/><?php echo $errorsAndAlerts; ?></span>
    <?php endif ?>

</div>

</form>
</body>
</html>
