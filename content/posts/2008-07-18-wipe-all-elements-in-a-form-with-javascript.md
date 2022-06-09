---
title: "Wipe all elements in a form with Javascript"
tags: ['post', 'forms', 'javascript']
layout: post
---

Javascript has a nifty method associated with the
*form* DOM object called *reset()*. Using this method will revert all
values of the form's associated input controls to the values they
contained when the page was last sent to the user's browser. That's
great... but if you want to revert the values to *nothing*, then some
scripting is required:<!--more-->

**Javascript code:**

    #!js
    function clearForm(formId)  
    {  
        // confirm action  
        if(!confirm("Are you sure you want to clear the form?"))  
            return;

        var a; // iterator  
        var whichForm = document.getElementById(formId); // form to clear  
        var elementType; // "type" attribute of current element

        // reset the form (this will clear INPUT TYPE="file" controls)  
        whichForm.reset();

        // clear INPUT elements  
        var inputElements = whichForm.getElementsByTagName("input");  

        for(a = 0; a < inputElements.length; elementType = inputElements[a++].attributes.getNamedAttribute("type"))  
        {  
            // use proper clear behavior for given input type  
            switch(elementType)  
            {  
                // TEXT inputs  
                case "text":  
                // HIDDEN inputs (may want to disable this)  
                case "hidden":  
                    inputElements[a].value = "";  
                    break;  
                // CHECKBOX inputs  
                case "checkbox":  
                // RADIO inputs  
                case "radio":  
                    inputElements[a].checked = false;  
                    break;  
                case default:  
                    continue;  
                    break;  
            }  
        }

        // clear TEXTAREA elements  
        var inputElements = whichForm.getElementsByTagName("textarea");  
        for(a = 0; a < inputElements.length; inputElements[a++].value = "");

        // clear OPTIONs  
        var inputElements = whichForm.getElementsByTagName("option");  
        for(a = 0; a < inputElements.length; inputElements[a++].selected = false);  
    }

If you are using the hidden input controls for something other than
tracking user input on the form, you may want to comment out the line
*case "hidden":* in the *switch(elementType)* block.
