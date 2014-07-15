<?php

/*
Plugin Name: Show/Hide Dependent Fields PLUS - by Cy
Description: Allows customization of which fields appear when certain list options are selected.  Based on Show/Hide Dependant Fields 0.03 by Chris, but with more capabilities.  See code for more info.
Author: Cy Morris
Version: 0.94
Requires at least: 2.14
*/

/* !!!!!! YOU SHOULDN'T NEED TO EDIT THIS FILE !!!!!! SETTINGS ARE IN CONFIG.PHP !!!!!! REFER TO README.TXT !!!!!! */

class showHideDependentFieldsPlus {
	
	private $fields;
	private $devmode;
	private $outputted;
	private static $_instance = NULL;
	
	private function __construct() { }
	private function __clone() { }
	public static function &getInstance() {
		if(is_null(self::$_instance)) self::$_instance = new self;
		$shdfpIncluded = true;
		$fields = array(); 
		$devmode = false;
		if(is_file(__DIR__.'/config.php')) require_once __DIR__.'/config.php';
//		else _displayNotificationType('attention', 'NOTE: '.__CLASS__.' won\'t work until you create a config file!');
		self::$_instance->fields  = $fields;
		self::$_instance->devmode = @$devmode;
		return self::$_instance;
	}
	
	public function getOutput($tableName) {
		if($this->outputted || !isset($this->fields[$tableName])) return '';
		$tableStr = json_encode($this->fields[$tableName]);
		$className = __CLASS__;
		$js = $this->devmode ? 'src':'min';
		$pluginUrl = preg_replace("|[^/]+$|", "plugins/$className", str_replace(' ', '%20', @$_SERVER['SCRIPT_NAME']));
		$code = '<script type="text/javascript">'.$className.'DbObj='.$tableStr.';</script>'.
				'<script type="text/javascript" src="'."$pluginUrl/$className.$js.js".'"></script>';
		$this->outputted = true;
		return $code;
	}
	
}

function showHideDependentFieldsPlus_edit_filter() {
	global $tableName;
	$shdfp = showHideDependentFieldsPlus::getInstance();
	echo $shdfp->getOutput($tableName);
}

// register hook
addAction('edit_advancedCommands', 'showHideDependentFieldsPlus_edit_filter');

