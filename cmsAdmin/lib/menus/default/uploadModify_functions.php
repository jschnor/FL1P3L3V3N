<?php


// submit uploads
if (@$_REQUEST['save']) { saveUploadDetails(); }


//
function saveUploadDetails() {
  global $TABLE_PREFIX;

  // update uploads
  if (is_array(@$_REQUEST['uploadNums'])) {
    foreach ($_REQUEST['uploadNums'] as $uploadNum) {
      if (!$uploadNum) { die(__FUNCTION__ . ": No upload num specified!"); }

      $query =  "UPDATE `{$TABLE_PREFIX}uploads`\n";
      $query .= "   SET info1 = '".mysql_escape( @$_REQUEST["{$uploadNum}_info1"] )."',\n";
      $query .= "       info2 = '".mysql_escape( @$_REQUEST["{$uploadNum}_info2"] )."',\n";
      $query .= "       info3 = '".mysql_escape( @$_REQUEST["{$uploadNum}_info3"] )."',\n";
      $query .= "       info4 = '".mysql_escape( @$_REQUEST["{$uploadNum}_info4"] )."',\n";
      $query .= "       info5 = '".mysql_escape( @$_REQUEST["{$uploadNum}_info5"] )."'\n";
      $query .= " WHERE num = '".mysql_escape( $uploadNum )."' AND ";
      if      ($_REQUEST['num'])           { $query .= "recordNum     = '".mysql_escape( $_REQUEST['num'] )."'"; }
      else if ($_REQUEST['preSaveTempId']) { $query .= "preSaveTempId = '".mysql_escape( $_REQUEST['preSaveTempId'] )."'"; }
      else                             { die("No value specified for 'num' or 'preSaveTempId'!"); }
      mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
    }
  }

  //
  print "<script type='text/javascript'>self.parent.reloadIframe('{$_REQUEST['fieldName']}_iframe')</script>";  // reload uploadlist
  print "<script type='text/javascript'>self.parent.tb_remove();</script>\n";  // close thickbox
  exit;
}

?>
