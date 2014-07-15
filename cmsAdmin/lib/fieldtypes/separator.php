<?php

class SeparatorField extends Field {

function __construct($fieldSchema) {
  parent::__construct($fieldSchema);
}

//
function getTableRow($record, $value, $formType) {
  $html = '';
  if      ($this->separatorType == 'blank line') {
    $html .= "    <tr id=\"".$this->name."\" rel=\"separator\">\n";
    $html .= "     <td>&nbsp;</td>\n";
    $html .= "     <td>&nbsp;</td>\n";
    $html .= "    </tr>\n";
  }

  else if ($this->separatorType == 'header bar') {
    $html .= "    <tr id=\"".$this->name."\" rel=\"separator\">\n";
    $html .= "      <td colspan='2' >\n";
    $html .= "        <div class='content-box content-box-divider'>\n";
    $html .= "          <div class='content-box-header'><h3>{$this->separatorHeader}</h3></div>\n";
    $html .= "        </div>\n";
    $html .= "      </td>\n";
    $html .= "     </tr>\n";
  }

  else if ($this->separatorType == 'html') {
     $html .= getEvalOutput( $this->separatorHTML );
  }

  else {
    die("Unknown separator type '{$this->separatorType}'!");
  }

  //
  return $html;
}

} // end of class

?>
