TW.Runtime.Widgets.getparamurl= function () {
	var valueElem;
	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName). In
		// this example, we'll just return static HTML
		return 	'<div class="widget-content widget-getparamurl">' +
					'<span class="getparamurl-property">' + this.getProperty('outputParam') + '</span>' +
				'</div>';
	};
	
	this.findParamByName = function(name) {
	    var url = window.location.href;
	    var regexS = "[\\?&]"+name+"=([^&#]*)";
	    var regex = new RegExp( regexS );
	    var results = regex.exec( url );
	    return results == null ? null : results[1];
	    return url;
	}
	
	this.afterRender = function () {
		var myParam = this.getProperty('inputParam');
		var returnedParam = this.findParamByName(myParam);
		this.setProperty('outputParam',returnedParam);
	};
	
	// this is called on your widget anytime bound data changes
	this.updateProperty = function (updatePropertyInfo) {
		// TargetProperty tells you which of your bound properties changed
		if (updatePropertyInfo.TargetProperty === 'inputParam') {
			valueElem.text(updatePropertyInfo.SinglePropertyValue);
			this.setProperty('inputParam', updatePropertyInfo.SinglePropertyValue);
		}
	};
};