---
title: "Validating file uploads in Sitecore WFFM"
tags: ['post', 'c-sharp', 'dot net', 'fix', 'forms', 'my software', 'regex', 'security', 'sitecore']
layout: post
---

Our Sitecore installation was in dire need of a way to lock down file
uploads on forms built with the Web Forms for Marketers (WFFM) module;
out of the box, it doesn't do any checking at all, which can lead to
some risky situations. I tacked on a simple whitelist attribute to the
UploadFile control, and our security engineer can breathe
easy.<!--more-->

Using reflection, I pulled the source for the UploadFile control and
added a new VisualProperty, "Allowed extensions":

    #!csharp
    using Sitecore.Form.Core.Attributes;
    using Sitecore.Form.Core.Controls.Data;
    using Sitecore.Form.Core.Media;
    using Sitecore.Form.Core.Visual;
    using Sitecore.Form.UI.Adapters;
    using Sitecore.Form.Web.UI.Controls;
    using System;
    using System.ComponentModel;
    using System.Web.UI;
    using System.Web.UI.WebControls;

    namespace example.sitecore.wffm.fileuploadvalidator
    {
        [Adapter(typeof(FileUploadAdapter))]
        public class UploadFile : ValidateControl, IHasTitle
        {
            private static readonly string baseCssClassName =
                "scfFileUploadBorder";
            protected Panel generalPanel = new Panel();
            protected System.Web.UI.WebControls.Label title = new
                System.Web.UI.WebControls.Label();
            protected FileUpload upload = new FileUpload();
            private string uploadDir = "/sitecore/media library";
            private string allowedExtensions = "";

            public override string ID
            {
                get
                {
                    return this.upload.ID;
                }

                set
                {
                    this.title.ID = value + "text";
                    this.upload.ID = value;
                    base.ID = value + "scope";
                }
            }

            [VisualProperty("Upload To:", 0)]
            [DefaultValue("/sitecore/media library")]
            [VisualFieldType(typeof(SelectDirectoryField))]
            [VisualCategory("Upload")]
            public string UploadTo
            {
                get
                {
                    return this.uploadDir;
                }

                set
                {
                    this.uploadDir = value;
                }
            }

            [VisualProperty("Allowed extensions:", 1000)]
            [DefaultValue("")]
            [VisualCategory("Validation")]
            public string AllowedExtensions
            {
                get
                {
                    return this.classAtributes["allowedExtensions"];
                }

                set
                {
                    this.classAtributes["allowedExtensions"] = value;
                }
            }

            public override ControlResult Result
            {
                get
                {
                    if (this.upload.HasFile)
                        return new ControlResult(this.ControlName, (object)new
                            PostedFile(this.upload.FileBytes, this.upload.FileName, this.UploadTo),
                            "medialink");
                    else
                        return new ControlResult(this.ControlName, (object)null, string.Empty);
                }
            }

            public string Title
            {
                get
                {
                    return this.title.Text;
                }

                set
                {
                    this.title.Text = value;
                }
            }

            [DefaultValue("scfFileUploadBorder")]
            [VisualFieldType(typeof(CssClassField))]
            [VisualProperty("Css Class:", 600)]
            public new string CssClass
            {
                get
                {
                    return base.CssClass;
                }

                set
                {
                    base.CssClass = value;
                }
            }

            protected override Control ValidatorContainer
            {
                get
                {
                    return (Control)this;
                }
            }

            protected override Control InnerValidatorContainer
            {
                get
                {
                    return (Control)this.generalPanel;
                }
            }

            public UploadFile(HtmlTextWriterTag tag)
            : base(tag)
            {
                this.CssClass = UploadFile.baseCssClassName;
            }

            public UploadFile()
            : this(HtmlTextWriterTag.Div)
            { }

            public override void RenderControl(HtmlTextWriter writer)
            {
                this.DoRender(writer);
            }

            protected virtual void DoRender(HtmlTextWriter writer)
            {
                base.RenderControl(writer);
            }

            protected override void OnInit(EventArgs e)
            {
                this.upload.CssClass = "scfFileUpload";
                this.help.CssClass = "scfFileUploadUsefulInfo";
                this.title.CssClass = "scfFileUploadLabel";
                this.title.AssociatedControlID = this.upload.ID;
                this.generalPanel.CssClass = "scfFileUploadGeneralPanel";
                this.Controls.AddAt(0, (Control)this.generalPanel);
                this.Controls.AddAt(0, (Control)this.title);
                this.generalPanel.Controls.AddAt(0, (Control)this.help);
                this.generalPanel.Controls.AddAt(0, (Control)this.upload);
            }
        }
    }

This was then coupled with a FormCustomValidator which took the value
entered into the VisualProperty and split it into an array of allowed
extensions (by using the comma as a delineating token):

    #!csharp
    using Sitecore.Form.Core.Validators;
    using System;
    using System.ComponentModel;
    using System.Linq;
    using System.Text.RegularExpressions;
    using System.Web.UI.WebControls;

    namespace example.sitecore.wffm.fileuploadvalidator
    {
        public class FileUploadValidator : FormCustomValidator
        {
			[Browsable(true)]
			public string AllowedExtensions
			{
				get
				{
					return this.classAttributes["allowedExtensions"] ?? string.Empty;
				}

				set
				{
					this.classAttributes["allowedExtensions"] = value;
				}
			}

			public FileUploadValidator()
			{
				this.AllowedExtensions = "";
			}

			protected override void OnLoad(EventArgs e)
			{
				this.ErrorMessage = string.Format(this.ErrorMessage, "{0}",
				this.AllowedExtensions.Replace(",", ", "));
				this.Text = this.ErrorMessage;
				base.OnLoad(e);
			}

			protected override bool OnServerValidate(string value)
			{
				if(AllowedExtensions.Trim().Length == 0)
				{
					return true;
				}

				Regex rgxExtension = new Regex(".+\\.([\^\\.]+)$");
				string filename =
					((FileUpload)base.FindControl(this.ControlToValidate)).FileName;
				Match matchExtension = rgxExtension.Match(filename);
				string extension = matchExtension.Groups[1].Value.ToLower();
				string[] allowedExtensions = AllowedExtensions.Split(',');

				if (!allowedExtensions.Contains(extension))
				{
					return false;
				}

				return true;
			}
        }
    }

We now have the ability to lock down a file upload field for a
curriculum vitae/resume to, for instance, "docx,doc,pdf,rtf,txt".
Someone can't send along a ZIP file or an EXE instead of a document.
Additionally, we still have the freedom to avoid using the whitelist
altogether by leaving the "Allowed extensions" value blank (though I
wouldn't recommend it).

I hope this helps somebody out there!
