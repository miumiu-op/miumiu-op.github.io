---
title:  "Jira as Work Tracker"
date: 2023-12-25T22:55:00+08:00
draft: false
author: "Miaomiao"
tags:
  - Jira
  - Workflows
  - Sample
---

This article outlines how I implemented a Jira-based work tracking system in technical writing workflows.

In the fast-paced realm of technical writing, effective collaboration with diverse stakeholders is vital for delivering high-quality documentation. To optimize our communication and boost transparency, I introduced a system using Jira as our work tracker. This innovative approach has significantly streamlined our workflow, addressing various challenges encountered during the process.

## Challenges

During my work, I encountered several challenges in collaborating with stakeholders as follow:

#### Frequent Status Inquiries
Stakeholders, including product managers, developers, and support teams, often sought updates on document progress, including details such as links to documents in different environments and release status. This constant exchange of information created inefficiencies and consumed valuable time.

#### Inconsistent Input
Stakeholders provided input that underwent subsequent changes, introducing confusion and leading to delayed responses on the writer's end.

#### Post-Tracking Issues
Tracing back the origin of specific pieces of information became challenging after the documentation was completed, contributing to potential confusion and misunderstandings.

#### Unclear Release Signals
Ambiguity surrounding when to publish completed content caused delays and uncertainty in the release process.


## Solution

To address these challenges, I organized a meeting with stakeholders to present the benefits of using Jira. During this session, I provided detailed instructions on how to use Jira and successfully garnered alignment for adopting this approach.

The ticket template consists of the following information:

- Product/project name
- Release version
- Release date
- Release signal by product owner
- Conversation around the doc if any
- Doc tracker fields as follows:

```
| Document Title | Input** | Status** | Doc Link** |  
```

**Input refers to the sources that SMEs provide to the writer, such as Git PR, SNS conversation, Jira ticket, etc.

**There are six statuses: waiting for input, draft, in tech review, in language review, ready for release, and released.

**Use preview links when the document is ready for release and replace them with production links when the document is released.


## Results

Following the implementation, I conducted a retrospective to assess the impact of incorporating Jira into our documentation processes:

| Before (Without Jira)                                         | After (With Jira)                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| Stakeholders sought updates, causing inefficiencies.           | Transparent progress tracking in Jira reduces inquiries.      |
| Inconsistent stakeholder input led to confusion.               | Jira formalizes input processes, minimizing confusion.        |
| Tracing back information origin was challenging.               | Jira serves as a record-keeping tool, aiding issue resolution. |
| Ambiguity about when to publish content caused delays.         | Jira formalizes the sign-off process, providing clarity.       |


In conclusion, adopting Jira as a work tracker has significantly enhanced our collaborative processes, bringing transparency, efficiency, and clarity to our documentation workflow. This structured approach has proven to be a valuable asset in our efforts to deliver timely and accurate technical content.