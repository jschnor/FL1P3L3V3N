<?php
/*
Plugin Name: CSV Import
Description: Import CSV files to create and/or update records in your existing sections.
Version: 1.04
Requires at least: 2.13
*/

### DON'T UPDATE ANYTHING BELOW THIS LINE

$GLOBALS['CSV_IMPORT_DEFAULTS'] = array(
  'USE_COLUMN_HEADERS'   => 1,             // 1 or 0
  'TARGET_TABLE'         => '',
  'USE_ID_FIELD'         => 0,             // 1 or 0
    'ID_FIELD'           => '',
    'UPDATE_DUPLICATES'  => 0,             // 1 or 0
    'REMOVE_ORPHANS'     => 0,             // 1 or 0
  'WIPE_DATABASE'        => 0,             // 1 or 0
    'SET_AUTO_INCREMENT' => 0,             // 1 or 0
    'NEW_AUTO_INCREMENT' => '1',           // starting record number
);

// Import Options Page: This list is checked for determining out default mappings of column names to target fields
$GLOBALS['CSV_IMPORT_DEFAULTS']['FIELD_MAP'] = array(
  'Product Code/SKU'    => 'sku',
  'Product Name'        => 'name',
  'Product Description' => 'description',
  'Price'               => 'retail_price',
//  '*'                   => 'specifications', // all other unmatched fields
);

// $GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE']
$GLOBALS['CSV_IMPORT_OPTIONS'] = array(
  'ENCODING'              => 'CP1252', // CP1252, ASCII, ISO-8859-1 - More: http://php.net/manual/en/mbstring.supported-encodings.php
  'JOBS_TABLE'            => '_csv_import_jobs',
  'DATA_TABLE'            => '_csv_import_data',
  'CSV_DELIMITER'         => ',',

  'PREFIX_VALUES_FOR'     => array(''),               // values imported into these target fields will be prefixed with their column name
  'PREFIX_SEPARATOR'      => ': ',                    // this is added after the prefix
  'MULTI_VALUE_SEPARATOR' => "\n",                    // if multiple values are inserted into a single field they will be joined with this
);

// These user defined functions are called before passing data to mysql.  This is for stripping non-numeric data, etc.
$GLOBALS['CSV_IMPORT_OPTIONS']['FIELD_FILTERS'] = array(
//  'wholesale_price' => '_csvFilter_force_float',
//  'retail_price'    => '_csvFilter_force_float',
);
function _csvFilter_force_float($string) { return (float) preg_replace('/[^0-9\.]/', '', $string); }

// Uncomment this line to show the skipValidation checkbox
//$GLOBALS['CSV_IMPORT_ALLOW_SKIPVALIDATION'] = true;


// register callbacks
addAction('admin_postlogin',       'csvImport_init',           null, 0);
addAction('admin_postlogin',       '_csvImport_pluginSetup_createSchemas', null, 0); // set priority to 0 so this runs first

// CMS: add plugin hooks & handlers
pluginAction_addHandlerAndLink('Import CSV File', 'csvImport_uploadForm', true);
pluginAction_addHandler('csvImport_uploadForm_uploadIframe', 'admins');
pluginAction_addHandler('csvImport_previewData_ajax',         'admins');
pluginAction_addHandler('csvImport_analyseForm',             'admins');
pluginAction_addHandler('csvImport_analyseForm_ajax',        'admins');
pluginAction_addHandler('csvImport_optionsForm',             'admins');
pluginAction_addHandler('csvImport_validateForm',            'admins');
pluginAction_addHandler('csvImport_importForm',              'admins');
pluginAction_addHandler('csvImport_importForm_ajax',         'admins');

//
ini_set('auto_detect_line_endings', true); // client data is uploaded with mac line-endings


// Execute plugin actions
function csvImport_init() {
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();
  if (!$GLOBALS['CURRENT_USER']['isAdmin'])     { return; } // only allow admin access
  if (@$_REQUEST['_plugin'] != $thisPluginPath) { return; } // only run for this plugin

  // show plugin menu as highlighted
  $_REQUEST['menu']   = 'admin';
  $_REQUEST['action'] = 'plugins';

  // set delimiter for CSV parsing (done in csvImport_init and _csvImport_loadImportJob)
  if (@$_REQUEST['fileFormat'] == 'csvg') { $GLOBALS['CSV_IMPORT_OPTIONS']['CSV_DELIMITER'] = ';'; }

}


