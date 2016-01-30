"use strict";
var HF;
(function (HF) {
    // Because of google closure compiler.    
    var ToC = (function () {
        function ToC(a_tocId, a_contentId) {
            if (a_tocId === void 0) { a_tocId = "toc"; }
            if (a_contentId === void 0) { a_contentId = "contents"; }
            this.m_level = 0;
            this.m_currentLists = [];
            var tocElement = document.getElementById(a_tocId);
            var contentElement = document.getElementById(a_contentId);
            // Make sure the 2 elements exists in the DOM            
            if (tocElement && contentElement) {
                var headerElements = contentElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
                this.createToC(tocElement, headerElements);
            }
        }
        ToC.prototype.createToC = function (a_tocElement, a_headerElements) {
            var hlen = a_headerElements.length;
            var documentFragmentElement = document.createDocumentFragment();
            for (var i = 0; i < hlen; ++i) {
                var headerElement = a_headerElements[i];
                this.createToCElement(headerElement, documentFragmentElement, a_tocElement.id);
            }
            // Set the toc element title. 
            // First I only appended the documentFragment but then in blogger the preview texts it said "Table of Contents:"  and no table!
            a_tocElement.innerHTML = "Table of Content:";
            a_tocElement.appendChild(documentFragmentElement);
            // Remove the hide class
            a_tocElement.className = "";
        };
        ToC.prototype.createToCElement = function (a_headerElement, a_documentFragment, a_tocId) {
            var headingLevel = parseInt(a_headerElement.nodeName[1], 10);
            this.gotoLevel(headingLevel, a_documentFragment);
            var currentListElement = this.m_currentLists[this.m_level];
            var toTopLink = document.createElement("a");
            toTopLink.href = "#" + a_tocId;
            var headerCloneElement = a_headerElement.cloneNode(true);
            toTopLink.appendChild(headerCloneElement);
            a_headerElement.parentNode.replaceChild(toTopLink, a_headerElement);
            var id = a_headerElement.innerHTML.trim();
            headerCloneElement.id = id;
            headerCloneElement.innerHTML = id;
            var listItem = document.createElement("li");
            listItem.innerHTML = "<a href='#" + id + "'>" + id + "</a>";
            currentListElement.appendChild(listItem);
        };
        ToC.prototype.gotoLevel = function (a_headingLevel, a_documentFragment) {
            // Can skip the if statements and just do the 2 whiles one after another if you want, I like the ifs!
            if (this.m_level < a_headingLevel) {
                // This is important otherwise <ul> tags would be missing when jumping up and down in header levels.
                while (this.m_level < a_headingLevel) {
                    // increase level by 1!
                    this.m_level++;
                    // Create the ul for this heading level
                    this.m_currentLists[this.m_level] = document.createElement("ul");
                    // If level is 1 then add to the ToC fragment
                    if (this.m_level == 1) {
                        a_documentFragment.appendChild(this.m_currentLists[1]);
                    }
                    else {
                        this.m_currentLists[this.m_level - 1].appendChild(this.m_currentLists[this.m_level]);
                    }
                }
            }
            else if (this.m_level > a_headingLevel) {
                while (this.m_level > a_headingLevel) {
                    // remove the list at the current level
                    this.m_currentLists[this.m_level] = undefined;
                    this.m_level--;
                }
            }
        };
        return ToC;
    })();
    // Put the load code last just incase!
    var loaded = false;
    document.addEventListener("DOMContentLoaded", function () {
        var toc = new ToC();
        loaded = true;
    });
    window.addEventListener("load", function () {
        // If the DOMContentLoaded never fired.
        if (!loaded) {
            var toc = new ToC();
        }
    });
})(HF || (HF = {}));
//# sourceMappingURL=app.js.map