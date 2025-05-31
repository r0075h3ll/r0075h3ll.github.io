---
title: "CSP for Dummies"
description: A comprehensive guide to Content Security Policy (CSP) for web security beginners
publish: true
tags:
  - web-security
  - CSP
  - security-headers
  - XSS
enableTableOfContent: true
isNewsletterActivated: true
---

Ah, I am writing this post after 2 years of writing my first one, procrastination never hit me like that before. Anyways, without wasting much of your time, let's just get started with the topic. In this post, I'll elaborate two things:
1. How CSP works
2. Bypassing CSP

### Introduction

Content Security Policy is a browser security mechanism that can be used as a second line of defense against code injection attacks such as XSS, ClickJacking, etc. Content Security Policy works on whitelist based mechanism which means it maintains a list of sources from which the application is allowed to access/import resources like scripts, plugins, images, data, etc. 

Web Applications can impose Content Security Policy by:
- Issuing certain HTTP response headers
	- X-Content-Security-Policy
	- Content-Security-Policy
	- X-WebKit-CSP
	- Content-Security-Policy-Report-Only
- HTML Meta Tag
	- `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">`

### Implementation

As I said, Content Security Policy can also be implemented by issuing response header(s) and thus understanding those headers will let us see what can go wrong in certain situations and how can attackers exploit that. 

Content Security Policy does stuff by using directives, a directive is just a combination of resource type and attribute or it can be defined by mentioning the resource type and the attribute(s) (attributes indicate sources from where content can be loaded and/or executed of a particular resource type). If multiple directives have to be used at once, then a semicolon is used as delimiter. Following are some of the frequently used directives(with their attributes) in CSP:
- default-src: 'self'
- script-src: 'unsafe-inline'
- object-src: 'none'
- image-src: https:

#### Explaination

| Resource Type | Attribute | Description |
| :---:       | :---:   | :---   |
| default-src    | 'self' | 'default-src' is used as a fallback option when the dev is too lazy to define sources for each resource type. 'self' indicates that the website can only load resource(s) from the same origin. |
| script-src | 'unsafe-inline'  | 'script-src' defines location from where JS code can loaded, 'unsafe-inline' imply that inline JS code can be loaded & executed |
| object-src | 'none' | 'object-src' defines sources from where plugins can be loaded, 'none' here clearly states that plugins are not allowed |
| image-src  | https:  | 'https:' is a scheme and indicates that images should loaded from website that use "https:"  |

