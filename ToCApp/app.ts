"use strict";
module HF
{    
    class ToC
    {
        public m_level: number = 0;
        public m_currentLists: HTMLUListElement[] = [];

        constructor(a_tocId: string = "toc", a_contentId: string = "contents")
        {            
            var tocElement: HTMLElement = document.getElementById(a_tocId);
            var contentElement: HTMLElement = document.getElementById(a_contentId);
            // Make sure the 2 elements exists in the DOM            
            if (tocElement && contentElement)
            {
                var headerElements: NodeList = contentElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
                this.createToC(tocElement, headerElements);
            }
        }

        public createToC(a_tocElement: HTMLElement, a_headerElements: NodeList): void
        {
            var hlen: number = a_headerElements.length;

            var documentFragmentElement: DocumentFragment = document.createDocumentFragment();

            for (var i: number = 0; i < hlen; ++i)
            {
                var headerElement: HTMLHeadingElement = a_headerElements[i] as HTMLHeadingElement;

                this.createToCElement(headerElement, documentFragmentElement, a_tocElement.id);
            }
            // Set the toc element title. 
            // First I only appended the documentFragment but then in blogger the preview texts it said "Table of Contents:"  and no table!
            a_tocElement.innerHTML = "Table of Content:";
            a_tocElement.appendChild(documentFragmentElement);
            // Remove the hide class
            a_tocElement.className = "";
        }

        public createToCElement(a_headerElement: HTMLHeadingElement, a_documentFragment: DocumentFragment, a_tocId: string): void
        {
            /// <summary>
            /// Generates the anchor tag link to the headerElement input and then adds it to the documentFragment.
            /// </summary>
            /// <param name="a_headerElement" type="HTMLHeadingElement"></param>
            /// <param name="a_documentFragment" type="DocumentFragment"></param>
            /// <param name="a_tocId" type="string"></param>
            var headingLevel: number = parseInt(a_headerElement.nodeName[1], 10);
            
            this.gotoLevel(headingLevel, a_documentFragment);            
            
            var currentListElement: HTMLUListElement = this.m_currentLists[this.m_level];

            var toTopLink: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
            toTopLink.href = "#" + a_tocId;

            const id = a_headerElement.innerHTML.trim();
            a_headerElement.id = id;
            a_headerElement.innerHTML = "";
            toTopLink.innerHTML = id;

            a_headerElement.appendChild(toTopLink);

            var listItem = document.createElement("li");
            listItem.innerHTML = "<a href='#" + id + "'>" + id + "</a>";

            currentListElement.appendChild(listItem);
        }

        private gotoLevel(a_headingLevel: number, a_documentFragment : DocumentFragment): void
        {
            // Can skip the if statements and just do the 2 whiles one after another if you want, I like the ifs!

            if (this.m_level < a_headingLevel)
            {
                // This is important otherwise <ul> tags would be missing when jumping up and down in header levels.
                while (this.m_level < a_headingLevel)
                {
                    // increase level by 1!
                    this.m_level++;
                    // Create the ul for this heading level
                    this.m_currentLists[this.m_level] = document.createElement("ul");

                    // If level is 1 then add to the ToC fragment
                    if (this.m_level == 1)
                    {
                        a_documentFragment.appendChild(this.m_currentLists[1]);
                    }
                    // Else add it to the parent list
                    else
                    {
                        this.m_currentLists[this.m_level - 1].appendChild(this.m_currentLists[this.m_level]);
                    }
                }
            }
            // If current level is higher than the new headinglevel
            else if (this.m_level > a_headingLevel)
            {
                while (this.m_level > a_headingLevel)
                {
                    // remove the list at the current level
                    this.m_currentLists[this.m_level] = undefined;                    
                    this.m_level--;
                }                
            }
        }
    }
    // Put the load code last just incase!
    var loaded = false;
    document.addEventListener("DOMContentLoaded", function ()
    {
        var toc = new ToC();
        loaded = true;
    });
    window.addEventListener("load", function ()
    {
        // If the DOMContentLoaded never fired.
        if (!loaded)
        {
            var toc = new ToC();
        }
    });
   
}