<?php
// define globals
global $APP; //, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX;
$APP['selectedMenu'] = 'admin'; // show admin menu as selected

// check access level - admin only!
if (!$GLOBALS['CURRENT_USER']['isAdmin']) {
  alert(t("You don't have permissions to access this menu."));
  showInterface('');
}

// mailer plugin hooks
addAction('section_preDispatch',     '_cronlog_showModeNotice',  null, 2);

// Prefix Menu with "Admin"
//$GLOBALS['schema']['menuName'] = "Admin &gt; ". $GLOBALS['schema']['menuName'];

// Let regular actionHandler run
$REDIRECT_FOR_CUSTOM_MENUS_DONT_EXIT = true;
return;



//
function _cronlog_showModeNotice($tableName, $action) {
  if ($action != 'list') { return; }

#  elseif ($mode == 'sendAndLog') { $notice = sprintf(t("Send &amp; Log - Send mail and save copies under <a href='%s'>Outgoing Mail</a>"), "?menu=_outgoing_mail"); }
  #$notice = t("Outgoing Mail"). ": " . $notice . " (<a href='?menu=admin&action=general#email'>" .t("settings"). "</a>)";

  $notice = sprintf(t("Background Tasks: This menu lists all log entries, view <a href='%s'>current status and scheduled task list</a>."), "?menu=admin&action=general#background-tasks");


  notice($notice);
}

?>
