<?php

$uploaddir = '../uploads/';
$file = basename($_FILES['file']['name']);
$fileType = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$uploadfile = $uploaddir . getGUID() . '.' . $fileType;

if($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg" && $fileType != "gif" ) {
  header('HTTP/1.1 400 Bad Request');
  header('Content-Type: application/json');
  echo '{"error": "Only JPG, JPEG, PNG, and GIF files are allowed."}';
  return;
}

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
  header('Location: ' . $uploadfile);
  header('HTTP/1.1 201 Created', 201);
} else {
  echo "Possible file upload attack!";
}

function getGUID(){
  if (function_exists('com_create_guid')){
      return com_create_guid();
  }else{
      mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
      $charid = strtoupper(md5(uniqid(rand(), true)));
      $hyphen = chr(45);// "-"
      $uuid = substr($charid, 0, 8).$hyphen
          .substr($charid, 8, 4).$hyphen
          .substr($charid,12, 4).$hyphen
          .substr($charid,16, 4).$hyphen
          .substr($charid,20,12);
      return $uuid;
  }
}

?>
