# High level workflow description

Following is the high level workflow for the gene curation process. The workflow is divided into 3 stages:

```mermaid
graph TD
    A[Gene Stage] -->|geneDetailsConfig.js| B[Precuration Stage]
    B -->|precurationDetailsConfig.js| C[Curation Stage]
    C -->|curationDetailsConfig.js| D{Curation Decisions}
    D -->|Disease Association, Inheritance Pattern| E[Gene-Disease-MOI Association]
    D -->|Categories| F[Clinical Group, Onset Group, Syndromic]
    E -->|ClinGen based Point System| G[Curation Stage Completion]
    F --> G
    G --> H[Final Entity Verdict]
    H --> I[Definitive, Strong, Moderate, Limited, Refuted]
```
