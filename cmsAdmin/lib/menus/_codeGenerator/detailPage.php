<?php
/*
Plugin Name: Detail Page Generator
Description: Adds "Detail Page" to Code Generator
Version: 1.00
Requires at least: 2.15
*/

// Note: This library is automatically included by /lib/menus/_codeGenerator/actionHandler.php
// ... but can be duplicated and added to the /plugins/ folder to create a new code generator.
// ... Just be sure to change the function names or you'll get errors about duplicate functions.

// register generator
addGenerator('cg2_detailpage', 'Detail Page', 'Show one record on the page.');

// dispatch function
function cg2_detailpage($function, $name, $description, $type) {

  // show options menu, and errors on submit
  cg2_detailpage_getOptions($function, $name, $description, $type);

  // show code
  $instructions   = array(); // show as bullet points
  $filenameSuffix = 'detail'; // eg: tablename-FILENAMESUFFIX.php
  $code           = cg2_detailpage_getCode();
  cg2_showCode($function, $name, $instructions, $filenameSuffix, $code);
  exit;
}


//
function cg2_detailpage_getOptions($function, $name, $description, $type) {

  // error checking
  if (@$_REQUEST['_showCode']) {
    $errorsAndAlerts = '';
    if (!@$_REQUEST['tableName'])   { alert(t("Please select a section!")."<br />\n"); }
    if (!@$_REQUEST['whichRecord']) { alert(t("Please select a value for 'which record'")."!<br />\n"); }
    if (!alert()) { return; } // if form submitted and no errors than return and generate code
  }

  // set form defaults
  $defaults['whichRecord']      = '';
  $defaults['recordNumCustom']  = '1';
  $defaults['showUploads']      = 'all';
  $defaults['showUploadsCount'] = '1';
  foreach ($defaults as $key => $value) {
    if (!array_key_exists($key, $_REQUEST)) { $_REQUEST[$key] = $value; }
  }

  // show header
  echo cg2_header($function, $name);
  print "<input type='hidden' name='_showCode' value='1' />\n";
?>


<div class="code-generator" style="display: block; ">

<?php cg2_option_selectSection(); ?>

  <div class='content-box content-box-divider'>
    <div class='content-box-header'><h3><?php eht("Viewer Options"); ?></h3></div>
  </div>

  <div class="fieldOption">
    <div class="label"><?php et('Which Record')?></div>
    <div style="float:left; line-height: 1.5em">

        <label>
          <?php echo cg2_inputRadio('whichRecord', 'first'); ?>
          <?php et("Single record sections: Load first record in database")?>
        </label><br/>

        <label>
          <?php echo cg2_inputRadio('whichRecord', 'url'); ?>
          <?php et("Multi record sections: Get record # from end of url. eg: viewer.php?record_title-3")?>
        </label><br/>

        <label>
          <?php echo cg2_inputRadio('whichRecord', 'custom'); ?>
          <?php echo sprintf(t('Custom: Load record # %s'), cg2_inputText('recordNumCustom', 6)); ?>
        </label><br/><br/>
    </div>
    <div class="clear"></div>
  </div>


<?php cg2_option_uploads() ?>

  <div align="center" style="padding-right: 5px" class="fieldOption"><input class="button" type="submit" name="_null_" value="<?php echo t('Show Code &gt;&gt;'); ?> " /></div>
</div>


<?php
  echo cg2_footer();
  exit;
}


//
function cg2_detailpage_getCode() {
  $tableName  = @$_REQUEST['tableName'];
  $schema     = loadSchema($tableName);
  $menuName   = coalesce(@$schema['menuName'], $tableName);

  // define variable names
  $tableRecordsVar = '$' .preg_replace("/[^\w]/", '_', $tableName). "Records";
  $metaDataVar     = '$' .preg_replace("/[^\w]/", '_', $tableName). "MetaData";
  $recordVar       = '$' .preg_replace("/[^\w]/", '_', $tableName). "Record";

  // define getRecords() options
  $options = array();
  $options[] = "'tableName'   => '$tableName',";
  if      (@$_REQUEST['whichRecord'] == 'first')  { $options[] = "'where'       => '', // load first record"; }
  elseif  (@$_REQUEST['whichRecord'] == 'url')    { $options[] = "'where'       => whereRecordNumberInUrl(0),"; }
  elseif  (@$_REQUEST['whichRecord'] == 'custom') { $options[] = "'where'       => \"`num` = '" .intval(@$_REQUEST['recordNumCustom']). "'\","; }
  if      (@$_REQUEST['showUploads'] == 'all')    { $options[] = "'loadUploads' => true,"; }
  elseif  (@$_REQUEST['showUploads'] == 'limit')  { $options[] = "'loadUploads' => true,"; }
  else                                            { $options[] = "'loadUploads' => false,"; }
  $options[] = "'allowSearch' => false,";
  $options[] = "'limit'       => '1',";
  $padding   = "    ";
  $getRecordsOptions = "\n$padding" . implode("\n$padding", $options) . "\n  ";

  ### generate code
  ob_start();

?><#php header('Content-type: text/html; charset=utf-8'); #>
<#php
  /* STEP 1: LOAD RECORDS - Copy this PHP code block near the TOP of your page */
  <?php cg2_code_loadLibraries(); ?>

  // load record from '<?php echo $tableName ?>'
  list(<?php echo $tableRecordsVar ?>, <?php echo $metaDataVar ?>) = getRecords(array(<?php echo $getRecordsOptions; ?>));
  <?php echo $recordVar ?> = @<?php echo $tableRecordsVar ?>[0]; // get first record
  if (!<?php echo $recordVar ?>) { dieWith404("Record not found!"); } // show error message if no record found

#><?php cg2_code_header(); ?>
<?php cg2_code_instructions('Detail'); ?>

  <!-- STEP2: Display Record (Paste this where you want your record to appear) -->
    <h1><?php echo $menuName ?> - Detail Page Viewer</h1>
<?php cg2_code_schemaFields($schema, $recordVar, $tableName); ?>
<?php if (@$_REQUEST['showUploads']) { cg2_code_uploads($schema, $recordVar); } ?>
  <!-- /STEP2: Display Record -->
    <hr/>

  <a href="<#php echo <?php echo $metaDataVar ?>['_listPage'] ?>">&lt;&lt; <?php echo t('Back to list page'); ?></a>
  <a href="mailto:?subject=<#php echo urlencode(thisPageUrl()) #>"><?php echo t('Email this Page'); ?></a>

<?php cg2_code_footer(); ?>

<?php
  // return code
  $code = ob_get_clean();
  return $code;
}

?>