# Order Management System - SAP CAP + Fiori Elements

A simple order management system built with **SAP Cloud Application Programming Model (CAP)** and **SAP Fiori Elements**.

---

## Data Model

The service exposes four core entities:

| Entity       | Description                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `Products`   | Catalog of available products                                                                             |
| `Users`      | Customer records                                                                                          |
| `Orders`     | Order headers linked to a customer                                                                        |
| `OrderItems` | Line items composed as a CAP **aspect** within Orders, enabling straightforward CRUD via the parent order |

Using an aspect for `OrderItems` keeps the data model clean and lets the CAP runtime handle deep inserts and updates automatically.

---

## Frontend - Fiori Elements Apps

Three Fiori Elements applications, each following a **List Report → Object Page** pattern:

- **Customers App** - browse and manage user/customer records
- **Products App** - browse and manage the product catalog
- **Orders App** - manage orders end-to-end

### Custom Filter Panel (Orders)

The Orders list page includes a custom **UI5 Panel** for advanced filtering, built on top of the standard Fiori Elements toolbar. It supports filtering by:

- Customer name
- Date range
- Order status
- Amount spent

---

## Testing

Unit tests are written with **Jest**. They cover service-level logic and entity behavior.

```bash
npm run test
```

---

## Known Limitations

### KPI Charts - Not Working

An attempt was made to add KPI chart annotations (e.g. total revenue, product breakdowns) to the Fiori Elements pages. This was unsuccessful due to issues with how the CAP OData service exposes aggregated data to the Fiori side, specifically around analytical annotations and the `sap.aggregation` capabilities expected by the `Chart` building block.

This remains a work in progress.

---

## Tech Stack

- SAP CAP (Node.js)
- SAP Fiori Elements (OData V4)
- SAPUI5
- Jest
