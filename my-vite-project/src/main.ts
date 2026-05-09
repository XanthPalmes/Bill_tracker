import "./style.css";

abstract class Bill {
  private _id: string;
  private _name: string;
  private _amount: number;

  constructor(id: string, name: string, baseAmount: number) {
    this._id = id;
    this.validateName(name);
    this.validateAmount(baseAmount);
    this._name = name;
    this._amount = baseAmount;
  }

  public get id(): string { 
    return this._id; 
  }

  public get name(): string { 
    return this._name; 
  }

  public get amount(): number { 
    return this._amount; 
  }

  public update(name: string, amount: number): void {
    this.validateName(name);
    this.validateAmount(amount);
    this._name = name;
    this._amount = amount;
  }

  public isValid(): boolean {
    try {
      this.validateName(this._name);
      this.validateAmount(this._amount);
      return true;
    } catch {
      return false;
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required");
    }
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
  }

  public abstract monthlyImpact(): number;
  public abstract priority(): number;
  public abstract getBillTypeLabel(): string;
}

// NOTE: Subscriptions
abstract class Subscription extends Bill {  
  private _cycle: "monthly" | "annual";

  constructor(id: string, name: string, amount: number, cycle: "monthly" | "annual") {
    super(id, name, amount);
    this._cycle = cycle;
  }
  
  public get cycle(): "monthly" | "annual" { 
    return this._cycle; 
  }

  public changeCycle(newCycle: "monthly" | "annual"): void {
    this._cycle = newCycle;
  }

  public switchToAnnual(): void {
    this.changeCycle("annual");
  }

  public switchToMonthly(): void {
    this.changeCycle("monthly");
  }

  public monthlyImpact(): number {
    return this.cycle === "annual" ? this.amount / 12 : this.amount;
  }
}

class EntertainmentSubscription extends Subscription {
  public priority(): number { 
    return 2; 
  }

  public getBillTypeLabel(): string { 
    return "Entertainment"; 
  }
}

class ProductivitySubscription extends Subscription {
  public priority(): number { 
    return 3; 
  }

  public getBillTypeLabel(): string { 
    return "Productivity"; 
  }
}

// NOTE: Utilities
abstract class Utility extends Bill {
  private _isEstimated: boolean;

  constructor(id: string, name: string, amount: number, isEstimated: boolean = false) {
    super(id, name, amount);
    this._isEstimated = isEstimated;
  }

  public get isEstimated(): boolean { 
    return this._isEstimated; 
  }

  public getEstimatedBuffer(): number {
    return this._isEstimated ? this.amount * 0.1 : 0;
  }

  public monthlyImpact(): number {
    return this._isEstimated ? this.amount * 1.1 : this.amount;
  }
}

class EssentialUtility extends Utility {
  public priority(): number { 
    return 5; 
  }

  public getBillTypeLabel(): string { 
    return "Essential"; 
  }
}

class NonEssentialUtility extends Utility {
  public priority(): number { 
    return 1; 
  }

  public getBillTypeLabel(): string { 
    return "Non-essential"; 
  }
}

// NOTE: Debt
abstract class Debt extends Bill {
  private _interestRate: number;

  constructor(id: string, name: string, baseAmount: number, interestRate: number) {
    super(id, name, baseAmount);
    this.validateRate(interestRate);
    this._interestRate = interestRate;  
  }

  public get interestRate(): number { 
    return this._interestRate; 
  }

  public updateInterestRate(newRate: number): void {
    this.validateRate(newRate);
    this._interestRate = newRate;
  }

  public calculateTotalWithInterest(): number {
    return this.amount + (this.amount * this.interestRate / 100);
  }

  private validateRate(rate: number): void {
    if (rate < 0) {
      throw new Error("Interest rate cannot be negative");
    }
  }

  public monthlyImpact(): number {
    return this.amount + (this.amount * this.interestRate / 100);
  }
}

class OneTimeDebt extends Debt {
  public override monthlyImpact(): number {
    return this.amount;
  }
  
  public priority(): number { 
    return 4; 
  }

  public getBillTypeLabel(): string { 
    return "One-time"; 
  }
}

class RecurringDebt extends Debt {
  public priority(): number { 
    return 5; 
  }

  public getBillTypeLabel(): string { 
    return "Recurring"; 
  }
}

