---
title: "LLM Security Series - Prompt Injection"
layout: post
categories: AI
tags: [llm, prompt-injection, llm-defense]
date: 2023-10-13
---

This is the 2nd post for the series, and in this post we'll be looking over **Prompt Injection** along with potential and implemented defenses against it.

If you're new to this, I would suggest you to go through the [first](https://r0075h3ll.github.io/LLM-Security-Series-01/) post of the series before you start reading this. 

Let's dive in!

Enterprise outlook
---

In an enterprise environment, LLM is categorized into following types
1. Consumer LLM: deals with public/general data
2. Employee LLM: deals with private/specific data
3. Customer LLM: (same as employee LLM)

Categorization is done on the basis of the target users i.e. the group of people it(LLM) would be specifically serving. A consumer LLM generates data that would be relevant for the consumers(general population) e.g. ChatGPT, an employee LLM generates data relevant for the employees or internal members of an organization, employees can ask it to analyze some company related data for them, they can ask it to fetch mail addresses of the board of directors and so on, it is more of a chat-bot, powered by GenAI. A customer LLM, as the name might suggest, is made for a customer/business/corp/etc. to serve a specific purpose, it can only answer question(s) compliant with the business.


With the surge in the users of ChatGPT and other GPT based applications, there's also an increase in the number of applications that use LLM in some way or the other to provide a particular functionality/feature; **LLM Integrated Applications**. These may be general purpose applications such as note-taking apps, productivity apps, or it can be something that is specifically designed to serve a particular industry such as a music production application, health tracking application, application that teaches you programming, AI agent that assists you in managing your mail account, etc.


The data-instruction equation
---

The mere thought that an AI assistant has access to your mail account, and by sending prompts to your assistant, you can perform various operations such as sending a mail, deleting mail(s) received from a particular mail address, summarizing the content inside of mails, etc. seems like it is something that everyone should have at their disposal. Dissemination has started already, we can see quite an inundation of LLM Integrated Applications in the market.

The aforesaid implicitly posits that LLM has started dealing with private and confidential data, and with that level of privilege it becomes an obligation to protect and armor users and the LLM itself, well enough, against outsider threats. 

LLM Integrated Applications are to said to have *blurred the line between data and instructions*; meaning that the underlying intelligence in the application **can't tell data and instructions apart**. Given instructions inside what should be considered as data, to the AI, it would gracefully interpret those as instructions and perform whatsoever actions it is asked to.


LLMs are becoming more like computers, black box computers to be specific, that simply execute program written in some natural language.

Following markers outline the reason for why Prompt Injection attacks are more likely to be successfully exploited than any other functionality hijacking or backdoor attack:
- No subject matter expertise required
- Can be launched actively and passively
- Specifications of the target is trivial
- No cost to run the attack

Based upon the adversary's interest(s), Prompt Injection attack can be classified into two types:
1. Prompt Injection
2. Indirect Prompt Injection


### Prompt Injection

> A prompt is simply an instruction written in any language. By supplying prompt(s) is how someone can specify the result/response that they want from a LLM. 

Prompt injection attack is an attack where the attacker can supply such prompts to the model that induces the model to do something that it was not supposed to.

