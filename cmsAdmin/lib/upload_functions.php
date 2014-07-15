<?php

$GLOBALS['UPLOAD_FILE_PATH_FIELDS'] = array('filePath', 'thumbFilePath', 'thumbFilePath2', 'thumbFilePath3', 'thumbFilePath4');
$GLOBALS['UPLOAD_URL_PATH_FIELDS']  = array('urlPath',  'thumbUrlPath',  'thumbUrlPath2',  'thumbUrlPath3',  'thumbUrlPath4');


//
function addUploadsToRecords(&$rows, $tableName = null, $debugSql = FALSE, $preSaveTempId = null) {
  global $TABLE_PREFIX;

  // get recordNums
  $recordNums = array_pluck($rows, 'num');
  if (!$recordNums) { return; }

  // get tableName from record(s) if not supplied
  if (!$tableName) { $tableName = @$rows[0]['_tableName']; }

  // get upload fields
  $uploadFields = array();
  $uploadFieldsAsCSV = '';
  $schema = loadSchema($tableName);
  foreach ($schema as $fieldname => $fieldSchema) {
    if (!is_array($fieldSchema))           { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata
    if (@$fieldSchema['type'] != 'upload') { continue; }  // skip all but upload fields
    if ($uploadFieldsAsCSV) { $uploadFieldsAsCSV .= ','; }
    $uploadFields[]     = $fieldname;
    $uploadFieldsAsCSV .= "'$fieldname'";
  }

  // load uploads
  $uploadsByNumAndField = array();
  $recordNumsAsCSV      = implode(',', $recordNums);
  if ($uploadFieldsAsCSV) {
    $where   = "tableName = '" .mysql_escape($tableName). "' AND\n";
    $where  .= "fieldName IN ($uploadFieldsAsCSV) AND\n";
    if ($preSaveTempId) { $where  .= "preSaveTempId = '$preSaveTempId'\n"; }
    else                { $where  .= "recordNum IN ($recordNumsAsCSV)\n"; }
    $where  .= " ORDER BY `order`, num";
    if ($debugSql) { print "<xmp>$where</xmp>"; }

    $uploads = mysql_select('uploads', $where);
    foreach ($uploads as $record) {
      _addUploadPseudoFields( $record, $schema, $record['fieldName'] );
      $uploadsByNumAndField[$record['recordNum']][$record['fieldName']][] = $record;
    }
  }

  // add uploads to records
  foreach (array_keys($rows) as $index) {
    $record = &$rows[$index];

    foreach ($uploadFields as $fieldname) {
      $record[$fieldname] = array();
      $uploadsArray    = @$uploadsByNumAndField[$record['num']][$fieldname];
      if ($uploadsArray) { $record[$fieldname] = $uploadsArray; }
    }
  }
}

//
function addUploadsToRecord(&$record, $tableName = null, $debugSql = FALSE, $preSaveTempId = null) {
  if (!$record) { return; }
  $rows = array($record);
  addUploadsToRecords($rows, $tableName, $debugSql, $preSaveTempId);
  $record = $rows[0];
}


// remove a single upload (helper function called by external upload forms)
function removeUpload($uploadNum, $recordNum, $preSaveTempId) {
  global $tableName, $escapedTableName;

  // create where
  $where = mysql_escapef("num = ?", $uploadNum);
  if      ($recordNum)     { $where .= mysql_escapef('AND recordNum     = ?', $recordNum); }
  else if ($preSaveTempId) { $where .= mysql_escapef('AND preSaveTempId = ?', $preSaveTempId); }
  else                     { die("No value specified for 'recordNum' or 'preSaveTempId'!"); }

  removeUploads($where);
}

// remove one or more uploads given a where clause
function removeUploads($where) {
  global $TABLE_PREFIX;

  // remove upload files
  $query  = "SELECT * FROM `{$TABLE_PREFIX}uploads` WHERE $where";
  $result = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $count  = 0;
  while ($row = mysql_fetch_assoc($result)) {

    // get custom upload path
    $schema = loadSchema($row['tableName']);
    list($uploadDir, $uploadUrl) = getUploadDirAndUrl($schema[$row['fieldName']]);


    $count++;
    foreach ($GLOBALS['UPLOAD_FILE_PATH_FIELDS'] as $filePathField) {
      $filepath = addUploadPathPrefix(@$row[$filePathField], $uploadDir); // make path absolute

      if (!$filepath || !file_exists($filepath)) { continue; }
      if (!@unlink($filepath)) {
        $error  = "Unable to remove file '" .htmlencode($filepath). "'\n\n";
        $error .= "Please ask your server administrator to check permissions on that file and directory.\n\n";
        $error .= "The PHP error message was: $php_errormsg\n";
        die($error);
      }
    }
  }
  if (is_resource($result)) { mysql_free_result($result); }

  // remove upload records
  mysql_query("DELETE FROM `{$TABLE_PREFIX}uploads` WHERE $where") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

  return $count;
}

// helper function called by external upload forms
// function assumes upload fields are named after the target field they're for with [] on the end. eg: <input type="file" name="photos[]" />
// Also adds 'fieldname' field to uploadinfo with name of target field
// Ref: http://www.php.net/manual/en/reserved.variables.files.php#89674
function getUploadInfoArrays() {
  $uploadInfoArrays = array();
  foreach (array_keys($_FILES) as $fieldname) {
    foreach (array_keys($_FILES[$fieldname]['name']) as $index) {
      $uploadInfoArrays[] = array(
        '_fieldname' => $fieldname,
        'name'       => $_FILES[$fieldname]['name'][$index],
        'type'       => $_FILES[$fieldname]['type'][$index],
        'tmp_name'   => $_FILES[$fieldname]['tmp_name'][$index],
        'error'      => $_FILES[$fieldname]['error'][$index],
        'size'       => $_FILES[$fieldname]['size'][$index],
      );
    }
  }

  return $uploadInfoArrays;
}


// Save a copy of local file to the uploads table
function saveUploadFromFilepath($tablename, $fieldname, $recordNum, $preSaveTempId, $filepath) {

  // copy local file
  $tmpFilepath = tempnam(DATA_DIR, 'temp_upload_');
  copy($filepath, $tmpFilepath);
  register_shutdown_function('error_reporting', E_ALL ^ E_WARNING); // hide warnings (if file already removed)
  register_shutdown_function('unlink', $tmpFilepath);               // remove temp file on shutdown (do this now so we don't leave an orphan file if we die() with an error

  // fake uploadInfo (like $_FILE would have contained)
  $fakeUploadInfo = array(
    'name'     => basename($filepath), // filename to use when adopting upload
    'tmp_name' => $tmpFilepath,        // filepath to current file
    'error'    => '',                  //
    'size'     => 1,                   // bypass 0-byte size error check
  );
  $errors = saveUpload($tablename, $fieldname, $recordNum, $preSaveTempId, $fakeUploadInfo, $newUploadNums, true);

  //
  return $errors;
}

// Save a form upload, $uploadInfo is $_FILES['upload-form-field-name'], returns errors on fail
// $errors = saveUpload(...);
function saveUpload($tablename, $fieldname, $recordNum, $preSaveTempId, $uploadInfo, &$newUploadNums, $skipUploadSecurityCheck = false) {
  if (!$uploadInfo['name']) { return; } // skip upload field that were left blank (such as when you have 10 upload fields and select files in 2 of them)

  //
  $schema      = loadSchema($tablename);
  $fieldSchema = $schema[$fieldname];
  list($uploadDir, $uploadUrl) = getUploadDirAndUrl($fieldSchema);

  // error checking
  $errors = _saveUpload_getErrors($tablename, $fieldname, $uploadInfo, $recordNum, $preSaveTempId, $skipUploadSecurityCheck);
  if ($errors) { return $errors; }

  // move and rename upload (from system /tmp/ folder to our /uploads/ folder)
  list($saveAsFilename, $saveAsFilepath) = _saveUpload_getSaveAsFilenameAndPath( $uploadInfo['name'], $uploadDir ); // get save-as filename
  if ($skipUploadSecurityCheck) {
    rename_winsafe($uploadInfo['tmp_name'], $saveAsFilepath) || die("Error moving uploaded file! $php_errormsg");
  }
  else {
    move_uploaded_file($uploadInfo['tmp_name'], $saveAsFilepath) || die("Error moving uploaded file! $php_errormsg");
  }

  // Set permissions (make upload readable and writable)
  // Note: Sometimes when upload are create in /tmp/ by PHP they don't the correct read and write permissions
  $permissions = fileperms($saveAsFilepath);
  $isReadable  = (($permissions | 0444) == $permissions); // has read bits for User, Group, and World
  $isWritable  = (($permissions | 0222) == $permissions); // has write bits for User, Group, and World
  if (!$isReadable) {
    chmod($saveAsFilepath, 0666) || die("Error changing permissions on '" .htmlencode($saveAsFilepath). "'! $php_errormsg");
  }

  // check for valid image/file content
  $isValidFileType = true;
  $fileExt         = pathinfo(strtolower($saveAsFilepath), PATHINFO_EXTENSION);
  $imageData       = @getimagesize($saveAsFilepath);
  $imageType       = $imageData[2]; // one of the IMAGETYPE_XXX constants indicating the type of the image.
  if (@$imageData['channels'] == 4) { return sprintf(t("File '%s' isn't valid (CMYK isn't browser-safe)."), htmlencode($uploadInfo['name'])); }

  if ($fileExt == 'gif'  && $imageType != IMAGETYPE_GIF)       { $isValidFileType = false; }
  if ($fileExt == 'png'  && $imageType != IMAGETYPE_PNG)       { $isValidFileType = false; }
  if (in_array($fileExt, array('jpg','jpeg')) &&
      !in_array($imageType, array(IMAGETYPE_JPEG, IMAGETYPE_JPEG2000))) { $isValidFileType = false; }
  if (in_array($fileExt, array('swf','swc')) &&
      !in_array($imageType, array(IMAGETYPE_SWF, IMAGETYPE_SWC))) { $isValidFileType = false; } // v2.50 - .swf files have been observed to return IMAGETYPE_SWC types - https://bugs.php.net/bug.php?id=51700

  if (!$isValidFileType) {
    @unlink($saveAsFilepath);
    $errors .= sprintf(t("File '%s' isn't a valid '%s' file."), htmlencode($uploadInfo['name']), $fileExt);
    $errors .= "<br/>\n";
    return $errors;
  }

  // resize image
  $isImage          = ($imageData[2] == IMAGETYPE_GIF || $imageData[2] == IMAGETYPE_JPEG || $imageData[2] == IMAGETYPE_PNG);
  $resizeIfNeeded   = $isImage && $fieldSchema['resizeOversizedImages'] && $fieldSchema['maxImageHeight'] && $fieldSchema['maxImageWidth'];
  if ($resizeIfNeeded) { saveResampledImageAs($saveAsFilepath, $saveAsFilepath, $fieldSchema['maxImageWidth'], $fieldSchema['maxImageHeight']); }

  // hook for watermarking plugin
  doAction('upload_save', array($tablename, $fieldname, $saveAsFilepath));

  // create thumbnails
  if ($isImage) {
    foreach (_getThumbFieldSuffixes() as $suffix) {
      list($createThumb, $maxHeight, $maxWidth, $thumbSavePath) = _getThumbDetails($suffix, $fieldSchema, $saveAsFilepath);
      if (!$createThumb) { continue; }
      saveResampledImageAs($thumbSavePath, $saveAsFilepath, $maxWidth, $maxHeight);
      doAction('upload_thumbnail_save', array($tablename, $fieldname, $suffix, $thumbSavePath));
    }
  }

  // add to database
  _saveUpload_addToDatabase($tablename, $fieldname, $recordNum, $preSaveTempId, $saveAsFilepath);

  // add to list of new upload nums
  $newUploadNum = mysql_insert_id();
  if ($newUploadNum) {
    if (!is_array($newUploadNums)) { $newUploadNums = array(); }
    array_push($newUploadNums, $newUploadNum);
  }

  // hook for watermarking plugin
  doAction('upload_saved', $tablename, $fieldname, $recordNum, $newUploadNum);

}


// return errors for an individual upload
// $uploadInfo is $_FILES['upload-form-field-name'] // eg: upload1
// Note: upload fieldnames and CMS fieldnames are unrelated.  Upload form may have fields upload1, upload2, etc that all get saved to 'photos' fields
function _saveUpload_getErrors($tableName, $fieldname, $uploadInfo, $recordNum, $preSaveTempId, $skipUploadSecurityCheck = false) {
  // error checking
  if (!$tableName)        { die(__FUNCTION__ . ": No 'tablename' specified!"); }
  if (!$fieldname)        { die(__FUNCTION__ . ": No 'fieldname' specified!"); }
  if (!$uploadInfo)       { die(__FUNCTION__ . ": No 'uploadInfo' specified!"); }

  //
  $errors      = '';
  $schema      = loadSchema($tableName);

  // server issues
  $uploadTmpDir = ini_get('upload_tmp_dir');
  list($uploadDir, $uploadUrl) = getUploadDirAndUrl( $schema[$fieldname] );
  if ($uploadTmpDir && !is_dir($uploadTmpDir)) { $errors .= "Temp Upload dir '$uploadTmpDir' does't exist!  Ask server admin to check 'upload_tmp_dir' setting in php.ini.<br/>\n"; }
  if     (!file_exists($uploadDir))            { $errors .= "Upload directory '" .htmlencode($uploadDir). "' doesn't exist!"; }
  elseif (!is_writable($uploadDir))            { $errors .= "Upload directory '" .htmlencode($uploadDir). "' isn't writable!"; }
  if ($errors) { return $errors; } // return early errors here since nothing else will work otherwise

  // php upload errors
  $encodedFilename = htmlencode($uploadInfo['name']);
  if      ($uploadInfo['error'] == UPLOAD_ERR_INI_SIZE)   { $errors .= "Error saving '$encodedFilename', file is larger than '" .ini_get('upload_max_filesize'). "' max size allowed by PHP (check 'upload_max_filesize' in php.ini).<br/>\n";  }
  else if ($uploadInfo['error'] == UPLOAD_ERR_PARTIAL)    { $errors .= "Error saving '$encodedFilename', file was only partially uploaded.<br/>\n"; }
  else if ($uploadInfo['error'] == UPLOAD_ERR_NO_TMP_DIR) { $errors .= "Error saving '$encodedFilename', PHP temporary upload folder doesn't exist or isn't defined.  Ask your hosting provider to fix this (check 'upload_tmp_dir' in php.ini).<br/>\n"; }
  else if ($uploadInfo['error'] == UPLOAD_ERR_CANT_WRITE) { $errors .= "Error saving '$encodedFilename', can't write to disk (could be disk full or permissions).<br/>\n"; }
  else if ($uploadInfo['error'])                          { $errors .= "Error saving '$encodedFilename', unknown error code ({$uploadInfo['error']}).<br/>\n"; }
  else if (!$skipUploadSecurityCheck && !is_uploaded_file($uploadInfo['tmp_name']))
                                                          { $errors .= "Error saving '$encodedFilename', file wasn't uploaded properly.<br/>\n"; }

  // field type errors
  $fieldSchema        = $schema[$fieldname];
  $encodedLabelOrName = $fieldSchema['label'] ? htmlencode($fieldSchema['label']) : htmlencode($fieldname);
  if ($schema[$fieldname]['type'] != 'upload' && $schema[$fieldname]['type'] != 'wysiwyg') { $errors .= "Field '$encodedLabelOrName' doesn't accept uploads (field type is '{$fieldSchema['type']}').<br/>\n"; }
  if ($schema[$fieldname]['type'] == 'wysiwyg' && !@$schema[$fieldname]['allowUploads'])   { $errors .= "Wysiwyg field '" .htmlencode($fieldname). "' doesn't allow uploads!"; }

  // filesize errors
  $filesizeKbytes     = $uploadInfo['size'] ? (int) ceil( $uploadInfo['size']/1024 ) : 0;
  if ($uploadInfo['size'] == 0 && !$errors) { $errors .= "Error saving '$encodedFilename', file is 0 bytes.<br/>\n"; }
  if ($fieldSchema['checkMaxUploadSize'] &&
      $fieldSchema['maxUploadSizeKB'] < $filesizeKbytes) { $errors .= "File '$encodedFilename' exceeds max upload size (file: {$filesizeKbytes}K, max: {$fieldSchema['maxUploadSizeKB']}K).<br/>\n"; }

  // check allowed extensions
  $fileExt         = pathinfo(strtolower($uploadInfo['name']), PATHINFO_EXTENSION);
  $validExt        = preg_split("/\s*\,\s*/", strtolower($fieldSchema['allowedExtensions']));
  $encodedValidExt = htmlencode( $fieldSchema['allowedExtensions'] );
  if (!in_array('*', $validExt) && !in_array($fileExt, $validExt)) {
    $errors .= sprintf(t("File '%s' isn't allowed (valid file extensions: %s)."), $encodedFilename, $encodedValidExt);
    $errors .= "<br/>\n";
  }

  // check max upload limit
  list($isUploadLimit, $maxUploads, $remainingUploads) = getUploadLimits($tableName, $fieldname, $recordNum, $preSaveTempId);
  if ($isUploadLimit && $remainingUploads <= 0) {
    $errors .= sprintf(t("Skipped '%1\$s', max uploads of %2\$s already reached."), $encodedFilename, $maxUploads);
    $errors .= "<br/>\n";
  }

  //
  return $errors;
}


// list($saveAsFilename, $saveAsFilepath) = _saveUpload_getSaveAsFilename( $uploadInfo['name'], $uploadDir );
function _saveUpload_getSaveAsFilenameAndPath($uploadedAsFilename, $uploadDir) {

  // file names are saved in lower case for better cross platform compatability
  $saveAsBasename = strtolower($uploadedAsFilename);

  // get base filename (without extension)
  $saveAsBasename = pathinfo($saveAsBasename, PATHINFO_BASENAME);
  $saveAsBasename = preg_replace("/\.[^\.]+$/", '', $saveAsBasename);                    // remove ext
  $saveAsBasename = preg_replace("/[^A-Za-z0-9\&\*\(\)\_\-]+/", '-', $saveAsBasename);   // replace invalid chars with
  $saveAsBasename = preg_replace("/-+/", '-', $saveAsBasename);                          // condense duplicate dashes
  $saveAsBasename = preg_replace("/(^-+|-+$)/", '', $saveAsBasename);                    // remove leading and trailing dashes
  if ($saveAsBasename == '') { $saveAsBasename = 'upload'; }                             // default name if no valid chars

  // get extension
  $saveAsExtension = strtolower(pathinfo($uploadedAsFilename, PATHINFO_EXTENSION));

  // add a function to see if the saveAsBasename already exists in the uploads table
  $saveAsBasename  = _saveUpload_checkFileAlreadyUploaded($saveAsBasename,$saveAsExtension,$uploadDir);

  // find unused filename and filepath
  $counter        = '000';
  $saveAsFilename = "$saveAsBasename.$saveAsExtension";
  $saveAsFilepath = "$uploadDir/$saveAsFilename";
  while (file_exists($saveAsFilepath)) {

    // Take the value of the counter and, if it is less than 3 characters, add '0'
    // in front of the value until it is 3 characters long
    $counter        = str_pad(++$counter, 3, '0', STR_PAD_LEFT); // increment counter

    // Set the saveAsFileName as the basename appended with an underscore and the
    // counter value set in the previous line
    $saveAsFilename = "{$saveAsBasename}_$counter.$saveAsExtension";

    // Set the filepath as the uploaddir appended with a forward slash and the
    // filename set in the prvious line
    $saveAsFilepath = "$uploadDir/$saveAsFilename";
  }

  // Remove any extraneous slashes in the filepath
  $saveAsFilepath = preg_replace('/[\\\\\/]+/', '/', $saveAsFilepath); // replace and collapse slashes

  // apply filters
  $saveAsFilename = applyFilters('upload_saveAsFilename', $saveAsFilename, $uploadedAsFilename, $uploadDir);
  $saveAsFilepath = "$uploadDir/$saveAsFilename";

  //
  return array($saveAsFilename, $saveAsFilepath);
}

function _saveUpload_checkFileAlreadyUploaded($fileName,$ext,$uploadDir) {

  // Set the value to be returned as the value just passed in
  $saveAsBaseName     = $fileName;

  // Now, find out if the last four characters match the uploader increment used by the CMS
  $appended           = substr($fileName,-4);

  if ( preg_match("/^_[0-9]{3}$/",$appended) ) {

    // Remove the appended section
    $fileName       = substr($fileName,0,-4);

    // The last four characters match the format we're looking for
    // This may mean this file already exists on the server so check for it
    if ( file_exists("$uploadDir/$fileName.$ext") ) {

      // The file (sans the _000 append) exists so return the filename
      // without the appended section
      $saveAsBaseName = $fileName;

    }

  }

  return $saveAsBaseName;

}


// get the highest order value for an upload field so we can assign a new upload a greater value so it sorts to the bottom
function _saveUpload_getHighestUploadOrder($tablename, $fieldname, $recordNum, $preSaveTempId) {
  global $TABLE_PREFIX;

  // creating query
  $query  = "SELECT MAX(`order`) FROM `{$TABLE_PREFIX}uploads` ";
  $query .= " WHERE tableName = '".mysql_escape( $tablename )."' AND ";
  $query .= "       fieldName = '".mysql_escape( $fieldname )."' AND ";
  if      ($recordNum)     { $query .= "recordNum     = '".mysql_escape( $recordNum )."' "; }
  else if ($preSaveTempId) { $query .= "preSaveTempId = '".mysql_escape( $preSaveTempId )."' "; }
  else                     { die("You must specify either a record 'num' or 'preSaveTempId'!"); }

  // get result
  list($highestOrder) = mysql_get_query($query, true);

  //
  return $highestOrder;
}


//
function _saveUpload_addToDatabase($tablename, $fieldname, $recordNum, $preSaveTempId, $saveAsFilepath) {
  global $TABLE_PREFIX;

  //
  $schema      = loadSchema($tablename);
  $fieldSchema = $schema[$fieldname];
  $order       = 1 + _saveUpload_getHighestUploadOrder($tablename, $fieldname, $recordNum, $preSaveTempId);
  $urlPath     = _getUploadUrlFromPath($fieldSchema, $saveAsFilepath);
  list($width, $height, $type) = @getimagesize($saveAsFilepath);

  list($uploadDir, $uploadUrl) = getUploadDirAndUrl($fieldSchema);

  // create query
  $query =  "INSERT INTO `{$TABLE_PREFIX}uploads` SET \n";
  #$query .= "num = NULL,\n";
  $query .= "createdTime    = NOW(),\n";
  $query .= "`order`        = '" . $order . "',\n";
  $query .= "tableName      = '".mysql_escape( $tablename )."',\n";
  $query .= "fieldName      = '".mysql_escape( $fieldname )."',\n";
  $query .= "recordNum      = '".mysql_escape( (int) $recordNum )."',\n";
  $query .= "preSaveTempId  = '".mysql_escape( $preSaveTempId )."',\n";
  $query .= "filePath       = '".mysql_escape( removeUploadPathPrefix($saveAsFilepath, $uploadDir) )."',\n";
  $query .= "urlPath        = '".mysql_escape( removeUploadPathPrefix($urlPath,        $uploadUrl) )."',\n";
  $query .= "width          = '".mysql_escape( (int) $width )."',\n";
  $query .= "height         = '".mysql_escape( (int) $height )."',\n";
  foreach (_getThumbFieldSuffixes() as $suffix) {
    list($createThumb, $maxHeight, $maxWidth, $thumbSavePath, $thumbUrl, $thumbWidth, $thumbHeight) = _getThumbDetails($suffix, $fieldSchema, $saveAsFilepath);
    if (!file_exists($thumbSavePath)) { $thumbSavePath = ''; $thumbUrl  = ''; } // blank out values if thumb doesn't exist
    $query .= "thumbFilePath$suffix = '".mysql_escape( removeUploadPathPrefix($thumbSavePath, $uploadDir) )."',\n";
    $query .= "thumbUrlPath$suffix  = '".mysql_escape( removeUploadPathPrefix($thumbUrl,      $uploadUrl) )."',\n";
    $query .= "thumbWidth$suffix    = '".mysql_escape( (int) $thumbWidth )."',\n";
    $query .= "thumbHeight$suffix   = '".mysql_escape( (int) $thumbHeight )."',\n";
  }
  $query .= "info1          = '',\n";
  $query .= "info2          = '',\n";
  $query .= "info3          = '',\n";
  $query .= "info4          = '',\n";
  $query .= "info5          = ''\n";

  // insert record
  mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

}

//
function adoptUploads($tableName, $preSaveTempId, $newRecordNum) {
  global $TABLE_PREFIX;

  $query = "UPDATE `{$TABLE_PREFIX}uploads` "
         . "   SET recordNum     = '".mysql_escape($newRecordNum)."', preSaveTempId = '' "
         . " WHERE tableName     = '".mysql_escape($tableName)."' AND "
         . "       preSaveTempId = '".mysql_escape($preSaveTempId)."'";
  mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

  //
  doAction('upload_adopted', $tableName, $newRecordNum);
}

//
function getUploadRecords($tablename, $fieldname, $recordNum, $preSaveTempId = "", $uploadNumsAsCSV = null) {
  global $TABLE_PREFIX;

  //
  $query  = "SELECT * FROM `{$TABLE_PREFIX}uploads` ";
  $query .= " WHERE tableName = '".mysql_escape( $tablename )."' AND ";
  $query .= "       fieldName = '".mysql_escape( $fieldname )."' AND ";

  if      ($recordNum)     { $query .= "recordNum     = '".mysql_escape( $recordNum )."' "; }
  else if ($preSaveTempId) { $query .= "preSaveTempId = '".mysql_escape( $preSaveTempId )."' "; }
  else                     { die("You must specify either a record 'num' or 'preSaveTempId'!"); }
  if ($uploadNumsAsCSV)    { $query .= " AND num IN(".mysql_escape( $uploadNumsAsCSV ).") "; }

  $query .= " ORDER BY `order`, num";
  $records = mysql_select_query($query);

  // add pseudo-fields
  $schema = loadSchema($tablename);
  foreach (array_keys($records) as $index) {
    $record = &$records[$index];
    _addUploadPseudoFields( $record, $schema, $fieldname );
  }

//  showme($records);

  //
  return $records;
}

//
function _addUploadPseudoFields( &$record, $schema, $fieldname ) {

  // get custom upload path
  list($uploadDir, $uploadUrl) = getUploadDirAndUrl($schema[$fieldname]);

  // make paths absolute
  foreach ($GLOBALS['UPLOAD_FILE_PATH_FIELDS'] as $filePathField) {
    $record[$filePathField] = addUploadPathPrefix($record[$filePathField], $uploadDir);
  }
  foreach ($GLOBALS['UPLOAD_URL_PATH_FIELDS'] as $urlPathField) {
    $record[$urlPathField] = addUploadPathPrefix($record[$urlPathField], $uploadUrl);
    $record[$urlPathField] = str_replace(' ', '%20', $record[$urlPathField]); // replace spaces to avoid XHTML validation errors
  }

  $record['filename']     = pathinfo($record['filePath'], PATHINFO_BASENAME);
  $record['extension']    = pathinfo($record['filePath'], PATHINFO_EXTENSION);
  $record['isImage']      = preg_match("/\.(gif|jpg|jpeg|png)$/i", $record['filePath']);
  $record['hasThumbnail'] = $record['isImage'] && $record['thumbUrlPath'];

}

//
function getUploadCount($tableName, $fieldName, $recordNum, $preSaveTempId) {
  global $TABLE_PREFIX;
  $uploadCount = 0;

  // create query
  $where  = "tableName = '".mysql_escape( $tableName )."' AND ";
  $where .= "fieldName = '".mysql_escape( $fieldName )."' AND ";
  if      ($recordNum)     { $where .= "recordNum     = '".mysql_escape( $recordNum )."'"; }
  else if ($preSaveTempId) { $where .= "preSaveTempId = '".mysql_escape( $preSaveTempId )."'"; }
  else { die("You must specify either a record 'num' or 'preSaveTempId'!"); }

  // execute query
  $uploadCount = mysql_count('uploads', $where);

  //
  return $uploadCount;
}


// remove temporary uploads from unsaved records and uploads who's field has been erased
// remove uploads without record numbers that are older than 1 day
function removeExpiredUploads() {
  global $TABLE_PREFIX;

  // List old uploads in database (limit to 25 at a time to avoid timeouts)
  $query  = "SELECT * FROM `{$TABLE_PREFIX}uploads`";
  $query .= " WHERE (recordNum = 0 AND preSaveTempId != '' AND createdTime < (NOW() - INTERVAL 1 DAY)) OR"; // temporary upload for unsaved record more than 1 day old
  $query .= "       fieldName = ''";  // upload from field that was removed
  $query .= " LIMIT 0, 25";
  $result = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_assoc($result)) {

    $schema = loadSchema($row['tableName']);
    list($uploadDir, $uploadUrl) = getUploadDirAndUrl($schema[$row['fieldName']]);

    // remove uploads and thumbnails
    foreach ($GLOBALS['UPLOAD_FILE_PATH_FIELDS'] as $fieldname) {
      @unlink( addUploadPathPrefix( $row[$fieldname], $uploadDir ) );
    }

    // remove record
    mysql_query("DELETE FROM `{$TABLE_PREFIX}uploads` WHERE num = {$row['num']}") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  }
}

