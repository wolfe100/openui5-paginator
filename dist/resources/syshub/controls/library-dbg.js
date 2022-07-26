/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
        "sap/ui/core/library", // library dependency
        "sap/ui/layout/library", // library dependency
        "sap/ui/unified/library"], // library dependency
    function() {

        "use strict";
        /**
         * Common syshub basic controls.
         *
         * @namespace syshub.controls
         * @version 1.0.0
         * @public
         */

        // delegate further initialization of this library to the Core
        let thisLib = sap.ui.getCore().initLibrary({
            name : "syshub.controls",
            version: "1.0.0",
            dependencies : ["sap.ui.core","sap.ui.layout","sap.ui.unified"],
            types: [
                "syshub.controls.PaginatorEvent"
            ],
            interfaces: [
            ],
            controls: [
                "syshub.controls.Paginator"
            ],
            elements: [
            ]
        });

        /**
         * Distinct paginator event types
         *
         * @enum {string} String representation of the enum
         * @public
         * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) design time metamodel
         */
        thisLib.PaginatorEvent = {

            /**
             * First page event
             * @public
             */
            First : "First",

            /**
             * Previous page event
             * @public
             */
            Previous : "Previous",

            /**
             * Go to page event
             * @public
             */
            Goto : "Goto",

            /**
             * Next page event
             * @public
             */
            Next : "Next",

            /**
             * Last page event
             * @public
             */
            Last : "Last"

        };
        return thisLib;
    });