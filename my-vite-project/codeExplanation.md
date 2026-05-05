# main.ts Code Explanation

Below is a README-style, line-by-line walkthrough of `main.ts`, organized by logical blocks. Each block includes the snippet, technical explanation, logic/intent, and key concepts.

---

## File Overview

This file defines the domain model for bills (subscriptions, utilities, debts), a `BillManager` to orchestrate them, and a `TrackerUI` that binds DOM events and renders the data. It wires everything together and renders the UI.

---

## 1) Importing Styles

```ts
import './style.css'
```

**Technical Explanation:**
Imports a CSS file as a side effect. Vite supports CSS imports in TS/JS entry points so the bundler includes styles.

**Logic & Intent:**
Ensures the UI styles are loaded when the app starts.

**Key Concepts:**
- Vite asset pipeline
- Side-effect-only imports

---

## 2) Abstract Base Class: `Bill`

```ts
abstract class Bill {
	private _id: string
	private _name: string
	private _amount: number

	constructor(id: string, name: string, baseAmount: number) {
		this._id = id
		this._name = name
		this._amount = baseAmount
	}

	public id(): string { ... }
	public setId(id: string): void { ... }
	public name(): string { ... }
	public setName(name: string): void { ... }
	public amount(): number { ... }
	public setAmount(amount: number): void { ... }

	public abstract monthlyImpact(): number
}
```

**Technical Explanation:**
- `abstract class` defines a base type that cannot be instantiated directly.
- Private fields store bill data.
- Accessors are implemented via methods instead of getters/setters.
- `monthlyImpact()` is abstract, forcing subclasses to implement it.

**Logic & Intent:**
Provides a common contract for all bill types, ensuring every bill can report its monthly impact.

**Key Concepts:**
- Abstract classes
- Encapsulation with `private` fields
- Polymorphism via abstract methods

---

## 3) Subscription Types

```ts
abstract class Subscription extends Bill { ... }

class EntertainmentSubscription extends Subscription {
	public monthlyImpact(): number {
		return this.amount()
	}
}

class ProductivitySubscription extends Subscription {
	public monthlyImpact(): number {
		return this.amount()
	}
}
```

**Technical Explanation:**
- `Subscription` is abstract but doesn’t add new behavior.
- Two concrete subclasses override `monthlyImpact()`.

**Logic & Intent:**
Distinguishes subscription categories for grouping and labeling, even if their math is identical.

**Key Concepts:**
- Inheritance hierarchy
- Concrete vs abstract classes

---

## 4) Utility Types

```ts
abstract class Utility extends Bill { ... }

class EssentialUtility extends Utility {
	public monthlyImpact(): number {
		return this.amount()
	}
}

class NonEssentialUtility extends Utility {
	public monthlyImpact(): number {
		return this.amount()
	}
}
```

**Technical Explanation:**
Same structure as subscriptions: one abstract group and two concrete types.

**Logic & Intent:**
Allows future differentiation between essential and non-essential utilities if needed.

**Key Concepts:**
- Domain modeling
- Future extensibility

---

## 5) Debt Types

```ts
abstract class Debts extends Bill {
	private _termMonths: number

	constructor(id: string, name: string, baseAmount: number, termMonths = 12) {
		super(id, name, baseAmount)
		this._termMonths = termMonths
	}

	public termMonths(): number { ... }
	public setTermMonths(termMonths: number): void { ... }
}

class OneTimeDebt extends Debts {
	public monthlyImpact(): number {
		return this.amount()
	}
}

class RecurringDebt extends Debts {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount, 1)
	}

	public monthlyImpact(): number {
		return this.amount()
	}
}
```

**Technical Explanation:**
- Adds a `_termMonths` field with default value 12.
- `RecurringDebt` forces a 1-month term by passing `1` to the base constructor.

**Logic & Intent:**
Models differences between one-time and recurring debts while sharing the common debt metadata.

**Key Concepts:**
- Constructor chaining with `super()`
- Default parameter values

---

## 6) Group Model

```ts
type CategoryGroup = {
	label: string
	items: Bill[]
}
```

**Technical Explanation:**
Type alias defining a group with a label and a list of bills.

