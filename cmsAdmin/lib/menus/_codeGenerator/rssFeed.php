<?php
/*
Plugin Name: RSS Feed Generator
Description: Adds "RSS Feed" to Code Generator
Version: 1.00
Requires at least: 2.15
*/

// Note: This library is automatically included by /lib/menus/_codeGenerator/actionHandler.php
// ... but can be duplicated and added to the /plugins/ folder to create a new code generator.
// ... Just be sure to change the function names or you'll get errors about duplicate functions.

// register generator
addGenerator('cg2_rssfeed', 'RSS Feed', 'Generate an RSS Feed for vistors to subscribe to.');

// dispatch function
function cg2_rssfeed($function, $name, $description, $type) {

  // call ajax code
  cg2_rssfeed_ajaxPhpCode();

  // show options menu, and errors on submit
  cg2_rssfeed_getOptions($function, $name, $description, $type);

  // show code
  $instructions   = array(); // show as bullet points
  $filenameSuffix = 'rss'; // eg: tablename-FILENAMESUFFIX.php
  $code           = cg2_rssfeed_getCode();
  cg2_showCode($function, $name, $instructions, $filenameSuffix, $code);
  exit;
}


// user specified options
function cg2_rssfeed_getOptions($function, $name, $description, $type) {

  // error checking
  if (@$_REQUEST['_showCode']) {
    $errorsAndAlerts = '';
    if (!@$_REQUEST['tableName'])        { alert("Please select a section!<br />\n"); }
    if (!@$_REQUEST['feedTitle'])        { alert("Please enter a value for Feed Title!<br />\n"); }
    if (!@$_REQUEST['feedLink'])         { alert("Please enter a value for Feed Link!<br />\n"); }
    if (!@$_REQUEST['feedDescription'])  { alert("Please enter a value for Feed Description!<br />\n"); }
    if (!@$_REQUEST['feedLanguage'])     { alert("Please enter a value for Feed Language!<br />\n"); }
    if (!@$_REQUEST['titleField'])       { alert("Please select a title field!<br />\n"); }
    if (!@$_REQUEST['descriptionField']) { alert("Please enter a description field!<br />\n"); }

    if (!alert()) { // if no other errors, check fields exist in schema
      $schema = loadSchema($_REQUEST['tableName']);
      if (!in_array($_REQUEST['titleField'], array_keys($schema)))       { alert("Invalid field '" .htmlencode($_REQUEST['titleField']). "' selected!<br/>\n"); }
      if (!in_array($_REQUEST['descriptionField'], array_keys($schema))) { alert("Invalid field '" .htmlencode($_REQUEST['descriptionField']). "' selected!<br/>\n"); }
    }

    if (!alert()) { return; } // if form submitted and no errors than return and generate code
  }

  // set form defaults
  $defaults['howMany']          = 'all';
  $defaults['limit']            = 25;

  $defaults['feedTitle']        = "Name of your site or RSS feed";
  $defaults['feedLink']         = "http://www.example.com/";
  $defaults['feedDescription']  = 'Your site description goes here';
  $defaults['feedLanguage']     = 'en-us';

  $defaults['titleField']       = '';
  $defaults['descriptionField'] = '';
  foreach ($defaults as $key => $value) {
    if (!array_key_exists($key, $_REQUEST)) { $_REQUEST[$key] = $value; }
  }

  // show header
  echo cg2_header($function, $name);
  print "<input type='hidden' name='_showCode' value='1' />\n";

  cg2_rssfeed_ajaxJsCode(); // show ajax js code
?>
<div class="code-generator" style="display: block; ">

<?php cg2_option_selectSection(); ?>

  <div class='content-box content-box-divider'>
    <div class='content-box-header'><h3><?php eht("Feed Options"); ?></h3></div>
  </div>

  <div class="fieldOption">
    <div class="label"><?php et('How Many')?></div>
    <div style="float:left; line-height: 1.5em">
        <label>
          <?php echo cg2_inputRadio('howMany', 'all'); ?>
          <?php et('Show all records')?>
        </label><br/>

        <label>
          <?php echo cg2_inputRadio('howMany', 'firstN'); ?>
          <?php echo sprintf(t('Show the first %s records only'), cg2_inputText('limit', 3)); ?>
        </label><br/><br/>
    </div>
    <div class="clear"></div>
  </div>

<br/>

  <div class="fieldOption">
    <div class="label"><?php et('Feed Title')?></div>
    <?php echo cg2_inputText('feedTitle', 60, true); ?>
  </div>

  <div class="fieldOption">
    <div class="label"><?php et('Feed Link')?></div>
    <?php echo cg2_inputText('feedLink', 60, true); ?>
    <div class="clear"></div>
  </div>

  <div class="fieldOption">
    <div class="label"><?php et('Feed Description')?></div>
    <?php echo cg2_inputText('feedDescription', 60, true); ?>
    <div class="clear"></div>
  </div>

  <div class="fieldOption">
    <div class="label"><?php et('Feed Language')?></div>
    <?php echo cg2_inputText('feedLanguage', 60, true); ?>
    <div class="clear"></div>
  </div>

<br/><br/>

    <div class="fieldOption">
      <div class="label"><?php et('Title field')?></div>
      <?php echo cg2_inputSchemaField('titleField'); ?>
      <div class="clear"></div>
    </div>

    <div class="fieldOption">
      <div class="label"><?php et('Description field')?></div>
      <?php echo cg2_inputSchemaField('descriptionField'); ?>
      <div class="clear"></div>
    </div>

  <div align="center" style="padding-right: 5px" class="fieldOption"><input class="button" type="submit" name="_null_" value="<?php echo t('Show Code &gt;&gt;'); ?>" /></div>
</div>


  <?php
  echo cg2_footer();
  exit;
}

