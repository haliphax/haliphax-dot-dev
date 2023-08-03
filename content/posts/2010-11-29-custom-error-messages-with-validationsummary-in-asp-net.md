---
title: "Custom error messages with ValidationSummary in ASP.NET"
tags: ["post", "aspx", "c-sharp", "dot net", "forms", "my-software"]
layout: post
---

Sometimes, there are problems encountered in a code-behind file that
don't warrant the extra work and mark-up that would otherwise be
required to add `CustomValidator` controls to the page for displaying
error messages to the user through your `ValidationSummary`. Wouldn't it
be nice if you could (somewhat) easily take care of it in your
code-behind file alone, without adding additional clutter to your
`UserControl`/`Page`/etc.? Well, you can! The following `IValidator`
extension class can be added to a `Page`'s `Validators` list with ease
for displaying custom error messages.<!--more-->

**C# code:**

```cs
public class ValidationError : IValidator {
	private string _ErrorMessage;
	private bool _IsValid;
	public string ErrorMessage { get { return this._ErrorMessage; } set { this._ErrorMessage = value; } }
	public bool IsValid { get { return this._IsValid; } set { this._IsValid = value; } }
	public ValidationError(string message) { this.ErrorMessage = message; }
	public void Validate() { this.IsValid = false; }
}
```

In order to use the class in your code-behind, you just add a new
instance of the `ValidationError` class to the `Validators` member of
your container.

**C# code:**

```cs
Validators.Add(new ValidationError("There was a problem.  Everybody freak out!"));
Validate();
```

I suppose you could use this code to add the `CustomValidator` control
anywhere you wanted to, but I generally add it to the `Page`'s
`Validators` collection and let my `ValidationSummary` control handle
the error display.

I've seen a few other examples of custom classes to accomplish this
purpose, but each of them was missing some vital piece that prevented it
from compiling out-of-the-box. The source code in this post has been
tried and tested.
