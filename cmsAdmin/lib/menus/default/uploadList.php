<?php
  global $tableName, $menu;

  // error checking
  if (!array_key_exists('menu', $_REQUEST))               { die("no 'menu' value specified!"); }
  if (!@$_REQUEST['fieldName'])                           { die("no 'fieldName' value specified!"); }
  if (!@$_REQUEST['num'] && !@$_REQUEST['preSaveTempId']) { die("No record 'num' or 'preSaveTempId' was specified!"); }

  // get uploads
  $uploads         = array();
  $fieldSchema     = $schema[$_REQUEST['fieldName']];
  $hasModifyFields = @$fieldSchema["infoField1"] || @$fieldSchema["infoField2"] || @$fieldSchema["infoField3"] || @$fieldSchema["infoField4"] || @$fieldSchema["infoField5"];
  $uploadCount = 0;
  $records = getUploadRecords($tableName, $_REQUEST['fieldName'], @$_REQUEST['num'], @$_REQUEST['preSaveTempId'], null);
  foreach ($records as $row) {
    $filename             = pathinfo($row['filePath'], PATHINFO_BASENAME);
    $jsEscapedFilename    = addcslashes(htmlencode($filename), '\\\'');
    $row['_modifyLinkJS'] = "modifyUpload('{$row['num']}', '$jsEscapedFilename', this); return false;";
    $row['_removeLinkJS'] = "removeUpload('{$row['num']}', '$jsEscapedFilename', this); return false;";

    $row['_infoFields']   = '';
    foreach (range(1,5) as $num) {
      $fieldLabel = @$fieldSchema["infoField$num"];
      $fieldValue = @$row["info$num"];
      if (!$fieldLabel) { continue; }
      $row['_infoFields'] .= htmlencode($fieldLabel) . ': '. htmlencode($fieldValue). "<br/>\n";
    }

    $uploads[] = $row;
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

  <!-- javascript -->
  <script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script>window.jQuery || document.write('<script src="3rdParty/jquery-1.11.0.min.js"><\/script>')</script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script><script>jQuery.migrateWarnings || document.write('<script src="3rdParty/jquery-migrate-1.2.1.min.js"><\/script>')</script>
  <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script><?php /* for datepicker and jquery sortable */ ?><script>window.jQuery.ui || document.write('<script src="3rdParty/jquery-ui-1.10.4.min.js"><\/script>')</script>
  
  <link   type="text/css"       href="3rdParty/jqueryUI/css/smoothness/jquery-ui-1.8.18.custom.css" rel="stylesheet" />
  <script src="lib/dragsort.js?<?php echo filemtime('lib/dragsort.js'); // on file change browsers should no longer use cached versions ?>"></script>
 </head>
<body>

<form method="post" action="?">
<input type="hidden" name="menu" id="menu" value="<?php echo htmlencode($menu) ?>" />
<input type="hidden" name="tableName" id="tableName" value="<?php echo htmlencode($tableName) ?>" />
<input type="hidden" name="fieldName" id="fieldName" value="<?php echo htmlencode(@$_REQUEST['fieldName']) ?>" />
<input type="hidden" name="num"  id="num" value="<?php echo htmlencode(@$_REQUEST['num']) ?>" />
<input type="hidden" name="preSaveTempId"  id="preSaveTempId" value="<?php echo htmlencode(@$_REQUEST['preSaveTempId']) ?>" />

  <?php if (@$_REQUEST['errors']): ?>
    <div style="color: red; margin: 10px 0;">
      <?php
        $errors = $_REQUEST['errors'];
        $errors = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;", urldecode($errors)); // convert utf8 url encoding to utf8 string
        $errors = preg_replace('/<br\/>/', "\n", $errors);
        $errors = strip_tags($errors);
        $errors = htmlencode($errors); // prevent XSS
        $errors = nl2br($errors);

        echo $errors;
      ?>
    </div>
  <?php endif ?>

<table border="0" cellspacing="0" cellpadding="0" class="data sortable uploadlist">
 <thead>
 <tr class="nodrag nodrop">
<?php if (@$_REQUEST['formType'] != 'view'): ?>
  <th width="40" style="text-align: center"><?php et('Drag') ?></th>
<?php endif ?>
  <th width="60" style="text-align: center"><?php et('Preview') ?></th>
  <th width="260"><?php et('Details') ?></th>
<?php if (@$_REQUEST['formType'] != 'view'): ?>
  <th width="130" style="text-align: center" colspan="2"><?php et('Commands') ?></th>
<?php endif ?>
 </tr>
 </thead>

<?php
 foreach ($uploads as $row):
   $uploadCount++;
?>
    <tr class="uploadRow">
<?php if (@$_REQUEST['formType'] != 'view'): ?>
     <td width="40" style="text-align: center; vertical-align: middle" class="dragger">
      <input type='hidden' name='_uploadNum' value='<?php echo $row['num'] ?>' class='_uploadNum' />
      <img src="lib/images/drag.gif" height="6" width="19" class='dragger' title='<?php et('Click and drag to change order.') ?>' alt='' /><br/>
     </td>
<?php endif ?>
     <td width="60" style="text-align: center; vertical-align: middle; padding: 2px;">

       <?php showUploadPreview($row, 50); ?>
     </td>
     <td width="260" style="vertical-align: top" valign="top">
       <?php echo $row['_infoFields']; ?>
       <?php et('Filename:'); ?> <?php echo htmlencode(pathinfo($row['filePath'], PATHINFO_BASENAME)); ?>
     </td>
<?php if (@$_REQUEST['formType'] != 'view'): ?>
     <?php if ($hasModifyFields): ?>
       <td width="65" style="text-align: center; vertical-align: middle;"><a href="#" onclick="<?php echo $row['_modifyLinkJS']; ?>"><?php et('modify') ?></a></td>
       <td width="65" style="text-align: center; vertical-align: middle;"><a href="#" onclick="<?php echo $row['_removeLinkJS']; ?>"><?php et('remove') ?></a></td>
     <?php else: ?>
       <td width="130" style="text-align: center; vertical-align: middle;" colspan="2"><a href="#" onclick="<?php echo $row['_removeLinkJS']; ?>"><?php et('remove') ?></a></td>
     <?php endif ?>
<?php endif ?>
    </tr>
<?php endforeach; ?>
  <tr style="display: none"><td></td></tr>
</table>

 <table border="0" cellspacing="0" cellpadding="0" class="noUploads" style="display: none; width: 100%">
  <tr><td style="text-align: center; padding: 30px"><?php et('There are no files uploaded for this record.') ?></td></tr>
 </table>

<script type="text/javascript"><!-- // language strings
  lang_confirm_erase_image = '<?php echo addslashes(t("Remove file: %s")) ?>';
//--></script>
<script type="text/javascript" src="lib/admin_functions.js?<?php echo filemtime('lib/admin_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script type="text/javascript" src="lib/menus/default/uploadList_functions.js?<?php echo filemtime('lib/menus/default/uploadList_functions.js'); // don't cache changed files ?>"></script>
</form>
</body>
</html>
