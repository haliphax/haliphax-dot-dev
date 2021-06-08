---
title: "Currency Field Validator for Sitecore CMS"
tags: ['post', 'c-sharp', 'dot net', 'my software', 'sitecore']
layout: post
---

This `StandardValidator` extension will determine whether or not a given
field value passes for currency. In order to do so, it must meet the
following requirements:

1.  It must pass decimal.TryParse()
2.  It must not have more than 2 digits past the decimal point

Obviously, this does not fit all international systems—however, in my
case, it works for my project (which does not require localization). The
code could easily be customized to accommodate additional
formats.<!--more-->

*Note: In the code below, replace `your.namespace.validators` with
something more suited to your particular project.*

**C# code:**  

    #!csharp
    using System.Runtime.Serialization;  
    using Sitecore.Data.Validators;  
    using System;  
    using Sitecore.Data.Items;  
    using System.Text;

    namespace your.namespace.validators  
    {  
        [Serializable]  
        public class CurrencyValidator :
        Sitecore.Data.Validators.StandardValidator  
        {  
            public CurrencyValidator() { }

            public CurrencyValidator(SerializationInfo info, StreamingContext
            context)  
            : base(info, context)  
            { }

            public override string Name  
            {  
                get  
                {  
                    return ("CurrencyValidator");  
                }  
            }

            protected override ValidatorResult GetMaxValidatorResult()  
            {  
                return (GetFailedResult(ValidatorResult.Error));  
            }

            protected override ValidatorResult Evaluate()  
            {  
                // ignore blank fields (use the Sitecore-supplied Required validator if you want blank fields to fail)  
                if(ControlValidationValue == "") return ValidatorResult.Valid;  
                decimal val = -1;  
                decimal.TryParse(ControlValidationValue, out val);  
                // value must be 0 or greater  
                if (val >= 0)  
                // value must not have more than 2 digits after the decimal point  
                if(Math.Round(val, 2) == val)  
                // valid result  
                return ValidatorResult.Valid;  
                // fall-through: invalid result  
                Text = "The number must be a positive integer or a positive float with no more than 2 digits after the decimal point.";  
                return (GetFailedResult(ValidatorResult.Error));  
            }  
        }  
    }

Create a new field-level `Validation Rule` item in your *sitecore* tree
(wherever you store your rules—in this particular project, they are
stored in */sitecore/System/Settings/Validation Rules/Field Rules*), and
set the *Type* field for your new rule to:

`your.namespace.validators.CurrencyValidator,your.namespace.validators`

Remember to swap the namespace with whatever you've chosen for your
project.

*Note: The version of Sitecore CMS this validator was built and tested
on is 6.2.*
