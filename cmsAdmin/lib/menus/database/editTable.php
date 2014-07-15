<?php
  require_once "lib/menus/database/editTable_functions.php";
  $tableDetails = getTableDetails();

  $errors = getTableDetailErrors($schema);
  if ($errors) { alert($errors); }

  showHeader();
?>

<form method="post" action="?">
<input type="submit" style="width: 0px; height: 0px; position: absolute; border: none; padding: 0px" /> <!-- bugfix: hitting enter in textfield submits first submit button on form -->
<input type="hidden" name="menu" value="database" />
<input type="hidden" name="_defaultAction" value="editTable" />
<input type="hidden" name="tableName" id="tableName" value="<?php echo htmlencode(getTableNameWithPrefix($_REQUEST['tableName'])) ?>" />
<input type="hidden" name="menuOrder" value="<?php echo htmlencode(@$schema['menuOrder']) ?>" />

<div class="content-box list-tables">

  <div class="content-box-header">
    <h3>
      <?php et('Admin') ?> &gt;
      <a href="?menu=database&amp;action=listTables"><?php echo t('Section Editors'); ?></a> &gt;
      <a href="?menu=database&amp;action=editTable&amp;tableName=<?php echo htmlencode(getTableNameWithoutPrefix($_REQUEST['tableName'])) ?>"><?php echo htmlencode(@$schema['menuName']) ?></a>
    </h3>
    <div class="clear"></div>
  </div> <!-- End .content-box-header -->

  <div class="content-box-content">

    <div style="float: left; padding: 1px; margin-left: 15px"></div>
    <div class="tab tabOn" id="generalTab"><?php et('General'); ?></div>
<?php if (@$schema['menuType'] != 'link' && @$schema['menuType'] != 'menugroup'): ?>
      <div class="tab" id="viewerTab"><?php echo t('Viewer Urls'); ?></div>
  <?php if (@$schema['menuType'] != 'single'): ?>
      <div class="tab" id="searchTab"><?php echo t('Searching'); ?></div>
      <div class="tab" id="sortingTab"><?php echo t('Sorting'); ?></div>
      <div class="tab" id="advancedTab"><?php echo t('Advanced'); ?></div>
  <?php endif; ?>
<?php endif; ?>
<br/>

  <div style="border: solid 1px #999; padding: 10px; margin: 0px 2px; clear: both" id="container">
   <table border="0" cellspacing="0" cellpadding="1" class="options" id="generalTabOptions" style="display: inherit; float: left; width: 100%;">
     <tr>
      <td class="labelColumn"><?php et('Section Name') ?></td>
      <td>
        <input class="text-input medium-input" type="text" name="menuName" value="<?php echo htmlencode(@$schema['menuName']) ?>" style="width: 200px" />

        <?php if (@$schema['menuType'] != 'menugroup'): ?>
          <input type="hidden"   name="_indent" value="0" />
          <input type="checkbox" name="_indent" id="indent" value="1" <?php checkedIf(@$schema['_indent'], '1') ?> />
          <label for="indent"><?php echo t('Indent on menubar'); ?></label>
        <?php endif ?>

       </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Table Name'); ?></td>
      <td>
        <?php echo $SETTINGS['mysql']['tablePrefix']; ?>
        <input class="text-input medium-input setAttr-spellcheck-false" type="text" name="newTableName" value="<?php echo htmlencode(getTableNameWithoutPrefix($_REQUEST['tableName'])) ?>" style="width: 150px;" />
        <!-- (<?php echo $tableDetails['rowCount'] ?> records) <br/> -->
        <?php echo t('Database table name used by PHP and MySQL'); ?>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Section Type'); ?></td>
      <td>
        <input type="hidden" name="menuType" value="<?php echo htmlencode(@$schema['menuType']); ?>" />
        <?php if     (@$schema['menuType'] == ''):         ?> <?php echo t('None'); ?>
        <?php elseif (@$schema['menuType'] == 'single'):   ?> <?php echo t('Single Record'); ?>
        <?php elseif (@$schema['menuType'] == 'multi'):    ?> <?php echo t('Multi Record'); ?>
        <?php elseif (@$schema['menuType'] == 'category'): ?> <?php echo t('Category Menu'); ?>
        <?php else:                                        ?> <?php echo @$schema['menuType']; ?>
        <?php endif ?>
      </td>
     </tr>

