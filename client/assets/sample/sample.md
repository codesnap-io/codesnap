---
title: Test Readme
author: Michael Arnold
date: 1234225
summary: "It's a README"
tags: README, js, node.js
---

Another week (actually, solo week at [Hack Reactor](http://www.hackreactor.com)), another ES6 post. `let` statements are among the most commonly adopted ES6 features seen in the wild so far, and they are already compatible with most modern browsers, so it's worth a quick look into the Power Of Scoping and when and where to use `let`.

### Block Scoping Will Change Your Life

In previous ECMAScript standards, it was nigh impossible to scope variables locally to blocks:

```
  function scopeItOut() {
    //all variables declared within this function are lexically scoped.

    for (var i = 0; i < 10; i++) {
      var foo = 7;
    }

    console.log(foo); //but what does this log?

  }
```

`var` ignores block scope, and the program will log the number 7.  `let` will scope `foo` properly within the block, and log `undefined` when looked up in this context.

Same goes to `if` blocks:

```
  if (x > 0) {
    let doves = "cry";
  }

  //doves is unavailable here
```

This is super helpful in order to keep variables local. The same principle is applied when using an iterator in a for loop. Instead of declaring a global variable `i`, you can `let` it scope only to the loop in which it is used.

### Avoiding Hoisting

Another special trait of `let`: when used, its declaration is **not** [hoisted](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html) to the top of the lexical scope. Unlike with `var`, you cannot secretly use the variable before it is defined.

```
  console.log(foo);
  var foo = "This hoists and logs!";

  console.log(bar);
  let bar = "This does not! ERROR, ERROR, ERROR."
```

Irregardless, why your program would not declare variables at the top of the scope beats me.

### When in Doubt, `let` It Be

As it's in your program's best interest to (usually!) scope your variables properly, you'll begin to see `let` use rise prodigiously and become ==**more of a rule than an exception**==. So it's best to frame the `let` vs. `var` battle in terms of when you should use `var`. In most other cases, `let` is better.

* Are you, for some crazy reason, forced to declare a variable after said variable has been accessed by the program? **use `var`.**

* Are you explicitly (and perhaps needlessly) declaring a variable within a block statement that will be used in another part of your scope? **use `var`.**

* Are you for sure *for sure for sure* never going to move declaration of this variable to another scope? **you can use `var` at the top of function definitions.**

* None of these? **just use `let`.**

### Let's Meet Cousin Const

One other nifty declaration coming to browsers is `const`. It's exactly as it sounds: `const`s are [constants](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), and scoped to blocks similarly as `let`. Once declared, `const` values are 'read-only' and cannot be changed.

```
  const thePurpleOne = "Prince";
  thePurpleOne = "The Artist Formerly Known As Prince"; //Throws an error
```

In this case, `thePurpleOne` is now reserved in the local namespace. No functions or variables can use that name.

There are a few quirks with constants, however:

```
  const sillyObject = {foo: "bar"};
  sillyObject = {bar: "foo"}; //Throws an error
  sillyObject.bar = "foo"; //adds key "bar" to sillyObject

```

Although the object is constant, it's properties are not. So be careful out there, children. Nevertheless, `const` should be a great bodyguard for unchangeable values in your program.

Any other thoughts about `let` and `const`? Please share!
