---
title: "Using Gitlab for DevSecOps"
date: 2024-09-28
description: "Basics of GitLab CI, and how to wire software composition analysis with vet into a pipeline."
tags: ["Devops", "DevSecOps", "GitLab", "VET", "supplychainsecurity", "SCA"]
cover: /blog/using-gitlab-for-devsecops.png
originalUrl: https://r0075h3ll.hashnode.dev/using-gitlab-for-devsecops
---

DevSecOps is an established - and now being adopted - philosophy that aims to foster collaboration between Developement, Security, and Operations teams in an Organization. Being an integral part of SDLC, security testing is something that has helped significantly in Software Developement Lifecycle to identify security risks at earlier stages, and thereby helping in more reliable and faster releases of a product.

But, it is actually cumbersome for a pentester who is, let’s say, doing secure code review of a project - to run a code analysis tool each time. That is where software build tools such as Gitlab / Github / Jenkins / etc., can be used to automate this process of software supply chain risk assessment via finding and reporting security loopholes in the **source code** to identifying **third-party** and/or **OSS** components in use with known vulnerabilities.

But, how do you get started? Let’s talk about

- Basics of Gitlab CI
- How to use Gitlab CI to implement DevSecOps

### Introduction to Gitlab CI

Gitlab is a source code management platform based on git, that also provides a CI service to help automate things like build, performing test cases, deployment, etc., all of that using a pipeline defined in `.gitlab-ci.yml` file of a repository.

A pipeline is simply a layout for a host machine to follow in order to complete a certain task. For e.g., take a car manufacturing factory - the way a car is built is by enforcing a certain serial set of instructions that the workers should follow to perform operations on different components in a manner that produces a deliverable vehicle.

In a similar way, Gitlab CI can be used to setup a pipeline, consisting of commands that would build / test / deploy the application.

Let’s consider a basic pipeline config, written in YAML syntax, for a project in Gitlab. It’ll look similar to this:

``` yaml
stages:
  - build_stage 
  - test_stage
  - deploy_stage

variables:
    tool_name: semgrep // global variable
    tool_version: 7.9 // global variable

build_job:
  stage: build_stage
  variables:
    build_path: some_path_location // local variable
    build_tool_name: maven // local variable
  script:
    - echo "Building the project..."
    - mkdir build
    - touch build/${PROJECT_NAME}.jar
  artifacts:
    paths:
    - build/

test_job:
  stage: test_stage
  script:
    - echo "Running tests..."
    - echo "Tests passed!"  # Replace this with actual test commands
  dependencies:
    - build

deploy_job:
  stage: deploy_stage
  script:
    - echo "Deploying the project..."
    - echo "Deployment successful!"  # Replace this with actual deployment commands
  when: manual
```

Some fundamental components required for a pipeline setup is: **stages**, **jobs**, **script**, **rules**, and **variables**.

**Jobs**, being a basic unit of pipeline, consist of a list of commands that are written under **script** key - you can think of jobs as functions that can be run based on certain conditions, and these conditions can be defined under **rules** key.

Each job belongs to a stage, and there can be multiple stages inside of pipeline. **Stages** are used to define an order in which different jobs (functions) would run.

Additionally, **Variables** are made available for a job to use - based on their scope i.e. global / local.

Now, that we’ve looked into the basics of a pipeline setup in Gitlab, let’s see how this information can be leveraged to improve DevSecOps.

### Improve SBOM analysis using Vet

Vet is a software composition analysis tool that helps developers and security engineers to identify vulnerabilities in their software supply chain.

It is written in Go, and can be implemented in CI pipeline using:

- OS Package Manager
- Docker
- Go Package Manager (`go install`)

A sample use-case for Vet would be to use it inside of your a custom container image to scan your project for any software supply chain security risks.

```yaml
stages:
  - build
  - vet
  - deploy
  
  
build_job:
  stage: build
  script:
    - ./gradle cleanBuild
    
sca_vet_job:
  stage: vet
  image: golang:alpine
  script:
    - go install github.com/safedep/vet@latest
    - export ENV="/go/bin:$PATH"
    - vet scan -D $(pwd/project-dir) --report-path $(pwd/project-dir/vet-report.md)
   artifacts:
    paths:
      - ./project-dir/vet-report.md
      
deploy:
  stage: deploy
  script:
    - echo "Deploying on Goole Cloud Engine"
```

*Source: [gist](https://gist.github.com/r0075h3ll/9b62a66297357451c125fa3748c12665)*

Based on your requirements, jobs can be configured to be executed based on different events/triggers i.e. push, merge requests, etc.

> 🔎 Checkout [SafeDep](https://docs.safedep.io) for more insights

### Conclusion

A thorough risk assessment is required before integrating any third-party or OSS component into your project during build, compile, or run-time. On top of that, a fast paced project, in terms of functionalities, may seem intimidating for a researcher to analyze, and this is were automation tools and techniques make your life easy.

Hit me up on [X](https://x.com/r0075h3ll) for any kind of discussion, especially InfoSec :)

See you in another post. Thanks for reading!
