var selectControl, selectedFeature, map1,attribute, draw,modify,map1extent,project_id;
var WGS84 = new OpenLayers.Projection("EPSG:4326");
var TMS = new OpenLayers.Projection("EPSG:900913");
var wfs_correction_layer = new OpenLayers.Layer.Vector();

function showMsg(szMessage) {
    document.getElementById("nodelist").innerHTML = szMessage;
    setTimeout("document.getElementById('nodelist').innerHTML = ''",3000);
}

function isnull_correction_text(feature){
	if (feature.attributes.correction_text == ''
	|| feature.attributes.correction_text == null
	|| feature.attributes.correction_text == 'NULL') {
		return true;
	}
}

function isnull_validation(feature){
	if (feature.attributes.validation == ''
	|| feature.attributes.validation == null
	|| feature.attributes.validation == 'NULL') {
		return true;
	}
}

function checkValidationAllDone(){
	flg=0;
	for(i=0; i<wfs_correction_layer.features.length; i++){
		if(isnull_validation(wfs_correction_layer.features[i])) {
				flg=1;
			}
	}
	if(flg==0) {
		return true;
	}else{
		return false;
	}
}

function checkValidationAll(){
    if((selectedFeature.attributes.validation == 'incorrect' || selectedFeature.attributes.validation == 'userlocation')	
       && isnull_correction_text(selectedFeature)) {
		//alertProvideTextInfo();
   }else{
		if(checkValidationAllDone()){
			alert("All of locations have been validated. Please provide information on mission locations in the text box, if any.");
			document.getElementById("project_attributes").innerHTML = '<div id="project_attributes" style="padding: 5px;"><span style="color:red;">Step 4: Provide information on missing locations, if any.</span><form action="post.php" method="post" name="validation"><input type="hidden" name="pid" value="'+project_id+'"><textarea name="missing_location" rows="4" cols="40" style="width:100%"></textarea><input type="submit" value="Let me FINISH" ></form>If you need to correct the results, please click the button below or a symbol on the map.</div><input type="button" onClick="correctResults();" value="Correct the results">';
			selectControl.unselect(selectedFeature);
		}
	}
	selectControl.activate();
}

function correctResults(){
	document.getElementById("project_attributes").innerHTML = '<div id="project_attributes"><table border="1" width="100%" cellpadding="5px"><tr><td id="instruction">Step 1: Click a "red" location <img src="OpenLayers-2.13.1/img/marker.png"> for validation.</td></tr><tr><td><div id="country">Country:</div></td></tr><tr><td><div id="project_id">Project No:</div></td></tr><tr><td><div id="project_title">Project Name:</div></td></tr><tr><td><div id="approval_nos">Approval No:</div></td></tr><tr><td><div id="adm1">Adm1:</div></td></tr><tr><td><div id="adm2">Adm2:</div></td></tr><form name="validation"><tr><td id="vi"></td></tr><tr><td id="correction"></td></tr></form></table></div>';

}

function showSuccessMsg(){
    showMsg("<img src='img/Save-icon.png'> Saved.");
};

function showFailureMsg(){alert('Problems in data transaction occured. Please tell this to the system administrator.')};
var saveStrategy = new OpenLayers.Strategy.Save();
//saveStrategy.events.register("success", '', showSuccessMsg);
saveStrategy.events.register("failure", '', showFailureMsg);
saveStrategy.auto = true;

var refreshStrategy = new OpenLayers.Strategy.Refresh();

function zoomToDefault(){
	map1.zoomToExtent(map1extent);
}

