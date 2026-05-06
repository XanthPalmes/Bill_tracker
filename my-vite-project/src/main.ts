import './style.css'

abstract class Bill {
	private _id: string
	private _name: string
	private _amount: number

	constructor(id: string, name: string, baseAmount: number) {
		this._id = id
		this._name = name
		this._amount = baseAmount
	}

	public get id(): string {
		return this._id
	}

	public set id(value: string) {
		this._id = value
	}

	public get name(): string {
		return this._name
	}

	public set name(value: string) {
		this._name = value
	}

	public get amount(): number {
		return this._amount
	}

	public set amount(value: number) {
		this._amount = value
	}

	public abstract monthlyImpact(): number

	public abstract priority(): number
}

abstract class Subscription extends Bill {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}
}

class EntertainmentSubscription extends Subscription {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 2 
	}
}

class ProductivitySubscription extends Subscription {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 3  
	}
}

abstract class Utility extends Bill {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}
}

class EssentialUtility extends Utility {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 5 
	}
}

class NonEssentialUtility extends Utility {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 1 
	}
}

abstract class Debts extends Bill {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}
}

class OneTimeDebt extends Debts {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 4  
	}
}

class RecurringDebt extends Debts {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount
	}

	public priority(): number {
		return 5  
	}
}


type CategoryGroup = {
	label: string
	items: Bill[]
}

class BillManager {
	private groups: CategoryGroup[]

	constructor(groups: CategoryGroup[]) {
		this.groups = groups
	}

	public getGroups(): CategoryGroup[] {
		return this.groups
	}

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

	public addToGroup(label: string, bill: Bill): void {
		const group = this.groups.find((item) => item.label === label)
		if (!group) return
		group.items.push(bill)
	}

	public removeFromGroup(label: string, billId: string): void {
		const group = this.groups.find((item) => item.label === label)
		if (!group) return
		group.items = group.items.filter((item) => item.id !== billId)
	}

	public getTotal(): number {
		return this.groups
			.flatMap((group) => group.items)
			.reduce((sum, item) => sum + item.monthlyImpact(), 0)
	}

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
}

class TrackerUI {
	// Root element that contains the entire tracker UI; all queries scope to this element.
	private _root: HTMLDivElement
	// Business logic layer that stores bills and calculates totals.
	private _manager: BillManager
	// Flag to ensure listeners are attached only once, even if render() is called repeatedly.
	private _isBound = false
	// Category <select> element that chooses which group a bill belongs to.
	private _formCategory: HTMLSelectElement | null
	// Type <select> element that changes based on the chosen category.
	private _formType: HTMLSelectElement | null
	// Wrapper around the type <select>, so we can hide the whole field when no category is chosen.
	private _formTypeField: HTMLElement | null
	// The <form> element where the user enters bill details.
	private _formEl: HTMLFormElement | null

	constructor(root: HTMLDivElement, manager: BillManager) {
		// Store the injected dependencies (root DOM node + manager).
		this._root = root
		this._manager = manager
		// Cache frequently used DOM elements to avoid re-querying on every event.
		this._formCategory = this._root.querySelector<HTMLSelectElement>('[data-category]')
		this._formType = this._root.querySelector<HTMLSelectElement>('[data-type]')
		this._formTypeField = this._root.querySelector<HTMLElement>('[data-type-field]')
		this._formEl = this._root.querySelector<HTMLFormElement>('[data-form]')
		// Attach event listeners and set up initial state for the form UI.
		this.bindEvents()
	}

	public render(): void {
		// Main render entry point: recompute totals and rebuild list views.
		this.updateTotals()
		this.renderGroups()
	}

	private bindEvents(): void {
		// Guard against attaching listeners multiple times.
		if (this._isBound) return

		// Keep bill-type options synced to whichever category is selected.
		this._formCategory?.addEventListener('change', this.onCategoryChange)

		this._root.querySelectorAll<HTMLUListElement>('[data-group-list]').forEach((listEl) => {
			// Use event delegation so one handler catches clicks on all delete buttons inside the list.
			listEl.addEventListener('click', this.onListClick)
		})

		// Intercept form submit to create a new bill instead of reloading the page.
		this._formEl?.addEventListener('submit', this.onFormSubmit)

		// Reset type field so the UI starts in a clean state.
		this.syncTypeOptions('')

		// Mark as bound to prevent duplicate listeners in the future.
		this._isBound = true
	}

	private onCategoryChange = (): void => {
		// If the category dropdown is missing, there is nothing to update.
		if (!this._formCategory) return
		// Filter and update the bill-type options based on the selected category.
		this.syncTypeOptions(this._formCategory.value)
	}

	private onListClick = (event: Event): void => {
		// Determine whether the click happened on a delete button inside a list item.
		const target = event.target as HTMLElement | null
		const deleteButton = target?.closest<HTMLButtonElement>('[data-delete-id]')
		if (!deleteButton) return
		// Read the bill id and group label stored on the delete button.
		const billId = deleteButton.getAttribute('data-delete-id')
		const groupLabel = deleteButton.getAttribute('data-group')
		if (!billId || !groupLabel) return
		// Remove the bill from its group and refresh the UI.
		this._manager.removeFromGroup(groupLabel, billId)
		this.render()
	}

