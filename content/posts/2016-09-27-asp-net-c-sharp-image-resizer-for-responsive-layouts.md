---
title: "ASP.NET/C# image resizer for responsive layouts"
tags: ['post', 'aspx', 'c-sharp', 'dot net', 'image-editing', 'javascript', 'my-software', 'regex', 'responsive']
layout: post
---

I will probably elaborate on this a bit further when I find some more
time, but for now, this post is going to be mostly code. What I have
here is a *relatively* simple way to generate images that are resized
server-side based on the screen dimensions (note: not window dimensions)
of the web browser requesting them. This way, you're not sending huge
images to phones. Pair this with some CSS to scale your images to fit
their containers, and you're cooking with gas!<!--more-->

**web.config section** (IIS URL Rewrite 2.0)

    #!xml
    <rewrite>
        <rules>
            <rule name="Responsive image handler">
                <match url="^.+\.(jpe?g|gif|png)$" />
                <conditions>
                    <add input="{QUERY_STRING}" pattern="r" />
                </conditions>
                <action type="Rewrite" url="ImageResizer.ashx?i={UrlEncode:{R:0}}" />
            </rule>
        </rules>
    </rewrite>

**screen-dimensions.js**

    #!js
    (function(){ document.cookie = "screendim=" + screen.width + "x" + screen.height; }());

**ImageResizer.ashx**

    #!csharp
    <%@ WebHandler Language="C#" Class="ImageResizeHandler" %>

    using System;
    using System.Web;

    public class ImageResizeHandler : IHttpHandler
    {
        // path to generated images
        protected static const string imgPath = "~/App_Data/responsive/";
        // how long to cache images (in seconds)
        protected static const int cacheLength = 36000;
        // image resizing breakpoints and their adjusted percentages
        private static const ResponsiveBreakpoint[] breakpoints = {
            new ResponsiveBreakpoint(320, 0.15f),
            new ResponsiveBreakpoint(480, 0.25f),
            new ResponsiveBreakpoint(560, 0.4f),
            new ResponsiveBreakpoint(768, 0.6f)
        };

        public void ProcessRequest(HttpContext context)
        {
            // init
            int screenw = -1, screenh = -1;
            var img = context.Request.QueryString["i"];

            // split screen dimensions from cookie
            if (context.Request.Cookies["screendim"] != null)
            {
                var dim = context.Request.Cookies["screendim"].Value.Split('x');

                // invalid cookie value; serve the original and drop out
                if (dim.Length != 2)
                {
                    context.Response.Redirect(img);
                    return;
                }

                int.TryParse(dim[0], out screenw);
                int.TryParse(dim[1], out screenh);
            }

            // no screen dimensions or desktop size; serve original file
            if (screenw < 0 || screenh < 0
                || screenw >= breakpoints[breakpoints.Length - 1].width)
            {
                context.Response.Redirect(img);
                return;
            }

            // replace path slashes with underscores so the path becomes part of the filename in the cache folder
            var imgName = img.Replace("/", "__");
            // add protocol and host name to img request
            img = "http" + (context.Request.IsSecureConnection ? "s" : "") + "://" + context.Request.Url.Host + context.Request.Url.AbsolutePath + img;
            // determine new size; percent of original
            var pct = 1.0f;

            // find our breakpoint for this screen width
            foreach (ResponsiveBreakpoint breakpoint in ImageResizeHandler.breakpoints)
            {
                if (screenw < breakpoint.width)
                {
                    pct = breakpoint.percentage;
                    break;
                }
            }

            // finish making file name; add size percentage and .jpg
            var fileName = context.Server.MapPath(ImageResizeHandler.imgPath + imgName + "!"  + ((int)Math.Round(pct * 100)).ToString() + ".jpg");
            context.Response.ContentType = "image/jpeg";

            // create new file if it doesn't exist or if it's expired
            if (!System.IO.File.Exists(fileName)
                || DateTime.Now.AddSeconds(0 - ImageResizeHandler.cacheLength) > System.IO.File.GetCreationTime(fileName))
            {
                var rq = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(img + "?resize=");
                rq.AllowWriteStreamBuffering = true;
                var wr = rq.GetResponse();
                var ws = wr.GetResponseStream();
                var imgdata = System.Drawing.Image.FromStream(ws);
                var neww = (int)Math.Round(imgdata.Width * pct);
                var newh = (int)Math.Round(imgdata.Height * pct);
                var bmp = new System.Drawing.Bitmap(neww, newh);
                var gfx = System.Drawing.Graphics.FromImage((System.Drawing.Image)bmp);
                gfx.InterpolationMode =
                System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                gfx.DrawImage(imgdata, 0, 0, neww, newh);
                gfx.Dispose();
                imgdata = (System.Drawing.Image)bmp;
                imgdata.Save(fileName, System.Drawing.Imaging.ImageFormat.Jpeg);
            }

            // serve image
            context.Response.WriteFile(fileName);
        }

        // don't immediately destroy this handler after each use
        public bool IsReusable { get { return true; } }

        // class for responsive breakpoints
        protected class ResponsiveBreakpoint
        {
            public int width = 0;
            public float percentage = 0.0f;

            public ResponsiveBreakpoint(int pWidth, float pPercentage)
            {
                this.width = pWidth;
                this.percentage = pPercentage;
            }
        }
    }

**example.html**

    #!html
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta charset="utf-8" />
        <script type="text/javascript" src="/js/screen-dimensions.js"></script>
    </head>
    <body>
        <p>This here image is responsive, y'all!</p>
        <img src="/img/some-image.png?r" />

        <p>This one ain't.</p>
        <img src="/img/some-image.png" />
    </body>
    </html>

**Edit:** If you want to speed up the response by having IIS handle the
transfer of the image (rather than letting ASP.NET write the image to
the response stream), check out [this X-SendFile module for
IIS](https://github.com/stakach/IIS-X-Sendfile-plugin).
