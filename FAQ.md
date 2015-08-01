### What is CodeSnap?

Codesnap is a technical blogging platform that enables users to manage their blogs using Github.

### How does it work?

Managing your blog through CodeSnap couldn't be easier! When you sign up for CodeSnap, we create a repo in your Github account called codesnap.io. Simply add your markdown files to your posts folder and push the changes -- you're posts will be deployed instantly.

### How should I format my blog post?

When you create a new account, we create a starter post for you (don't worry, it's not published).  This file, as well as all posts you write, must be .md files.  The top of each file should contain the post's metadata:

```
---
title: This is my blog post
tags: Markdown, YAML, CodeSnap
published: true
---
```

It's important to pay close attention to your metadata so that your posts will be viewed by people who search for related content. Make sure not to include any any punctuation after the colon of the metadata section. For example "title: my first post: hello", would cause an error.

Title - the title of your posts.
Tags - a comma-separated list of tags you want to be associated with your post.
Published - true or false depending on whether the post should be published on our site (if you do not include a line for published in the metadata, automatically assume the value of published should be true
