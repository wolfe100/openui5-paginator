/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/base/util/UriParameters"
], function (MockServer, UriParameters) {
    "use strict";

    return {


        init: function () {

            // configure mock server with a delay, this is only to show the spinner.
            MockServer.config({
                autoRespond: true,
                autoRespondAfter:  300
            });

            let dataCollection = {
                method: "GET",
                path: new RegExp("list(.*)"),
                response: function (oXhr, sUrlParams) {

                    let paramString = sUrlParams.split('?')[1];
                    let queryParams = new URLSearchParams(paramString);

                    let offset = Number.parseInt(queryParams.get("offset"));
                    let limit = Number.parseInt(queryParams.get("limit"));
                    let absCount = 1120;

                    if(this.oData === undefined) {
                        this.oData = [];

                        //We simulate an order by id desc
                        for (let i = absCount; i > 0; i--) {
                            let oEntry = {
                                id: i,
                                type: "Type_" + (i),
                                title: "Title_" + (i),
                                user: "User_" + (i),
                                description: "Description_" + (i),
                                custom1: "Custom1_" + (i),
                                custom2: "Custom2_" + (i),
                                custom3: "Custom3_" + (i),
                                custom4: "Custom4_" + (i)
                            }
                            this.oData.push(oEntry);
                        }
                    }

                    let res = this.oData.slice(offset, offset + limit);

                    //Normally we worked with the highest id. This means, the first query we get a snapshot of the table
                    //We put the highest is to the header result. All other queries with the paging mechanism uses in
                    // the query this id (in SQL: select * from table where id < highest_id order by id desc offset 10 limit 10
                    // In this example we don't use this mechanism, because we have a fixed table which is not growing up.

                    oXhr.respondJSON(200, {"abs_count": absCount, "highest_id" : (absCount) },res);
                }
            };


            // create
            this.oMockServer = new MockServer({
                rootUri: "/data/",
                requests: [dataCollection]
            });


            // start
            this.oMockServer.start();
        }
    };

});