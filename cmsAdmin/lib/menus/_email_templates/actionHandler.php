<?php
// define globals
global $APP; //, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX;
$APP['selectedMenu'] = 'admin'; // show admin menu as selected

// check access level - admin only!
if (!$GLOBALS['CURRENT_USER']['isAdmin']) {
  alert(t("You don't have permissions to access this menu."));
  showInterface('');
}

// list-page display plugin hooks
addAction('record_preedit',          '_emt_cmsList_customWysiwyg', null, 2);
addFilter('listHeader_displayLabel', '_emt_cmsList_messageColumn', null, 3);
addFilter('listRow_displayValue',    '_emt_cmsList_messageColumn', null, 4);

// add default templates
emailTemplate_addDefaults();

### Advanced Command: Developers: Export Templates As PHP
addFilter('list_advancedCommands', 'emailTemplatesMenu_addAdvancedOption', null, 1);
function emailTemplatesMenu_addAdvancedOption($labelsToValues) {
  $labelsToValues[t('Developers: Export Templates As PHP')] = 'emailTemplatesMenu_exportTemplatesPHP';
  $labelsToValues[t('Developers: Show sendMessage() PHP')] = 'emailTemplatesMenu_showSendMessagePHP';
  return $labelsToValues;
}
if (@$_REQUEST['_advancedAction'] == 'emailTemplatesMenu_exportTemplatesPHP') { emailTemplatesMenu_exportTemplatesPHP(); }
if (@$_REQUEST['_advancedAction'] == 'emailTemplatesMenu_showSendMessagePHP') { emailTemplatesMenu_showSendMessagePHP(); }


// Let regular actionHandler run
$REDIRECT_FOR_CUSTOM_MENUS_DONT_EXIT = true;
return;

//
function _emt_cmsList_customWysiwyg($tableName, $recordNum) {
  if ($tableName != '_email_templates') { return; } // skip all tables not related to our plugin
  
  // force wysiwyg to save full links
  $GLOBALS['SETTINGS']['wysiwyg']['includeDomainInLinks'] = 1;
}

//
function _emt_cmsList_messageColumn($displayValue, $tableName, $fieldname, $record = array()) {
  if ($tableName != '_email_templates')    { return $displayValue; } // skip all by our table


  //
  if ($fieldname == '_template_summary_') {
    if (!$record) { return t("Template"); } // header - we detect the header hook by checking if the 4th argument is set
    // row cell - we detect the row cell by checking if $record is set
    $displayValue = "
      <table border='0' cellspacing='0' cellpadding='0' class='spacedTable'>
       <tr><td><b>" .str_replace(' ', '&nbsp;', t('Template ID')). "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['template_id']). "</td></tr>
       <tr><td><b>" .t('Description').    "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['description']). "</td></tr>
      </table>
    ";
  }

  //
  if ($fieldname == '_message_summary_') {
    if (!$record) { return t("Content"); } // header - we detect the header hook by checking if the 4th argument is set
    // row cell - we detect the row cell by checking if $record is set
    $displayValue = "
      <table border='0' cellspacing='0' cellpadding='0' class='spacedTable'>
       <tr><td><b>" .t('From').    "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['from']).        "</td></tr>
       <tr><td><b>" .t('To').      "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['to']).          "</td></tr>
       <tr><td><b>" .t('Subject'). "</b></td><td>&nbsp:&nbsp;</td><td>" .htmlencode($record['subject']).     "</td></tr>
      </table>
    ";
  }


  return $displayValue;
}


//
function emailTemplatesMenu_exportTemplatesPHP() {

  // print header
  header("Content-type: text/plain");
  print "  ### NOTE: Make sure file is saved as UTF-8 or chars with accents may not get saved to MySQL on insert\n ";

  // get templates
  $records = mysql_select('_email_templates', "1 ORDER BY `template_id`");
  foreach ($records as $record) {

    // get placeholder array
    $placeholderArrayValues = '';
    list($nonSystemPlaceholders) = explode("\n\n", $record['placeholders']);
    if (preg_match_all("/#([\w\.]+)#/", $nonSystemPlaceholders, $matches)) {
      $placeholderArrayValues = "'" .implode("','", $matches[1]). "'";
    }

    // get code
    print <<<__PHP__

  // {$record['template_id']}
  emailTemplate_addToDB(array(
    'template_id'  => "{$record['template_id']}",
    'description'  => "{$record['description']}",
    'placeholders' => array($placeholderArrayValues), // array of placeholder names
    'from'         => "{$record['from']}",
    'to'           => "{$record['to']}",
    'subject'      => "{$record['subject']}",
    'html'         => <<<__HTML__
{$record['html']}
__HTML__
  ));


__PHP__;
  }
  exit;
}


//
function emailTemplatesMenu_showSendMessagePHP() {

  // print header
  header("Content-type: text/plain");
  print "  ### NOTE: Make sure file is saved as UTF-8 or chars with accents may not get saved to MySQL on insert\n\n\n";

  // get templates
  $records = mysql_select('_email_templates', "1 ORDER BY `template_id`");
  foreach ($records as $record) {

    // get placeholder array
    $placeholderArrayValues = '';
    list($nonSystemPlaceholders) = explode("\n\n", $record['placeholders']);
    if (preg_match_all("/#([\w\.]+)#/", $nonSystemPlaceholders, $matches)) {
      foreach ($matches[1] as $placeholderName) {

      $placeholderArrayValues .= sprintf("\n      %-18s", "'$placeholderName'"). " => \"enter value\",";
      }
    }
      $placeholderArrayValues .= sprintf("\n    //%-18s", "'your_placeholder'"). " => \"your value\", // add new placeholders here";

    // get code
    print <<<__PHP__
  // {$record['template_id']}
  \$emailHeaders = emailTemplate_loadFromDB(array(
    'template_id'  => '{$record['template_id']}',
    'placeholders' => array($placeholderArrayValues
    ),
  ));
  \$mailErrors = sendMessage(\$emailHeaders);
  if (\$mailErrors) { die("Mail Error: \$mailErrors"); }




__PHP__;
  }
  exit;
}

?>
