
<h2>
  <?php
    $title = sprintf(t('Welcome to %s'), htmlencode($SETTINGS['programName']));
    $title = applyFilters('home_title', $title);
    echo $title;
  ?>
</h2>

<div class="content-box">
  <div class="content-box-content">

    <?php
      $content = "<p>" . t('Please select an option from the menu.') . "</p>";
      if ($CURRENT_USER['isAdmin']) {
        $content .= "<p>" . t('<b>Administrators:</b> Use the <a href="?menu=database">Section Editors</a> to add sections and generate PHP viewers.') . "</p>";
      }

      $content = applyFilters('home_content', $content);
      echo $content;
    ?>

  </div>
</div>
