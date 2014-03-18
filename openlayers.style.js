var style = new OpenLayers.Style(
	{
	    graphicWidth: 17,
	    graphicHeight: 20,
	    graphicYOffset: -23 // shift graphic up 28 pixels
	},
	{
		rules: [
			new OpenLayers.Rule({
				// a rule contains an optional filter
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation", // the "foo" feature attribute
					value: "correct"
				}),
				// if a feature matches the above filter, use this symbolizer
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-green.png"
				}
			}),
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation",
					value: "incorrect"
				}),
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-gold.png"
				}
			}),
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation",
					value: "userlocation"
				}),
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-blue.png"
				}
			}),
			new OpenLayers.Rule({
				// apply this rule if no others apply
				elseFilter: true,
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker.png"
				}
			})
		]
	}
);

var selected = new OpenLayers.Style(
	{
		graphicWidth: 32,
		graphicHeight: 38,
		graphicYOffset: -40 // shift graphic up 28 pixels
	},
	{
		rules: [
			new OpenLayers.Rule({
				// a rule contains an optional filter
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation", // the "foo" feature attribute
					value: "correct"
				}),
				// if a feature matches the above filter, use this symbolizer
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-green.png"
				}
			}),
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation",
					value: "incorrect"
				}),
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-gold.png"
				}
			}),
			new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "validation",
					value: "userlocation"
				}),
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker-blue.png"
				}
			}),
			new OpenLayers.Rule({
				// apply this rule if no others apply
				elseFilter: true,
				symbolizer: {
					externalGraphic: "OpenLayers-2.13.1/img/marker.png"
				}
			})
		]
	}
);
