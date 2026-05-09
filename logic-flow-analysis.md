# Bill Tracker: Logic and Functional Flow Analysis

This document explains the logic, purpose, and contribution of each function and component in the Bill Tracker application. It focuses on understanding how the code works and how components interact.

---

## Table of Contents

1. [Application Architecture Overview](#application-architecture-overview)
2. [Bill Class Hierarchy - The Data Model](#bill-class-hierarchy---the-data-model)
3. [CategoryGroup - Organizing Bills](#categorygroup---organizing-bills)
4. [BillManager - Business Logic Controller](#billmanager---business-logic-controller)
5. [TrackerUI - User Interface Controller](#trackerui---user-interface-controller)
6. [Data Flow and Interactions](#data-flow-and-interactions)
7. [Validation and Error Handling](#validation-and-error-handling)

---

## Application Architecture Overview

The Bill Tracker is built using a **three-layer architecture**:

1. **Data Layer** (Bill hierarchy): Represents different types of bills with their properties and polymorphic calculations
2. **Business Logic Layer** (BillManager, CategoryGroup): Manages bill data, validates budgets, and coordinates operations
3. **Presentation Layer** (TrackerUI): Displays data to users and handles interactions

This separation allows each layer to have clear responsibilities and makes the code maintainable.

---

## Bill Class Hierarchy - The Data Model

### Abstract `Bill` Class - Foundation

**Purpose**: Serves as the abstract base class for all bill types. It establishes a contract that all bills must follow.

**Key Responsibilities**:
- Store common bill properties (id, name, amount)
- Validate name (not empty) and amount (not negative) at construction time
- Provide static ID generation via `Bill.generateId()`
- Define abstract methods that subclasses must implement:
  - `monthlyImpact()`: How much this bill costs per month
  - `priority()`: Importance ranking (used for sorting)
  - `getBillTypeLabel()`: Human-readable type name

**How it works**:
```
Bill (abstract)
├── Validates name (not empty) and amount (not negative) in constructor
├── Provides getters for id, name, amount
├── Provides static Bill.generateId() for ID generation
└── Defines abstract methods for subclasses
```

**Note**: Validation happens in the constructor, ensuring no invalid bill can ever be created. There is no `update()` method — bills are immutable once created. To "update" a bill, the user deletes the old one and adds a new one.

---

### Static Factory: `Bill.generateId()`

**Purpose**: Generate unique IDs for bills using `crypto.randomUUID()`.

**Logic**:
```
Bill.generateId("bill") → "bill-<uuid>"
```

**Why in the domain layer?** ID generation is a domain concern, not a UI concern. Keeping it as a static method on `Bill` ensures it's owned by the domain model, not scattered across UI event handlers.

---

### Subscription Classes - Recurring Monthly/Yearly Costs

**Abstract `Subscription` class**:
- Extends Bill to add billing cycle (monthly or annual)
- Key logic: `monthlyImpact()` divides annual subscriptions by 12 to show monthly cost

**Why this matters**: Entertainment and productivity subscriptions might charge annually but need to be shown as monthly expenses for budget planning.

**Concrete subclasses**:
- `EntertainmentSubscription`: Priority 2, for entertainment services
- `ProductivitySubscription`: Priority 3, for productivity tools

**Example flow**:
```
User creates ProductivitySubscription for $120/year
→ monthlyImpact() returns 120/12 = $10/month
→ Budget calculations use $10 for monthly planning
```

**Note**: All subscriptions are created with "monthly" billing cycle by the factory. Cycle switching is not yet implemented — if a user wants to change a subscription from monthly to annual, they delete the old bill and add a new one.

---

### Utility Classes - Essential and Non-Essential Utilities

**Abstract `Utility` class**:
- Extends Bill to add estimated cost tracking
- Key logic: If `isEstimated` is true, adds 10% buffer to amount as protection
- `monthlyImpact()`: Returns amount with 10% buffer if estimated

**Why this matters**: Utility bills often come with estimates. The 10% buffer ensures users don't run out of money if the actual bill is higher.

**Concrete subclasses**:
- `EssentialUtility`: Priority 5 (highest), for electricity, water, etc.
- `NonEssentialUtility`: Priority 1 (lowest), for internet, phone, etc.

**Example flow**:
```
User adds estimated electricity bill of $100
→ isEstimated = true
→ monthlyImpact() returns 100 * 1.1 = $110 (with buffer)
→ Budget shows $110 but actual may be $100
```

---

### Debt Classes - Money Owed

**Abstract `Debt` class**:
- Extends Bill to add interest rate calculation
- Key logic: `monthlyImpact()` returns principal plus interest
- Exposes `_interestRate` via read-only getter (updates not yet implemented)

**Concrete subclasses**:
- `OneTimeDebt`: Priority 4, one-time payment (doesn't include interest in monthly impact)
- `RecurringDebt`: Priority 5 (highest), recurring payment with interest

**Why subclasses differ**:
- OneTimeDebt overrides `monthlyImpact()` to return just the principal (not interest) since it's a one-time payment
- RecurringDebt uses inherited `monthlyImpact()` which includes interest calculation

**Example flow**:
```
User adds $1000 one-time debt with 5% interest
→ monthlyImpact() = $1000 (just the principal)
→ Interest is tracked in the data but not factored into monthly impact

vs.

User adds $500 recurring debt with 10% interest
→ monthlyImpact() = $550 (includes interest)
→ Monthly payment expected to include interest
```

**Note**: `calculateTotalWithInterest()` and `updateInterestRate()` were removed — the interest calculation is already encapsulated in `monthlyImpact()`, and no edit workflow exists to update interest rates.

---

## CategoryGroup - Organizing Bills

**Purpose**: Organizes bills into logical categories (Subscriptions, Utilities, Debts) and provides group-level operations.

**Key Methods and Their Logic**:

1. **`get totalMonthlyImpact`**: Calculates total cost for the group
   - Uses reduce to sum all bills' monthlyImpact() values
   - Exposed as a getter, not a method — calling code reads `group.totalMonthlyImpact` instead of `group.getTotalMonthlyImpact()`
   - Purpose: Show total spending in each category
   - Example: All subscriptions together = $50/month

**Note**: Duplicate detection was previously implemented here but has been consolidated into `BillManager.findDuplicate()` for a single source of truth. The `items` array is managed by `BillManager` (`addToGroup` and `removeFromGroup` methods), keeping `CategoryGroup` focused on calculation operations.

**Example: How CategoryGroup Handles a Day's Work**:
```
Start of day: CategoryGroup("Subscriptions") created with empty items

User adds Netflix ($15/month)
→ BillManager.addToGroup("Subscriptions", netflix)
→ items = [Netflix]

User adds Spotify ($10/month)
→ BillManager.addToGroup("Subscriptions", spotify)
→ items = [Netflix, Spotify]

User checks total spending for subscriptions
→ get totalMonthlyImpact = 15 + 10 = $25
→ UI compares $25 against subscription budget ($30)
→ Budget display shows normal color (under budget) ✓
```

---

## BillManager - Business Logic Controller

**Purpose**: The central orchestrator for all bill operations. It manages all category groups and handles business logic.

**Responsibilities**:
1. Create bills (factory pattern)
2. Add/remove bills from groups
3. Track budgets via `BudgetPlan` interface
4. Find duplicates across all groups
5. Calculate totals
6. Validate budget allocations

**Key Data Structures**:
```typescript
_groups: CategoryGroup[]      // All bill categories
_budgetPlan: BudgetPlan       // Typed budget state (total, subscriptions, utilities, debts)
```

**BudgetPlan interface**:
```typescript
interface BudgetPlan {
  total: number;        // Total monthly budget
  subscriptions: number; // Subscriptions category budget
  utilities: number;      // Utilities category budget
  debts: number;         // Debts category budget
}
```

**Core Methods and Their Logic**:

### 1. **`createBill(billType, id, name, amount, interestRate)`** - Factory Method

**Purpose**: Creates the appropriate bill type based on the billType string.

**Logic**:
```
Switch on billType:
- "ProductivitySubscription" → new ProductivitySubscription(..., "monthly")
- "EntertainmentSubscription" → new EntertainmentSubscription(..., "monthly")
- "EssentialUtility" → new EssentialUtility(...)
- "NonEssentialUtility" → new NonEssentialUtility(...)
- "OneTimeDebt" → new OneTimeDebt(...)
- "RecurringDebt" → new RecurringDebt(...)
- default: throw error
```

**Why use factory pattern?**
- Centralizes bill creation logic
- Prevents duplicate creation code
- Easy to add new bill types (just add a case)
- Caller doesn't need to know about specific classes

**Note**: The `billingCycle` parameter was removed from the factory signature — all subscriptions are created with "monthly" cycle by default.

**Example**:
```
UI says: "Create ProductivitySubscription, $100/month"
→ createBill("ProductivitySubscription", "bill-123", "Adobe", 100, 0)
→ Returns new ProductivitySubscription instance ready to use
```

### 2. **`addToGroup(label, bill)` and `removeFromGroup(label, billId)`** - Group Management

**Purpose**: Adds or removes bills from specific category groups.

**Logic**:
```
addToGroup:
- Find group with matching label
- If found, push bill to its items

removeFromGroup:
- Find group with matching label
- If found, filter out the bill with matching ID
```

**Used by**: TrackerUI when user adds/removes bills

---

### 3. **`get total`** - Calculate All Expenses

**Purpose**: Sum up all bills across all groups to show total monthly spending.

**Logic**:
```
return sum of all groups' totalMonthlyImpact
     = Subscriptions total + Utilities total + Debts total
```

**Used for**: Displaying total expenses, comparing against total budget

**Example**:
```
Subscriptions: $25
Utilities: $150
Debts: $200
→ total = $375/month
```

---

### 4. **`findDuplicate(name)`** - Cross-Group Search

**Purpose**: Check if a bill name exists anywhere across all groups.

**Logic**:
```
1. Normalize the search name (lowercase, trim)
2. flatMap all groups' items into one big array
3. Find the bill with matching normalized name
4. Return it or null
```

**Why flatMap?** It converts:
```
[Group1[bill1, bill2], Group2[bill3], Group3[bill4, bill5]]
→ [bill1, bill2, bill3, bill4, bill5]
```

Then search is simple on the flat array.

**Used by**: Form submission to warn users about duplicates

---

### 5. **Budget Management Methods**

**`getCategoryBudget(category)` and `setBudgets(...)`**:
- Retrieves budget via typed interface (using switch statement over `BudgetPlan` keys)
- Stores budgets in typed `BudgetPlan` structure
- Used for visual indicators (red if over, green if under)

### 6. **`validateBudgetAllocation(total, subs, utils, debts)`** - Budget Validation

**Purpose**: Verify that category budgets do not exceed the total budget.

**Logic**:
```
return subs + utils + debts <= total
```

**Why this matters?**
```
If user sets $100 total but subscriptions+utilities+debts = $150, it's impossible.
We catch this before saving budgets.
```

This method encapsulates the budget constraint rule that was previously in the UI layer. Moving it to `BillManager` ensures the business rule is owned by the domain/service layer, not scattered in event handlers.

---

## TrackerUI - User Interface Controller

**Purpose**: Manages all user interactions and DOM rendering. Connects user actions to BillManager.

**Key Responsibilities**:
1. Render the UI (groups, history, budgets)
2. Handle user input (form submissions, button clicks)
3. Show/hide conditional fields based on bill type
4. Display duplicate alerts and manage pending bill state
5. Maintain history of added bills
6. Update budget displays

**Architecture**:
```
DOM Events → Event Handlers → Manager Methods → UI Updates
```

---

### Pending Bill State

The duplicate workflow requires temporary state to hold a bill while the user makes a decision. This state lives in `TrackerUI` (not `BillManager`) because it is dialog state:

```typescript
private _pendingBill: Bill | null = null;    // Bill waiting for user decision
private _pendingCategory: string = "";       // Target category for the pending bill
```

**Exposed via public getters/setters**:
- `get pendingBill()` / `set pendingBill()`: Access and mutate the pending bill
- `get pendingCategory()` / `set pendingCategory()`: Access and mutate the target category
- `clearPendingBill()`: Resets both to empty state (made public since it is called from event listeners registered on document elements)

---

### Event Handlers and Their Logic

#### 1. **`onFormSubmit`** - Handle Bill Addition

**Purpose**: When user clicks "Add Bill", process the form and create the bill.

**Logic Flow**:
```
1. Prevent default form submission
2. Extract form data:
   - name, category, billType, amount, interestRate
3. Validate all required fields
4. Create the bill using manager.createBill()
   - ID generated via Bill.generateId()
5. Check for duplicates using manager.findDuplicate():
   IF duplicate found:
      - Store as pending in UI
      - Show duplicate alert
      - RETURN (wait for user decision)
   ELSE:
      - Add to group
      - Add to history (keep last 10)
      - Reset form
      - Refresh UI
```

**Key logic**: The duplicate detection is non-blocking. We ask the user before proceeding.

**Example**:
```
User fills form:
- Category: "Subscriptions"
- Type: "ProductivitySubscription"
- Name: "Adobe Creative Cloud"
- Amount: 55
- Cycle: "monthly"

→ Manager creates ProductivitySubscription instance
→ Bill.generateId() provides unique ID
→ No duplicate found
→ Adds to Subscriptions group
→ Adds to history: "Adobe Creative Cloud - Subscription - ₱55.00"
→ Renders updated UI
```

---

#### 2. **`onCategoryChange`** - Dynamic Form Fields

**Purpose**: Show/hide form fields based on selected category.

**Logic in `syncTypeOptions(category)`**:
```
IF category is "Subscriptions":
   - SHOW billing cycle field (monthly/annual)
   - HIDE interest rate field
   - Fill type dropdown with subscription types

ELSE IF category is "Debts":
   - HIDE billing cycle field
   - SHOW interest rate field
   - Fill type dropdown with debt types

ELSE IF category is "Utilities":
   - HIDE both special fields
   - Fill type dropdown with utility types
```

**Why useful?**
- Prevents confusing UI (no billing cycle field for debts)
- Ensures correct data is collected
- Better user experience

**Example**:
```
User selects "Subscriptions" category
→ Form shows: type dropdown (Entertainment, Productivity)
              billing cycle toggle (Monthly/Annual)
              HIDES interest rate field

User changes to "Debts" category
→ Form updates to: type dropdown (One-time, Recurring)
                   interest rate input
                   HIDES billing cycle field
```

---

#### 3. **`onListClick`** - Handle Bill Deletion

**Purpose**: When user clicks "Delete" button on a bill, remove it.

**Logic**:
```
1. Check if target element is a delete button
2. Extract bill ID and group label from button attributes
3. Remove from group using manager.removeFromGroup()
4. Re-render UI to show changes
```

**Implementation detail**: Uses event delegation. Instead of attaching listeners to each delete button (which would be inefficient), we attach one listener to the entire list. When a click happens, we check if it's a delete button.

**Example**:
```
User clicks "Delete" on Netflix bill
→ Event handler extracts: billId="bill-123", group="Subscriptions"
→ Manager removes from Subscriptions group
→ UI automatically updates (Netflix disappears from list)
```

---

#### 4. **`onBudgetSubmit`** - Handle Budget Updates

**Purpose**: When user enters budget amounts, store and validate them.

**Logic**:
```
1. Extract: totalBudget, subscriptionBudget, utilityBudget, debtBudget
2. Validate using manager.validateBudgetAllocation():
   IF validation fails (sum > total):
      - Show error message
      - RETURN (don't save)
3. Save all budgets using manager.setBudgets()
4. Hide error message
5. Reset budget form (clear input fields)
6. Re-render UI with new budget information
```

**Why validation in the manager?**
The budget constraint rule (`subs + utils + debts <= total`) is a business rule, not a UI rule. By delegating to `BillManager.validateBudgetAllocation()`, the rule is centralized and testable.

**Form Reset**:
After successfully saving budgets, the form is cleared (same pattern as bill submission) to provide a clean state for entering new budget values.

**Example**:
```
User tries to set:
- Total: $500
- Subscriptions: $200
- Utilities: $200
- Debts: $150
→ Sum = 550 > 500
→ ERROR: "Category budgets exceed total"
→ User must adjust before saving

User corrects to:
- Total: $500
- Subscriptions: $200
- Utilities: $200
- Debts: $100
→ Sum = 500 ≤ 500 ✓
→ Budgets saved via manager.setBudgets()
→ Form fields cleared
→ UI updates to show new budget information
```

---

### UI Rendering Methods

#### 1. **`render()`** - Main Render Orchestrator

**Purpose**: Refresh the entire UI to show current state.

**Calls**:
```
updateTotals()   → Display total expenses and budgets
renderGroups()   → Display all bills in categories
renderHistory()  → Display recent bills added
```

**When called?**
- After adding/removing/updating a bill
- After changing budgets
- Any time the data changes

---

#### 2. **`renderGroups()`** - Display Bills by Category

**Purpose**: Show all bills organized by category with totals.

**Logic for each category**:
```
1. Find the group card in DOM
2. Get the group data from manager
3. Sort bills by priority (highest first)
4. For each bill:
   - Create list item with:
     * Bill name
     * Bill type label
     * Cycle indicator (if subscription)
     * Monthly cost
     * Delete button
   - Add to list
5. Update group total display
6. Check if over budget:
   IF group total > category budget:
      - Show total in RED
      - Bold font
   ELSE:
      - Normal color
      - Normal font
```

**Sorting by priority**:
```
Essential Utility:     5 (highest)
Recurring Debt:       5 (highest)
One-time Debt:        4
Productivity:         3
Entertainment:        2
Non-essential Utility: 1 (lowest)

Bills display in this order (highest to lowest importance)
```

**Example**:
```
Subscriptions group:
├─ Netflix (Entertainment) - ₱15.00 - DELETE
├─ Adobe (Productivity) - ₱55.00 - DELETE
└─ Canva (Productivity) - ₱15.00 - DELETE
Group Total: ₱85.00 (shows in red if over budget)
```

---

#### 3. **`renderHistory()`** - Display Recently Added Bills

**Purpose**: Show the last 10 bills added (in reverse chronological order).

**Logic**:
```
IF history is empty:
   - Show "No bills added yet"
ELSE:
   - For each history entry:
     * Display name
     * Display type and category
     * Display formatted amount
     * Show in reverse order (newest first)
```

**Why keep history?**
- Users can quickly see what they just added
- Reference point for undo/check operations
- Limited to 10 entries to prevent memory bloat

**Example**:
```
Recently Added:
├─ Netflix (Entertainment in Subscriptions) - ₱15.00
├─ Electric Bill (Essential in Utilities) - ₱120.00
└─ Car Loan (Recurring in Debts) - ₱500.00
```

---

#### 4. **`updateTotals()`** - Display Budget Information

**Purpose**: Show overall spending vs budget.

**Logic**:
```
1. Calculate totalExpenses using manager.getTotal()
2. Get totalBudget from manager (via BudgetPlan)
3. Calculate remaining = totalBudget - totalExpenses
4. Update displays:
   - Total expenses: "₱375.00"
   - Total budget: "₱500.00"
   - Remaining: "₱125.00"
5. Color remaining amount:
   IF remaining < 0:
      - RED color (over budget)
      - Bold font (warning)
   ELSE:
      - Normal color
```

**Example Dashboard**:
```
Total Expenses: ₱375.00
Budget: ₱500.00
Remaining: ₱125.00  (green, normal)

vs. (when over budget)

Total Expenses: ₱550.00
Budget: ₱500.00
Remaining: -₱50.00  (red, bold - OVER BUDGET!)
```

---

### Duplicate Handling System

The duplicate workflow is managed through a combination of UI state (pending bill) and dialog interactions:

**Pending Bill Flow**:
```
1. onFormSubmit detects duplicate
2. Stores bill + category in TrackerUI._pendingBill / _pendingCategory
3. Calls showDuplicateAlert() to display modal
4. User makes a choice via dialog buttons
5. Based on choice: add anyway, update existing, or cancel
6. clearPendingBill() resets UI state
```

**Dialog Buttons**:
```
Cancel: Clear pending bill, close modal, reset form
Add Anyway: Add the duplicate bill to the group, clear state, re-render
Update: Replace old bill with new bill data, clear state, re-render
```

**Note**: The previous design had pending bill state in `BillManager`. This was refactored — `BillManager` should manage business data, not temporary dialog state. The UI layer now owns the pending bill, which is more appropriate since it is tied to the modal lifecycle.

**User Scenarios**:
```
Scenario 1: Add duplicate by mistake
- Click "Cancel"
- Pending bill discarded
- User can edit form and resubmit

Scenario 2: Add same bill twice intentionally
- Click "Add Anyway"
- Now have: Netflix Monthly and Netflix Monthly again
- Both tracked separately

Scenario 3: Update existing bill
- Click "Update"
- Old Netflix data replaced with new
- Only one Netflix in system with updated data
```

---

## Data Flow and Interactions

### Complete User Journey: Add a Bill

```
┌─────────────────────────────────────────────────────────┐
│ 1. User opens app                                       │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 2. TrackerUI.constructor() runs:                        │
│    - Finds all DOM elements                             │
│    - Binds event listeners                              │
│    - Calls render() to show initial state               │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 3. render() runs:                                       │
│    - updateTotals() shows budget info                   │
│    - renderGroups() shows empty bill lists              │
│    - renderHistory() shows "No bills added yet"         │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 4. User selects category (e.g., "Subscriptions")        │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 5. onCategoryChange fires:                              │
│    - syncTypeOptions("Subscriptions") called            │
│    - Type field shows: Entertainment, Productivity      │
│    - Billing cycle field APPEARS                        │
│    - Interest rate field HIDDEN                         │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 6. User fills form:                                     │
│    - Name: "Netflix"                                    │
│    - Type: "EntertainmentSubscription"                  │
│    - Amount: 15                                         │
│    - Cycle: "monthly"                                   │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 7. User clicks "Add Bill"                               │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 8. onFormSubmit fires:                                  │
│    - Extracts form data                                 │
│    - Validates all fields                               │
│    - Generates ID: Bill.generateId()                    │
│    - Calls manager.createBill(...)                      │
│    - Creates EntertainmentSubscription instance         │
│    - Calls manager.findDuplicate("Netflix")             │
│    - Returns null (no duplicate)                        │
│    - Calls manager.addToGroup("Subscriptions", bill)    │
│    - Adds to history                                    │
│    - Resets form                                        │
│    - Calls render()                                     │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 9. render() runs again:                                 │
│    - updateTotals():                                    │
│      • getTotal() returns 15 (Netflix monthly)          │
│      • Shows: Expenses ₱15, Remaining ₱485              │
│    - renderGroups():                                    │
│      • Shows Netflix in Subscriptions list              │
│      • Sorted by priority                               │
│      • Group total shows ₱15                            │
│    - renderHistory():                                   │
│      • Shows "Netflix - Entertainment - ₱15.00"         │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ 10. UI displays to user:                                │
│     ✓ Netflix appears in Subscriptions group            │
│     ✓ Total expenses updated                            │
│     ✓ Recently added list shows Netflix                 │
└─────────────────────────────────────────────────────────┘
```

### Journey: Duplicate Detection

```
┌─────────────────────────────────────────────────────────┐
│ User adds "Netflix" again (accidentally)                │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ onFormSubmit fires:                                     │
│ - Generates ID via Bill.generateId()                    │
│ - Creates new EntertainmentSubscription("Netflix", 15)  │
│ - Calls manager.findDuplicate("Netflix")                │
│ - FINDS existing Netflix!                               │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ Duplicate handling (in TrackerUI):                      │
│ - Stores _duplicateBillId = existing Netflix's ID       │
│ - Calls setPendingBill(newBill, "Subscriptions")        │
│ - Calls showDuplicateAlert(existingBill, "Netflix")     │
│ - Modal appears to user                                 │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ User sees modal:                                        │
│ "A bill named 'Netflix' already exists                  │
│  (Entertainment - ₱15.00/month).                        │
│  Do you still want to add 'Netflix'?"                   │
│                                                         │
│ Options: [Cancel] [Update] [Add Anyway]                 │
└─────────────────────────────────────────────────────────┘
                 │
        ┌────────┴─────────┬──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼────────┐  ┌──────▼─────────┐
│ User clicks:   │  │ User clicks:  │  │ User clicks:   │
│ "Cancel"       │  │ "Update"      │  │ "Add Anyway"   │
└───────┬────────┘  └──────┬────────┘  └──────┬─────────┘
        │                  │                  │
        │         ┌────────▼────────┐         │
        │         │ updateBill():   │         │
        │         │ - Removes old   │         │
        │         │ - Adds new bill │         │
        │         │ - Same group    │         │
        │         │ - Renders UI    │         │
        │         └─────────────────┘         │
        │                                     │
        └────────────────┬────────────────────┘
                         │
        ┌────────────────▼────────────────────┐
        │ Both paths lead to:                 │
        │ 1. Clear pending bill (UI state)    │
        │ 2. Hide duplicate alert             │
        │ 3. Reset form                       │
        │ 4. Render() to update UI            │
        └────────────────┬────────────────────┘
                         │
        ┌────────────────▼────────────────────┐
        │ Result:                             │
        │ Cancel: Bill not added, form reset  │
        │ Update: Old bill replaced           │
        │ Add: Now 2 Netflix bills exist      │
        └─────────────────────────────────────┘
```

---

## Validation and Error Handling

### Input Validation

**Bill Creation Validation** (in constructor):
```
Bill validates on construction:
- name: must not be empty or whitespace (or trimmed to empty)
  → silently sets _name to trimmed value
- amount: must not be negative
  → silently accepts any non-negative number

Debt validates on construction:
- interestRate: no explicit validation (implicitly accepts any number)
```

**Form Submission Validation**:
```
Check:
1. name is not empty
2. category is not empty
3. billType is not empty
4. amount is a valid number (not NaN)

If any fail: silently return (don't add bill)
```

**Budget Validation**:
```
Check using manager.validateBudgetAllocation():
  sum of category budgets ≤ total budget

If exceeds:
- Show error message (#budget-error element)
- Don't save budgets
- User must correct and try again
```

---

### Error Recovery

**Duplicate Handling** (graceful, non-blocking):
```
Instead of: Error("Duplicate bill detected!")
We do:      Show modal, let user choose action
```

**Missing DOM Elements** (optional chaining):
```
Instead of: Crash if element doesn't exist
We do:      Use ?. operator, skip if null
```

**Type Safety**:
```
Instead of: Assume types are correct
We do:      Use TypeScript with explicit types
            Guard checks before operations
```

---

## Summary: How Components Work Together

```
┌──────────────────────────────────────────────────────────────┐
│                    USER                                       │
│              (fills form, clicks buttons)                     │
└────────────────────┬─────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                  TRACKERUI                                    │
│           (event handlers, rendering, dialog state)             │
│  - Listens for user input                                    │
│  - Validates form data                                       │
│  - Calls manager methods                                     │
│  - Updates DOM                                               │
│  - Manages pending bill state for duplicate dialog            │
└────────────────────┬─────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                 BILLMANAGER                                   │
│          (business logic, coordination)                        │
│  - Creates bills using factory pattern                       │
│  - Adds/removes bills from groups                            │
│  - Detects duplicates                                        │
│  - Manages budgets via BudgetPlan                            │
│  - Validates budget allocation                                │
│  - Calculates totals                                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
┌───────▼──────────┐      ┌────────▼──────────┐
│  CATEGORYGROUP    │      │   BILL HIERARCHY  │
│                  │      │                   │
│ - Stores bills   │      │ Subscription      │
│ - Sums monthly   │      │ ├─ Entertainment  │
│                  │      │ ├─ Productivity   │
│                  │      │ Utility           │
│                  │      │ ├─ Essential      │
│                  │      │ ├─ Non-essential  │
│                  │      │ Debt              │
│                  │      │ ├─ One-time       │
│                  │      │ └─ Recurring      │
└────────┬─────────┘      └────────┬──────────┘
         │                         │
         │            ┌─────────────┘
         │            │
         └────────────┤
                      │
             ┌────────▼──────────┐
             │    DATA STORAGE   │
             │                   │
             │ Bills with their: │
             │ - names           │
             │ - amounts         │
             │ - types           │
             │ - calculations    │
             └────────────────────┘
```

**Data flows**:
```
User Input → UI → Manager → Groups → Bills → Calculations → UI Display
```

Each layer is independent and has clear responsibilities. This makes the code:
- **Maintainable**: Easy to find and fix bugs
- **Scalable**: Easy to add new bill types or features
- **Testable**: Each component can be tested separately
- **Reliable**: Validation at each layer prevents bad data

---

## Key Algorithms and Concepts

### 1. **Total Calculation** (Aggregation Pattern)
```
Total = sum of all groups' totals
      = sum of (each group's bills' monthlyImpact())
      = (Netflix + Spotify + ...) + (Electric + Water + ...) + (Debt1 + ...)
```

### 2. **Priority Sorting**
Bills are sorted by importance:
```
Essential items (utilities, recurring debt) show first
Low-importance items (non-essential utilities) show last
User's attention goes to what matters most
```

### 3. **Budget Tracking** (Typed BudgetPlan)
```
Multiple budget levels via BudgetPlan interface:
- Total budget (all bills)
- Category budgets (subscriptions, utilities, debts)
- Individual bill amounts
All contribute to "over budget?" status
Validated by BillManager.validateBudgetAllocation()
```

### 4. **State Management** (Pending Bill System)
```
Dialog state in TrackerUI:
- Normal state: No pending bill
- Action state: Pending bill exists, waiting for user decision
- Post-action: Pending bill cleared, operation completed
Three-state flow allows non-blocking user confirmation
```

This logical organization makes the Bill Tracker predictable, safe, and user-friendly.