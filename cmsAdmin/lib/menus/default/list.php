<?php
  global $TABLE_PREFIX, $CURRENT_USER, $tableName, $schema, $hasEditorAccess, $hasAuthorAccess, $hasViewerAccessOnly, $isMyAccountMenu, $menu;
  if ($isMyAccountMenu) { die("Access not permitted for My Account menu!"); }

  require_once "lib/menus/default/list_functions.php";
  require_once "lib/viewer_functions.php";

  //
  redirectSingleRecordAuthorsToEditPage();

  //
  list($listFields, $records, $metaData) = list_functions_init();

  //
  doAction('list_postselect', $records, $listFields, $metaData);

  //
  showHeader();
?>

<form method="get" name="preview" action="<?php echo PREFIX_URL ?><?php echo @$schema['_listPage'] ?>" target="_blank">
</form>

<form method="post" name="searchForm" action="?">
<input type="submit" style="width: 0px; height: 0px; position: absolute; border: none; padding: 0px" /> <!-- bugfix: hitting enter in textfield submits first submit button on form -->
<input type="hidden" name="menu" id="menu" value="<?php echo htmlencode($tableName) ?>" />
<input type="hidden" name="_defaultAction" value="list" />
<input type="hidden" name="page" value="<?php echo $metaData['page'] ?>" />
<input type="hidden" name="showAdvancedSearch" id="showAdvancedSearch" value="<?php echo @$_REQUEST['showAdvancedSearch'] ?>" />

<div class="clear"></div>

<div class="content-box">

  <div class="content-box-header">
    <div style="float:right">
    <?php
      $showCreateButton  = !@$schema['_disableAdd'] && !$hasViewerAccessOnly;
      $showPreviewButton = !@$schema['_disablePreview'] && @$schema['_listPage'];

      $buttonsRight  = '';
      if ($showCreateButton) {
        $createOnClick  = 'onclick="window.location=\'?menu=' .urlencode($menu). '&amp;action=add\'"';
        $buttonsRight  .= "<input class='button' type='button' name='_action=add' value='" .t('Create'). "' $createOnClick />\n";
      }
      if ($showPreviewButton) {
        $previewOnClick = 'onclick="document.forms.preview.submit();"';
        $buttonsRight  .= "<input class='button' type='button' name='null' value='" .t('Preview'). "' $previewOnClick />\n";
      }
      $isRelatedTable = false;
      $buttonsRight  = applyFilters('list_buttonsRight', $buttonsRight, $tableName, $isRelatedTable);
      echo $buttonsRight;
    ?>
    </div>

    <h3><a href="?menu=<?php echo $tableName ?>" ><?php echo $schema['menuName'] ?></a></h3>
    <div class="clear"></div>
  </div> <!-- End .content-box-header -->


  <div class="content-box-content">

<!-- search and results bar -->

<div style="float:left">

  <table cellspacing="0" class="spacedTable">
  <?php
    $searchFields = getSearchFieldLabelsAndHTML();
    foreach ($searchFields as $labelAndHTML):
      list($searchFieldLabel, $searchFieldHTML) = $labelAndHTML;

      $searchFieldClass   = @$searchFieldClass ? 'secondarySearchField' : 'primarySearchField';
      $isFirstSearchField = ($searchFieldClass == 'primarySearchField');
      $searchFieldStyle   = ($isFirstSearchField || @$_REQUEST['showAdvancedSearch']) ? '' : 'display: none';
  ?>
      <tr class="<?php echo $searchFieldClass ?>" style="<?php echo $searchFieldStyle ?>">
        <td><?php echo $searchFieldLabel ?> &nbsp;</td>
        <td>
          <?php echo $searchFieldHTML ?> &nbsp;
          <?php if ($isFirstSearchField && count($searchFields) > 1): ?>
            <span class="hideShowSecondarySearchFields" style="<?php if (@$_REQUEST['showAdvancedSearch'])  { echo 'display: none'; } ?>"><a href="#" onclick="return toggleAdvancedSearchOptions();"><?php et('advanced search &gt;&gt;'); ?></a></span>
            <span class="hideShowSecondarySearchFields" style="<?php if (!@$_REQUEST['showAdvancedSearch']) { echo 'display: none'; } ?>"><a href="#" onclick="return toggleAdvancedSearchOptions();"><?php et('&lt;&lt; basic search'); ?></a></span>
          <?php endif ?>
        </td>
      </tr>
    <?php endforeach ?>

    <?php doAction('list_postAdvancedSearch', @$_REQUEST['menu']); ?>

    <tr>
      <td><?php et('Per page'); ?>&nbsp;</td>
      <td>
        <select name="perPage">
          <?php echo getSelectOptions($metaData['perPage'], array(5, 10, 25, 50, 100, 250, 1000)); ?>
        </select>&nbsp;
        <?php if ($searchFields): ?>
        <input class="button" type="submit" name="search"      value="<?php et('Search') ?>"  />
        <input class="button" type="submit" name="_resetSearch" value="<?php et('Reset') ?>"  /><br />
        <?php else: ?>
        <input class="button" type="submit" name="search"      value="<?php et('Update') ?>"  />
        <?php endif ?>
      </td>
    </tr>
  </table>

