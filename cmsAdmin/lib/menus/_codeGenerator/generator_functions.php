<?php

// cg2 = Code Generator 2

// header for code generator option and code pages
function cg2_header($function, $name) {

  // only send header once - v2.51
  static $alreadySent = false;
  if ($alreadySent) { return; }
  $alreadySent = true;

  // set title and button
  $title  = sprintf("%s &gt; <a href='?menu=_codeGenerator'>%s</a> &gt; ",t('Admin'),t('Code Generator')). htmlencode($name);
  $button = ''; // <input class="button" type="button" name="null" value="Start Over &gt;&gt;" onclick="window.location=\'?menu=_codeGenerator\'"/>';

  // get header html
  $html = plugin_header('###TITLE###', $button, false);
  $html = preg_replace('/###TITLE###/', $title, $html);
  $html = preg_replace('/<form method="post"/', '<form method="get"', $html); // use get form so users can use browser back button with reposting form

  // add javascript (not yet needed or used)
  $oldHtml = $html;
  $jsPath  = "lib/menus/_codeGenerator/generator_functions.js";
  $jsTag   = "<script type='text/javascript' src='$jsPath?" .filemtime($jsPath). "'></script>\n"; // on file change browsers should no longer use cached versions
  $html    = preg_replace("|^\s*<!-- /javascript -->|m", "$jsTag$0", $oldHtml);
  if ($oldHtml == $html) { dieAsCaller("Could insert javascript tag!"); }

  // add hidden fields
  $html .= "<input type='hidden' name='menu' value='_codeGenerator' />\n";
  $html .= "<input type='hidden' name='_generator' value='$function' />\n";


  //
  return $html;
}

// footer for code generator option and code pages
function cg2_footer() {
  $html = '';

  //
  $html .= plugin_footer();
  return $html;
}


// show code
function cg2_showCode($function, $name, $instructions, $suffix, $code) {
  $tableName      = @$_REQUEST['tableName'];
  $viewerUrlsLink = "?menu=database&amp;action=editTable&amp;tableName=$tableName#viewer";

  // Replace <#php and #>, makes writing PHP tags MUCH easier
  $code = str_replace('<#', '<?', $code);
  $code = str_replace('#>', '?>', $code);

  // default instructions
  if (!$instructions) {
    $instructions[] = sprintf('%s <b>%s-%s.php</b> (%s)',t('Save this code as'), htmlencode($tableName), $suffix,t('or choose your own name'));
    $instructions[] = sprintf('%s<a href="%s">%s</a> ',t('Update the '), $viewerUrlsLink,t('Viewer Urls'),t('for this section with the new url'));
  }

  // debug: allow evaling code
  if (@$_REQUEST['_eval'] && !alert()) {
    if (!@$GLOBALS['CG2_DEBUG']) { die("Debug mode not enabled!"); }
    $_REQUEST = array(); // clear _REQUEST() so searches don't get triggered
    eval("?>$code");
    exit;
  }

  // header
  echo cg2_header($function, $name);

  // body
?>
  <div style="padding: 10px; font-size; 14px">
    <b><?php et('Instructions')?>:</b>
    <ul>
      <?php foreach ($instructions as $line) { print "<li>$line</li>\n"; } ?>
    </ul>
  </div>

  <textarea name="phpCode" class="setAttr-spellcheck-false setAttr-wrap-off"
            style="width: 100%; height: 400px; border: 2px groove; font-family: monospace;"
            rows="10" cols="50"><?php
    $code = htmlencode($code, true);
    echo $code;
  ?></textarea>

  <div align="center" style="padding-right: 5px" class="fieldOption">
    <?php
      $backLink = htmlencode(thisPageUrl(array('_showCode' => '', 'phpCode' => ''))); // php code can be too long for get urls so remove it
      $backLink = preg_replace("/^.*\?/", '?', $backLink);
      print "<input class='button' type='button' name='_null_' value='&lt;&lt; ".t('Go Back')."' onclick=\"location.href='$backLink'\" />\n";

      if (@$GLOBALS['CG2_DEBUG']) {
        $evalLink = thisPageUrl(array('_eval' => '1'));
        $evalLink = preg_replace("/^.*\?/", '?', $evalLink);
        print "<input class='button' type='button' name='_eval' value='Debug: Run Viewer&gt;&gt;' onclick=\"location.href='$evalLink'\" />\n";
      }
    ?>
  </div>

<?php
  // footer
  echo cg2_footer();
}

