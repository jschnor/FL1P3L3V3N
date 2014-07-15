<?php
  global $ALL_PLUGINS;
  $ALL_PLUGINS = getPluginList();
  uasort($ALL_PLUGINS, '_sortPluginsByName');

//
function _sortPluginsByName($arrayA, $arrayB) {
  return strncasecmp($arrayA['name'], $arrayB['name'],100);
}

//
function showPluginList($listType) {
  global $ALL_PLUGINS;

  // get list name
  $listName = '';
  if     ($listType == 'active')   { $listName = 'Active Plugins'; }
  elseif ($listType == 'inactive') { $listName = 'Inactive Plugins'; }
  elseif ($listType == 'system')   { $listName = 'System Plugins'; }
  else { die("Unknown list type '" .htmlencode($listType). "'"); }

  // show plugin list
  ?>
    <table cellspacing="0" class="data" style="overflow: scroll">
     <thead>
      <tr>
       <th width="15%" style="white-space:nowrap;"><?php et($listName) ?></th>
       <th width="8%" style="text-align:center; padding: 0px 10px"><?php et('Version') ?></th>
       <th width="62%"><?php et('Description') ?></th>
       <th width="15%" style="text-align:center"><?php et('Action') ?></th>
      </tr>
     </thead>

      <?php // list plugins
        $pluginCount = 0;
        foreach (array_values($ALL_PLUGINS) as $pluginData) {
          if ($listType == 'system'   && !@$pluginData['isSystemPlugin']) { continue; }
          if ($listType != 'system'   && @$pluginData['isSystemPlugin'])  { continue; }
          if ($listType == 'active'   && !$pluginData['isActive'])        { continue; }
          if ($listType == 'inactive' && $pluginData['isActive'])         { continue; }
          $pluginCount++;

          $bgColorClass = (@$bgColorClass == "listRowOdd") ? 'listRowEven' : 'listRowOdd'; # rotate bgclass
          _showPluginRow($listType, $bgColorClass, $pluginData);
        }
      ?>

      <?php if (!$pluginCount): ?>
        <tr>
          <td colspan="4" style="text-align: center; vertical-align: middle; height: 50px;">
            <?php  ?>

            <?php printf(t("There are currently no %s."), t($listName) ); ?><br/>
          </td>
        </tr>
      <?php endif; ?>
    </table><br/><br/><br/>
  <?php
}

//
function _showPluginRow($pluginType, $bgColorClass, $pluginData) {
  global $APP;

  // error checking
  $allowedTypes = array('active', 'inactive','system');
  if (!in_array($pluginType, $allowedTypes)) { die(__FUNCTION__ . ": Unknown plugin type '". htmlencode($pluginType)."'"); }

  // show row
  $rowClass = $pluginData['isActive'] ? $bgColorClass : "$bgColorClass inactive";
  ?>
         <tr class="listRow <?php echo $rowClass; ?>">
           <td style="padding: 5px"><?php
               if ($pluginData['uri']) { print "<a href='{$pluginData['uri']}'>"; }
               print htmlencode($pluginData['name']);
               if ($pluginData['uri']) { print "</a>"; }
             ?></td>
           <td style="padding: 5px;text-align:center"><?php echo htmlencode($pluginData['version']) ?></td>
           <td style="padding: 5px">
             <?php echo htmlencode($pluginData['description']) ?>
             <?php
               if ($pluginData['author']) {
                 print "<br/>\n" . t('By') . ' ';
                 if ($pluginData['authorUri']) { print "<a href='{$pluginData['authorUri']}'>"; }
                 print htmlencode($pluginData['author']);
                 if ($pluginData['authorUri']) { print "</a>"; }
               }
             ?>
           </td>
           <td style="padding: 5px;text-align:center">
             <?php _showPluginActions($pluginData); ?>
           </td>
         </tr>
  <?php
}

//
function _showPluginActions($pluginData) {
  global $APP;
  $hasRequiredCmsVersion = (@$pluginData['requiresAtLeast'] <= $APP['version']);

  // system plugins
  if ($pluginData['isSystemPlugin']) {
    doAction('plugin_actions', $pluginData['filename']);
    if (!$hasRequiredCmsVersion) { print t('Requires') . "<br />" . $pluginData['requiresAtLeast']; }
  }

  // active plugins
  if ($pluginData['isActive'] && !$pluginData['isSystemPlugin']) {
    $deactivateLink = "?menu=admin&amp;action=deactivatePlugin&amp;file=" . urlencode($pluginData['filename']);
    print "<a href='$deactivateLink'>" .t('Deactivate'). "</a><br/>\n";
    doAction('plugin_actions', $pluginData['filename']);
  }

  // inactive plugins
  if (!$pluginData['isActive'] && !$pluginData['isSystemPlugin']) {
    $activateLink          = "?menu=admin&amp;action=activatePlugin&amp;file=" . urlencode($pluginData['filename']);
    if ($hasRequiredCmsVersion) { print "<a href='$activateLink'>" .t('Activate'). "</a>\n"; }
    else                        { print t('Requires') . "<br />" . $pluginData['requiresAtLeast']; }
  }

}

?>

<form method="post" action="?">
<input type="hidden" name="menu" value="admin" />
<input type="hidden" name="_defaultAction" value="pluginsSave" />


<div class="content-box">

  <div class="content-box-header">
    <h3>
      <?php et('Admin') ?> &gt;
      <a href="?menu=admin&amp;action=plugins"><?php et('Plugins') ?></a>
    </h3>

    <div class="clear"></div>
  </div> <!-- End .content-box-header -->


  <div class="content-box-content">

    <?php showPluginList('active'); ?>

    <?php showPluginList('inactive'); ?>

    <?php showPluginList('system'); ?>

    <div class="notification information png_bg"><div>
      <?php print sprintf(t('Plugin Developers! <a href="%s">Click here</a> for a list of plugin hooks'),"?menu=admin&amp;action=pluginHooks")?>
    </div></div>

    <div class="notification information png_bg"><div>
      <?php print sprintf(t('Need a custom plugin? Contact your vendor at %s'),"<a href=\"{$SETTINGS['vendorUrl']}\">{$SETTINGS['vendorName']}</a>")?>
    </div></div>

  </div>
</div>


</form>
