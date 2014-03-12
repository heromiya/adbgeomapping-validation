<?php
include 'var.php';
require_once 'MDB2.php';
$db = MDB2::connect('pgsql://heromiya@'.$DBHOST.'/adbgeomapping?charset=utf8');
if(PEAR::isError($db)) {
    print('There is an error with connection to the database. Please contact with administrator.');
	echo $db->getDebugInfo();
}
$proj1=NULL;
$pid=NULL;
if(isset($_GET['pid'])) $pid=$_GET['pid'];

if(isset($_GET['proj1'])) $proj1=$_GET['proj1'];
if($proj1==NULL) $proj1 = "TMS";

$stm = $db->prepare("SELECT ST_XMax(ST_Collect(the_geom))
                    , ST_XMin(ST_Collect(the_geom))
                    , ST_YMax(ST_Collect(the_geom))
                    , ST_Ymin(ST_Collect(the_geom))
                     FROM adbprojects
                     WHERE project_id = ?;"
		    ,array('text')
		    ,array('float','float','float','float')
		    );

if (PEAR::isError($stm)){
echo $stm->getDebugInfo();
exit();
}
$result = $stm->execute($pid);

if (PEAR::isError($result)){
echo $result->getDebugInfo();
exit();
}

while ($row = $result->fetchRow(DB2_FETCHMODE_ORDERED)) {
	$lonmax=$row[0];
	$lonmin=$row[1];
	$latmax=$row[2];
	$latmin=$row[3];
}
?>

<html>
  <head>
    <script type="text/javascript" src="OpenLayers-2.13.1/OpenLayers.js"></script> 
    <!--<script type="text/javascript" src="googlemapsapis.js"></script>-->
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false&language=en"></script>
    <script type="text/javascript" src="maplayers.js"></script>
    <script type="text/javascript" src="openlayers.style.js"></script>
    <script type="text/javascript" src="map.js"></script>
	<link rel="stylesheet" href="style.css" type="text/css">
    <title>GeoMapping - Validation</title>
  </head>
  <body onload="init(<?php printf('%lf,%lf,%lf,%lf,\'%s\',\'%s\'',$lonmin,$latmin,$lonmax,$latmax,$pid,$WFSHOST)?>)">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" >
      <tr height="30px">
	<td align="center" class="item" colspan="2"><div id="nodelist"></div></td></tr>
	<tr><td width="30%" valign="top">
	  <table border="1" width="100%" cellpadding="5px">
	    <tr><td><div id="project_id">Project No.:</div></td></tr>
	    <tr><td><div id="project_title">Project Name:</div></td></tr>
	    <tr><td><div id="country">Country:</div></td></tr>
		<tr><td><div id="approval_nos">Approval No.:</div></td></tr>
	    <tr><td><div id="adm1">Adm1:</div></td></tr>
	    <tr><td><div id="adm2">Adm2:</div></td></tr>
	    <form name="validation">
	      <tr id="vi"><td>Validation status - <br> Please click a symbol of location on the map.</td></tr>
		<tr id="correction">
		</tr>
	    </form>
	  </table>
	  <h4 style="margin-left: 10px;">Legend</h4>
	  <ul style="list-style-type:none;">
	  <li><img src="OpenLayers-2.13.1/img/marker.png"> Needing validation</li>
	  <li><img src="OpenLayers-2.13.1/img/marker-blue.png"> Correct</li>
	  <li><img src="OpenLayers-2.13.1/img/marker-green.png"> Not correct</li>
	  </ul>
	</td>
	<td id="col1">
	  <div id="map1" style="height: 100%; background-color: #808080" unselectable = "on" user-select: none;></div>
	</td>
      </tr>
    </table>
  </body>
</html>
