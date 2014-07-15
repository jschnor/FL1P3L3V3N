
<?php
include('includes/loadrecords.inc.php');

function clean($string) {
   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

// load record from 'home_sailfish'
list($home_sailfishRecords, $home_sailfishMetaData) = getRecords(array(
  'tableName'   => 'home_sailfish',
  'loadUploads' => true,
  'allowSearch' => false,
  'limit'       => '1'
));
$home_sailfishRecord = @$home_sailfishRecords[0]; // get first record
if (!$home_sailfishRecord) { dieWith404("Record not found!"); } // show error message if no record found

// load record from 'about_sailfish'
list($about_sailfishRecords, $about_sailfishMetaData) = getRecords(array(
  'tableName'   => 'about_sailfish',
  'where'       => '', // load first record
  'loadUploads' => true,
  'allowSearch' => false,
  'limit'       => '1',
));
$about_sailfishRecord = @$about_sailfishRecords[0]; // get first record
if (!$about_sailfishRecord) { dieWith404("Record not found!"); } // show error message if no record found

// load records from 'team_sailfish'
list($team_sailfishRecords, $team_sailfishMetaData) = getRecords(array(
  'tableName'   => 'team_sailfish',
  'loadUploads' => true,
  'allowSearch' => false,
));

// load records from 'believe'
list($believeRecords, $believeMetaData) = getRecords(array(
  'tableName'   => 'believe',
  'loadUploads' => true,
  'allowSearch' => false
));

// load records from 'work_sailfish'
list($work_sailfishRecords, $work_sailfishMetaData) = getRecords(array(
  'tableName'   => 'work_sailfish',
  'loadUploads' => true,
  'allowSearch' => false
));

function saveJSON($portfolio){
  $data = array('portfolio'=>array());

  // print_r($portfolio);

  foreach ($portfolio as $array){
    // look up services category
    $services = array();
    foreach ($array['services:values'] as $svc_id){
      if ($svc_id != ''){
        list($svcRecords, $svcMetaData) = getRecords(array(
          'tableName'   => 'services',
          'where' => 'num='.$svc_id,
          'loadUploads' => true,
          'allowSearch' => false
        ));

        $category = $svcRecords[0]['service_category'];
        $services[$category][] = $svcRecords[0]['title'];
      }
    }
    $array['services_sorted'] = $services; // add the sorted services to the data array

    $data['portfolio'][] = $array;
  }

  $filename = 'js/portfolio.json';

  $fh = fopen($filename, 'w');
  fwrite($fh, json_encode($data));
  fclose($fh);

  // print_r(json_encode($data));
}

saveJSON($work_sailfishRecords);

/*echo '<pre>';
print_r();
echo '</pre>';*/

?><!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>F11P | Flipeleven Creative | A digital creative agency specializing in video and HTML5 web experiences</title>
    <link rel="stylesheet" href="/css/app.css" />
    <script src="/js/modernizr.js"></script>
  </head>
<body>
<!-- OFF CANVAS WRAP --> 
<div id="home" class="row">
  <div class="off-canvas-wrap">
    <div class="inner-wrap">
    <!-- OFF CANVAS WRAP -->

      <aside class="left-off-canvas-menu">
        <div class="row off-canvas-content">
          <!-- Graphic holder for screen sliding -->
        </div>
      </aside>
      <a class="exit-off-canvas"></a>
      
      <div class="spacer"></div>
      <div class="row">
        <div class="large-12 columns">

          <div id="main-nav" class="contain-to-grid sticky">
            <nav class="top-bar" data-topbar>
              <ul class="title-area">
                <li class="name"><a href="/"><img src="/assets/images/flipeleven_logo.jpg" alt="Flipeleven Logo"></a></li>
                <li class="toggle-topbar menu-icon">
                  <a href="#"><span>Menu</span></a>
                </li>
              </ul>

              <section class="top-bar-section">
                <ul class="right">
                  <li class="divider"></li>
                  <li><a href="#home" id="nav_home">Home</a></li>
                  <li class="divider"></li>
                  <li><a href="#about" id="nav_about">About</a></li>
                  <li class="divider"></li>
                  <li><a href="#work" id="nav_work">Work</a></li>
                  <li class="divider"></li>
                  <li><a href="#contact" id="nav_contact">Contact</a></li>
                </ul>
              </section>
            </nav>
          </div>
          
        </div>
      </div>
      <div class="video-bg">
        <!-- HOLDER FOR BIG BACKGROUND VIDEO -->
      </div>
      <div class="row content">
        <div class="large-12 columns">
          <div class="row first collapse">
            <div class="large-5 large-offset-7 columns">
              <div class="row box">
                <!-- <h1>A Non - Traditional<br/>Digital Creative Agency</h1> -->
                <h1>A Digital Creative Agency</h1>
                <!-- <h5>We believe the reward for great work is more work. Our passionate creators, technologists and filmmakers fearlessly push the bounds of your brands potential through the web, social media and video.</h5> -->
                <!-- <h5>Our passionate creators, technologists and filmmakers fearlessly push the bounds of your brands' potential through web, social media and video.</h5> -->
                <!-- <a href="#about" class="medium button right">Get aquainted with us</a> -->
              </div>
            </div>
          </div>
        </div>

        <div id="about" class="large-12 columns about">
          <div class="row">
            <div class="large-4 medium-5 small-12 columns">
              <div class="panel">
                <h2 class="subheader"><?php echo $about_sailfishRecord['header']; ?></h2>
                <h5 class="subheader"><?php echo $about_sailfishRecord['subheader']; ?></h5>
                <?php echo $about_sailfishRecord['content']; ?>
              </div>
            </div>


            <div class="large-8 medium-7 small-12 columns hide-for-small">

              <div class="panel">
                <div class="row">

                  <div class="medium-6 columns believe">
                    <h3 class="subheader">Things we <br/>believe in</h3>
                    <?php
                    // output things we believe
                    foreach ($believeRecords as $array){
                      echo '<h5><em>'.$array['name'].'</em></h5>';
                    }
                    ?>
                  </div>

                  <div class="medium-6 columns team">
                    <h3 class="subheader">Fliprofile</h3>
                    <?php
                    // pick a random team profile to show
                    $rand_key = array_rand($team_sailfishRecords);
                    $profile = $team_sailfishRecords[$rand_key];
                    ?>

                    <div class="row">
                      <div class="medium-5 columns">
                        <img src="<?php echo $profile['headshot'][0]['urlPath']; ?>" alt="<?php echo $profile['name']; ?>">
                      </div>
                      <div class="medium-7 columns">
                        <h5><?php echo $profile['name']; ?></h5>
                        <h6><?php echo $profile['title']; ?></h6>
                      </div>
                    </div>

                    <div class="detail">
                      <div class="row qa">
                        <div class="medium-2 columns">
                          <h5><span>Q</span></h5>
                        </div>
                        <div class="medium-10 columns question">
                          <h6><?php echo $profile['question']; ?></h6>
                        </div>
                      </div>
                      <div class="row qa">
                        <div class="medium-2 columns">
                          <h5><span>A</span></h5>
                        </div>
                        <div class="medium-10 columns">
                          <p><?php echo $profile['answer']; ?></p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>


          </div>
        </div> 


          <div id="work" class="large-12 columns work">
            <h2>Some of our faves</h2>
            <?php
            // output first three featured work items
            $int = 1;
            foreach ($work_sailfishRecords as $key=>$array){
              if ($array['type'] == 'Featured' && $int <= 3){
                ?>
                <div id="<?php echo clean(strtolower($array['name'])).'-'.$key; ?>" class="medium-4 columns left-off-canvas-toggle">
                  <img src="<?php echo $array['thumb_image'][0]['urlPath']; ?>"<?php
                  if ($array['thumb_image'][0]['info1'] != ''){
                    echo ' alt="'.$array['thumb_image'][0]['info1'].'"';
                  }
                  ?> />
                  <div class="panel">
                    <h4><?php echo $array['name']; ?></h4>
                    <h5><?php echo $array['subhead']; ?></h5>
                    <p><?php echo $array['excerpt']; ?></p>
                  </div>
                </div>
                <?php
                $int++;
              }
            }
            ?>
          </div>

          <div id="portfolio" class="large-12 columns work portfolio">
            <h2>Additional work we're proud of</h2>
            <?php
            // output additional work
            foreach ($work_sailfishRecords as $key=>$array){
              if ($array['type'] != 'Featured'){
                ?>
                <div id="<?php echo clean(strtolower($array['name'])).'-'.$key; ?>" class="medium-3 columns left-off-canvas-toggle">
                  <img src="<?php echo $array['thumb_image'][0]['urlPath']; ?>"<?php
                  if ($array['thumb_image'][0]['info1'] != ''){
                    echo ' alt="'.$array['thumb_image'][0]['info1'].'"';
                  }
                  ?> />
                  <div class="panel">
                    <h4 class="subheader"><?php echo $array['name']; ?></h4>
                    <h5 class="subheader"><?php echo $array['subhead']; ?></h5>
                  </div>
                </div>
                <?php
              }
            }
            ?>

          <div id="contact" class="medium-6 columns">
            <h2>Contact Us</h2>
            <div class="large-12 columns">
            <form id="contactForm" method="post" action="assets/includes/process.php">
              <div class="row">
                <div class="large-12 columns">
                  <label for="fullnamefield">Full name</label>
                  <input type="text" placeholder="Please enter your full name" id="fullnamefield" name="fullnamefield">
                </div>
              </div>
              <div class="row">
                <div class="large-12 columns">
                  <label for="emailfield">E-mail address</label>
                  <input type="text" placeholder="Enter your e-mail address" id="emailfield" name="emailfield">
                </div>
              </div>
              <div class="row">
                <div class="large-12 columns">
                  <label for="confirmemailfield">Confirm e-mail address</label>
                  <input type="text" placeholder="Confirm your e-mail address" id="confirmemailfield" name="confirmemailfield">
                </div>
              </div>
              <div class="row">
                <div class="large-12 columns">
                  <label for="commentsfield">Comments</label>
                  <textarea placeholder="Please enter your comment or questions here" id="commentsfield" name="commentsfield"></textarea>
                </div>
              </div>
            </form>
            <p><a href="#" class="primary button radius" id="submit">Submit</a></p>
             </div>
          </div>
          <div class="medium-6 columns" id="map">
            <a href="https://www.google.com/maps/place/710+N+Plankinton+Ave/@43.0391229,-87.910984,17z/data=!3m1!4b1!4m2!3m1!1s0x880519a083a30717:0x554c6bfe6d741400" target="_blank"><img src="http://maps.googleapis.com/maps/api/streetview?size=1100x380&location=43.039051,-87.911469&fov=120&heading=455&pitch=10&sensor=false" alt="Flipeleven Location" /></a>
            <h5>710 N. Plankinton Ave. Ste. 300<br/>
            Milwaukee, WI 53203<br/>
            phone: (414) 272-3547<br/>
            e-mail: info[at]flipeleven[dot]com</h5>
          </div>

      <div class="row footer collapse">
        <hr/>
        <div class="medium-5 columns">
          <p>Copyright Flipeleven LLC 2014 All rights reserved</p>
        </div>
        <div class="medium-7 columns right">
          <ul>
            <li><a href="#home" id="fot_home">Home</a></li>
            <li class="divider"></li>
            <li><a href="#about" id="fot_about">About</a></li>
            <li class="divider"></li>
            <li><a href="#work" id="fot_work">Work</a></li>
            <li class="divider"></li>
            <li><a href="#contact" id="fot_contact">Contact</a></li>
          </ul>
        </div>
      </div>
<!-- OFF CANVAS WRAP -->
    </div>
  </div>
</div>
</div>
<div id="video-holder">
  <div></div>
</div>
<!-- END OFF CANVAS WRAP -->
    <script>
    // prepare array of background videos
    var bigvideo_videos = [
      <?php
      foreach ($home_sailfishRecord['videos'] as $array){
        echo "'{$array['urlPath']}',\n";
      }
      ?>
    ];
    </script>
    <script src="/js/main.js"></script>
  </body>
</html>
