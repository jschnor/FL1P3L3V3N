<?php


// return resized width and height
function saveResampledImageAs($targetPath, $sourcePath, $maxWidth, $maxHeight) {
  global $SETTINGS;

  // error checking
  if (!$targetPath) { die(__FUNCTION__ . ": No targetPath specified! "); }

  // create target dir
  $dir = dirname($targetPath);
  if (!file_exists($dir)) {
    mkdir_recursive($dir) || die("Error creating dir '" .htmlencode($dir). "'.  Check permissions or try creating directory manually.");
  }

  // open source image
  $sourceImage = null;
  list($sourceWidth, $sourceHeight, $imageType) = getimagesize($sourcePath);

  // get new height/width
  $widthScale   = $maxWidth / $sourceWidth;
  $heightScale  = $maxHeight / $sourceHeight;
  $scaleFactor  = min($widthScale, $heightScale, 1);  # don't scale above 1:1
  $targetHeight = ceil($sourceHeight * $scaleFactor); # round up
  $targetWidth  = ceil($sourceWidth * $scaleFactor);  # round up

  if ($scaleFactor == 1) {
    if ($sourcePath != $targetPath) {
      copy($sourcePath, $targetPath) || die(__FUNCTION__ . ": error copying image '$sourcePath' - " . @$php_errormsg);
    }
    return array($sourceWidth, $sourceHeight);
  }

  // create new image
  switch($imageType) {
    case IMAGETYPE_JPEG: $sourceImage = @imagecreatefromjpeg($sourcePath); break; // Use @ and ini_set('gd.jpeg_ignore_warning') in init.php to suppress gd invalid jpeg errors. See: http://bugs.php.net/bug.php?id=39918
    case IMAGETYPE_GIF:  $sourceImage = imagecreatefromgif($sourcePath); break;
    case IMAGETYPE_PNG:  $sourceImage = imagecreatefrompng($sourcePath); break;
    default:             die(__FUNCTION__ . ": Unknown image type for '$sourcePath'!"); break;
  }
  if (!$sourceImage) { die("Error opening image file!"); }
  $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);

  // save transparency - based on code from: http://ca3.php.net/manual/en/function.imagecolortransparent.php#80935
  if($imageType == IMAGETYPE_GIF) {
    $transparentIndex = imagecolortransparent($sourceImage);
    $transparentColor = @imagecolorsforindex($sourceImage, $transparentIndex);
    if ($transparentColor) {
      // Fix in progress: $newTransparentIndex = imagecolorallocatealpha($targetImage, $transparentColor['red'], $transparentColor['green'], $transparentColor['blue'], 127);
      $newTransparentIndex = imagecolorallocate($targetImage, $transparentColor['red'], $transparentColor['green'], $transparentColor['blue']);
      imagefill($targetImage, 0, 0, $newTransparentIndex);
      imagecolortransparent($targetImage, $newTransparentIndex);
    }
  }
  else if ($imageType == IMAGETYPE_PNG) {
    imagealphablending($targetImage, false);
    $transparentColor = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
    imagefill($targetImage, 0, 0, $transparentColor);
    imagesavealpha($targetImage, true);
  }

  // resample image
  $quality = 4; // v2.60 Speed up resizing (was 5 previously) 
  fastimagecopyresampled($targetImage, $sourceImage, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight, $quality) || die("There was an error resizing the uploaded image!");

  // save target image
  $savedFile = false;
  switch($imageType) {
    case IMAGETYPE_JPEG: $savedFile = imagejpeg($targetImage, $targetPath, $SETTINGS['advanced']['imageResizeQuality']); break;
    case IMAGETYPE_GIF:  $savedFile = imagegif($targetImage, $targetPath); break;
    case IMAGETYPE_PNG:  $savedFile = imagepng($targetImage, $targetPath); break;
    default:             die(__FUNCTION__ . ": Unknown image type for '$targetPath'!"); break;
  }
  if (!$savedFile) { die("Error saving file!"); }
  imagedestroy($sourceImage);
  imagedestroy($targetImage);

  //
  return array($targetWidth, $targetHeight);
}

// from: http://ca2.php.net/manual/en/function.imagecopyresampled.php#77679
function fastimagecopyresampled(&$dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h, $quality = 3) {
  // Plug-and-Play fastimagecopyresampled function replaces much slower imagecopyresampled.
  // Just include this function and change all "imagecopyresampled" references to "fastimagecopyresampled".
  // Typically from 30 to 60 times faster when reducing high resolution images down to thumbnail size using the default quality setting.
  // Author: Tim Eckel - Date: 09/07/07 - Version: 1.1 - Project: FreeRingers.net - Freely distributable - These comments must remain.
  //
  // Optional "quality" parameter (defaults is 3). Fractional values are allowed, for example 1.5. Must be greater than zero.
  // Between 0 and 1 = Fast, but mosaic results, closer to 0 increases the mosaic effect.
  // 1 = Up to 350 times faster. Poor results, looks very similar to imagecopyresized.
  // 2 = Up to 95 times faster.  Images appear a little sharp, some prefer this over a quality of 3.
  // 3 = Up to 60 times faster.  Will give high quality smooth results very close to imagecopyresampled, just faster.
  // 4 = Up to 25 times faster.  Almost identical to imagecopyresampled for most images.
  // 5 = No speedup. Just uses imagecopyresampled, no advantage over imagecopyresampled.

  if (empty($src_image) || empty($dst_image) || $quality <= 0) { return false; }
  if ($quality < 5 && (($dst_w * $quality) < $src_w || ($dst_h * $quality) < $src_h)) {
    $temp = imagecreatetruecolor ($dst_w * $quality + 1, $dst_h * $quality + 1);
    imagecopyresized ($temp, $src_image, 0, 0, $src_x, $src_y, $dst_w * $quality + 1, $dst_h * $quality + 1, $src_w, $src_h);
    imagecopyresampled ($dst_image, $temp, $dst_x, $dst_y, 0, 0, $dst_w, $dst_h, $dst_w * $quality, $dst_h * $quality);
    imagedestroy($temp);
  }
  else {
    imagecopyresampled($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);
  }

  return true;
}
