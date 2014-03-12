var selectControl, selectedFeature, map1,attribute, draw,wfs_correction_layer,modify,map1extent;
var WGS84 = new OpenLayers.Projection("EPSG:4326");
var TMS = new OpenLayers.Projection("EPSG:900913");

function showMsg(szMessage) {
    document.getElementById("nodelist").innerHTML = szMessage;
    setTimeout("document.getElementById('nodelist').innerHTML = ''",3000);
}
function showSuccessMsg(){
    showMsg("<img src='img/Save-icon.png'> Saved.");
};
function showFailureMsg(){alert('Problems in data transaction occured. Please tell this to the system administrator.')};
var saveStrategy = new OpenLayers.Strategy.Save();
saveStrategy.events.register("success", '', showSuccessMsg);
saveStrategy.events.register("failure", '', showFailureMsg);
saveStrategy.auto = true;

var refreshStrategy = new OpenLayers.Strategy.Refresh();

function zoomToDefault(){
	map1.zoomToExtent(map1extent);
}

function attributeStr(feature){
    str = '<tr><td id="vi">Validation status - Location is:<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value=""'
    if(feature.attributes.validation == null || feature.attributes.validation == '' ||  feature.attributes.validation == 'NULL' ){
	str += ' selected></option><option value="correct">correct</option><option value="incorrect">NOT correct';
    }else if(feature.attributes.validation == 'correct') {
	str += '></option><option value="correct" selected>correct</option><option value="incorrect">NOT correct';
    }else if(feature.attributes.validation == 'incorrect') {
	str += '></option><option value="correct">correct</option><option value="incorrect" selected>NOT correct';
    }else {
	str += '></option><option value="correct">correct</option><option value="incorrect">NOT correct</option><option value="undefined" selected>undefined';
    }
    document.getElementById("vi").innerHTML = str + '</option></select></td></tr>';
}
function onFeatureSelect(feature) {
    selectedFeature = feature;
    if(feature.attributes.correction_text == null || feature.attributes.correction_text == '' ||  feature.attributes.correction_text == 'NULL'){
	correction_text = '';
    }else{
	correction_text = feature.attributes.correction_text;
    }
    document.getElementById("project_id").innerHTML = "Project No.: " + feature.attributes.project_id;
    document.getElementById("project_title").innerHTML = "Project Name: " + feature.attributes.title;
    document.getElementById("country").innerHTML = "Country: " + feature.attributes.country;
    document.getElementById("approval_nos").innerHTML = "Approval No.: " + feature.attributes.approval_nos;
    if(feature.attributes.adm1_name == null){
	document.getElementById("adm1").innerHTML = "Adm1: ";
    }else{
	document.getElementById("adm1").innerHTML = "Adm1: " + feature.attributes.adm1_name;
    }
    if(feature.attributes.adm2_name == null){
	document.getElementById("adm2").innerHTML = "Adm2: " ;
    }else{
	document.getElementById("adm2").innerHTML = "Adm2: " + feature.attributes.adm2_name;
    }
    attributeStr(feature);
    if(feature.attributes.validation == 'incorrect') {
	document.getElementById("correction").innerHTML = '<tr><td id="correction">If the location is not correct, please provide the correction information in the box below:<br><div id="correction_text"><textarea name="correction_text" rows="4" cols="40" style="width:100%" onChange="updateCorrectionText(attribute,this.value);" onKeyUp="onBlurCorrectionText(this.value);">'+correction_text+'</textarea></div>Optional: Correct location on the map.<div id="correction_map"><input type="button" value="Correct by Map" onClick="drawFeatureOn();"><input type="button" value="Reset location" onClick="resetLocation();"></div><input type="button" value="Send" onClick="selectControl.unselect(selectedFeature);"></td></tr>';
    }
}

function onBlurCorrectionText(text){
    selectedFeature.attributes.correction_text = text;
    //feature.state = OpenLayers.State.UPDATE;
    //saveStrategy.save();
}

function onFeatureUnselect(feature) {
    if(feature.attributes.validation == 'incorrect'	
       && (feature.attributes.correction_text == ''
	   || feature.attributes.correction_text == null
	   || feature.attributes.correction_text == 'NULL')) {

	alert("Please provide correction information to the text box.");
	feature.attributes.validation = '';
	feature.state = OpenLayers.State.UPDATE;
	saveStrategy.save();
	selectControl.unselect(feature);
	document.getElementById("correction").innerHTML = '<tr><td id="correction"></td></tr>';
    }else{
	document.getElementById("project_id").innerHTML = "Project No.: ";
	document.getElementById("project_title").innerHTML = "Project Name: ";
	document.getElementById("country").innerHTML = "Country: ";
	document.getElementById("approval_nos").innerHTML = "Approval No.: ";
	document.getElementById("adm1").innerHTML = "Adm1: ";
	document.getElementById("adm2").innerHTML = "Adm2: ";
	document.getElementById("vi").innerHTML = '<tr id="vi"><td>Validation status - <br> Please click a symbol of location on the map.</td></tr>';
	document.getElementById("correction").innerHTML = '<td id="correction"></td>';
    }
}
function updateAttributes(attribute,value,text){
    selectedFeature.attributes.validation = value;
    if(value == 'incorrect') {
	document.getElementById("correction").innerHTML = '<tr id="correction"><td>*If the location is not correct, please provide the correction information in the box below:<br><div id="correction_text"><textarea name="correction_text" rows="4" cols="40" style="width:100%" onChange="updateCorrectionText(attribute,this.value);" onKeyUp="onBlurCorrectionText(this.value);"></textarea></div>Optional: Correct location on the map.<div id="correction_map"><input type="button" value="Correct by Map" onClick="drawFeatureOn();"><input type="button" value="Reset location" onClick="resetLocation();"></div><br><input type="button" value="Send" onClick="selectControl.unselect(selectedFeature);"></td></tr>';
    }else{
	document.getElementById("correction").innerHTML = '<tr id="correction"></tr>';
    }
    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
    selectControl.select(selectedFeature);
};
function updateCorrectionText(attribute,text){
    selectedFeature.attributes.correction_text = text;

    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
};

