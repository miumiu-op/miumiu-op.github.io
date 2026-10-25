---
title: "Data-Driven Docs Engineering: Continuous Improvement from Mintlify AI Q&A and Feedback Loops"
date: 2026-02-15T10:00:00+08:00
draft: false
author: "Miaomiao"
summary: "Using docs-site Q&A bot telemetry, I built a continuous loop of export logs → AI-assisted cleaning and clustering → targeted fixes → impact checks, which improved self-serve rates and developer experience."
tags:
  - Data-driven
  - Developer experience
  - AI-enabled
  - Docs optimization
toc: true
socialShare: false
---

As a technical writer, I kept hitting the same problem: the team rarely had a clear, real-time view of where users actually got stuck. A “write and publish” model often left docs out of sync with what users needed — we were writing what we thought people needed, not what they were trying to read.

To fix that, I led a continuous improvement loop based on AI Q&A and user feedback data. Quantified signals fed back into content structure, which lowered troubleshooting cost for users and support load for the business.

---

## Method: a data → fix → verify loop

The iteration chain centered on three moves:

1. Collect and clean real questions:  
   I exported raw conversation logs across sites from the Q&A bot built into Mintlify, the docs stack we used at the time. Facing a large, fragmented set of questions, we used an AI-assisted workflow to clean, cluster, and consolidate keywords, strip noise, and lock onto real pain points quickly.

  | Product area | Mentions | Share | Demand type |
  | :--- | :--- | :--- | :--- |
  | **MPC wallets** | 211 | 25% | Usage scenarios |
  | **Risk controls** | 115 | 14% | UI actions |
  | **Custodial wallets** | 109 | 13% | Usage scenarios |
  | **Developer console** | 90 | 11% | UI actions |
  | **Address screening & KYT** | 85 | 10% | Feature scenarios |

  *Source: clustered sample from one Q&A log export*

2. Attribute across dimensions:  
   After cleaning, I broke high-frequency questions down further: missing content, weak AI retrieval, or a product/API design issue. That kept us from changing the wrong thing.
3. Fix with intent and check the effect:  
   For each pain point, we shipped a targeted fix such as new explainer docs, clearer UI copy, or a fuller API error-code table, then reviewed the next cycle for higher AI answer success and fewer unanswered questions.

---

## What we changed in practice

Regular review of several months of AI Q&A logs led to concrete changes:

### 1. Rebuild content around top pain points
- Fill the highest-friction gaps: For the top issue around transaction and payment processing states, we added a status definition table in the docs and a visible entry point for a self-serve delay troubleshooting guide.
- Lower understanding cost with better models: For confusing fees and frequent errors, we stopped scattering explanations and instead added a clear funds-flow diagram and an error-to-fix mapping table.

### 2. Make the docs more AI-readable
In the AI era, technical docs also have to be findable and understandable to machines:

- Structure and wording: Unify technical terms and field names so synonym drift does not break retrieval, and complete page metadata in front matter.
- Headings and TOC for RAG: Refine titles, section headings, and the table of contents so hierarchy and logic stay clear, which improves recall and semantic accuracy for the AI assistant.

---

## Results and business value

- Measurable lift: After a two-week push and ongoing reviews, overall AI Q&A success stayed high (about 90%–95%+), and unanswered questions dropped sharply.
- Lower cost, higher leverage: Turning top friction into structured FAQs and troubleshooting guides reduced communication cost when customers integrated APIs or configured assets, and lightened the load on customer success and support.
- A lasting operating rhythm: We locked in a weekly or biweekly review of AI Q&A logs followed by docs updates, so the documentation set can keep improving as a living business asset.
