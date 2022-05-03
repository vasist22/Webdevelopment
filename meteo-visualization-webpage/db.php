<?php 

$dbhost = "127.0.0.1";
$dbuser = "root";
$dbpaswd = "Vikram1234";
$db = "sys";

$dbconn = new mysqli($dbhost, $dbuser, $dbpaswd, $db);
if ($dbconn->connect_error) {
    die("Connection failed: " . $dbconn->connect_error);
  } 



?>
