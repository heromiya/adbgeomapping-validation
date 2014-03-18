<?php
include '../.var.php';
require_once 'MDB2.php';
$db = MDB2::connect('pgsql://heromiya@'.$DBHOST.'/adbgeomapping?charset=utf8');
if(PEAR::isError($db)) {
    print('There is an error with connection to the database. Please contact with administrator.');
	echo $db->getDebugInfo();
}
$pid=$_POST['pid'];
$userpost=$_POST['missing_location'];

$stm = $db->prepare("INSERT INTO adbprojects_missing_location
					(project_id, remarks) VALUES (?, ?);"
		    ,array('text','text')
		    ,MDB2_PREPARE_MANIP
		    );

if (PEAR::isError($stm)){
echo $stm->getDebugInfo();
exit();
}
$stm->execute(array($pid,$userpost));

?>

<html>
  <head>
  	<link rel="stylesheet" href="style.css" type="text/css">
	<title>Thank you!</title>
	</head>
  <body onLoad="setTimeout('window.close();', 5000)">
  Thank you very much for your cooperation. Your feedback have been sent.
</body>
</html>