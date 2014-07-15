<?php include "header.php" ?>

<form method="post" action="?">
<input type="hidden" name="action" value="loginSubmit" />
<input type="hidden" name="redirectUrl" value="<?php echo htmlencode( @$_REQUEST['redirectUrl'] ? $_REQUEST['redirectUrl'] : thisPageUrl() )?>" />

<div class="content-box">
  <div class="content-box-header"><h3><?php et('Login') ?></h3></div>
  <div class="content-box-content login-content">
    <div class="tab-content default-tab" align="center">

<?php ob_start(); // start caching output ?>
        <p>
          <span class="label"><?php et('Username') ?></span>
          <input class="text-input" type="text" name="username" id="username" value="<?php echo htmlencode(@$_REQUEST['username']) ?>" tabindex="1" autocomplete="off" /><?php // security: disable autocomplete so sensitive info won't be stored in browser ?>
        </p>
        <script type="text/javascript">document.getElementById('username').focus();</script>

        <p>
          <span class="label"><?php et('Password') ?></span>
          <input class="text-input" type="password" name="password" value="<?php echo htmlencode(@$_REQUEST['password']) ?>" tabindex="2" autocomplete="off"/><?php // security: disable autocomplete so sensitive info won't be stored in browser ?>
        </p>

        <p>
          <input class="button" type="submit" name="login" value="<?php et('Login') ?>" tabindex="4" />
        </p>

        <p>
          <a href="?menu=forgotPassword"><?php et('Forgot your password?'); ?></a>
        </p>
<?php
  $content = ob_get_clean(); // get cached output
  $content = applyFilters('login_content', $content);
  echo $content;
?>


      <div class="clear"></div>

    </div> <!-- End .tab-content -->
  </div> <!-- End .content-box-content -->
</div> <!-- End .content-box -->

</form>

<?php showFooter(); ?>