class CategoryGroup {
  public label: string;
  public items: Bill[] = [];

  constructor(label: string) {
    this.label = label;
  }

  public addBill(bill: Bill): void {
    this.items.push(bill);
  }

  public removeBill(billId: string): void {
    this.items = this.items.filter((item) => item.id !== billId);
  }

  public getTotalMonthlyImpact(): number {
    return this.items.reduce((sum, item) => sum + item.monthlyImpact(), 0);
  }

  public isOverBudget(budget: number): boolean {
    return this.getTotalMonthlyImpact() > budget;
  }

  public findDuplicate(name: string): Bill | null {
    const normalized = name.trim().toLowerCase();
    return this.items.find((item) => item.name.trim().toLowerCase() === normalized) ?? null;
  }
}

// NOTE: Manager class
class BillManager {
  private _groups: CategoryGroup[];
  private _totalBudget: number = 0;
  private _categoryBudgets: Record<string, number> = {
    "Subscriptions": 0,
    "Utilities": 0,
    "Debts": 0,
  };
  private _pendingBill: { bill: Bill; category: string; } | null = null;

  constructor(groups: CategoryGroup[]) {
    this._groups = groups;
  }

  public getGroups(): CategoryGroup[] { 
    return this._groups; 
  }

  public get totalBudget(): number {
    return this._totalBudget;
  }

  public getCategoryBudget(category: string): number {
    return this._categoryBudgets[category] || 0;
  }

  public createBill(
    billType: string, 
    id: string, 
    name: string, 
    amount: number, 
    billingCycle: "monthly" | "annual" = "monthly", 
    interestRate: number
  ): Bill {
    switch (billType) {
      case "ProductivitySubscription":
        return new ProductivitySubscription(id, name, amount, billingCycle);
      case "EntertainmentSubscription":
        return new EntertainmentSubscription(id, name, amount, billingCycle);
      case "EssentialUtility":
        return new EssentialUtility(id, name, amount);
      case "NonEssentialUtility":
        return new NonEssentialUtility(id, name, amount);
      case "OneTimeDebt":
        return new OneTimeDebt(id, name, amount, interestRate);
      case "RecurringDebt":
        return new RecurringDebt(id, name, amount, interestRate);
      default:
        throw new Error(`Unknown bill type: ${billType}`);
    }
  }

  public addToGroup(label: string, bill: Bill): void {
    const group = this._groups.find((item) => item.label === label);
    if (group) {
      group.items.push(bill);
    }
  }

  public removeFromGroup(label: string, billId: string): void {
    const group = this._groups.find((item) => item.label === label);
    if (group) {
      group.items = group.items.filter((item) => item.id !== billId);
    }
  }

  public getTotal(): number {
    return this._groups.reduce((sum, group) => sum + group.getTotalMonthlyImpact(), 0);
  }

  public findDuplicate(name: string): Bill | null {
    const normalized = name.trim().toLowerCase();
    return this._groups
      .flatMap((group) => group.items)
      .find((item) => item.name.trim().toLowerCase() === normalized) ?? null;    
  }

  public getPendingBill(): { bill: Bill; category: string; } | null {
    return this._pendingBill;
  }

  public setBudgets(total: number, subs: number, utils: number, debts: number): void {
    this._totalBudget = total;
    this._categoryBudgets["Subscriptions"] = subs;
    this._categoryBudgets["Utilities"] = utils;
    this._categoryBudgets["Debts"] = debts;
  }

  public setPendingBill(bill: Bill, category: string): void {
    this._pendingBill = { bill, category };
  }

  public clearPendingBill(): void {
    this._pendingBill = null;
  }

  public updateBill(existingBillId: string, newBill: Bill, targetCategory: string): void {
    for (const group of this._groups) {
      const index = group.items.findIndex((item) => item.id === existingBillId);
      if (index !== -1) {
        group.items.splice(index, 1);
        break;
      }
    }

    const targetGroup = this._groups.find((g) => g.label === targetCategory);
    if (targetGroup) {
      targetGroup.items.push(newBill);
    }
  }
}

interface HistoryEntry {
  name: string;
  category: string;
  amount: string;
  type: string;
}

