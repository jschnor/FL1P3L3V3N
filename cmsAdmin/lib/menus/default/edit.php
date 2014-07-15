<?php
  global $tableName, $escapedTableName, $schema, $menu, $isSingleMenu, $preSaveTempId;
  require_once "lib/menus/default/edit_functions.php";

  // always edit record 1 for single menu
  if ($isSingleMenu) { $_REQUEST['num'] = 1; }

  // new records - generate $preSaveTempId for uploads if no record number
  $preSaveTempId = '';
  if (!@$_REQUEST['num']) { $preSaveTempId = uniqid('x'); }

  ### load record
  $num = (int) @$_REQUEST['num'];

  // error checking
  if ($escapedTableName == '') { die("no tablename specified!"); }
  if ($num != (int) $num)      { die("record number value must be an integer!"); }

  // load record
  $GLOBALS['RECORD'] = array();
  if ($num) {
    $GLOBALS['RECORD'] = mysql_get($tableName, $num);
  }

  //
  doAction('record_preedit', $tableName, @$_REQUEST['num']);

  //
  $previewUrl = coalesce(@$schema['_previewPage'], @$schema['_detailPage']);
  if ($previewUrl) { $previewUrl = PREFIX_URL .$previewUrl. '?' .urlencode(t('preview')). '-9999999999'; } // note that 9999999999 is a special number which getRecords() uses to know this is a preview request
  $showPreviewButton = !@$schema['_disablePreview'] && $previewUrl;
  
  //
  showHeader();
?>

<script type="text/javascript" src="3rdParty/jqueryPlugins/jqueryForm.js"></script>
<script type="text/javascript" src="3rdParty/jqueryPlugins/thickbox.js"></script>
<script type="text/javascript" src="lib/menus/default/edit_functions.js?<?php echo filemtime('lib/menus/default/edit_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script type="text/javascript" src="3rdParty/jqueryPlugins/uploadify/jquery.uploadify.v2.1.0.min.js"></script>
<script type="text/javascript" src="3rdParty/swfobject.js"></script>
<?php loadWysiwygJavascript(); ?>


<form method="post" action="?" onsubmit="tinyMCE.triggerSave();">
<input type="hidden" name="menu" id="menu" value="<?php echo htmlencode($menu) ?>" />
<input type="hidden" name="_returnUrl" id="returnUrl" value="<?php echo htmlencode(@$_REQUEST['returnUrl']) ?>" />
<input type="hidden" name="_previewUrl"    id="previewUrl"     value="<?php echo htmlencode($previewUrl) ?>" />
<input type="hidden" name="_defaultAction" value="save" />
<input type="hidden" name="num"           id="num"           value="<?php echo htmlencode(@$_REQUEST['num']) ?>" />
<input type="hidden" name="preSaveTempId" id="preSaveTempId" value="<?php echo htmlencode($preSaveTempId) ?>" />
<input type="hidden" name="dragSortOrder"                    value="<?php echo (int) @$_REQUEST['dragSortOrder'] ?>" />

<div class="content-box">
  <div class="content-box-header">
    <div style="float:right">
    <?php
      $buttonsRight  = '';
      $buttonsRight .= "<input class='button' type='submit' name='_action=save' value='" .t('Save'). "' />\n";
      if ($showPreviewButton) {
        $buttonsRight .= "<input class='button' type='button' name='preview' value='" .t('Preview'). "' onclick=\"editPreview();\" />\n";
      }
      $buttonsRight .= "<input class='button' type='button' name='cancel' value='" .t('Cancel'). "' onclick=\"editCancel();\" />\n";
      $buttonsRight  = applyFilters('edit_buttonsRight', $buttonsRight, $tableName, $GLOBALS['RECORD']);
      echo $buttonsRight;
    ?>
    </div>

    <h3><a href="?menu=<?php echo $menu ?>" ><?php echo $schema['menuName'] ?></a></h3>
    <div class="clear"></div>
  </div> <!-- End .content-box-header -->


  <div class="content-box-content">

  <table cellspacing="0" width="100%" id="editForm"><tr><td>
  <table cellspacing="0" width="100%" class="spacedTable bottomBorder">

  <?php showFields($GLOBALS['RECORD']) ?>

  </table>
  </td></tr></table>

  <br/>
  <div style="float:left">

    <?php
      $advancedCommands = array();

      if ($CURRENT_USER['isAdmin']) { $advancedCommands['Admin: Edit Section']   = '?menu=database&action=editTable&tableName=' . urlencode($tableName); }
      if ($CURRENT_USER['isAdmin']) { $advancedCommands['Admin: Code Generator'] = '?menu=_codeGenerator&tableName='    . urlencode($tableName); }

      $advancedCommands = applyFilters('edit_advancedCommands', $advancedCommands);

      if ($advancedCommands) {
        $labels = array_map('t', array_keys($advancedCommands)); // translate labels
        ?>
        <select name="_advancedAction" id="advancedAction">
          <option value=''><?php et('Advanced Commands...') ?></option>
          <option value=''>&nbsp;</option>
          <?php echo getSelectOptions(null, array_values($advancedCommands), $labels); ?>
        </select>
        <input class="button" type="submit" name="_advancedActionSubmit" value=" go " onclick="$('form').ajaxFormUnbind();" />
        <br />
        <?php
      }

    ?>

  </div>
  <div style="float:right">
    <?php
      echo $buttonsRight;
    ?>
  </div>
  <div class="clear"></div>


  </div>
</div>



</form>
<script type="text/javascript"><!--
  $(document).ready(function(){
    initSortable(null, updateDragSortOrder_forList);
  });
//--></script>
<?php showWysiwygGeneratorCode() ?>
<?php showFooter(); ?>
