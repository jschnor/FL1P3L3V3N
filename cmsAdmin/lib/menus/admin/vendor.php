
<form method="post" action="?">
<input type="hidden" name="menu" value="admin" />
<input type="hidden" name="_defaultAction" value="vendorSave" />

<div class="content-box">

  <div class="content-box-header">
    <div style="float:right;">
      <input class="button" type="submit" name="action=vendorSave" value="<?php et('Save') ?>"  />
      <input class="button" type="submit" name="action=vendor" value="<?php et('Cancel') ?>"  />
    </div>

    <h3>
  <?php et('Admin') ?> &gt;
  <a href="?menu=admin&amp;action=vendor"><?php et('Private Labeling') ?></a>
    </h3>

    <div class="clear"></div>
  </div> <!-- End .content-box-header -->


  <div class="content-box-content">

      <table border="0" cellspacing="0" cellpadding="0" class="bottomBorder">
        <tr>
          <td width="150"><?php echo t('Program Name / Titlebar'); ?> &nbsp;</td>
          <td><input class="text-input medium-input" type="text" name="programName" value="<?php echo htmlencode($SETTINGS['programName']) ?>" size="60" /></td>
        </tr>
        <tr>
          <td><?php echo t('Help URL'); ?></td>
          <td>
            <input class="text-input medium-input" type="text" name="helpUrl" value="<?php echo htmlencode($SETTINGS['helpUrl']) ?>" size="60" />
          </td>
        </tr>

        <tr><td colspan="2">&nbsp;</td></tr>

        <tr>
          <td><?php echo t('Vendor Name'); ?></td>
          <td><input class="text-input medium-input" type="text" name="vendorName" value="<?php echo htmlencode($SETTINGS['vendorName']) ?>" size="60" /></td>
        </tr>
        <tr>
          <td><?php echo t('Vendor Location'); ?></td>
          <td><input class="text-input medium-input" type="text" name="vendorLocation" value="<?php echo htmlencode($SETTINGS['vendorLocation']) ?>" size="60" /></td>
        </tr>
        <tr>
          <td><?php echo t('Vendor Url'); ?></td>
          <td><input class="text-input medium-input" type="text" name="vendorUrl" value="<?php echo htmlencode($SETTINGS['vendorUrl']) ?>" size="60" /></td>
        </tr>

        <tr><td colspan="2">&nbsp;</td></tr>

        <tr>
          <td valign="top"><?php echo t('Instructions'); ?></td>
          <td>
            <?php echo t('Update these fields to reflect your company information.'); ?><br/><br/>
            <?php echo t("<p><b>Vendor Fields</b> are displayed in <a href='?menu=admin&amp;action=general'>General Settings</a> and in the <a href='?menu=license'>License Agreement</a>. Make sure Vendor Location is in this format 'State or Province, Country' because it's listed as the jurisdiction in the license agreement.</p>"); ?>
			      <?php echo t("<p><b style=\"color: #CC0000\">And remember...</b> once you change the Vendor Name the private label link won't be displayed anymore.  So bookmark this page or copy down the url: <a href=\"?menu=admin&amp;action=vendor\">Private Label Url</a></p>"); ?>
            <?php echo t("<p><b style=\"color: #CC0000\">Finally...</b> if you accidentally uploaded any text files from the program zip, delete those now.  Those are: 'changelog.txt', 'how to upgrade.txt', and 'upload instructions (READ FIRST).txt'.</p>"); ?>
          </td>
        </tr>
      </table>


  <br/>

  <div style="float:left">
  </div>
  <div style="float:right">
    <input class="button" type="submit" name="action=vendorSave" value="<?php et('Save') ?>"  />
    <input class="button" type="submit" name="action=vendor" value="<?php et('Cancel') ?>"  />
  </div>
  <div class="clear"></div>


  </div>
</div>


</form>
