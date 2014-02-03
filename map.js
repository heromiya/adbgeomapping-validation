var selectControl, selectedFeature, map1,attribute, draw,wfs_correction_layer;

function showMsg(szMessage) {
    document.getElementById("nodelist").innerHTML = szMessage;
    setTimeout("document.getElementById('nodelist').innerHTML = ''",3000);
}
function showSuccessMsg(){
    showMsg("<img src='img/Save-icon.png'> Saved.");
    //alert('Saved');
    //var nowdate = new Date();
    //document.getElementById("lastSave").innerHTML = "Last save:" + (Number(nowdate.getMonth())+1) + "/" + nowdate.getDate() + " " + nowdate.getHours() + ":" + nowdate.getMinutes();
};
function showFailureMsg(){alert('Problems in data transaction occured. Please tell this to the system administrator.')};
var saveStrategy = new OpenLayers.Strategy.Save();
saveStrategy.events.register("success", '', showSuccessMsg);
saveStrategy.events.register("failure", '', showFailureMsg);
saveStrategy.auto = true;
function onPopupClose(evt) {
    selectControl.unselect(selectedFeature);
}
function attributeStr(feature){
    str = '<td id="vi">Class:'
    if(feature.attributes.validation == null || feature.attributes.validation == ''){
	str += '<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value="" selected></option><option value="correct">correct</option><option value="incorrect">NOT correct</option></select></td>';
    }else if(feature.attributes.validation == 'correct') {
	str += '<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value=""></option><option value="correct" selected>correct</option><option value="incorrect">NOT correct</option></select></td>';
    }else if(feature.attributes.validation == 'incorrect') {
	str += '<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value=""></option><option value="correct">correct</option><option value="incorrect" selected>NOT correct</option></select></td>';
    }else {
	str += '<select name="correct" onChange="updateAttributes(attribute,this.options[this.options.selectedIndex].value);"><option value=""></option><option value="correct">correct</option><option value="incorrect">NOT correct</option><option value="undefined" selected>undefined</option></select></td>';
    }
    document.getElementById("vi").innerHTML = str;
}
function onFeatureSelect(feature) {
    selectedFeature = feature;
	if(feature.attributes.correction_text == null || feature.attributes.correction_text == ''){
		correction_text = 'Please input here.';
	}else{
		correction_text = feature.attributes.correction_text;
	}
    document.getElementById("project_id").innerHTML = "Project ID: " + feature.attributes.project_id;
    document.getElementById("project_title").innerHTML = "Project Title: " + feature.attributes.project_title;
    document.getElementById("country").innerHTML = "Country: " + feature.attributes.country;
    document.getElementById("adm1").innerHTML = "Adm1: " + feature.attributes.adm1;
    document.getElementById("adm2").innerHTML = "Adm2: " + feature.attributes.adm2;
    document.getElementById("results").innerHTML = "Results: " + feature.attributes.results;
	document.getElementById("correction_text").innerHTML = "<textarea name=\"correction_text\" rows=\"4\" cols=\"40\" onChange=\"updateCorrectionText(attribute,this.value)\">"+correction_text+"</textarea>";
	attributeStr(feature);
	document.getElementById("correction_map").innerHTML = "<input type=\"button\" value=\"Correct by Map\" onClick=\"drawFeatureOn();\">";

}
function onFeatureUnselect(feature) {
	modify.deactivate();
    document.getElementById("project_id").innerHTML = "Project ID: ";
    document.getElementById("project_title").innerHTML = "Project Title: ";
    document.getElementById("country").innerHTML = "Country: ";
    document.getElementById("adm1").innerHTML = "Adm1: ";
    document.getElementById("adm2").innerHTML = "Adm2: ";
    document.getElementById("results").innerHTML = "Results: ";
	document.getElementById("correction_map").innerHTML = "<input type=\"button\" value=\"No location selected\">";
//	document.getElementById("correction_map").innerHTML = "<a href=\"javascript:drawFeatureOn();\">Correct by Map</a>";

}   
function updateAttributes(attribute,value,text){
    selectedFeature.attributes.validation = value;
    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
};
function updateCorrectionText(attribute,text){
    selectedFeature.attributes.correction_text = text;
	alert(text);
	alert(selectedFeature.attributes.correction_text);

    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
};

function drawFeatureOn(){
//	draw.activate();
	modify.activate();
	document.getElementById("correction_map").innerHTML = "<input type=\"button\" value=\"Finish Correction\" onClick=\"drawFeatureOff();\">";
//	document.getElementById("correction_map").innerHTML = "<a href=\"javascript:drawFeatureOff();\">Finish Correction</a>";

}

function drawFeatureOff(){
//	draw.deactivate();
	modify.deactivate();
	document.getElementById("correction_map").innerHTML = "<input type=\"button\" value=\"Correct by Map\" onClick=\"drawFeatureOn();\">";
//	document.getElementById("correction_map").innerHTML = "<a href=\"javascript:drawFeatureOn();\">Correct by Map</a>";
}

function init(lonmin,latmin,lonmax,latmax,pid,WFSHOST) {
    extlonmin = lonmin;
    extlatmin = latmin;
    extlonmax = lonmax;
    extlatmax = latmax;
    var map1extent = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax).transform(WGS84,TMS);
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
			//,new OpenLayers.Control.OverviewMap()
			,new OpenLayers.Control.LayerSwitcher()
		]
		,eventListeners: {
		}
    };
    map1 = new OpenLayers.Map('map1',map1Opts);

    var wfs_correction_layer = new OpenLayers.Layer.Vector(
	"Corrected location"
	,{
	    strategies: [
			new OpenLayers.Strategy.BBOX()
			,saveStrategy
		]
//	    ,styleMap: [new OpenLayers.StyleMap(style), new OpenLayers.StyleMap(selected)]
	    ,styleMap: new OpenLayers.StyleMap({default: style, select: selected})
	    ,protocol: new OpenLayers.Protocol.WFS(
		{
		    version: "1.1.0",
		    srsName: "EPSG:900913",
//		    srsName: "EPSG:4326",
		    url: "http://"+WFSHOST+"/geoserver/wfs",	
		    featureNS :  "http://www.opengeospatial.net/cite",
		    maxExtent: mapextent_wgs84,
		    featureType: "allworldbank_ibrdida",
		    geometryName: "the_geom",
		    schema: "http://"+WFSHOST+"/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=cite:allworldbank_ibrdida"
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
	
    wfs_correction_layer.events.on({
        "afterfeaturemodified": function(event){
			
//	    event.feature.state = OpenLayers.State.UPDATE;
//	    saveStrategy.save();
			selectControl.unselect(selectedFeature);
		},
		"beforefeatureadded": function(event){
			feature = event.feature;
			if (feature.attributes.validation == null)
			feature.attributes.validation = 'NULL';
		},
	});

	draw = new OpenLayers.Control.DrawFeature(
		wfs_correction_layer
		,OpenLayers.Handler.Point
	);

	modify = new OpenLayers.Control.ModifyFeature(
		wfs_correction_layer
//		,OpenLayers.Handler.Point
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
//	draw.activate();

};
