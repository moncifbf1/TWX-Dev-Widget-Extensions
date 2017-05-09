TW.IDE.Widgets.getparamurl = function () {
	this.widgetProperties = function () {
		return {
			'name': 'getParamUrl',
			'description': 'Widget that get parameter from url',
			'category': ['Common'],
			'isResizable': false,
			'supportsLabel': false,
			'properties': {
				'outputParam': {
					'baseType': 'STRING',
					'description': 'Name of the parameter that you want to return',
					'isBindingSource': true,
					'warnIfNotBoundAsTarget': true,
					'isVisible': true
				},
				'inputParam':{
					'baseType': 'STRING',
					'description': 'Name of the parameter that you want to return',
					'isBindingTarget': true,
					'warnIfNotBoundAsTarget': true,
					'isVisible': true
				}
			}
		}
	};

	this.afterSetProperty = function (name, value) {
		var thisWidget = this;
		var refreshHtml = false;
		switch (name) {
			case 'Style':
			case 'inputParam':
			case 'Alignment':
				refreshHtml = true;
				break;
			default:
				break;
		}
		return refreshHtml;
	};

	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName).
		return 	'<div class="widget-content widget-getparamurl">' +
					'<span class="getparamurl-property">' + this.getProperty('inputParam') + '</span>' +
				'</div>';
	};

	this.afterRender = function () {
		// NOTE: this.jqElement is the jquery reference to your html dom element
		// 		 that was returned in renderHtml()

		// get a reference to the value element
		valueElem = this.jqElement.find('.getparamurl-property');
		// update that DOM element based on the property value that the user set
		// in the mashup builder
		valueElem.text(this.getProperty('inputParam'));
	};
};