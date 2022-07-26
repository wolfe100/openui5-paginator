/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],
    function() {
        "use strict";


        /**
         * Paginator renderer.
         * @namespace
         */
        let PaginatorRenderer = {};

        /**
         * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
         * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
         * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be rendered
         */
        PaginatorRenderer.render = function(oRm, oPaginator){

            this.rb = sap.ui.getCore().getLibraryResourceBundle("syshub.controls");

            oRm.write("<div ");
            oRm.writeControlData(oPaginator);
            oRm.writeAccessibilityState(oPaginator, {
                role: "toolbar",
                labelledby: oPaginator.getId() + "-accDesc"
            });
            oRm.write(">");

            this.renderPaginator(oRm, oPaginator);


        };

        /**
         * Builds the paginator
         * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
         * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be rendered
         */
        PaginatorRenderer.renderPaginator = function(oRm, oPaginator) {
            // First check if number of page is 1 or less, in this case, we do not render the paginator
            let numberOfPages = 0;
            if(oPaginator.getEntriesAbsolute() === 0){
                return;
            }else{
                numberOfPages = Math.ceil(oPaginator.getEntriesAbsolute() / oPaginator.getEntriesPerPage());
            }

            oPaginator.numberOfPages = numberOfPages;

            if (oPaginator.numberOfPages < 1) {
                return;
            }

            // Buffer paginator id for other ids concatenation
            let paginatorId = oPaginator.getId();
            let iCurrentPage = oPaginator.getCurrentPage();

            oRm.write("<div id='" + paginatorId + "--busyIndicator' class='UiPagSpinner UiPagLeft' >");
            oRm.write("</div>");

            /***********************************************************************************
             * Render the summary info
             ***********************************************************************************/
            oRm.write(PaginatorRenderer.getSummaryHtml(oPaginator, iCurrentPage));

            oRm.write("<div id='" + paginatorId + "--right' class='UiPagRight' >");

            /************************************************************************************
             * Render the Page 1 (first page link) when necessary, back arrow, back link
             ************************************************************************************/

            let navArrowsBackward = (iCurrentPage === 1) ? " UiPagNavDisabled" : " UiPagNav";

            // First page link must only appear when at least NumberOfVisiblePages pages are available
            if (oPaginator.numberOfPages > oPaginator.getNumberOfVisiblePages()) {
                oRm.write("<span id='" + paginatorId + "--firstPageLink' title='");
                oRm.writeEscaped(this.rb.getText("FIRST_PAGE"));
                oRm.write("' class='" + navArrowsBackward +"'>");
                oRm.write("&#xe1bf");
                oRm.write("</span>");
            }
            oRm.write("<span id='" + paginatorId + "--backLink' title='");
            oRm.writeEscaped(this.rb.getText("PREVIOUS_PAGE"));
            oRm.write("' class='" + navArrowsBackward +"'>");
            oRm.write("&#xe1eb");
            oRm.write("</span>");



            /************************************************************************************
             * Render the page numbers in a list
             *************************************************************************************/
            if(oPaginator.getPageHolderWidth() > 0){
                oRm.write("<ul id='" + paginatorId + "-pages' style='width: "  + oPaginator.getPageHolderWidth()  + "px' role='presentation'>");
            }else{
                oRm.write("<ul id='" + paginatorId + "-pages'  role='presentation'>");
            }
            oRm.write(PaginatorRenderer.getPagesHtml(paginatorId, oPaginator._calculatePagesRange(), oPaginator.getCurrentPage(), true));
            oRm.write("</ul>");



            /************************************************************************************
             * Render the forward link, forward arrow and last page link when necessary
             *************************************************************************************/
            let navArrowsForward = (iCurrentPage === oPaginator.numberOfPages) ? " UiPagNavDisabled" : " UiPagNav";

            oRm.write("<span id='" + paginatorId + "--forwardLink' title='");
            oRm.writeEscaped(this.rb.getText("NEXT_PAGE"));
            oRm.write("' class='" + navArrowsForward +"'>");
            oRm.write("&#xe066");
            oRm.write("</span>");
            if (oPaginator.numberOfPages > oPaginator.getNumberOfVisiblePages()) {
                oRm.write("<span id='" + paginatorId + "--lastPageLink' title='");
                oRm.writeEscaped(this.rb.getText("LAST_PAGE"));
                oRm.write("' class='" + navArrowsForward +"'>");
                oRm.write("&#xe1c0");
                oRm.write("</span>");
            }

            if(oPaginator.getShowGoto() === true){
                oRm.write(PaginatorRenderer.getGotoHtml(paginatorId, oPaginator));
            }

            oRm.write("</div>");
        };

        /**
         * Renders the pages
         * @param {string} sPaginatorId - the Paginator id
         * @param oRange
         * @param {int} currentPage - the current page
         * @param {boolean} visible - for the animation
         * @return {string} - the html array
         */
        PaginatorRenderer.getPagesHtml = function(sPaginatorId, oRange, currentPage, visible) {
            let aHtml = [];

            // each single page link is an <li> with an <a> inside
            for (let i = oRange.firstPage; i <= oRange.lastPage; i++) {
                aHtml.push("<li id='" + sPaginatorId + "-li--" + i + "' class='UiPagPage");
                aHtml.push((i === currentPage) ? " UiPagCurrentPage'" : "'");
                if (!visible) { // for those items to be animated into view
                    aHtml.push(" style='display:none'");
                }
                aHtml.push(">");
                aHtml.push("<span id='" + sPaginatorId + "-span--" + i + "' title='");
                if (i === currentPage) {
                    aHtml.push(this.rb.getText("PAGINATOR_CURRENT_PAGE", [i]));
                } else {
                    aHtml.push(this.rb.getText("PAGINATOR_OTHER_PAGE", [i]));
                }
                aHtml.push("' class='UiPagPage'>" + i + "</span>");
                aHtml.push("</li>");
            }

            return aHtml.join("");
        };

        /**
         * Renders the summary info
         * @param {string} oPaginator - the paginator
         * @param {int} currentPage - the current page to show
         * @return {string} - the html array
         */
        PaginatorRenderer.getSummaryHtml = function (oPaginator, currentPage){

            let beginEntries = 1;
            let endEntries = oPaginator.getEntriesPerPage();

            if(currentPage > 1){
                beginEntries = (currentPage * endEntries) - (endEntries -1);
                endEntries = endEntries * currentPage;
            }

            endEntries = endEntries > oPaginator.getEntriesAbsolute()?oPaginator.getEntriesAbsolute():endEntries;

            let aHtml = [];

            aHtml.push("<div id='" + oPaginator.getId() + "-summary' class='UiPagLeft'>");
            aHtml.push("<span>" + this.rb.getText("SUMMARY_INFO", [beginEntries, endEntries, oPaginator.getEntriesAbsolute()]) + "</span>");

            if(oPaginator.getEntriesPerPageVisible()) {
                let entries = oPaginator.getEntriesPerPage();
                let range = oPaginator.getEntriesPerPageSelectionValues().split(",");
                aHtml.push("<span> " + this.rb.getText("SUMMARY_INFO1") + "</span>");
                aHtml.push("<select id='" + oPaginator.getId() + "--entriesPerPageSelection'   class='sapMInputBaseContentWrapper UiPagEntrySelect'>");
                range.forEach(function(val) {
                    let iVal = parseInt(val);
                    if(iVal === entries){
                        aHtml.push("<option selected value='" + iVal +"'>" + iVal + "</option>");
                    }else{
                        aHtml.push("<option value='" + iVal +"'>" + iVal + "</option>");
                    }
                });
                aHtml.push("</select>");
                aHtml.push("<span>" + this.rb.getText("SUMMARY_INFO2") + "</span>");
            }
            aHtml.push("</div>");

            return aHtml.join("");


        };

        PaginatorRenderer.getGotoHtml = function (sPaginatorId, oPaginator){
            let aHtml = [];
            aHtml.push("<span id='" + sPaginatorId + "--gotoPageLink' class='UiPagGotoButton'>" + this.rb.getText("GOTO")  + "</span>");
            aHtml.push("<input id='" + sPaginatorId + "--gotoPageValue' type='number'  min='1'  step='1' placeholder='" + oPaginator.numberOfPages + "'  class='sapMInputBaseContentWrapper UiPagGotoInput'/>") ;
            return aHtml.join("");
        };



        /**
         * Updates the back/first/next/last page links
         * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be updated
         * @private
         */
        PaginatorRenderer.updateBackAndForward = function(oPaginator) {
            let page = oPaginator.getCurrentPage();
            let id = oPaginator.getId();

            let isFirst = (page === 1);
            let isLast = (page === oPaginator.numberOfPages);

            $("#"+ id + "--firstPageLink").toggleClass("UiPagNav", !isFirst).toggleClass("UiPagNavDisabled", isFirst);
            $("#"+ id + "--backLink").toggleClass("UiPagNav", !isFirst).toggleClass("UiPagNavDisabled", isFirst);
            $("#"+ id + "--forwardLink").toggleClass("UiPagNav", !isLast).toggleClass("UiPagNavDisabled", isLast);
            $("#"+ id + "--lastPageLink").toggleClass("UiPagNav", !isLast).toggleClass("UiPagNavDisabled", isLast);

        };

        return PaginatorRenderer;

    }, /* bExport= */ true);
