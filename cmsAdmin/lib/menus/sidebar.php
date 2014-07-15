<?php
  global $APP, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX, $SHOW_EXPANDED_MENU;
  $menuLinks = getMenuLinks();
?>

<div id="sidebar"><div id="sidebar-wrapper"> <!-- Sidebar with logo and menu -->

  <?php if (@$SETTINGS['headerImageUrl']): ?>
    <h1 id="sidebar-title">
      <a href="?menu=home"><img src="<?php echo getEvalOutput($SETTINGS['headerImageUrl']) ?>" alt="" /></a>
    </h1>
  <?php else: // Logo (221px wide) ?>
    <h1 id="sidebar-title">
      <a href="?menu=home"><?php echo htmlencode($SETTINGS['programName']); ?></a>
    </h1>
  <?php endif ?>

  <!-- Sidebar Profile links -->

  <div id="profile-links">
  <?php
    // My Account | Logoff(username)
    $headerLinks = '';
    if ($CURRENT_USER)  { $headerLinks .= "<a href='?menu=_myaccount'>" .t('My Account'). "</a>"; }
    if ($CURRENT_USER)  { $headerLinks .= " | <a href='?action=logoff'>" .sprintf(t("Logoff (%s)"), htmlencode($CURRENT_USER['username'])). "</a>"; }

    // Help | License | View Website >>
    if ($headerLinks) { $headerLinks .= "<br/>\n"; }
    if ($SETTINGS['helpUrl'])    { $headerLinks .= "<a href='" .getEvalOutput( $SETTINGS['helpUrl'] ). "' target='_blank'>" .t('Help'). "</a> | "; }
                                   $headerLinks .= "<a href='?menu=license'>" .t('License'). "</a> | ";
    if ($SETTINGS['websiteUrl']) { $headerLinks .= "<a href='" .getEvalOutput( $SETTINGS['websiteUrl'] ). "' target='_blank' class='mLink'>" . t('View Website &gt;&gt;'). "</a><br/>"; }

    //
    echo applyFilters('header_links', $headerLinks);
  ?>
  </div>


  <?php if ($CURRENT_USER): ?>
<ul id="main-nav">
      <?php echo $menuLinks ?>
</ul>
  <?php endif ?>


  <?php if ($SHOW_EXPANDED_MENU): ?>
    <div id="jquery_showExpandedMenu" style="display: none"></div>
  <?php endif ?>

</div></div> <!-- End #sidebar -->
