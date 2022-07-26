/*
 * Copyright (c) NT-ware ES 2008-2023. All Rights Reserved.
 * Internet : https://www.nt-ware.com
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
        "jquery.sap.global",
        "sap/ui/core/Control",
        "./library",
        "./PaginatorRenderer"
    ],
    function(jQuery, Control, library, PaginatorRenderer ) {
        "use strict";

        let PaginatorEvent = library.PaginatorEvent;

        /**
         * Constructor for a new Paginator.
         *
         * @param {string} [sId] ID for the new control, generated automatically if no ID is given
         * @param {object} [mSettings] Initial settings for the new control
         *
         * @class
         * Provides navigation between pages within a list of numbered pages.
         * @extends sap.ui.core.Control
         * @version 20.01.0
         *
         * @constructor
         * @public
         * @alias syshub.controls.Paginator
         */
        let Paginator = Control.extend("syshub.controls.Paginator",  { metadata : {

                library : "syshub.controls",
                properties : {

                    /**
                     * Represents the current page (first page has an index 1, not 0, to match the visual number)
                     */
                    currentPage : {type : "int", group : "Misc", defaultValue : 1},

                    /**
                     * Represents the overall number of pages that are embedded into the parent control
                     */
                    numberOfVisiblePages : {type : "int", group : "Misc", defaultValue : 5},

                    /**
                     * Represents the total count of the rows to display
                     */
                    entriesAbsolute: {type: "int", group: "Misc", defaultValue: null},

                    /**
                     * Represents the displayed rows inside the page, please use steps count 10
                     */
                    entriesPerPage: {type: "int", group: "MISC", defaultValue: 100},
                    /**
                     * The possible selection values to set the rows visible by the user. Must include the entriesPerPage value.
                     * The values must be separated by comma
                     */
                    entriesPerPageSelectionValues: {type: "string", group: "MISC", defaultValue: "10,20,30,40,50,60,70,80,90,100"},
                    /**
                     * Visibility of the selection by the user
                     */
                    entriesPerPageVisible:  {type: "boolean", group: "MISC", defaultValue: true},

                    /**
                     * Represents the width of the pages-holder, useful to have no movements of the page navigators
                     */
                    pageHolderWidth: {type: "int", group: "MISC"},

                    /**
                     * Should the Goto section shown
                     */
                    showGoto: {type: "boolean", group: "MISC", defaultValue: true},


                    showSpinner: {type: "boolean", group: "Misc", defaultValue: false}



                },
                events : {

                    /**
                     * Event is fired when the user navigates to another page by selecting it directly, or by jumping forward/backward.
                     */
                    page : {
                        parameters : {

                            /**
                             * The page which is the current one before the page event is fired (and another page is displayed)
                             */
                            srcPage : {type : "int"},

                            /**
                             * The page that shall be displayed next after the page event is fired.
                             *
                             * The page number is 1-based: the first page has an index 1, not 0, to match the number visible in the UI.
                             */
                            targetPage : {type : "int"},

                            /**
                             * The offset where to start the new query
                             */
                            offset: {type: "int"},

                            /**
                             * The limit how many entries must get
                             */
                            limit: {type: "int"},

                            /**
                             * Provides the values 'First', 'Last', 'Next', 'Previous', 'Goto'. The event parameter informs the application
                             * how the user navigated to the new page: Whether the 'Next' button was used, or another button, or whether the page was directly
                             * selected
                             */
                            type : {type : "syshub.controls.PaginatorEvent"}
                        }
                    },
                    entriesPerPageChanged:{
                        parameters:{
                            /**
                             * The offset where to start the new query
                             */
                            offset: {type: "int"},

                            /**
                             * The new limit how many entries must get
                             */
                            limit: {type: "int"}
                        }
                    }
                }
            }});


        /**
         * Variable to hold the computed number of pages
         */
        Paginator.numberOfPages = null;

        /**
         * Init function
         * @private
         */
        Paginator.prototype.init = function(){
            //Animations are set to true by default, then on control initialization, check the number of pages
            this.bShowAnimation = true;
            this.busyCount = 0;
        };


        /**
         * When the user clicks on a page link, we navigate to that page, either with animation or with rendering
         * @param {jQuery.Event} oEvent The current event
         * @private
         */
        Paginator.prototype.onclick = function(oEvent){
            this._handleSelect(oEvent);
        };

        /**
         * Sets the current page
         * @param {int} iTargetPage The target page to set
         * @param bSuppressRendering Suppress the rendering
         * @return this
         * @private
         */
        Paginator.prototype.setCurrentPage = function(iTargetPage, bSuppressRendering) {
            this.setProperty("currentPage", iTargetPage, bSuppressRendering);
            if (this.getDomRef()) {
                PaginatorRenderer.updateBackAndForward(this);
            }
            return this;
        };

        /**
         * When animation is set to true, this function will use jQuery to animate the paginator
         * as if the page numbers were sliding left/right.
         * @private
         */
        Paginator.prototype.triggerPaginatorAnimation = function() {
            let aIndicesToHide = [];
            let aIndicesToShow = [];
            let paginatorId = this.getId();
            //original let aChildren = jQuery.sap.byId(paginatorId + "-pages").children();
            let aChildren = $("#" + paginatorId + "-pages").children();

            // Get the ranges we need to display before and after the animation
            let oNewRange = this._calculatePagesRange();
            let oOldRange;
            if (this._oOldRange) {
                oOldRange = this._oOldRange;
            } else {
                oOldRange = {};
                let aParts = aChildren[0].id.split("--");
                oOldRange.firstPage = parseInt(aParts[aParts.length - 1], 10);
                aParts = aChildren[aChildren.length - 1].id.split("--");
                oOldRange.lastPage = parseInt(aParts[aParts.length - 1], 10);
            }

            // the pages to be shown only after the animation are those to be rendered invisible, initially
            let i;
            for (i = oNewRange.firstPage; i <= oNewRange.lastPage; i++) {
                if (i < oOldRange.firstPage || i > oOldRange.lastPage) {
                    aIndicesToShow.push(i);
                }
            }
            let oInvisibleRange = {
                firstPage:aIndicesToShow[0],
                lastPage:aIndicesToShow[aIndicesToShow.length - 1]
            };

            // the pages to be shown initially, but NOT after the animation, are those to fade out
            for (i = oOldRange.firstPage; i <= oOldRange.lastPage; i++) {
                if (i < oNewRange.firstPage || i > oNewRange.lastPage) {
                    aIndicesToHide.push(i);
                }
            }

            this.getDomRef("summary").outerHTML =  PaginatorRenderer.getSummaryHtml(this, this.getCurrentPage());

            // build the html for both the initially visible and still invisible pages
            let oldHtml = PaginatorRenderer.getPagesHtml(this.getId(), oOldRange, this.getCurrentPage(), true);
            let newHtml = PaginatorRenderer.getPagesHtml(this.getId(), oInvisibleRange, this.getCurrentPage(), false);
            if (oOldRange.firstPage < oInvisibleRange.firstPage) {
                newHtml = oldHtml + newHtml;
            } else {
                newHtml = newHtml + oldHtml;
            }


            // remember focus
            let focElem = document.activeElement;
            let focId = focElem ? focElem.id : undefined; // remember ID of focused element - it should still be focused after rendering

            this.getDomRef("pages").innerHTML = newHtml;

            // restore focus
            if (focId) {
                // Set focus on the previously focused element.
                // jQuery does not like document.activeElement, so we have to fetch it
                // from the DOM again.
                //original focElem = jQuery.sap.domById(focId);
                focElem = $("#" + focId);
            } else {
                // Set focus to active page link if no other element was active before
                //original focElem = jQuery.sap.domById("testPaginator-a--" + this.getCurrentPage());
                focElem = $("#testPaginator-a--" + this.getCurrentPage());
            }

            $(focElem).focus();

            // Use jQuery hide/show to animate the paging
            let prefix = this.getId() + "-li--";

            this._oOldRange = oNewRange;

            function removeAfterAnimation(id){ // remove the DOM elements after the animation
                let elem = $("#" + id);
                //original let elem = jQuery.sap.byId(id);
                if (elem) {
                    //elem.parentNode.removeChild(elem);
                }
            }

            for (i = 0 ; i < aIndicesToHide.length; i++) {
                let id = prefix + aIndicesToHide[i];
                $("#" + id).hide(400, removeAfterAnimation(this.getId()));
                //original jQuery.sap.byId(id).hide(400, removeAfterAnimation);
            }

            for (i = 0 ; i < aIndicesToShow.length; i++) {
                $("#" + prefix + aIndicesToShow[i]).show(400);
                //original jQuery.sap.byId(prefix + aIndicesToShow[i]).show(400);
            }
        };


        /**
         * Calculates what is the first page and last page to display (The current range).
         * Ensure that when we go over 5 pages, the current page will always be rendered centered
         * In this case, middle -2 and middle + 2 to get to full 5 pages range
         * @return {object} oPageRange object containing first page and last page to display
         * @private
         */
        Paginator.prototype._calculatePagesRange = function(){

            //Setting default values
            let iFirstPage = 1;
            let iLastPage = this.numberOfPages;
            let iCurrentPage = this.getCurrentPage();

            let leftFromCurrent;
            let rightFromCurrent;

            if(Number.isInteger(this.getNumberOfVisiblePages() / 2 )){
                leftFromCurrent = this.getNumberOfVisiblePages() / 2;
                rightFromCurrent = this.getNumberOfVisiblePages() / 2 -1;
            }else{
                leftFromCurrent =  Math.ceil(this.getNumberOfVisiblePages() / 2);
                rightFromCurrent = Math.ceil(this.getNumberOfVisiblePages() / 2);
            }


            if ( iCurrentPage < this.getNumberOfVisiblePages() -1 ) {
                //Check if last page does not go over numberOfVisiblePages --> iLastPage is already set with nbPages above
                if (iLastPage > this.getNumberOfVisiblePages() ) {
                    iLastPage = this.getNumberOfVisiblePages() ;
                }


            } else if (iCurrentPage === iLastPage) { //Reached the last page

                if (iLastPage >= this.getNumberOfVisiblePages() ) {
                    iFirstPage = iLastPage - this.getNumberOfVisiblePages()  + 1;
                }
            } else if ( iLastPage - iCurrentPage < rightFromCurrent ) {
                iFirstPage = iLastPage - this.getNumberOfVisiblePages() + 1;
            } else {
                iFirstPage = iCurrentPage - leftFromCurrent;
                iLastPage = iCurrentPage + rightFromCurrent;
            }
            return { firstPage : iFirstPage, lastPage : iLastPage };
        };


        /**
         * @param {jQuery.Event} oEvent the browser event
         * @private
         */
        Paginator.prototype.onkeydown = function(oEvent){

            //Get the event type and dispatch to the keyboard navigation manager
            let aEvents = oEvent.getPseudoTypes();
            //console.log(aEvents);
            //Tab
            if (jQuery.inArray("saptabnext", aEvents) !== -1) {
                this.triggerTabbingNavigation(oEvent,false);
            } else if (jQuery.inArray("saptabprevious", aEvents) !== -1) {
                //Shift/tab
                this.triggerTabbingNavigation(oEvent,true);
            } else if (jQuery.inArray("sapincrease", aEvents) !== -1) {
                //Moves focus to the right (Right arrow key)
                this.triggerInternalNavigation(oEvent,"next");
            } else if (jQuery.inArray("sapdecrease", aEvents) !== -1) {
                //Moves focus to the left (Left arrow key)
                this.triggerInternalNavigation(oEvent,"previous");
            } else if (jQuery.inArray("sapenter", aEvents) !== -1) {
                this._handleSelect(oEvent);
            }

        };

        /**
         * This function will navigate left and right in the paginator, skipping non tabbable elements
         * @param {jQuery.Event} oEvent the browser event
         * @param {string} sDirection Navigation left or right
         * @private
         */
        Paginator.prototype.triggerInternalNavigation = function(oEvent,sDirection){

            let aFocusableElements = jQuery(this.getDomRef()).find(":sapFocusable");
            let iCurrentIndex = jQuery(aFocusableElements).index(oEvent.target);
            let iNextIndex, oNextElement;

            //Right key pressed
            if (sDirection === "next") {
                iNextIndex = iCurrentIndex + 1;
                if (jQuery(oEvent.target).hasClass("cosmosUiPagCurrentPage")) {
                    iNextIndex = iNextIndex + 1;
                }
                oNextElement = aFocusableElements[iNextIndex];
                if (oNextElement) {
                    jQuery(oNextElement).focus();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            } else if (sDirection === "previous" && aFocusableElements[iCurrentIndex - 1]) {
                //Left key pressed
                iNextIndex = iCurrentIndex - 1;
                oNextElement = aFocusableElements[iNextIndex];
                if (oNextElement && jQuery(oNextElement).hasClass("cosmosUiPagCurrentPage")) {
                    oNextElement = aFocusableElements[iNextIndex - 1];
                }
                if (oNextElement) {
                    jQuery(oNextElement).focus();
                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            }

        };

        /**
         * This function will handle the TAB key in the paginator (simple group)
         * @param {jQuery.Event} oEvent the browser event
         * @param {boolean} shiftKeyPressed Tabbing or shift-Tabbing
         * @private
         */
        Paginator.prototype.triggerTabbingNavigation = function(oEvent,shiftKeyPressed){

            //Get all focusable elements
            let aFocusableElements = jQuery(this.getDomRef()).find(":sapFocusable");

            //Tabbing --> Focus the last active element then let the browser focus the next active element
            if (!shiftKeyPressed) {
                jQuery(aFocusableElements[aFocusableElements.length - 1]).focus();
            } else { //Shift/Tab keys pressed --> Focus the 2nd active element then let the browser focus the first active element

                //Which element triggered the event
                let iCurrentIndex = jQuery(aFocusableElements).index(oEvent.target);

                //If the focus is already on the first active element, let the browser move the focus
                if (iCurrentIndex !== 0) {
                    jQuery(aFocusableElements[0]).focus();
                }
            }
        };

        Paginator.prototype.getFocusInfo = function() {
            let sId = this.$().find(":focus").attr("id");
            if (sId) {
                return {customId: sId};
            } else {
                return sap.ui.core.Element.prototype.getFocusInfo.apply(this, arguments);
            }
        };

        Paginator.prototype.applyFocusInfo = function(mFocusInfo) {
            if (mFocusInfo && mFocusInfo.customId) {
                this.$().find("#" + mFocusInfo.customId).focus();
            } else {
                sap.ui.core.Element.prototype.getFocusInfo.apply(this, arguments);
            }
            return this;
        };

        Paginator.prototype._handleSelect = function(oEvent) {
            if (oEvent && oEvent.target) {

                // suppress triggering beforeunload in IE
                oEvent.preventDefault();

                // go up one node if unnamed element is the source
                let target = oEvent.target;
                if (!target.id) {
                    target = target.parentNode;
                }

                if (target.id && target.id !== this.getId() + "-pages") {

                    // Retrieve from where the event originated
                    let aArray = target.id.split("--");

                    // only do something if relevant item has been clicked
                    if (aArray.length > 1) {
                        let lastPart = aArray[aArray.length - 1];

                        // What type of event will be sent
                        let sEventType = null;

                        // Buffer the current page as the sourcePage
                        let iSrcPage = this.getCurrentPage();
                        let iTargetPage = iSrcPage; // will be changed below

                        // we have a number - a page has been clicked
                        if (lastPart.match(/^\d+$/)) {
                            sEventType = PaginatorEvent.Goto;
                            iTargetPage = parseInt(lastPart, 10);

                        } else if (lastPart === "firstPageLink") {
                            sEventType = PaginatorEvent.First;
                            iTargetPage = 1;

                        } else if (lastPart === "backLink") {
                            sEventType = PaginatorEvent.Previous;
                            iTargetPage = Math.max(iSrcPage - 1, 1);

                        } else if (lastPart === "forwardLink") {
                            sEventType = PaginatorEvent.Next;
                            iTargetPage = Math.min(iSrcPage + 1, this.numberOfPages);

                        } else if (lastPart === "lastPageLink") {
                            sEventType = PaginatorEvent.Last;
                            iTargetPage = this.numberOfPages;

                        }else if (lastPart === "gotoPageLink") {
                            sEventType = PaginatorEvent.Goto;
                            let gotoPageTarget = target.id.replace("gotoPageLink", "gotoPageValue");
                            let gotoPageValue = document.getElementById(gotoPageTarget).value;
                            iTargetPage = parseInt(gotoPageValue);
                            if(isNaN(iTargetPage) || iTargetPage > this.numberOfPages){
                                return;
                            }
                        }else if (lastPart === "gotoPageValue" && oEvent.keyCode === 13) {
                            sEventType = PaginatorEvent.Goto;
                            let gotoPageTarget = target.id.replace("gotoPageLink", "gotoPageValue");
                            let gotoPageValue = document.getElementById(gotoPageTarget).value;
                            iTargetPage = parseInt(gotoPageValue);
                            if(isNaN(iTargetPage) || iTargetPage > this.numberOfPages){
                                return;
                            }
                        }else if (lastPart === "entriesPerPageSelection") {

                            let index = oEvent.target.options.selectedIndex;
                            let selectedValue = parseInt(oEvent.target.options[index].value);
                            if(selectedValue !== this.getEntriesPerPage()){
                                this.setEntriesPerPage(selectedValue);
                                //compute the offset
                                this.fireEntriesPerPageChanged({
                                    offset:(iTargetPage - 1) * this.getEntriesPerPage(),
                                    limit: this.getEntriesPerPage()
                                });


                            }

                        }

                        // else should not happen

                        if (iTargetPage !== iSrcPage) {
                            if (this.bShowAnimation) {
                                this.setCurrentPage(iTargetPage, true); // update current page without re-rendering...
                                this.triggerPaginatorAnimation(); // ...and animate
                            } else {
                                this.setCurrentPage(iTargetPage); // includes re-rendering
                            }

                            // fire the "page" event

                            //compute the offset
                            this.firePage({
                                srcPage:iSrcPage,
                                targetPage:iTargetPage,
                                offset:(iTargetPage - 1) * this.getEntriesPerPage(),
                                limit: this.getEntriesPerPage(),
                                type:sEventType
                            });
                        }
                    }
                }
            }
        };

        Paginator.prototype.setShowSpinner = function(oEvent) {
            if(oEvent){
                $("#" + this.getId() + "--busyIndicator").attr("style", "visibility:visible");
            }else{
                $("#" + this.getId() + "--busyIndicator").attr("style", "visibility:hidden");
            }
        };

        return Paginator;

    }, /* bExport= */ true);
