<?php
  ini_set('default_charset', 'utf-8');

function showPresetOptions() {

  $skipTables = array('custom','customSingle','customMulti','customCategory','customTextLink','customMenuGroup');
  foreach (getSchemaPresets() as $tableName => $menuName) {
    if (in_array($tableName, $skipTables)) { continue; }

    $encodedValue = htmlencode($tableName);
    $encodedLabel = htmlencode($menuName);
    print "<option value='$encodedValue'>$encodedLabel</option>\n";
  }
}

function showCopyOptions() {

  $includedTypes = array('single', 'multi', 'category');
  $skippedTables = array('accounts');
  foreach (getSortedSchemas() as $tableName => $schema) {
    if (preg_match("/^_/", $tableName))                  { continue; } // skip private tables
    if (in_array($tableName, $skippedTables))            { continue; } // skip system tables
    if (!in_array(@$schema['menuType'], $includedTypes)) { continue; } // skip unknown menu types

    $encodedValue = htmlencode($tableName);
    $encodedLabel = htmlencode(coalesce(@$schema['menuName'], $tableName));
    print "<option value='$encodedValue'>$encodedLabel</option>\n";
  }
}

?>
<!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />

  <?php include "lib/menus/header_css.php"; ?>

  <style type="text/css">
    body { margin: 10px; background-color: #FFF }
    *, input[type='button'], input[type='submit'] { font-size: 16px; }
    tr > td:first-child { padding-right: 0.5em; white-space: nowrap; }
    .tdAlignTop         { vertical-align: top; }

    .heading    { font-size: 150% !important; font-weight: bold; }
    .subheading { font-size: 105% !important; font-weight: bold; }

  </style>

  <!-- javascript -->
  <script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script>window.jQuery || document.write('<script src="3rdParty/jquery-1.11.0.min.js"><\/script>')</script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script><script>jQuery.migrateWarnings || document.write('<script src="3rdParty/jquery-migrate-1.2.1.min.js"><\/script>')</script>
  <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script><?php /* for datepicker and jquery sortable */ ?><script>window.jQuery.ui || document.write('<script src="3rdParty/jquery-ui-1.10.4.min.js"><\/script>')</script>
 </head>
<body id="addEditorPage">

<form method="post" action="?" id="addTableForm" onsubmit="return false;">
<input type="hidden" name="menu" value="database" />
<input type="hidden" name="_defaultAction" value="addTable_save" />

<div style="padding: 10px;">

<div class="heading"><?php echo t('Add New Editor'); ?>...</div><br/>

<table border="0" cellspacing="0" cellpadding="0">
  <tr>
   <td class="subheading tdAlignTop"><?php echo t('Menu Type'); ?></td>
   <td>

    <input type="radio" name="menuType" id="menuType-multi" value="multi" />
    <label for="menuType-multi"><?php echo t('<b>Multi Record</b> - multi record menus can have many records and
    are for sections such as News, FAQs, Jobs, Events, etc.'); ?></label><br/><br/>

    <input type="radio" name="menuType" id="menuType-single" value="single" />
    <label for="menuType-single"><b><?php echo t('Single Record</b> - single record menus have only one record
    and are for single page sections such as About Us, or Contact Us.'); ?></label><br/><br/>

    <input type="radio" name="menuType" id="menuType-preset" value="preset" />
    <select name="preset" id="preset">
      <option value=''>&lt;<?php echo t('Select Preset'); ?>&gt;</option>
      <?php showPresetOptions() ?>
    </select>
    <label for="menuType-preset"> - <?php echo t('pre-configured menus and fields for common websites sections.'); ?></label><br/><br/>

    <input type="radio" name="menuType" id="menuType-copy" value="copy" />
    <select name="copy" id="copy">
      <option value=''>&lt;<?php echo t('Select Existing Section'); ?>&gt;</option>
      <?php showCopyOptions() ?>
    </select>
    <label for="menuType-copy"> - <?php echo t('copy an existing section.') ?></label><br/><br/>

    <input type="radio" name="menuType" id="menuType-advanced" value="advanced" />
    <select name="advancedType" id="advancedType">
      <option value=''>&lt;<?php echo t('Advanced Menus'); ?>&gt;</option>
      <option value='category'><?php echo t('Category Menu'); ?></option>
      <option value='menugroup'><?php echo t('Menu Group'); ?></option>
      <option value='textlink'><?php echo t('Text Link'); ?></option>
    </select>
    <label for="menuType-advanced"> - <span id="advancedDescription">...</span></label><br/><br/>

   </td>
  </tr>

  <tr>
   <td class="subheading"><?php echo t('Menu Name'); ?></td>
   <td><input class="text-input medium-input" type="text" name="menuName" id="menuName" value='' style="width: 400px; font-size: 150%" onkeyup="autoFillTableName()" onchange="autoFillTableName()" /></td>
  </tr>
  <tr>
   <td class="subheading"><?php echo t('Table Name'); ?></td>
   <td><input class="text-input medium-input" type="text" name="tableName" id="tableName" value='' style="width: 400px; font-size: 150%" /></td>
  </tr>
  <tr>
   <td>&nbsp;</td>
   <td><?php echo t('Tip: Your table name is used in your viewer code so choose a short but meaningful name such as: news, articles, jobs, etc.'); ?></td>
  </tr>
  <tr><td colspan="2">&nbsp;</td></tr>

  <tr>
    <td colspan="2" align="right" style="text-align: right">
      <input class="button" type="button" onclick="self.parent.tb_remove()" value="<?php et('Cancel') ?>"  />
      <input class="button" type="submit" name="null" value="<?php echo t('Create New Menu'); ?> &gt;&gt;" />
      <br/>
    </td>
  </tr>
</table>

</div>

<script src="lib/admin_functions.js?<?php echo filemtime('lib/admin_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script src="3rdParty/jqueryPlugins/jqueryForm.js"></script>
<script src="lib/menus/database/addTable_functions.js?<?php echo filemtime('lib/menus/database/addTable_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script>
  function _updateAdvancedDescription(advancedType) {
    var description  = '';
    if      (advancedType == '')          { description = '<?php echo jsEncode(t("select an advanced menu type to see the description.")); ?>'; }
    else if (advancedType == 'category')  { description = '<?php echo jsEncode(t("category menus let you organize records in a tree structure and are for creating website menus and navigation.")); ?>'; }
    else if (advancedType == 'menugroup') { description = '<?php echo jsEncode(t("menu groups let you create menu headers to group related menu options under.")); ?>'; }
    else if (advancedType == 'textlink')  { description = '<?php echo jsEncode(t("text links let you add an external link to your menu that looks the same as a regular menu item.")); ?>'; }
    else                                  { description = "<?php echo jsEncode(t("Unknown advanced type")); ?> '" +advancedType+ "'"; }
    $('#advancedDescription').html( description );

  }
</script>


</form>

</body>
</html>
