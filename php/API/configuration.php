<?php
	
	$time_zone = "America/Mexico_City";

	$db_host = "localhost";
    
    $db_user = "root";
    
    $db_password = "";
    
    $db_name = "cocinasketapa1";

    /*$db_host = "us-cdbr-azure-southcentral-f.cloudapp.net";
    
    $db_user = "b337199bb09b0a";
    
    $db_password = "2eb5773c";
    
    $db_name = "sistemaintegralcocinask";*/

    $key = "2016.C0c1N4sK.S1st3M4InT3gR4lCk";
    $token_expiration_time = '+1 hour';
    $session_expiration_time = '+35 minute';

    

    function getConnection() 
    {

        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
    
        $dbh = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES  \'UTF8\''));
        
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    
    }
    
?>
