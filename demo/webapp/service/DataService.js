/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/ui/base/Event"
], function (Object, JSONModel, Log, BaseEvent) {
    "use strict";
    let instance;

    /**
     * @class Manages the config parameterset operations
     * @author Wolfgang Haag
     * @public
     */
    let Service = Object.extend("syshubDemo.service.DataService", {

        /**
         * Constructor
         * @public
         */
        constructor: function () {
        },


        /**
         * @public
         * Gets a array of jobs regarding the parameter
         * @callback callBackHandler
         * @param {number} offset - Offset to get the jobs
         * @param {number} limit - Limit how much jobs to get
         * @param {string} [orderBy] - Jobs ordered by
         * @param {string} [search] - Search query to get the jobs (RSQL-Syntax)
         */
        getData: function (callBackHandler, offset, limit, orderBy, search){

            let oHeaders = {
                "content-type" : "application/json"
            };

            orderBy = orderBy === undefined ?"&orderby=id.desc":"&orderby=" + orderBy;
            search = search === undefined?"":"&search=" + search;

            let sUrl = "/data/" + "list?offset=" + offset + "&limit=" + limit + orderBy + search;
            jQuery.ajax({
                url: sUrl,
                headers: oHeaders,
                type: "GET",
                success: function(oData, s1, jqXHR) {
                    let absCount = jqXHR.getResponseHeader("abs_count");
                    let highestId = jqXHR.getResponseHeader("highest_id");
                    callBackHandler.onSuccess(new JSONModel(oData), parseInt(absCount), parseInt(highestId));
                },
                // eslint-disable-next-line no-unused-vars
                error: function(XMLHttpRequest, textStatus){
                    let oErrorObject ={
                        "textStatus" : textStatus,
                        "responseText" : XMLHttpRequest.responseText,
                        "statusCode" : XMLHttpRequest.status
                    };
                    let oParameter = {
                        "errorobject" : oErrorObject,
                        "url" : sUrl
                    };
                    let oEvent = new BaseEvent("id", undefined, oParameter );
                    sap.m.MessageBox.error(oEvent);
                }

            });



        }

    });

    return {
        /**
         * Gets the singleton instance
         * @returns {Service} The instance of the class
         */
        getInstance: function () {
            if (!instance) {
                instance = new Service();
            }
            return instance;
        }
    };
});