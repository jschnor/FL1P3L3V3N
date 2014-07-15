<?php

  $hookTypes = array(
    'filter' => array( 'callerRegex' => "|applyFilters\(\s*(['\"])(.*?)\\1|", 'pluginRegex' => "|addFilter\(\s*(['\"])(.*?)\\1|" ),
    'action' => array( 'callerRegex' =>     "|doAction\(\s*(['\"])(.*?)\\1|", 'pluginRegex' => "|addAction\(\s*(['\"])(.*?)\\1|" ),
  );

  $ignoreRegexs = array(
    '|^\./data/|',
    '|^\./3rdParty/|',
    '|^\./sampleCode/|',
  );

  $hooks = array();
  $phpFiles = scandir_recursive('.', '/\.php$/');
  foreach ($phpFiles as $phpFile) {

    // ignoreRegexps
    $ignore = false;
    foreach ($ignoreRegexs as $ignoreRegex) {
      if (preg_match($ignoreRegex, $phpFile)) { $ignore = true; }
    }
    if ($ignore) { continue; }

    $phpFileNiceName = preg_replace('|^\./|', '', $phpFile);

    $content = file_get_contents($phpFile);

    foreach ($hookTypes as $hookType => $hookInfo) {
      if (preg_match_all($hookInfo['callerRegex'], $content, $matches)) {
        foreach ($matches[2] as $name) {
          if (!@$hooks[$name]) { $hooks[$name] = array('type' => $hookType, 'callers' => array(), 'plugins' => array()); }
          $hooks[$name]['callers'][$phpFileNiceName] = true;
        }
      }
      if (preg_match_all($hookInfo['pluginRegex'], $content, $matches)) {
        foreach ($matches[2] as $name) {
          if (!@$hooks[$name]) { $hooks[$name] = array('type' => $hookType, 'callers' => array(), 'plugins' => array()); }
          $hooks[$name]['plugins'][$phpFileNiceName] = true;
        }
      }
    }
  }

  $phpFiles = scandir_recursive('.', '/\.php$/');
  foreach ($phpFiles as $phpFile) {
    $phpFileNiceName = preg_replace('|^\./|', '', $phpFile);

    $content = file_get_contents($phpFile);

    foreach ($hookTypes as $hookType => $hookInfo) {
      if (preg_match_all($hookInfo['pluginRegex'], $content, $matches)) {
        foreach ($matches[2] as $name) {
          if (!@$hooks[$name]) { $hooks[$name] = array('type' => $hookType, 'callers' => array(), 'plugins' => array()); }
          $hooks[$name]['plugins'][$phpFileNiceName] = true;
        }
      }
    }
  }

  ksort($hooks);

  function _sortUnderscoresLast($a, $b) {
    $a = preg_replace('|^_|', 'ZZZZZ', $a);
    $b = preg_replace('|^_|', 'ZZZZZ', $b);
    return strcasecmp($a, $b);
  }
  function showListResultsForHookKey($hookInfo, $key) {
    uksort($hookInfo[$key], '_sortUnderscoresLast');
    $i = 0;
    foreach (array_keys($hookInfo[$key]) as $callerName) {
      $i++;
      if ($i == 2) {
        echo "\n<a href=\"#\" onclick=\"$(this).hide(); $(this).closest('td').find('div').show(); return false;\">("
        . count(array_keys(array_keys($hookInfo[$key])))
        . " " . t('total') . ")</a><div style=\"display: none;\">\n";
      }
      echo htmlencode($callerName);
      if ($i != 1) { echo "<br/>\n"; }
    }
    if ($i > 1) { echo "</div>\n"; }
  }

?>

<div class="clear"></div>

<div class="content-box">
  <form method="post" action="?">

  <div class="content-box-header">
    <?php echo '<h3>' . t('Admin') .' &gt; <a href="?menu=admin&amp;action=plugins">' .t('Plugins'). '</a> &gt; '. t("Developer's Plugin Hook List") .'</h3>'; ?>
    <div style="float:right;">
      <input class="button" type="button" name="null" value="<?php eht("Back to Plugins >>"); ?>" onclick="window.location='?menu=admin&amp;action=plugins'"/>
    </div>
    <div class="clear"></div>
  </div> <!-- End .content-box-header -->

  <div class="content-box-content">

    <div class="notification information png_bg"><div>
      <?php print sprintf(t("This page lists where Plugin Hooks are called and used. To learn more about a hook, open a file where it's called and search for the Hook Name."))?>
    </div></div>

    <table cellspacing="0" class="data">
      <thead>
        <tr style="text-align: left;">
          <th>
            <?php et("Hook Name") ?>
          </th>
          <th>
            <?php et("Type") ?>
          </th>
          <th>
            <?php et("Where it's called...") ?>
          </th>
          <th>
            <?php et("Where it's used...") ?>
          </th>
        </tr>
      </thead>
      <?php $counter = 0; ?>
      <?php foreach ($hooks as $hookName => $hookInfo): ?>
        <tr class="listRow listRow<?php echo (++$counter) % 2 ? 'Odd' : 'Even' ?>">
          <td>
            <?php echo "$counter. " . htmlencode($hookName); ?>
          </td>
          <td>
            <?php echo htmlencode($hookInfo['type']); ?>
          </td>
          <td>
            <?php showListResultsForHookKey($hookInfo, 'callers'); ?>
          </td>
          <td>
            <?php showListResultsForHookKey($hookInfo, 'plugins'); ?>
          </td>
        </tr>
      <?php endforeach ?>
    </table>


  </div><!-- End .content-box-content -->
  </form>
</div><!-- End .content-box -->