// list($uploadDir, $uploadUrl) = getUploadDirAndUrl($fieldSchema);
// v2.50 added $returnBlankOnErrors for ajax previewing of paths
function getUploadDirAndUrl($fieldSchema, $returnOnErrors = false) {
  global $SETTINGS;

  // get upload dir and url
  if (@$fieldSchema['useCustomUploadDir']) {       // if field is configured to use custom upload paths, use them
    $uploadDir = $fieldSchema['customUploadDir'];
    $uploadUrl = $fieldSchema['customUploadUrl'];
    $baseDir   = getAbsolutePath($SETTINGS['uploadDir'], SCRIPT_DIR);  // future: paths for resolving relative dirs and urls

    $baseUrl   = $SETTINGS['uploadUrl'];                               // paths for resolving relative dirs and urls
  }
  else {                                           // default to using global SETTINGS upload paths
    $uploadDir = $SETTINGS['uploadDir'];
    $uploadUrl = $SETTINGS['uploadUrl'];
    $baseDir   = SCRIPT_DIR;                       // paths for resolving relative dirs and urls
    $baseUrl   = '';                               // paths for resolving relative dirs and urls
  }

  $uploadDir = applyFilters('upload_uploadDir', $uploadDir, $fieldSchema);
  $uploadUrl = applyFilters('upload_uploadUrl', $uploadUrl, $fieldSchema);
  doAction('upload_dirAndUrl', $uploadDir, $uploadUrl);
  
  // make uploads paths absolute
  if (!isAbsolutePath($uploadDir)) {
    $uploadDir = realpath("$baseDir/$uploadDir");
    if (!$uploadDir) {
      if (!$returnOnErrors) { die("failed to get realpath of: $baseDir/$uploadDir"); }
    }
    else {
      $uploadDir .= '/'; // realpath doesn't return trailing slash, but we require that for user entered values and expect it in the code
    }
  }

  // make urls absolute, starting with either http:// or /
  if (!isAbsoluteUrl($uploadUrl) && !preg_match("|^/|", $uploadUrl)) {
    $uploadUrl = realUrl($uploadUrl, $baseUrl);
    $uploadUrl = preg_replace("|^\w+://[^/]+|", '', $uploadUrl); // remove scheme://hostname
  }

  return array($uploadDir, $uploadUrl);
}


