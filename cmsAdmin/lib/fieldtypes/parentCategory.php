<?php

class ParentCategoryField extends Field {

  function __construct($fieldSchema) {
    parent::__construct($fieldSchema);
  }

  // editFormHtml
  function editFormHtml($record) {
    global $escapedTableName, $CURRENT_USER;

    // set field attributes
    $fieldValue  = $record ? @$record[$this->name] : '';

    // load categories
    $categoriesByNum = array();
    $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
    $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
    while ($row = mysql_fetch_assoc($result)) {
      $isOwner = @$row['createdByUserNum'] == $CURRENT_USER['num'];
      if (@$row['createdByUserNum'] && (!$isOwner && !$GLOBALS['hasEditorAccess'])) { continue; }
      $categoriesByNum[ $row['num'] ] = $row;
    }
    if (is_resource($result)) { mysql_free_result($result); }

    //
    print "  <tr>\n";
    print "   <td>{$this->label}</td>\n";
    print "   <td>\n";

    print "  <select name='{$this->name}'>\n";
    print "  <option value='0'>None (top level category)</option>\n";

    foreach ($categoriesByNum as $num => $category) {
      $value         = $category['num'];
      $selectedAttr  = selectedIf($value, $fieldValue, true);
      $encodedLabel  = htmlencode($category['breadcrumb']);
      $isUnavailable = preg_match("/:" .@$record['num']. ":/", $category['lineage']);
      $extraAttr     = $isUnavailable ? "style='color: #AAA' disabled='disabled' " : '';

      print "<option value=\"$value\" $extraAttr $selectedAttr>$encodedLabel</option>\n";
    }
    print "  </select>\n";



    //
    print "   </td>\n";
    print "  </tr>\n";
  }

}

?>
