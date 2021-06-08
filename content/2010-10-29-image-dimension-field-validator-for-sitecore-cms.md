---
title: "Image dimension Field Validator for Sitecore CMS"
tags: ['post', 'c-sharp', 'dot net', 'my software', 'sitecore']
layout: post
---

This `StandardValidator` extension will determine whether or not a given
`ImageField`'s source image's height and width match with given
parameters. Either parameter can be omitted if, for instance, you only
care about validating the width of an image (or conversely, only the
height).<!--more-->

*Note: In the code below, replace `your.namespace.validators` with
something more suited to your particular project.*

    #!csharp
    using System.Runtime.Serialization;
    using Sitecore.Data.Validators;
    using System;
    using Sitecore.Data.Items;
    using System.Text;

    namespace your.namespace.validators
    {
        [Serializable]
        public class ImageDimensionValidator : Sitecore.Data.Validators.StandardValidator
        {
            public ImageDimensionValidator() { }

            public ImageDimensionValidator(SerializationInfo info, StreamingContext
            context)
            : base(info, context)
            { }

            public override string Name
            {
                get
                {
                    return ("ImageDimensionValidator");
                }
            }

            protected override ValidatorResult GetMaxValidatorResult()
            {
                return (GetFailedResult(ValidatorResult.Error));
            }

            protected override ValidatorResult Evaluate()
            {
                // set initial return value
                ValidatorResult result = ValidatorResult.Valid;
                // grab the target ImageField
                Sitecore.Data.Fields.ImageField img = GetField();
                /* ignore blank fields
                 * (use the Sitecore-supplied Required validator if you want blank fields to fail) */
                if(img.Value == "") return result;
                // use a StringBuilder for constructing the result Text
                StringBuilder txt = new StringBuilder("The image must be ");

                // are we checking width?
                if (Parameters.ContainsKey("w"))
                    // mismatch
                    if (img.Width != Parameters["w"])
                    {
                        // add to result Text and fail
                        txt.Append(string.Format("{0} pixels wide", Parameters["w"]));
                        result = ValidatorResult.Error;
                    }

                // are we checking height?
                if (Parameters.ContainsKey("h"))
                    // mismatch
                    if (img.Height != Parameters["h"])
                    {
                        // already failed width? if so, add separator text
                        if(result == ValidatorResult.Error) txt.Append(" and ");
                        // add to result Text and fail
                        txt.Append(string.Format("{0} pixels tall", Parameters["h"]));
                        result = ValidatorResult.Error;
                    }

                // failure - set Text to the StringBuilder value
                if (result == ValidatorResult.Error)
                {
                    txt.Append(".");
                    Text = txt.ToString();
                }

                return result;
            }
        }
    }

Create a new field-level `Validation Rule` item in your *sitecore* tree
(wherever you store your rules—in this particular project, they are
stored in */sitecore/System/Settings/Validation Rules/Field Rules*), and
set the *Type* field for your new rule to:

`your.namespace.validators.ImageDimensionValidator,your.namespace.validators`

For the `Parameters` value, use *h* and/or *w* to pass through your
desired image dimensions (i.e., `w=320&h=240` will reject the image
unless it is 320 pixels wide by 240 pixels tall).

Remember to swap the namespace with whatever you've chosen for your
project.

*Note: The version of Sitecore CMS this validator was built and tested
on is 6.2.*