//
function cg2_inputText($name, $size = 3, $padding=false) {
  if (!$padding) { $style = "padding: 1px 6px; margin: 0px; width: " . ceil($size*8). "px; text-align: center"; }
  else           { $style = "width: " . ceil($size*8). "px;"; }
  $value = htmlencode(@$_REQUEST[$name]);
  $html  = "<input class='text-input' style='$style' type='text' name='$name' value='$value' size='$size' />";
  return $html;
}

//
function cg2_inputRadio($name, $value) {
  $value       = htmlencode($value);
  $checkedAttr = checkedIf($value, @$_REQUEST[$name], true);
  $html        = "<input type='radio' name='$name' value='$value' $checkedAttr />";
  return $html;
}

// sets ID to $name so labels can work
function cg2_inputCheckbox($name) {
  $checkedAttr = checkedIf("1", @$_REQUEST[$name], true);
  $html        = "<input type='hidden' name='$name' value='0' />";
  $html       .= "<input type='checkbox' name='$name' id='$name' value='1' $checkedAttr />";
  return $html;
}


// currently only returns: textfield, textbox, and wysiwyg
function cg2_inputSchemaField($fieldname) {
  $html  = '';
  $html .= "<select name='$fieldname' class='ajax-schema-fields'>\n";
  $html .= cg2_inputSchemaField_getOptions(@$_REQUEST['tableName'], $fieldname);
  $html .= "</select>\n";
  return $html;
}

// currently only returns: textfield, textbox, and wysiwyg
function cg2_inputSchemaField_getOptions($tableName, $fieldname = '') {
  if (!$tableName) { return "<option value=''>" . htmlencode(t("<select section first>")). "</option>\n"; }

  $fieldnames   = array();
  $validTypes   = array('textfield','textbox','wysiwyg');
  $schema       = loadSchema($tableName);
  $fieldSchemas = array_filter($schema, 'is_array');
  foreach ($fieldSchemas as $name => $fieldSchema) {
    if (!in_array(@$fieldSchema['type'], $validTypes)) { continue; }
    $fieldnames[] = $name;
  }

  // get options HTML
  $htmlOptions   = "<option value=''>&lt;select field&gt;</option>\n";
  $htmlOptions  .= getSelectOptions(@$_REQUEST[$fieldname], $fieldnames);
  return $htmlOptions;
}

//
function cg2_option_selectSection() {

  // get options HTML
  $valuesToLabels   = array();
  $skippedMenuTypes = array('','menugroup','link');
  foreach (getSortedSchemas() as $tableName => $schema) {
    if (in_array(@$schema['menuType'], $skippedMenuTypes))  { continue; }
    if (@$schema['menuHidden']) { continue; }
    $menuType = @$schema['menuType'];
    $valuesToLabels[ $tableName ] = @$schema['menuName'] . " ($menuType)";
  }
  $optionsHTML = getSelectOptions(@$_REQUEST['tableName'], array_keys($valuesToLabels), array_values($valuesToLabels), true);
?>
  <div class="fieldOption">
    <div class="label" style="padding-top: 6px"><?php et('Select Section')?></div>
    <div style="float:left">
      <select name="tableName"><?php echo $optionsHTML ?></select>
    </div>
    <div class="clear"></div>
  </div>
<?php
}

//
function cg2_option_sorting() {
?>
  <div class="fieldOption" style="line-height: 1.5em">
    <div class="label"><?php et('Record Sorting')?></div>
    <div style="float:left">
      <label>
        <?php echo cg2_inputRadio('orderBy', 'default'); ?>
        <?php et('Default - use same sorting as editor (recommended)')?>
      </label><br/>

      <label>
        <?php echo cg2_inputRadio('orderBy', 'random'); ?>
        <?php et('Random - show records in random order')?>
      </label><br/><br/>

    </div>
    <div class="clear"></div>
  </div>
<?php
}


//
function cg2_option_uploads() {
?>
  <div class="fieldOption">
    <div class="label"><?php et('Show Uploads')?></div>
    <div style="float:left; line-height: 1.5">
        <label>
          <?php echo cg2_inputRadio('showUploads', 'all'); ?>
          <?php et("Show all uploads")?>
        </label><br/>

        <label>
          <?php echo cg2_inputRadio('showUploads', 'limit'); ?>
          <?php echo sprintf(t('Show %s uploads'), cg2_inputText('showUploadsCount', 3)); ?>
        </label><br/>

        <label>
          <?php echo cg2_inputRadio('showUploads', 'none'); ?>
          <?php et("Don't show uploads")?>
        </label><br/><br/>

    </div>
    <div class="clear"></div>
  </div>
<?php
}

