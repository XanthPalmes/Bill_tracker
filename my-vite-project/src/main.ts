import './style.css'

// Base expense model shared by all bill types.
abstract class Expense {
	protected readonly id: string
	protected name: string
	protected baseAmount: number

	protected constructor(id: string, name: string, baseAmount: number) {
		this.id = id
		this.name = name
		this.baseAmount = baseAmount
	}

	public getId(): string {
		return this.id
	}

	public getName(): string {
		return this.name
	}

	public getBaseAmount(): number {
		return this.baseAmount
	}

	// Each child class defines its own monthly impact math.
	public abstract calculateMonthlyImpact(): number
}

// Simple bill entry that uses the base amount as the monthly impact.
class SimpleExpense extends Expense {
	constructor(id: string, name: string, baseAmount: number) {
		super(id, name, baseAmount)
	}

	public calculateMonthlyImpact(): number {
		return this.baseAmount
	}
}

// Recurring subscriptions that bill on a cycle.
abstract class RecurringSubscription extends Expense {
	protected billingCycle: 'monthly' | 'annual'

	protected constructor(
		id: string,
		name: string,
		baseAmount: number,
		billingCycle: 'monthly' | 'annual'
	) {
		super(id, name, baseAmount)
		this.billingCycle = billingCycle
	}

	public getBillingCycle(): 'monthly' | 'annual' {
		return this.billingCycle
	}
}

// Utilities that change by usage.
abstract class VariableUtility extends Expense {
	protected usageUnitLabel: string

	protected constructor(
		id: string,
		name: string,
		baseAmount: number,
		usageUnitLabel: string
	) {
		super(id, name, baseAmount)
		this.usageUnitLabel = usageUnitLabel
	}

	public getUsageUnitLabel(): string {
		return this.usageUnitLabel
	}
}

// Debts that include interest.
abstract class DebtRepayment extends Expense {
	protected interestRate: number

	protected constructor(id: string, name: string, baseAmount: number, interestRate: number) {
		super(id, name, baseAmount)
		this.interestRate = interestRate
	}

	public getInterestRate(): number {
		return this.interestRate
	}
}

// Subscription types.
class DigitalMedia extends RecurringSubscription {
	private familyMembersShared: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		billingCycle: 'monthly' | 'annual',
		familyMembersShared: number
	) {
		super(id, name, baseAmount, billingCycle)
		this.familyMembersShared = familyMembersShared
	}

	public calculateMonthlyImpact(): number {
		const monthlyCost = this.billingCycle === 'annual' ? this.baseAmount / 12 : this.baseAmount
		return monthlyCost / Math.max(1, this.familyMembersShared)
	}
}

class SoftwareLicense extends RecurringSubscription {
	private annualRenewalFee: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		billingCycle: 'monthly' | 'annual',
		annualRenewalFee: number
	) {
		super(id, name, baseAmount, billingCycle)
		this.annualRenewalFee = annualRenewalFee
	}

	public calculateMonthlyImpact(): number {
		const monthlyCost = this.billingCycle === 'annual' ? this.baseAmount / 12 : this.baseAmount
		return monthlyCost + this.annualRenewalFee / 12
	}
}

// Utility types.
class MeteredUtility extends VariableUtility {
	private unitsUsed: number
	private costPerUnit: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		usageUnitLabel: string,
		unitsUsed: number,
		costPerUnit: number
	) {
		super(id, name, baseAmount, usageUnitLabel)
		this.unitsUsed = unitsUsed
		this.costPerUnit = costPerUnit
	}

	public calculateMonthlyImpact(): number {
		return this.baseAmount + this.unitsUsed * this.costPerUnit
	}
}

class TieredUtility extends VariableUtility {
	private dataCap: number
	private overagePenalty: number
	private unitsUsed: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		usageUnitLabel: string,
		dataCap: number,
		overagePenalty: number,
		unitsUsed: number
	) {
		super(id, name, baseAmount, usageUnitLabel)
		this.dataCap = dataCap
		this.overagePenalty = overagePenalty
		this.unitsUsed = unitsUsed
	}

	public calculateMonthlyImpact(): number {
		const overage = Math.max(0, this.unitsUsed - this.dataCap)
		return this.baseAmount + overage * this.overagePenalty
	}
}

// Debt types.
class CreditCard extends DebtRepayment {
	private currentBalance: number
	private minimumPaymentPercent: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		interestRate: number,
		currentBalance: number,
		minimumPaymentPercent: number
	) {
		super(id, name, baseAmount, interestRate)
		this.currentBalance = currentBalance
		this.minimumPaymentPercent = minimumPaymentPercent
	}

	public calculateMonthlyImpact(): number {
		const interest = this.currentBalance * (this.interestRate / 12)
		const minimumPayment = this.currentBalance * this.minimumPaymentPercent
		return this.baseAmount + interest + minimumPayment
	}
}

