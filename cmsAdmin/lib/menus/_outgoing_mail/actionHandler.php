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
addAction('record_preedit',          '_ogm_cmsList_customWysiwyg', null, 2);
addFilter('listHeader_displayLabel', '_ogm_cmsList_messageColumn', null, 3);
addFilter('listRow_displayValue',    '_ogm_cmsList_messageColumn', null, 4);
addAction('section_preDispatch',     '_ogm_showModeNotice',  null, 2);

// Prefix Menu with "Admin"
//$GLOBALS['schema']['menuName'] = "Admin &gt; ". $GLOBALS['schema']['menuName'];

// Let regular actionHandler run
$REDIRECT_FOR_CUSTOM_MENUS_DONT_EXIT = true;
return;

//
function _ogm_cmsList_customWysiwyg($tableName, $recordNum) {
  if ($tableName != '_outgoing_mail') { return; } // skip all tables not related to our plugin

  // force wysiwyg to save full links
  $GLOBALS['SETTINGS']['wysiwyg']['includeDomainInLinks'] = 1;
}

//
function _ogm_cmsList_messageColumn($displayValue, $tableName, $fieldname, $record = array()) {
  if ($tableName != '_outgoing_mail')    { return $displayValue; } // skip all by our table
  if ($fieldname != '_message_summary_') { return $displayValue; } // skip all but pseudo-field

  // header - we detect the header hook by checking if the 4th argument is set
  if (!$record) {
    return t("Messages");
  }

  // row cell - we detect the row cell by checking if $record is set
  $output = "
  <table border='0' cellspacing='0' cellpadding='0' class='spacedTable'>
   <tr><td><b>" .t('Date').    "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['createdDate']). "</td></tr>
   <tr><td><b>" .t('From').    "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['from']).        "</td></tr>
   <tr><td><b>" .t('To').      "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['to']).          "</td></tr>
   <tr><td><b>" .t('Subject'). "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['subject']).     "</td></tr>
  </table>
";
  return $output;
}


//
function _ogm_showModeNotice($tableName, $action) {
  if ($action != 'list') { return; }

  $mode   = $GLOBALS['SETTINGS']['advanced']['outgoingMail'];
  $notice = '';
  if     ($mode == 'sendOnly')   { $notice = t("Send Only - Send mail without keeping a copy (default)"); }
  elseif ($mode == 'sendAndLog') { $notice = sprintf(t("Send &amp; Log - Send mail and save copies under <a href='%s'>Outgoing Mail</a>"), "?menu=_outgoing_mail"); }
  elseif ($mode == 'logOnly')    { $notice = t("Log Only - Log messages but don't send them (debug mode)"); }

  $notice = t("Outgoing Mail"). ": " . $notice . " (<a href='?menu=admin&action=general#email'>" .t("settings"). "</a>)";
  notice($notice);
}

?>
