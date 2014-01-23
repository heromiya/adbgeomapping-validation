 var map1Nav = new OpenLayers.Control.Navigation();

function init(lonmin,latmin,lonmax,latmax) {
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
	    map1Nav,
	    new OpenLayers.Control.PanZoom()
    	    ,new OpenLayers.Control.MousePosition()
	    ,new OpenLayers.Control.KeyboardDefaults() 
	    ,new OpenLayers.Control.Scale()
	    ,new OpenLayers.Control.OverviewMap()
	]
	,eventListeners: {
	}
    }

    map1 = new OpenLayers.Map('map1',map1Opts);

    var wfs_layer = new OpenLayers.Layer.Vector(
	"Editable Features"
	,{
	    strategies: [
		new OpenLayers.Strategy.BBOX()
	    ]
	    ,styleMap: new OpenLayers.StyleMap(style)
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
	    }
	}
    );
    
    map1.addLayers([google_maps,wfs_layer]);
    map1.zoomToExtent(map1extent);

    var navigate = new OpenLayers.Control.Navigation(
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

    //panel.addControls([navigate]);
    //panel.defaultControl = navigate;
    //map1.addControl(panel);
    //map1.fractionalZoom =true;

   
};
