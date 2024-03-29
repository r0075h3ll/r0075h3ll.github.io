---
title: "How secure are the industries?"
layout: post
categories: ICS
tags: [ICS, SCADA, DCS, PLC]
date: 2023-11-11
---

The Italian Job lit the gasoline and caused this explosion of an article. There's a scene where the hacker protagonist hacks into the traffic system to buy some time for his partners who carried out a heist. Incited and curious me took a dive and got introduced to a whole new realm that involves the usage of hardware and software to get industries and other critical infrastructures working. This is going to be a cardinal prose on ICS and its threat model, to set you up for the coming article where we'll be looking at Traffic Control Systems. Let's discuss the findings!


Introduction
---

Visualize what an industry looks like; a myriad of wires and stack lights, series of unwelcoming buildings, alarms going berserk every now and then. These are the only things that anyone sees miles across. Sounds overwhelming enough, nonetheless, they serve important functions. Aforementioned bunch of things can be found in:
- Healthcare sectors
- Chemical factories
- Distribution facilities
- Heavy engineering factories
- Mass transit systems(railway, metro, etc.)
- Nuclear, thermal and water treatment plants

This is a non-exhaustive list, regardless, that makes it interesting, important and buzz of a thing to be probed and discussed. Primarily, it were only analog signals that pioneered the functioning. As the time continued, corporate eventually started offshoring their production related operations to internet and IT environment such as cloud services. That came with a great cost on both sides of the coin, financial benefits is one thing but then it also had(has) to face different impediments because:
1. Integrating legacy with state-of-the-art is complicated
2. System got more susceptible to blunders
3. No fool-proofing against latest cyber attacks

Now let's magnify and address the essentials to develop a general understanding of how components are organized to synergize the workings of machineries, upon which the lives of people depend. 

Machines and Instructions
---

ICS systems are composed of various wireless and control components; they might be mechanical, hydraulic, electrical, pneumatic, etc. All of which is controlled and monitored by SCADA, which is a part of ICS. Following are some of the components or subsystems that are included in ICS
- Supervisory Control and Data Acquisition(SCADA)
- Distributed Control System(DCS) 
- Programmable Logic Controllers(PLC)

### SCADA & PLC

