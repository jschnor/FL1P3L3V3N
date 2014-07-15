<?php
  $fieldname        = @$_REQUEST['fieldName'];
  list($isUploadLimit, $maxUploads, $uploadsRemaining) = getUploadLimits($tableName, $fieldname, @$_REQUEST['num'], @$_REQUEST['preSaveTempId']);

  // error checking
  if (!array_key_exists('fieldName', $_REQUEST)) { die("no 'fieldName' value specified!"); }
  if (!array_key_exists($fieldname, $schema))    { die("Can't find field '" .htmlencode($fieldname). "' in table '" .htmlencode($tableName). "'!"); }
  if ($schema[$fieldname]['type'] != 'upload' && $schema[$fieldname]['type'] != 'wysiwyg') { die("Field '" .htmlencode($fieldname). "' isn't an upload field!"); }
  if ($schema[$fieldname]['type'] == 'wysiwyg' && !@$schema[$fieldname]['allowUploads'])   { die("Wysiwyg field '" .htmlencode($fieldname). "' doesn't allow uploads!"); }
  if (!@$_REQUEST['num'] && !@$_REQUEST['preSaveTempId'])   { die("No record 'num' or 'preSaveTempId' was specified!"); }


  list($uploadDir, $uploadUrl) = getUploadDirAndUrl( $schema[$fieldname] );
  if     (!file_exists($uploadDir)) { mkdir_recursive($uploadDir, 0755); }  // create upload dir (if not possible, dir not exists error will show below)
  if     (!file_exists($uploadDir)) { die("Upload directory '" .htmlencode($uploadDir). "' doesn't exist!"); }
  elseif (!is_writable($uploadDir)) { die("Upload directory '" .htmlencode($uploadDir). "' isn't writable!"); }

  // submit uploads
  if (@$_REQUEST['submitUploads']) {
    submitUploadForm();

    // if this is the flash uploader, report the errors instead of generating a non-flash upload html form
    if (isFlashUploader()) {
      global $errors;
      print "SHOW_FLASH_ERROR: " . $errors;
      exit;
    }
  }


//
function submitUploadForm() {
  global $errors, $menu;
  $isWysiwyg      = @$_REQUEST['wysiwygForm'];

  //
  if ($isWysiwyg) { disableInDemoMode('', 'default/wysiwygUploads.php', false); }
  else            { disableInDemoMode('', 'default/uploadForm.php', false); }

  // remove uploads without record numbers that are older than 1 day
  removeExpiredUploads();

  ### process uploads
  $errors           = '';
  $newUploadNums    = array();
  foreach (array_values($_FILES) as $uploadInfo) {
    $errors .= saveUpload($GLOBALS['tableName'], $_REQUEST['fieldName'], @$_REQUEST['num'], @$_REQUEST['preSaveTempId'], $uploadInfo, $newUploadNums);
  }

  ### Error checking
  if (!$newUploadNums && !$errors) {
    $errors = t("Please select a file to upload.") . "\n";
  }

  ### display errors - errors will automatically be displayed when page is refreshed
  if ($errors) { return; }

  ### On Successful Save
  $isDetailFields = getUploadInfoFields($_REQUEST['fieldName']);
  if ($isWysiwyg) { //
    $errors = "File Uploaded";
  }

  elseif ($isDetailFields) { // redirect to modify upload details page
    $newUploadNumsAsCSV = join(',', $newUploadNums);
    $modifyUrl          = "?menu=$menu"
                        . "&action=uploadModify"
                        . "&fieldName=" . @$_REQUEST['fieldName']
                        . "&num=" . @$_REQUEST['num']
                        . "&preSaveTempId=" . @$_REQUEST['preSaveTempId']
                        . "&uploadNums=$newUploadNumsAsCSV";
    print "<script type='text/javascript'>self.parent.reloadIframe('" . @$_REQUEST['fieldName'] . "_iframe')</script>";  // reload uploadlist
    print "<script type='text/javascript'>window.location='$modifyUrl'</script>";  // go to modify page
    exit;
  }

  else { // reload parent iframe (with upload list)
    print "<script type='text/javascript'>self.parent.reloadIframe('" . @$_REQUEST['fieldName'] . "_iframe')</script>";  // reload uploadlist
    print "<script type='text/javascript'>self.parent.tb_remove();</script>\n";  // close thickbox
    exit;
  }

}





//
function _showWysiwygUploadPreview($row, $maxWidth = 150, $maxHeight = 125) {
  $filename     = pathinfo($row['filePath'], PATHINFO_BASENAME);
  $isImage      = preg_match("/\.(gif|jpg|jpeg|png)$/i", $row['urlPath']);
  $hasThumbnail = $isImage && $row['thumbUrlPath'];

  // get preview size
  if ($isImage) {
    $widthScale   = $maxWidth / $row['width'];
    $heightScale  = $maxHeight / $row['height'];
    $scaleFactor  = min($widthScale, $heightScale, 1);  # don't scale above 1:1
    $previewHeight = ceil($row['height'] * $scaleFactor); # round up
    $previewWidth  = ceil($row['width'] * $scaleFactor);  # round up
  }

  // show preview
  if ($hasThumbnail) {
    print "<a href='{$row['urlPath']}' target='_BLANK'><img src='{$row['thumbUrlPath']}' border='0' width='$previewWidth' height='$previewHeight' alt='' title='Click to view $filename' /></a>\n";
  }
  elseif ($isImage) {
    print "<a href='{$row['urlPath']}' target='_BLANK'><img src='{$row['urlPath']}' border='0' width='$previewWidth' height='$previewHeight' alt='' title='Click to view $filename'  /></a>\n";
  }
  else {
    print "(No Preview)<br/><a href='{$row['urlPath']}' target='_BLANK'>" .t('Download'). "</a>\n";
  }



}

//
function _showLinks($row) {
  $filename     = pathinfo($row['filePath'], PATHINFO_BASENAME);
  $isImage      = preg_match("/\.(gif|jpg|jpeg|png)$/i", $row['urlPath']);
  $hasThumbnail = $isImage && $row['thumbUrlPath'];

  // show insert | remove links
  # NOTE: The space before "addcslashes" is necessary to bypass a Network Solutions FTP uploading issue where files only get partially uploaded if they contain that string
  $removeUrl = "removeUpload('{$row['num']}', '" . addcslashes(htmlencode($filename), '\\\'') . "', this);";
  print "<a href='#' onclick=\"insertUpload('" . addcslashes(htmlencode($row['urlPath']), '\\\'') . "', $isImage)\">" .t('Insert'). "</a> | ";
  print "<a href='#' onclick=\"$removeUrl\">" .t('Delete'). "</a><br/>";

  // show insert thumb links
  $thumbLinks = '';
  foreach (range(1,4) as $num) {
    $fieldname      = "thumbUrlPath" . (($num == 1) ? '' : $num);
    $thumbUrlPath   = $row[$fieldname];
    if (!$thumbUrlPath) { continue; }
    if ($thumbLinks) { $thumbLinks .= " | "; }
    # NOTE: The space before "addcslashes" is necessary to bypass a Network Solutions FTP uploading issue where files only get partially uploaded if they contain that string
    $thumbLinks .= " <a href='#' onclick=\"insertUpload('" . addcslashes(htmlencode($thumbUrlPath), '\\\'') . "', $isImage)\">$num</a>";
  }
  if ($thumbLinks) {
    print t("Thumb:") . $thumbLinks . "<br/>";
  }

  // show filename
  print "<div style='color: #666; padding-top: 1px'>$filename</div>";
}

?>