//
function _getThumbFieldSuffixes() {
  return array('',2,3,4);
}

// list($createThumb, $maxHeight, $maxWidth, $filepath, $urlPath, $width, $height) = _getThumbDetails($thumbFieldSuffix, $fieldSchema);
function _getThumbDetails($suffix, $fieldSchema, $saveAsFilepath) {
  $maxHeight   = @$fieldSchema["maxThumbnailHeight$suffix"];
  $maxWidth    = @$fieldSchema["maxThumbnailWidth$suffix"];
  $createThumb = @$fieldSchema["createThumbnails$suffix"] && $maxHeight && $maxWidth;

  // get filepaths and urls
  $filepath    = preg_replace("|([^/]+)$|", "thumb$suffix/$1", $saveAsFilepath);
  $urlPath     = _getUploadUrlFromPath($fieldSchema, $filepath);
  $urlPath     = preg_replace("|([^/]+)$|", "thumb$suffix/$1", $urlPath);

  // get height and width
  list($width, $height, $type) = @getimagesize($filepath);
  #$isImage = ($type == IMAGETYPE_GIF || $type == IMAGETYPE_JPEG || $type == IMAGETYPE_PNG);

  return array($createThumb, $maxHeight, $maxWidth, $filepath, $urlPath, $width, $height);
}

