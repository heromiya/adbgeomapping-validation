OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
var map1 = new OpenLayers.Map();
var map2 = new OpenLayers.Map();
var WGS84 = new OpenLayers.Projection("EPSG:4326");
var TMS = new OpenLayers.Projection("EPSG:900913");

var google_maps=new OpenLayers.Layer.Google("Google Maps",{numZoomLevels:20});var google_satellite=new OpenLayers.Layer.Google("Google Satellite",{type:google.maps.MapTypeId.SATELLITE});var google_hybrid=new OpenLayers.Layer.Google("Google Hybrid",{type:google.maps.MapTypeId.HYBRID});var osm=new OpenLayers.Layer.OSM();var BingAPIKey="ApbUJrB8FK-JwVvA89sxqcQWeMJJBwxszcNgdOUFb02xaUfZTBiEKa9EW9p9FHBU";var bing_road=new OpenLayers.Layer.Bing({key:BingAPIKey,type:"Road",metadataParams:{mapVersion:"v1"}});var bing_aerial=new OpenLayers.Layer.Bing({key:BingAPIKey,type:"Aerial"});var bing_hybrid=new OpenLayers.Layer.Bing({key:BingAPIKey,type:"AerialWithLabels",});

