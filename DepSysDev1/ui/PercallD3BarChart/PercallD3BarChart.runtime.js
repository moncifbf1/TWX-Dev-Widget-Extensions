TW.Runtime.Widgets.PercallD3BarChart = function () {
	// Global variables
	var cId;
	var aId;
	var widgetElement;
	var svg;
	var barG;
	var bars;
	var tip;
	var tooltip;
	var axisColor;
	var max;
	var min;
	var xx;
	var x;
	var y;
	var	valueline;
	var g;
	var theIndex;
	var posLineLegend=0;
	var xAxis;
	var yAxis;
	var ya;
	var xa;
	var barset = [];
	var curveset = [];
	var PosCurvBar = 0;
	var countLegend = 0;
	var count = 0;
	var thisWidget = this;
	var widgetProperties = this.properties;
	var hLineData;
	var vLineData;
	var barTitle ;
	var curveLineTitle;
	this.renderHtml = function() {
		var	html = '<div class="widget-content"></div>';
		return html;
	};


	this.updateProperty = function (updatePropertyInfo) {
		if (updatePropertyInfo.TargetProperty === 'BarChartData') {
			var value = updatePropertyInfo.RawSinglePropertyValue;       	
			this.setProperty('BarChartData', value);
//			this.afterRender();
		}

		if (updatePropertyInfo.TargetProperty === 'CurvedLigneData') {
			var value = updatePropertyInfo.RawSinglePropertyValue;       	
			this.setProperty('CurvedLigneData', value);
			this.afterRender();
		}

		if (updatePropertyInfo.TargetProperty === 'VLineData') {
			var value = updatePropertyInfo.RawSinglePropertyValue;       	
			this.setProperty('VLineData', value);
			this.afterRender();
		}
		
		if (updatePropertyInfo.TargetProperty === 'HLineData') {
			var value = updatePropertyInfo.RawSinglePropertyValue;       	
			this.setProperty('HLineData', value);
			this.afterRender();
		}
	};	

	this.resize = function(width,height) {
		if(this.properties.ResponsiveLayout) {
			var width= this.jqElement.width();
			var height= this.jqElement.height();
			$("#"+this.jqElementId).html('<svg width="'+width+'" height="'+height+'" id=' + cId +'></svg>');
		}else{

			$("#"+this.jqElementId).html('<svg width="'+this.getProperty('Width')+'" height="'+this.getProperty('Height')+'" id=' + cId +'></svg>');
		}
		this.afterRender();
	};

	this.afterRender = function () {	
		aId = this.jqElementId;
		cId = "svg-" + this.jqElementId;
		widgetElement = this.jqElement;

		if(this.properties.ResponsiveLayout) {
			//on ne fait rien
		}else{

			$("#"+this.jqElementId).html('<svg width="'+this.getProperty('Width')+'" height="'+this.getProperty('Height')+'" id=' + cId +'></svg>');
		}

		// Calling the InfoTables and filling barset
		var barData = new Array();
		barData = widgetProperties['BarChartData'];
		barset = [];

		if(barData != null && barData!= undefined){

			var barDataLength = barData.rows.length;
			
			for (var i = 0; i < barDataLength; i++) {	
				var row = barData.rows[i];
				var xVal = row["xValue"];
				var xlab = row["xLabel"];
				var yVal = row["yValue"];
				barset.push([xVal,xlab,yVal]);
			}

			// Calling the InfoTables and filling Curvset
			var curveData = new Array();
			curveData = widgetProperties['CurvedLigneData'];
			curveset = [];
			if(curveData != null && curveData!=undefined){

				var curveDataLength = curveData.rows.length;

				for (var i = 0; i < curveDataLength; i++) {	
					var row = curveData.rows[i];
					var xVal = row["xValue"];
					var yVal = row["yValue"];
					curveset.push([xVal,yVal]);
				}
			}


			//*************************************************GRAPH CREATION BLOCK***************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************

			this.createSvg();
			this.createAxes();
			
			// TEST TOOLTIP
			tip = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
			
			
			// Align tick left 
			svg.selectAll('.tick')
				.attr('transform', function(){
			  	var t = getTransformation(d3.select(this).attr("transform"));
			  	return "translate("+ (t.translateX-(xx.rangeBand()/2)) + ","+ t.translateY+")";
			});
			
			// draw x axis
			xa=g.append("g")
				.attr("class", "axis axis--x"+aId)
				.attr("transform", "translate(0," + y(0) + ")")
				.call(xAxis);
			xa.select("path").attr("marker-end", "url(#arrowhead"+aId+")")
				.style('stroke', axisColor.lineColor);
			// draw y axis
			ya= g.append("g")
				.attr("class", "axis axis--y"+aId)
			  	.call(yAxis);
			ya.select("path")
				.attr("marker-start", "url(#arrowheadtop"+aId+")")
				.style('stroke', axisColor.lineColor);
			
						
			// Tooltip
			tooltip = svg.append("g")
				.attr("class", "tooltip");

			tooltip.append("text")
				.attr("x",15)
				.attr("dy","1.2em")
				.style("font-size","1.25em")
				.attr("font-weight","bold");


			//****************************************************ALTER STUFF*********************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			
			function getTransformation(transform) {
				// Create a dummy g for calculation purposes only. This will never
				// be appended to the DOM and will be discarded once this function 
				// returns.
				var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

				// Set the transform attribute to the provided string value.
				g.setAttributeNS(null, "transform", transform);

				// consolidate the SVGTransformList containing all transformations
				// to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
				// its SVGMatrix. 
				var matrix = g.transform.baseVal.consolidate().matrix;

				// Below calculations are taken and adapted from the private function
				// transform/decompose.js of D3's module d3-interpolate.
				var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
				// var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
				var scaleX, scaleY, skewX;
				if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
				if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
				if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
				if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
				return {
					translateX: e,
					translateY: f,
					rotate: Math.atan2(b, a) * Math.PI/180,
					skewX: Math.atan(skewX) * Math.PI/180,
					scaleX: scaleX,
					scaleY: scaleY
				};
			}

			//*******************************************CALLING IMPLEMENTED FUNCTIONS************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			//************************************************************************************************************************
			

			// Get style definitions
			var BarChartStyle = TW.getStyleFromStyleDefinition(this.getProperty('BarStyle'));
			var BarChartHoverStyle = TW.getStyleFromStyleDefinition(this.getProperty('BarHoverStyle'));
			var CurveStyle = TW.getStyleFromStyleDefinition(this.getProperty('CurveLigneStyle'));

			barTitle = this.getProperty("BarTitle");
			curveLineTitle = this.getProperty("CurveLineTitle");

			this.addTitle(this.getProperty("ChartTitle"),this.getProperty("ChartTitleVisibility"));
			this.addxLabel(this.getProperty("XLabel"),this.getProperty("XLabelVisibility"));
			this.addyLabel(this.getProperty("YLabel"),this.getProperty("YLabelVisibility")); 
			this.addBar(barTitle, BarChartStyle, BarChartHoverStyle, this.getProperty("LegendPosition"));

			//Postion of curved bar's legend
			if(barTitle.length != 0 && curveLineTitle.length != 0){
				PosCurvBar = 1;
				countLegend = PosCurvBar+1;
			}
			else if(barTitle.length != 0 && curveLineTitle.length == 0){
				PosCurvBar = 0;
				countLegend = 1;
			}
			if(curveData != null || curveData!=undefined){
				this.addCurve(this.getProperty("CurveLineTitle"), CurveStyle, PosCurvBar, this.getProperty("LegendPosition"));
			}

			
			// Get style definitions
//			var NbrOfVLines = this.getProperty('NumberOfVLines');
//			var NbrOfHLines = this.getProperty('NumberOfHLines');
//			// Calling addVerticalLine function
//			posLineLegend = PosCurvBar;
//			for (var iter = 1; iter <= NbrOfVLines; iter++) {
//				var VlineName = this.getProperty(('VLineName' + iter).toString());
//				var VlineVal = this.getProperty(('VLineValue' + iter).toString());
//				var Vlinelbl = this.getProperty(('VLineLabel' + iter).toString());
//				var VlineStyleSet = TW.getStyleFromStyleDefinition(this.getProperty('VLineStyle'+iter));
//				var VlineTp = this.getProperty('VLineType'+iter);
//								
//				if(VlineName != null && VlineName != undefined && VlineName != ""){
//					theIndex = iter+PosCurvBar;
//					posLineLegend++;
//					this.addVerticalLine(theIndex, VlineName, VlineStyleSet, VlineVal, Vlinelbl, this.getProperty("LegendPosition"), VlineTp, posLineLegend);
//				}
//				else{
//					this.addVerticalLine(theIndex, VlineName, VlineStyleSet, VlineVal, Vlinelbl, this.getProperty("LegendPosition"), VlineTp, 0);
//				}
//				
//				/*if(VlineName != null || VlineName != undefined){
//					theIndex = iter+PosCurvBar;
//					this.addVerticalLine(theIndex, VlineName, VlineStyleSet, VlineVal, Vlinelbl, this.getProperty("legendPosition"), VlineTp);
//				}
//				else{
//					theIndex--;
//					this.addVerticalLine(iter, VlineName, VlineStyleSet, VlineVal, Vlinelbl, this.getProperty("legendPosition"), VlineTp);
//				}*/
//			}
//
//			// Calling addHorizontalLine function
//			for (var iter = 1; iter <= NbrOfHLines; iter++) {
//				var HlineName = this.getProperty(('HLineName' + iter).toString());
//				var HlineVal = this.getProperty(('HLineValue' + iter).toString());
//				var Hlinelbl = this.getProperty(('HLineLabel' + iter).toString());
//				var HlineStyleSet = TW.getStyleFromStyleDefinition(this.getProperty('HLineStyle'+iter));
//				var HlineTp = this.getProperty('HLineType'+iter);
//
//				if(HlineName != null && HlineName != undefined && HlineName != ""){
//					posLineLegend++;
//					this.addHorizontalLine(theIndex+iter, HlineName, HlineStyleSet, HlineVal, Hlinelbl, this.getProperty("LegendPosition"),HlineTp, posLineLegend);
//				}
//				else{
//					this.addHorizontalLine(theIndex+iter, HlineName, HlineStyleSet, HlineVal, Hlinelbl, this.getProperty("LegendPosition"),HlineTp, 0);
//				}
//			}
			
			this.createLines(PosCurvBar);
			this.showHideLegend(this.getProperty('LegendVisibility'));
			//************************************************************************************************************************  
		}
	};

	// Add title to the graph
  	this.addTitle = function (myTitle,status){
		if(status == true){
			var title = svg.append("text")
				.style("font-size","200%")
		  		.attr("y", 25)
			  	.attr("x",svg.attr("width")/2)
			  	.attr("dy", "1em")
			  	.attr("text-anchor", "middle")
			  	.style("font-weight","bold")
			  	.text(myTitle);
		}
	};
	
	// Add X Label to the graph
	this.addxLabel = function (myXLabel,status){
		// X axis legend
		if(status == true){
		  	var label = svg.append("text")
		  		.style("font-size","200%")
		  		.attr("y", height+margin.top+10)
		  		.attr("x",width+(margin.left*2))
		  		.attr("dy", "0.71em")
		  		.attr("text-anchor", "middle")
		  		.style("font-weight","bold")
			  	.text(myXLabel);
		}
	};
  	
  	// Add Y Label to the graph
	this.addyLabel = function (myYLabel,status){
		// Y axis legend
		if(status == true){
		  	var label = svg.append("text")
		  		.style("font-size","200%")
		  		.attr("transform", "rotate(-90)")
		  		.attr("y", margin.left-70)
			  	.attr("x",-height/2-margin.top)
			  	.attr("dy", "0.71em")
			  	.attr("text-anchor", "middle")
			  	.style("font-weight","bold")
			  	.text(myYLabel);
		}
	};
	
	// SVG creation function
	this.createSvg = function(){
		// Legend visible
		if(this.getProperty("LegendVisibility") == true){
			// Legend position = top right, bottom right
			if(this.getProperty("LegendPosition") == 0 || this.getProperty("LegendPosition") == 3){
				// Chart title visible
				if(this.getProperty("ChartTitleVisibility") == true){
					// Y Label visible
					if(this.getProperty("YLabelVisibility") == true){
						svg = d3.select("#"+cId+"");
							margin = {top: 100, right: 200, bottom: 50, left: 100};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
					// Y Label not visible
					else if(this.getProperty("YLabelVisibility") == false){
						svg = d3.select("#"+cId+"");
							margin = {top: 100, right: 200, bottom: 50, left: 50};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
					
				}
				// Chart title not visible
				else if(this.getProperty("ChartTitleVisibility") == false || this.getProperty("ChartTitleVisibility") == 0){
					// Y Label visible
					if(this.getProperty("YLabelVisibility") == true){
						svg = d3.select("#"+cId+"");
							margin = {top: 50, right: 200, bottom: 50, left: 100};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
					// Y Label not visible
					else if(this.getProperty("YLabelVisibility") == false){
						svg = d3.select("#"+cId+"");
							margin = {top: 50, right: 200, bottom: 50, left: 50};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
				}
			}
			// Legend position = top left, bottom left
			else if (this.getProperty("LegendPosition") == 1 || this.getProperty("LegendPosition") == 2){
				// Chart title visible
				if(this.getProperty("ChartTitleVisibility") == true){
					svg = d3.select("#"+cId+"");
						margin = {top: 100, right: 50, bottom: 50, left: 200};
						width = this.getProperty('Width') - margin.left - margin.right;
						height = this.getProperty('Height') - margin.top - margin.bottom;
				}
				// Chart title not visible
				else if(this.getProperty("ChartTitleVisibility") == false){
					svg = d3.select("#"+cId+"");
						margin = {top: 50, right: 50, bottom: 50, left: 200};
						width = this.getProperty('Width') - margin.left - margin.right;
						height = this.getProperty('Height') - margin.top - margin.bottom;
				}				
			}
		}
		// Legend not visible
		else if(this.getProperty("LegendVisibility") == false){
				// Chart title visible
				if(this.getProperty("ChartTitleVisibility") == true){
					// XLabel visible
					if(this.getProperty("XLabelVisibility") == true){
						// YLabel visible
						if(this.getProperty("YLabelVisibility") == true){
							svg = d3.select("#"+cId+"");
								margin = {top: 100, right: 200, bottom: 50, left: 100};
								width = this.getProperty('Width') - margin.left - margin.right;
								height = this.getProperty('Height') - margin.top - margin.bottom;
						}
						// YLabel not visible
						else if(this.getProperty("YLabelVisibility") == false){
							svg = d3.select("#"+cId+"");
								margin = {top: 100, right: 200, bottom: 50, left: 50};
								width = this.getProperty('Width') - margin.left - margin.right;
								height = this.getProperty('Height') - margin.top - margin.bottom;
						}
					}
					// XLabel not visible
					else if(this.getProperty("XLabelVisibility") == false){
						// YLabel visible
						if(this.getProperty("YLabelVisibility") == true){
							svg = d3.select("#"+cId+"");
								margin = {top: 100, right: 50, bottom: 50, left: 100};
								width = this.getProperty('Width') - margin.left - margin.right;
								height = this.getProperty('Height') - margin.top - margin.bottom;
						}
						// YLabel not visible
						else if(this.getProperty("YLabelVisibility") == false){
							svg = d3.select("#"+cId+"");
								margin = {top: 100, right: 50, bottom: 50, left: 50};
								width = this.getProperty('Width') - margin.left - margin.right;
								height = this.getProperty('Height') - margin.top - margin.bottom;
						}
					}
				}
				// Chart title not visible
				else if(this.getProperty("ChartTitleVisibility") == false){
					// YLabel visible
					if(this.getProperty("YLabelVisibility") == true){
						svg = d3.select("#"+cId+"");
							margin = {top: 50, right: 50, bottom: 50, left: 100};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
					// YLabel not visible
					else if(this.getProperty("YLabelVisibility") == false){
						svg = d3.select("#"+cId+"");
							margin = {top: 50, right: 50, bottom: 50, left: 50};
							width = this.getProperty('Width') - margin.left - margin.right;
							height = this.getProperty('Height') - margin.top - margin.bottom;
					}
					
				}
		}
	};
	
	// Bar axes creationg function
	this.createAxes = function(){
		axisColor = TW.getStyleFromStyleDefinition(this.getProperty('AxisColor'));
		
		// Max data value
		max = d3.max(barset, function(d) { return d[2]; })*1.2;
		min = d3.min(barset, function(d) { return d[2]; })*1.2;
		
		// Scaling
		xx = d3.scale.ordinal().rangeBands([0, width],.00, 0);
		xx.domain(barset.map(function(d) { return d[1]; }));
		x = d3.scale.linear().range([0, width-xx.rangeBand()]);
		y = d3.scale.linear().range([height, 0]);

		// Domains
		x.domain([d3.min(barset, function(d) { return d[0]; }), d3.max(barset, function(d) { return d[0]; })]);
		y.domain([min, max]);
		
		// Move canvas for margin
		g = svg.append("g")
			.attr("id","CanvasId")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// xAxis
		xAxis = d3.svg.axis()
			.scale(xx)
			.outerTickSize(0)
			.orient("bottom");
		
		// yuAxis
		yAxis = d3.svg.axis()
			.scale(y)
			.outerTickSize(0)
			.orient("left")
			.ticks(10);

		// Arrowheads
		defs = svg.append("defs");
		defs.append("marker")
		    .attr("id", "arrowhead"+aId)
		    .attr("refX", 0)
		    .attr("refY", 4)
		    .attr("markerWidth", 10)
		    .attr("markerHeight", 10)
		    .attr("orient", "auto")
		    .append("path")
		    .attr("d", "M0,0 L0,8 L9,4 z")
		    .style("fill", axisColor.lineColor);
		defs.append("marker")
		    .attr("id", "arrowheadtop"+aId)
		    .attr("refX", 0)
		    .attr("refY", 4)
		    .attr("markerWidth", 10)
		    .attr("markerHeight", 10)
		    .attr("orient", "-90")
		    .append("path")
		    .attr("d", "M0,0 L0,8 L9,4 z")
		    .style("fill", axisColor.lineColor);
	};
	
	// Bar Creation function
	this.addBar = function (title, style, styleHover, pos){
		// Bars
		barG = g.append("g")
			.attr("id", "barChart");
		bars = barG.selectAll(".bar")
			.data(barset).enter().append("g");

		bars.append("rect")
			.attr("x", function(d) { return xx(d[1]); })
			.attr("y", function(d) { return y(0);})
			.attr("width", xx.rangeBand()-1)
			.attr("height",0)
			.style("fill", style.lineColor)
			.on("mouseover", function(d) {
				d3.select(this).style("fill", styleHover.lineColor);
			}) 
			.on("mouseout", function(d) {
				d3.select(this).style("fill", style.lineColor);
			})
			.transition()
			.duration(1000) 
			.attr("height", function(d) { 
				return Math.abs( y(0)-y(d[2]));
			})
			.attr("y", function(d) {
				if (d[2] >= 0){
					return y(d[2]);
				} else {
					return y(0);
				}

			});

		bars.append("text")
			.text(function(d) {
				return d[2];
			})
			.attr("text-anchor", "middle")
			.attr("x", function(d) {
				return xx(d[1]) + xx.rangeBand()/2;
			})
			.attr("y", function(d) {
				if (d[2]>=0){
					return y(d[2])-5;
				}
				else{
					return y(d[2])+10;
				}
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			.attr("fill","black");

		bars.on("click", function(d, i) {
			thisWidget.setProperty('OutputData',i);
		});
	
			if(pos == 0){
				this.addBarLegend(title, style, -50,20);
			}
			else if(pos == 1){
				this.addBarLegend(title, style, -width-(margin.right*3), 20);
			}
			else if(pos == 2){
				this.addBarLegend(title, style, -width-(margin.right*3), height);
			}
			else if(pos == 3){
				this.addBarLegend(title, style, -50, (height));
			}
	};
	
	// Bar Legend Creation function
	this.addBarLegend = function (title, style, m, h){
		// Bar legend
		if(title.length != 0){
			var barlegend = svg
				.append("g")
				.attr("class", "legend")
				.attr("transform", "translate("+m+","+h+")")
				.style("cursor","pointer")
				.on("click", function(){
					//var barChart = "barChart"+aId;
					// Determine if current line is visible
					var active   = barChart.active ? false : true,
							newOpacity = active ? 0 : 1;
					newColor = active ?  "gray" : style.lineColor;	
					// Hide or show the elements
					svg.select("#barChart").style("opacity", newOpacity);
					svg.select(".rectLegend").style("fill", newColor);
					// Update whether or not the elements are active
					barChart.active = active;
				});
	
				barlegend.append("rect")
					.attr("class","rectLegend")
					.attr("x", svg.attr("width") - 18)
					.attr("width", 18)
					.attr("height", 18)
					.style("fill", style.lineColor);
	
				barlegend.append("text")
					.attr("class","rectLegend")
					.attr("x", svg.attr("width") - 24)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("text-anchor", "end")
					.text(title);
			}
		};

	// Curve creation function
	this.addCurve = function (title, style, position, pos){
		if(title.length != 0){
			// Function to draw interpolated curve
			valueline = d3.svg.line()
				.interpolate("monotone")
				.x(function(d) { return x(d[0]); })
				.y(function(d) { return y(d[1]); });

			var lineG = g.append("g")
			.attr("id","curve")
			.append("path")
			.style("fill","none")
			.style("stroke",style.lineColor)
			.style("stroke-width",style.lineThickness+"px")
			.attr("d", valueline(curveset));
			// add the dots with tooltips
			g.selectAll("dot")
			.data(curveset)
			.enter().append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { return x(d[0]); })
			.attr("cy", function(d) { return y(d[1]); })
			.style("opacity", 0)
			.on("mouseover", function(d) {
				tip.transition()
				.duration(500)
				.style("opacity", .9);
				tip.html(d[1])
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				tip.transition()
				.duration(500)
				.style("opacity", 0);
			});					
			if (style.lineStyle != "solid"){
				g.select("#curve")
				.style("stroke-dasharray","5,5");
			}
			var m,h;
			if(pos == 0){
				m = -50;
				h = 20*position+20;
			}
			else if(pos == 1){
				m = -width-(margin.right*3);
				h = (20*position+20);
			}
			else if(pos == 2){
				m = -width-(margin.right*3);
				h = (20*position+20+height-20);
			}
			else if(pos == 3){
				m = -50;
				h = (20*position+20+height-20);
			}
			
			// Creating curved line legend
			if(title.length != 0){
				var linelegend = svg
				.append("g")
				.attr("class", "legend")
				.attr("transform", "translate("+m+","+h+")")
				.style("cursor","pointer")
				.on("click", function(){
					// Determine if current line is visible
					var active   = curve.active ? false : true,
							newOpacity = active ? 0 : 1;
					newColor = active ?  "gray" : style.lineColor;
					// Hide or show the elements
					svg.select("#curve").style("opacity", newOpacity);
					svg.select(".curveLegend").style("stroke", newColor);
					// Update whether or not the elements are active
					curve.active = active;
				});

				// Add transparent Rect for onClick Event
				linelegend.append("rect")
				.attr("x", svg.attr("width") - 18)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", "#FFFFFF")
				.style("fill-opacity", "0");

				linelegend.append("line")
				.attr("class","curveLegend")
				.style("fill","none")
				.style("stroke",style.lineColor)
				.style("stroke-width", style.lineThickness+"px")
				.attr("x1", svg.attr("width") - 18)
				.attr("x2", svg.attr("width"))
				.attr("y1", 10) 
				.attr("y2", 10)
				.style("fill", style.lineColor);

				if (style.lineStyle != "solid"){
					linelegend.select("line")
					.style("stroke-dasharray","5,5");
					g.select("line")
					.style("stroke-width", style.lineThickness+"px");
				}

				linelegend.append("text")
				.attr("class","curveLegend")
				.attr("x", svg.attr("width") - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(title);	
			}
		}
	};

	
//	this.addCurveLegend = function (title, style, m, h){
//		// Line legend
//		var linelegend = svg
//		.append("g")
//		.attr("class", "legend")
//		.attr("transform", "translate("+m+","+h+")")
//		.style("cursor","pointer")
//		.on("click", function(){
//			// Determine if current line is visible
//			var active   = curve.active ? false : true,
//					newOpacity = active ? 0 : 1;
//			newColor = active ?  "gray" : style.lineColor;
//			// Hide or show the elements
//			svg.select("#curve").style("opacity", newOpacity);
//			svg.select(".curveLegend").style("stroke", newColor);
//			// Update whether or not the elements are active
//			curve.active = active;
//		});
//
//		// Add transparent Rect for onClick Event
//		linelegend.append("rect")
//		.attr("x", svg.attr("width") - 18)
//		.attr("width", 18)
//		.attr("height", 18)
//		.style("fill", "#FFFFFF")
//		.style("fill-opacity", "0");
//
//		linelegend.append("line")
//		.attr("class","curveLegend")
//		.style("fill","none")
//		.style("stroke",style.lineColor)
//		.style("stroke-width", style.lineThickness+"px")
//		.attr("x1", svg.attr("width") - 18)
//		.attr("x2", svg.attr("width"))
//		.attr("y1", 10) 
//		.attr("y2", 10)
//		.style("fill", style.lineColor);
//
//		if (style.lineStyle != "solid"){
//			linelegend.select("line")
//			.style("stroke-dasharray","5,5");
//			g.select("line")
//			.style("stroke-width", style.lineThickness+"px");
//		}
//
//		linelegend.append("text")
//		.attr("class","curveLegend")
//		.attr("x", svg.attr("width") - 24)
//		.attr("y", 9)
//		.attr("dy", ".35em")
//		.style("text-anchor", "end")
//		.text(title);	
//	};
	
	// Vertical line creation function
	this.addVerticalLine = function (index, title, style, posx, label, pos, type, posLineLegend){
		var line = g.append("line")
		.attr("id", "line"+index)
		.attr("y1", y(0))
		.attr("y2", y(max))
		.attr("x1", xx(posx))
		.attr("x2", xx(posx));
		if(type==0){
			svg.select("#line"+index).style("stroke","black")
			.style("stroke-width","2px");
		}
		if(type==1){
			svg.select("#line"+index).style("stroke","black")
			.style("stroke-width","2px")
			.style("stroke-dasharray","5,5");
		}		  	
		//Label
		if (label != undefined){
			//Text on simple line
			svg.append("text")
			.attr("id","text"+index)
			.attr("y", margin.top-20)
			.attr("x",xx(posx)+margin.left)
			.attr("dy", "0.71em")
			.attr("text-anchor", "middle")
			.text(label);
		}
		if (posLineLegend != 0) {
			if(pos == 0){
				this.addVerticalLineLegend(index, title, style, posx, label, line, -50, (20*posLineLegend+20), type);
			}
			else if(pos == 1){
				this.addVerticalLineLegend(index, title, style, posx, label, line, -width-(margin.right*3), (20*posLineLegend+20), type);
			}
			else if(pos == 2){
				this.addVerticalLineLegend(index, title, style, posx, label, line, -width-(margin.right*3), (20*posLineLegend+20+height-20)), type;
			}
			else if(pos == 3){
				this.addVerticalLineLegend(index, title, style, posx, label, line, -50, (20*posLineLegend+20+height-20), type);
			}			
		}
	};
	
	// Vertical line legend creation function
	this.addVerticalLineLegend = function (index, title, style, posx, label, line, m, h, type){
		// Line legend
		if(title.length != 0 || index != 0){
			var linelegend = svg
			.append("g")
			.attr("class", "legend")
			.attr("transform", "translate("+m+","+h+")")
			.style("cursor","pointer")
			.on("click", function(){
				// Determine if current line is visible
				var active   = line.active ? false : true,
						newOpacity = active ? 0 : 1;
				newColor = active ?  "gray" : "black";
				// Hide or show the elements
				svg.select("#line"+index).style("opacity", newOpacity);
				svg.select("#text"+index).style("opacity", newOpacity);
				svg.select(".vlineLegend"+index).style("stroke",newColor)
				// Update whether or not the elements are active
				line.active = active;
			});

			// Add transparent Rect for onClick Event
			linelegend.append("rect")
			.attr("x", svg.attr("width") - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", "#FFFFFF")
			.style("fill-opacity", "0");

			linelegend.append("line")
			.attr("class","vlineLegend"+index)
			.style("fill","none")
			.style("stroke","black")
			.style("stroke-width","3px")
			.attr("x1", svg.attr("width") - 18)
			.attr("x2", svg.attr("width"))
			.attr("y1", 10) 
			.attr("y2", 10);

			if (type == 1){
				linelegend.select("line")
				.style("stroke-dasharray","5,5");
			}

			linelegend.append("text")
			.attr("class","vlineLegend"+index)
			.attr("x", svg.attr("width") - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(title);
		}
	};

	// Horizontal line creation function
	this.addHorizontalLine = function (index, title, style, posy, label, pos, type, posLineLegend){
		// Simple line
		var line = g.append("line")
		.attr("id", "line"+index)
		.attr("y1", y(posy))
		.attr("y2", y(posy))
		.attr("x1", 0)
		.attr("x2", width);

		if(type==0){
			svg.select("#line"+index).style("stroke","green")
			.style("stroke-width","2px");
		}
		if(type==1){
			svg.select("#line"+index).style("stroke","green")
			.style("stroke-width","2px")
			.style("stroke-dasharray","5,5");
		}	

		//Label
		if (label != undefined){
			//Text on simple line
			svg.append("text")
			.attr("id","text"+index)
			.attr("y",y(posy)+margin.top+5)
			.attr("x",width+margin.left)
			.attr("dy", "0.71em")
			.attr("text-anchor", "middle")
			.text(label);
		}
		
		if (posLineLegend != 0) {
			if(pos == 0){
				this.addHorizontalLineLegend(index, title, style, posy, label, line, -50, (20*posLineLegend+20), type);
			}
			else if(pos == 1){
				this.addHorizontalLineLegend(index, title, style, posy, label, line, -width-(margin.right*3), (20*posLineLegend+20), type);
			}
			else if(pos == 2){
				this.addHorizontalLineLegend(index, title, style, posy, label, line, -width-(margin.right*3), (20*posLineLegend+20+height-20), type);
			}
			else if(pos == 3){
				this.addHorizontalLineLegend(index, title, style, posy, label, line, -50, (20*posLineLegend+20+height-20), type);
			}			
		}		
	}
	
	// Horizontal line legend creation function
	this.addHorizontalLineLegend = function (index, title, style, posy, label, line, m, h, type){
		if(title.length != 0 || index != 0){
			// Line legend
			var linelegend = svg
			.append("g")
			.attr("class", "legend")
			.attr("transform", "translate("+m+","+h+")")
			.style("cursor","pointer")
			.on("click", function(){
				// Determine if current line is visible
				var active   = line.active ? false : true,
						newOpacity = active ? 0 : 1;
				newColor = active ?  "gray" : "green";
				// Hide or show the elements
				svg.select("#line"+index).style("opacity", newOpacity);
				svg.select("#text"+index).style("opacity", newOpacity);
				svg.select(".hlineLegend"+index).style("stroke",newColor)
				// Update whether or not the elements are active
				line.active = active;
			});

			// Add transparent Rect for onClick Event
			linelegend.append("rect")
			.attr("x", svg.attr("width") - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", "#FFFFFF")
			.style("fill-opacity", "0");

			linelegend.append("line")
			.attr("class","hlineLegend"+index)
			.style("fill","none")
			.style("stroke","green")
			.style("stroke-width","3px")
			.attr("x1", svg.attr("width") - 18)
			.attr("x2", svg.attr("width"))
			.attr("y1", 10) 
			.attr("y2", 10)
			.style("fill", "red");


			if (type == 1){
				linelegend.select("line")
				.style("stroke-dasharray","5,5");
			}

			linelegend.append("text")
			.attr("class","hlineLegend"+index)
			.attr("x", svg.attr("width") - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(title);	
		}
	};
	
	// Legend visibility function
	this.showHideLegend = function (status){
		if(status==true){
			d3.selectAll(".legend").style("display", "block");
		}
		else if(status==false){
			d3.selectAll(".legend").style("display", "none");
		}
	};
	
	// Append VLines/HLines in graph function
	this.createLines = function(PosCurvBar){
		theIndex = 0;
		posLineLegend = PosCurvBar;
        // Calling addVerticalLine function          
        vLineData = widgetProperties['VLineData'];
        
        if(vLineData != null && vLineData != undefined){
              var vLineDataLength = vLineData.rows.length;

              for (var i = 0; i < vLineDataLength; i++) {     
                     var row = vLineData.rows[i];
                     var lineLabel = row["lineLabel"];
                     var lineValue = row["lineValue"];
                     var lineName = row["lineName"];
                     
                     if(lineName != null && lineName != undefined && lineName != ""){
                    	 theIndex = i+1+PosCurvBar;
                         posLineLegend++;
                         this.addVerticalLine(theIndex, lineName, "DefaultVLineStyle"+i, lineValue, lineLabel, this.getProperty("LegendPosition"), 0, posLineLegend);
                     }
                     else{
                    	 theIndex = i;
                    	 this.addVerticalLine(theIndex, lineName, "DefaultVLineStyle"+i, lineValue, lineLabel, this.getProperty("LegendPosition"), 0, 0);
                     }
              }
        }
        
        
        // Calling addHorizontalLine function    
        hLineData = widgetProperties['HLineData'];
        
        if(hLineData != null && hLineData != undefined){
              var hLineDataLength = hLineData.rows.length;

              for (var j = 0; j < hLineDataLength; j++) {     
                     var row = hLineData.rows[j];
                     var lineLabel = row["lineLabel"];
                     var lineValue = row["lineValue"];
                     var lineName = row["lineName"];
                     if(lineName != null && lineName != undefined && lineName != ""){
                            posLineLegend++;
                            count = theIndex+j+1;
                            this.addHorizontalLine(count, lineName, "DefaultHLineStyle"+j, lineValue, lineLabel, this.getProperty("LegendPosition"), 0, posLineLegend);
                     }
                     else{
                            this.addHorizontalLine(count, lineName, "DefaultHLineStyle"+j, lineValue, lineLabel, this.getProperty("LegendPosition"), 0, 0);
                     }
              }
        }

	}
};