//
function _getUploadUrlFromPath($fieldSchema, $filepath) {
  list($uploadDir, $uploadUrl) = getUploadDirAndUrl( $fieldSchema );
  $urlPath = preg_replace('/^.+\//', $uploadUrl, $filepath);
  return $urlPath;
}


// list($isUploadLimit, $maxUploads, $remainingUploads) = getUploadLimits($tableName, $fieldName, $num, $preSaveTempId);
// if $maxUploads or $remainingUploads is blank it means unlimited
function getUploadLimits($tablename, $fieldname, $num, $preSaveTempId) {
  $schema      = loadSchema($tablename);
  $fieldSchema = $schema[$fieldname];

  $isUploadLimit    = @$fieldSchema['checkMaxUploads'];
  $maxUploads       = (int) $fieldSchema['maxUploads'];
  $uploadCount      = getUploadCount($tablename, $fieldname, $num, $preSaveTempId);
  $remainingUploads = max($maxUploads - $uploadCount, 0);

  return array($isUploadLimit, $maxUploads, $remainingUploads);
}


// remove all uploads for a record
function eraseRecordsUploads($recordNumsAsCSV) {
  global $tableName;

  //
  if (inDemoMode()) { return; }

  // create query
  $where  = "tableName = '".mysql_escape($tableName)."' AND ";
  $where .= " recordNum IN (".mysql_escape( $recordNumsAsCSV ).")";

  removeUploads($where);
}

