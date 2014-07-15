<?php include "lib/menus/header.php" ?>

<form method="post" action="?" class="setAttr-spellcheck-false">
<input type="hidden" name="save" value="1" />

<script type="text/javascript">
  var DEFAULT_PRODUCT_ID = "XXXX-XXXX-XXXX-XXXX";

  //
  function setDefaultProductId(idName) {
    var elProductId = document.getElementById(idName);
    if (elProductId.value == '' || elProductId.value == DEFAULT_PRODUCT_ID) {
      elProductId.value = DEFAULT_PRODUCT_ID;
      elProductId.style.color = "#999999";
    }
  }

  function clearDefaultProductId(elProductId) {
    if (elProductId.value == DEFAULT_PRODUCT_ID) {
      elProductId.value = '';
      elProductId.style.color = "#000000";
    }
  }

  $(document).ready(function(){
    setDefaultProductId('licenseProductId');
  });
</script>



<div class="content-box">
  <div class="content-box-header"><h3>One Minute Install</h3></div>
  <div class="content-box-content">
    <div class="tab-content default-tab">
      <div class="contentBody">

      Welcome to <b><?php echo $SETTINGS['programName'] ?> v<?php echo htmlencode($APP['version']) ?></b>.  We'll have you up in running in just a minute.<br/><br/>

      Please enter your company name (or your name), the domain name of the website
      the software will be used on, and your email address.<br/><br/><br/>

      <table border="0" cellspacing="0" cellpadding="2" style="margin-left: 25px">
       <tr>
        <td>Company Name &nbsp;</td>
        <td>
          <?php $licenseCompanyName = array_key_exists('licenseCompanyName', $_REQUEST) ? $_REQUEST['licenseCompanyName'] : $SETTINGS['licenseCompanyName']; ?>
          <input class="text-input medium-input" type="text" name="licenseCompanyName" value="<?php echo htmlencode($licenseCompanyName) ?>" size="40" />
        </td>
       </tr>
       <tr>
        <td>Domain Name</td>
        <td>
          <?php $licenseDomainName  = array_key_exists('licenseDomainName', $_REQUEST)  ? $_REQUEST['licenseDomainName']  : $SETTINGS['licenseDomainName']; ?>
          <input class="text-input medium-input" type="text" name="licenseDomainName" value="<?php echo htmlencode($licenseDomainName) ?>" size="40" />
        </td>
       </tr>
       <tr>
        <td>Product Id</td>
        <td><input class="text-input medium-input" type="text" name="licenseProductId" id="licenseProductId" value="<?php echo htmlencode(@$_REQUEST['licenseProductId']) ?>" size="40" onfocus="clearDefaultProductId(this)" /></td>
       </tr>
       <tr>
        <td></td>
        <td>
         <input type="hidden" name="agreeToOneInstall" value="0" />
         <input type="checkbox" name="agreeToOneInstall" id="agreeToOneInstall" value="1" <?php checkedIf(@$_REQUEST['agreeToOneInstall'], '1') ?> />
          <label for="agreeToOneInstall">I agree not to use this 'Product Id' for multiple installs (backup &amp; staging are ok).</label>
        </td>
       </tr>
       <tr>
        <td></td>
        <td>
         <input type="hidden" name="understandTermination" value="0" />
         <input type="checkbox" name="understandTermination" id="understandTermination" value="1" <?php checkedIf(@$_REQUEST['understandTermination'], '1') ?> />
          <label for="understandTermination">I understand doing so may cause me to lose my right to use this software.</label>
        </td>
       </tr>
       <tr>
        <td></td>
        <td>
         <input type="hidden" name="agreeToLicense" value="0" />
         <input type="checkbox" name="agreeToLicense" id="agreeToLicense" value="1" <?php checkedIf(@$_REQUEST['agreeToLicense'], '1') ?> />
          <label for="agreeToLicense">I accept the terms of the</label>
          <a href="?menu=license" target="_blank">License Agreement</a>.
        </td>
       </tr>
      </table><br/><br/>

      <h4>Database Location</h4>

      Next, tell us your MySQL settings.  If you don't know these you can ask your web host.<br/><br/>

      <table border="0" cellpadding="0" cellspacing="2" style="margin-left: 25px; width: 100%">
        <tr>
          <td width="155">MySQL Hostname</td>
          <td><input name="mysqlHostname" value="<?php echo htmlencode(@$_REQUEST['mysqlHostname']) ?>" size="40" class="text-input medium-input" type="text" /></td>
        </tr>
        <tr>
          <td>MySQL Database</td>

          <td><input name="mysqlDatabase" value="<?php echo htmlencode(@$_REQUEST['mysqlDatabase']) ?>" size="40" class="text-input medium-input" type="text" /></td>
        </tr>
        <tr>
          <td>MySQL Username</td>
          <td><input name="mysqlUsername" value="<?php echo htmlencode(@$_REQUEST['mysqlUsername']) ?>" size="40" class="text-input medium-input" type="text" /></td>
        </tr>
        <tr>
          <td>MySQL Password</td>
          <td><input name="mysqlPassword" value="<?php echo htmlencode(@$_REQUEST['mysqlPassword']) ?>" size="40" class="text-input medium-input" type="password" /></td>
        </tr>
        <tr>
          <td>MySQL Table Prefix &nbsp;</td>
          <td><input name="mysqlTablePrefix" value="<?php echo htmlencode(@$_REQUEST['mysqlTablePrefix']) ?>" size="40" class="text-input medium-input" type="text" /></td>
        </tr>
      </table><br/><br/>

      <div class="content-box"><!-- Start Content Box -->

        <div class="content-box-header">
          <h3>Getting Started</h3>

          <?php
            $tab1class = '';
            $tab2class = '';
            if (@$_REQUEST['restoreFromBackup']) { $tab2class = 'default-tab'; }
            else                                 { $tab1class = 'default-tab'; }
          ?>

          <ul class="content-box-tabs">
            <li><a href="#tab1" onclick="$('#restoreFromBackup').attr('checked', false);" class="<?php echo $tab1class ?>">New Installation</a></li> <!-- href must be unique and match the id of target div -->
            <li><a href="#tab2" onclick="$('#restoreFromBackup').attr('checked', true);"  class="<?php echo $tab2class ?>">Restore from Backup</a></li>
          </ul>
          <div class="clear"></div>
        </div> <!-- End .content-box-header -->

