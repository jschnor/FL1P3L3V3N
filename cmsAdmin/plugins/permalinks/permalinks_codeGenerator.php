<?php // Website Membership Code Generator Functions

//
function permalink_codeGenerator_showPage() {

  // Support default "Go Back >>" button
  if (array_key_exists('_showCode', $_REQUEST)) { redirectBrowserToURL('?menu=_codeGenerator'); }

  //
  $GENERATOR_FILENAMES_TO_DESCRIPTIONS = array(
    '.htaccess'                 => ".htaccess code for redirecting requests",
    //'user-login.php'            => "Login Page",
    //'user-password-request.php' => "Password Request (Request reset email)",
    //'user-password-reset.php'   => "Password Reset (Linked from reset email)",
    //'user-profile.php'          => "Edit Profile",
  );

  // show header
  $function = "_permalink_codeGenerator";
  $menuName = t("Permalinks");
  echo cg2_header($function, $menuName);

  // show page menu
  print "<ul style='padding-top: 0; padding-bottom: 0;'>\n";
  foreach ($GENERATOR_FILENAMES_TO_DESCRIPTIONS as $filename => $description) {
    $url = thisPageUrl(array('filename' => $filename));
    print  "  <li><a href='$url'>" .htmlencode($description).  "</a></li>\n";
  }
  print "</ul>\n";

  // show page
  $filename = @$_REQUEST['filename'];
  if ($filename && @$GENERATOR_FILENAMES_TO_DESCRIPTIONS[$filename]) {

    // show separator bar
    print "  <div class='content-box content-box-divider'>\n";
    print "    <div class='content-box-header'><h3>" .t("Source Code"). "</h3></div>\n";
    print "  </div>\n";

    // get function name
    $getCodeFunction = "permalinkcode_" . preg_replace("/[^a-z\_]+/s", "_", $filename);
    if (!function_exists($getCodeFunction)) { die("Function $getCodeFunction doesn't exist!"); }

    // show instructions
    $instructions   = array(); // show as bullet points
    $instructions[] = t(sprintf("Save this code as <b>%s</b> (or choose your own name)", $filename));
    #$instructions[] = sprintf('Update the <a href="%s">Archive Url</a> under Newsletter Settings', '?menu=_nlb_settings');
    $filenameSuffix = 'list'; // eg: tablename-FILENAMESUFFIX.php
    cg2_showCode(null, null, $instructions, null, $getCodeFunction());
    exit;
  }

  // show footer (cg2_showCode sends it automatically)
  echo cg2_footer();
  exit;
}

//
function permalinkcode__htaccess() {
  // generate code
  $dispatcherFile = 'permalinks_dispatcher.php';
  list($dispatcherPath, $dispatcherUrl) = getPluginPathAndUrl($dispatcherFile);
  $dispatcherUrl = str_replace('%20', '\\ ', $dispatcherUrl); // For urls with spaces in them: http://stackoverflow.com/questions/410811/mod-rewrite-with-spaces-in-the-urls

  ob_start();
?>
# Add this to an .htaccess file in your website root folder
# Your website root folder is usually named: htdocs, httpdocs, www, html, or just / in FTP

# START: CMS Permalink Code
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^<?php echo addcslashes($dispatcherFile, '.'); ?>$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . <?php echo $dispatcherUrl ?> [L]
</IfModule>
# END: CMS Permalink Code

<?php
  // return code
  $code = ob_get_clean();
  return $code;
}
?>