You can find more directives [here](https://content-security-policy.com/)

### Exploitation

Till now, we saw some examples that gave us a basic idea about how directives in CSP come along to protect the application and/or users. It's time we should jump onto the part where analysis of directives will lead to exploration of possible vulnerablities.

 Developers find it complex to configure CSP and that's what causing most of the screw ups out there. Following are some of the places where the miss outs happen, thus paving a way for code injection attacks:
 - Using unsafe attribute(s) and/or directives
 - Nonce
 - JSONP attack

### Using unsafe attributes and/or directives

So, directives are the building blocks of CSP and getting them wrong will lead to take down of the whole wall of security. In CSP, there are certains attributes that've already been flagged **unsafe** because assigning them to directives simply makes the application as vulnerable as it was without CSP. Some of these attributes and directives are:
- unsafe-inline
- unsafe-eval
- data:
- base-uri

**unsafe-inline** - It has been flagged unsafe cause it grants the application to execute inline scripts, which basically means that any JS code injected by the attacker would be executed by the application and this defeats the whole purpose of having a CSP in the first place.

**unsafe-eval** - There are certain functions & constructors in JavaScript that are better of not being used; **eval()** is one of them. It can perform dynamic instructions by using input recieved from any user. Using **unsafe-eval** allows the application to use dynamic code evaluation which is not considered a good practice.

**data:** - This directive is used to grant developers permission to import data from base64 strings. Using this directive in combination with **script-src 'unsafe-eval'** can lead to execution of attacker's injected code.

An exploitable situation will look something like:
```text
response header: Content-Security-Policy: script-src 'unsafe-eval' data: 'self'
bypass: <script src="data:;base64,WFNTCg=="></script>
```

**base-uri** - This directive sets the base URL for the relative URLs that exist in a document. Absence of this directive will let the attacker set/inject the base URL ultimately granting access to tamper with files that are being served on the application.

```html
<head>
	<base href="http://www.google.com" target="_blank">
</head>
<script src="/hello.js"></script> <!-- this sets location to http://www.google.com/hello.js as the base URL is set to http://www.google.com !>
```

### Nonce

Nonce is just a long string of random characters. Inline scripts are by default blocked in a page by CSP, but sometimes it is a necessity to use inline script(s) and using Nonce allows developers to do so in a secure way. In order to inject an inline script, **nonce** attribute must be set in the script element.

```html
<script nonce="r4nd0m455Ch4r5">
	var blah = "DND";
</script>
``` 

Following are some instances of misconfigs that an attacker can exploit:
- Same Nonce being used for multiple requests - Same Nonce can be used for multiple request, thus allowing attacker to inject inline scripts
- Predictable Nonce values - Values are not random, attacker can predict another valid Nonce and use that to inject inline scripts
- Outputting user/attacker controllable values inside Nonce protected script

To understand the third bullet point, let's consider a scenario where we've got an URL and a Nonce protected inline script:

```text
https://www.google.com/hey.php?id=1

<script nonce="r4nd0m455Ch4r5">
	var id = #URL.id# //assigns the value of id parameter to this variable
<script>
```
**id** parameter in the given URL is user controllable, and to achieve code injection the attacker only needs to replace the parameter's value with a valid payload.

### JSONP attack

JSONP stands for JSON with Padding, it is basically a method that developers back in the day used to send cross-origin information when CORS was not there yet. Say, we need to fetch some data from an API using JS, following snippet can do the work - 

```html
<script src="http://google.com/api/v1/users"></script>
```

But the thing is that as soon as the response is fetched, it is parsed and executed by the script element. The returned response is  JSON Object, which is obviously not JS code and that's why we get a **SyntaxError**. To avoid this, a function name is provided as the value of **callback** parameter, then the response from the service will look something like this - **userSuppliedFunction(JSON Object)**. The script element then parses and executes the response and that's how we gather response without generating errors with JSONP.


For this attack to work, the application should allow loading resources from a website that is hosting a JSONP endpoint. Say, the target application responds with following header:

```text
header: Content-Security-Policy: script-src csp.com
```

A payload to trigger XSS in this scenario shall be:
```html
<script src="https://siteHostingJsonP.com/jsonp?callback=alert('bypass')">
```

### Conclusion

Code injections attacks like XSS, Clickjacking, etc. have catastrophic impact on the application(s) and user(s) as well. Therefore, it is important to understand that CSP is not a thing to fully rely upon as it only prevents malicious scripts from getting executed, thus acting as a second line of defense.

You can consider following resources to dig deeper into this topic:
- <a href="https://blog.sucuri.net/2018/04/content-security-policy.html">Content Security Policy</a>
- <a href="https://www.imperva.com/learn/application-security/content-security-policy-csp-header/">What is Content Security Policy | Header Examples</a>
- <a href="http://conference.hitb.org/hitbsecconf2016ams/wp-content/uploads/2015/11/">CSP ODDITIES</a>
- <a href="https://research.nccgroup.com/wp-content/uploads/2020/07/csp_best_practices.pdf">CSP Best Practices</a>

Also, instead of manually analyzing headers, you can use tools like:
- <a href="https://csp-evaluator.withgoogle.com/">CSP Evaluator</a>
- <a href="https://cspvalidator.org/#url=https://cspvalidator.org/">Content Security Policy (CSP) Validator</a>


That's all for this post, meet you in another one, bye.