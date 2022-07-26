/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
    "use strict";

    new ComponentContainer({
        name: "syshubDemo",
        settings : {
            id : "webapp"
        },
        async: true
    }).placeAt("content");
});