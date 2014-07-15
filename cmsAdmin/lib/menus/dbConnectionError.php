<?php
  // Let search engines know we're only down temporarily and they should check back later
  header('HTTP/1.1 503 Service Temporarily Unavailable');
  header('Status: 503 Service Temporarily Unavailable');
  header('Retry-After: 7200'); // in seconds

?><!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
  <style type="text/css">

  * { font-family: arial; }

  a {
   font-weight: bold;
   color: #EE0000;
  }

  #errorBox    { background-color: #EEEEEE;
                 border: solid 5px #4466AA;

                 /* center div in page */
                 margin-top: 75px;
                 margin-left: auto;
                 margin-right: auto;
                 width: 600px;
                 }
  #errorHeader { background-color: #4466AA;
                 color: #FFF;
                 text-align: center;
                 font-size: 16pt;
                 font-weight: bold;
                 padding: 4px 8px 8px 8px;
               }
  #errorContent {
                 font-size: 13pt;
                 padding: 20px;
               }
  .webmasterMessage {
    color: #666666;
    font-size: 14px;
  }

  </style>
  <script type="text/javascript">
   function addFavorite() {
     url   = window.location
     title = ''; //prompt("Enter bookmark name.");
     if      (window.external.AddFavorite) { window.external.AddFavorite(url,title); } // for IE
     else if (window.sidebar.addPanel)     { window.sidebar.addPanel(title, url, ''); } // for firefox
   }
  </script>

 </head>
<body background="lib/images/bg.gif" bgcolor="#FFFFFF" text="#000000" link="#336699" vlink="#336699" alink="#336699">

<div id="errorBox">
 <!-- <div id="errorHeader">Error connecting to database!</div> -->
 <div id="errorContent">

  <dl style="margin-top: 0px">
   <dt><b>Hello, Website Visitors!</b></dt><br/>
   <dd>
     We are temporarily experiencing <b>high website traffic</b> or technical difficulties.
     Please <a href="javascript:addFavorite()">bookmark this page</a> and come back later.
   </dd><br/><br/>


   <dt class="webmasterMessage"><b>Do you run this website?</b></dt><br/>
   <dd class="webmasterMessage">
    We were unable to connect to the database, possibly because:

    <ol type="A">
      <li>Your database settings are incorrect (check in /data/<?php echo SETTINGS_FILENAME ?>)</li>
      <li>Your database server is down or overloaded (check with your host)</li>
    </ol>

    <p>The database error given was:<br/>
    <?php echo @$connectionError ? $connectionError : 'none' ?>


   </dd>
  </dl>


  </div>
</div>


<div style="text-align: center; font-size: 8px; color: #666666">
  <?php printf(t("%s seconds"), showExecuteSeconds()) ?>
</div>

</body>
</html>
