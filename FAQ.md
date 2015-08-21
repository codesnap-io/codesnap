### What is CodeSnap?

Codesnap is a technical blogging platform that enables users to manage their blogs using Github.

### How does it work?

Managing your blog through CodeSnap couldn't be easier! When you sign up for CodeSnap, we create a repo in your Github account called **codesnap.io**.

Along with the repo, we create two folders: **/posts** and **/images**. *Any* .md or .markdown files pushed into the /posts folder will be instantly 'publish' under your name on codesnap.io.

You can of course, choose to add and edit markdown files whatever way you find easiest, on your local machine or through Github's in-app editor. Doing either assumes that you have a basic understanding of [how Git and Github work](https://help.github.com/) as well as [how to write markdown](https://daringfireball.net/projects/markdown/basics).


### How do I add images?

Easy! You can push any image you'd like into your **/images** folder and reference it relatively within your posts with the path 'images/image_name'.


### How can I make changes to Other People's Posts (OPP)?

Click on the 'propose changes' button on the post page. When logged in, you'll be able to fork and make a commit using Github's in-app editor.

Github automatically makes a patch of the other user's repo, and deletes said patch once your pull request has been merged or closed by the original author.


### How should I format my blog post?

When you create a new account, we create a starter post for you (don't worry, it's not published).  This file, as well as all posts you write, must be .md or .markdown filetypes.  The top of each file should contain the post's metadata (without the added quotes):

'---

title: This is my blog post

tags: Markdown, YAML, CodeSnap

published: true

---'

**title** - the title of your posts.
**tags** - a comma-separated list of tags you want to be associated with your post.
**published** - true or false depending on whether the post should be published on our site (if you do not include a line for published in the metadata, automatically assume the value of published should be true

It's important to pay close attention to your metadata so that your posts will be viewed by people who search for related content. Make sure not to include  any punctuation after the colon of the metadata section. For example "title: my first post: hello", would cause an error.

### Who made CodeSnap? Can I contribute?

[Chris](https://github.com/kidmillions), [Sat](https://github.com/smkhalsa), [Michael](https://github.com/m-arnold) and [Ben](https://github.com/bdstein33) worked on CodeSnap, and [other contributors are welcome](https://github.com/codesnap-io/codesnap).
