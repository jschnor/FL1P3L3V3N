<?php  ### String Validation Functions

//
function startsWith($needle, $haystack) {
    $mb_length = mb_strlen($needle); // v2.50 - switch to mb_ functions for length and substr
    return (mb_substr($haystack, 0, $mb_length) === $needle);
}

//
function endsWith($needle, $haystack) {
    $mb_length = mb_strlen($needle); // v2.50 - switch to mb_ functions for length and substr
    $start     = $mb_length * -1; // negative
    return (mb_substr($haystack, $start) === $needle);
}

//
function contains($needle, $haystack) { // v2.50 added function
  $found = (mb_strpos($haystack, $needle) !== false);
  return $found;
}


// Description : Check a var against some validation rule and return any error messages.
// Usage       : $errors = getValidationErrors($fieldLabel, $fieldValue, $validationRules);
// Usage       : $errors = getValidationErrors($fieldLabel, $fieldValue, 'minLength(123) maxLength(323)');
/*
  // modifier rules - these rules can be added before other rules to allow additional values
  allowBlank          - enter before other rules to allow blank, "allowBlank minLength(3)" allows blank strings or string longer than 3 chars

  // string validation rules
  notBlank            - string must be 1 or more chars in length, doesn't support boolean not
  minLength(x)        - string must be at least n chars long, doesn't support boolean not
  maxLength(x)        - string must be no more than n chars long, doesn't support boolean not
  startsWith(string)  - string must start with string, or !startsWith for must not start with
  endsWith(string)    - string must end with string, or !endsWith for must not end with
  contains(string)    - string must contain string, or !contains for not contain
  oneOf(val1,val2)    - string must be one of the predefined CSV values

  // pattern validation rules
  validEmail          - string must one valid email
  validEmails         - string must be one or more valid emails

  // numeric validation rules
  minNumber(x)        - number must be n or greater, doesn't support boolean not
  maxNumber(x)        - number must be n or less, doesn't support boolean not
  int                 - number string can only contain 0-9 with optional leading -, doesn't support boolean not
  positiveInt         - number string can only contain 0-9, doesn't support boolean not

  // file/dir validation rules
  pathExists          - file or dir must exist
  relativePath        - path must be relative (not starting with drive:, forwards slance or UNC \\)
  absolutePath        - path must be absolute (starting with drive:, forwards slance or UNC \\)

  // Un-implemented Rules (not yet supported) - from old Perl reference library Validation.pm
  misc: validHostnameOrIP, allowUndef (rule modifier), defined, currentUser|loggedIn (check if user logged in)
  array functions: isArray, maxElements(x), hashKeysAllowed, hashKeysRequired
*/
function getValidationErrors($label, $value, $rulesString) {
  $errors = array();

  // parse rules string
  $regexp  = "(?<=^|\s)";        // zero-width lookbehind for start of string or whitespace
  $regexp .= "(\!)?";            // may or may-not countain NOT char
  $regexp .= "(\w+)";            // match rule word (eg: notBlank, minLength)
  $regexp .= "(?:\((.*?)\))?";   // match argument in braces (if braces specified)
  $regexp .= "(?=\s|$)";         // zero-width lookahead for whitespace or end of string
  preg_match_all("/$regexp/", $rulesString, $rules, PREG_SET_ORDER);

  // process rules
  foreach ($rules as $rule) {
    $matchedString = $rule[0];
    $booleanNot    = (bool) $rule[1];
    $ruleName      = strtolower($rule[2]);
    $ruleArgs      = isset($rule[3]) ? $rule[3] : '';
    //showme(array("Matched String" => $matchedString, "Boolean Not" => $booleanNot, "Rule Name" => $ruleName, "Rule Args" => $ruleArgs)); // debug

    //
    $mb_length = mb_strlen($value);



    ### Modifier Rules Rules
    //*** NOTE: Check lowercase versions of all rule names
    if ($ruleName == 'allowblank') {
      if ($value == '') { break; }  // this rule is used in addition to other rules (which may not allow blank be default)
    }

    ### String validation rules
    elseif ($ruleName == 'notblank') {
      $fail = $value == '';
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot be blank'), $label); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'minlength') {
      $fail = $mb_length < $ruleArgs;
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be at least %2$s characters! (currently %3$s characters)'), $label, $ruleArgs, $mb_length); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'maxlength') {
      $fail = $mb_length > $ruleArgs;
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot be longer than %2$s characters! (currently %3$s characters)'), $label, $ruleArgs, $mb_length); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'startsWith') {
      $fail = !startsWith($ruleArgs, $value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must start with \'%2$s\''), $label, $ruleArgs); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot start with \'%2$s\''), $label, $ruleArgs); }
    }
    elseif ($ruleName == 'endsWith') {
      $fail = !endsWith($ruleArgs, $value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must end with \'%2$s\''), $label, $ruleArgs); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot end with \'%2$s\''), $label, $ruleArgs); }
    }
    elseif ($ruleName == 'contains') {
      $fail = !contains($ruleArgs, $value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must contain \'%2$s\''), $label, $ruleArgs); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot contain \'%2$s\''), $label, $ruleArgs); }
    }
    elseif ($ruleName == 'oneof') {
      $allowedValues    = preg_split("/\s*,\s*/", $ruleArgs);
      $fail = !in_array($value, $allowedValues);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be one of the following (%2$s)!'), $label, $ruleArgs); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' cannot be one of the following (%2$s)!'), $label, $ruleArgs); }
    }


    ### Pattern validation rules
    elseif ($ruleName == 'validemail') {
      $fail = !isValidEmail($value, false);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' isn\'t a valid email address (example user@example.com)!'), $label); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'validemails') {
      $fail = !isValidEmail($value, true);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' isn\'t a valid email address (example user@example.com)!'), $label); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }


    ### Number validation rules
    elseif ($ruleName == 'minnumber') {
      $fail = $value < $ruleArgs;
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be equal or greater than %2$s!'), $label, $ruleArgs); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'maxnumber') {
      $fail = $value > $ruleArgs;
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be equal or less than %2$s!'), $label, $ruleArgs); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'int') {
      $fail = !preg_match("/^-?[0-9]+$/", $value);
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be a number (only 0-9 and negative numbers are allowed)!'), $label); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }
    elseif ($ruleName == 'positiveint') {
      $fail = !preg_match("/^[0-9]+$/", $value);
      if ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be a number (only 0-9 are allowed)!'), $label); }
      _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString);
    }

    ### file/dir validation rules
    elseif ($ruleName == 'pathexists') {
      $fail = !file_exists($value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' doesn\'t exist!'), $label); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' already exists!'), $label); }
    }
    elseif ($ruleName == 'relativepath') {
      $fail = isAbsolutePath($value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be an absolute path (starting with / or C:\\)!'), $label); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be a relative path (cannot start with / or C:\\)!'), $label); }
    }
    elseif ($ruleName == 'absolutepath') {
      $fail = !isAbsolutePath($value);
      if     ($fail && !$booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be an absolute path (starting with / or C:\\)!'), $label); }
      elseif (!$fail && $booleanNot) { $errors[] = sprintf(t('\'%1$s\' must be a relative path (cannot start with / or C:\\)!'), $label); }
    }

    ### Unknown Rules
    else {
      dieAsCaller(sprintf(t("Unknown rule '%s' specified!"), $ruleName));
    }
  }

  //
  $errorString = implode("\n", $errors);
  if ($errorString) { $errorString .= "\n"; }
  return $errorString;
}

