<?php

class RelatedRecordsField extends Field {

function __construct($fieldSchema) {
  parent::__construct($fieldSchema);
}

//
function getTableRow($record, $value, $formType) {
  global $isMyAccountMenu;
  $parentTable = $GLOBALS['menu'];

  // set field attributes
  $relatedTable = $this->relatedTable;
  $relatedWhere = getEvalOutput( @$this->relatedWhere );
  $seeMoreLink  = @$this->relatedMoreLink ? "?menu=$relatedTable&amp;search=1&amp;_ignoreSavedSearch=1&amp;" . getEvalOutput($this->relatedMoreLink) : '';


  // load list functions
  require_once "lib/menus/default/list_functions.php";
  require_once "lib/viewer_functions.php";

  // save and update globals
  list($originalMenu, $originalTableName, $originalSchema) = array($GLOBALS['menu'], $GLOBALS['tableName'], $GLOBALS['schema']);
  $GLOBALS['menu']      = $relatedTable;
  $GLOBALS['tableName'] = $relatedTable;
  $GLOBALS['schema']    = loadSchema( $relatedTable );
  $GLOBALS['schema']    = array_merge($GLOBALS['schema'], getSchemaFields($GLOBALS['schema'])); // v2.16+, add pseudo-fields name and _tableName to all fieldSchemas.  Doing this once here instead of every time in loadSchema() is less expensive

  // load list data
  list($listFields, $records, $metaData) = list_functions_init(array(
    'isRelatedRecords' => true,
    'tableName'      => $relatedTable,
    'where'          => $relatedWhere,
    'perPage'        => @$this->relatedLimit,
  ));


  ### show header
  $html = '';

  $recordCount = count($records);
  $oneOrZero   = ($recordCount > 0) ? 1 : 0;
  $seeMoreHTML = $seeMoreLink ? "<br/><a href='$seeMoreLink'>" .htmlencode(t("see related records >>")). "</a>" : '';
  $showingText = sprintf(t('Showing %1$s - %2$s of %3$s related records'), $oneOrZero, $recordCount, $metaData['totalRecords']);
  ob_start(); ?>
<tr><td colspan="2">
  <div class="clear"></div>
  <div class="content-box">

    <div class="content-box-header">
      <div style="float:right; text-align: right; line-height: 110%">
        <?php echo $showingText ?>
        <?php echo $seeMoreHTML ?>
      </div>
      <h3><?php echo $this->label ?><!-- --></h3>
      <div class="clear"></div>
    </div> <!-- End .content-box-header -->

    <div class="content-box-content">
<?php $html .= ob_get_clean();


### show body

// show list
ob_start();
showListTable($listFields, $records, array(
  'isRelatedRecords' => true,
  'showView'         => @$this->relatedView,
  'showModify'       => @$this->relatedModify,
  'showErase'        => @$this->relatedErase,
  'showCreate'       => @$this->relatedCreate,
));
$html .= ob_get_clean();

### get footer
  $buttonsRight = '';
  if (@$this->relatedCreate) { // show "create" button for related records
    $buttonsRight = relatedRecordsButton(t('Create'), "?menu={$relatedTable}&action=edit&{$parentTable}Num=###");
  }
  $tableName      = $relatedTable;
  $isRelatedTable = true;
  $buttonsRight   = applyFilters('list_buttonsRight', $buttonsRight, $tableName, $isRelatedTable);

$html .= <<<__FOOTER__

    <div style='float:right; padding-top: 3px'>
    $buttonsRight
    </div>
    <div class='clear'></div>

    </div><!-- End .content-box-content -->
  </div><!-- End .content-box -->
</td></tr>
__FOOTER__;

  // reset globals
  list($GLOBALS['menu'], $GLOBALS['tableName'], $GLOBALS['schema']) = array($originalMenu, $originalTableName, $originalSchema);

  //
  return $html;

}

} // end of class

// relatedRecordsButton(t('Create'), ?menu=tableName&action=add&relatedNum=###"); // ### gets replaced with record number
// note: this can be called by this lib as well as by plugins
function relatedRecordsButton($label, $url, $addReturnUrl = true) {

  // add return url
  if ($addReturnUrl) {
    $returnUrl = thisPageUrl(array('num' => '###'), true); // ### gets replaced by saveRedirectAndReturn() in edit_functions.js
    $url .= "&returnUrl=" .urlencode($returnUrl);
  }

  //
  $onclick = htmlencode('saveRedirectAndReturn("' .jsEncode($url). '"); return false;');
  $button  = "<a href='#' onclick='$onclick'><input class='button' type='button' name='_null_' value='" .htmlencode($label). "' /></a>\n";
  return $button;
}

?>