function attributeStr(feature){
    str = '<tr><td id="vi"><span style="color:red;">Step 2: Validate the location.</span><br>Validation status - Location is:<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value=""'
    if(isnull_validation(feature)){
	str += ' selected></option><option value="correct">correct</option><option value="incorrect">NOT correct';
    }else if(feature.attributes.validation == 'correct') {
	str += '></option><option value="correct" selected>correct</option><option value="incorrect">NOT correct';
    }else if(feature.attributes.validation == 'incorrect' || feature.attributes.validation == 'userlocation') {
	str += '></option><option value="correct">correct</option><option value="incorrect" selected>NOT correct';
    }else {
	str += '></option><option value="correct">correct</option><option value="incorrect">NOT correct</option><option value="undefined" selected>undefined';
    }
    document.getElementById("vi").innerHTML = str + '</option></select></td></tr>';
}
function onFeatureSelect(feature) {
	
	if(selectedFeature != null){
		selectControl.unhighlight(selectedFeature);
		}
	selectControl.deactivate();
    selectedFeature = feature;
	selectControl.highlight(feature);
	document.getElementById("project_attributes").innerHTML = '<div id="project_attributes"><table border="1" width="100%" cellpadding="5px"><tr><td id="instruction">Step 1: Click a "red" location <img src="OpenLayers-2.13.1/img/marker.png"> for validation.</td></tr><tr><td><div id="country">Country:</div></td></tr><tr><td><div id="project_id">Project No:</div></td></tr><tr><td><div id="project_title">Project Name:</div></td></tr><tr><td><div id="approval_nos">Approval No:</div></td></tr><tr><td><div id="adm1">Adm1:</div></td></tr><tr><td><div id="adm2">Adm2:</div></td></tr><form name="validation"><tr><td id="vi"></td></tr><tr><td id="correction"></td></tr></form></table></div>';
    
    if(isnull_correction_text(feature)){
		correction_text = '';
    }else{
		correction_text = feature.attributes.correction_text;
    }
    document.getElementById("project_id").innerHTML = "Project No: " + feature.attributes.project_id;
    document.getElementById("project_title").innerHTML = "Project Name: " + feature.attributes.title;
    document.getElementById("country").innerHTML = "Country: " + feature.attributes.country;
    document.getElementById("approval_nos").innerHTML = "Approval No: " + feature.attributes.approval_nos;
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
    if(feature.attributes.validation == 'incorrect' || feature.attributes.validation == 'userlocation') {
		document.getElementById("correction").innerHTML = '<tr><td id="correction"><span style="color:red;">Step 3: Provide information for correction.</span><div id="correction_text"><textarea name="correction_text" rows="4" cols="40" style="width:100%" onChange="updateCorrectionText(attribute,this.value);" onKeyUp="onBlurCorrectionText(this.value);">'+correction_text+'</textarea></div><span style="color:red;">Optional: Correct the location in the map by clicking and dragging.</span><div id="correction_map"><input type="button" value="Yes, let me try." onClick="drawFeatureOn();"><input type="button" value="No, thanks." onClick="checkValidationAll(); selectControl.unselect(selectedFeature);"></div></td></tr>';
    }
	else if(feature.attributes.validation == 'correct') {
		document.getElementById("correction").innerHTML = '<td id="correction"><input type="button" value="Submit" onClick="checkValidationAll(); selectControl.unselect(selectedFeature);"></td>';
	}
	else {
		document.getElementById("correction").innerHTML = '<td id="correction"></td>';
	}

}

function onBlurCorrectionText(text){
    selectedFeature.attributes.correction_text = text;
}

function alertProvideTextInfo(){
		alert("Please provide correction information to the text box.");
		selectControl.highlight(selectedFeature);
}

function checkForSubmit(){

}

function onFeatureUnselect(feature) {
    if((feature.attributes.validation == 'incorrect' || feature.attributes.validation == 'userlocation')	
       && isnull_correction_text(feature)) {
		alertProvideTextInfo();
   }else if(!checkValidationAllDone()){
		document.getElementById("instruction").innerHTML = '<td id="instruction">Step 1: Click a "red" location <img src="OpenLayers-2.13.1/img/marker.png"> for validation.</td>'
		document.getElementById("project_id").innerHTML = "Project No: ";
		document.getElementById("project_title").innerHTML = "Project Name: ";
		document.getElementById("country").innerHTML = "Country: ";
		document.getElementById("approval_nos").innerHTML = "Approval No: ";
		document.getElementById("adm1").innerHTML = "Adm1: ";
		document.getElementById("adm2").innerHTML = "Adm2: ";
		document.getElementById("vi").innerHTML = '<tr id="vi"><td>Validation status - </td></tr>';
		document.getElementById("correction").innerHTML = '<td id="correction"></td>';
    }
}
function updateAttributes(attribute,value,text){
    selectedFeature.attributes.validation = value;
    if(value == 'incorrect') {
		document.getElementById("correction").innerHTML = '<tr id="correction"><td><span style="color:red;">Step 3: Provide information for correction.</span><div id="correction_text"><textarea name="correction_text" rows="4" cols="40" style="width:100%" onChange="updateCorrectionText(attribute,this.value);" onKeyUp="onBlurCorrectionText(this.value);"></textarea></div><span style="color:red;">Optional: Correct the location in the map by clicking and dragging.</span><div id="correction_map"><input type="button" value="Yes, let me try." onClick="drawFeatureOn();"><input type="button" value="No, thanks." onClick="checkValidationAll(); selectControl.unselect(selectedFeature);"></div></td></tr>';
    }else{
		document.getElementById("correction").innerHTML = '<td id="correction"><input type="button" value="Submit" onClick="	checkValidationAll(); selectControl.unselect(selectedFeature);"></td>';
    }
    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
    selectControl.highlight(selectedFeature);
};