//
function csvImport_uploadForm() {
  global $TABLE_PREFIX;
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();

  // set preSaveTempId for new uploads
  $preSaveTempId   = @$_REQUEST['preSaveTempId'] ? $_REQUEST['preSaveTempId'] : uniqid('x');
  $recordNum       = intval( @$_REQUEST['num'] );
  $uploads         = getUploadRecords($GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'], 'csv_upload', $recordNum, $preSaveTempId);

  // save record
  if (@$_REQUEST['submitForm']) {

    // error checking
    $errors = '';
    if ($_SERVER['REQUEST_METHOD'] != 'POST') { $errors .= "Form method must be POST!<br/>\n"; }
    if (!@$_REQUEST['preSaveTempId'])         { $errors .= "No preSaveTempId set!<br/>\n"; }
    if (!$uploads)                            { $errors .= "You must upload a CSV file to import!<br/>\n"; }
    if (!@$_REQUEST['targetTable'])           { $errors .= "You must specify a section to import into!<br/>\n"; }
    if ($errors) { alert($errors); }

    // save record
    if (!$errors) {

      // get columnNamesMap
      $columnNamesMap = '';
      if (@$_REQUEST['hasColumnHeaders']) {
        $csvFilepath    = @$uploads[0]['filePath'];
        $columnNames    = _csvParser_getColumnNames($csvFilepath);
        $columnNamesMap = _csvImport_arrayToFieldMap($columnNames);
      }

      //
      mysqlStrictMode(false); // disable Mysql strict errors for when a field isn't defined below (can be caused when fields are added later)
      $query = "INSERT INTO `{$TABLE_PREFIX}{$GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE']}` SET
                    updatedDate      = NOW(),
                    updatedByUserNum = '" .intval( @$CURRENT_USER['num'] ). "',

                    fileFormat       = '" .mysql_escape( @$_REQUEST['fileFormat'] ). "',
                    hasColumnHeaders = '" .mysql_escape( @$_REQUEST['hasColumnHeaders'] ). "',
                    targetTable      = '" .mysql_escape( $_REQUEST['targetTable'] ). "',
                    columnNamesMap   = '" .mysql_escape( $columnNamesMap ). "'";
      mysql_query($query) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");
      $recordNum = mysql_insert_id();

      // adopt temp uploads (IMPORTANT - DON'T FORGET THIS STEP!!!)
      adoptUploads($GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'], $preSaveTempId, $recordNum);
      removeExpiredUploads(); // erase old expired uploads

      // redirect to next page
      $nextAction  = 'csvImport_analyseForm';
      $nextPageUrl = "?_plugin=$thisPluginPath&_pluginAction=$nextAction&num=$recordNum";
      redirectBrowserToURL($nextPageUrl);
      exit;
    }

  }

  // show form
  _csvImport_showHeader();
?>

    <input type="hidden" name="_pluginAction" value="csvImport_uploadForm" />
    <input type="hidden" name="preSaveTempId" value="<?php echo $preSaveTempId ?>" />


      <div style="font-weight: bold; color: #C00; text-align: center; padding: 5px">
        Warning: Be sure to
        <a href="?menu=admin&action=general#backupTable" style="color: #C00; text-decoration: underline">backup your database</a>
        before importing any records!<br/><br/>
      </div>

      <table cellspacing="0" width="100%">
        <tr>
          <!-- If there's alignment issues just use style="vertical-align: middle" instead -->
          <td style="vertical-align: top; padding-top: 5px;">Import CSV File &nbsp;</td>
          <td>
            <?php
              $iframeUrl  = pluginAction_getLink('csvImport_uploadForm_uploadIframe');
              $iframeUrl .= "&amp;num=$recordNum";
              $iframeUrl .= "&amp;preSaveTempId=$preSaveTempId";
            ?>
            <iframe src='<?php echo $iframeUrl ?>' height='26' width='600' frameborder='0' scrolling='no'>
            </iframe>
          </td>
        </tr>

        <tr>
          <td>File Format</td>
          <td>
            <?php
              $valuesToLabels = getListOptions('_csv_import_jobs', 'fileFormat');
              $optionsHTML    = getSelectOptions(@$_REQUEST['fileFormat'], array_keys($valuesToLabels), array_values($valuesToLabels), false);
            ?>
            <select name="fileFormat" onchange="csvImport_updatePreview()"><?php echo $optionsHTML ?></select>
          </td>
        </tr>

        <tr style="display: none">
          <td>Column Headers</td>
          <td>
            <?php if (!array_key_exists('hasColumnHeaders', $_REQUEST)) { $_REQUEST['hasColumnHeaders'] = $GLOBALS['CSV_IMPORT_DEFAULTS']['USE_COLUMN_HEADERS']; } ?>
            <?php $_REQUEST['hasColumnHeaders'] = 1; // always use this for now ?>
            <label><input type="checkbox" name="hasColumnHeaders" value="1" <?php checkedIf(@$_REQUEST['hasColumnHeaders'], 1) ?>
                          style="vertical-align: baseline" onclick="csvImport_updatePreview()" />
            Use the first line of import file as column names</label>
          </td>
        </tr>
        <tr>
         <td>Target Table &nbsp;</td>
         <td>
          <?php
            $valuesToLabels = array();
            $selectedValue  = array_key_exists('targetTable', $_REQUEST) ? $_REQUEST['targetTable'] : $GLOBALS['CSV_IMPORT_DEFAULTS']['TARGET_TABLE'];
            foreach (getSortedSchemas() as $tablename => $schema) {
              if ($tablename[0] == '_') { continue; }
              if (@$schema['menuType'] == 'menugroup') { continue; }
              if (@$schema['menuType'] == 'link')      { continue; }
              $valuesToLabels[$tablename] = "$tablename ({$schema['menuName']})";
            }
            asort($valuesToLabels);
            $optionsHTML  = getSelectOptions($selectedValue, array_keys($valuesToLabels), array_values($valuesToLabels), true);
          ?>
          <select name="targetTable">
            <?php echo $optionsHTML ?>
          </select>
         </td>
        </tr>

        <tr>
         <td>&nbsp;</td>
         <td><br/><input type="submit" name="" value="Analyse Data &gt;&gt;"  class='button'/></td>
        </tr>
      </table>

      <div class='content-box content-box-divider' id="previewHeader">
        <div class='content-box-header'><h3>Live Preview</h3></div>
      </div>

      <div style="height: 50px; overflow: auto" id="previewContent">
        <div style="padding: 10px; text-align: center">Upload file to see preview...</div><br/>
      </div>

    </div><!-- End .content-box-content -->
    </form>
  </div><!-- End .content-box -->

  <?php
  showFooter();
  exit;
}



//
function csvImport_uploadForm_uploadIframe() {
  require_once("pluginTemplates/_csvImport_uploadIframe.php");
  exit;
}


//
function csvImport_previewData_ajax() {
  $recordNum        = @$_REQUEST['num'];
  $preSaveTempId    = @$_REQUEST['preSaveTempId'];
  $hasColumnHeaders = @$_REQUEST['hasColumnHeaders'];
  $hasColumnHeaders = @$_REQUEST['hasColumnHeaders'];

  // load import record (if applicable)
  if ($recordNum) {
    $importJob = _csvImport_loadImportJob($recordNum); // this also sets CSV_DELIMITER
  }

  // load CSV upload
  $uploads = getUploadRecords($GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'], 'csv_upload', $recordNum, $preSaveTempId);
  $csvFilepath = @$uploads[0]['filePath'];

  // error checking
  if     (!$csvFilepath)              { exit; } // return nothing for ajax functions
  elseif (!file_exists($csvFilepath)) { die("Import file doesn't exist!"); }

  // get preview data
  $previewRows    = array();
  $maxPreviewRows = 12;
  $maxCols        = 0;
  foreach (range(1, $maxPreviewRows) as $rowNum) {
    list($colValues, $offset) = _csvParser_getNextLine($csvFilepath);
    if (!$offset) { break; }
    $previewRows[] = $colValues;
    $maxCols       = max($maxCols, count($colValues));
  }

  // show preview table header
  $columnNames = ($hasColumnHeaders) ? array_shift($previewRows) : array();
  print "<table cellspacing='0' cellpadding='0' class='data withBorders'>\n";
  print "  <thead>\n";
  print "    <tr style='white-space: nowrap'>\n";
  foreach (range(1, $maxCols) as $colNum) {
    $columnName = array_shift($columnNames);
    print "    <td style='font-size: 13px; padding: 0 10px; text-align: center'>Column #$colNum<br/><b>" .htmlspecialchars($columnName). "</b></td>\n";
  }
  print "    </tr>";
  print "  </thead>";

  // show preview rows
  foreach ($previewRows as $row) {
    print "    <tr>\n";
    foreach (range(1, $maxCols) as $colNum) {
      $colValue = array_shift($row);
      print "    <td>" .htmlspecialchars($colValue). "</td>\n";
    }
    print "    </tr>\n";
  }

  // show preview table footer
  print "</table>";
  exit;

}



//
function csvImport_analyseForm() {
  global $TABLE_PREFIX;
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);

  // on submit...
  if (@$_REQUEST['submitForm']) {

    // error checking
    $errors = '';
    if ($_SERVER['REQUEST_METHOD'] != 'POST') { $errors .= "Form method must be POST!<br/>\n"; }
    if ($errors) { alert($errors); }

    // save record
    if (!$errors) {
      $query = "UPDATE `{$TABLE_PREFIX}{$GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE']}` SET
                    updatedDate      = NOW(),
                    updatedByUserNum = '" .intval( @$CURRENT_USER['num'] ). "',

                    columnCount      = '" .mysql_escape( @$_REQUEST['columnCount'] ). "',
                    recordCount      = '" .mysql_escape( @$_REQUEST['recordCount'] ). "'
                WHERE num = '" .intval( $recordNum ). "'";
      mysql_query($query) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");

      // redirect to next page
      $nextAction  = 'csvImport_optionsForm';
      $nextPageUrl = "?_plugin=$thisPluginPath&_pluginAction=$nextAction&num=$recordNum";
      redirectBrowserToURL($nextPageUrl);
      exit;
    }
  }

  //
  $goBackURL = "?_plugin=$thisPluginPath&_pluginAction=csvImport_uploadForm&num=" . $importJob['num'];

  // show form
  _csvImport_showHeader();
?>

    <input type="hidden" name="_pluginAction" value="csvImport_analyseForm" />
    <input type="hidden" name="num" id="num"  value="<?php echo (int) $importJob['num'] ?>" />
    <input type="hidden" name="recordCount" id="recordCount" value="0" /><?php // this is updated by ajax/js ?>
    <input type="hidden" name="columnCount" id="columnCount" value="0" /><?php // this is updated by ajax/js ?>
    <input type="hidden" name="currentOffset" id="currentOffset" value="0" /><?php // this is updated and used by ajax/js only ?>

    <script type="text/javascript">
      $(document).ready(function(){
        csvImport_analyseFile();
      });
    </script>

      <table cellspacing="0">
        <tr style="line-height: 1.5">
          <td width="125">Import File &nbsp;</td>
          <td><?php echo basename($csvFilepath); ?></td>
        </tr>
        <tr style="line-height: 1.5">
          <td>Column Headers &nbsp;</td>
          <td><?php echo $importJob['hasColumnHeaders:text']; ?></td>
        </tr>
        <tr style="line-height: 1.5">
         <td>Target Table &nbsp;</td>
         <td><?php echo htmlspecialchars($importJob['targetTable']) ?></td>
        </tr>

        <tr><td colspan="2">&nbsp;</td></tr>

        <tr>
          <td>Analysing Data</td>
          <td>
            <ul>
              <li>Status: <span id="status">Loading...</span></li>
              <li>Total Records: <span id="recordCountText">0</span></li>
              <li>Total Columns: <span id="columnCountText">0</span></li>
            </ul>


         </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>

        <tr id="pleaseWait">
          <td>&nbsp;</td>
          <td style="text-align: center; font-weight: bold; font-size: 14px">Please wait...</td>
        </tr>

        <tr id="bottomButtons" style="display: none">
         <td>&nbsp;</td>
         <td>
            <input type="button" name="" value="&lt;&lt; Go Back"     class='button' onclick="window.location='<?php echo $goBackURL ?>'"/>
            <input type="submit" name="" value="Choose Options &gt;&gt;" class='button' />
         </td>
        </tr>

      </table>



    </div><!-- End .content-box-content -->
    </form>
  </div><!-- End .content-box -->

  <?php
  showFooter();
  exit;
}


//
function csvImport_analyseForm_ajax() {
  $dataTable = $GLOBALS['TABLE_PREFIX'] . $GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE'];
  $setOffset = (int) @$_REQUEST['offset'];
  $rowNum    = (int) @$_REQUEST['rowNum'];

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);

  // remove any old import record for this job before we start
  if (!$setOffset) {
    $deleteQuery = mysql_escapef("DELETE FROM `$dataTable` WHERE jobNum = ?", $recordNum);
    mysql_query($deleteQuery) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");
  }

  // skip column headers
  if ($importJob['hasColumnHeaders'] && !$setOffset) { _csvParser_getNextLine($csvFilepath); } // skip column headers

  // get max packet size from mysql
  $maxQueryLen = coalesce(array_value(mysql_query_fetch_row_array('show variables like "max_allowed_packet"'), 1), 1024 * 1024);

  // import next line(s)
  $maxRowsPerBatch = 100;
  $batchCounter    = 0;
  $done            = false;
  $insertValues    = '';
  $maxColumnCount  = 0;

  $insertQuery     = "INSERT INTO `$dataTable` (`jobNum`, `rowNum`, `colNum`, `colValue`) VALUES ";
  $insertQueryLen  = strlen($insertQuery);

  while (!$done && $batchCounter < $maxRowsPerBatch) {
    if ($batchCounter > 0) { $rowNum++; }
    $batchCounter++;

    list($colValues, $offset) = _csvParser_getNextLine($csvFilepath, $setOffset);
    $maxColumnCount = max($maxColumnCount, count($colValues));
    $done = (!$colValues && !$offset); // no results means end of file
    if ($done) { break; }

    // add insert values
    $newInsertValues = '';
    foreach ($colValues as $index => $value) {
      $colNum          =  $index + 1;
      $newInsertValues .= mysql_escapef("(?,?,?,?),\n", $recordNum, $rowNum, $colNum, $value);
    }

    // if this row would push us past $maxQueryLen, stop!
    $insertQueryLen  += strlen($newInsertValues);
    if ($insertQueryLen > $maxQueryLen) {
      if ($batchCounter == 1) { die("Import error: Row $rowNum is larger than your database allows. Ask your server admin to increase MySQL's 'max_allowed_packet' setting (currently '$maxQueryLen' bytes)!"); }
      $rowNum--; // we'll process this row in the next batch
      break;
    }

    // add row
    $insertValues .= $newInsertValues;
  }

  // import row(s)
  if ($insertValues) {
    $insertValues = chop($insertValues, ",\n"); // remove trailing comma
    $insertQuery .= $insertValues;
    mysql_query($insertQuery) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");
  }

  //
  print json_encode(array(
    'offset'      => $offset,
    'columnCount' => $maxColumnCount,
    'lastRowNum'  => $rowNum,
    'done'        => $done,
  ));
  exit;

}


//
function csvImport_optionsForm() {
  global $TABLE_PREFIX;
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();

  // set defaults
  if (!array_key_exists('useIdField', $_REQUEST))       { $_REQUEST['useIdField']       = $GLOBALS['CSV_IMPORT_DEFAULTS']['USE_ID_FIELD']; }
  if (!array_key_exists('idField', $_REQUEST))          { $_REQUEST['idField']          = $GLOBALS['CSV_IMPORT_DEFAULTS']['ID_FIELD']; }
  if (!array_key_exists('updateDuplicates', $_REQUEST)) { $_REQUEST['updateDuplicates'] = $GLOBALS['CSV_IMPORT_DEFAULTS']['UPDATE_DUPLICATES']; }
  if (!array_key_exists('removeOrphans', $_REQUEST))    { $_REQUEST['removeOrphans']    = $GLOBALS['CSV_IMPORT_DEFAULTS']['REMOVE_ORPHANS']; }
  if (!array_key_exists('wipeDatabase', $_REQUEST))     { $_REQUEST['wipeDatabase']     = $GLOBALS['CSV_IMPORT_DEFAULTS']['WIPE_DATABASE']; }
  if (!array_key_exists('setAutoIncrement', $_REQUEST)) { $_REQUEST['setAutoIncrement'] = $GLOBALS['CSV_IMPORT_DEFAULTS']['SET_AUTO_INCREMENT']; }
  if (!array_key_exists('newAutoIncrement', $_REQUEST)) { $_REQUEST['newAutoIncrement'] = $GLOBALS['CSV_IMPORT_DEFAULTS']['NEW_AUTO_INCREMENT']; }

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);
  $formValues = _csvImport_getFormValues($importJob, $_REQUEST);

  // get target table fields and counts
  list($targetTableFieldsToFieldSchemas, $targetTableColumnCount, $targetTableRecordCount) = _csvImport_getTargetTableDetails( $importJob['targetTable'] );

  // on submit...
  if (@$_REQUEST['submitForm']) {

    function __isDefinedTargetField($key) { return (preg_match("/^targetFieldForCol/", $key) && @$_REQUEST[$key]); }
    $definedTargetFieldsCount = count(array_filter(array_keys($_REQUEST), '__isDefinedTargetField'));

    function __isThisTheIdField($key) { return (@$_REQUEST['idField'] && preg_match("/^targetFieldForCol/", $key) && @$_REQUEST[$key] == $_REQUEST['idField']); }
    $idFieldMapCount = count(array_filter(array_keys($_REQUEST), '__isThisTheIdField'));

    // error checking
    $errors = '';
    if     ($_SERVER['REQUEST_METHOD'] != 'POST') { $errors .= "Form method must be POST!<br/>\n"; }
    if (@$_REQUEST['useIdField']) {
      if     (!@$_REQUEST['updateDuplicates'] &&
              !@$_REQUEST['removeOrphans'])      { $errors .= "Use ID Field: This setting isn't useful unless you select 'Update Duplicate' or 'Remove Orphans'.<br/>\n"; }
      elseif (!@$_REQUEST['idField'])            { $errors .= "Use ID Field: You must select a fieldname.<br/>\n"; }
      elseif (!$idFieldMapCount)                 { $errors .= "Use ID Field: You must select the ID Field as one of the target fields under 'Map Fields'.<br/>\n"; }
      elseif ($idFieldMapCount > 1)              { $errors .= "Use ID Field: ID Field is mapped more than once under 'Map Fields'.<br/>\n"; }
    }
    if (!@$_REQUEST['useIdField']) {
      if (@$_REQUEST['idField'])                 { $errors .= "ID Fieldname: You must select 'Use ID Field' to use this feature.<br/>\n"; }
      if (@$_REQUEST['updateDuplicates'])        { $errors .= "Update Duplicates: You must select 'Use ID Field' to use this feature.<br/>\n"; }
      if (@$_REQUEST['removeOrphans'])           { $errors .= "Remove Orphans: You must select 'Use ID Field' to use this feature.<br/>\n"; }
    }
    if (@$_REQUEST['setAutoIncrement'] && !@$_REQUEST['wipeDatabase']) { $errors .= "Start Numbering: You must select 'Wipe Database' to use this feature.<br/>\n"; }
    if (!$definedTargetFieldsCount) { $errors .= "No target fields selected!  You must select at least one target field!<br/>\n"; }

    // create fields as necessary
    $targetFields    = _csvImport_fieldMapToArray(_csvImport_arrayToFieldMap($_REQUEST, 'targetFieldForCol'));
    $schema          = loadSchema($importJob['targetTable']);
    $needToAddFields = false;
    $fieldCount      = 0;
    foreach ($targetFields as $fieldName) {
      if (!$fieldName) { continue; } //skip empty array elements caused when "Skip Field" is selected

      $fieldCount++;
      if (!@$schema[$fieldName]) {
        $reservedFieldnames = explode(' ', "menu menuName menuType menuOrder menuHidden tableHidden listPageFields listPageOrder listPageSearchFields length order action page");
        if (in_array($fieldName, $reservedFieldnames)) { $errors .= "Field Creation: '$fieldName' is a reserved field name"; continue; }
        if (preg_match('/^_/', $fieldName)) { $errors .= "Field Creation: '$fieldName' cannot start with an underscore"; continue; }

        // create field
        $schema[$fieldName] = array(
          'order'           => time() + $fieldCount,
          'label'           => $fieldName,
          'type'            => "textfield",
          'defaultValue'    => "",
          'isPasswordField' => 0,
          'isRequired'      => 0,
          'isUnique'        => 0,
          'minLength'       => "",
          'maxLength'       => "",
          'charsetRule'     => "",
          'charset'         => "",
        );
        $needToAddFields = true;
      }
    }
    if ($needToAddFields) {
      saveSchema($importJob['targetTable'], $schema);
      createMissingSchemaTablesAndFields();
    }

    if ($errors) { alert($errors); }

    // save record
    if (!$errors) {
      $mapFields = _csvImport_arrayToFieldMap($_REQUEST, 'targetFieldForCol');
      $query = "UPDATE `{$TABLE_PREFIX}{$GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE']}` SET
                    updatedDate      = NOW(),
                    updatedByUserNum = '" .intval( @$CURRENT_USER['num'] ). "',

                    useIdField         = '" .mysql_escape( @$_REQUEST['useIdField'] ). "',
                      idField          = '" .mysql_escape( @$_REQUEST['idField'] ). "',
                      updateDuplicates = '" .mysql_escape( @$_REQUEST['updateDuplicates'] ). "',
                      removeOrphans    = '" .mysql_escape( @$_REQUEST['removeOrphans'] ). "',
                    wipeDatabase       = '" .mysql_escape( @$_REQUEST['wipeDatabase'] ). "',
                      setAutoIncrement = '" .mysql_escape( @$_REQUEST['setAutoIncrement'] ). "',
                      newAutoIncrement = '" .mysql_escape( @$_REQUEST['newAutoIncrement'] ). "',
                    mapFields         = '" .mysql_escape( $mapFields ). "'
                WHERE num = '" .intval( $recordNum ). "'";
      mysql_query($query) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");

      // redirect to next page
      $nextAction = 'csvImport_validateForm';
      if (@$GLOBALS['CSV_IMPORT_ALLOW_SKIPVALIDATION'] && @$_REQUEST['skipValidation']) {
        $nextAction = 'csvImport_importForm';
      }
      $nextPageUrl = "?_plugin=$thisPluginPath&_pluginAction=$nextAction&num=$recordNum";
      redirectBrowserToURL($nextPageUrl);
      exit;
    }

  }

  //
  $goBackURL = "?_plugin=$thisPluginPath&_pluginAction=csvImport_analyseForm&num=$recordNum";

  // show form
  _csvImport_showHeader();
?>

    <input type="hidden" name="_pluginAction" value="csvImport_optionsForm" />
    <input type="hidden" name="num"           value="<?php echo (int) $formValues['num'] ?>" />
    <input type="hidden" name="preSaveTempId" value="" />
    <input type="checkbox" name="hasColumnHeaders" value="1" style="display: none" <?php checkedIf(@$formValues['hasColumnHeaders'], 1) ?> />
    <input type="hidden" name="fileFormat"    value="<?php echo htmlspecialchars($_REQUEST['fileFormat']) ?>" />

    <script type="text/javascript">
      $(document).ready(function(){
        csvImport_updatePreview();
      });
    </script>

      <table cellspacing="0">
        <tr style="line-height: 1.5">
          <td width="125">Import File &nbsp;</td>
          <td><?php echo basename($csvFilepath); ?> (<?php echo $importJob['columnCount'] ?> columns, <?php echo $importJob['recordCount'] ?> records)</td>
        </tr>
        <tr style="line-height: 1.5">
          <td>Column Headers &nbsp;</td>
          <td><?php echo $importJob['hasColumnHeaders:text']; ?></td>
        </tr>
        <tr style="line-height: 1.5">
         <td>Target Table &nbsp;</td>
         <td><?php echo htmlspecialchars($importJob['targetTable']) ?> (<?php echo $targetTableColumnCount ?> columns, <?php echo $targetTableRecordCount ?> records)</td>
        </tr>
<?php /*
        <tr>
         <td>CSV Charset &nbsp;</td>
         <td>
          <?php
            $optionsArray = array('CP1252', 'ASCII', 'ISO-8859-1'); // More: http://php.net/manual/en/mbstring.supported-encodings.php
            $optionsHTML  = getSelectOptions(@$formValues['charset'], $optionsArray);
          ?>
          <select name="charset">
            <option value="">Auto-detect</option>
            <?php echo $optionsHTML ?>
          </select> If data doesn't look right try different charsets
         </td>
        </tr>
*/ ?>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
          <td>Advanced Options</td>
          <td>
            <dl>
              <dt>
              <input type="hidden" name="useIdField" value="0" />
              <label><input type="checkbox" name="useIdField" value="1" <?php checkedIf(@$formValues['useIdField'], 1) ?> style="vertical-align: baseline" />
              <b>Use ID Field</b> - Duplicate records have the same value in this field</label>

              <?php $optionsHTML = getSelectOptions(@$formValues['idField'], array_keys($targetTableFieldsToFieldSchemas)); ?>
              <select name="idField" style="padding: 0px">
                <option value="">&lt;select field&gt;</option>
                <?php echo $optionsHTML; ?>
              </select>
              </dt>

              <div style="margin-left: 30px">
                <input type="hidden" name="updateDuplicates" value="0" />
                <label><input type="checkbox" name="updateDuplicates" value="1" <?php checkedIf(@$formValues['updateDuplicates'], 1) ?> style="vertical-align: baseline" />
                Update Duplicates: Update existing duplicate records instead of adding them again</label><br/>

                <input type="hidden" name="removeOrphans" value="0" />
                <label><input type="checkbox" name="removeOrphans" value="1" <?php checkedIf(@$formValues['removeOrphans'], 1) ?> style="vertical-align: baseline" />
                Remove Orphans: Remove existing records if their ID isn't found in the import file</label><br/>
              </div>

              <input type="hidden" name="wipeDatabase" value="0" />
              <label><input type="checkbox" name="wipeDatabase" value="1" <?php checkedIf(@$formValues['wipeDatabase'], 1) ?> style="vertical-align: baseline" />
              <b>Wipe Database:</b> Remove all existing records before importing new records</label><br/>

              <div style="margin-left: 30px">
                <input type="hidden" name="setAutoIncrement" value="0" />
                <label><input type="checkbox" name="setAutoIncrement" value="1" <?php checkedIf(@$formValues['setAutoIncrement'], 1) ?> style="vertical-align: baseline" />
                Start numbering new records at</label>
                <input type="text" name="newAutoIncrement" value="<?php echo htmlspecialchars( @$formValues['newAutoIncrement'] ? intval($formValues['newAutoIncrement']) : 1) ?>" size="5" maxlength='11' /><br/>
              </div>

              <?php if (@$GLOBALS['CSV_IMPORT_ALLOW_SKIPVALIDATION']): ?>
                <input type="hidden" name="skipValidation" value="0" />
                <label><input type="checkbox" name="skipValidation" value="1" style="vertical-align: baseline" />
                <b>Skip Validation:</b> This option is unsafe and can leave your table half-imported!</label><br/>
              <?php endif; ?>

          </dd>

         </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
          <td>Map Fields</td>
          <td>

            <!-- map fields -->
            <table cellspacing="0" cellpadding="0" class="data" style="width: inherit">
              <thead>
                <tr>
                 <th style="font-size: 13px; padding: 0 10px">Col #</th>
                 <th style="font-size: 13px">Col Name</th>
                 <th style="font-size: 13px; padding: 0 10px">to</th>
                 <th style="font-size: 13px">Target Field</th>
                </tr>
              </thead>

              <?php $importFileColumnNames = _csvImport_fieldMapToArray( $importJob['columnNamesMap'] ); ?>
              <?php foreach ($importFileColumnNames as $columnNum => $importColumnName): ?>
                <?php $bgClass = (@$bgClass == 'listRowOdd') ? 'listRowEven' : 'listRowOdd'; ?>
                <?php
                  $selectedValue = @$formValues["targetFieldForCol$columnNum"];
                  if (!$selectedValue && @$targetTableFieldsToFieldSchemas[$importColumnName]) { $selectedValue = $importColumnName; }
                ?>
                <tr class='<?php echo $bgClass?>'>
                  <td align="center" style="text-align: center"><?php echo $columnNum ?></td>
                  <td><?php echo htmlspecialchars($importColumnName) ?></td>
                  <td>&nbsp; to &nbsp;</td>
                  <td>
                    <?php $targetFieldOptions = getSelectOptions($selectedValue, array_keys($targetTableFieldsToFieldSchemas)); ?>
                    <select name="targetFieldForCol<?php echo $columnNum ?>" style="padding: 2px; ">
                      <option value="">&lt;skip this field&gt;</option>
                      <?php if (!@$targetTableFieldsToFieldSchemas[$importColumnName]): ?>
                        <option value="<?php echo htmlspecialchars($importColumnName); ?>">&lt;create new field&gt;</option>
                      <?php endif; ?>
                      <?php echo $targetFieldOptions; ?>
                    </select>

                  </td>
                </tr>
              <?php endforeach ?>
            </table>
            <!-- /map fields -->

          </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
         <td>&nbsp;</td>
         <td>
          <input type="button" name="" value="&lt;&lt; Go Back"        class='button' onclick="window.location='<?php echo $goBackURL ?>'"/>
          <input type="submit" name="" value="Validate Data &gt;&gt;"  class='button' />
         </td>
        </tr>
      </table>

      <div class='content-box content-box-divider' id="previewHeader">
        <div class='content-box-header'><h3>Live Preview</h3></div>
      </div>

      <div style="height: 50px; overflow: auto" id="previewContent">
        <div style="padding: 10px; text-align: center">Loading...</div><br/>
      </div>

    </div><!-- End .content-box-content -->
    </form>
  </div><!-- End .content-box -->

  <?php
  showFooter();
  exit;
}



