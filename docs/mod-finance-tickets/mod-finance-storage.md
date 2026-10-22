# Mod-Finance-Storage

## **Ticket:** [MODFISTO-506](https://folio-org.atlassian.net/browse/MODFISTO-506)

### Implement endpoint to return financial data for FY

New DB view created that makes joins between tables for ledgers, groups, funds, budgets, and budget expense classes. Chose to go with a Java based approach, as suggested in the Jira ticket.

- **Dates:**
  - Started: July 20th, 2026
  - PR opened: July 31st, 2026
  - Merged: August 13th, 2026
- **PR:**
  - Link: [#572](https://github.com/folio-org/mod-finance-storage/pull/572)
  - Status: Merged
- **People:**
  - Developer: Sydney Renninger (Bama)
  - Reviewer: Serhii Nosko (Thunderjet)
- **PR issues:**
  - Originally failed Quality Gate due to testing suite being unregistered.
  - No comments made by reviewer
- **Notes:**
  - Final Coverage: 95.2% Coverage on New Code
  - Acq-models submodules was updated with new schema for FiscalYearHierarchy.

## **Ticket:** [MODFISTO-507](https://folio-org.atlassian.net/browse/MODFISTO-507)

### Add ability to filter DB View results by set of field

Modify existing DB view from MODFISTO-506 to filter by ledger, group, fund, budget, and expense class.

- **Dates:**
  - Started: August 14th, 2026
  - PR opened: August 14th, 2026
  - Merged: August 20th, 2026
- **PR:**
  - Link: [#576](https://github.com/folio-org/mod-finance-storage/pull/576)
  - Status: Merged
- **People:**
  - Developer: Sydney Renninger (Bama)
  - Reviewer: Serhii Nosko (Thunderjet)
- **PR issues:**
  - Reviewer noted two changes:
  - Duplicate fiscalYearId param in the view.
  - Accidentally bumped version to 1.1, when needed to be 1.0
- **Notes:**
  - Final Coverage: 100% Coverage on New Code

## **Ticket:** [MODFISTO-567](https://folio-org.atlassian.net/browse/MODFISTO-567)

### Implement endpoint to enable Browse tab in Settings

- **Dates:**
  - Started: September 4th, 2026
  - PR opened: September 8th, 2026
  - Merged: September 10th, 2026
  - Total time:
- **PR:**
  - Link: [#578](https://github.com/folio-org/mod-finance-storage/pull/578)
  - Status: Merged
- **People:**
  - Developer: Sydney Renninger (Bama)
  - Reviewer: Serhii Nosko (Thunderjet)
- **PR issues:**
  - Reviewer made no comments
- **Notes:**
  - Final Coverage: 100% Coverage on New Code
  - Originally did not have a ticket for this backend component, was necessary for UIF-544 to be reviewed.
