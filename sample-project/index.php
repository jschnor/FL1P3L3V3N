<?php
// get data from a CMS database here
// save it as a JSON object to /js/data.js
// include /js/data.js in the <head>

?><!doctype html>
<html class="no-js" lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

		<title>Flip Bits</title>
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />

		<link href="/css/app.css" rel="stylesheet" type="text/css">
		<?php
		// output uncompressed JS on dev sites, minified JS on live sites
		echo strpos($_SERVER['HTTP_HOST'],'dev') !== false || strpos($_SERVER['HTTP_HOST'],'local') !== false ? '<script type="text/javascript" src="/js/app.js"></script>' : '<script type="text/javascript" src="/js/app.min.js"></script>'; echo "\n";
		?>
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

		ga('create', 'UA-00000000-1', 'auto');
		ga('send', 'pageview');
		</script>
		<?php
	}
	?></body>
</html>