</div>
<div style="float:right">

 <table cellspacing="0" class="spacedTable">
    <tr>
     <td style="text-align: center">
      <?php if (@$_REQUEST['search']): ?>
        <?php printf(t('Matched: %s of %s'), $metaData['totalMatches'], $metaData['totalRecords']) ?>
      <?php else: ?>
        <?php printf(t('Total Records: %s'), $metaData['totalRecords']) ?>
      <?php endif ?>
     </td>
    </tr>
    <tr>
     <td style="text-align: center">
     <?php
       // This field is renamed to "page" when changed by user
       $pageFieldHTML = "<input class='text-input' type='text' size='3' name='_unused' value='{$metaData['page']}' id='pageNum' />";
       printf(t('Page %s of %s'), $pageFieldHTML, $metaData['totalPages']);
     ?>

     </td>
    </tr>
    <tr><td style="white-space: nowrap; text-align: center">
     <a href="?menu=<?php echo htmlencode($tableName) ?>&amp;_action=list&amp;page=<?php echo $metaData['prevPage']?>"><?php et('&lt;&lt; Prev Page') ?></a> |
     <a href="?menu=<?php echo htmlencode($tableName) ?>&amp;_action=list&amp;page=<?php echo $metaData['nextPage']?>"><?php et('Next Page &gt;&gt;') ?></a><br />
    </td></tr>
   </table>

</div>

<div class="clear"></div>
<div class="divider_line"></div>

<!-- list column headings -->
<?php showListTable($listFields, $records); ?>


<br/>
  <!-- list footer -->
    <div style="float:left">

      <?php
        $advancedCommands = array();

        $allowEraseSelected = !@$schema['_disableErase'] && !$hasViewerAccessOnly;
        if ($allowEraseSelected)      { $advancedCommands['Erase selected']        = 'eraseRecords';  }
        if ($CURRENT_USER['isAdmin']) { $advancedCommands['Admin: Edit Section']   = 'editSection';   }
        if ($CURRENT_USER['isAdmin']) { $advancedCommands['Admin: Code Generator'] = '?menu=_codeGenerator&tableName=' . $GLOBALS['tableName']; }

        $advancedCommands = applyFilters('list_advancedCommands', $advancedCommands);

        if ($advancedCommands) {
          $labels = array_map('t', array_keys($advancedCommands)); // translate labels
          ?>
          <select name="_advancedAction">
            <option value=''><?php et('Advanced Commands...') ?></option>
            <option value=''>&nbsp;</option>
            <?php echo getSelectOptions(null, array_values($advancedCommands), $labels); ?>
          </select>
          <input name="_advancedActionSubmit" value=" go "  class="button" type="submit" />
          <br />
          <?php
        }

      ?>

    </div>
    <div style="float:right">
      <?php echo $buttonsRight; ?>
    </div>
    <div class="clear"></div>

    <?php applyFilters('listPage_footer', $tableName); ?>


  </div> <!-- End .content-box-content -->





</div>


</form>
<script type="text/javascript" src="lib/menus/default/list_functions.js?<?php echo filemtime('lib/menus/default/list_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script type="text/javascript"><!--
  $(document).ready(function(){
<?php if (@$GLOBALS['schema']['menuType'] == 'category'): ?>
    initSortable(markSiblings, updateCategoryDragSortOrder);
<?php else:?>
    initSortable(null, updateDragSortOrder_forList);
<?php endif; ?>
  });
//--></script>

<?php showFooter(); ?>