class TrackerUI {
  private _root: HTMLDivElement;
  private _manager: BillManager;
  private _isBound = false;
  private _formCategory: HTMLSelectElement | null;
  private _formType: HTMLSelectElement | null;
  private _formTypeField: HTMLElement | null;
  private _formCycleField: HTMLElement | null;
  private _formEl: HTMLFormElement | null;
  private _formInterestRateField: HTMLElement | null;
  private _budgetFormEl: HTMLFormElement | null;
  private _budgetErrorEl: HTMLElement | null;
  private _totalBudgetEl: HTMLElement | null;
  private _remainingEl: HTMLElement | null;
  private _duplicateBillId: string | null = null;
  private _history: HistoryEntry[] = [];
  private _historyListEl: HTMLElement | null;
  private _clearHistoryBtn: HTMLButtonElement | null;

  constructor(root: HTMLDivElement, manager: BillManager) {
    this._root = root;
    this._manager = manager;
    this._formCategory = this._root.querySelector<HTMLSelectElement>("[data-category]");
    this._formType = this._root.querySelector<HTMLSelectElement>("[data-type]");
    this._formTypeField = this._root.querySelector<HTMLElement>("[data-type-field]");
    this._formCycleField = this._root.querySelector<HTMLElement>("[data-billing-cycle-field]");
    this._formEl = this._root.querySelector<HTMLFormElement>("[data-form]");
    this._formInterestRateField = this._root.querySelector<HTMLElement>("[data-interest-rate-field]");
    this._budgetFormEl = this._root.querySelector<HTMLFormElement>("[data-budget-form]");
    this._budgetErrorEl = this._root.querySelector<HTMLElement>("#budget-error");
    this._totalBudgetEl = this._root.querySelector<HTMLElement>("[data-total-budget]");
    this._remainingEl = this._root.querySelector<HTMLElement>("[data-remaining]");
    this._historyListEl = this._root.querySelector<HTMLElement>("[data-history-list]");
    this._clearHistoryBtn = this._root.querySelector<HTMLButtonElement>("[data-clear-history-btn]");
    this.bindEvents();
  }

  public render(): void {
    this.updateTotals();
    this.renderGroups();
    this.renderHistory();
  }

