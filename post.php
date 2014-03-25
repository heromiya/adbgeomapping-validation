<?php
include '../.var.php';
/*
require_once 'MDB2.php';
$db = MDB2::connect('pgsql://heromiya@'.$DBHOST.'/adbgeomapping?charset=utf8');
if(PEAR::isError($db)) {
    print('There is an error with connection to the database. Please contact with administrator.');
	echo $db->getDebugInfo();
}
*/

$db = pg_connect("host=".$DBHOST." dbname=adbgeomapping user=heromiya");
if (!$db) {
    die('DB fail '.pg_last_error());
}

$pid=$_POST['pid'];
$userpost=$_POST['missing_location'];

/*
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
*/
$stm = sprintf("INSERT INTO adbprojects_missing_location
					(project_id, remarks) VALUES ('%s', '%s');"
                    ,$pid,$userpost);
pg_query( $stm );


?>

<html>
  <head>
  	<link rel="stylesheet" href="style.css" type="text/css">
	<title>Thank you!</title>
	</head>
  <body onLoad="alert('Thanks for your cooperation. You can come back to complete or correct your validation.'); window.opener ='myself';
 window.close();">
<h2>You can close this window.</h2>
  </body>
</html>