// remove a single upload (this is called via ajax and should be renamed in future)
function eraseUpload() {
  global $tableName, $escapedTableName;

  //
  disableInDemoMode('', 'ajax');

  // error checking
  if (!array_key_exists('fieldName', $_REQUEST))     { die("no 'fieldName' value specified!"); }
  if (!array_key_exists('uploadNum', $_REQUEST))     { die("no 'uploadNum' value specified!"); }

  // create where query
  $where = "";
  if      ($_REQUEST['num'])           { $where .= "recordNum     = '".mysql_escape( $_REQUEST['num'] )."' AND "; }
  else if ($_REQUEST['preSaveTempId']) { $where .= "preSaveTempId = '".mysql_escape( $_REQUEST['preSaveTempId'] )."' AND "; }
  else                                 { die("No value specified for 'num' or 'preSaveTempId'!"); }
  $where .= "num       = '".mysql_escape($_REQUEST['uploadNum'])."' AND ";
  $where .= "tableName = '".mysql_escape($tableName)."' AND ";
  $where .= "fieldName = '".mysql_escape($_REQUEST['fieldName'])."'";

  $count = removeUploads($where);

  //
  if ($count == 0) { die("Upload not found!"); }

  // this function is called via ajax, any output will be returns as errors with javascript alert
  exit;
}

