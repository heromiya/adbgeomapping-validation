<?php
require_once 'MDB2.php';
$DBHOST="localhost";
$WEBHOST="guam.csis.u-tokyo.ac.jp";
$db = MDB2::connect('pgsql://heromiya@'.$DBHOST.'/adbgeomapping?charset=utf8');
if(PEAR::isError($db)) {
    print('There is an error with connection to the database. Please contact with administrator.');
}
$lonmin=$_GET['lonmin'];
$lonmax=$_GET['lonmax'];
$latmin=$_GET['latmin'];
$latmax=$_GET['latmax'];
$proj1=NULL;
$qid=NULL;
if(isset($_GET['zlatmin'])) $zlatmin=$_GET['zlatmin'];
if(isset($_GET['zlonmin'])) $zlonmin=$_GET['zlonmin'];
if(isset($_GET['zlatmax'])) $zlatmax=$_GET['zlatmax'];
if(isset($_GET['zlonmax'])) $zlonmax=$_GET['zlonmax'];
if(isset($_GET['qid'])) $qid=$_GET['qid'];
if(isset($scale)) {
	$scale=$_GET['scale'];
}else{
	$scale=-9999;
}
if($zlatmin==NULL) $zlatmin=-9999;
if($zlonmin==NULL) $zlonmin=-9999;
if($zlatmax==NULL) $zlatmax=-9999;
if($zlonmax==NULL) $zlonmax=-9999;
if(isset($_GET['proj1'])) $proj1=$_GET['proj1'];
if($proj1==NULL) $proj1 = "WGS84";

?>
<html>
<head>
<script type="text/javascript" src="../OpenLayers-2.12/lib/OpenLayers.js"></script> 
    <script type="text/javascript" src="../OpenLayers-2.12/lib/deprecated.js"></script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="proj4js/lib/proj4js-compressed.js"></script>
    <script type="text/javascript" src="maplayers.js"></script>
    <script type="text/javascript" src="openlayers.style.js"></script>
    <script type="text/javascript" src="map.js"></script>
    <title>ADB GeoMapping - Validation</title>
</head>
<body onload="init(<?php printf('%lf,%lf,%lf,%lf',$lonmin,$latmin,$lonmax,$latmax)?>)">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" >
    <tr height="100%">
    <td width="50%" id="col1">
    <div id="map1" style="height: 100%; background-color: #808080" unselectable = "on" user-select: none;></div>
    </td>
    </tr>
    </table>
    </body>
    </html>
