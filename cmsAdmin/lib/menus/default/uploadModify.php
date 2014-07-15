<?php
  global $tableName, $errors, $menu;
  require_once "lib/menus/default/uploadModify_functions.php";
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
 </head>
<body>

<form method="post" action="?" enctype="multipart/form-data">
<input type="hidden" name="_defaultAction" value="uploadModify" />
<input type="hidden" name="menu"          value="<?php echo htmlencode($menu); ?>" />
<input type="hidden" name="fieldName"     value="<?php echo htmlencode(@$_REQUEST['fieldName']) ?>" />
<input type="hidden" name="num"           value="<?php echo htmlencode(@$_REQUEST['num']) ?>" />
<input type="hidden" name="preSaveTempId" value="<?php echo htmlencode(@$_REQUEST['preSaveTempId']) ?>" />
<input type="hidden" name="save" value="1" />

<script>
window.focus();
</script>

<div align="center" style="padding: 10px">

  <!-- page header -->
  <div style="float: left">
    <h2><?php et('Upload Details') ?></h2>
  </div>

  <div style="float: right">
    <input class="button" type="submit" name="_action=uploadModify" value="<?php et('Save') ?>"  />
    <input class="button" type="button" onclick="self.parent.tb_remove()" value="<?php et('Cancel') ?>"  />
  </div>

  <div class="clear"></div>

  <?php if (@$_REQUEST['errors']): ?>
    <div style="color: red; margin: 10px 0;">
      <?php
        $errors = $_REQUEST['errors'];
        $errors = preg_replace('/<br\/>/', "\n", $errors);
        $errors = strip_tags($errors);
        $errors = htmlencode($errors); // prevent XSS
        $errors = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;", urldecode($errors)); // convert utf8 url encoding to utf8 string
        $errors = nl2br($errors);

        echo $errors;
      ?>
    </div>
  <?php endif ?>

  <!-- table header -->
  <br/>
  <table border="0" cellpadding="5" cellspacing="1" width="100%" class="data">
   <thead>
   <tr>
    <th style="text-align: center" width="160"><?php et('Preview') ?></th>
    <th><?php et('Details') ?></th>
   </tr>
   </thead>

  <!-- table rows -->
  <?php
    $uploadCount   = 0;
    $uploadRecords = getUploadRecords($tableName, $_REQUEST['fieldName'], @$_REQUEST['num'], @$_REQUEST['preSaveTempId'], @$_REQUEST['uploadNums']);
    foreach ($uploadRecords as $uploadRecord):
      $uploadCount++;
  ?>
   <tr>
     <td style="padding: 2px; text-align: center; vertical-align: top;">
       <?php showUploadPreview($uploadRecord, 150); ?>
     </td>

     <td style="padding: 10px; vertical-align: top" valign="top">
       <input type="hidden" name="uploadNums[]" value="<?php echo $uploadRecord['num']; ?>" />
       <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td height="23"><?php et('Filename:'); ?> &nbsp;</td>
          <td><?php echo pathinfo($uploadRecord['filePath'], PATHINFO_BASENAME); ?></td>
        </tr>
        <?php foreach (getUploadInfoFields($_REQUEST['fieldName']) as $infoFieldname => $label): ?>
          <tr>
            <td style="vertical-align: middle" valign="middle"><?php echo htmlencode($label); ?></td>
            <td>
              <?php
                $fieldName     = $_REQUEST['fieldName'];          // eg: uploads, photos, etc
                $formFieldName = "{$uploadRecord['num']}_$infoFieldname"; //  eg: 1234_info2 (upload record number, underscore, info field name)
                $fieldHTML     = "<input class='text-input' type='text' name='$formFieldName' value='" .htmlencode($uploadRecord[$infoFieldname]). "' size='55' maxlength='255' />";
                $fieldHTML     = applyFilters('uploadModify_infoFieldHTML', $fieldHTML, $tableName, $fieldName, $infoFieldname, $formFieldName, $uploadRecord);
                echo $fieldHTML;
              ?>
            </td>
          </tr>
        <?php endforeach ?>

       </table>
     </td>
   </tr>
  <?php endforeach ?>

  <!-- not found -->
  <?php if (!$uploadCount): ?>
    <tr>
      <td colspan="2" style="text-align: center; padding: 50px">
        No matching uploads were found!
      </td>
   </tr>
  <?php endif ?>

  </table>

<br/>

  <div style="font-size: 10px; color: #888888; padding: 0px 2px; text-align: center" align="center">

    <div style="float: left;">
      <?php
        if (@$_REQUEST['uploadNums']):
          $uploadRecordsCount = count(getUploadRecords($tableName, $_REQUEST['fieldName'], @$_REQUEST['num'], @$_REQUEST['preSaveTempId']));
          if ($uploadRecordsCount > 1):
            $url = http_build_query(array(
              'action'        => 'uploadModify',
              'menu'          => @$_REQUEST['menu'],
              'fieldName'     => @$_REQUEST['fieldName'],
              'num'           => @$_REQUEST['num'],
              'preSaveTempId' => @$_REQUEST['preSaveTempId'],
            ));
        ?>
          <a href="?<?php echo htmlencode($url); ?>"><?php printf(t("Modify All %s Uploads"), $uploadRecordsCount); ?></a>
        <?php endif; ?>
      <?php endif; ?>
    </div>

    <div style="float: right">
     <input class="button" type="submit" name="_action=uploadModify" value="<?php et('Save') ?>"  />
     <input class="button" type="button" onclick="self.parent.tb_remove()" value="<?php et('Cancel') ?>"  />
    </div>

    <?php printf(t("%s seconds"), showExecuteSeconds()) ?>
  </div>


</div>

</form>

</body>
</html>
