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

// Simple UI controller that renders the dashboard.
class BillTrackerUI {
	private readonly root: HTMLDivElement
	private readonly groups: CategoryGroup[]

	constructor(root: HTMLDivElement, groups: CategoryGroup[]) {
		this.root = root
		this.groups = groups
	}

	public render(): void {
		this.root.innerHTML = `
      <main class="app" aria-label="Billy bill tracker">
        <header class="hero">
          <div class="hero-title">
            <span class="hero-emoji" aria-hidden="true">💸</span>
            <div>
              <p class="hero-kicker">Billy</p>
              <h1>Monthly Bill Tracker</h1>
            </div>
          </div>
          <div class="hero-total">
			<span class="hero-total-label">Monthly Expenses</span>
            <strong class="hero-total-value">${this.formatCurrency(this.getTotal())}</strong>
          </div>
        </header>

        <section class="panel" aria-label="Bill overview">
          <div class="panel-header">
            <h2>Bill overview</h2>
          </div>
          <div class="group-grid">
            ${this.groups.map((group) => this.renderGroup(group)).join('')}
          </div>
        </section>
      </main>
			<div class="modal" data-modal aria-hidden="true">
				<div class="modal-backdrop" data-close></div>
				<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
					<header class="modal-header">
						<h2 id="modal-title">Add a bill</h2>
						<button class="modal-close" type="button" data-close aria-label="Close">✕</button>
					</header>
					<form class="modal-form" data-form>
						<label>
							Bill name
							<input name="name" type="text" placeholder="e.g. Streaming bundle" required />
						</label>
						<label>
							Base amount (₱)
							<input name="amount" type="number" min="0" step="0.01" placeholder="0.00" required />
						</label>
						<label>
							Category
							<input name="category" type="text" data-category readonly />
						</label>
						<label>
							Notes
							<textarea name="notes" rows="3" placeholder="Optional"></textarea>
						</label>
						<button class="modal-submit" type="submit">Save bill</button>
					</form>
				</div>
			</div>
    `

		// Lightweight click handler to confirm the add action.
		const modal = this.root.querySelector<HTMLDivElement>('[data-modal]')
		const modalCategory = this.root.querySelector<HTMLInputElement>('[data-category]')
		const modalForm = this.root.querySelector<HTMLFormElement>('[data-form]')

		const openModal = (label: string): void => {
			if (!modal || !modalCategory) return
			modalCategory.value = label
			modal.setAttribute('aria-hidden', 'false')
			modal.classList.add('is-open')
		}

		const closeModal = (): void => {
			if (!modal || !modalForm) return
			modalForm.reset()
			modal.setAttribute('aria-hidden', 'true')
			modal.classList.remove('is-open')
		}

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
			closeModal()
		})

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeModal()
			}
		})
	}

	private renderGroup(group: CategoryGroup): string {
		const total = group.items.reduce((sum, item) => sum + item.calculateMonthlyImpact(), 0)
		return `
      <article class="group-card">
        <header class="group-header">
					<div class="group-title">
						<h3>${group.label}</h3>
						<button class="add-button" type="button" data-group="${group.label}" aria-label="Add bill to ${group.label}">+</button>
					</div>
					<span>${this.formatCurrency(total)}</span>
        </header>
        <ul class="group-list">
          ${group.items
				.map(
					(item) => `
            <li>
              <div>
                <p class="bill-name">${item.getName()}</p>
                <p class="bill-note">Base ${this.formatCurrency(item.getBaseAmount())}</p>
              </div>
              <span class="bill-value">${this.formatCurrency(item.calculateMonthlyImpact())}</span>
            </li>
          `
				)
				.join('')}
        </ul>
      </article>
    `
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

const sampleGroups: CategoryGroup[] = [
	{
		label: 'Subscriptions',
		items: [
			new DigitalMedia('sub-1', 'Streaming bundle', 24, 'monthly', 4),
			new SoftwareLicense('sub-2', 'Design suite', 18, 'monthly', 36),
			new DigitalMedia('sub-3', 'Music family plan', 15, 'monthly', 5)
		]
	},
	{
		label: 'Utilities',
		items: [
			new MeteredUtility('util-1', 'Electricity', 42, 'kWh', 230, 0.18),
			new TieredUtility('util-2', 'Home internet', 55, 'GB', 500, 0.35, 620),
			new MeteredUtility('util-3', 'Water', 22, 'gallons', 3400, 0.005)
		]
	},
	{
		label: 'Debt repayments',
		items: [
			new CreditCard('debt-1', 'Everyday card', 20, 0.22, 1200, 0.04),
			new FixedLoan('debt-2', 'Auto loan', 6400, 0.08, 28)
		]
	}
]

const root = document.querySelector<HTMLDivElement>('#app')

if (root) {
	const ui = new BillTrackerUI(root, sampleGroups)
	ui.render()
}