  private renderHistory(): void {
    if (!this._historyListEl) return;

    this._historyListEl.replaceChildren();

    if (this._history.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "history-empty";
      emptyItem.textContent = "No bills added yet";
      this._historyListEl.appendChild(emptyItem);
      return;
    }

    this._history.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.className = "history-item";
      listItem.innerHTML = `
        <div>
          <span class="history-item-name">${entry.name}</span>
          <div class="history-item-meta">${entry.type} in ${entry.category}</div>
        </div>
        <span class="history-item-amount">${entry.amount}</span>
      `;
      this._historyListEl?.appendChild(listItem);
    });
  }

  private bindEvents(): void {
    if (this._isBound) {
      return;
    }

    this._formCategory?.addEventListener("change", this.onCategoryChange);
    this._root.querySelectorAll<HTMLUListElement>("[data-group-list]").forEach((listEl) => {
      listEl.addEventListener("click", this.onListClick);
    });
    this._formEl?.addEventListener("submit", this.onFormSubmit);    
    this._budgetFormEl?.addEventListener("submit", this.onBudgetSubmit);
    this.syncTypeOptions("");
    this._isBound = true;

    document.getElementById("alert-cancel")?.addEventListener("click", () => {
      this._manager.clearPendingBill();
      this.hideDuplicateAlert();
    });

    document.getElementById("alert-add-anyway")?.addEventListener("click", () => {
      const pending = this._manager.getPendingBill();
      if (pending) {
        this._manager.addToGroup(pending.category, pending.bill);
        this._manager.clearPendingBill();
        this.hideDuplicateAlert();
        if (this._formEl) {
          this._formEl.reset();
          this.syncTypeOptions("");
        }
        this.render();
      }
    });
    
    document.querySelector(".alert-modal")?.addEventListener("click", (e) => {
      if (e.target === document.querySelector(".alert-modal")) {
        this._manager.clearPendingBill();
        this.hideDuplicateAlert();
      }
    });

    document.getElementById("alert-update")?.addEventListener("click", () => {
      const pending = this._manager.getPendingBill();
      if (pending && this._duplicateBillId) {
        this._manager.updateBill(this._duplicateBillId, pending.bill, pending.category);
        this._manager.clearPendingBill();
        this.hideDuplicateAlert();
        if (this._formEl) {
          this._formEl.reset();
          this.syncTypeOptions("");
        }
        this.render();
      }
    });

    this._clearHistoryBtn?.addEventListener("click", () => {
      this.clearHistory();
    });
  }

  private showDuplicateAlert(existingBill: Bill, newName: string): void {
    const modal = document.querySelector(".alert-modal") as HTMLElement;
    const textEl = document.querySelector(".alert-text") as HTMLElement;
  
    if (modal && textEl) {
      const existingType = existingBill.getBillTypeLabel();
      const existingAmount = this.money(existingBill.monthlyImpact());
      textEl.textContent = `A bill named "${existingBill.name}" already exists (${existingType} - ${existingAmount}/month). Do you still want to add "${newName}"?`;
      modal.classList.add("active");
    }
  }
  
  private hideDuplicateAlert(): void {
    const modal = document.querySelector(".alert-modal") as HTMLElement;
    if (modal) {
      modal.classList.remove("active");
    }
  }

  private clearHistory(): void {
    this._history = [];
    this.renderHistory();
  }

   private onBudgetSubmit = (event: Event): void => {
    event.preventDefault();
    if (!this._budgetFormEl) {
      return;
    }

    const formData = new FormData(this._budgetFormEl);
    const total = Number(formData.get("totalBudget"));
    const subs = Number(formData.get("subBudget"));
    const utils = Number(formData.get("utilBudget"));
    const debts = Number(formData.get("debtBudget"));

    if (subs + utils + debts > total) {
      if (this._budgetErrorEl)  { 
        this._budgetErrorEl.style.display = "block";
      }
      return;
    }

    if (this._budgetErrorEl) {
      this._budgetErrorEl.style.display = "none";
    }

    this._manager.setBudgets(total, subs, utils, debts);
    this.render();
  };

  private onCategoryChange = (): void => {
    if (this._formCategory) {
      this.syncTypeOptions(this._formCategory.value);
    }
  };

  private onListClick = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    const deleteButton = target?.closest<HTMLButtonElement>("[data-delete-id]");
    if (!deleteButton) {
      return;
    }

    const billId = deleteButton.getAttribute("data-delete-id");
    const groupLabel = deleteButton.getAttribute("data-group");
    if (billId && groupLabel) {
      this._manager.removeFromGroup(groupLabel, billId);
      this.render();
    }
  };

  private onFormSubmit = (event: Event): void => {
    event.preventDefault();
    if (!this._formEl) {
      return;
    }

    const formData = new FormData(this._formEl);
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const billType = String(formData.get("billType") ?? "").trim();
    const amountValue = Number(formData.get("amount"));
    const billingCycle = (formData.get("billingCycle") as "monthly" | "annual") ?? "monthly";
    const interestRate = Number(formData.get("interestRate"));

    if (!name || !category || !billType || Number.isNaN(amountValue)) {
      return;
    }
    
    const bill = this._manager.createBill(billType, this.newId("bill"), name, amountValue, billingCycle, interestRate);
    const duplicate = this._manager.findDuplicate(name);

    if (duplicate) {
      this._duplicateBillId = duplicate.id;
      this._manager.setPendingBill(bill, category);
      this.showDuplicateAlert(duplicate, name);
      return;
    }

    this._manager.addToGroup(category, bill);
    this._history.unshift({
      name: bill.name,
      category,
      amount: this.money(bill.monthlyImpact()),
      type: bill.getBillTypeLabel()
    });
    this._history = this._history.slice(0, 10);
    this.renderHistory();
    this._formEl.reset();
    this.syncTypeOptions("");
    this.render();
  };

  private syncTypeOptions(category: string): void {
    if (!this._formType || !this._formTypeField || !this._formCycleField || !this._formInterestRateField ) {
      return;
    }

    const hasCategory = category.length > 0;
    this._formTypeField.hidden = !hasCategory;
    this._formCycleField.hidden = category !== "Subscriptions";
    this._formInterestRateField.hidden = category !== "Debts";

    Array.from(this._formType.options).forEach((option) => {
      const isMatch = option.dataset.category === category;
      option.hidden = !isMatch;
      option.disabled = !isMatch;
    });

    if (!hasCategory) {
      this._formType.value = "";
    } else {
      const firstMatch = Array.from(this._formType.options).find((opt) => opt.dataset.category === category);
      if (firstMatch) {
        this._formType.value = firstMatch.value;
      }
    }
  }

  private updateTotals(): void {
    const totalValueEl = this._root.querySelector<HTMLElement>("[data-total]");
    const totalExp = this._manager.getTotal();
    const totalBudg = this._manager.totalBudget;
    const remaining = totalBudg - totalExp;

    if (totalValueEl) {
      totalValueEl.textContent = this.money(totalExp);
    } 
    if (this._totalBudgetEl) {
      this._totalBudgetEl.textContent = this.money(totalBudg);
    } 
    if (this._remainingEl) {
      this._remainingEl.textContent = this.money(remaining);
      
      if (remaining < 0) {
        this._remainingEl.style.color = remaining < 0 ? "#dc2626" : "inherit";
        this._remainingEl.style.fontWeight = remaining < 0 ? "700" : "500";
      }
    }
  }

  private renderGroups(): void {
    this._root
      .querySelectorAll<HTMLElement>("[data-group-card]")
      .forEach((card) => {
        const label = card.getAttribute("data-group-card") ?? "";
        const totalEl = card.querySelector<HTMLElement>("[data-group-total]");
        const listEl =
          card.querySelector<HTMLUListElement>("[data-group-list]");
        if (!label || !totalEl || !listEl) {
          return;
        }

        const group = this._manager
          .getGroups()
          .find((item) => item.label === label);
        if (!group) {
          return;
        }

        const total = group.getTotalMonthlyImpact();

        totalEl.textContent = this.money(total);

        const budgetVal = this._manager.getCategoryBudget(label);
        const budgetDisplayEl = card.querySelector<HTMLElement>(`[data-group-budget="${label}"]`);

        if (budgetDisplayEl) {
          budgetDisplayEl.textContent = this.money(budgetVal);

          if (total > budgetVal && budgetVal > 0) {
            budgetDisplayEl.style.color = "#dc2626";
            budgetDisplayEl.style.fontWeight = "bold";
          } else {
            budgetDisplayEl.style.color = "var(--muted)";
            budgetDisplayEl.style.fontWeight = "normal";
          }
        }

        listEl.replaceChildren();
        const sortedItems = [...group.items].sort(
          (a, b) => b.priority() - a.priority(),
        );
        sortedItems.forEach((item) => {
          const listItem = document.createElement("li");
          const billTypeLabel = item.getBillTypeLabel();
          let cycleIndicator = "";
          if (item instanceof Subscription) {
            cycleIndicator = ` (${item.cycle === "annual" ? "Annual" : "Monthly"})`;
          }
          listItem.setAttribute("data-bill-type", billTypeLabel);
          const content = document.createElement("div");
          const name = document.createElement("p");
          name.className = "bill-name";
          name.textContent = item.name;
          content.appendChild(name);
          const note = document.createElement("p");
          note.className = "bill-note";
          note.textContent = `${billTypeLabel}${cycleIndicator}`;
          content.appendChild(note);
          const value = document.createElement("span");
          value.className = "bill-value";
          value.textContent = this.money(item.monthlyImpact());
          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-button";
          deleteButton.type = "button";
          deleteButton.textContent = "Delete";
          deleteButton.setAttribute("aria-label", `Delete ${item.name}`);
          deleteButton.setAttribute("data-delete-id", item.id);
          deleteButton.setAttribute("data-group", group.label);
          listItem.append(content, value, deleteButton);
          listEl.appendChild(listItem);
        });
      });
  }

  private newId(prefix: string): string { 
    return `${prefix}-${crypto.randomUUID()}`; 
  }

  private money(value: number): string { 
    return `₱${value.toFixed(2)}`; 
  }
}

// NOTE: Initialization
const groups: CategoryGroup[] = [
  new CategoryGroup("Subscriptions"),
  new CategoryGroup("Utilities"),
  new CategoryGroup("Debts"),
];

const manager = new BillManager(groups);
new TrackerUI(document.querySelector<HTMLDivElement>("#app")!, manager).render();