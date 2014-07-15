<?php

//
function getMenuLinks() {
  global $CURRENT_USER, $APP;

  $menuLinks   = '';
  foreach (_getMenuList() as $row) {

    // set defaults
    if (!array_key_exists('menuType', $row))   { $row['menuType'] = ''; }
    if (!array_key_exists('tableName', $row))  { $row['tableName'] = ''; }
    if (!array_key_exists('linkTarget', $row)) { $row['linkTarget'] = ''; }

    // check menu access
    if     (!$CURRENT_USER)                                 { $hasMenuAccess = false; } // don't display menus until user logs in
    elseif (!$row['tableName'] && $CURRENT_USER['isAdmin']) { $hasMenuAccess = true; }  // for admin menus
    else                                                    { $hasMenuAccess = userSectionAccess($row['tableName']) >= 3; } // accessLevel: viewer or better
    if (!$hasMenuAccess) { continue; } // don't display if user doesn't have access

    $rowHtml = '';

    // show menu groups
    if ($row['menuType'] == 'menugroup') {
      $rowHtml .= _openMenuGroupList($row['menuName'], $row['isSelected']);
    }

    // show menu links
    else {
      $rowHtml  .= _openMenuGroupList('', $row['isSelected'], true);
      $class     = ($row['isSelected']) ? 'current ' : '';
      $menuName  = htmlencode($row['menuName']);
      if (@$row['_indent']) {
        $class  .= 'indented_menu';
      }

      $jsEscapedMessage = jsEncode(htmlencode(@$row['linkMessage']));
      $onclick = (@$row['linkMessage']) ? "onclick=\"alert('$jsEscapedMessage');\"" : "";
      $target  = $row['linkTarget'];
      $href    = $row['link'];

      $rowHtml .= "      <li><a class='$class' href='$href' $target $onclick>$menuName</a></li>\n";
    }

    $rowHtml = applyFilters('menulinks_rowHtml', $rowHtml, $row);
    $menuLinks .= $rowHtml;
  }

  //
  $menuLinks .= _closeMenuGroupList();

  //
  return $menuLinks;
}

//
function _openMenuGroupList($menuName, $isSelected, $skipIfAlreadyInGroup = false) {
  global $SHOW_EXPANDED_MENU;
  if ($skipIfAlreadyInGroup && @$GLOBALS['IN_GROUP']) { return; }

  $aClass = 'nav-top-item';
  $liAttr = '';
  $ulAttr = ' style="display: none;"';

  if ($isSelected) {
    $aClass .= ' current';
    $liAttr = ' class="current"';
  }
  if ($isSelected || $SHOW_EXPANDED_MENU || $menuName == '') {
    $ulAttr = '';
  }


  $html  = _closeMenuGroupList();
  $html .= "\n  <li$liAttr>";
  if ($menuName) { $html .= "<a href='javascript:void(0);' class='$aClass'>" . htmlencode($menuName) ."</a>"; }
  $html .= "\n    <ul$ulAttr>\n";

  $GLOBALS['IN_GROUP'] = true;

  return $html;
}

//
function _closeMenuGroupList() {
  if (!@$GLOBALS['IN_GROUP']) { return; }

  return "    </ul>\n  </li>\n";

  $GLOBALS['IN_GROUP'] = false;
}