// make all upload records use relative paths
function makeAllUploadRecordsRelative() {
  global $TABLE_PREFIX, $SETTINGS;

  // get field list
  $urlOrPathFields = array_merge($GLOBALS['UPLOAD_FILE_PATH_FIELDS'], $GLOBALS['UPLOAD_URL_PATH_FIELDS']);

  // create sql
  $sql = "UPDATE `{$TABLE_PREFIX}uploads` SET";
  foreach ($urlOrPathFields as $fieldname) {
    $isThumb   = preg_match('/thumb/', $fieldname);
    $thumbNum  = intval(substr($fieldname, -1));
    if ($thumbNum == '0') { $thumbNum = ''; }
    $dirPrefix = $isThumb ? "thumb$thumbNum/" : '';

    $setSqlValue  = "CONCAT('$dirPrefix', SUBSTRING_INDEX($fieldname,'/',-1))";

    $sql      .= "\n$fieldname = IF(LENGTH($fieldname), $setSqlValue, $fieldname),";
  }
  $sql = rtrim($sql, ", \n"); // remove trailing commas or whitespace

  //
  mysql_query($sql) or die(__FUNCTION__ ." MySQL Error: ". htmlencode(mysql_error()) ."\n");
}

//
function removeUploadPathPrefix($path, $pathPrefix) {
  $relativePath = str_replace($pathPrefix, '', $path);
  $relativePath = ltrim($relativePath, '/'); // _saveUpload_getSaveAsFilenameAndPath() adds an extra slash between path and filename
  //showme(array(__FUNCTION__, "INPUT: '$path', '$pathPrefix'", "OUTPUT: '$relativePath'"));
  return $relativePath;
}

