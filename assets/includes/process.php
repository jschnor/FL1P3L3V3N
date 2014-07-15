<?php
	ini_set('display_errors', '0');     # don't show any errors...
	error_reporting(E_ALL | E_STRICT);  # ...but do log them	
	include("class.phpmailer.php");
	if (get_magic_quotes_gpc()) {
	    function stripslashes_gpc(&$value)
	    {
	        $value = stripslashes($value);
	    }
	    array_walk_recursive($_GET, 'stripslashes_gpc');
	    array_walk_recursive($_POST, 'stripslashes_gpc');
	    array_walk_recursive($_COOKIE, 'stripslashes_gpc');
	    array_walk_recursive($_REQUEST, 'stripslashes_gpc');
	}

	$errors = array();
	$result = array(
		"status"=>"",
		"messages"=>null
	);
	$senderName = isset( $_POST['fullnamefield'] ) ? trim($_POST['fullnamefield']) : "";
	$senderEmail = isset( $_POST['emailfield'] ) ? filter_var(trim($_POST['emailfield']), FILTER_SANITIZE_EMAIL) : "";
	$confirmEmail = isset( $_POST['confirmemailfield'] ) ? filter_var(trim($_POST['confirmemailfield']), FILTER_SANITIZE_EMAIL) : "";
	$message = isset( $_POST['commentsfield'] ) ? trim($_POST['commentsfield']) : "";	
	
	if($senderName === ""){
		array_push($errors,array(
			"field"=>"fullnamefield",
			"message"=>""
			)
		);	
	}
	if(!PHPMailer::ValidateAddress($senderEmail)){
		array_push($errors,array(
			"field"=>"emailfield",
			"message"=>"Please enter a valid e-mail address."
			)
		);
	}
	if(!PHPMailer::ValidateAddress($confirmEmail)){
		array_push($errors,array(
			"field"=>"confirmemailfield",
			"message"=>"Please enter a valid e-mail address."
			)
		);
	}
	if( (PHPMailer::ValidateAddress($confirmEmail) && PHPMailer::ValidateAddress($senderEmail)) && ($confirmEmail != $senderEmail) ){
		array_push($errors,array(
			"field"=>"emails",
			"fieldnames"=>array("emailfield","confirmemailfield"),
			"message"=>"E-Mail addresses must match."
			)
		);		
	}
	if($message === ""){
		array_push($errors,array(
			"field"=>"commentsfield",
			"message"=>""
			)
		);
	}
	if(count($errors) > 0){
		$result["status"] = "field-error";
		$result["messages"] = $errors;
		echo json_encode($result);
		die;
	}else{
		/*email functionality - "from" email address set up in rackspace*/
		require_once "Mail.php";
		$from = "Flipeleven Info <info@flipeleven.com>";
		$to = "Flipeleven Info <justin@flipeleven.com>";
		$subject = "Flipeleven Contact from ".$senderName;
		$body = "Name: ".$senderName."\nEmail: ".$senderEmail."\nComment: " .$message;
		$supportUserName = "info@flipeleven.com";
		$supportPassword = "Flipflip11";
		$username = $supportUserName;
		$password = $supportPassword;
		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$headers = array (
			'From' => $from,
			'To' => $to,
			'Subject' => $subject
		);
  		$smtp = Mail::factory(
  			'smtp',
			array(
				'host' => $host,
				'port' => $port,
				'auth' => true,
				'username' => $username,
				'password' => $password
			)
		);
		$mail = $smtp->send($to, $headers, $body);
		if(PEAR::isError($mail)){
			array_push($errors,array(
				"field"=>"",
				"message"=>"There was an error sending your message. Please try again later."
				)
			);
			$result["status"] = "error";
			$result["messages"] = $errors;
			error_log($mail->getMessage());
			echo json_encode($result);
			die;
		}else{
			array_push($errors,array(
				"field"=>"",
				"message"=>"Your message has been sent. We will be in contact with you soon about your request."
				)
			);
			$result["status"] = "success";
			$result["messages"] = $errors;
			echo json_encode($result);
			die;
		}		
			
	}
?>
