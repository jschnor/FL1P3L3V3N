<?php

class WysiwygField extends Field {

function __construct($fieldSchema) {
  parent::__construct($fieldSchema);
}

//
function getDisplayValue($record) { // override me in derived classes
  return $this->getDatabaseValue($record);
}

//
function getTableRow($record, $value, $formType) { // $formType is edit or view
  if (!$record) { die(basename(__FILE__).':'.__FUNCTION__ . ": record not defined!"); }

  //
  if ($formType == 'view') {
    $fieldHeight = @$this->fieldHeight ? $this->fieldHeight : 100;
    $value = "<div style='height:{$fieldHeight}px; border: 1px solid #CCC; padding: 0px 5px;  overflow:auto'>$value</div>\n";
  }

  //
  $html = parent::getTableRow($record, $value, $formType);
  return $html;
}

// editFormHtml
function editFormHtml($record) {
  // set field attributes
  $description = getEvalOutput( @$this->description );
  $fieldHeight = @$this->fieldHeight ? $this->fieldHeight : 100;
  $fieldPrefix = @$this->fieldPrefix;
  if ($fieldPrefix != '') { $fieldPrefix .= "<br/>\n"; }

  // get field value
  if      ($record)                                  { $fieldValue = @$record[ $this->name ]; }
  else if (array_key_exists($this->name, $_REQUEST)) { $fieldValue = @$_REQUEST[ $this->name ]; }
  else                                               { $fieldValue = getEvalOutput(@$this->defaultContent); }
  $encodedValue  = htmlencode($fieldValue);

  // display field
  print <<<__HTML__
 <tr>
  <td style="vertical-align: top">{$this->label}</td>
  <td>
    $fieldPrefix
    <textarea name="{$this->name}" id="field_{$this->name}" rows="5" cols="40" style="width: 100%; height: {$fieldHeight}px; visibility: hidden;">$encodedValue</textarea>
    $description
  </td>
 </tr>
__HTML__;
}

} // end of class

?>
