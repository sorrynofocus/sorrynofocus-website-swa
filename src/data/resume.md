---
# Your resume. It's rendered at the bottom of the About page (/about/#resume).
# Edit the Markdown below, save, and the page updates. See "Resume" in docs/administrator.md.
#
# Optional PDF download: put a file named resume.pdf in the public/ folder
# and a "Download PDF" button appears automatically. Delete it and the button goes away.
#
# Converted from src/data/Chris-Winters-CV-Aug-2026.pdf. Review the contact line below for PII.
updated: 2026-08-01
---

## Summary

**Developer Productivity Engineer | Automation, CI/CD & Platform Tooling**

Software engineer with 10+ years of experience building internal developer tools, Python automation, CI/CD workflows,
and engineering productivity solutions. I really enjoy developing CLI utilities, reusable software components,
API-driven automation, and workflow tooling that reduce manual effort and improve engineering reliability. Currently
developing agentic AI and RAG systems using LangChain, Hugging Face embeddings, Azure OpenAI, local LLMs, vector
search, Pydantic, and tool-calling workflows.

## Experience

### Release Manager / Deployment Systems Engineer, Thryv Corp
**Nov 2024 – May 2026** · Phoenix, AZ

- Reduced deployment execution time by 62.5%, from approximately 2 hrs to 45 min, by developing a Python CLI tool
  (jiraop) that automated bulk Jira ticket transitions, validation checks, and deployment state verification across
  approximately 100 tickets.
- Eliminated manual copy/paste workflows and inconsistent deployment tracking by developing a deployment extraction
  process that gathered release artifacts, GitHub tags, and deployment metadata, then produced structured CSV/JSON
  outputs for downstream automation and reporting.
- Removed manual deployment orchestration overhead by building autoDeployHelper, a Python-based tool that determined
  stage versus production artifact placement and generated clean deployment input files, reducing human error and
  streamlining multi-stage release workflows.
- Improved deployment documentation efficiency by approximately 45% by automating Confluence page generation and
  updates using templates, Jira queries, key deployment dates, transaction logs, and release metadata through a
  Python-based updater integrated with GitHub Actions.
- Designed human-in-the-loop controls into automated deployment workflows, preserving explicit verification points
  for stage and production release decisions.

**Tech:** Python, Jira API, Confluence REST API, Beautiful Soup, GitHub Actions, CLI tooling, JSON/CSV, HTML parsing

### Software Development Engineer / Release Engineer, Symantec / Broadcom
**2007 – Feb 2024** · Los Angeles, CA

- Developed a reusable Python-based Perforce SDK wrapper (CM-SDK) that standardized and simplified source-control
  automation operations across engineering teams. This system has been used for over a decade.
- Designed and implemented CI/CD automation systems integrating build, test, deployment, infrastructure, and
  operational tooling across enterprise engineering environments.
- Reduced Jenkins maintenance effort from days to approximately 1 hr through automation of credential management, VM
  updates, system configuration, and infrastructure support workflows across approximately 20 servers.
- Built signpubs, a C++ utility that automated Live Update Publishing and signing workflows, including a SQLite-based
  tracking of publication state and metadata, reducing manual release overhead and remaining in active use across
  teams for over a decade.
- Helped standardize fragmented build systems by contributing to centralized build orchestration infrastructure
  supporting 15+ teams and 100+ developers.
- Enabled cross-platform build and deployment workflows across Windows, Linux, Solaris, AIX, and AS-400 systems.
- Supported and administered enterprise DevOps toolchains including Jenkins, Artifactory, Coverity, Perforce, and
  GitHub to enable secure, repeatable software delivery.
- Developed Python and Groovy tooling to automate Jenkins configuration and CI workflows, including credential
  management across servers, programmatic job configuration (config.xml), and DSL-based job and pipeline builds.
- Configured and maintained heavily utilized VMware vSphere/ESXi environments supporting dynamically provisioned
  build infrastructures across Windows Server, Fedora, Ubuntu, and Intel Mac systems; provisioned VMs, managed
  snapshots, storage and virtual network adapters, patching, and system health.

**Tech:** Python, C++, Jenkins Pipeline/DSL, Groovy, Docker, Shell scripting, Linux, Windows, VMware, GCP