<div style="visibility: hidden; position: absolute">
         <input type="checkbox" name="restoreFromBackup" id="restoreFromBackup" value="1" <?php checkedIf(@$_REQUEST['restoreFromBackup'], '1') ?> />
                Restore from Backup<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
</div>

        <div class="content-box-content">

          <!-- Start #tab1 -->
          <div class="tab-content <?php echo $tab1class ?>" id="tab1"> <!-- This is the target div. id must match the href of this div's tab -->

            For new installations please select an administrator username and password and write them down in a safe place.<br /><br />

             <table border="0" cellspacing="0" cellpadding="0" style="margin-left: 25px; width: 100%">
             <tr>
              <td width="155">Admin Full Name&nbsp;</td>
              <td><input class="text-input medium-input" type="text" name="adminFullname" value="<?php echo htmlencode(@$_REQUEST['adminFullname']) ?>" size="40" /></td>

             </tr>
             <tr>
              <td>Admin Email&nbsp;</td>
              <td><input class="text-input medium-input" type="text" name="adminEmail" value="<?php echo htmlencode(@$_REQUEST['adminEmail']) ?>" size="40" /></td>
             </tr>
             <tr>
              <td>Admin Username&nbsp;</td>
              <td><input class="text-input medium-input" type="text" name="adminUsername" value="<?php echo htmlencode(@$_REQUEST['adminUsername']) ?>" size="40" /></td>

             </tr>
             <tr>
              <td>Admin Password&nbsp;</td>
              <td><input class="text-input medium-input" type="password" name="adminPassword1" value="<?php echo htmlencode(@$_REQUEST['adminPassword1']) ?>" size="40" /></td>
             </tr>
             <tr>
              <td>Admin Password (again)&nbsp;</td>
              <td><input class="text-input medium-input" type="password" name="adminPassword2" value="<?php echo htmlencode(@$_REQUEST['adminPassword2']) ?>" size="40" /></td>

             </tr>
            </table><br/>

            Once you have created your username and password click "Finish" and login to the
            program.<br/><br/>

            <div align="center">
              <input class="button" type="submit" name="null" value=" Finish &gt;&gt; " />
            </div>

          </div>
          <!-- End #tab1 -->


          <!-- start tab2 -->
          <div class="tab-content <?php echo $tab2class ?>" id="tab2">


            To restore from a backup, select the backup file below:<br /><br />

            <?php $options = getBackupFiles_asOptions( @$_REQUEST['restore'] ); ?>
            <select name="restore" id="restore"><?php echo $options ?></select>
            <input class="button" type="submit" name="null" value="Restore" /><br/><br/>
            NOTE: To prevent data loss you can only restore to a database location with no pre-existing user accounts.<br/>



          </div>
          <!-- End #tab2 -->
        </div> <!-- End .content-box-content -->
      </div> <!-- End .content-box -->


