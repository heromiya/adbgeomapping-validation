 var selectControl, selectedFeature, map1,attribute;
function showMsg(szMessage) {
    document.getElementById("nodelist").innerHTML = szMessage;
    setTimeout("document.getElementById('nodelist').innerHTML = ''",3000);
}

function showSuccessMsg(){
    showMsg("<img src='Save-icon.png'> Saved.");
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
    
/*    str = '<td id="note" class="item">Note:'
    if(feature.attributes.note == null){
	str += '<input type="text" name="note_input" onChange="updateAttributes(attribute);" value="">';
    }else{
	str += '<input type="text" name="note_input" onChange="updateAttributes(attribute);" value="' + feature.attributes.note + '">';
    }
    str += '</td>'
    document.getElementById("note").innerHTML = str;*/
}


function onFeatureSelect(feature) {
    selectedFeature = feature;
    document.getElementById("project_id").innerHTML = "Project ID: " + feature.attributes.project_id;
    document.getElementById("project_title").innerHTML = "Project Title: " + feature.attributes.project_title;
    document.getElementById("country").innerHTML = "Country: " + feature.attributes.country;
    document.getElementById("adm1").innerHTML = "Adm1: " + feature.attributes.adm1;
    document.getElementById("adm2").innerHTML = "Adm2: " + feature.attributes.adm2;
    document.getElementById("results").innerHTML = "Results: " + feature.attributes.results;
    attributeStr(feature);

}

function onFeatureUnselect(feature) {
    document.getElementById("project_id").innerHTML = "Project ID: ";
    document.getElementById("project_title").innerHTML = "Project Title: ";
    document.getElementById("country").innerHTML = "Country: ";
    document.getElementById("adm1").innerHTML = "Adm1: ";
    document.getElementById("adm2").innerHTML = "Adm2: ";
    document.getElementById("results").innerHTML = "Results: ";
//    map1.removePopup(feature.popup);
//    feature.popup.destroy();
//    feature.popup = null;
}   

var poi_style = new OpenLayers.StyleMap(
    OpenLayers.Util.applyDefaults(
	{ pointRadius: 7,
	  fillOpacity: 1,
	  externalGraphic: "map_pin.png"
	},
	OpenLayers.Feature.Vector.style["default"]));

function updateAttributes(attribute,value){
    selectedFeature.attributes.validation = value;
//    alert(selectedFeature.attributes.validation);
//    alert( document.validation.correct.value);
    selectedFeature.state = OpenLayers.State.UPDATE;
    saveStrategy.save();
};

function init(lonmin,latmin,lonmax,latmax,pid) {
    extlonmin = lonmin;
    extlatmin = latmin;
    extlonmax = lonmax;
    extlatmax = latmax;
    var map1extent = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax).transform(WGS84,TMS);
    var mapextent_wgs84 = new OpenLayers.Bounds(lonmin,latmin,lonmax,latmax);
    var map1Opts = {
	displayProjection: TMS
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
	    ,new OpenLayers.Control.OverviewMap()
	    ,new OpenLayers.Control.LayerSwitcher()
	]
	,eventListeners: {
	}
    }
    map1 = new OpenLayers.Map('map1',map1Opts);
    var wfs_layer = new OpenLayers.Layer.Vector(
	"Project Location"
	,{
	    strategies: [
		new OpenLayers.Strategy.BBOX()
		,saveStrategy
	    ]
	    //,styleMap: new OpenLayers.StyleMap(poi_style)
	    ,protocol: new OpenLayers.Protocol.WFS(
		{
		    version: "1.1.0",
		    srsName: "EPSG:900913",
		    url: "http://guam.csis.u-tokyo.ac.jp:28080/geoserver/wfs",	
		    featureNS :  "http://www.opengeospatial.net/cite",
		    maxExtent: mapextent_wgs84,
		    featureType: "allworldbank_ibrdida",
		    geometryName: "the_geom",
		    schema: "http://guam.csis.u-tokyo.ac.jp:28080/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=cite:allworldbank_ibrdida"
		})
	    ,eventListeners: {
		"loadstart": function(){
		    document.getElementById("nodelist").innerHTML = "<img src='loader.gif'> Loading ...";
		},
		"loadend": function(){
		    document.getElementById("nodelist").innerHTML = "<img src='Check-icon.png'> Completed.";
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
		})
	}
    );

    wfs_layer.events.on({
        "featuremodified": function(event){
	    event.feature.state = OpenLayers.State.UPDATE;
	    saveStrategy.save();
	},
	"beforefeatureadded": function(event){
	    feature = event.feature;
	    if (feature.attributes.validation == null)
		feature.attributes.validation = 'NULL';
	},
    });
    
    map1.addLayers([google_maps,google_satellite,google_hybrid,osm,bing_road,bing_aerial,bing_hybrid,wfs_layer]);
    map1.zoomToExtent(map1extent);

    selectControl = new OpenLayers.Control.SelectFeature(
	wfs_layer
	,{ onSelect: onFeatureSelect
	  ,onUnselect: onFeatureUnselect});
    map1.addControl(selectControl);
    selectControl.activate();
    saveStrategy.activate();

/*    var navigate = new OpenLayers.Control.Navigation(
	{
	    title: "Pan Map"
	    ,eventListeners: {
	    }
	}
    );

    var panel = new OpenLayers.Control.Panel(
	{
	    displayClass: 'customEditingToolbar'
	    ,type: OpenLayers.Control.TYPE_TOGGLE
	}
    );
  */ 
};