### Software Engineer, pcAnywhere Team, Symantec / Broadcom
**2001 – 2006** · Newport News, VA

- Debugged complex C/C++ application issues across customer environments and developed installer, MSI, and Win32
  tooling to improve product supportability.
- Transitioned into configuration management and release engineering, contributing to centralized build
  infrastructure across Windows and Linux systems.

**Tech:** C/C++, Win32 API, InstallShield, MSI APIs, PHP, MySQL, Linux, Windows

## Selected Accomplishments

- Improved CI/CD maintainability and consistency by standardizing Jenkins pipeline-as-code using reusable Jenkins DSL
  automation patterns.
- Developed checkpoint/resume automation for Microsoft DTM signing workflows, preventing CI/CD pipeline blocking
  during long-running external signing processes.
- Built Mapotamus, a C# WinForms infrastructure utility for managing mapped drives, encrypted credentials, and
  Jenkins agent setup across dynamically provisioned build environments.
- Reduced infrastructure footprint by approximately 82%, from about 500 servers to 90, by supporting dynamic VM
  provisioning workflows using VMware, Nutanix, and GCP infrastructure templates.

## Technical Skills

| Area               | Tools & technologies                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| Languages          | Python, C#, C++, Bash, Groovy (working knowledge)                                                      |
| Applied AI         | RAG, vector search, Azure OpenAI, llama.cpp; prompt engineering, LangChain and Hugging Face embeddings (working knowledge); Pydantic (beginner) |
| Automation & CI/CD | Jenkins Pipeline/DSL, GitHub Actions, CircleCI, Docker, CLI tooling, deployment automation, release orchestration |
| APIs & Data        | REST APIs, Jira API, Confluence REST API, JSON, CSV, HTML/XML parsing                                  |
| Tools & Cloud      | GitHub, Jira, Confluence, Perforce, HashiCorp Vault, Artifactory, Coverity (some admin), Visual Studio, VS Code, Azure (Cognitive Services, Foundry, IAM/Entra, Storage, Bicep (working knowledge)), GCP (working knowledge) |

## Projects

### Qylo: Python Agentic RAG CLI Assistant
**Active development** · Python

Designed the response and decision-routing mechanism for a local agentic RAG assistant, enabling the model to
determine whether to answer from retrieved documentation, refine retrieval, or compose a CLI command based on the
user's request. Implemented the system in Python using LangChain agent/tool calling, Hugging Face embeddings, an
in-memory vector store, structured Pydantic responses, Azure OpenAI or local llama.cpp models, and gated command
execution with explicit safety controls.

**Tech:** Python, Agentic AI, LangChain tool-calling, RAG, Hugging Face embeddings, vector search, Azure OpenAI,
Microsoft Foundry, llama.cpp, Pydantic structured responses, CLI tooling

### STT / Azure Voice AI Assistant
**Project** · C#/.NET

Built a C#/.NET voice-operated assistant with a RAG pipeline over structured JSON documentation using Azure AI
Search, top-K lexical retrieval, relevance-score filtering, and Azure OpenAI for grounded responses.

**Tech:** C#, .NET, Azure AI Search, Azure OpenAI, Azure Speech Services, RAG, BM25-style lexical retrieval, top-K
retrieval, relevance-score filtering, structured JSON, REST APIs

### VisionOCR: Azure AI Vision OCR Utility
**Project** · C#/.NET

Built a C#/.NET OCR application using Azure AI Vision to extract structured text from images (single/batch),
traversing block/line/word results and evaluating word-level confidence scores to support OCR quality analysis and
troubleshooting.

**Tech:** C#, .NET, WPF, Azure AI Vision, OCR, Azure Cognitive Service, asynchronous APIs, confidence score analysis,
JSON

### Jotter: C#/.NET WPF Note-Management Application
**Active development** · C#/.NET

Built a local-first desktop note application with XML based storage, multi-window note editing, theme and image
import, and configurable settings.

**Tech:** C#, .NET, WPF, XML, Visual Studio, GitHub

## Certifications

- Microsoft Certified: Azure AI Fundamentals (AI-900)
- Linux Foundation: Developing Secure Software
