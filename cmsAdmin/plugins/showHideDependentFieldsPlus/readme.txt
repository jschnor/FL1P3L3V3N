----------------------------------------
INSTALLING/UPGRADING:
----------------------------------------

  Install: Extract files into /cmsAdmin/plugins/ folder.
           Rename config.example.php to config.php
		   Add your settings to config.php (instructions below)

  Upgrade: Back up your config.php file.  
           Extract files into /cmsAdmin/plugins/ folder.  
           If changelog specifies changes to the config file, update yours with the new settings.


----------------------------------------
GENERAL:
----------------------------------------

  The only file you need to edit is the config.php file.  This is where you set up your table of rules.
  Use any field that fires a change event (text, textarea, select, checkbox, radio, wysiwyg)
  Changes cascade, so if a field is hidden/shown and it has rules, those elements are hidden/shown too. 


----------------------------------------
SEPARATOR SUPPORT:
----------------------------------------

  You can add support for hiding separators with a small modification to the cmsBuilder source code.
  In the file cmsAdmin/lib/fieldTypes/separator.php, find the tr tags on or near lines 14 and 21.
  The original code is:
    $html .= "    <tr>\n";
  You need to change that to:
    $html .= "    <tr id=\"".$this->name."\" rel=\"separator\">\n";


----------------------------------------
SETTING UP THE SHOW/HIDE RULES
----------------------------------------

  Define your rule sets in the config.php file inside the $fields array.  It looks like this:
  
  $fields = array(
    // enter your rule sets here //
  );
  
  A rule set is defined like this:
  
    'sectionName' => array(                                 // the name of the section to which this rule set applies
      'eventFieldName' => array(                          // the name of the field that changes
        '_none_'       => array(),                      // show these fields when nothing is selected
        '_any_value_'  => array('field_1'),             // show these fields when a value not listed below is selected
        'value_1'      => array('field_2'),             // show these fields when the value of eventFieldName is value_1
        'value_2'      => array('field_3', 'field_4'),  // show these fields when the value of eventFieldName is value_2
        [etc,]                                          // more values and fields
      ),
    ),

  Below is an example rule set:
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
    'pages' => array(
      'content_type' => array(
        '_none_'       => array(),
        '_any_value_'  => array(),
        'page'  => array('page_header_type','__separator003__','content','__separator004__'),
        'alias'  => array('alias_page','__separator004__'),
        'link'  => array('link_url','__separator004__'),
        'separator'  => array(),
      ),
      
      'page_header_type' => array(
        '_none_'       => array(),
        '_any_value_'  => array(),
        'custom'       => array('page_header_custom'),
      ),
      
      '__separator004__' => array(
        '_none_'       => array(),
        '_any_value_'  => array('menu_text_type','hideLinkOtherMenu','hideLinkMainMenu'),
      ),
      
    ),
    
    This rule set is applied when a user loads the "pages" section.
    
    When the user changes the "content_type" element:
      if new value is "page":
        show: 'page_header_type','__separator003__','content','__separator004__'
        hide: 'alias_page','link_url'
      if new value is "alias":
        show: 'alias_page','__separator004__'
        hide: 'page_header_type','__separator003__','content','link_url'
      if new value is "link":
        show: 'link_url','__separator004__'
        hide: 'page_header_type','__separator003__','content','alias_page'
      if new value is "separator":
        show: nothing
        hide: 'page_header_type','__separator003__','content','__separator004__','alias_page','link_url'
      if new value is "":
        show: nothing
        hide: 'page_header_type','__separator003__','content','__separator004__','alias_page','link_url'
      if new value is "other":
        show: nothing
        hide: 'page_header_type','__separator003__','content','__separator004__','alias_page','link_url'
        
    When the user changes the "page_header_type" element:
      if new value is "custom", show the "page_header_custom" field
      otherwise, hide the "page_header_custom" field
      
    When the user changes the "content_type" element, if "__separator004__" is shown or hidden, the change will
    cascade to the "__separator004__" rule set.  This rule set says:
      if "__separator004__" is visible, also show 'menu_text_type','hideLinkOtherMenu','hideLinkMainMenu'
      if "__separator004__" is hidden,  also HIDE 'menu_text_type','hideLinkOtherMenu','hideLinkMainMenu'



----------------------------------------
EDITING THE SOURCE CODE:
----------------------------------------

  The code is open-source, but please give credit to the original authors.
  By default the script loads the minified version of the javascript.
  You can instead load the source javascript by setting the $devmode flag to true inside the config.php file.