<div class="content-box">
  <div class="content-box-header"><h3>Advanced Options</h3></div>
  <div class="content-box-content">
    <div class="tab-content default-tab">
      <div class="contentBody">

        You can safely ignore these options if you don't need them.<br/><br/><br/>

          <h4>Development/Staging Servers</h4>
        <table border="0" cellpadding="0" cellspacing="2">
         <tr>
          <td>Use Custom Settings File</td>
          <td>
           <input type="hidden" name="useCustomSettingsFile" value="0" />
           <label>
             <?php if (file_exists(SETTINGS_DEV_FILEPATH)) { $_REQUEST['useCustomSettingsFile'] = 1; } ?>
             <input type="checkbox" name="useCustomSettingsFile" value="1" <?php checkedIf(@$_REQUEST['useCustomSettingsFile'], '1') ?>  />
              For this domain name only (<?php echo htmlencode(@$_SERVER['HTTP_HOST']); ?>) use this setting file: <b>/data/<?php echo htmlencode(SETTINGS_DEV_FILENAME); ?></b>.<br/>
              Using a separate settings file for development servers ensures you never accidentally overwrite your live server settings
              when uploading CMS /data/ files.  Always use custom settings files for development servers only, not your live servers.<br/>
           </label><br/>
          </td>
         </tr>

        <tr>
          <td width="175"><?php echo("Website Prefix URL"); ?></td>
          <td>
            <?php $webPrefixUrl = array_key_exists('webPrefixUrl', $_REQUEST) ? $_REQUEST['webPrefixUrl'] : $SETTINGS['webPrefixUrl']; ?>
            <input class="text-input medium-input" type="text" name="webPrefixUrl" value="<?php echo htmlencode($webPrefixUrl) ?>" size="60" />
            eg: /~username or /development/client-name<br/>
            If your development server uses a different URL prefix than your live server you can specify it here.  This prefix can be changed
            in the Admin Menu and will be automatically added to Viewer URLs and can be displayed with &lt;?php echo PREFIX_URL ?&gt;.
            This will allow you to easily move files between a development and live server, even if they have different URL prefixes.
          </td>
        </tr>
        </table><br/><br/>

      </div>
    </div> <!-- End .tab-content -->
  </div> <!-- End .content-box-content -->
</div> <!-- End .content-box -->



      </div>
    </div> <!-- End .tab-content -->
  </div> <!-- End .content-box-content -->
</div> <!-- End .content-box -->

</form>

<?php showFooter(); ?>
