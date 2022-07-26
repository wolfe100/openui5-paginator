/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	    "sap/ui/core/UIComponent",
		"syshubDemo/localService/mockserver"
	], function(UIComponent, mockserver) {
	"use strict";
	return UIComponent.extend("syshubDemo.Component", {
		metadata: {
			manifest: "json"
		},

		init : function(){
			UIComponent.prototype.init.apply(this, arguments);
			mockserver.init();
		}
	});
});