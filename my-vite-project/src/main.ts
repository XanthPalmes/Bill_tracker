import './style.css'

// Base model shared by all bill types.
abstract class Bill {
	private readonly _id: string
	private _name: string
	private _amount: number

	protected constructor(id: string, name: string, baseAmount: number) {
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

	// Each child class defines its own monthly impact math.
	public abstract monthlyImpact(): number
}

// Simple bill entry that uses the base amount as the monthly impact.
class SimpleBill extends Bill {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public monthlyImpact(): number {
		return this.amount()
	}
}

type CategoryGroup = {
	label: string
	items: Bill[]
}

type GroupElements = {
	totalEl: HTMLElement
	listEl: HTMLUListElement
}

// Simple UI controller that renders the dashboard.
class TrackerUI {
	private readonly _root: HTMLDivElement
	private readonly _groups: CategoryGroup[]
	private readonly _totalValueEl: HTMLElement | null
	private readonly _groupElements: Map<string, GroupElements>
	private _closeModalHandler?: () => void
	private readonly _escapeListener: (event: KeyboardEvent) => void
	private _isBound = false

	constructor(root: HTMLDivElement, groups: CategoryGroup[]) {
		this._root = root
		this._groups = groups
		this._totalValueEl = this._root.querySelector<HTMLElement>('[data-total]')
		this._groupElements = new Map()
		this._root.querySelectorAll<HTMLElement>('[data-group-card]').forEach((card) => {
			const label = card.getAttribute('data-group-card') ?? ''
			const totalEl = card.querySelector<HTMLElement>('[data-group-total]')
			const listEl = card.querySelector<HTMLUListElement>('[data-group-list]')
			if (!label || !totalEl || !listEl) return
			this._groupElements.set(label, { totalEl, listEl })
		})
		this._escapeListener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				this._closeModalHandler?.()
			}
		}
		document.addEventListener('keydown', this._escapeListener)
		this.bindEvents()
	}

	public render(): void {
		this.updateTotals()
		this.renderGroups()
	}

	private bindEvents(): void {
		if (this._isBound) return
		// Lightweight click handler to confirm the add action.
		const modal = this._root.querySelector<HTMLDivElement>('[data-modal]')
		const modalCategory = this._root.querySelector<HTMLSelectElement>('[data-category]')
		const modalForm = this._root.querySelector<HTMLFormElement>('[data-form]')

		const openModal = (label: string): void => {
			if (!modal || !modalCategory) return
			const hasOption = Array.from(modalCategory.options).some(
				(option) => option.value === label
			)
			modalCategory.value = hasOption
				? label
				: modalCategory.options[0]?.value ?? label
			modal.setAttribute('aria-hidden', 'false')
			modal.classList.add('is-open')
		}

		const closeModal = (): void => {
			if (!modal || !modalForm) return
			modalForm.reset()
			modal.setAttribute('aria-hidden', 'true')
			modal.classList.remove('is-open')
		}

		this._closeModalHandler = closeModal

		this._root.querySelectorAll<HTMLButtonElement>('.add-button').forEach((button) => {
			button.addEventListener('click', () => {
				const label = button.dataset.group ?? 'this group'
				openModal(label)
			})
		})

		this._root.querySelectorAll<HTMLElement>('[data-close]').forEach((button) => {
			button.addEventListener('click', closeModal)
		})

		this._root.querySelectorAll<HTMLUListElement>('[data-group-list]').forEach((listEl) => {
			listEl.addEventListener('click', (event) => {
				const target = event.target as HTMLElement | null
				const deleteButton = target?.closest<HTMLButtonElement>('[data-delete-id]')
				if (!deleteButton) return
				const billId = deleteButton.getAttribute('data-delete-id')
				const groupLabel = deleteButton.getAttribute('data-group')
				if (!billId || !groupLabel) return
				this.removeFromGroup(groupLabel, billId)
				this.render()
			})
		})

		modalForm?.addEventListener('submit', (event) => {
			event.preventDefault()
			if (!modalForm) return
			const formData = new FormData(modalForm)
			const name = String(formData.get('name') ?? '').trim()
			const category = String(formData.get('category') ?? '').trim()
			const amountValue = Number(formData.get('amount'))

			if (!name || !category || Number.isNaN(amountValue)) {
				return
			}

			const bill = new SimpleBill(
				this.newId('bill'),
				name,
				amountValue
			)
			this.addToGroup(category, bill)
			closeModal()
			this.render()
		})

		this._isBound = true
	}

	private updateTotals(): void {
		if (this._totalValueEl) {
			this._totalValueEl.textContent = this.money(this.total())
		}
	}

	private renderGroups(): void {
		this._groups.forEach((group) => {
			const elements = this._groupElements.get(group.label)
			if (!elements) return
			const total = group.items.reduce((sum, item) => sum + item.monthlyImpact(), 0)
			elements.totalEl.textContent = this.money(total)
			elements.listEl.replaceChildren()
			group.items.forEach((item) => {
				const listItem = document.createElement('li')
				const content = document.createElement('div')
				const name = document.createElement('p')
				name.className = 'bill-name'
				name.textContent = item.name()
				content.appendChild(name)
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

	private addToGroup(label: string, bill: Bill): void {
		const group = this._groups.find((item) => item.label === label)
		if (!group) return
		group.items.push(bill)
	}

	private removeFromGroup(label: string, billId: string): void {
		const group = this._groups.find((item) => item.label === label)
		if (!group) return
		group.items = group.items.filter((item) => item.id() !== billId)
	}

	private newId(prefix: string): string {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return `${prefix}-${crypto.randomUUID()}`
		}
		return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
	}

	private total(): number {
		return this._groups
			.flatMap((group) => group.items)
			.reduce((sum, item) => sum + item.monthlyImpact(), 0)
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
	const ui = new TrackerUI(root, groups)
	ui.render()
}
