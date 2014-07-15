<?php
  global $SETTINGS;
  require_once "lib/menus/database/listTables_functions.php";
  $tableList = getTableList();
?>

<form method="post" action="?">
<input type="hidden" name="menu" id="menu" value="database" />
<input type="hidden" name="_defaultAction" value='' />

<div class="content-box">

  <div class="content-box-header">
    <h3>
      <?php et('Admin') ?> &gt;
      <a href="?menu=database&amp;action=listTables"><?php echo t('Section Editors'); ?></a>
    </h3>

    <div class="clear"></div>
  </div> <!-- End .content-box-header -->

  <div class="content-box-content">

    <table cellspacing="0" class="data sortable">
     <thead>
      <tr class="nodrag nodrop">
      <th width="6%" style="text-align:center"><?php et('Drag') ?></th>
      <th width="27%"><?php et('Menu Name') ?></th>
      <th width="18%"><?php et('Menu Type') ?></th>
      <th width="27%"><?php et('MySQL Table') ?></th>
      <th width="22%" style="text-align:center" colspan="2"><?php et('Action') ?></th>
     </tr>
     </thead>

    <?php
      $menuCount = 0;
      foreach ($tableList as $row):
          if (@$row['tableHidden']) { continue; };
          $bgColorClass = (@$bgColorClass == "listRowOdd") ? 'listRowEven' : 'listRowOdd'; # rotate bgclass
          $styleAttr    = $row['menuHidden'] ? 'color: #BBB;' : '';
          $menuCount++;

          $leftPadding = 3;
          if ($row['menuType'] != 'menugroup') { $leftPadding += 9; }
          if (@$row['_indent'])                { $leftPadding += 9; }
          // id="table_<?php echo ()

          //
          $nameColStyle = "padding-left: {$leftPadding}px; ";
          if ($row['menuType'] == 'menugroup') { $nameColStyle .= "font-weight: bold; padding: 10px 5px 10px 0px"; }

    ?>
      <tr class="listRow <?php echo $bgColorClass; ?>" style="<?php echo $styleAttr ?>">
        <td width="40" style="text-align: center; vertical-align: middle" class="dragger">
         <input type='hidden' name='_tableName' value='<?php echo $row['tableName'] ?>' class='_tableName' />
         <img src="lib/images/drag.gif" height="6" width="19" class='dragger' title='<?php et('Click and drag to change order.') ?>' alt="" /><br/>
        </td>

        <td width="27%" style="<?php echo $nameColStyle ?>">
          <?php echo htmlencode($row['menuName']); ?>
          <div style="float: right; padding-right: 5px;"><?php if ($row['menuHidden']) { print ' (' .t('hidden'). ')'; } ?></div>
        </td>
        <td width="18%">
          <?php echo htmlencode($row['menuType']) ?>
        </td>
        <td width="27%">
          <?php echo htmlencode($row['tableName']) . " ({$row['recordCount']})" ?>
        </td>

        <td width="11%" style="text-align:center"><a href="?menu=database&amp;action=editTable&amp;tableName=<?php echo urlencode($row['tableName']) ?>"><?php et('modify') ?></a></td>

        <?php if ($row['tableName'] == 'accounts'): ?>
          <td width="11%" style="text-align:center; color: #666"><?php echo t('erase'); ?></td>
        <?php else: ?>
          <td width="11%" style="text-align:center"><a href="javascript:confirmEraseTable('<?php echo urlencode($row['tableName']) ?>')"><?php et('erase') ?></a></td>
        <?php endif ?>

       </tr>

    <?php endforeach ?>
    </table>


    <?php if ($menuCount == 0): ?>
      <table border="0" cellspacing="0" cellpadding="0" style="margin-right: 1px">
       <tr>
        <td class="listRowNotfound"><?php echo t('There are no menus.  Try adding one below.'); ?></td>
       </tr>
      </table>
    <?php endif ?>


    <div class="divider_line"></div>


    <div style="float:right">
      <input class="button" type="button" name="null" value="<?php echo t('Add New Editor'); ?>..." onclick="addNewMenu()" /><br/>
    </div>
    <div class="clear"></div>

  </div>
</div>

<script type="text/javascript" src="3rdParty/jqueryPlugins/thickbox.js"></script>
<script type="text/javascript" src="lib/menus/database/listTables_functions.js"></script>

</form>