//
function csvImport_validateForm() {
  global $TABLE_PREFIX;
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);
  $formValues = _csvImport_getFormValues($importJob); // don't use request values for this, just get field maps

  // get target table fields and counts
  list($targetTableFieldsToFieldSchemas, $targetTableColumnCount, $targetTableRecordCount) = _csvImport_getTargetTableDetails( $importJob['targetTable'] );

  // on submit...
  if (@$_REQUEST['submitForm']) {

    // error checking
    $errors = '';
    if ($_SERVER['REQUEST_METHOD'] != 'POST') { $errors .= "Form method must be POST!<br/>\n"; }
    if (@$_REQUEST['validationComplete'])     { $errors .= "You must wait for the data to be validated before you continue!<br/>\n"; }
    if ($errors) { alert($errors); }

    // save record
    if (!$errors) {

      // redirect to next page
      $nextAction  = 'csvImport_importForm';
      $nextPageUrl = "?_plugin=$thisPluginPath&_pluginAction=$nextAction&num=$recordNum";
      redirectBrowserToURL($nextPageUrl);
      exit;

    }
  }

  //
  $goBackURL = "?_plugin=$thisPluginPath&_pluginAction=csvImport_optionsForm&num=" . $importJob['num'];

  // show form
  _csvImport_showHeader();
