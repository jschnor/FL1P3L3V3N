<?php
  global $tableName, $escapedTableName, $schema, $menu, $isSingleMenu, $preSaveTempId;
  require_once "lib/menus/default/view_functions.php";
  require_once "lib/viewer_functions.php";

  // always edit record 1 for single menu
  if ($isSingleMenu) { $_REQUEST['num'] = 1; }

  ### load record
  $num = (int) @$_REQUEST['num'];

  // error checking
  if ($escapedTableName == '') { die("no tablename specified!"); }
  if ($num != (int) $num)      { die("record number value must be an integer!"); }

  // load record
  $GLOBALS['RECORD'] = array();
  if ($num) {
	  list($records) = getRecords(array(
      'tableName'               => $tableName,
      'where'                   => mysql_escapef(" num = ? ", $num),
      'limit'                   => '1',
      'loadCreatedBy'           => false,
      'allowSearch'             => false,
      'loadUploads'             => false,
      'loadPseudoFields'        => true,  // This is needed to display list labels on "view" menu
      'ignoreHidden'            => true,  // ... the rest of these settings are needed to show "all" records
      'ignorePublishDate'       => true,  // ... even if they are hidden, etc. since this is the backend we
      'ignoreRemoveDate'        => true,  // ... want to show everything.
      'includeDisabledAccounts' => true,  //
    ));
    $GLOBALS['RECORD'] = @$records[0]; // get first record
  }
  if (!$GLOBALS['RECORD']) {
    alert(t("Couldn't view record (record no longer exists)!"));
    include('lib/menus/default/list.php');
    exit;
  }

  //
  //doAction('record_preedit', $tableName, @$_REQUEST['num']);

  //
  showHeader();
?>

<script type="text/javascript" src="3rdParty/jqueryPlugins/jqueryForm.js"></script>
<script type="text/javascript" src="3rdParty/jqueryPlugins/thickbox.js"></script>
<script type="text/javascript" src="lib/menus/default/view_functions.js?<?php echo filemtime('lib/menus/default/view_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script type="text/javascript" src="3rdParty/jqueryPlugins/uploadify/jquery.uploadify.v2.1.0.min.js"></script>
<script type="text/javascript" src="3rdParty/swfobject.js"></script>


<form method="post" action="?" onsubmit="tinyMCE.triggerSave();">
<input type="hidden" name="menu" id="menu" value="<?php echo htmlencode($menu) ?>" />
<input type="hidden" name="_returnUrl" id="returnUrl" value="<?php echo htmlencode(@$_REQUEST['returnUrl']) ?>" />
<input type="hidden" name="_defaultAction" value="save" />
<input type="hidden" name="num"           id="num"           value="<?php echo htmlencode(@$_REQUEST['num']) ?>" />
<input type="hidden" name="preSaveTempId" id="preSaveTempId" value="<?php echo htmlencode($preSaveTempId) ?>" />
<input type="hidden" name="dragSortOrder"                    value="<?php echo (int) @$_REQUEST['dragSortOrder'] ?>" />

<div class="content-box">
  <div class="content-box-header">
    <div style="float:right">
    <?php
      $buttonsRight  = '';
      $buttonsRight .= "<input class='button' type='button' name='cancel' value='" .t('Cancel'). "' onclick=\"viewCancel();\" />\n";
      $buttonsRight  = applyFilters('view_buttonsRight', $buttonsRight, $tableName, $GLOBALS['RECORD']);
      echo $buttonsRight;
    ?>
    </div>

    <h3><a href="?menu=<?php echo $menu ?>" ><?php echo $schema['menuName'] ?></a></h3>
    <div class="clear"></div>
  </div> <!-- End .content-box-header -->


  <div class="content-box-content">

  <table cellspacing="0" width="100%" id="editForm"><tr><td>
  <table cellspacing="0" width="100%" class="spacedTable bottomBorder">

  <?php showViewFormRows($GLOBALS['RECORD']) ?>

  </table>
  </td></tr></table>

  <br/>
  <div style="float:left">

  <?php if ($CURRENT_USER['isAdmin']): /* Only show advanced commands for admin users since there is no non-admin commands */ ?>
     <select name="_advancedAction" id="advancedAction">
      <option value=''><?php et('Advanced Commands...') ?></option>
      <option value=''>&nbsp;</option>
    <?php if ($CURRENT_USER['isAdmin']): ?>
      <option value="?menu=database&amp;action=editTable&amp;tableName=<?php echo urlencode($tableName) ?>"><?php et('Admin: Edit Section') ?></option>
      <option value="?menu=_codeGenerator&amp;tableName=<?php echo urlencode($tableName) ?>"><?php et('Admin: Code Generator') ?></option>
    <?php endif; ?>

     </select>
     <input class="button" type="submit" name="_advancedActionSubmit" value=" go " onclick="$('form').ajaxFormUnbind();" />
     <br />
  <?php endif; ?>

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

<?php showFooter(); ?>
