<?php
/**
 * Creates a PDF document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Flipeleven Sell Sheet
 * @author Flipeleven
 * @since 2014/07/23
 */

// Process form submission
if ($_SERVER['REQUEST_METHOD'] != 'POST' || !$_POST['generate']) {
	header("Location: /sell-sheet");
	exit();
}

// check for uploaded client logo
if ($_FILES["logo_upload"]["error"] === 0) {
	// save client logo to logos folder
	$filename = $_FILES["logo_upload"]["name"];
	$temp_loc = $_FILES["logo_upload"]["tmp_name"];

	// get file extension and rename for uniqueness
	$split = explode('.', $filename);
	$ext = array_pop($split);
	$now = time();
	$filename = implode('.', $split).$now.'.'.$ext;

	$client_logo_path = $_SERVER['DOCUMENT_ROOT'].'sellsheets/client-logos/'.$filename;
	move_uploaded_file($temp_loc, $client_logo_path);
}

// include TCPDF and its settings
require_once($_SERVER['DOCUMENT_ROOT'] . 'sellsheets/tcpdf_include.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Justin Schnor');
$pdf->SetTitle('Sell Sheet Template');
$pdf->SetSubject('Sell Sheet');
$pdf->SetKeywords('Flipeleven, PDF, Services, Sell Sheet');

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// remove default header
$pdf->setPrintHeader(false);

// set up some global values
$pageheight = $pdf->getPageHeight();
$pagewidth = $pdf->getPageWidth();

// utility functions

// convert millimeters to inches
function mm2in($mm){
	return $mm*0.0393701;
}

// convert millimeters to pixels
function mm2px($mm){
	return $mm*6.6838;
}

// convert pixels to millimeters
function px2mm($px){
	return $px/6.6838;
}

// convert inches to millimeters
function in2mm($in){
	return $in/0.0393701;
}

// colors
$blue = '#199bff';
$bluergb = array(25,155,255);
$dkgrey = '#222222';
$dkgreyrgb = array(34,34,34);
$white = "#ffffff";
$whitergb = array(255,255,255);

// Left, Top, Right
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// Add first page
$pdf->AddPage();

// remove additional vertical space inside text cells
$pdf->SetCellPadding(0);

// set the starting point for the page content
$pdf->setPageMark();

// convert TTF font to TCPDF format and store it on the fonts folder
// $plutosansbold = $pdf->addTTFfont($_SERVER['DOCUMENT_ROOT'] . '/assets/fonts/hvd_fonts_-_plutosansbold-webfont.ttf', 'TrueTypeUnicode', '', 96);
// $plutosanscondbold = $pdf->addTTFfont($_SERVER['DOCUMENT_ROOT'] . '/assets/fonts/hvd_fonts_-_plutosanscondbold-webfont.ttf', 'TrueTypeUnicode', '', 96);
// $plutosansregular = $pdf->addTTFfont($_SERVER['DOCUMENT_ROOT'] . '/assets/fonts/hvd_fonts_-_plutosansregular-webfont.ttf', 'TrueTypeUnicode', '', 96);
// $plutosanscondregular = $pdf->addTTFfont($_SERVER['DOCUMENT_ROOT'] . '/assets/fonts/hvd_fonts_-_plutosanscondregular-webfont.ttf', 'TrueTypeUnicode', '', 96);

// left column background
$pdf->Rect(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, 2.25, ($pageheight - (PDF_MARGIN_TOP + PDF_MARGIN_BOTTOM)), 'F', array(), $bluergb);

// Flipeleven Logo
// 175x84
$img_file = $_SERVER['DOCUMENT_ROOT'] . 'assets/images/flipeleven_logo_white.png';
$img_w = mm2in(px2mm(175));
$img_h = mm2in(px2mm(84));
$img_x = PDF_MARGIN_LEFT + ((2.25 - $img_w)/2);
$pdf->Image($img_file, $img_x, 0.75, $img_w, $img_h);

// Flipeleven Contact Info
$contact = <<<EOF
710 N. Plankinton Ave. Ste. 300<br />
Milwaukee, WI 53203<br />
(414) 272-3547
EOF;

$pdf->SetFontSize(8);
$pdf->SetTextColor($whitergb[0], $whitergb[1], $whitergb[2]);
$pdf->writeHTMLCell(2.25, 0, PDF_MARGIN_LEFT, (0.75 + $img_h + 0.125), $contact, 0, 1, false, true, 'C');

// Personal Contact Info


// Client Logo
if (isset($client_logo_path)){
	// get dimensions of logo image and calculate scaling
	$imgsize = getimagesize($client_logo_path);
	$img_w = mm2in(px2mm($imgsize[0]));
	$img_h = mm2in(px2mm($imgsize[1]));
	$img_x = PDF_MARGIN_LEFT + 2.25;
	$pdf->Image($client_logo_path, $img_x, 0.75, $img_w, $img_h);
}

$y = $pdf->GetY();

// test block
$pdf->Rect(PDF_MARGIN_LEFT, $y, ($pagewidth - (PDF_MARGIN_LEFT + PDF_MARGIN_RIGHT)), mm2in(0.25), 'F', array(), array(255, 0, 0));

// Service Blocks
function serviceBlocks(){
	$html = '';

	// do stuff, foreach

	return $html;
}

// ---------------------------------------------------------------------
// Close and output PDF document
// I = output straight to browser
// D = force download
$pdf->Output('sell-sheet.pdf', 'I');
// ---------------------------------------------------------------------

exit();