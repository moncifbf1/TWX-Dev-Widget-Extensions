TW.IDE.Widgets.PercallD3BarChart = function () {
	var cId;
	
	this.MAX_VLINES = 8;
	this.MAX_HLINES = 8;
	
	this.widgetIconUrl = function() {
		return  "../Common/extensions/PercallD3BarChart/ui/PercallD3BarChart/barcharticon.png";
	};

	this.widgetProperties = function () {
		var properties =  {
			'name': 'PercallD3BarChart',
			'description': 'Displays a Chart',
			'supportsAutoResize': true,
			'category': ['Common'],
			'properties': {
				'CurvedLigneData':{
					'description': 'Curved ligne data',
					'isBindingTarget': true,
					'isEditable': false,
					'baseType': 'INFOTABLE',
					'warnIfNotBoundAsTarget': true	
				},
				'BarChartData':{
					'description': 'Bar Chart data',
					'isBindingTarget': true,
					'isEditable': false,
					'baseType': 'INFOTABLE',
					'warnIfNotBoundAsTarget': true	
				},
				'VLineData':{
					'description': 'Verticale line data',
					'isBindingTarget': true,
					'isEditable': false,
					'baseType': 'INFOTABLE',
					'warnIfNotBoundAsTarget': true	
				},
				'HLineData':{
					'description': 'Horizontal line data',
					'isBindingTarget': true,
					'isEditable': false,
					'baseType': 'INFOTABLE',
					'warnIfNotBoundAsTarget': true	
				},
				'ChartTitle': {
					'description': 'Here insert the title of your Chart',
					'baseType': 'STRING',
					'isVisible': true,
					'defaultValue': "Chart title",
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
				},
				'ChartTitleVisibility': {
					'description': 'Here you can set the visibility of your title',
					'baseType': 'BOOLEAN',
					'defaultValue': true
				},
				'XLabel': {
					'description': 'Here insert the title of your x label',
					'baseType': 'STRING',
					'isVisible': true,
					'defaultValue': "X axis Label",
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
				},
				'XLabelVisibility': {
					'description': 'Here you can set the visibility of your x label',
					'baseType': 'BOOLEAN',
					'defaultValue': true
				},
				'YLabel': {
					'description': 'Here insert the title of your y label',
					'baseType': 'STRING',
					'isVisible': true,
					'defaultValue': "Y axis Label",
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
				},
				'YLabelVisibility': {
					'description': 'Here you can set the visibility of your y label',
					'baseType': 'BOOLEAN',
					'defaultValue': true
				},
				'AxisColor': {
					'description': 'Style of x & y axis',
					'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultAxisStyle'
				},
				'LegendVisibility': {
					'description': 'Here you can set the visibility of your legend',
					'baseType': 'BOOLEAN',
					'defaultValue': true
				},
				'LegendPosition':{
					'description': 'Specify the position of the legend',
					'baseType': 'STRING',
					'defaultValue': '0',
					'selectOptions': [
					                  { value: '0', text: 'Top Right of the Chart' },
					                  { value: '1', text: 'Top Left of the Chart' },
					                  { value: '2', text: 'Bottom Left of the Chart'},
					                  { value: '3', text: 'Bottom Right of the Chart'}
					                  ],
					'isVisible': true
				},
				'BarTitle': {
					'description': 'Here insert the title of your bar chart',
					'baseType': 'STRING',
					'isVisible': true,
					'defaultValue': "Bar Title",
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
				},
				'BarStyle':{
					'description': 'Style of bar chart',
					'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultBarStyle'
				},
				'BarHoverStyle':{
					'description': 'Hover style of bar chart',
					'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultBarHoverStyle'
				},
				'CurveLineTitle': {
					'description': 'Here insert the title of your curve',
					'baseType': 'STRING',
					'isVisible': true,
					'defaultValue': "Curve Label",
					'isBindingTarget': true,
					'warnIfNotBoundAsTarget': true
				},
				'CurveLigneStyle':{
					'description': 'Hover style of bar chart',
					'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultCurveStyle'
				},
				'OutputData':{
					'description': 'widget output data',
					'baseType': 'NUMBER',
					'defaultValue': 0,
					'isBindingSource': true
				}	
			}
		};
		
		// VERTICAL LINES **************************************************************
		var NumberOfVLinesProperty = {
				'description': 'Desired number of vertical lines in this Chart',
				'baseType': 'NUMBER',
				'defaultValue': 0,
				'isBindingTarget': true,
				'isVisible': true,
				'warnIfNotBoundAsTarget': true
		};
		
		properties.properties['NumberOfVLines'] = NumberOfVLinesProperty;
		
		var VLineNumber;		
		for (VLineNumber = 1; VLineNumber <= this.MAX_VLINES; VLineNumber++) {	
			//List all the properties to add here...
			var VLineName = {
					'description': 'Vertical line name',
					'baseType': 'STRING',
					'defaultValue': 'VLine '+VLineNumber,
					'isVisible': false,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var VLineValue = {
					'description': 'Vertical line value',
					'baseType': 'NUMBER',
					'defaultValue': 0,
					'isVisible': false ,
					'isBindingTarget': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var VLineLabel = {
					'description': 'Vertical line label',
					'baseType': 'STRING',
					'defaultValue': "VLine label "+VLineNumber,
					'isVisible': false ,
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var VLineStyle = {
					'description': 'VLine style ' + VLineNumber,
					'baseType': 'STYLEDEFINITION'
			};
			
			var VLineType = {
					'description': 'VLine Type ' + VLineNumber,
					'baseType': 'STRING',
					'defaultValue': '0',
					'selectOptions': [
		                  { value: '0', text: 'Continue' },
		                  { value: '1', text: 'Dotted' }
		                  ],
		            'isVisible': true
			};
			
			properties.properties['VLineName' + VLineNumber] = VLineName;
			properties.properties['VLineValue' + VLineNumber] = VLineValue;
			properties.properties['VLineLabel' + VLineNumber] = VLineLabel;
			properties.properties['VLineType' + VLineNumber] = VLineType;
			properties.properties['VLineStyle' + VLineNumber] = VLineStyle;
			properties.properties['VLineStyle' + VLineNumber]['defaultValue'] = 'DefaultVLineStyle' + VLineNumber;
		}
		//******************************************************************************
		
		// HORIZONTAL LINES ************************************************************
		var NumberOfHLinesProperty = {
				'description': 'Desired number of horizontal lines in this Chart',
				'baseType': 'NUMBER',
				'defaultValue': 0,
				'isBindingTarget': true,
				'isVisible': true,
				'warnIfNotBoundAsTarget': true
		};
		
		properties.properties['NumberOfHLines'] = NumberOfHLinesProperty;
		
		var HlineNumber;		
		for (HlineNumber = 1; HlineNumber <= this.MAX_HLINES; HlineNumber++) {	
			//List all the properties to add here...
			var HLineName = {
					'description': 'Horizontal line name',
					'baseType': 'STRING',
					'defaultValue': 'HLine '+HlineNumber,
					'isVisible': false,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var HLineValue = {
					'description': 'Horizontal line value',
					'baseType': 'NUMBER',
					'defaultValue': 0,
					'isVisible': false ,
					'isBindingTarget': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var HLineLabel = {
					'description': 'Vertical line label',
					'baseType': 'STRING',
					'defaultValue': "HLine label "+HlineNumber,
					'isVisible': false ,
					'isBindingTarget': true,
					'isLocalizable': true,
					'warnIfNotBoundAsTarget': true
			};
			
			var HLineStyle = {
					'description': 'VLine style ' + HlineNumber,
					'baseType': 'STYLEDEFINITION'
			};
			
			var HLineType = {
					'description': 'HLine Type ' + HlineNumber,
					'baseType': 'STRING',
					'defaultValue': '0',
					'selectOptions': [
		                  { value: '0', text: 'Continue' },
		                  { value: '1', text: 'Dotted' }
		                  ],
		            'isVisible': true
			};
			
			properties.properties['HLineName' + HlineNumber] = HLineName;
			properties.properties['HLineValue' + HlineNumber] = HLineValue;
			properties.properties['HLineLabel' + HlineNumber] = HLineLabel;
			properties.properties['HLineType' + HlineNumber] = HLineType;
			properties.properties['HLineStyle' + HlineNumber] = HLineStyle;
			properties.properties['HLineStyle' + HlineNumber]['defaultValue'] = 'DefaultHLineStyle'+ HlineNumber;
		}
		//*****************************************************************************
		return properties;
	};

	this.renderHtml = function () {
		return 	'<div class="widget-content widget-graphwidget"></div>';
	};
	
	this.afterLoad = function () {
		this.setVLineProperties(this.getProperty('NumberOfVLines'));
		this.setHLineProperties(this.getProperty("NumberOfHLines"));
	};
	
	this.afterRender = function () {
		cId = "svg-" + this.jqElementId;
		var widgetElement = this.jqElement;
		$("#"+this.jqElementId).html('<svg width="100%" height="100%" id='+cId+'></svg>');
		var currentSvg = document.getElementById(cId);
		console.log("The current cid: "+currentSvg);
		// Filling the SVG with a rect & text 
		var rect = d3.select("#"+cId+"")
			.append("rect")
				.attr("width","100%")
				.attr("height","100%")
				.attr("fill","#E2EDF8");
		
		var text= d3.select("#"+cId+"").append("text")
				.style("text-anchor", "middle")
                .attr("font-size", "200%")
                .attr("fill", "#073273")
                .attr("x", "50%")
                .attr("y", "50%")
				.text("Your Chart will be displayed here.");
	};
	
	this.beforeSetProperty = function (name, value) {
		var warning;
		var valueAux = value;
		value = parseInt(value, 10);
		switch (name) {
			case  'NumberOfVLines':
				if (value < 0 || value > this.MAX_VLINES || value != valueAux){
					warning = "Number Of Verticale lines Must Be An Integer Value Between 1 and " + this.MAX_VLINES;
				}					
				break;
			case  'NumberOfHLines':
				if (value < 0 || value > this.MAX_HLINES || value != valueAux){
					warning = "Number Of Horizontal lines Must Be An Integer Value Between 1 and " + this.MAX_HLINES;
				}					
				break;
			default:
				break;
		}		
		return warning;		               
	};
	
	this.afterSetProperty = function (name, value) {
		var thisWidget = this;
		var refreshHtml = false;
		switch (name) {
			case 'NumberOfVLines':
				this.setVLineProperties(this.getProperty("NumberOfVLines"));
				this.updatedProperties();
				refreshHtml = true;
				break;
			case 'NumberOfHLines':
				this.setHLineProperties(this.getProperty("NumberOfHLines"));
				this.updatedProperties();
				refreshHtml = true;
				break;
			case 'CurvedLigneData':
			case 'BarChartData':
			case 'VLineData':
			case 'HLineData':
			default:
				this.setVLineProperties(this.getProperty("NumberOfVLines"));
				this.setHLineProperties(this.getProperty("NumberOfHLines"));
				refreshHtml = true;
				break;
		}
		return refreshHtml;
	};
	
	this.afterAddBindingSource = function (bindingInfo) {
		if (bindingInfo.targetProperty == "BarChartData") {
			this.updatedProperties();
		}
		
		if (bindingInfo.targetProperty == "CurvedLigneData") {
			this.updatedProperties();
		}	
			
		if (bindingInfo.targetProperty == "VLineData") {
			this.updatedProperties();
		}
		
		if (bindingInfo.targetProperty == "HLineData") {
			this.updatedProperties();
		}
	};
	
	this.setVLineProperties = function (value) {
		var allWidgetProps = this.allWidgetProperties();
		var vlinesNumber;
		for (vlinesNumber = 1; vlinesNumber <= value; vlinesNumber++) { 	
			allWidgetProps['properties']['VLineName' + vlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['VLineValue' + vlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['VLineLabel' + vlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['VLineType' + vlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['VLineStyle' + vlinesNumber]['isVisible'] = true;
		}
		for (vlinesNumber = value + 1; vlinesNumber <= this.MAX_VLINES; vlinesNumber++) {
			allWidgetProps['properties']['VLineName' + vlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['VLineValue' + vlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['VLineLabel' + vlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['VLineType' + vlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['VLineStyle' + vlinesNumber]['isVisible'] = false;
		}
	};
	
	this.setHLineProperties = function (value) {
		var allWidgetProps = this.allWidgetProperties();
		var HlinesNumber;
		for (HlinesNumber = 1; HlinesNumber <= value; HlinesNumber++) { 	
			allWidgetProps['properties']['HLineName' + HlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['HLineValue' + HlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['HLineLabel' + HlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['HLineType' + HlinesNumber]['isVisible'] = true;
			allWidgetProps['properties']['HLineStyle' + HlinesNumber]['isVisible'] = true;
		}
		for (HlinesNumber = value + 1; HlinesNumber <= this.MAX_HLINES; HlinesNumber++) {
			allWidgetProps['properties']['HLineName' + HlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['HLineValue' + HlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['HLineLabel' + HlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['HLineType' + HlinesNumber]['isVisible'] = false;
			allWidgetProps['properties']['HLineStyle' + HlinesNumber]['isVisible'] = false;
		}
	};
	
};