?>

  <script type="text/javascript">
    $(document).ready(function(){
      csvImport_importFile('useTempTable');
    });
  </script>

    <input type="hidden" name="_pluginAction" value="csvImport_validateForm" />
    <input type="hidden" name="num" id="num"  value="<?php echo (int) $importJob['num'] ?>" />
    <input type="hidden" name="currentRowNum" id="currentRowNum" value="0" /><?php // this is updated by ajax/js ?>
    <input type="hidden" name="currentOffset" id="currentOffset" value="0" /><?php // this is updated and used by ajax/js only ?>
    <input type="hidden" name="totalRows" id="totalRows" value="<?php echo $importJob['recordCount'] ?>" /><?php // this is updated and used by ajax/js only ?>

      <table cellspacing="0">
        <tr style="line-height: 1.5">
          <td width="125">Import File &nbsp;</td>
          <td><?php echo basename($csvFilepath); ?> (<?php echo $importJob['columnCount'] ?> columns, <?php echo $importJob['recordCount'] ?> records)</td>
        </tr>
        <tr style="line-height: 1.5">
          <td>Column Headers &nbsp;</td>
          <td><?php echo $importJob['hasColumnHeaders:text']; ?></td>
        </tr>
        <tr style="line-height: 1.5">
         <td>Target Table &nbsp;</td>
         <td><?php echo htmlspecialchars($importJob['targetTable']) ?> (<?php echo $targetTableColumnCount ?> columns, <?php echo $targetTableRecordCount ?> records)</td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
          <td>Advanced Options</td>
          <td>
            <ul style="padding-bottom: 0">

              <?php if ($formValues['useIdField']): ?>
              <li><b>Use ID Field</b> - Duplicate records have the same value in this field: <b><?php echo htmlspecialchars(@$importJob['idField']) ?></b>
                <?php if ($formValues['updateDuplicates'] || $formValues['removeOrphans']): ?>
                <ul>
                  <?php if ($formValues['updateDuplicates']): ?><li>Update Duplicates: Update existing duplicate records instead of adding them again</li><?php endif ?>
                  <?php if ($formValues['removeOrphans']):    ?><li>Remove Orphans: Remove existing records if their ID isn't found in the import file</li><?php endif ?>
                </ul>
                <?php endif; ?>
              </li>
              <?php endif; ?>

              <?php if ($formValues['wipeDatabase']): ?>
              <li><b>Wipe Database:</b> Remove all existing records before importing new records<br/>
                <?php if ($formValues['setAutoIncrement']): ?>
                <ul>
                  <li>Start numbering new records at: <b><?php echo htmlspecialchars(@$formValues['newAutoIncrement']) ?></b></li>
                </ul>
                <?php endif ?>
              </li>
              <?php endif; ?>

            </ul>

         </td>
        </tr>
        <!-- <tr><td colspan="2">&nbsp;</td></tr> -->
        <tr>
          <td>Map Fields</td>
          <td>

            <!-- map fields -->
            <table cellspacing="0" cellpadding="0" class="data" style="width: inherit">
              <thead>
                <tr>
                 <th style="font-size: 13px; padding: 0 10px">Col #</th>
                 <th style="font-size: 13px">Col Name</th>
                 <th style="font-size: 13px; padding: 0 10px">to</th>
                 <th style="font-size: 13px">Target Field</th>
                </tr>
              </thead>

              <?php $importFileColumnNames = _csvImport_fieldMapToArray( $importJob['columnNamesMap'] ); ?>
              <?php foreach ($importFileColumnNames as $columnNum => $importColumnName): ?>
                <?php $bgClass = (@$bgClass == 'listRowOdd') ? 'listRowEven' : 'listRowOdd'; ?>
                <tr class='<?php echo $bgClass?>'>
                  <td align="center" style="text-align: center"><?php echo $columnNum ?></td>
                  <td><?php echo htmlspecialchars($importColumnName) ?></td>
                  <td>&nbsp; to &nbsp;</td>
                  <td style="padding: 0 10px 0 0"><?php echo htmlspecialchars( @$formValues["targetFieldForCol$columnNum"] ) ?></td>
                </tr>
              <?php endforeach ?>
            </table>
            <!-- /map fields -->

          </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>

        <tr>
          <td>Validating Data</td>
          <td>
            <ul>
              <li>Status: <span id="status"></span></li>
              <?php if ($importJob['updateDuplicates']): ?>
                <li>Duplicates Found: <span id="duplicatesFound">0</span> (these will be updated instead of added)</li>
              <?php endif ?>
              <?php if ($importJob['removeOrphans']): ?>
                <li>Orphans Found: <span id="orphansFound">0</span> (these will be removed from database)</li>
              <?php endif ?>
            </ul>

            <div id="errors_div">
              <b>Errors:</b>
              <div style="color: #000; padding: 6px 12px;" id="noerrors">No errors so far.</div>
              <div style="color: #C00; padding: 6px 12px;" id="errors"></div>
            </div>


         </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
         <td>&nbsp;</td>
         <td>
            <div id="complete_buttons_div" style="display: none;">
              <input type="button" name="" value="&lt;&lt; Go Back"     class='button' onclick="window.location='<?php echo $goBackURL ?>'"/>
              <input type="submit" name="" value="Import Data &gt;&gt;" class='button' />
            </div>
         </td>
        </tr>
      </table>



    </div><!-- End .content-box-content -->
    </form>
  </div><!-- End .content-box -->

  <?php
  showFooter();
  exit;
}