	private onFormSubmit = (event: Event): void => {
		// Stop the browser's default form submit (which would reload the page).
		event.preventDefault()
		if (!this._formEl) return
		// Read values from the form fields.
		const formData = new FormData(this._formEl)
		const name = String(formData.get('name') ?? '').trim()
		const category = String(formData.get('category') ?? '').trim()
		const billType = String(formData.get('billType') ?? '').trim()
		const amountValue = Number(formData.get('amount'))

		// Exit early if any required fields are missing or amount is not a number.
		if (!name || !category || !billType || Number.isNaN(amountValue)) {
			return
		}

		// Create a new bill instance and add it to the correct group.
		const bill = this._manager.createBill(category, billType, this.newId('bill'), name, amountValue)
		this._manager.addToGroup(category, bill)
		// Clear the form so the user can enter a new bill.
		this._formEl.reset()
		// Reset the type options now that no category is selected.
		this.syncTypeOptions('')
		// Refresh the totals and list display to show the new bill.
		this.render()
	}

	private syncTypeOptions(category: string): void {
		// If elements are missing, we cannot update the type field.
		if (!this._formType || !this._formTypeField) return

		// Determine if a category is selected and show/hide the type field accordingly.
		const hasCategory = category.length > 0
		this._formTypeField.hidden = !hasCategory

		// Loop through all type options and enable only those that match the category.
		Array.from(this._formType.options).forEach((option) => {
			const isMatch = option.dataset.category === category
			option.hidden = !isMatch
			option.disabled = !isMatch
		})

		// If no category is selected, clear the type selection and stop here.
		if (!hasCategory) {
			this._formType.value = ''
			return
		}

		// Pick the first matching type so the user has a valid default selection.
		const firstMatchingType = Array.from(this._formType.options).find(
			(option) => option.dataset.category === category
		)
		if (firstMatchingType) {
			this._formType.value = firstMatchingType.value
		}
	}

	private updateTotals(): void {
		// Find the total display element and set it to the calculated total.
		const totalValueEl = this._root.querySelector<HTMLElement>('[data-total]')
		if (!totalValueEl) return
		totalValueEl.textContent = this.money(this._manager.getTotal())
	}

	private renderGroups(): void {
		// Rebuild each category card using the current data in the manager.
		this._root.querySelectorAll<HTMLElement>('[data-group-card]').forEach((card) => {
			const label = card.getAttribute('data-group-card') ?? ''
			const totalEl = card.querySelector<HTMLElement>('[data-group-total]')
			const listEl = card.querySelector<HTMLUListElement>('[data-group-list]')
			if (!label || !totalEl || !listEl) return
			const group = this._manager.getGroups().find((item) => item.label === label)
			if (!group) return
			// Calculate and display this group's total amount.
			const total = group.items.reduce((sum, item) => sum + item.monthlyImpact(), 0)
			totalEl.textContent = this.money(total)
			// Clear any existing list items before rebuilding the list.
			listEl.replaceChildren()
			// Sort items so higher priority appears first in the list.
			const sortedItems = [...group.items].sort((a, b) => b.priority() - a.priority())
			sortedItems.forEach((item) => {
				// Create a list item for one bill.
				const listItem = document.createElement('li')
				const billTypeLabel = this._manager.getBillTypeLabel(item)
				listItem.setAttribute('data-bill-type', billTypeLabel)
				const content = document.createElement('div')
				const name = document.createElement('p')
				name.className = 'bill-name'
				name.textContent = item.name
				content.appendChild(name)
				const note = document.createElement('p')
				note.className = 'bill-note'
				note.textContent = billTypeLabel
				content.appendChild(note)
				const value = document.createElement('span')
				value.className = 'bill-value'
				value.textContent = this.money(item.monthlyImpact())
				// Create the delete button and embed bill metadata on it.
				const deleteButton = document.createElement('button')
				deleteButton.className = 'delete-button'
				deleteButton.type = 'button'
				deleteButton.textContent = 'Delete'
				deleteButton.setAttribute('aria-label', `Delete ${item.name}`)
				deleteButton.setAttribute('data-delete-id', item.id)
				deleteButton.setAttribute('data-group', group.label)
				// Combine the pieces and attach the list item to the UI.
				listItem.append(content, value, deleteButton)
				listEl.appendChild(listItem)
			})
		})
	}

	private newId(prefix: string): string {
		// Generate a unique id for each bill so delete actions can target the correct item.
		return `${prefix}-${crypto.randomUUID()}`
	}

	private money(value: number): string {
		// Convert a number into a peso currency string for display.
		return `₱${value.toFixed(2)}`
	}
}

const groups: CategoryGroup[] = [
	{
		label: 'Subscriptions',
		items: []
	},
	{
		label: 'Utilities',
		items: []
	},
	{
		label: 'Debts',
		items: []
	}
]

const root = document.querySelector<HTMLDivElement>('#app')

if (root) {
	const manager = new BillManager(groups)
	const ui = new TrackerUI(root, manager)
	ui.render()
}
