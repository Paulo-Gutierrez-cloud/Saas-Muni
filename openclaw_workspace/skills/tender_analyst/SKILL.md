---
name: tender_analyst
description: "Advanced Tender Analyst for Licitaciones TI. Capabilities: Match company profile against tender requirements, calculate win probability, and draft technical proposals."
metadata:
  openclaw:
    emoji: "🧠"
    requires:
      bins: ["python3"]
---

# Tender Analyst Skill

## Overview

Use this skill to analyze tenders (Licitaciones) stored in the database.

## Tools

### 1. Analyze Specific Tender

Analyze a tender by its code. Returns tech stack, required docs, and win probability.

```bash
python3 skills/tender_analyst/analyst.py analyze --code <tender_code>
```

### 2. Get Strategic Advice

Generate a proposal strategy for a tender.

```bash
python3 skills/tender_analyst/analyst.py strategy --code <tender_code>
```

### 3. List Top Opportunities

List top 5 tenders matching the company profile.

```bash
python3 skills/tender_analyst/analyst.py opportunities --limit 5
```
