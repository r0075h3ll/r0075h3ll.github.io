---
title: "Hacking Electron Applications 101"
description: A beginner's guide to understanding and exploiting vulnerabilities in Electron applications
publish: true
tags:
  - electron
  - security
  - hacking
  - web-security
enableTableOfContent: true
isNewsletterActivated: true
---

This post can be considered as a 101 guide to few concepts, which are
- How browsers work
- What is electron
- Reverse engineering electron applications
- Commonly exploited misconfigurations

### Introduction

Browser, that's something you are using right now to read this article, but how is this working, how does some symbolic stuff come together to form something that looks cool(or boring maybe). You see, browser is something, in an abstract way, that fetches and displays the content you requested, and for doing that it comes with following components:
- Rendering engine : Figures out how to display the requested content
- JavaScript engine : Executes JS code
- UI & Its backend
- Networking : Performing network related operations to fetch and send data
- Data Storage : Storing cookies

#### Types of process

Talking about modern web browsers, they primarily, have got three types of process: 
- Main/browser process
- Renderer process
- Plugin process

The main process mainly handles functions such as window creation and management, storage related stuff(such as cookie storage), networking, etc. Renderer processes looks over the frontend part, like parsing HTML and CSS, decoding images, etc. and the Plugin process literally contains the plug-ins in it.

#### Multi-process architecture

At one time, a single evil web app was enough to crash a browser, because all of it was managed by a single process and thus making it a perfect target for attackers, as crashing a single tab successfully would make other things go ham as well. Presently, each tab on your browser is managed by separate renderer process, so even if a web page acts suspicious and hangs up on you, you can still operate on the other tabs. This comes with an advantage and a disadvantage as well.


Each process in a computer has got its own private memory space and resources, which isn't shared. This makes the program, which is getting executed, secure from any outer interventions, this is also called Sandboxing. However, this also increases the overall memory consumption, because for each tab a separate renderer process is being created. This procedure of process creation/management is mainly followed by Chrome and Chromium.


### Electron

> Electron is a runtime framework that facilitates cross-platform desktop application development by using HTML, CSS and JavaScript. It uses **Node.js** for backend and **libchromiumcontent** from Chromium for rendering(frontend).

Creating desktop application has its own complications. Set of tools, libraries, languages, frameworks, etc. completely change when you hop onto some other operating system, thus making cross-platform desktop application development a troublesome task.

The reason I discussed about browsers, particularly about Chromium, before jumping into Electron, is because Electron uses some browser(Chromium) components to do its work and therefore the multi-process architecture resembles. There are two types of processes that run in an Electron app:
- Main process
- Renderer process

Each app can have only one Main process but multiple Renderer processes can be spawned by the main process. Main process is a privileged process because it runs in Node.js environment and therefore it has access to Node.js APIs. Renderer, on the other hand, is the not-so privileged process, as the name suggests, it handles the rendering part.

How does an Electron app use system functionalities(like reading/writing into files, etc.), you might ask. We've got preload scripts for that.

Preload scripts contain code that runs in renderer [context](https://blog.kevinchisholm.com/javascript/context-object-literals/) before the web app's code. These scripts have higher privileges since they've access to Node.js APIs.

### Reverse engineering electron applications

Electron applications come packed in **asar** format, which is basically a simple TAR like format. In order to get the source code of an application, you'll have to extract a particular asar file. The process can be broken down into following steps:

- Run any app that uses Electron, I've taken Discord for this example, and then do 
```
ps x | grep -i 'discord.*path'
```
- Try looking out for a string that looks like this *--app-path=/opt/discord/resources/app.asar*
- Go to that directory and extract the content
```bash
npm install -g asar
asar extract app.asar discord-app 
cd discord-app
```

Reference : [Adventures in Hacking Electron Apps](https://dev.to/essentialrandom/adventures-in-hacking-electron-apps-3bbm)

### Misconfigurations

The first step towards finding a vulnerability(after extracting the .asar file) is to find a place to search for, basically finding an entry point is your next task. Mostly, you will find package.json which acts like a configuration file for the application. Below is a snippet of [package.json](https://github.com/MrH4r1/Electro-XSS) to give you an about what kind of information it contains:

```json
{
  "name": "electro-xss",
  "version": "1.0.0",
  "description": "An Electron application that may be exploited for XSS and RCE.",
  "main": "index.js",
  "scripts": {
    "electro-xss": "electron ."
  },
  "author": "MrH4r1",
  "license": "ISC",
  "dependencies": {
    "electron": "^17.0.0",
    "jquery": "^3.6.0"
  }
}
```


The **main** field in above snippet, points to the start-up script of the application(which is index.js in this case), this **index.js** is our entry point in this scenario. After getting to the entry point, you can now look out for certain misconfigurations that carry huge impact. Electron is provided with two significant features, that are commonly exploited:

- nodeIntegration : allows application to access Node.js APIs to work with system components
- contextIsolation : separates/isolates Electron's internal logic and preload script from the actual application code

#### Node Integration

This basically allows the renderer process to use Node.js APIs to use the wide range of system functionalities it offers, like arbitrary file read/write, creating child processes, execution of binary files, performing network related operations. Enabling this will give the client side scripts access to system wide functionalities.

Vulnerable code will look something like this:

```javascript
//index.js
const MainWindow = new BrowserWindow({
  webPreferences: {
            nodeIntegration: true
        }
});
```

*BrowserWindow* is an object that is used to control window functions such as minimization, maximization, window creation, etc.

Let's consider a scenario where an app is vulnerable to XSS. Because it is vulnerable to XSS, the attacker can now inject arbitrary JS code with [require()](https://nodejs.org/en/knowledge/getting-started/what-is-require/) function.

```text
<img src=x onerror=alert(require('child_process').exec('xcalc'))> //a simple payload to pop a calculator
```

#### Context Isolation

Context Isolation is another attribute in Electron that runs preload scripts and Electron's internal logic in a separate context. Preload scripts have access to Node.js modules and therefore the misconfiguration will lead to app(running in renderer process) getting access to APIs accessible by preload script(s). Below is the snippet that has got contextIsolation set to *false*:

```javascript
//index.js
const MainWindow = new BrowserWindow({
  webPreferences: {
            nodeIntegration: true,
            contextIsolation: false;
        }
});
```
Attackers can use this misconfig to completely change the application functionality.

### Conclusion

This was just a "little" glimpse of the world of desktop applications made with Electron. Electron has already implemented a couple of security measures, for example nodeIntegration is set to *false* and contextIsolation is set to *true* by default, thus preventing plain attack vectors beforehand. Nevertheless, the implemented defenses are not foolproof so far, researchers are still finding new attack vectors every now-and-then.

If you want to go futher with the topic, you can check out [Doyensec's Blog](https://blog.doyensec.com/), it has got a lot of awesome articles related to Electron security, you can give them a read.

That's all for this post, meet you in another one.