**Logic & Intent:**
Groups organize bills by category in UI and calculations.

**Key Concepts:**
- Type aliases
- Arrays of polymorphic types (`Bill[]`)

---

## 7) `BillManager`: Data Orchestration

```ts
class BillManager {
	private groups: CategoryGroup[]

	constructor(groups: CategoryGroup[]) {
		this.groups = groups
	}

	public getGroups(): CategoryGroup[] { ... }
```

**Technical Explanation:**
Stores and exposes the groups array.

**Logic & Intent:**
Central place to query and mutate all bills.

**Key Concepts:**
- Aggregation
- Encapsulated state

---

### 7.1) Factory Method for Bill Creation

```ts
public createBill(category: string, billType: string, id: string, name: string, amount: number): Bill {
	if (category === 'Subscriptions') {
		return billType === 'ProductivitySubscription'
			? new ProductivitySubscription(id, name, amount)
			: new EntertainmentSubscription(id, name, amount)
	}

	if (category === 'Utilities') {
		return billType === 'NonEssentialUtility'
			? new NonEssentialUtility(id, name, amount)
			: new EssentialUtility(id, name, amount)
	}

	if (category === 'Debts') {
		return billType === 'RecurringDebt'
			? new RecurringDebt(id, name, amount)
			: new OneTimeDebt(id, name, amount)
	}

	return new EntertainmentSubscription(id, name, amount)
}
```

**Technical Explanation:**
Uses conditionals and ternaries to return specific subclasses based on inputs.

**Logic & Intent:**
Acts as a factory so the UI doesn’t need to know class constructors.

**Key Concepts:**
- Factory method pattern
- Conditional branching

---

### 7.2) Mutations: Add / Remove

```ts
public addToGroup(label: string, bill: Bill): void {
	const group = this.groups.find((item) => item.label === label)
	if (!group) return
	group.items.push(bill)
}

public removeFromGroup(label: string, billId: string): void {
	const group = this.groups.find((item) => item.label === label)
	if (!group) return
	group.items = group.items.filter((item) => item.id() !== billId)
}
```

**Technical Explanation:**
- `find` retrieves a group by label.
- `push` appends new bills.
- `filter` removes by `id()`.

**Logic & Intent:**
Maintains group integrity and hides data structure from UI.

**Key Concepts:**
- Array mutation
- Defensive checks

---

### 7.3) Total Calculation

```ts
public getTotal(): number {
	return this.groups
		.flatMap((group) => group.items)
		.reduce((sum, item) => sum + item.monthlyImpact(), 0)
}
```

**Technical Explanation:**
- `flatMap` flattens all bill arrays into one.
- `reduce` accumulates total monthly impact.

**Logic & Intent:**
Provides a single total for the UI header.

**Key Concepts:**
- Functional array operations
- Aggregation

---

### 7.4) Human-Friendly Labels

```ts
public getBillTypeLabel(bill: Bill): string {
	switch (bill.constructor.name) {
		case 'EntertainmentSubscription':
			return 'Entertainment'
		case 'ProductivitySubscription':
			return 'Productivity'
		case 'EssentialUtility':
			return 'Essential'
		case 'NonEssentialUtility':
			return 'Non-essential'
		case 'OneTimeDebt':
			return 'One-time'
		case 'RecurringDebt':
			return 'Recurring'
		default:
			return bill.constructor.name.replace('Bill', '')
	}
}
```

**Technical Explanation:**
Uses `constructor.name` to map class names to display labels.

**Logic & Intent:**
Keeps display strings centralized and consistent.

**Key Concepts:**
- Runtime reflection via `constructor.name`
- `switch` mapping

---

## 8) `TrackerUI`: DOM Binding + Rendering

```ts
class TrackerUI {
	private _root: HTMLDivElement
	private _manager: BillManager
	private _isBound = false

	constructor(root: HTMLDivElement, manager: BillManager) {
		this._root = root
		this._manager = manager
		this.bindEvents()
	}

	public render(): void {
		this.updateTotals()
		this.renderGroups()
	}
```

**Technical Explanation:**
- Holds references to root DOM node and `BillManager`.
- `bindEvents()` runs once.
- `render()` orchestrates UI refresh.

