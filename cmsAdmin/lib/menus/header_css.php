  <?php $cssTheme = @$SETTINGS['cssTheme'] ? $SETTINGS['cssTheme'] : 'blue.css'; ?>

  <!-- CSS -->
  <link rel="stylesheet" href="3rdParty/SimplaAdmin/css/reset.css" type="text/css" media="screen" /><!-- Reset Stylesheet -->
  <link rel="stylesheet" href="3rdParty/SimplaAdmin/css/style.css" type="text/css" media="screen" /><!-- Main Stylesheet -->
  <link rel="stylesheet" href="3rdParty/SimplaAdmin/css/invalid.css" type="text/css" media="screen" /><!-- Invalid Stylesheet. This makes stuff look pretty. Remove it if you want the CSS completely valid -->
  <link rel="stylesheet" href="3rdParty/SimplaAdmin/css/<?php echo $cssTheme ?>" type="text/css" media="screen" /><!-- options: green, blue, red -->
  <!--[if lte IE 7]><link rel="stylesheet" href="3rdParty/SimplaAdmin/css/ie.css" type="text/css" media="screen" /><![endif]-->
  <link rel="stylesheet" href="3rdParty/jqueryPlugins/thickbox.css" type="text/css" media="screen" />
  <link rel="stylesheet" href="3rdParty/jqueryPlugins/uploadify/uploadify.css" type="text/css" media="screen" />
  <!-- load favourite icon -->

  <?php if (is_file("{$GLOBALS['PROGRAM_DIR']}/favicon.ico")): ?>
    <link rel="shortcut icon" href="favicon.ico" />
  <?php endif ?>

  <?php if (is_file("{$GLOBALS['PROGRAM_DIR']}/custom.css")): ?>
    <link rel="stylesheet" href="custom.css" type="text/css" media="screen" />
  <?php endif ?>