//
function addUploadPathPrefix($path, $pathPrefix) {
  //showme(array(__FUNCTION__ . " INPUT", $path, $pathPrefix));
  if (!$path) { return $path; }
  $relativePath = removeUploadPathPrefix($path, $pathPrefix);
  $fullPath     = $pathPrefix . $relativePath;
  //showme(array(__FUNCTION__ . " OUTPUT", $fullPath));
  return $fullPath;
}



// for recreating thumbnails from field editor
// called by /lib/menus/database/actionHandler.php
function recreateThumbnails() {
  global $TABLE_PREFIX;
  $tableNameWithoutPrefix = getTablenameWithoutPrefix($_REQUEST['tablename']);

  // error checking
  $stopPrefix = "STOPJS:"; // this tells javascript to stop creating thumbnails
  $requiredFields = array('tablename','fieldname','maxHeight','maxWidth');
  foreach ($requiredFields as $fieldname) {
    if (!@$_REQUEST[$fieldname]) { die($stopPrefix . "Required fieldname '$fieldname' not specified!"); }
  }
  if (preg_match('/[^0-9\_]/i', $_REQUEST['maxHeight'])) { die($stopPrefix . "Invalid value for max height!\n"); }
  if (preg_match('/[^0-9\_]/i', $_REQUEST['maxWidth']))  { die($stopPrefix . "Invalid value for max width!\n"); }

  // get upload count
  static $count;
  if ($count == '') {
    $where = mysql_escapef("tableName = ? AND fieldName = ?", $tableNameWithoutPrefix, $_REQUEST['fieldname']);
    $totalUploads = mysql_count('uploads', $where);
  }

  // load upload
  $whereEtc  = mysql_escapef("tableName = ? AND fieldname = ?", $tableNameWithoutPrefix, $_REQUEST['fieldname'] );
  $whereEtc .= " LIMIT 1 OFFSET " . intval($_REQUEST['offset']);
  @list($upload) = mysql_select('uploads', $whereEtc);

  //
  if ($upload) {

    // get uploadDir and uploadUrl
    $schema = loadSchema( $upload['tableName'] );
    list($uploadDir, $uploadUrl) = getUploadDirAndUrl($schema[ $upload['fieldName'] ]);

    // get upload's absolute filepath
    $absoluteFilepath = addUploadPathPrefix($upload['filePath'], $uploadDir); // make path absolute

    // error checking
    if (!file_exists($absoluteFilepath)) {
      $error  = "Upload doesn't exist '$absoluteFilepath'!<br/>\n";
      $error .= "Found in: {$upload['tableName']}, {$upload['fieldName']}, record {$upload['recordNum']}.";
      die($error);
    }

    ### resize image
    $isImage = preg_match("/\.(gif|jpg|jpeg|png)$/i", $absoluteFilepath);
    if ($isImage) {
      $thumbNum      = $_REQUEST['thumbNum'];
      $thumbSavePath = preg_replace("|([^/]+)$|", "thumb$thumbNum/$1", $absoluteFilepath);
      $thumbUrlPath  = preg_replace("|([^/]+)$|", "thumb$thumbNum/$1", $upload['urlPath']);

      // erase old thumbnail
      if (file_exists($thumbSavePath)) {
        @unlink($thumbSavePath) || die("Can't erase old thumbnail '$thumbSavePath': $php_errormsg");
      }

      // create new thumbnail
      list($thumbWidth, $thumbHeight) = saveResampledImageAs($thumbSavePath, $absoluteFilepath, $_REQUEST['maxWidth'], $_REQUEST['maxHeight']);
      doAction('upload_thumbnail_save', array($tableNameWithoutPrefix, $_REQUEST['fieldname'], $thumbNum, $thumbSavePath));

      // update upload database
      $query  =  "UPDATE `{$TABLE_PREFIX}uploads`\n";
      $query .= "   SET `thumbFilepath$thumbNum` = '".mysql_escape( removeUploadPathPrefix($thumbSavePath, $uploadDir) )."',\n";
      $query .= "       `thumbUrlPath$thumbNum`  = '".mysql_escape( removeUploadPathPrefix($thumbUrlPath,  $uploadUrl) )."',\n";
      $query .= "       `thumbWidth$thumbNum`    = '".mysql_escape( $thumbWidth )."',\n";
      $query .= "       `thumbHeight$thumbNum`   = '".mysql_escape( $thumbHeight )."'\n";
      $query .= " WHERE num = '".mysql_escape( $upload['num'] )."'";
      mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
    }

  }

  // print status message
  $offset = $_REQUEST['offset'] + 1;
  if ($offset <= $totalUploads) { print "$offset/$totalUploads"; }
  else                          { print "done"; }
  exit;
}