function updateCorrectionText(attribute,text){
    selectedFeature.attributes.correction_text = text;

    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
};

function drawFeatureOn(){
    if (isnull_correction_text(selectedFeature)) {
		alertProvideTextInfo();
    }else{
	modify.feature = selectedFeature;
	modify.activate();
	document.getElementById("correction_map").innerHTML = '<input type="button" value="Submit the correction" onClick="checkValidationAll(); drawFeatureOff();"><input type="button" value="Let me quit. Restore the original location." onClick="resetLocation();">';
    }
}

function drawFeatureOff(){
    modify.deactivate();
    //document.getElementById("correction_map").innerHTML = '<input type="button" value="Yes, let me try." onClick="drawFeatureOn();"><input type="button" value="No, thanks." onClick="checkValidationAll(); selectControl.unselect(selectedFeature);">';
	selectedFeature.attributes.validation = 'userlocation';
    selectControl.activate();
    selectControl.unselect(selectedFeature);
}

function resetLocation(){
	var point_wgs84 = new OpenLayers.Geometry.Point();

	point_wgs84.x = selectedFeature.attributes.longitude;
	point_wgs84.y = selectedFeature.attributes.latitude;
	point_tms = point_wgs84.transform(WGS84,TMS);
	selectedFeature.geometry.x = point_tms.x;
	selectedFeature.geometry.y = point_tms.y;
	selectedFeature.attributes.validation = 'incorrect';
	selectedFeature.state = OpenLayers.State.UPDATE;
	saveStrategy.save();
    selectControl.select(selectedFeature);
}

function init(lonmin,latmin,lonmax,latmax,pid,WFSHOST) {
    project_id=pid;
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
	//,maxExtent: map1extent
	,restrictedExtent: map1extent
	,controls:[
	    new OpenLayers.Control.Navigation()
	    ,new OpenLayers.Control.PanZoom()
	    ,new OpenLayers.Control.MousePosition()
	    //,new OpenLayers.Control.KeyboardDefaults() 
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
    wfs_correction_layer = new OpenLayers.Layer.Vector(
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
		,{
			clickout: false
		}
    );
    
	var rect_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
	rect_style.graphicOpacity = 1;
	rect_style.strokeWidth = 2; 
	rect_style.strokeColor = "#FF0033";
	rect_style.strokeOpacity = 1;
	
	var rectangle_map1 = new OpenLayers.Feature.Vector(
		new OpenLayers.Geometry.LineString(
			[
				new OpenLayers.Geometry.Point(lonmin, latmin).transform(WGS84,TMS)
				,new OpenLayers.Geometry.Point(lonmin, latmax).transform(WGS84,TMS)
				,new OpenLayers.Geometry.Point(lonmax, latmax).transform(WGS84,TMS)
				,new OpenLayers.Geometry.Point(lonmax, latmin).transform(WGS84,TMS)
				,new OpenLayers.Geometry.Point(lonmin, latmin).transform(WGS84,TMS)
			]
			)
	);
	rectangle_map1.style=rect_style;
	
    var mapextentPolygon_map1 = new OpenLayers.Layer.Vector("Target extent");
	mapextentPolygon_map1.addFeatures(rectangle_map1);
    //map1.addLayers([wms,wfs_correction_layer]);
    map1.addLayers([google_maps,google_satellite,google_hybrid,osm,bing_road,bing_aerial,bing_hybrid,wfs_correction_layer,mapextentPolygon_map1]);
    map1.zoomToExtent(map1extent);

    selectControl = new OpenLayers.Control.SelectFeature(
		wfs_correction_layer
		,{ onSelect: onFeatureSelect
		   ,onUnselect: onFeatureUnselect
		   ,clickout: false
		   ,multiple: false
		   ,hover: false
		 }
    );
    map1.addControl(selectControl);
    map1.addControl(modify);
    selectControl.activate();
    saveStrategy.activate();

	window.onbeforeunload = function (e) {
	  var e = e || window.event;
		flg=0;
	  // For IE and Firefox prior to version 4
	  if (e) {
		for(i=0; i<wfs_correction_layer.features.length; i++){
			if(isnull_validation(wfs_correction_layer.features[i])) {
					e.returnValue = "You have not finished validation. Do you want to continue later?";
				}
		}
	  }

	  // For Safari
		for(i=0; i<wfs_correction_layer.features.length; i++){
			if(isnull_validation(wfs_correction_layer.features[i])) {
					e.returnValue = "You have not finished validation. Do you want to continue later?";
				}
		}
	};	
};