A simple scenario would be when the attack is directed towards the underlying intelligence that incites it to
- Generate something that it was not supposed to i.e. tricking the model to go against the content/usage [policies](https://openai.com/policies/usage-policies) by circumventing the guardrails. 
- Divulge system prompts; set of rules or instructions that are followed by the LLM in order to facilitate content generation in a confined manner. Upon being exposed, these rules can give, the attacker, a lot regarding the internal workings of the LLM and thus further helping them to launch more novel attacks.


### Indirect Prompt Injection

Indirect Prompt Injection is a prompt injection attack that is launched towards user(s) of LLM Integrated Application(s). Attacker delivers their crafted malicious prompts to their target's LLM to achieve a particular goal.

<br>
<center>
	<figure>
		<img style="width: 480px; height: auto;" src="/static/images/indirect-prompt-injection.png"/>
		<figcaption>Indirect Prompt Injection</figcaption>
	</figure>
</center>
<br>

The delivery methods of malicious prompts can be:
1. **Active**: 
	Involves getting in direct contact with the target such as sending a mail with a body full of malicious prompts. The target is using an AI with their email client that reads their mail(s) and summarizes it. It innocently processes any prompt or instruction in the mail body. 
2. **Passive**:
	Injecting malicious prompt(s) at public spots on the internet such as Wikipedia, Reddit, etc. that are used as a [external knowledge source](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) or the subject of analysis by a personal AI assistant. 
3. **User-Driven**:
	The user of the AI assistant might also make this blunder of ingesting or analyzing content that has embedded malicious prompts in it.
4. **Hidden**:
	Quite similar to user-driven method, but it makes the use of extended attack surface, such as if the LLM can analyze images, the attacker can hide prompts inside the image.


Here's a taxonomy of potential tactical goals that can be achieved using aforesaid methods:
 - **Information gathering** - Campaigns can be launched by nation states to spy on journalists and whistle blowers to know their whereabouts and the topics that they're currently working on -- makes tracking and tracing real easy.
 - **Fraud & Phishing** - Phishing becomes more easy because the model has learned and picked up from your conversation to improve its persuasion so that it can craft pitfalls better.
 - **Malware & Intrusion** - LLM can be asked to provide the user with malicious links, directing them towards malware and eventually gaining control over their system.
 - **Manipulated Content** - Manipulation becomes even more feasible because of the authoritative tone in the generated text and over-reliance on LLMs. They can be used to launch misinformation campaigns by providing wrong summaries for different documents, showing biased and polarized results when searched about a topic, manipulation by blocking certain sources in order to make your belief stronger or weaker in something and the list goes on.
 - **Availability Disruption** - LLM can be tricked into running resource extensive task(s) in the background in due course launching a DoS attack, thus making the service unavailable to other users.


### Unilateral defense

The threats in the ecosystem can be categorized, in an abstract way, into following categories:
1. Flexibility of behavior and functionalities: the agent can be steered by plain and simple prompts
2. Unilateral defense mechanism: filters and other defenses being only employed to prompts recieved from chat interface 
3. Retention of injected prompts throughout the conversation

LLM integrated applications being vulnerable to Indirect Prompt Injection attack indicates one-sided defense mechanism being in place i.e. the filters are only/mostly applied in the chat interface of the model. A surge in plugins and tools leads to broadened attack surface, providing adversary more entry points for prompt injection, thus leading to takeover of your AI agent to perform servile actions for the them(adversary).


Here are some intriguing and insinuating instances of researchers tinkering with AI agents: 
- Reviving Sydney(the bing chat alter ego) - [bringsydneyback.com](https://twitter.com/CrisGiardina/status/1652835270130008064)
- [Bypassing source code analysis checks](https://twitter.com/thomas_bonner/status/1651160646107508736)
- [Data exfiltration using plugins and tools](https://embracethered.com/blog/posts/2023/chatgpt-plugin-youtube-indirect-prompt-injection/)

Given that this tech is still in its early development stage and new plugins and tools are coming up on a regular basis, the attack surface is also augmented as you're reading this.

Solutions
---

Following are some of state-of-the-art for defending against Prompt Injections:
- LLM as a proxy or reverse proxy, to curb on I/O of the model, like rebuff.
- Multiple layers of LLMs working on input sanitization and I/O validation.
- Concept of markup languages like [ChatML](https://github.com/openai/openai-python/blob/main/chatml.md).
- Devise of a [solution](https://twitter.com/simonw/status/1569453308372463616) that works similar as prepared statements for SQL Injections.
- LLM moderator; a general model(not trained on instruction tuning) that detects the attack, without digesting the input, by going beyond mere detection of clearly harmful output.

It is quite difficult to say if we're going to see any concrete defense mechanism for Prompt Injection attack anytime soon. Although, Sam Altman suggested synthetic data as the [stepping stone](https://x.com/marvinvonhagen/status/1661772354723229702?s=20), which aims to tackle prompt injection by training the model using synthetic data i.e. a dataset containing prompts discerned to be malicious.


That's all for this post, see you in the next one!

### References

1. Not what you’ve signed up for: Compromising Real-World
LLM-Integrated Applications with Indirect Prompt Injection: [https://arxiv.org/pdf/2302.12173.pdf](https://arxiv.org/pdf/2302.12173.pdf)
2. Demystifying LLMs and Threats: [https://youtu.be/q_gDtOu1_7E?si=3f6Qkrb1ItwPsx4x](https://youtu.be/q_gDtOu1_7E?si=3f6Qkrb1ItwPsx4x)
3. Simon Willison’s Weblog: [https://simonwillison.net/](https://simonwillison.net/)