**Logic & Intent:**
Encapsulates UI logic so data and rendering stay separate.

**Key Concepts:**
- UI controller pattern
- Composition

---

### 8.1) Event Binding

```ts
private bindEvents(): void {
	if (this._isBound) return
	const formCategory = this._root.querySelector<HTMLSelectElement>('[data-category]')
	const formType = this._root.querySelector<HTMLSelectElement>('[data-type]')
	const formTypeField = this._root.querySelector<HTMLElement>('[data-type-field]')
	const formEl = this._root.querySelector<HTMLFormElement>('[data-form]')
```

**Technical Explanation:**
Queries DOM using `data-*` attributes with generic type hints.

**Logic & Intent:**
Finds UI inputs once and reuses them.

**Key Concepts:**
- Type-parameterized `querySelector`
- Data attributes as selectors

---

### 8.2) Type Options Synchronization

```ts
const syncTypeOptions = (category: string): void => {
	if (!formType || !formTypeField) return

	const hasCategory = category.length > 0
	formTypeField.hidden = !hasCategory

	Array.from(formType.options).forEach((option) => {
		const isMatch = option.dataset.category === category
		option.hidden = !isMatch
		option.disabled = !isMatch
	})

	if (!hasCategory) {
		formType.value = ''
		return
	}

	const firstMatchingType = Array.from(formType.options).find(
		(option) => option.dataset.category === category
	)
	if (firstMatchingType) {
		formType.value = firstMatchingType.value
	}
}
```

**Technical Explanation:**
- Uses `dataset.category` to show/hide options.
- Sets default option after filtering.

**Logic & Intent:**
Keeps “bill type” aligned with selected category.

**Key Concepts:**
- DOM `dataset`
- Attribute toggling

---

### 8.3) Category Change Listener

```ts
formCategory?.addEventListener('change', () => {
	syncTypeOptions(formCategory.value)
})
```

**Technical Explanation:**
Optional chaining ensures listener only added when element exists.

**Logic & Intent:**
Updates bill type options when category changes.

**Key Concepts:**
- Optional chaining
- Event-driven UI

---

### 8.4) Delete Buttons (Event Delegation)

```ts
this._root.querySelectorAll<HTMLUListElement>('[data-group-list]').forEach((listEl) => {
	listEl.addEventListener('click', (event) => {
		const target = event.target as HTMLElement | null
		const deleteButton = target?.closest<HTMLButtonElement>('[data-delete-id]')
		if (!deleteButton) return
		const billId = deleteButton.getAttribute('data-delete-id')
		const groupLabel = deleteButton.getAttribute('data-group')
		if (!billId || !groupLabel) return
		this._manager.removeFromGroup(groupLabel, billId)
		this.render()
	})
})
```

**Technical Explanation:**
Uses `closest` for event delegation. Gets `data-*` attributes to identify the bill.

**Logic & Intent:**
Allows delete actions without attaching a listener to every button.

**Key Concepts:**
- Event delegation
- `closest()` traversal

---

### 8.5) Form Submission

```ts
formEl?.addEventListener('submit', (event) => {
	event.preventDefault()
	if (!formEl) return
	const formData = new FormData(formEl)
	const name = String(formData.get('name') ?? '').trim()
	const category = String(formData.get('category') ?? '').trim()
	const billType = String(formData.get('billType') ?? '').trim()
	const amountValue = Number(formData.get('amount'))

	if (!name || !category || !billType || Number.isNaN(amountValue)) {
		return
	}

	const bill = this._manager.createBill(category, billType, this.newId('bill'), name, amountValue)
	this._manager.addToGroup(category, bill)
	formEl.reset()
	syncTypeOptions('')
	this.render()
})
```

**Technical Explanation:**
- Extracts form values with `FormData`.
- Validates inputs.
- Creates and stores a bill.

**Logic & Intent:**
The primary data-entry flow for users.

**Key Concepts:**
- `FormData` API
- Input validation
- Factory method usage

---

### 8.6) Initialize Type Options Once

```ts
syncTypeOptions('')
this._isBound = true
```

**Technical Explanation:**
Initial UI reset and bind guard.

