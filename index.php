<!doctype html>
<html class="no-js" lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

        <title>Mirror Me | Don't Change Reality. Take It.</title>
        <meta name="description" content="The sci-fi drama MIRROR ME follows Jason Thompson, an honorable police officer who is replaced by a sinister variant of himself from a corrupt parallel universe." />
        <meta name="keywords" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />

        <link href='http://fonts.googleapis.com/css?family=Raleway:600,400,300,200' rel='stylesheet' type='text/css'>
        <link href="/css/mirror-me.css" rel="stylesheet" type="text/css">
        <?php echo strpos($_SERVER['HTTP_HOST'],'dev') !== false || strpos($_SERVER['HTTP_HOST'],'local') !== false ? '<script type="text/javascript" src="/js/mirror-me.js"></script>' : '<script type="text/javascript" src="/js/mirror-me.min.js"></script>'; echo "\n"; ?>
    </head>

    <body><?php
// don't output Google Analytics on dev sites
if (strpos($_SERVER['HTTP_HOST'],'dev') === false && strpos($_SERVER['HTTP_HOST'],'local') === false){
  ?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-30904006-2', 'auto');
  ga('send', 'pageview');
</script>
  <?php
}
?></body>
</html>
