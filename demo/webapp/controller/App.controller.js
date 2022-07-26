/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"syshubDemo/service/DataService"
], function(Controller, JSONModel, DataService) {
	"use strict";

	return Controller.extend("syshubDemo.controller.App", {
		onInit  : function() {
			let oData = {
				currentPage : 1,
				entriesAbsolute : 0, //Initial Value
				entriesPerPage : 20,
				showSpinner: false,
				highestId : 0,

			};
			this.getView().setModel(new JSONModel(oData), "modelEntriesMetadata");

		},

		onGetData : function(){
			this.getView().byId("idGetData").setEnabled(false);

			let callBackHandler = {
				onSuccess: function(oData, absCount, highestId){
					this.getView().setModel(oData, "modelEntries");
					this.getView().getModel("modelEntriesMetadata").setProperty("/entriesAbsolute", absCount);
					this.getView().getModel("modelEntriesMetadata").setProperty("/highestId", highestId);
					this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", false);
				}.bind(this)
			}
			let entriesPerPage = this.getView().getModel("modelEntriesMetadata").getProperty("/entriesPerPage");
			//This has no function in this implementation but in real world it should be handled
			let highestId = this.getView().getModel("modelEntriesMetadata").getProperty("/highestId");
			let search = highestId === 0 ? "": "id < " + highestId;
			this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", true);
			DataService.getInstance().getData(callBackHandler,0, entriesPerPage, "id.desc", "search");
		},


		onPage : function(oEvent){
			let highestId = this.getView().getModel("modelEntriesMetadata").getProperty("/highestId");
			let search = highestId === 0 ? "": "id < " + highestId;
			let offset = oEvent.getParameter("offset");
			let limit = oEvent.getParameter("limit");

			let callBackHandler = {
				onSuccess: function(oData, absCount, highestId){
					this.getView().setModel(oData, "modelEntries");
					this.getView().getModel("modelEntriesMetadata").setProperty("/entriesAbsolute", absCount);
					this.getView().getModel("modelEntriesMetadata").setProperty("/highestId", highestId);
					this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", false);
				}.bind(this)
			}
			this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", true);
			DataService.getInstance().getData(callBackHandler,offset, limit, "id.desc", "search");

		},

		onEntriesPerPageChanged : function(oEvent){
			let highestId = this.getView().getModel("modelEntriesMetadata").getProperty("/highestId");
			let search = highestId === 0 ? "": "id < " + highestId;
			let offset = 0;
			this.getView().getModel("modelEntriesMetadata").setProperty("/currentPage", 1);
			let limit = oEvent.getParameter("limit");

			let callBackHandler = {
				onSuccess: function(oData, absCount, highestId){
					this.getView().setModel(oData, "modelEntries");
					this.getView().getModel("modelEntriesMetadata").setProperty("/entriesAbsolute", absCount);
					this.getView().getModel("modelEntriesMetadata").setProperty("/highestId", highestId);
					this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", false);
				}.bind(this)
			}
			this.getView().getModel("modelEntriesMetadata").setProperty("/showSpinner", true);
			DataService.getInstance().getData(callBackHandler,offset, limit, "id.desc", "search");
		}


	});
});