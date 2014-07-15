<?php include "lib/menus/header.php" ?>

<form method="post" action="?">
<input type="hidden" name="menu" value="forgotPassword" />
<input type="hidden" name="action" value="submit" />

<div class="content-box">
  <div class="content-box-header"><h3><?php et('Forgot your password?') ?></h3></div>
  <div class="content-box-content login-content">
    <div class="tab-content default-tab" align="center">

        <?php if (@$GLOBALS['sentEmail'] && !alert()): ?>

          <p>
            <?php et("Thanks, we've emailed you instructions on how to reset your password.") ?><br />
          </p>

          <p>
            <?php printf(t("If you don't receive an email within a few minutes check your spam filter for messages from %s"), $SETTINGS['adminEmail']) ?><br/>
          </p>

        <?php else: ?>

          <p style="margin-bottom: 20px;">
            <?php et("Enter your username (or email address) to reset your password.") ?><br/>
            <?php et("We'll send you an email with instructions and a reset link.") ?><br/>
          </p>

          <p>
            <span class="label"><?php et('Lookup') ?></span>
            <input class="text-input" type="text" name="usernameOrEmail" id="usernameOrEmail" value="<?php echo htmlencode(@$_REQUEST['usernameOrEmail']) ?>" />
            <input class="button" type="submit" name="send" value="<?php et('Send') ?>" tabindex="4" />
          </p>
          <script type="text/javascript">document.getElementById('usernameOrEmail').focus();</script>

          <div class="clear"></div>


        <?php endif ?>

        <p style="float: left; margin-top: 20px">
          <a href="?"><?php et('&lt;&lt; Back to Login Page') ?></a>
        </p>


      <div class="clear"></div>

    </div> <!-- End .tab-content -->
  </div> <!-- End .content-box-content -->
</div> <!-- End .content-box -->

</form>


<?php showFooter(); ?>