Think of a room full of small and big LED screen with people constantly hitting the keystrokes to send commands and receive some data, this is what SCADA is, a concept, with **PLC** computers working on [ladder logic programming](https://ladderlogicworld.com/ladder-logic-basics/) to monitor and manage different control components along with human operators. PLC is a micro-controller that comprises of:
1. CPU:
	Responsible for acting upon and generating logical signals.
2. I/O Module:
	Act as a messenger b/w CPU and other control components, they regulate and manage data flow, generate system reports, and check for errors.
3. Function Module:
	Take some load off the CPU by emulating it; it receives a signal, processes the logic and generates an output signal accordingly.
4. Communication Module:
	Section consisting of different ports that provide connection b/w control components and PLC, that work on different protocols.
5. Power Supply:
	Provides the rest of the components with adequate power supply to keep them functioning.

**SCADA** is more of a concept than an end product, used to monitor and control field devices, these field devices may be sensors, actuators, valves, variable frequency drive(vfd), etc. that are used to observe and report back the condition of the working machineries as well as used for controlling the same. A large portion of how they are controlled have got to do with the type of the control device and the **control system** in place.

### DCS

Control system involves the usage of various other components to control field devices, that work on mechanical principles, by sending control signals. There are two types of control systems
- Open loop
- Closed loop

Open loop control systems are those that simply send control signals to the target device without bothering to fetch any on-premise information. On the contrary, closed loop control systems work by first understanding the status of the working field devices and other variables and then accordingly deciding degree to which changes will be applied by the control signals generated. This requires a feedback system to operate. 

For the analogy, consider a conventional room heater that always blows air of the same temperature, regardless of the temperate of the room it's located in, this could result in an undesirable situation if the room is already heated; akin to open loop control system. A better alternative would be a smart room heater that uses sensors to control the temperature of the blown air, thereby being less hazardous and cost-efficient; akin to closed loop control system.

**DCS** basically refers to an arrangement where there are multiple control systems, including controllers, spread across the premise that are used to control field devices without having to report to a central controller, unlike SCADA. DCS and SCADA are often networked together to coordinate the work in order to fulfill the transmission and distribution demands.

### Internet and Cloud

Achievable business benefits soared the offshoring, eventually, leading to a major part of on-prem functionalities now operated via remote stations/locations. This transformation of operations and management delegated the work in a better way thereby letting people off the mundane routine procedures.

IaaS(Infrastructure as a Service) explains this method of service delivery. Application(s), database(s) and other services are hosted on cloud environment. Cloud service providers are responsible for managing the infrastructure part which mostly involves the management of data centers, along with the provided compute, storage and networking resources. Although, **security**, which is a shared responsibility and concern for both the parties, client and the service provider in this case, ends up being overlooked.

Threats
---

Components and services used in ICS are susceptible to threats such as:
1. Human errors
2. Insider threats

Human errors comprise the mistakes that workers in the working environment might make while operating with the machines and/or interfaces that might result in huge catastrophe, it might be mishandling of a particular variable, missing out on important alerts and notifications, etc.

Insider threats on the other hand exist because of improper authentication and/or encryption mechanisms in place, to prevent unauthorized access of machines with digital interfaces. Most of the login interfaces to these devices either have default or weak credentials. Additionally, anyone having physical access to the machine can install malware, consequently getting access to all the controls and sensitive data. Not to forget about outsider threats, let's see in a bit detail regarding what approach someone might follow to get into these systems.

### On the Web

Systems that were not digitalized, promptly, started getting connected to a local area network. This local network, as you might know, is enforcing a standard language through the usage of a communication protocol so that devices or electronic components, manufactured by different companies, can coordinate to get the work done. Getting these systems online will evidently allow them to listen and respond to requests/messages from other devices on the internet. . The whole ICS will potentially succumb to modern cyber attacks given that the framework is archaic and little attention is provided on security measures. 


Proposing the possibility that the local network is connected to the internet, adversaries, now have variegated entry points to penetrate the system, simply put, the attack surface has broadened.


There are search engines like *shodan* and *censys* that are made solely for these purposes i.e. to discover internet facing devices furthermore allowing someone to go a step further to figure out what ports are open and what services are running on them. All of this info gives an attacker a lot to start with, that too without having to interact with the client/victim actively(passive reconnaissance). 

Following are some commonly used protocols, along with their port numbers, used by electronic devices in a network to communicate to other devices, which can be used to construct search engine queries to discern if any host/device is online and listening:
- ModBus: 502
- DNP: 19999
- DNP3: 20000
- Fieldbus: 1089-91
- EtherCat: 34980
- Profinet: 34962-64

Queries can be constructed based upon the provided search operators of the search engine you are using. Following are some resources that can help you get started:
1. Shodan - [https://github.com/AustrianEnergyCERT/ICS_IoT_Shodan_Dorks](https://github.com/AustrianEnergyCERT/ICS_IoT_Shodan_Dorks)
2. Censys - [https://github.com/thehappydinoa/awesome-censys-queries](https://github.com/thehappydinoa/awesome-censys-queries)
3. Google - [https://www.hackers-arise.com/post/2016/07/05/scada-hacking-finding-vulnerable-scada-systems-using-google-hacking](https://www.hackers-arise.com/post/2016/07/05/scada-hacking-finding-vulnerable-scada-systems-using-google-hacking)

<figure>
	<center>
		<img class="zoom" style="width: 750px; height: auto;" src="/static/images/shodan.png"/>
		<figcaption>Shodan</figcaption>
	</center>
</figure>

<figure>
	<center>
		<img class="zoom" style="width: 750px; height: auto;" src="/static/images/censys.png"/>
		<figcaption>Censys</figcaption>
	</center>
</figure>

Conclusion
---

Industrial Control Systems have always been a target of state sponsored and corporate nemeses, further turing into, indeed, a potential threat on the population of any region. There have been incidents in the past that testify to this catastrophic side of the failure and compromise:
- [https://www.wired.com/2014/11/countdown-to-zero-day-stuxnet/](https://www.wired.com/2014/11/countdown-to-zero-day-stuxnet/)
- [https://www.securityweek.com/irrigation-systems-in-israel-disrupted-by-hacker-attacks-on-ics/](https://www.securityweek.com/irrigation-systems-in-israel-disrupted-by-hacker-attacks-on-ics/)
- [https://www.darkreading.com/attacks-breaches/brief-history-of-ics-tailored-attacks](https://www.darkreading.com/attacks-breaches/brief-history-of-ics-tailored-attacks)
- [https://indianexpress.com/article/cities/ahmedabad/152-labourers-killed-in-industrial-accidents-in-3-districts-of-gujarat-8489664/](https://indianexpress.com/article/cities/ahmedabad/152-labourers-killed-in-industrial-accidents-in-3-districts-of-gujarat-8489664/)

There have also been [instances](https://www.itgovernance.co.uk/blog/the-5-biggest-ransomware-pay-outs-of-all-time) where governments had to pay ransom to the APTs to get the control back.

It will be interesting to see how engineers and developers will tackle some of the precedent problems along with the contemporary ones followed by the advent of AI. That's all for this post, meet you in the next one.