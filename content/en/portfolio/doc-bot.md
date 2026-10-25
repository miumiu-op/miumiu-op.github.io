---
title: "Closing the Docs Feedback Loop with n8n and a Slack Bot"
date: 2026-02-01T10:00:00+08:00
draft: false
author: "Miaomiao"
summary: "To fix scattered docs feedback and broken follow-through, I researched the workflow and built a Slack docs feedback bot on n8n that captures requests automatically, routes them in a structured way, and tracks them through the full lifecycle."
tags:
  - Workflow automation
  - Docs engineering
  - Cross-team collaboration
toc: true
socialShare: false
---

In day-to-day technical docs maintenance, one lasting pain point is how feedback moves and how its lifecycle is managed.

In practice, both sides felt the friction:

- External stakeholders (support, solutions, engineering, and others): Often did not know which writer to ping. After raising a request, they had to chase progress across many chat threads.
- The technical writing team: Feedback lived in countless Slack threads, lost context over time, and often broke the loop because writers forgot to notify the requester after the docs shipped.

To break that funnel, I introduced an automation chain and turned fragmented chat into a standard request flow with a closed loop.

---

## Path to production: research, automation, then SOP

I moved in three stages: prove feasibility, build the workflow, then roll out standards inside and outside the writing team.

### 1. Research and feasibility

Before building, I mapped the internal pain points and checked technical feasibility. Looking at industry practice and bot patterns already used by other teams inside the company, I confirmed we could build an automated request inbox with Slack event listeners and a workflow engine.

### 2. Build the automation and closed loop on n8n

I used n8n as the workflow engine and designed this core flow:

- Capture and acknowledge automatically: When a stakeholder `@`s the docs bot in any channel with docs feedback, the workflow replies in the original thread right away (for example, “✅ Received — the content team is on it”), then forwards a clean package to the TW inbox channel `#tw-feedback-inbox`, including the speaker, original message link, and other metadata.
- Lightweight status coordination:
  - When a writer claims a request, they add 👀 on the forwarded message so others know someone owns it and duplicate work is avoided.
  - If the request needs no docs change, they mark ❌ and archive it.
- Clean cross-channel closeout: After the docs update ships, the writer does not have to hunt down the original channel. They reply `@doc-bot okk` in the inbox thread, and the bot returns to the original stakeholder thread with a notice such as “This docs update has been published.”

![Stakeholder view: submit a request with @doc-bot and receive the publish notice](/images/portfolio/stakeholders.png)

![Writer view: manage and move status in #tw-feedback-inbox](/images/portfolio/writer.png)

### 3. Roll out the internal and external SOP

After the tool worked, adoption mattered:

- Internal alignment: Walk all technical writers through the flow and lock claim and status-marking rules.
- External alignment: Roll the new mechanism out to stakeholders and ask them to submit docs requests through `@doc-bot` and check progress there, instead of scattering asks in private chats.

---

## Value and next steps

- Kill the communication funnel: Cross-team docs feedback became fully traceable and structured. Chat history no longer disappeared into unsearchable threads.
- Low maintenance friction: The loop stayed light and usable without adding a heavy system such as Jira.

> What’s next: The same automation frame can grow further, for example with automatic request tagging (API docs vs guides) and monthly or quarterly feedback reports, so docs quality keeps improving from real data.