//
function cg2_rssfeed_getCode() {
  $tableName  = @$_REQUEST['tableName'];
  $schema     = loadSchema($tableName);
  $menuName   = coalesce(@$schema['menuName'], $tableName);

  // define variable names
  $tableRecordsVar = '$' .preg_replace("/[^\w]/", '_', $tableName). "Records";
  $metaDataVar     = '$' .preg_replace("/[^\w]/", '_', $tableName). "MetaData";
  $recordVar       = '$record';

  // define getRecords() options
  $options = array();
  $options[] = "'tableName'   => '$tableName',";
  if      (@$_REQUEST['howMany'] == 'firstN')    { $options[] = "'limit'       => '{$_REQUEST['limit']}',"; }
  else                                           { /* default to showing all */ }
  $options[] = "'orderBy'     => '',   // use default database order";
  $options[] = "'loadUploads' => false,";
  $options[] = "'allowSearch' => false,";
  $padding           = "    ";
  $getRecordsOptions = "\n$padding" . implode("\n$padding", $options) . "\n  ";

  ### generate code
  ob_start();
?><#php
  /* STEP 1: LOAD RECORDS - Copy this PHP code block near the TOP of your page */
  <?php cg2_code_loadLibraries(); ?>

  // load records from '<?php echo $tableName ?>'
  list(<?php echo $tableRecordsVar ?>, <?php echo $metaDataVar ?>) = getRecords(array(<?php echo $getRecordsOptions; ?>));

<?php /* not used
  // get updated and created times
<?php if (@$schema['updatedDate']): ?>
  $lastUpdated = max(coalesce(array_map('strtotime', array_pluck(<?php echo $tableRecordsVar ?>, 'updatedDate')), array(time())));
<?php else: ?>
  $lastUpdated = time();
<?php endif ?>
<?php if (@$schema['createdDate']): ?>
  $lastCreated = max(coalesce(array_map('strtotime', array_pluck(<?php echo $tableRecordsVar ?>, 'createdDate')), array(time())));
<?php else: ?>
  $lastCreated = time();
<?php endif ?>
*/ ?>
#>
<#php header('Content-type: application/xml; charset=utf-8'); #><#php echo '<'.'?xml version="1.0" encoding="UTF-8"?>'; #>
<rss version="2.0">
  <channel>
    <title><?php echo htmlencode(@$_REQUEST['feedTitle']) ?></title>
    <link><?php echo htmlencode(@$_REQUEST['feedLink']) ?></link>
    <description><?php echo htmlencode(@$_REQUEST['feedDescription']) ?></description>
    <pubDate><#php echo date('r') #></pubDate>
    <language><?php echo htmlencode(@$_REQUEST['feedLanguage']) ?></language>

    <#php foreach (<?php echo $tableRecordsVar ?> as <?php echo $recordVar ?>): #>
    <item>
      <title><#php echo htmlencode($record['<?php echo @$_REQUEST['titleField'] ?>']) #></title>
      <link>http://<#php echo $_SERVER['HTTP_HOST']; #>/<#php echo <?php echo $recordVar ?>['_link'] #></link>
      <description><![CDATA[<#php echo <?php echo $recordVar ?>['<?php echo @$_REQUEST['descriptionField'] ?>'] #>]]></description>
<?php if (@$schema['createdDate']): ?>
      <pubDate><#php echo date('r', strtotime(<?php echo $recordVar ?>['createdDate'])) #></pubDate>
<?php endif ?>
      <guid isPermaLink="true"><#php echo <?php echo $recordVar ?>['_link'] #></guid>
    </item>
    <#php endforeach #>
  </channel>
</rss>
<?php
  // return code
  $code = ob_get_clean();
  return $code;
}


//
function cg2_rssfeed_ajaxJsCode() {
  $ajaxUrl = "?menu=" .@$_REQUEST['menu']. "&_generator=" .@$_REQUEST['_generator']. "&_ajax=schemaFields";
?><script type="text/javascript"><!--

$(document).ready(function(){

  // register change event
  $('select[name=tableName]').live('change', function() {
    cg2_updateSchemaFieldPulldowns();
  });
});

//
function cg2_updateSchemaFieldPulldowns() {
  var tableName = $('select[name=tableName]').val(); // get tableName

  // error checking
  if ($('select.ajax-schema-fields').length == 0) { return; } // skip if there are no schema field pulldowns to update
  if (tableName == '') { return; } // return if no table selected


  // show loading... for all pulldowns
  $('select.ajax-schema-fields').html("<option value=''>loading...</option>");

  // load schema fields

  var ajaxUrl   = "<?php echo $ajaxUrl ?>&tableName=" + tableName;
  $.ajax({
    url: ajaxUrl,
    dataType: 'html',
    error:   function(XMLHttpRequest, textStatus, errorThrown){
      alert("There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] + ")\n" + errorThrown);
    },
    success: function(optionsHTML){
      if (!optionsHTML.match(/^<option/)) { return alert("Error loading schema options!\n" + optionsHTML); }
      $('select.ajax-schema-fields').html(optionsHTML);
    }
  });
}
//--></script>
<?php
}

//
function cg2_rssfeed_ajaxPhpCode() {
  if (@$_REQUEST['_ajax'] == 'schemaFields') {
    $htmlOptions   = cg2_inputSchemaField_getOptions( @$_REQUEST['tableName'] );
    print $htmlOptions;
    exit;
  }
}



?>