**Logic & Intent:**
Prevents duplicate event registrations if `bindEvents()` runs again.

**Key Concepts:**
- Idempotent setup patterns

---

## 9) Rendering Helpers

### 9.1) Total Display

```ts
private updateTotals(): void {
	const totalValueEl = this._root.querySelector<HTMLElement>('[data-total]')
	if (!totalValueEl) return
	totalValueEl.textContent = this.money(this._manager.getTotal())
}
```

**Technical Explanation:**
Fetches the total and writes formatted text.

**Logic & Intent:**
Keeps top-level summary in sync with data.

**Key Concepts:**
- Simple rendering method
- Data formatting

---

### 9.2) Group Cards + Bill Items

```ts
private renderGroups(): void {
	this._root.querySelectorAll<HTMLElement>('[data-group-card]').forEach((card) => {
		const label = card.getAttribute('data-group-card') ?? ''
		const totalEl = card.querySelector<HTMLElement>('[data-group-total]')
		const listEl = card.querySelector<HTMLUListElement>('[data-group-list]')
		if (!label || !totalEl || !listEl) return
		const group = this._manager.getGroups().find((item) => item.label === label)
		if (!group) return
		const total = group.items.reduce((sum, item) => sum + item.monthlyImpact(), 0)
		totalEl.textContent = this.money(total)
		listEl.replaceChildren()
		group.items.forEach((item) => {
			const listItem = document.createElement('li')
			const billTypeLabel = this._manager.getBillTypeLabel(item)
			listItem.setAttribute('data-bill-type', billTypeLabel)
			const content = document.createElement('div')
			const name = document.createElement('p')
			name.className = 'bill-name'
			name.textContent = item.name()
			content.appendChild(name)
			const note = document.createElement('p')
			note.className = 'bill-note'
			note.textContent = billTypeLabel
			content.appendChild(note)
			const value = document.createElement('span')
			value.className = 'bill-value'
			value.textContent = this.money(item.monthlyImpact())
			const deleteButton = document.createElement('button')
			deleteButton.className = 'delete-button'
			deleteButton.type = 'button'
			deleteButton.textContent = 'Delete'
			deleteButton.setAttribute('aria-label', `Delete ${item.name()}`)
			deleteButton.setAttribute('data-delete-id', item.id())
			deleteButton.setAttribute('data-group', group.label)
			listItem.append(content, value, deleteButton)
			listEl.appendChild(listItem)
		})
	})
}
```

**Technical Explanation:**
- Selects all group cards and re-renders their totals and lists.
- Clears list with `replaceChildren()` and rebuilds items.

**Logic & Intent:**
Keeps UI consistent by always re-rendering from source data.

**Key Concepts:**
- Imperative DOM rendering
- Accessibility via `aria-label`

---

### 9.3) Helpers

```ts
private newId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID()}`
}

private money(value: number): string {
	return `PHP ${value.toFixed(2)}`
}
```

**Technical Explanation:**
- Uses `crypto.randomUUID()` for unique IDs.
- Formats currency with 2 decimals and a peso code string.

**Logic & Intent:**
IDs enable deletion; currency formatting improves display.

**Key Concepts:**
- Web Crypto API
- String interpolation

---

## 10) Bootstrapping the App

```ts
const groups: CategoryGroup[] = [
	{ label: 'Subscriptions', items: [] },
	{ label: 'Utilities', items: [] },
	{ label: 'Debts', items: [] }
]

const root = document.querySelector<HTMLDivElement>('#app')

if (root) {
	const manager = new BillManager(groups)
	const ui = new TrackerUI(root, manager)
	ui.render()
}
```

**Technical Explanation:**
- Defines initial data structure.
- Grabs the root element.
- Instantiates manager and UI, then renders.

**Logic & Intent:**
Startup wiring for the entire application.

**Key Concepts:**
- App initialization
- Dependency injection via constructor

---

## High-Level Summary

This file is the core of the app: it models all bill types, manages collections and totals, and renders the UI while handling user input. It acts as both the domain layer (bill classes) and the UI controller (DOM binding and rendering), making it the single entry point for the repository’s functionality.