//
function _getMenuList() {
  global $APP, $CURRENT_USER;
  $menus = array();
  $selectedMenu = getFirstDefinedValue(@$APP['selectedMenu'], @$_REQUEST['menu'], 'home');
  $menuOrder = 0;

  // get schema files
  foreach (getSchemaTables() as $tableName) {
    $schema = loadSchema($tableName);
    if (!@$schema['menuType'])  { continue; }
    if (@$schema['menuHidden']) { continue; }
    $menuOrder = max($menuOrder, @$schema['menuOrder']);

    // add menu items

    $thisMenu = array();
    $thisMenu['schema']       = $schema;
    $thisMenu['menuType']     = $schema['menuType'];
    $thisMenu['menuName']     = $schema['menuName'];
    $thisMenu['menuOrder']    = $schema['menuOrder'];
    $thisMenu['tableName']    = $tableName;
    $thisMenu['isSelected']   = ($selectedMenu == $tableName);
    $thisMenu['_indent']      = @$schema['_indent'];
    $thisMenu['_disableView'] = @$schema['_disableView'];
    $thisMenu['link']         = "?menu=$tableName";
    $thisMenu['linkTarget']   = '';
    $thisMenu['linkMessage']  = '';

    if ($schema['menuType'] == 'link') {
      $isExternalLink = (@$schema['_linkTarget'] != 'iframe');
      $setTargetBlank = $isExternalLink && (@$schema['_targetBlank'] || @$schema['_linkTarget'] == 'new'); // _targetBlank is the old schema format

      if ($isExternalLink) { $thisMenu['link']        = $schema['_url']; }
      if ($setTargetBlank) { $thisMenu['linkTarget']  = 'target="_blank"'; }
      if ($isExternalLink) { $thisMenu['linkMessage'] = @$schema['_linkMessage']; } // don't show js alert() for iframe links (show them at top of iframe page)
    }

    array_push($menus, $thisMenu);
  }

  // add admin menus
  $showAdminAtTop = false;
  if ($showAdminAtTop) { $menuOrder = -100; }
  $menus = array_merge($menus, _getAdminMenus($menuOrder));

  // sort menus by order value
  uasort($menus, '_sortMenusByOrder');

  $menus = array_values($menus); // re-index elements to match sort order (for operation below)

  // allow plugins to customize the menu while it's still an easily managable array
  $menus = applyFilters('menulinks_array', $menus);

  // set isSelected for menuGroups
  $groupChildSelected = false;
  for ($index=count($menus)-1; $index>=0; $index--) {
    $menu = &$menus[$index];

    if ($menu['menuType'] == 'menugroup') {
      if ($groupChildSelected) {
        $menu['isSelected'] = true;
        $groupChildSelected = false;
      }
    }
    else if ($menu['isSelected']) {
      $groupChildSelected = true;
    }

    unset($menu);
  }

  //
  return $menus;
}

// add admin menu header and items
function _getAdminMenus(&$menuOrder) {
  global $CURRENT_USER;
  if (!@$CURRENT_USER['isAdmin']) { return array(); }

  $menu   = @$_REQUEST['menu'];
  $action = getRequestedAction();

  $adminMenus = array();
  $adminMenus[] = array(
    'menuType'   => 'menugroup',
    'menuName'   => t('Admin'),
    'menuOrder'  => ++$menuOrder,
    'tableName'  => '',
    'link'       => '',
    'isSelected' => '',
  );

  $adminMenus[] = array(
    'menuType'   => 'custom',
    'menuName'   => t('General Settings'),
    'menuOrder'  => ++$menuOrder,
    'link'       => '?menu=admin&amp;action=general',
    'isSelected' => ($menu == 'admin' && ($action == 'general' || $action == 'vendor' || $action == 'adminSave')),
  );

  $adminMenus[] = array(
    'menuType'   => 'custom',
    'menuName'   => t('Section Editors'),
    'menuOrder'  => ++$menuOrder,
    'link'       => '?menu=database',
    'isSelected' => ($menu == 'database'),
  );

  $adminMenus[] = array(
    'menuType'   => 'custom',
    'menuName'   => t('Code Generator'),
    'menuOrder'  => ++$menuOrder,
    'link'       => '?menu=_codeGenerator',
    'isSelected' => ($menu == '_codeGenerator'),
  );

  $adminMenus[] = array(
    'menuType'   => 'custom',
    'menuName'   => t('Plugins'),
    'menuOrder'  => ++$menuOrder,
    'link'       => '?menu=admin&amp;action=plugins',
    'isSelected' => ($menu == 'admin' && $action == 'plugins'),
  );

  $adminMenus[] = array(
    'menuType'   => 'custom',
    'menuName'   => t('Email Templates'),
    'menuOrder'  => ++$menuOrder,
    'link'       => '?menu=_email_templates',
    'isSelected' => ($menu == '_email_templates'),
  );

  if (@$GLOBALS['SETTINGS']['advanced']['outgoingMail'] != 'sendOnly') { // only show outgoing mail menu if logging is enabled
    $count     = mysql_count('_outgoing_mail');
    $countText = $count ? " ($count)" : "";
    $adminMenus[] = array(
      'menuType'   => 'custom',
      'menuName'   => t('Outgoing Mail') . $countText, //
      'menuOrder'  => ++$menuOrder,
      'link'       => '?menu=_outgoing_mail',
      'isSelected' => ($menu == '_outgoing_mail'),
    );
  }





  //
  return $adminMenus;
}

?>
