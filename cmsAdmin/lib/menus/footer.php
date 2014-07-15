
  <div id="footer">
    <small>
    <?php
      if ($SETTINGS['footerHTML']) {
        echo getEvalOutput($SETTINGS['footerHTML']) . '<br/>';
      }

      $executeSecondsString = sprintf(t("%s seconds"), showExecuteSeconds(true));
      echo applyFilters('execute_seconds', $executeSecondsString);
    ?>

    <?php doAction('admin_footer'); ?>
    <!-- -->
    </small>
  </div>

</div> <!-- End #main-content -->
</div> <!-- End #body-wrapper -->

<div class="clear"></div>

</body>
</html>