//
function cg2_code_loadLibraries() {
  $libDirPath = $GLOBALS['PROGRAM_DIR'] . "/lib/";

  $escapedLibDirPath = dirname(dirname($libDirPath));
  $escapedLibDirPath = str_replace('\\', '\\\\', $escapedLibDirPath); # escape \\ for UNC paths (eg: \\SERVER/www/index.php)

  $programDirName = basename($GLOBALS['PROGRAM_DIR']);
?>

  // load viewer library
  $libraryPath = '<?php echo $programDirName ?>/lib/viewer_functions.php';
  $dirsToCheck = array('<?php echo $escapedLibDirPath ?>/','','../','../../','../../../');
  foreach ($dirsToCheck as $dir) { if (@include_once("$dir$libraryPath")) { break; }}
  if (!function_exists('getRecords')) { die("<?php et("Couldn't load viewer library, check filepath in sourcecode."); ?>"); }
<?php
}

//
function cg2_code_header() {
  if (@$GLOBALS['SETTINGS']['advanced']['codeGeneratorExpertMode']) { return; }

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
  <style type="text/css">
    body          { font-family: arial; }
    .instructions { border: 3px solid #000; background-color: #EEE; padding: 10px; text-align: left; margin: 25px}
  </style>
 </head>
<body>

<?php
}

//
function cg2_code_instructions($viewerType) {
  if (@$GLOBALS['SETTINGS']['advanced']['codeGeneratorExpertMode']) { return; }
?>
  <!-- INSTRUCTIONS -->
    <div class="instructions">
      <b>Sample <?php echo $viewerType ?> Viewer - Instructions:</b>
      <ol>
        <#php /*><li style="color: red; font-weight: bold">Rename this file to have a .php extension!</li><x */ #>
        <li><b>Remove any fields you don't want displayed.</b></li>
        <li>Rearrange remaining fields to suit your needs.</li>
        <li>Copy and paste code into previously designed page (or add design to this page).</li>
      </ol>
    </div>
  <!-- /INSTRUCTIONS -->
<?php
}

//
function cg2_code_schemaFields($schema, $varName, $tableName) {

  $fieldCode         = array();
  $fieldTypesSkipped = array('none', 'upload', 'separator', 'relatedRecords');
  $fieldNamesSkipped = array('hidden', 'publishDate', 'removeDate', 'neverRemove');
  $padding           = "      ";

  // get code for each schema fields
  foreach ($schema as $fieldname => $fieldSchema) {
    $skipField = !is_array($fieldSchema) ||                             // not a field definition, table metadata field
                 in_array(@$fieldSchema['type'], $fieldTypesSkipped) ||  // skip field types that aren't displayed
                 in_array($fieldname, $fieldNamesSkipped);              // skip internal field names that aren't displayed
    if ($skipField && $fieldname != 'num') { continue; }

    // get field code
    $labelOrName = @$fieldSchema['label'] ? $fieldSchema['label'] : $fieldname;
    $labelOrName = $padding . $labelOrName;
    $isSingleList = @$fieldSchema['type'] == 'list' && !in_array($fieldSchema['listType'], array('pulldownMulti', 'checkboxes'));
    $isMultiList  = @$fieldSchema['type'] == 'list' && !$isSingleList;

    if     (@$fieldSchema['type'] == 'date') {
      array_push($fieldCode, "$labelOrName: <#php echo date(\"D, M jS, Y g:i:s a\", strtotime({$varName}['$fieldname'])) #><br/><!-- For date formatting codes see: http://www.php.net/date -->\n");
    }
    elseif (@$fieldSchema['type'] == 'checkbox') {
      array_push($fieldCode, "$labelOrName (value): <#php echo {$varName}['$fieldname'] #><br/>\n");
      array_push($fieldCode, "$labelOrName (text):  <#php echo {$varName}['$fieldname:text'] #><br/>\n");
    }
    else if ($isSingleList) {
      array_push($fieldCode, "$labelOrName (value): <#php echo {$varName}['$fieldname'] #><br/>\n");
      array_push($fieldCode, "$labelOrName (label): <#php echo {$varName}['$fieldname:label'] #><br/>\n");
    }
    else if ($isMultiList) {
      array_push($fieldCode, "$labelOrName (values): <#php echo join(', ', {$varName}['$fieldname:values']); #><br/>\n");
      array_push($fieldCode, "$labelOrName (labels): <#php echo join(', ', {$varName}['$fieldname:labels']); #><br/>\n");
    }
    elseif (@$fieldSchema['type'] == 'wysiwyg') {
      array_push($fieldCode, "$labelOrName: <#php echo {$varName}['$fieldname']; #><br/>\n"); // no html encoding
    }
    else {
      array_push($fieldCode, "$labelOrName: <#php echo htmlencode({$varName}['$fieldname']) #><br/>\n");
    }
  }

  // add link
  $link = "<#php echo {$varName}['_link'] #>";
  array_push($fieldCode, "{$padding}_link : <a href=\"$link\">$link</a><br/>\n");

  //
  print implode('', $fieldCode);
}


//
function cg2_code_uploads($schema, $varName) {
  if (@$_REQUEST['showUploads'] == 'none') { return; } //

  // get code for each schema fields
  foreach ($schema as $fieldname => $fieldSchema) {
    if (!is_array($fieldSchema)) { continue; } // not a field definition, table metadata field
    if (@$fieldSchema['type'] != 'upload') { continue; } // skip all but upload fields
    $labelOrName = @$fieldSchema['label'] ? $fieldSchema['label'] : $fieldname;

    // get thumbnail urls and tags
    $thumbUrls = '';
    $thumbTags = '';
    foreach (array('',2,3,4) as $suffix) {
      $createThumbs  = @$fieldSchema["createThumbnails$suffix"];
      if (!$createThumbs) { continue; }
      $thumbUrls .= "\n          Thumb$suffix Url: <#php echo \$upload['thumbUrlPath$suffix'] #><br/>";
      $thumbTags .= "\n          <img src=\"<#php echo \$upload['thumbUrlPath$suffix'] #>\" width=\"<#php echo \$upload['thumbWidth$suffix'] #>\" height=\"<#php echo \$upload['thumbHeight$suffix'] #>\" alt=\"\" />";
    }

    // get info fields (title, caption, etc)
    $infoFields = '';
    foreach (array(1,2,3,4,5) as $suffix) {
      $infoFieldName  = @$fieldSchema["infoField$suffix"];
      if (!$infoFieldName) { continue; }
      $infoFields .= "\n          info$suffix ($infoFieldName) : <#php echo htmlencode(\$upload['info$suffix']) #><br/>";
    }
?>

      <!-- STEP 2a: Display Uploads for field '<?php echo $fieldname ?>' (Paste this anywhere inside STEP2 to display uploads) -->
        <!-- Upload Fields: extension, thumbFilePath, isImage, hasThumbnail, urlPath, width, height, thumbUrlPath, thumbWidth, thumbHeight, info1, info2, info3, info4, info5 -->
        <?php echo $labelOrName ?>: (Copy the tags from below that you want to use, and erase the ones you don't need)
        <blockquote>
        <#php foreach (<?php echo $varName ?>['<?php echo $fieldname ?>'] as $index => $upload): #>
<?php if (@$_REQUEST['showUploads'] == 'limit'): ?>
          <#php if ($index >= <?php echo intval(@$_REQUEST['showUploadsCount']) ?>) { continue; } // limit uploads shown #>

<?php endif ?>
          Upload Url: <#php echo $upload['urlPath'] #><br/>

<?php echo $thumbUrls ?><br/>
          Download Link: <a href="<#php echo $upload['urlPath'] #>">Download <#php echo $upload['filename'] #></a><br/><br/>

          Image Tags:<br/>
          <img src="<#php echo $upload['urlPath'] #>" width="<#php echo $upload['width'] #>" height="<#php echo $upload['height'] #>" alt="" /><?php
/* spacing only */ ?><?php echo $thumbTags ?><br/>
<?php echo $infoFields ?><br/>

          Extension: <#php echo $upload['extension'] #><br/>
          isImage: <#php if ($upload['isImage']): #>Yes<#php else: #>No<#php endif #><br/>
          hasThumbnail: <#php if ($upload['hasThumbnail']): #>Yes<#php else: #>No<#php endif #><br/>
          <hr/>

        <#php endforeach #>
        </blockquote>
      <!-- STEP2a: /Display Uploads -->

<?php
  }

}

//
function cg2_code_footer() {
  if (@$GLOBALS['SETTINGS']['advanced']['codeGeneratorExpertMode']) { return; }
?>
</body>
</html><?php
}

?>