function drawFeatureOn(){
    if (selectedFeature.attributes.correction_text == ''
	|| selectedFeature.attributes.correction_text == null
	|| selectedFeature.attributes.correction_text == 'NULL') {
	alert("Please provide correction information to the text box.");
	selectedFeature.attributes.validation = '';
	selectedFeature.state = OpenLayers.State.UPDATE;
	saveStrategy.save();
	selectControl.unselect(selectedFeature);
	document.getElementById("correction").innerHTML = '<tr id="correction"></tr>';
    }else{
	modify.feature = selectedFeature;
	modify.activate();
	document.getElementById("correction_map").innerHTML = '<input type="button" value="Finish Correction" onClick="drawFeatureOff();"><input type="button" value="Reset location" onClick="resetLocation();">';
    }
}

function drawFeatureOff(){
    modify.deactivate();
    document.getElementById("correction_map").innerHTML = '<input type="button" value="Correct by Map" onClick="drawFeatureOn();"><input type="button" value="Reset location" onClick="resetLocation();">';
    selectControl.unselect(selectedFeature);
}

function resetLocation(){
	var point_wgs84 = new OpenLayers.Geometry.Point();

	point_wgs84.x = selectedFeature.attributes.longitude;
	point_wgs84.y = selectedFeature.attributes.latitude;
	point_tms = point_wgs84.transform(WGS84,TMS);
	selectedFeature.geometry.x = point_tms.x;
	selectedFeature.geometry.y = point_tms.y;
	selectedFeature.state = OpenLayers.State.UPDATE;
	saveStrategy.save();
    selectControl.unselect(selectedFeature);
}

function init(lonmin,latmin,lonmax,latmax,pid,WFSHOST) {
    extlonmin = lonmin;
    extlatmin = latmin;
    extlonmax = lonmax;
    extlatmax = latmax;
    map1extent = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax).transform(WGS84,TMS);
    //var map1extent = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax);
    var mapextent_wgs84 = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax);
    var map1Opts = {
	displayProjection: WGS84
	,projection: TMS
	,units: 'm'
	,numZoomLevels: 20
	,maxExtent: map1extent
	,controls:[
	    new OpenLayers.Control.Navigation()
	    ,new OpenLayers.Control.PanZoom()
	    ,new OpenLayers.Control.MousePosition()
	    ,new OpenLayers.Control.KeyboardDefaults() 
	    ,new OpenLayers.Control.Scale()
	    ,new OpenLayers.Control.LayerSwitcher()
	]
	,eventListeners: {
	}
    };
    map1 = new OpenLayers.Map('map1',map1Opts);
    
    var StyleMapOpt  ={
	"default": style
	, select: selected
    };
    var wfs_correction_layer = new OpenLayers.Layer.Vector(
	"Corrected location"
	,{
	    strategies: [
		new OpenLayers.Strategy.BBOX()
		,saveStrategy
		,refreshStrategy
	    ]
	    ,styleMap: new OpenLayers.StyleMap(StyleMapOpt)
	    ,protocol: new OpenLayers.Protocol.WFS(
		{
		    version: "1.1.0",
		    srsName: "EPSG:900913",
		    //		    srsName: "EPSG:4326",
		    url: "http://"+WFSHOST+"/geoserver/wfs",	
		    featureNS :  "http://www.opengeospatial.net/cite",
		    maxExtent: mapextent_wgs84,
		    featureType: "adbprojects",
		    geometryName: "the_geom",
		    schema: "http://"+WFSHOST+"/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=cite:adbprojects"
		})
	    ,eventListeners: {
		"loadstart": function(){
		    document.getElementById("nodelist").innerHTML = "<img src='img/loader.gif'> Loading ...";
		},
		"loadend": function(){
		    document.getElementById("nodelist").innerHTML = "<img src='img/Check-icon.png'> Completed.";
		    setTimeout("document.getElementById('nodelist').innerHTML = ''",5000);
		}
	    }
	    ,filter: new OpenLayers.Filter.Logical(
		{type: OpenLayers.Filter.Logical.AND,
		 filters: [
		     new OpenLayers.Filter.Comparison(
			 {type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "project_id",
			  value: pid
			 })
		 ]
		}
	    )
	}
    );
    
    wfs_correction_layer.events.on(
	{
	    "afterfeaturemodified": function(event){
		drawFeatureOff();	    
	    },
	    "beforefeatureadded": function(event){
		feature = event.feature;
		if (feature.attributes.validation == null)
		    feature.attributes.validation = 'NULL';
	    }
	});

    draw = new OpenLayers.Control.DrawFeature(
	wfs_correction_layer
	,OpenLayers.Handler.Point
    );

    modify = new OpenLayers.Control.ModifyFeature(
	wfs_correction_layer
    );
    
    map1.addLayers([google_maps,google_satellite,google_hybrid,osm,bing_road,bing_aerial,bing_hybrid,wfs_correction_layer]);
    //map1.addLayers([wms,wfs_correction_layer]);
    map1.zoomToExtent(map1extent);

    selectControl = new OpenLayers.Control.SelectFeature(
	wfs_correction_layer
	,{ onSelect: onFeatureSelect
	   ,onUnselect: onFeatureUnselect
	 }
    );
    map1.addControl(selectControl);
    map1.addControl(modify);
    selectControl.activate();
    saveStrategy.activate();
};
