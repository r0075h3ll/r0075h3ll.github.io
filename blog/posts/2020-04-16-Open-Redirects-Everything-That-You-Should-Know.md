---
title: "Open Redirects: Everything That You Should Know"
description: A comprehensive guide to understanding and preventing open redirect vulnerabilities in web applications
publish: true
tags:
  - web-security
  - open-redirect
  - security
  - vulnerability
enableTableOfContent: true
isNewsletterActivated: true
---

Hey There! In this post I'll be explaining everything that is necessary for a layman(not really) to understand Open Redirects. Let's start!


### Introduction

> Open Redirect or Open Redirection is a situation in which a website redirects or sends the user to another website by taking parameter value as the destination. 

Example:
- URL : : `http://site.com/redir?url=http://www.google.com`
- parameter name : : url
- parameter value : : `http://www.google.com`
- destination(the website to which you will be redirected) : : `http://www.google.com`

### Javascript based redirections

The URL will send you or redirect you to `http://www.google.com`. Now, let's take a look at the code which is the cause of our redirection.

```javascript
var url = 'http://site.com/redir?url=http://www.google.com';
var param = new URL(url);
window.location = param.searchParams.get('url');
```

What's happening is that, the code is taking the parameter value from the URL which is `http://www.google.com` and then it's assigning the value to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/location" target="_blank">`window.location`</a> and that's how you are getting redirected to `http://www.google.com`. And this is what we call - Javascript Based Redirection.

`window.location` is the sink here, whereas `param.searchParams.get('url');` is the source.

**Note:** When you're trying to fuzz the parameters, remember that Javascript Based Redirections give you `200` and not `3xx` as the response code. Also, it's usefulness is only restricted to DOM XSS.

### Header based redirections

Header Based Redirections are the redirections triggered by the server side scripts written in php, java, etc. And, this redirection is the OG as it gives `3xx` as the response code and it can be uplifted to make SSRFs work.

Let's see an example PHP code that does this redirection:
```php
$redirect_URL = $_GET["url"];
header("Location:".$redirect_URL);
```
As usual, the parameter value is getting stored into the location header which leads us to our redirection. It can be chained with vulnerabilities like SSRF, OAuth token disclosure and CRLF Injection. It can also be used for phishing.

Functionalities you should look upto(while hunting for Open Redirects): login, signup, register & logout.

### Meta refresh redirections

Meta Refresh Redirection is a client side redirection. It occurs within your browser and requires no server side interaction. Meta tags are inserted into the head tag.
```html
<head>
  <meta content="1;url='http://www.google.com';" http-equiv="refresh"/>
</head>
```

The above meta tag, if inserted in a HTML document, will redirect to `http://www.google.com` after waiting for one second. These type of redirections (Javscript Based and Meta Refresh) are client side redirections and hence they will always puke out `200` as the response code. The exploitation is just same as Javascript Based Redirection, the only thing you have to keep an eye on is the meta tag and the JS content.

<br>

### List of quality bypasses

Here's a short list of payloads that I've collected, after going through some HackerOne reports and using them on different targets:

- `https:www.google.com`
- `HtTp://google.com`
- `http\x3A\x2F\x2Fgoogle.com`
- `//google。com`
- `x00http://google.com`
- `////216.58.214.206`
- `/\216.58.214.206`
- `x20http://www.google.com`
- `https://www.google.com`
- `hthttp://tp://www.google.com`
- `。/www.google.com`


### Dorks and parameter names

Some useful google dorks:

- `site:target.com AND inurl:url=http(s)`
- `site:target.com AND inurl:u=http(s)`
- `site:target.com AND inurl:redirect?http(s)`
- `site:target.com AND inurl:redirect=http(s)`
- `site:target.com AND inurl:link=http(s)`

Some parameter names that need attention while looking for Open Redirects:

- `?next=`
- `?url=`
- `?dest=`
- `?redirect=`
- `?returnTo=`
- `?go=`
- `?redirect_uri`
- `?continue=`
- `?return_path=`
- `?externalLink=`
- `?URL=`

More resources:

- <a href="https://pentester.land/cheatsheets/2018/11/02/open-redirect-cheatsheet.html" target="_blank">https://pentester.land/cheatsheets/2018/11/02/open-redirect-cheatsheet.html</a>
- <a href="https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md" target="_blank">https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md</a>
- <a href="https://blog.detectify.com/2019/05/16/the-real-impact-of-an-open-redirect/" target="_blank">https://blog.detectify.com/2019/05/16/the-real-impact-of-an-open-redirect/</a>


That's all for this post, it's <a href="https://twitter.com/r0075h3ll">Hardik Nanda</a>, signing off!