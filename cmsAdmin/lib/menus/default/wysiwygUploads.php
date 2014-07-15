<?php
  global $tableName, $errors, $schema, $isUploadLimit, $uploadsRemaining, $maxUploads;
  require_once "lib/menus/default/uploadForm_functions.php";

  $errors .= alert();
?>
<!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
  <script src="3rdParty/tiny_mce/tiny_mce_popup.js"></script>
  <script src="3rdParty/tiny_mce/utils/mctabs.js"></script>
  <script src="3rdParty/tiny_mce/utils/form_utils.js"></script>
  <link rel="stylesheet" type="text/css" href="3rdParty/tiny_mce/themes/advanced/skins/default/dialog.css" />
  <style type="text/css">
    .photobox {
      border: 1px solid #666; padding: 5px; margin: 5px;
      font-size: 9px; text-align: center;
      float: left;
      background-color: #EEE
    };
  </style>
  <base target="_self" />
 </head>

<body style="display: none">

<form method="post" action="?" enctype="multipart/form-data">
<input type="hidden" name="_defaultAction" value="wysiwygUploads" />
<input type="hidden" name="menu"          value="<?php echo htmlencode($tableName); ?>" />
<input type="hidden" name="fieldName"     value="<?php echo htmlencode(@$_REQUEST['fieldName']) ?>" />
<input type="hidden" name="num"           value="<?php echo htmlencode(@$_REQUEST['num']) ?>" />
<input type="hidden" name="preSaveTempId" value="<?php echo htmlencode(@$_REQUEST['preSaveTempId']) ?>" />
<input type="hidden" name="submitUploads" value="1" />
<input type="hidden" name="wysiwygForm"   value="1" />

<div class="tabs">
  <ul>
    <li id="tab1" class="current">
      <span><a href="javascript:mcTabs.displayTab('tab1','tab1_panel');" onmousedown="return false;">Uploaded Files</a></span>
    </li>
  </ul>
</div>

<div class="panel_wrapper" style="padding: 0px; margin-bottom: 10px;">

  <div id="tab1_panel" class="panel current" style="height: auto; width: auto; padding: 5px;">

    <div style="padding: 10px 0px; text-align: center;">

      Upload New
      <input type="file" name="upload1" value='' size="60" />
      <input class="button" type="submit" name="submit" value="Upload" /><br/>

      <?php if (@$errors): ?>
        <div style="font-weight: bold; color: #C00; padding-top: 5px;"><?php echo @$errors ?></div>
      <?php endif ?>
    </div>

    <div style="border-bottom: 1px dotted #919B9C; margin: 0px 5px 5px 0px;"></div>

    <?php
      $fieldSchema = $schema[$_REQUEST['fieldName']];
      $records = getUploadRecords($tableName, $_REQUEST['fieldName'], @$_REQUEST['num'], @$_REQUEST['preSaveTempId'], null);
      foreach ($records as $row):
    ?>

      <div class="photobox">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr><td valign="middle" align="center" width="160" height="120"><?php _showWysiwygUploadPreview($row, 150, 113); ?></td></tr>
          <tr><td height="15"><?php _showLinks($row); ?></td></tr>
        </table>
      </div>

    <?php endforeach ?>

    <div style="padding: 50px 0px; text-align: center; display: none; float: none" class="noUploads">
      There are no uploads for this field yet.
    </div>

   <br clear="all" />
   <div></div><!-- IE7 ignores br clear=all unless we have something here -->

  </div>
</div><!-- /panel_wrapper -->

  <script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script>window.jQuery || document.write('<script src="3rdParty/jquery-1.11.0.min.js"><\/script>')</script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script><script>jQuery.migrateWarnings || document.write('<script src="3rdParty/jquery-migrate-1.2.1.min.js"><\/script>')</script>
<script><!--

$(document).ready(function(){
  showHideNoUploadsMessage();
});

function showHideNoUploadsMessage() {

  if ($(".photobox").size() == 0) { $(".noUploads").show(); }
  else                             { $(".noUploads").hide(); }

}

function removeUpload(uploadNum, filename, rowChildEl) {

  // confirm erase
  var confirmMessage = "<?php printf(t("Remove file: %s"), '" +filename+ "') ?>";
  if (!confirm(confirmMessage)) { return; }

  // erase record
  var eraseUrl = "?menu=<?php echo urlencode($tableName) ?>"
               + "&action=uploadErase"
               + "&fieldName=<?php echo urlencode($_REQUEST['fieldName']) ?>"
               + "&uploadNum=" + uploadNum
               + "&num=<?php echo urlencode(@$_REQUEST['num']) ?>"
               + "&preSaveTempId=<?php echo urlencode(@$_REQUEST['preSaveTempId']) ?>";

  $.ajax({
    url: eraseUrl,
    error:  function(msg){ alert("There was an error sending the request!"); },
    success: function(msg){
      if (msg) { return alert("Error: " + msg); };

      // erase row html
      $(rowChildEl).parents(".photobox").remove();

      showHideNoUploadsMessage();
    }
  });

  return false;
}



function insertUpload(newValue, isImage) {

  var browseType   = tinyMCEPopup.getWindowArg("browseType");
  var parentWindow = tinyMCEPopup.getWindowArg("parentWindow");
  var inputFieldId = tinyMCEPopup.getWindowArg("inputFieldId");

  // error checking
  if (browseType == 'image' && !isImage) {
    alert("You can only insert images in this popup!");
    return false;
  }

  // insert information now
  parentWindow.document.getElementById(inputFieldId).value = newValue;

  // for image browser: update image dimensions
  if (parentWindow.ImageDialog) {
    parentWindow.ImageDialog.resetImageData();

    if (parentWindow.ImageDialog.getImageData)     { parentWindow.ImageDialog.getImageData() };
    if (parentWindow.ImageDialog.showPreviewImage) { parentWindow.ImageDialog.showPreviewImage(newValue) };
  }

  // close popup window
  tinyMCEPopup.close();
}

//--></script>


</form>
</body>
</html>
