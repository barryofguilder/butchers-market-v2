<?php

if (session_id() == '') {
  session_start();
}

require_once "recaptcha/recaptchalib.php";
// Contains variable of 'secret' that holds the secret key
require_once "recaptcha/secret_key.php";

// Register reCaptcha API keys at https://www.google.com/recaptcha/admin
$siteKey = "6LcrHAITAAAAACvTiT4qS4dvbwL7wgGRXhJtsKim";

// Email address where the message should be delivered
$emailTo = 'drew@thebutchersmarket.com';

// From email address, in case your server prohibits sending emails from addresses other than those of your
// own domain (e.g. email@yourdomain.com). If this is used then all email messages from your contact form will appear
// from this address instead of actual sender. */
$from = '';

// This will be the subject of the contact form message
$subject = 'Butcher Contact';

$errorResponse = array();

$data = json_decode(file_get_contents('php://input'));

// set json string to php variables
$name = clean_var($data->{"name"});
$email = clean_var($data->{"email"});
$message = clean_var($data->{"message"});
$recaptchaData = $data->{"recaptcha"};

if (empty($name)) {
  $errorResponse['name'] = 'empty';
}

if (empty($email)) {
  $errorResponse['email'] = 'empty';
} else if (!validEmail($email)) {
  $errorResponse['email'] = 'invalid';
}

if (empty($message)) {
  $errorResponse['message'] = 'empty';
}

// Only validate the recaptcha input if all other fields are valid
if (count($errorResponse) == 0) {
  $recaptchaResult = validRecaptcha($recaptchaData, $secret);

  if (!$recaptchaResult) {
    $errorResponse['recaptcha'] = 'invalid';
  }
}

if (count($errorResponse) > 0) {
  header('HTTP/1.1 400 Bad Request', true, 400);
  echo json_encode($errorResponse);

  return;
} else {
  $body = "Name: $name\r\n\r\n";
  $body .= "Email Address: $email\r\n\r\n";
  $body .= "Message:\r\n$message\r\n\r\n";

  if (!$from) {
    $from_value = $email;
  } else {
    $from_value = $from;
  }

  $headers = "From: $from_value" . "\r\n";
  $headers .= "Reply-To: $email" . "\r\n";

  mail($emailTo,"$subject", $body, $headers);

  $arr = array();
  echo json_encode($arr);

  session_unset();
  session_destroy();
}

function validRecaptcha($recaptchaData, $secret) {
  // reCAPTCHA supported 40+ languages listed here: https://developers.google.com/recaptcha/docs/language
  $lang = "en";

  // The response from reCAPTCHA
  $resp = null;

  // The error code from reCAPTCHA, if any
  $error = null;

  $reCaptcha = new ReCaptcha($secret);

  // Was there a reCAPTCHA response?
  if ($recaptchaData) {
    $resp = $reCaptcha->verifyResponse(
      $_SERVER["REMOTE_ADDR"],
      $recaptchaData
    );
  }

  if ($resp != null && $resp->success) {
    return true;
  }

  return false;
}

function clean_var($variable) {
  return strip_tags(stripslashes(trim(rtrim($variable))));
}

/**
Email validation function. Thanks to http://www.linuxjournal.com/article/9585
*/
function validEmail($email)
{
  $isValid = true;
  $atIndex = strrpos($email, "@");

  if (is_bool($atIndex) && !$atIndex)
  {
    $isValid = false;
  }
  else
  {
    $domain = substr($email, $atIndex+1);
    $local = substr($email, 0, $atIndex);
    $localLen = strlen($local);
    $domainLen = strlen($domain);

    if ($localLen < 1 || $localLen > 64)
    {
      // local part length exceeded
      $isValid = false;
    }
    else if ($domainLen < 1 || $domainLen > 255)
    {
      // domain part length exceeded
      $isValid = false;
    }
    else if ($local[0] == '.' || $local[$localLen-1] == '.')
    {
      // local part starts or ends with '.'
      $isValid = false;
    }
    else if (preg_match('/\\.\\./', $local))
    {
      // local part has two consecutive dots
      $isValid = false;
    }
    else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain))
    {
      // character not valid in domain part
      $isValid = false;
    }
    else if (preg_match('/\\.\\./', $domain))
    {
      // domain part has two consecutive dots
      $isValid = false;
    }
    else if (!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/', str_replace("\\\\","",$local)))
    {
      // character not valid in local part unless
      // local part is quoted
      if (!preg_match('/^"(\\\\"|[^"])+"$/',
          str_replace("\\\\","",$local)))
      {
        $isValid = false;
      }
    }

    if ($isValid && function_exists('checkdnsrr'))
    {
      if (!(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A"))) {
        // domain not found in DNS
        $isValid = false;
      }
    }
  }

  return $isValid;
}

?>
