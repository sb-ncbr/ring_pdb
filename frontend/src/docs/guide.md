# RingWeb Application User Guide

Welcome to the user guide for **RingWeb**, a web-based platform for exploring ring conformations in biomolecular structures.
This guide will walk you through the main features of the application and help you get started efficiently.

---

## Main Page

### Overview

The Main Page serves as the starting point of the application. From here, you can choose among four primary modes of exploration. Each option will lead you to the Table Page, where you can browse ring data and access visualizations. Your choice here does not limit your ability to explore the full dataset later.
The available options are:

1. **Search by PDB ID**:

    Enter one or more Protein Data Bank (PDB) structure IDs to search for rings within those structures. Multiple IDs can be separated by commas, semicolons, or spaces. Both lowercase and uppercase formats are accepted.
2. **Search by CCD ID (Ligand ID)**:  

    Enter one or more Chemical Component Dictionary (CCD) IDs to find rings in specific ligands. Use the same format and separators as for PDB IDs.
3. **Browse available rings and conformations**:  

    Use a two-step interface to explore available ring types and their conformations. You can preview conformations visually before browsing detailed data for selected combinations.
4. **Browse the whole dataset**: 

     Jump directly to the **Table Page**, where the full dataset is displayed and where you can apply advanced filters and access individual ring visualizations.

You can also access example ring visualizations directly from the Main Page.

---

## Table Page

### Overview

The **Table Page** presents ring data in a structured, interactive format. Key features include:

- Advanced filtering options  
- Column sorting  
- CSV data export  
- Navigation to detailed visualization pages  

### Usage Instructions

- Begin by selecting a **ring type** and/or **conformation** to filter the dataset. This can also be done through the interactive stepper on the Main Page.
  
- In the **top-right toolbar**, you can:
  - Enable **Advanced Filters** to access two additional filtering levels
  - Switch to **Compact View** to hide columns like Experimental Method, RSR, and RSCC
  - Download the currently selected data in **CSV** format

- The **bottom toolbar** shows the total number of matching entries and allows you to adjust the number of rows displayed per page.

- When **Advanced Filters** are enabled, you can further narrow your results by:
  - **PDB ID** or **CCD ID**: These fields support autocomplete after entering at least two characters
  - **Experimental Method**
> **Note:** In the Table Page filters, **PDB and CCD fields support only one entry at a time via autocomplete**.  
> To search using **multiple PDB or CCD IDs simultaneously**, please use the **direct input field on the Main Page**, where you can enter several IDs separated by commas, semicolons, or spaces. Both uppercase and lowercase formats are accepted.

> **Note:** Changing filters at higher levels (e.g., Ring Type or Conformation) will reset filters set at lower levels.
- The **third filter level** allows you to define **minimum and maximum** values for numerical fields using sliders.
- Use the reset button near the sliders to clear all numerical filter settings at once.
- **Click on a table row** to navigate to the **Visualization Page** for the selected ring.  
-  **Click on the image** in the "Details" column to preview the 2D structure of the ligand.

---

## Visualization Page

### Overview

The **Visualization Page** provides in-depth structural insights for a selected ring.

### Features

- Access the page via **Table Page** or via **example cards** on the Main Page
- Interact with the ring structure using the Mol* 3D viewer.
- Toggle **electron density maps** to evaluate model fit.
- Download the 3D structure in CIF format.
