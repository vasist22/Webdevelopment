<?php 

//include '/db.php';
require_once('db.php');

if(count($_POST)>0){

        $idweather = $_POST['idweather'];
		$date=$_POST['date'];
	


        $sql = "SELECT * FROM weather WHERE idweather=$idweather";
        
        $html = '<div>'.$sql['humidity'].'</div>';

		if (!empty($sql)){
            echo json_encode(array('message'=>$html));
        } else {
            echo json_encode(array('message'=>__('Erfolglos!')));
        }
		mysqli_close($dbconn);
	
	}



?>