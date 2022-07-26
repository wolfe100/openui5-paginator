/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/layout/library","sap/ui/unified/library"],function(){"use strict";let i=sap.ui.getCore().initLibrary({name:"syshub.controls",version:"1.0.0",dependencies:["sap.ui.core","sap.ui.layout","sap.ui.unified"],types:["syshub.controls.PaginatorEvent"],interfaces:[],controls:["syshub.controls.Paginator"],elements:[]});i.PaginatorEvent={First:"First",Previous:"Previous",Goto:"Goto",Next:"Next",Last:"Last"};return i});