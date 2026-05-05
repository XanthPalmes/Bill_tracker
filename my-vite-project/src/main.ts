import './style.css'

abstract class Bill {
	private readonly _id: string
	private _name: string
	private _amount: number

	constructor(id: string, name: string, baseAmount: number) {
		this._id = id
		this._name = name
		this._amount = baseAmount
	}

	public id(): string {
		return this._id
	}

	public name(): string {
		return this._name
	}

	public amount(): number {
		return this._amount
	}

	public abstract monthlyImpact(): number
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
		return this.amount()
	}
}

class ProductivitySubscription extends Subscription {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount()
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
		return this.amount()
	}
}

class NonEssentialUtility extends Utility {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount()
	}
}

abstract class Debts extends Bill {
	private _termMonths: number

	constructor(id: string, name: string, baseAmount: number, termMonths = 12) {
		super(id, name, baseAmount)
		this._termMonths = termMonths
	}

	public termMonths(): number {
		return this._termMonths
	}
}

class OneTimeDebt extends Debts {
	constructor(id: string, name: string, baseAmount: number, termMonths = 12) {
		super(id, name, baseAmount, termMonths)
	}

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
		group.items = group.items.filter((item) => item.id() !== billId)
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

type GroupElements = {
	totalEl: HTMLElement
	listEl: HTMLUListElement
}


class TrackerUI {
	private readonly _root: HTMLDivElement
	private readonly _manager: BillManager
	private readonly _totalValueEl: HTMLElement | null
	private readonly _groupElements: Map<string, GroupElements>
	private _isBound = false

	constructor(root: HTMLDivElement, manager: BillManager) {
		this._root = root
		this._manager = manager
		this._totalValueEl = this._root.querySelector<HTMLElement>('[data-total]')
		this._groupElements = new Map()
		this._root.querySelectorAll<HTMLElement>('[data-group-card]').forEach((card) => {
			const label = card.getAttribute('data-group-card') ?? ''
			const totalEl = card.querySelector<HTMLElement>('[data-group-total]')
			const listEl = card.querySelector<HTMLUListElement>('[data-group-list]')
			if (!label || !totalEl || !listEl) return
			this._groupElements.set(label, { totalEl, listEl })
		})
		this.bindEvents()
	}

	public render(): void {
		this.updateTotals()
		this.renderGroups()
	}

	private bindEvents(): void {
		if (this._isBound) return
		const formCategory = this._root.querySelector<HTMLSelectElement>('[data-category]')
		const formType = this._root.querySelector<HTMLSelectElement>('[data-type]')
		const formTypeField = this._root.querySelector<HTMLElement>('[data-type-field]')
		const formEl = this._root.querySelector<HTMLFormElement>('[data-form]')

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

		formCategory?.addEventListener('change', () => {
			syncTypeOptions(formCategory.value)
		})

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

		syncTypeOptions('')

		this._isBound = true
	}

	private updateTotals(): void {
		if (this._totalValueEl) {
			this._totalValueEl.textContent = this.money(this._manager.getTotal())
		}
	}

	private renderGroups(): void {
		this._manager.getGroups().forEach((group) => {
			const elements = this._groupElements.get(group.label)
			if (!elements) return
			const total = group.items.reduce((sum, item) => sum + item.monthlyImpact(), 0)
			elements.totalEl.textContent = this.money(total)
			elements.listEl.replaceChildren()
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
				elements.listEl.appendChild(listItem)
			})
		})
	}

	private newId(prefix: string): string {
		return `${prefix}-${crypto.randomUUID()}`
	}

	private money(value: number): string {
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