//
function csvImport_importForm() {
  global $TABLE_PREFIX;
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);
  $formValues = _csvImport_getFormValues($importJob); // don't use request values for this, just get field maps

  // get target table fields and counts
  list($targetTableFieldsToFieldSchemas, $targetTableColumnCount, $targetTableRecordCount) = _csvImport_getTargetTableDetails( $importJob['targetTable'] );

  // show form
  _csvImport_showHeader();
?>

  <script type="text/javascript">
    $(document).ready(function(){
      csvImport_importFile(); // no argument means _don't_ use temp table
    });
  </script>

    <input type="hidden" name="_pluginAction" value="csvImport_validateForm" />
    <input type="hidden" name="num" id="num"  value="<?php echo (int) $importJob['num'] ?>" />
    <input type="hidden" name="currentRowNum" id="currentRowNum" value="0" /><?php // this is updated by ajax/js ?>
    <input type="hidden" name="currentOffset" id="currentOffset" value="0" /><?php // this is updated and used by ajax/js only ?>
    <input type="hidden" name="totalRows" id="totalRows" value="<?php echo $importJob['recordCount'] ?>" /><?php // this is updated and used by ajax/js only ?>

      <table cellspacing="0">
        <tr style="line-height: 1.5">
          <td width="125">Import File &nbsp;</td>
          <td><?php echo basename($csvFilepath); ?> (<?php echo $importJob['columnCount'] ?> columns, <?php echo $importJob['recordCount'] ?> records)</td>
        </tr>
        <tr style="line-height: 1.5">
          <td>Column Headers &nbsp;</td>
          <td><?php echo $importJob['hasColumnHeaders:text']; ?></td>
        </tr>
        <tr style="line-height: 1.5">
         <td>Target Table &nbsp;</td>
         <td><?php echo htmlspecialchars($importJob['targetTable']) ?> (<?php echo $targetTableColumnCount ?> columns, <?php echo $targetTableRecordCount ?> records)</td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
          <td>Advanced Options</td>
          <td>
            <ul style="padding-bottom: 0">

              <?php if ($formValues['useIdField']): ?>
              <li><b>Use ID Field</b> - Duplicate records have the same value in this field: <b><?php echo htmlspecialchars(@$importJob['idField']) ?></b>
                <?php if ($formValues['updateDuplicates'] || $formValues['removeOrphans']): ?>
                <ul>
                  <?php if ($formValues['updateDuplicates']): ?><li>Update Duplicates: Update existing duplicate records instead of adding them again</li><?php endif ?>
                  <?php if ($formValues['removeOrphans']):    ?><li>Remove Orphans: Remove existing records if their ID isn't found in the import file</li><?php endif ?>
                </ul>
                <?php endif; ?>
              </li>
              <?php endif; ?>

              <?php if ($formValues['wipeDatabase']): ?>
              <li><b>Wipe Database:</b> Remove all existing records before importing new records<br/>
                <?php if ($formValues['setAutoIncrement']): ?>
                <ul>
                  <li>Start numbering new records at: <b><?php echo htmlspecialchars(@$formValues['newAutoIncrement']) ?></b></li>
                </ul>
                <?php endif ?>
              </li>
              <?php endif; ?>

            </ul>

         </td>
        </tr>
        <!-- <tr><td colspan="2">&nbsp;</td></tr> -->
        <tr>
          <td>Map Fields</td>
          <td>

            <!-- map fields -->
            <table cellspacing="0" cellpadding="0" class="data" style="width: inherit">
              <thead>
                <tr>
                 <th style="font-size: 13px; padding: 0 10px">Col #</th>
                 <th style="font-size: 13px">Col Name</th>
                 <th style="font-size: 13px; padding: 0 10px">to</th>
                 <th style="font-size: 13px">Target Field</th>
                </tr>
              </thead>

              <?php $importFileColumnNames = _csvImport_fieldMapToArray( $importJob['columnNamesMap'] ); ?>
              <?php foreach ($importFileColumnNames as $columnNum => $importColumnName): ?>
                <?php $bgClass = (@$bgClass == 'listRowOdd') ? 'listRowEven' : 'listRowOdd'; ?>
                <tr class='<?php echo $bgClass?>'>
                  <td align="center" style="text-align: center"><?php echo $columnNum ?></td>
                  <td><?php echo htmlspecialchars($importColumnName) ?></td>
                  <td>&nbsp; to &nbsp;</td>
                  <td style="padding: 0 10px 0 0"><?php echo htmlspecialchars( @$formValues["targetFieldForCol$columnNum"] ) ?></td>
                </tr>
              <?php endforeach ?>
            </table>
            <!-- /map fields -->

          </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>

        <tr>
          <td>Validating Data</td>
          <td>
            <ul>
              <li>Status: <span id="status"></span></li>
              <?php if ($importJob['updateDuplicates']): ?>
                <li>Duplicates Found: <span id="duplicatesFound">0</span> (these will be updated instead of added)</li>
              <?php endif ?>
              <?php if ($importJob['removeOrphans']): ?>
                <li>Orphans Found: <span id="orphansFound">0</span> (these will be removed from database)</li>
              <?php endif ?>
            </ul>

            <div id="errors_div">
              <b>Errors:</b>
              <div style="color: #000; padding: 6px 12px;" id="noerrors">No errors so far.</div>
              <div style="color: #C00; padding: 6px 12px;" id="errors"></div>
            </div>


         </td>
        </tr>
        <tr><td colspan="2">&nbsp;</td></tr>
        <tr>
          <td>&nbsp;</td>
          <td>
            <div id="complete_buttons_div" style="display: none;">
              <input type="button" name="" value="&lt;&lt; Import Another File" class='button' onclick="window.location='?_plugin=<?php echo htmlspecialchars($thisPluginPath) ?>&_pluginAction=csvImport_uploadForm'"/>
              <input type="button" name="" value="Go to Section &gt;&gt;"       class='button' onclick="window.location='?menu=<?php echo htmlspecialchars($importJob['targetTable']) ?>'"/>
            </div>
          </td>
        </tr>
      </table>

    </div><!-- End .content-box-content -->
    </form>
  </div><!-- End .content-box -->

  <?php
  showFooter();
  exit;
}


