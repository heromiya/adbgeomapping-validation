<?php
require_once 'MDB2.php';
$DBHOST="localhost";
$WEBHOST="guam.csis.u-tokyo.ac.jp";
$db = MDB2::connect('pgsql://heromiya@'.$DBHOST.'/adbgeomapping?charset=utf8');
if(PEAR::isError($db)) {
    print('There is an error with connection to the database. Please contact with administrator.');
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
                     FROM allworldbank_ibrdida
                     WHERE project_id = ?;"
		    ,array('text')
		    ,array('float','float','float','float')
		    );
$result = $stm->execute($pid);

while ($row = $result->fetchRow()) {
$lonmax=$row[0];
$lonmin=$row[1];
$latmax=$row[2];
$latmin=$row[3];

}


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
  <body onload="init(<?php printf('%lf,%lf,%lf,%lf,\'%s\'',$lonmin,$latmin,$lonmax,$latmax,$pid)?>)">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" >
      <tr height="20px">
	<td align="center" class="item"><div id="nodelist"></div></td>
	<td rowspan="2" width="250px">
	  <table border="1" width="100%">
	    <tr><td><div id="project_id">Project ID:</div></td></tr>
	    <tr><td><div id="project_title">Project Title:</div></td></tr>
	    <tr><td><div id="country">Country:</div></td></tr>
	    <tr><td><div id="adm1">Adm1:</div></td></tr>
	    <tr><td><div id="adm2">Adm2:</div></td></tr>
	    <tr><td><div id="results">Results:</div></td></tr>
	    <form name="validation">
	      <tr id="vi"><td>The location is <select name="correct" onChange="updateAttributes(attribute,document.validation.correct.value);">
		    <option value=""></option>
		    <option value="correct">correct</option>
		    <option value="incorrect">NOT correct</option>
	      </select></td></tr>
	      <tr><td>If the location is not correct, please advise correct location by map or text.<textarea name="correction_text" rows="4" cols="40">Please input here.</textarea></td></tr>
	    </form>
	  </table>
	</td>
      </tr>
      <tr height="100%">
	<td id="col1">
	  <div id="map1" style="height: 100%; background-color: #808080" unselectable = "on" user-select: none;></div>
	</td>
      </tr>
    </table>
  </body>
</html>