// _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot);
function _dieAsCaller_onUnsupportedBooleanNot($ruleName, $booleanNot, $rulesString) {
  if ($booleanNot) {
    $error = sprintf(t("%1\$s doesn't support boolean not (!) in rule string '%2\$s'."), $ruleName, $rulesString);
    dieAsCaller($error, 2);
  }
}


// valid single emails: user@example.com
// valid single emails: "Display Name" <user@example.com>
// valid multiple emails: same as above but separated by , or ;
// v2.16 - Now returns an array of valid email components on success instead of true
// v2.16 - Single quote ' now accepted in local-part of email address
function isValidEmail($input, $allowMultiple = false) {

  // Email formats described here: http://en.wikipedia.org/wiki/Email_address
  // John Smith <john.smith@example.org>.
  // "Display Name" <local-part@domain>

  // parse out emails
  $emails = array();
  static $VALID_EMAIL_REGEXP = '(?:[\w\-]+[\w\-\.\+\'])*[\w\-]+@(?:[\w\-]+[\w\-.])*[\w\-]+\.[A-Za-z]{2,8}';
  while (preg_match("/\A()($VALID_EMAIL_REGEXP)[,; ]*/", $input, $matches) ||
         preg_match("/\A([^<]*) <($VALID_EMAIL_REGEXP)>[,; ]*/", $input, $matches)) {
    list($matchedString, $displayName, $email) = $matches;
    $input = substr_replace($input, '', 0, strlen($matchedString)); // remove matched content
    $emails[] = array($email, $displayName, $matchedString);
  }

  // check for errors
  if (!$emails)                              { return false; } // No valid emails or empty string is invalid
  if ($input != '')                          { return false; } // remaining content means input has invalid email
  if (!$allowMultiple && count($emails) > 1) { return false; }

  //
  return $emails;
}


?>