//
function csvImport_importForm_ajax($setOffset = 0) {
  $dataTable    = getTableNameWithPrefix( $GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE'] );
  $rowNum       = (int) @$_REQUEST['rowNum'];
  $useTempTable = $_REQUEST['useTempTable'];
  if (!array_key_exists('useTempTable', $_REQUEST)) { die("No value specified for 'useTempTable'!"); }

  // load import job
  $recordNum = @$_REQUEST['num'] ? intval($_REQUEST['num']) : 0;
  list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);
  $formValues = _csvImport_getFormValues($importJob); // don't use request values for this, just get field maps

  $tempTable           = '_csv_import_temp_job' . $recordNum;
  $targetTable         = $useTempTable ? $tempTable : $importJob['targetTable'];
  $prefixedTargetTable = getTableNameWithPrefix( $targetTable );

  // create temp table if needed
  if ($useTempTable && ($rowNum == 1)) { _csvImport_importForm_ajax_createTempTable($importJob, $tempTable); }

  // wipe database - and reset counter
  if ($importJob['wipeDatabase'] && ($rowNum == 1)) { _csvImport_importForm_ajax_resetTableAndCounter($importJob, $targetTable); }

  ### import row(s)
  $maxRowsPerBatch  = 25;
  $batchCounter     = 0;
  $sqlInsertCounter = 0;
  $sqlUpdateCounter = 0;
  $done             = false;
  $errors           = '';

  // Update Duplicates: get row nums to update (import row number to target record number)
  $sqlUpdate_rowNumsToRecordNums = array();
  if ($importJob['updateDuplicates'] && $importJob['useIdField'] && $importJob['idField']) {
    $idFieldColumnNum = _getIdFieldColumnNum($importJob, $formValues);

    list($minRowNum, $maxRowNum) = array( intval($rowNum), intval($rowNum+$maxRowsPerBatch) );
    $rowNumsQuery  = "SELECT d.rowNum, t.num FROM `$prefixedTargetTable` t\n";
    $rowNumsQuery .= "  JOIN `$dataTable` d\n";
    $rowNumsQuery .= "    ON t.`".$importJob['idField']."` = colValue\n";
    $rowNumsQuery .= mysql_escapef("    WHERE d.jobNum = ? AND d.colNum = ? AND d.rowNum BETWEEN ? AND ?", $importJob['num'], $idFieldColumnNum, $minRowNum, $maxRowNum);
    $records       = mysql_query_fetch_all_array($rowNumsQuery);
    foreach ($records as $values) {
      $sqlUpdate_rowNumsToRecordNums[ $values[0] ] = $values[1];
    }
  }

  // Insert/Update record
  $targetFieldnames    = array_filter(array_unique(array_values( $formValues['colsToTargetFields'] ))); // remove blanks and duplicates
  $columnNumsToNames   = _csvImport_fieldMapToArray( $importJob['columnNamesMap'] );
  $mysqlColumnsToTypes = getMySqlColsAndType( $prefixedTargetTable );

  // get SET values for non-target fields
  $setForDefaultFields = '';
  foreach (getMySqlColsAndType( $prefixedTargetTable ) as $fieldname => $mysqlColType) {
    if (in_array($fieldname, $targetFieldnames)) { continue; }
    if     ($fieldname == 'num') { continue; }
    if     (preg_match("/^datetime/i", $mysqlColType))   { $setForDefaultFields .= ", $fieldname = '0000-00-00 00:00:00'\n"; }
    elseif (preg_match("/^(tiny)?int/i", $mysqlColType)) { $setForDefaultFields .= ", $fieldname = 0\n"; }
    else                                                 { $setForDefaultFields .= ", $fieldname = DEFAULT\n"; }
  }
   //showme(getMySqlColsAndType( $prefixedTargetTable )); exit;

  //
  foreach (range(1, $maxRowsPerBatch) as $mycount) {
    if ($batchCounter++ > 0) { $rowNum++; }

    // load row
    $query           = mysql_escapef("SELECT colNum, colValue FROM `$dataTable` WHERE jobNum = ? AND rowNum = ? ORDER BY colNum", $importJob['num'], $rowNum);
    $recordSet       = mysql_query_fetch_all_array($query);
    $colValues       = array_pluck($recordSet, 1);
    //$colNums         = array_pluck($recordSet, 0);
    //$colNumsToValues = array_combine($colNums, $colValues);
    $done            = (!$recordSet); // no results means end of import job
    if ($done) { break; }

    // insert or update row
    $mysqlSet            = _csvImport_importForm_ajax_getQuerySetString($prefixedTargetTable, $columnNumsToNames, $formValues['colsToTargetFields'], $colValues);
    $updateTargetNum     = @$sqlUpdate_rowNumsToRecordNums[ $rowNum ];
    if ($updateTargetNum) { $updateOrInsertQuery = "UPDATE `$prefixedTargetTable` $mysqlSet WHERE num = $updateTargetNum"; }
    else                  { $updateOrInsertQuery = "INSERT `$prefixedTargetTable` $mysqlSet $setForDefaultFields"; }
    if (!mysql_query($updateOrInsertQuery)) {
      $errors .= "Import Row #$rowNum - MySQL Error: ". htmlspecialchars(mysql_error()) . "<br/>\n";
      $errors .= nl2br(htmlspecialchars($mysqlSet)) . "<br/><br/>\n";
    }
    if ($updateTargetNum)                   { $sqlUpdateCounter++; }
    else                                    { $sqlInsertCounter++; }
  }

  // remove orphans if needed
  $orphansRemoved = 0;
  if ($done && $importJob['removeOrphans']) {
    $orphansRemoved = _csvImport_importForm_ajax_removeOrphans($prefixedTargetTable, $importJob, $formValues);
  }

  // drop temp table if needed
  if ($done && $useTempTable) { _csvImport_importForm_ajax_dropTempTable($tempTable); }

  // drop temp import data records (Only do this on final import)
  if ($done && !$useTempTable) {

    // remove import data
    $deleteQuery = mysql_escapef("DELETE FROM `$dataTable` WHERE jobNum = ?", $recordNum);
    mysql_query($deleteQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");

    // remove import upload
    eraseRecordsUploads($importJob['num']); // remove uploaded import files

    // remove import job
    $prefixedJobsTable = getTableNameWithPrefix( $GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'] );
    $deleteQuery       = mysql_escapef("DELETE FROM `$prefixedJobsTable` WHERE num = ?", $importJob['num']);
    mysql_query($deleteQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  }

  //
  print json_encode(array(
    'orphansRemoved'    => $orphansRemoved,
    'duplicatesUpdated' => $sqlUpdateCounter,
    'lastRowNum'        => $rowNum,
    'errors'            => $errors,
    'done'              => $done,
  ));
  exit;

}


//
function _csvImport_importForm_ajax_createTempTable($importJob, $tempTable) {
  global $TABLE_PREFIX;

  // copy schema
  $sourcePath  = realpath(DATA_DIR . '/schema') . '/' . $importJob['targetTable'] . ".ini.php";
  $targetPath  = realpath(DATA_DIR . '/schema') . '/' . $tempTable . ".ini.php";
  @copy($sourcePath, $targetPath) or die("Error copying schema file! $php_errormsg");

  // update schema
  $schema = loadSchema($tempTable);
  $schema['menuOrder']  = time();  // sort temp schema to the bottom
  $schema['menuHidden'] = 1;       // hide temp schema on menu
  saveSchema($tempTable, $schema);

  // create mysql table
  $dropQuery   = "DROP TABLE IF EXISTS `$TABLE_PREFIX$tempTable`";
  $createQuery = "CREATE TABLE `$TABLE_PREFIX$tempTable` LIKE `$TABLE_PREFIX{$importJob['targetTable']}`"; // use like so we copy indexes too!
  $insertQuery = "INSERT INTO `$TABLE_PREFIX$tempTable` SELECT * FROM `$TABLE_PREFIX{$importJob['targetTable']}`";
  mysql_query($dropQuery)   or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  mysql_query($createQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  mysql_query($insertQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
}

//
function _csvImport_importForm_ajax_dropTempTable($tempTable) {
  global $TABLE_PREFIX;

  mysql_query("DROP TABLE IF EXISTS `$TABLE_PREFIX$tempTable`") or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  $targetPath  = realpath(DATA_DIR . '/schema') . '/' . $tempTable . ".ini.php";
  @unlink($targetPath);
}

//
function _csvImport_importForm_ajax_resetTableAndCounter($importJob, $targetTable) {
  global $TABLE_PREFIX;
  $prefixedTargetTable = $TABLE_PREFIX . $targetTable;

  if (!$importJob['wipeDatabase']) { return; }

  $wipeQuery = "DELETE FROM `$prefixedTargetTable`";
  mysql_query($wipeQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");

  if ($importJob['setAutoIncrement'] && $importJob['newAutoIncrement']) {
    $resetNumQuery = "ALTER TABLE `$prefixedTargetTable` AUTO_INCREMENT = {$importJob['newAutoIncrement']}";
    mysql_query($resetNumQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  }
}


// import or update record
function _csvImport_importForm_ajax_getQuerySetString($prefixedTargetTable, $colNumsToNames, $colNumsToTargetFieldnames, $colValues) {
  static $targetFieldnames;
  if (!$targetFieldnames)  { $targetFieldnames  = array_filter(array_unique(array_values( $colNumsToTargetFieldnames ))); } // remove blanks and duplicates

  // get mysql SET
  $mysqlSet = "SET ";
  foreach ($targetFieldnames as $targetField) {
    $mysqlValue    = '';
    $prefixColName = in_array($targetField, $GLOBALS['CSV_IMPORT_OPTIONS']['PREFIX_VALUES_FOR']);
    foreach ($colNumsToTargetFieldnames as $colNum => $colTargetField) {
      if ($colTargetField != $targetField) { continue; }
      $colValue = @$colValues[$colNum - 1];            // convert colNum to index
      if ($colValue == '')   { continue; }            // skip blank strings in multiple values
      if ($mysqlValue != '') { $mysqlValue .= $GLOBALS['CSV_IMPORT_OPTIONS']['MULTI_VALUE_SEPARATOR']; } // join multi values with this char
      if ($prefixColName) { $mysqlValue .= $colNumsToNames[$colNum] . $GLOBALS['CSV_IMPORT_OPTIONS']['PREFIX_SEPARATOR']; }
      $mysqlValue .= $colValues[$colNum - 1];
    }

    // filter value
    $filterFunction = @$GLOBALS['CSV_IMPORT_OPTIONS']['FIELD_FILTERS'][$targetField];
    if ($filterFunction) { $mysqlValue = call_user_func($filterFunction, $mysqlValue); }

    //
    $mysqlSet .= mysql_escapef("`$targetField` = ?,\n", $mysqlValue);
  }

  //
  $mysqlSet = chop($mysqlSet, ", \n");
  return $mysqlSet;
}


//
function _csvImport_importForm_ajax_removeOrphans($prefixedTargetTable, $importJob, $formValues) {
  global $TABLE_PREFIX;
  $dataTable = $GLOBALS['TABLE_PREFIX'] . $GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE'];

  if (!$importJob['removeOrphans']) { return 0; }

  $orphansRemoved     = 0;
  $idFieldColumnNum   = _getIdFieldColumnNum($importJob, $formValues);

  $idFieldValuesQuery = mysql_escapef("SELECT colValue FROM `$dataTable` WHERE jobNum = ? AND colNum = ?", $importJob['num'], $idFieldColumnNum);
  $deleteOrphansQuery = "DELETE FROM `$prefixedTargetTable` WHERE `{$importJob['idField']}` NOT IN ($idFieldValuesQuery)";
  mysql_query($deleteOrphansQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  $orphansRemoved = mysql_affected_rows();

  return $orphansRemoved;
}


//
function _csvImport_pluginSetup_createSchemas() {

  // create jobs table
  $sourcePath = dirname(__FILE__) . "/pluginSchemas/{$GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE']}.ini.php";
  createSchemaFromFile( $sourcePath );

  // upgrade jobs table
  $jobsSchema = loadSchema( $GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'] );
  if (!@$jobsSchema['fileFormat']) { // added in 1.03
    $targetPath = realpath(DATA_DIR . '/schema') . '/' . basename($sourcePath);
    unlink($targetPath);
    createSchemaFromFile( $sourcePath );
  }

  // create data table
  $sourcePath = dirname(__FILE__) . "/pluginSchemas/{$GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE']}.ini.php";
  $targetPath = realpath(DATA_DIR . '/schema') . '/' . basename($sourcePath);
  if (!file_exists($targetPath)) {
    createSchemaFromFile( $sourcePath );

    // drop num field
    $dataTable  = $GLOBALS['TABLE_PREFIX'] . $GLOBALS['CSV_IMPORT_OPTIONS']['DATA_TABLE'];
    $alterQuery = "ALTER TABLE `$dataTable` DROP COLUMN `num`";
    mysql_query($alterQuery) or die("MySQL Error:<br/>\n". htmlspecialchars(mysql_error()) . "\n");
  }

}

// Plugin Menu: Add action links for this plugin
function _csvImport_showHeader() {
  list($thisPluginPath, $thisPluginUrl) = getPluginPathAndUrl();
  list($jsPath, $jsUrl)                 = getPluginPathAndUrl('csvImport.js');
  showHeader();
  ?>

  <script type="text/javascript" src="<?php echo $jsUrl ?>"></script>

  <div class="clear"></div>

  <div class="content-box">
    <form method="post" action="?">
    <input type="hidden" name="_plugin"       value="<?php echo htmlspecialchars($thisPluginPath); ?>" />
    <input type="hidden" name="submitForm"    value="1" />

    <div class="content-box-header">
      <h3><a href='?_plugin=<?php echo $thisPluginPath ?>&amp;_pluginAction=csvImport_uploadForm'>Import File</a></h3>
      <div style="float:right;">
        <input class="button" type="button" name="null" value="Back to Plugins &gt;&gt;"  onclick="window.location='?menu=admin&amp;action=plugins'"/>
      </div>
      <div class="clear"></div>
    </div> <!-- End .content-box-header -->

    <div class="content-box-content">
  <?php
}



// list($importJob, $csvFilepath) = _csvImport_loadImportJob($recordNum);
function _csvImport_loadImportJob($recordNum) {

  require_once SCRIPT_DIR . '/lib/viewer_functions.php';

  list($importJobs, $importJobsMetaData) = getRecords(array(
    'tableName'   => $GLOBALS['CSV_IMPORT_OPTIONS']['JOBS_TABLE'],
    'where'       => mysql_escapef("num = ?", $recordNum),
    'limit'       => '1',
    'allowSearch' => false,
  ));
  $importJob = @$importJobs[0]; // get first record
  if (!$importJob) { die("Import job #$recordNum not found!"); }

  //
  $csvFilepath = @$importJob['csv_upload'][0]['filePath'];
  if     (!$csvFilepath)              { die("No import filename!"); }
  elseif (!file_exists($csvFilepath)) { die("Import file doesn't exist!"); }
  //unset($importJob['csv_upload']); //

  // set delimiter for CSV parsing (done in csvImport_init and _csvImport_loadImportJob)
  if ($importJob['fileFormat'] == 'csvg') { $GLOBALS['CSV_IMPORT_OPTIONS']['CSV_DELIMITER'] = ';'; }

  //
  return array($importJob, $csvFilepath);
}

// get values to pre-populate form
// $formValues = _csvImport_getFormValues($importJob, $_REQUEST);
function _csvImport_getFormValues($record, $request = array()) {
  $formValues = array();

  // use submitted form value if available or else use record value
  foreach ($record as $name => $value) {
    if (array_key_exists($name, $request)) { $formValues[$name] = $request[$name]; }
    else                                   { $formValues[$name] = $value; }
  }


  // get values for: col# -> column name
  $columnNameArray = _csvImport_fieldMapToArray($record['columnNamesMap']);
  foreach ($columnNameArray as $colNumber => $colName) {
    if ($colNumber) { $formValues['columnNames'][$colNumber] = $colName; }
  }
  unset($formValues['columnNamesMap']);

  // get values for: col# -> target field
  $colNumToTargetField = _csvImport_fieldMapToArray($record['mapFields']);
  foreach (range(1, $record['columnCount']) as $colNumber) {
    if (!$colNumber) { continue; }
    $name    = "targetFieldForCol$colNumber";
    $value   = "";
    $colName = @$formValues['columnNames'][$colNumber];
    if      (array_key_exists($name, $request))                  { $value = $request[$name]; }
    else if (array_key_exists($colNumber, $colNumToTargetField)) { $value = $colNumToTargetField[$colNumber]; }
    else if ($colName) { // check for default mappings for column name
      if     (@$GLOBALS['CSV_IMPORT_DEFAULTS']['FIELD_MAP'][$colName]) { $value = $GLOBALS['CSV_IMPORT_DEFAULTS']['FIELD_MAP'][$colName]; }
      elseif (@$GLOBALS['CSV_IMPORT_DEFAULTS']['FIELD_MAP']['*'])      { $value = $GLOBALS['CSV_IMPORT_DEFAULTS']['FIELD_MAP']['*']; }
    }

    $formValues[$name] = $value;
    $formValues['colsToTargetFields'][$colNumber] = $value;
  }
  unset($formValues['mapFields']);

  //
  return $formValues;
}


// list($fieldNamesToSchemas, $columnCount, $recordCount) = _csvImport_getTargetTableDetails( $importJob['targetTable'] );
function _csvImport_getTargetTableDetails( $targetTable ) {
  $prefixedTargetTable  = getTableNameWithPrefix( $targetTable );
  $fieldnamesToSchemas  = array();
  $mysqlColumnsToTypes  = getMySqlColsAndType( $prefixedTargetTable );

  foreach (getSchemaFields($targetTable) as $fieldname => $fieldSchema) {
    if (!@$mysqlColumnsToTypes[$fieldname]) { continue; }
    $fieldnamesToSchemas[$fieldname] = $fieldSchema;
  }

  $columnCount = count( $fieldnamesToSchemas );
  $recordCount = mysql_count( $targetTable );

  return array($fieldnamesToSchemas, $columnCount, $recordCount);
}


// $idFieldColumnNum = _getIdFieldColumnNum($importJob, $formValues);
function _getIdFieldColumnNum($importJob, $formValues) {
  $idFieldColumnNum = '';

  $targetFieldsToCols   = array_flip( $formValues['colsToTargetFields'] );
  $idFieldColumnNum     = @$targetFieldsToCols[ $importJob['idField'] ];
  if (!$idFieldColumnNum) { die("No \$idFieldColumnNum!"); }

  return $idFieldColumnNum;
}


// Convert "1|Name\n3|Title\n" to array('1' => 'Name', '3' => 'Title')
function _csvImport_fieldMapToArray($fieldMap) {
  $mapArray = array();

  foreach (explode("\n", $fieldMap) as $line) {
    @list($colNumber, $value) = explode('|', $line, 2);
    if (!$colNumber) { continue; }
    $mapArray["$colNumber"] = $value;
  }

  return $mapArray;
}


// Convert array('1' => 'Name', '3' => 'Title') to "1|Name\n3|Title\n"
function _csvImport_arrayToFieldMap($mapArray, $removeSuffix = '') {
  $fieldMap = '';

  foreach ($mapArray as $index => $value) {
    if ($removeSuffix) {
      if (!preg_match("/^$removeSuffix/", $index)) { continue; }
      $index = preg_replace("/^$removeSuffix/", '', $index);
      $index--; // use actual index number for assoc arrays - decreased below
    }
    $colNumber = $index+1;
    $fieldMap .= "$colNumber|$value\n";
    @list($colNumber, $value) = explode('|', $line, 2);
    if (!$colNumber) { continue; }
    $mapArray["$colNumber"] = $value;
  }

  return $fieldMap;
}

// $colNames = _csvParser_getColumnNames($filepath);
function _csvParser_getColumnNames($filepath, $overrideColumnNames = array()) {
  if ($overrideColumnNames) { return $overrideColumnNames; } // not yet used
  $colNames = array();

  // error checking
  if (!$filepath) { die(__FUNCTION__ . ": No filepath specified!"); }

  //
  $handle    = fopen($filepath, 'r');
  $colValues = fgetcsv($handle, 10000, $GLOBALS['CSV_IMPORT_OPTIONS']['CSV_DELIMITER']);
  if ($GLOBALS['CSV_IMPORT_OPTIONS']['ENCODING']) { mb_convert_variables('UTF-8', $GLOBALS['CSV_IMPORT_OPTIONS']['ENCODING'], $colValues); }

  for ($index=0; $index<count($colValues); $index++) {
    $colName = $colValues[$index];

    // assign names to blank columns
    if ($colName == '') { $colName = 'unnamed_col_' . ($index+1); }

    // replace/remove whitespace
    $colName = trim($colName);                        // remove leading/trailing whitespace
    $colName = preg_replace("/\s+/s", ' ', $colName); // replace nextlines and multiple whitespace chars

    //
    $colNames[] = $colName;
  }
  fclose($handle);


  //
  return $colNames;
}

// return one line from CSV file for each call
// returns false at end of file and resets itself.
// Example Usage:
/*
  // import file
  while($r = _csvParser_getNextLine($filepath)) {
    list($colValues, $offset) = $r;
    showme($rowValues);
  }
*/
function _csvParser_getNextLine($filepath, $setOffset = null) {
  static $handle;
  static $headerCount;

  // open new file
  if (!$handle) {
    $handle = fopen($filepath, "r");
    if (!$handle) { die("Can't open '" .htmlspecialchars($filepath). "' - $php_errormsg!"); }
    if ($setOffset) { fseek($handle, $setOffset); }
  }

  // get next row
  $colValues = fgetcsv($handle, 10000, $GLOBALS['CSV_IMPORT_OPTIONS']['CSV_DELIMITER']);
  if ($GLOBALS['CSV_IMPORT_OPTIONS']['ENCODING']) { mb_convert_variables('UTF-8', $GLOBALS['CSV_IMPORT_OPTIONS']['ENCODING'], $colValues); }
  $newOffset = ftell($handle);

  // if no more rows: close file & reset vars
  if (!$colValues) {
    fclose($handle);
    unset($handle, $headerCount);
    return false;
  }

  // return record
  if ($colValues) { return array($colValues, $newOffset); }
  else            { return false; }

}


?>