<?php if (@$schema['menuType'] != 'single' && @$schema['menuType'] != 'link' && @$schema['menuType'] != 'menugroup'): ?>
     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px"><br/><?php echo t('ListPage Fields'); ?></td>
      <td><br/>
        <?php echo sprintf(t('These fields are displayed on the <a href="?menu=%s">editor list page</a> (beside modify and erase)<br/>
        <input class="text-input wide-input setAttr-spellcheck-false" type="text" name="listPageFields" value="%s" size="75" style="width: 300px;" /><br/>
        example: field1, field2'),urlencode(getTableNameWithoutPrefix($_REQUEST['tableName'])), htmlencode(@$schema['listPageFields'])); ?>
      </td>
     </tr>
<?php endif; ?>


<?php if (@$schema['menuType'] == 'link'): ?>
     <tr><td colspan="2">&nbsp;</td></tr>
     <tr>
      <td class="labelColumn"><?php echo t('Link Url'); ?></td>
      <td>
        <input class="text-input medium-input setAttr-spellcheck-false" type="text" name="_url" value="<?php echo htmlencode(@$schema['_url']) ?>" size="75" style="width: 300px" />
        example: http://www.example.com/
      </td>
     </tr>
     <tr>
      <td class="labelColumn"></td>
      <td>
        <?php
          if (!@$schema['_linkTarget'] && @$schema['_targetBlank']) { $schema['_linkTarget'] = 'new'; } // set default for old schemas using _targetBlank options
          $valuesToLabels = array(
            ''           => t('same window'),
            'new'        => t('new window or tab'),
            //'lightbox' => "lightbox popup",
            'iframe'     => t('inline iframe'),
          );
          $htmlOptions = getSelectOptions(@$schema['_linkTarget'], array_keys($valuesToLabels), array_values($valuesToLabels));
        ?>

        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><?php echo t('Open link in'); ?> &nbsp;</td>
            <td>
              <select name="_linkTarget"><?php echo $htmlOptions ?></select>
              &nbsp;
              <span id="iframeHeightSpan" style="display: none">
              <?php echo t('Iframe Height'); ?>: <input class="text-input" type="text" name="_iframeHeight" value="<?php echo htmlencode(@$schema['_iframeHeight']) ?>" size="4" />px
              </span>

            </td>
          </tr>
          <tr>
            <td><?php echo t('Display Message'); ?> &nbsp;</td>
            <td><input class="text-input medium-input" type="text" name="_linkMessage" value="<?php echo htmlencode(@$schema['_linkMessage']) ?>"  size="75" style="width: 400px !important" /></td>
          </tr>
        </table>


      </td>
     </tr>
<?php endif; ?>
   </table>

   <table border="0" cellspacing="0" cellpadding="1" class="options" id="viewerTabOptions" style="display: none; width: 100%;">
     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px">&nbsp;</td>
      <td>
        <?php echo t('These urls are used when creating links to viewers for this section.'); ?>
        <?php echo t('Update the urls and filenames to match the viewers you create.'); ?><br/>
      </td>
     </tr>

  <?php if (@$schema['menuType'] != 'single'): ?>
     <tr>
      <td class="labelColumn"><?php echo t('List Page Url'); ?></td>
      <td>
        <?php echo htmlencode(PREFIX_URL) ?><input class="text-input medium-input setAttr-spellcheck-false" type="text" name="_listPage" value="<?php echo htmlencode(@$schema['_listPage']) ?>" size="75" style="width: 300px" />
        <?php echo t('example: /news/newsList.php'); ?>
      </td>
     </tr>
  <?php endif; ?>
     <tr>
      <td class="labelColumn"><?php echo t('Detail Page Url'); ?></td>
      <td>
        <?php echo htmlencode(PREFIX_URL) ?><input class="text-input medium-input setAttr-spellcheck-false" type="text" name="_detailPage" value="<?php echo htmlencode(@$schema['_detailPage']) ?>" size="75" style="width: 300px" />
        <?php echo t('example: /news/newsDetail.php'); ?>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Preview Page Url'); ?></td>
      <td>
        <?php echo htmlencode(PREFIX_URL) ?><input class="text-input medium-input setAttr-spellcheck-false" type="text" name="_previewPage" value="<?php echo htmlencode(@$schema['_previewPage']) ?>" size="75" style="width: 300px" />
        <?php echo t('leave blank to use Detail Page Url'); ?>
      </td>
     </tr>

     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px">&nbsp;</td>
      <td>
        <?php echo t("<b>Tip:</b> Use a <a href='?menu=admin&action=general#websitePrefixUrl'>Website Prefix Url</a> for development servers with temporary urls such as /~username/ or /client-name/."); ?><br/>
      </td>
     </tr>
<?php if (@$schema['menuType'] != 'single'): ?>
     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px"><br/><?php et("Filename Fields"); ?></td>
      <td><br/>
        <input class="text-input medium-input setAttr-spellcheck-false" type="text" name="_filenameFields" value="<?php echo htmlencode(@$schema['_filenameFields']) ?>" size="75" style="width: 300px" />
<?php
  $content = <<<__HTML__
example: field1, field2<br/>
These fields are added to viewer links to create more descriptive urls for users<br/>
and search engines. The first field value that isn't blank is used.<br/>
Example Url: viewer.php?record_title_goes_here-123<br/>
__HTML__;
  print t($content);
?>

      </td>
     </tr>
<?php endif; ?>
   </table>

   <table border="0" cellspacing="0" cellpadding="1" class="options" id="searchTabOptions" style="display: none; width: 100%;">

     <tr>
      <td class="labelColumn" valign="top"><?php echo t('Search Fields'); ?></td>
      <td>
        <textarea name="listPageSearchFields" class="setAttr-spellcheck-false" style="width: 100%;" rows="4" cols="50" onfocus="this.rows=10" onblur="this.rows=4"><?php echo htmlencode(@$schema['listPageSearchFields']) ?></textarea><br/>
      </td>
     </tr>
     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px">&nbsp;</td>
      <td>

<?php
  $content = <<<__HTML__
<p>This section lets you control what search options are available on the <a href="?menu=every_field_multi">editor list page</a>.</p>

<dl>
   <dt><b>Disabling Search</b></dt>
   <dd>If you don't want any search options displayed just leave the box above blank.<br/><br/></dd>

   <dt><b>Simple Search</b></dt>
   <dd>For basic search functionality enter a list of comma separated fieldnames on the first line only.          The editor list will display a single keyword search field that allows your users to search on those          fields. Example: <i>title, content</i><br/><br/>
   </dd>

   <dt><b>Advanced Search</b></dt>
   <dd>For each search field you want to appear enter the following: Label|FieldList|searchType<br/><br/>

   <b>label</b> - This is displayed before the search field, such as: Category, Hidden, etc<br/>
   <b>fieldlist</b> - This is the fieldname or fieldnames (comma separated) to be searched.  If there are multiple fieldnames a text field will be displayed.  If there is only one fieldname and it is a list or checkbox field a dropdown list of options will be displayed (Add [] after list fieldnames to allow users to search by multiple values as once). (Tip: enter _all_ for all fields).<br/>
   <b>searchType</b> - This can be one of: match, keyword, prefix, query, min, max, year, month or day. See the docs for more details on search types. Example: <br/><br/>

   <i>Keyword|title,content|query</i><br/>
   <i>Status|product_status|match</i><br/>
   <i>Hidden|hidden|match</i><br/>
   <i>Full Name|createdBy.fullname</i>(special case for searching by record owner)<br/>
   <br/>This example search might look something like this:<br/><br/>

   <table border="0" cellspacing="0" cellpadding="0" style="width: 400px;">
    <tr>
      <td>Keyword &nbsp;</td>
      <td><input class="text-input wide-input" type="text" name="null" value='' /></td>
    </tr>
    <tr>
      <td>Status&nbsp;</td>
      <td><select><option value=''>&lt;select&gt;</option>
<option value='Active' >Active</option>
<option value='On Sale' >On Sale</option>
<option value='Discontinued' >Discontinued</option>
</select></td>
    </tr>
    <tr>
      <td>Checkbox &nbsp;</td>
      <td><select><option value=''>&lt;select&gt;</option>
<option value='Checked' >Checked</option>
<option value='Unchecked' >Unchecked</option>
</select><br/><br/>
</td>
</tr>
</table>

<p><b>Tip:</b> Use your own fieldnames instead of the examples.</p>


  </dd>
 </dl><br/>



__HTML__;
  print t($content);
?>




      </td>
     </tr>
   </table>

   <table border="0" cellspacing="0" cellpadding="1" class="options" id="sortingTabOptions" style="display: none; width: 100%;">

     <tr>
      <td class="labelColumn"><?php echo t('Order By'); ?></td>
      <td>
        <input class="text-input wide-input setAttr-spellcheck-false" type="text" name="listPageOrder" value="<?php echo htmlencode(@$schema['listPageOrder']) ?>" size="75" style="width: 100%" />
      </td>
     </tr>
     <tr>
      <td class="labelColumn" valign="top" style="padding-top: 2px">&nbsp;</td>
      <td><br/>

<?php
  $content = <<<__HTML__
These sorting settings are used for both the <a href="?menu=every_field_multi">editor</a> and the viewers (although viewers can override them).
Here are some common sorting values that can be used here and in the viewers.  Use your         own fieldnames instead of the <i>examples</i>.<br/>

<dl>
  <dt><i>title, author</i></dt>
  <dd>sort by title, then author<br/><br/></dd>

  <dt><i>date, DESC, title</i></dt>
  <dt><i>date</i> DESC, <i>title</i></dt>
  <dd>sort by date in descending order (newest first), then by title<br/><br/></dd>

  <dt><i>price</i>+0, <i>date</i></dt>
  <dd>sort by price numerically, then by date (oldest first)<br/><br/></dd>

  <dt><i>featured DESC</i>, <i>date DESC</i></dt>
  <dd>sort featured (checkbox field) records first, then order by date (newest first)<br/><br/></dd>

  <dt><i>RAND()</i></dt>
  <dd>sort in random order (for viewers only)<br/><br/></dd>
</dl>

<b>Tip:</b>  The "Order By" field is actually just the standard MySQL ORDER BY clause of a SELECT statement.  So if you're familiar with MySQL you can enter any ORDER BY clause you want here.  Otherwise, congratulations! You just learned some MySQL!
__HTML__;
  print t($content);
?>

      </td>
     </tr>

    </table>

   <table border="0" cellspacing="0" cellpadding="1" class="options" id="advancedTabOptions" style="display: none; width: 100%;">
     <tr>
      <td class="labelColumn"><?php et('Per Page'); ?></td>
      <td>
        <?php $optionsHTML = getSelectOptions(coalesce(@$schema['_perPageDefault'], 25), array(5, 10, 25, 50, 100, 250, 1000)); ?>
        <select name="_perPageDefault"><?php echo $optionsHTML; ?></select>&nbsp;<?php echo t('Default number of records to show per page'); ?>
     </tr>
     <tr>
      <td class="labelColumn"><?php et('Max Records') ?></td>
      <td><input class="text-input" type="text" name="_maxRecords" value="<?php echo htmlencode(@$schema['_maxRecords']) ?>" size="4" /> <?php echo t('Max records for this section (leave blank for unlimited)'); ?></td>
     </tr>
     <tr>
      <td class="labelColumn">&nbsp;</td>
      <td><input class="text-input" type="text" name="_maxRecordsPerUser" value="<?php echo htmlencode(@$schema['_maxRecordsPerUser']) ?>" size="4" /> <?php echo t('Max records per user (leave blank for unlimited)'); ?></td>
     </tr>


   <?php if (@$schema['menuType'] == 'category'): ?>
     <tr>
      <td class="labelColumn"><?php et('Max Depth') ?></td>
      <td>
        <input class="text-input" type="text" name="_maxDepth" value="<?php echo htmlencode(@$schema['_maxDepth']) ?>" size="4" /><?php echo t('Max level of depth for categories (leave blank for unlimited)'); ?></td>
     </tr>
   <?php endif ?>
     <tr>
      <td class="labelColumn"><?php echo t('Disable Add'); ?></td>
      <td>
        <input type="hidden"   name="_disableAdd" value="0" />
        <input type="checkbox" name="_disableAdd" id="disableAdd" value="1" <?php checkedIf(@$schema['_disableAdd'], '1') ?> />
        <label for="disableAdd"><?php echo t('Don\'t allow adding records'); ?></label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Disable View'); ?></td>
      <td>
        <input type="hidden"   name="_disableView" value="0" />
        <label>
          <input type="checkbox" name="_disableView" value="1" <?php checkedIf(@$schema['_disableView'], '1') ?> />
          <?php echo t('Don\'t allow viewing of records through "view" menu'); ?>
        </label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Disable Modify'); ?></td>
      <td>
        <input type="hidden"   name="_disableModify" value="0" />
        <input type="checkbox" name="_disableModify" id="disableModify" value="1" <?php checkedIf(@$schema['_disableModify'], '1') ?> />
        <label for="disableModify"><?php echo t('Don\'t allow modifying records'); ?></label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Disable Erase'); ?></td>
      <td>
        <input type="hidden"   name="_disableErase" value="0" />
        <input type="checkbox" name="_disableErase" id="disableErase" value="1" <?php checkedIf(@$schema['_disableErase'], '1') ?> />
        <label for="disableErase"><?php echo t('Don\'t allow removing records'); ?></label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Disable Preview'); ?></td>
      <td>
        <input type="hidden"   name="_disablePreview" value="0" />
        <label>
          <input type="checkbox" name="_disablePreview" value="1" <?php checkedIf(@$schema['_disablePreview'], '1') ?> />
          <?php echo t("Don't allow previewing records"); ?>
        </label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Disabled Accounts'); ?></td>
      <td>
        <input type="hidden"   name="_hideRecordsFromDisabledAccounts" value="0" />
        <input type="checkbox" name="_hideRecordsFromDisabledAccounts" id="hideRecordsFromDisabledAccounts" value="1" <?php checkedIf(@$schema['_hideRecordsFromDisabledAccounts'], '1') ?> />
        <label for="hideRecordsFromDisabledAccounts"><?php echo t('Viewers: Hide records that are "Created By" a user who is: deleted, disabled, or expired'); ?></label>
      </td>
     </tr>
     <tr>
      <td class="labelColumn"><?php echo t('Hide Menu'); ?></td>
      <td>
        <input type="hidden"   name="menuHidden" value="0" />
        <input type="checkbox" name="menuHidden" id="menuHidden" value="1" <?php checkedIf(@$schema['menuHidden'], '1') ?> />
        <label for="menuHidden"><?php echo t('Don\'t show this section on the menu bar'); ?></label>
      </td>
     </tr>

     <tr><td colspan="2">&nbsp;</td></tr>
     <tr>
      <td class="labelColumn"><?php echo t('Required Plugins'); ?></td>
      <td><input class="text-input wide-input" type="text" name="_requiredPlugins" value="<?php echo htmlencode(@$schema['_requiredPlugins']) ?>" size="75" /></td>
     </tr>
     <tr>
      <td class="labelColumn">&nbsp;</td>
      <td><?php echo t('Example: plugin1.php, plugin2.php'); ?></td>
     </tr>
     <tr><td colspan="2" style="border-bottom: 1px solid #ddd">&nbsp;</td></tr>
     <tr>
      <td class="labelColumn"><a href="http://dev.mysql.com/doc/refman/5.0/en/show-index.html" target="_blank"><?php echo t("MySQL Indexes"); ?></a></td>
      <td>
        <?php
          $indexKeys = array('Key_name','Column_name','Non_unique','Seq_in_index','Collation','Cardinality','Sub_part','Packed','Null','Index_type','Comment');
          $indexDetails = mysql_select_query("SHOW INDEXES FROM `" .mysql_escape($tableName). "`") or die("MySQL Error: ". htmlencode(mysql_error()));
        ?>

          <table border="0" cellspacing="0" cellpadding="0" style="padding: 2px 0px 1px 0px;" class="data">
          <?php
            print "<tr style='font-weight: bold'>\n"; 
            foreach ($indexKeys as $label) { print "<td>" .htmlencode($label). "</td>\n"; }
              print "</tr>\n";
            
            foreach ($indexDetails as $indexRow) {
              print "<tr>\n";
              foreach ($indexKeys as $key) { print "<td>" .htmlencode(@$indexRow[$key]). "</td>\n"; }
              print "</tr>\n";
            }
            
            if (!$indexDetails) {
              print "<tr><td colspan=''>" .t('None'). "</td></tr>\n";
            }
           ?>
           </table>
      </td>
     </tr>
   </table>
   <div class="clear"></div>
   
    </div>


    <div align="right" style="padding-top: 10px">

    <?php if (@$schema['menuType'] != 'link' && @$schema['menuType'] != 'menugroup'): ?>
      <div style="float:left">
        <input class="button" type="button" name="null" value="&lt;&lt; <?php echo t('Code Generator'); ?>" onclick="window.location='?menu=_codeGenerator&amp;tableName=<?php echo urlencode(getTableNameWithoutPrefix(@$_REQUEST['tableName'])) ?>'"/>
        <input class="button" type="button" name="null" value="&lt;&lt; <?php echo t('Editor'); ?>"         onclick="window.location='?menu=<?php echo urlencode(getTableNameWithoutPrefix(@$_REQUEST['tableName'])) ?>'"/>
      </div>
    <?php endif ?>

    <input class="button" type="submit" name="action=listTables" value="&lt;&lt; <?php echo t('Back'); ?>"  />
    <input class="button" type="submit" name="saveTableDetails" value="<?php echo t('Save Details'); ?>"  />
    </div>

  </div>
</div>
<div class="clear"></div>

<?php if (@$schema['menuType'] != 'link' && @$schema['menuType'] != 'menugroup'): ?>

  <div class="content-box">
    <div class="content-box-content">

  <?php if ($SETTINGS['mysql']['allowSystemFieldEditing'] == 1): ?>
    <div class="notification attention png_bg"><div>
      <?php et('<b>Warning:</b> System field editing is currently <i>enabled</i> <span class="inactive">(system fields are shown in gray).</span>'); ?><br />
      <?php et('Modifying system fields may cause your program to stop working correctly!'); ?>
    </div></div>

   <div class="divider_line"></div>
  <?php endif ?>



  <!-- list column headings -->

  <table cellspacing="0" cellpadding="0" style="padding: 2px 0px 1px 0px;" class="data sortable">
  <thead>   
   <tr class="nodrag nodrop">
    <th style="text-align: center"><?php et('Drag') ?></th>
    <th><?php et('Field Label') ?></th>
    <th><?php et('Field Type') ?></th>
    <th><?php et('Field Name') ?></th>
    <th style="text-align: center" colspan="2"><?php et('Action') ?></th>
   </tr>

  <!-- quick add -->
   <tr class="nodrag nodrop" style="border-bottom: 1px solid #ddd">
    <td>&nbsp;</td>
    <td><input class="text-input" type="text" name="fieldLabel" id="fieldLabel" value='' style="width: 95%; font-size: 11px;"
               onkeyup="autoFillQuickAddFieldName()" onchange="autoFillQuickAddFieldName()" /></td>
    <td style="padding-right: 5px">
      <select name="type" id="fieldType" style="font-size: 11px; width: 100%">
        <option value="none"     ><?php et('none'); ?></option>
        <option value="textfield" selected="selected"><?php et('text field'); ?></option>
        <option value="textbox"  ><?php et('text box'); ?></option>
        <option value="wysiwyg"  ><?php et('wysiwyg'); ?></option>
        <option value="date"     ><?php et('date/time'); ?></option>
        <option value="list"     ><?php et('list'); ?></option>
        <option value="checkbox" ><?php et('checkbox'); ?></option>
        <option value="upload"   ><?php et('upload'); ?></option>
        <option value="separator"><?php et('separator'); ?></option>
      </select>
    </td>
    <td><input class="text-input" type="text" name="fieldName" id="fieldName" value='' style="width: 92%; font-size: 11px;" /></td>
    <td colspan="2" style="text-align: center">
      <input class="button" type="button" name="submit" value="<?php echo t('Quick Add'); ?>"  onclick="quickAddField()" />
    </td>
   </tr>
  </thead>
  <!-- /quick add -->
  
  <tbody id="fieldlistContainer">
    <?php displayFieldList(); ?>
  </tbody>

  </table>

   


  <div class="clear"></div>

  <div class="divider_line"></div>


  <div style="float:left">

     <select class="listAdvancedCmds" name="do">
      <option value=''><?php et('Advanced Commands...') ?></option>
      <option value=''>&nbsp;</option>
      <option value="enableSystemFieldEditing"><?php et('Enable System Field Editing'); ?></option>
      <option value="disableSystemFieldEditing"><?php et('Disable System Field Editing'); ?></option>
     </select>
     <input class="button" type="submit" name="_advancedActionSubmit" value=" <?php echo t('go'); ?> "  />
     <br />

  </div>
  <div style="float:right">

      <input class="button" type="submit" name="action=listTables" value="&lt;&lt; <?php echo t('Back'); ?>"  />
      <input class="button" type="button" value="<?php echo t('Add Field'); ?>"  onclick="addField(); return false;" />

  </div>
  <div class="clear"></div>

    </div>
  </div>

<?php endif ?>

</form>

<script type="text/javascript" src="3rdParty/jqueryPlugins/thickbox.js"></script>
<script type="text/javascript" src="lib/menus/database/editTable_functions.js?<?php echo filemtime('lib/menus/database/editTable_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>

<?php showFooter(); ?>