class FixedLoan extends DebtRepayment {
	private remainingTermMonths: number

	constructor(
		id: string,
		name: string,
		baseAmount: number,
		interestRate: number,
		remainingTermMonths: number
	) {
		super(id, name, baseAmount, interestRate)
		this.remainingTermMonths = remainingTermMonths
	}

	public calculateMonthlyImpact(): number {
		const interest = this.baseAmount * this.interestRate
		return (this.baseAmount + interest) / Math.max(1, this.remainingTermMonths)
	}
}

type CategoryGroup = {
	label: string
	items: Expense[]
}

type GroupElements = {
	totalEl: HTMLElement
	listEl: HTMLUListElement
}

// Simple UI controller that renders the dashboard.
class BillTrackerUI {
	private readonly root: HTMLDivElement
	private readonly groups: CategoryGroup[]
	private readonly totalValueEl: HTMLElement | null
	private readonly groupElements: Map<string, GroupElements>
	private closeModalHandler?: () => void
	private readonly escapeListener: (event: KeyboardEvent) => void
	private isBound = false

	constructor(root: HTMLDivElement, groups: CategoryGroup[]) {
		this.root = root
		this.groups = groups
		this.totalValueEl = this.root.querySelector<HTMLElement>('[data-total]')
		this.groupElements = new Map()
		this.root.querySelectorAll<HTMLElement>('[data-group-card]').forEach((card) => {
			const label = card.getAttribute('data-group-card') ?? ''
			const totalEl = card.querySelector<HTMLElement>('[data-group-total]')
			const listEl = card.querySelector<HTMLUListElement>('[data-group-list]')
			if (!label || !totalEl || !listEl) return
			this.groupElements.set(label, { totalEl, listEl })
		})
		this.escapeListener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				this.closeModalHandler?.()
			}
		}
		document.addEventListener('keydown', this.escapeListener)
		this.bindEvents()
	}

	public render(): void {
		this.updateTotals()
		this.renderGroups()
	}

	private bindEvents(): void {
		if (this.isBound) return
		// Lightweight click handler to confirm the add action.
		const modal = this.root.querySelector<HTMLDivElement>('[data-modal]')
		const modalCategory = this.root.querySelector<HTMLSelectElement>('[data-category]')
		const modalForm = this.root.querySelector<HTMLFormElement>('[data-form]')

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

		this.closeModalHandler = closeModal

		this.root.querySelectorAll<HTMLButtonElement>('.add-button').forEach((button) => {
			button.addEventListener('click', () => {
				const label = button.dataset.group ?? 'this group'
				openModal(label)
			})
		})

		this.root.querySelectorAll<HTMLElement>('[data-close]').forEach((button) => {
			button.addEventListener('click', closeModal)
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

			const expense = new SimpleExpense(
				this.generateId('bill'),
				name,
				amountValue
			)
			this.addExpenseToGroup(category, expense)
			closeModal()
			this.render()
		})

		this.isBound = true
	}

	private updateTotals(): void {
		if (this.totalValueEl) {
			this.totalValueEl.textContent = this.formatCurrency(this.getTotal())
		}
	}

	private renderGroups(): void {
		this.groups.forEach((group) => {
			const elements = this.groupElements.get(group.label)
			if (!elements) return
			const total = group.items.reduce((sum, item) => sum + item.calculateMonthlyImpact(), 0)
			elements.totalEl.textContent = this.formatCurrency(total)
			elements.listEl.replaceChildren()
			group.items.forEach((item) => {
				const listItem = document.createElement('li')
				const content = document.createElement('div')
				const name = document.createElement('p')
				name.className = 'bill-name'
				name.textContent = item.getName()
				content.appendChild(name)
				const value = document.createElement('span')
				value.className = 'bill-value'
				value.textContent = this.formatCurrency(item.calculateMonthlyImpact())
				listItem.append(content, value)
				elements.listEl.appendChild(listItem)
			})
		})
	}

	private addExpenseToGroup(label: string, expense: Expense): void {
		const group = this.groups.find((item) => item.label === label)
		if (!group) return
		group.items.push(expense)
	}

	private generateId(prefix: string): string {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return `${prefix}-${crypto.randomUUID()}`
		}
		return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
	}

	private getTotal(): number {
		return this.groups
			.flatMap((group) => group.items)
			.reduce((sum, item) => sum + item.calculateMonthlyImpact(), 0)
	}

	private formatCurrency(value: number): string {
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
	const ui = new BillTrackerUI(root, groups)
	ui.render()
}