// showUploadPreview($uploadRecord, 50, 100);
// Outputs a thumbnail image link (or "download" text link if the upload is not an image) best fit to the specified dimensions.
// This function will choose the smallest available thumb (or the fullsize image) to be downscaled to fit the target size, while preserving the
// aspect ratio. If the fullsize image is smaller than the target size, the fullsize image will be used without scaling it up.
function showUploadPreview($uploadRecord, $maxWidth = 50, $maxHeight = null) {
  if ($maxWidth && !$maxHeight) { $maxHeight = $maxWidth * 2; } // legacy 2-argument support

  // find the biggest image or thumb with the least scaling
  list($bestSrc, $bestWidth, $bestHeight, $bestSize, $bestScaledBy) = array('', 0, 0, 0, 0);
  $isImage = preg_match("/\.(gif|jpg|jpeg|png)$/i", $uploadRecord['urlPath']);
  if ($isImage) {
    foreach (range(0, 4) as $thumbNum) {
      if     ($thumbNum === 0) { list($widthField, $heightField, $urlField) = array('width', 'height', 'urlPath'); }
      elseif ($thumbNum === 1) { list($widthField, $heightField, $urlField) = array('thumbWidth', 'thumbHeight', 'thumbUrlPath'); }
      else                     { list($widthField, $heightField, $urlField) = array("thumbWidth$thumbNum", "thumbHeight$thumbNum", "thumbUrlPath$thumbNum"); }

      // skip images with no height or width
      if (!@$uploadRecord[$widthField] && !@$uploadRecord[$heightField]) { continue; }
      
      // calculate dimensions of scaling this image or thumbnail (do not allow scaling-up)
      list($resizeWidth, $resizeHeight, $resizeScale) = image_resizeCalc($uploadRecord[$widthField], $uploadRecord[$heightField], $maxWidth, $maxHeight);
      
      // when calculating sizes, longest run (width or height) is more appropriate than width * height, since rounding errors can cause the minor
      // axis to deviate by 1 pixel (e.g. a 10x150 image, thumbnailed to 100x100 and 64x64, will resize to 50x50 as 50x4 and 50x3 respectively; the
      // 64x64 thumb should be chosen, even though its minor axis is one pixel smaller than the 100x100 thumb)
      $resizeSize = max($resizeWidth, $resizeHeight); 
      
      // if this resized image/thumb is the biggest, or if it's the same size but requires less scaling (meaning that the original thumb is smaller)
      // Note: Multiple thumbs that are larger than maxHeight/maxWidth will have similar resized height/width but different resizing scales,
      // ... we want to select the image that needs to be scaled down the least, since we're not scaling the image itself but the height/width in
      // ... the image tag.  We want to load the image that is closest in size to reduce bandwidth required.
      if ($resizeSize > $bestSize || ($resizeSize === $bestSize && $resizeScale > $bestScaledBy)) {
        $bestSrc = $uploadRecord[$urlField];  // keep track of best match
        list($bestWidth, $bestHeight, $bestSize, $bestScaledBy) = array($resizeWidth, $resizeHeight, $resizeSize, $resizeScale);
      }
    }
  }
  
  // output preview html
  $aLink        = urlencodeSpaces($uploadRecord['urlPath']);
  $title        = htmlencode( $uploadRecord['filename'] );

  print "<a href='$aLink' title='$title' target='_BLANK'>";
  if ($isImage && $bestSrc) { print "<img src='$bestSrc' border='0' width='$bestWidth' height='$bestHeight' alt='$title' title='$title' />"; }
  else                      { print t('download'); }
  print "</a>\n";
  
}

