var style = new OpenLayers.Style(
    {
        fill: true,
        stroke: true,
	pointRadius: 5,
        fillOpacity: "0.2",
	strokeWidth: 1,
        zIndex: 0,
    },
    {
        rules: [
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                    property: "vi",
		    value: ""
                }),
                symbolizer: {
                    fillColor: "#99FF66",
                    strokeColor: "#33FF00"
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "vi",
                    value: "urban"
                }),
                symbolizer: {
                    fillColor: "#6666FF",
                    strokeColor: "#0000FF"
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "vi",
		    value: "non-urban"
                }),
                symbolizer: {
                    fillColor: "#FF6666",
                    strokeColor: "#FF0000"
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "vi",
		    value: "unknown"
                }),
                symbolizer: {
                    fillColor: "#FFFF66",
                    strokeColor: "#FF6600"
                }
            }),
        ]
    }
);
