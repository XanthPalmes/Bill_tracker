import "./style.css";

abstract class Bill {
  private _id: string;
  private _name: string;
  private _amount: number;

  constructor(id: string, name: string, baseAmount: number) {
    this._id = id;
    this._name = name.trim();
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

  public static generateId(prefix = "bill"): string {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  public abstract monthlyImpact(): number;
  public abstract priority(): number;
  public abstract getBillTypeLabel(): string;
}

abstract class Subscription extends Bill {  
  private _cycle: "monthly" | "annual";

  constructor(id: string, name: string, amount: number, cycle: "monthly" | "annual") {
    super(id, name, amount);
    this._cycle = cycle;
  }
  
  public get cycle(): "monthly" | "annual" { 
    return this._cycle; 
  }

  public monthlyImpact(): number {
    return this._cycle === "annual" ? this.amount / 12 : this.amount;
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

abstract class Utility extends Bill {
  private _isEstimated: boolean;

  constructor(id: string, name: string, amount: number, isEstimated: boolean = false) {
    super(id, name, amount);
    this._isEstimated = isEstimated;
  }

  public get isEstimated(): boolean { 
    return this._isEstimated; 
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

abstract class Debt extends Bill {
  private _interestRate: number;

  constructor(id: string, name: string, baseAmount: number, interestRate: number) {
    super(id, name, baseAmount);
    this._interestRate = interestRate;
  }

  public get interestRate(): number { 
    return this._interestRate; 
  }

  public monthlyImpact(): number {
    return this.amount + (this.amount * this._interestRate / 100);
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

  public get totalMonthlyImpact(): number {
    return this.items.reduce((sum, item) => sum + item.monthlyImpact(), 0);
  }
}

interface BudgetPlan {
  total: number;
  subscriptions: number;
  utilities: number;
  debts: number;
}

class BillManager {
  private _groups: CategoryGroup[];
  private _budgetPlan: BudgetPlan = {
    total: 0,
    subscriptions: 0,
    utilities: 0,
    debts: 0,
  };

  constructor(groups: CategoryGroup[]) {
    this._groups = groups;
  }

  public getGroups(): CategoryGroup[] { 
    return this._groups; 
  }

  public get totalBudget(): number {
    return this._budgetPlan.total;
  }

  public getCategoryBudget(category: string): number {
    switch (category) {
      case "Subscriptions": return this._budgetPlan.subscriptions;
      case "Utilities": return this._budgetPlan.utilities;
      case "Debts": return this._budgetPlan.debts;
      default: return 0;
    }
  }

  public createBill(
    billType: string, 
    id: string, 
    name: string, 
    amount: number, 
    interestRate: number
  ): Bill {
    switch (billType) {
      case "ProductivitySubscription":
        return new ProductivitySubscription(id, name, amount, "monthly");
      case "EntertainmentSubscription":
        return new EntertainmentSubscription(id, name, amount, "monthly");
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

  public get total(): number {
    return this._groups.reduce((sum, group) => sum + group.totalMonthlyImpact, 0);
  }

  public findDuplicate(name: string): Bill | null {
    const normalized = name.trim().toLowerCase();
    return this._groups
      .flatMap((group) => group.items)
      .find((item) => item.name.trim().toLowerCase() === normalized) ?? null;    
  }

  public setBudgets(total: number, subs: number, utils: number, debts: number): void {
    this._budgetPlan = { total, subscriptions: subs, utilities: utils, debts };
  }

  public validateBudgetAllocation(total: number, subs: number, utils: number, debts: number): boolean {
    return subs + utils + debts <= total;
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
  private _pendingBill: Bill | null = null;
  private _pendingCategory: string = "";

  public get pendingBill(): Bill | null {
    return this._pendingBill;
  }

  private set pendingBill(bill: Bill | null) {
    this._pendingBill = bill;
  }

  public get pendingCategory(): string {
    return this._pendingCategory;
  }

  public set pendingCategory(category: string) {
    this._pendingCategory = category;
  }

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
      this.clearPendingBill();
      this.hideDuplicateAlert();
    });

    document.getElementById("alert-add-anyway")?.addEventListener("click", () => {
      const bill = this.pendingBill;
      if (bill) {
        this._manager.addToGroup(this.pendingCategory, bill);
        this.clearPendingBill();
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
        this.clearPendingBill();
        this.hideDuplicateAlert();
      }
    });

    document.getElementById("alert-update")?.addEventListener("click", () => {
      const bill = this.pendingBill;
      if (bill && this._duplicateBillId) {
        this.updateBillInGroup(this._duplicateBillId, bill, this.pendingCategory);
        this.clearPendingBill();
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

  public clearPendingBill(): void {
    this.pendingBill = null;
    this.pendingCategory = "";
  }

  private updateBillInGroup(existingBillId: string, newBill: Bill, targetCategory: string): void {
    for (const group of this._manager.getGroups()) {
      const index = group.items.findIndex((item) => item.id === existingBillId);
      if (index !== -1) {
        group.items.splice(index, 1);
        break;
      }
    }
    const targetGroup = this._manager.getGroups().find((g) => g.label === targetCategory);
    if (targetGroup) {
      targetGroup.items.push(newBill);
    }
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

    if (!this._manager.validateBudgetAllocation(total, subs, utils, debts)) {
      if (this._budgetErrorEl)  { 
        this._budgetErrorEl.style.display = "block";
      }
      return;
    }

    if (this._budgetErrorEl) {
      this._budgetErrorEl.style.display = "none";
    }

    this._manager.setBudgets(total, subs, utils, debts);
    this._budgetFormEl.reset();
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
    const interestRate = Number(formData.get("interestRate"));

    if (!name || !category || !billType || Number.isNaN(amountValue)) {
      return;
    }
    
    const bill = this._manager.createBill(billType, Bill.generateId(), name, amountValue, interestRate);
    const duplicate = this._manager.findDuplicate(name);

    if (duplicate) {
      this._duplicateBillId = duplicate.id;
      this.pendingBill = bill;
      this.pendingCategory = category;
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
    const totalExp = this._manager.total;
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

        const total = group.totalMonthlyImpact;

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

  private money(value: number): string { 
    return `₱${value.toFixed(2)}`; 
  }
}

const groups: CategoryGroup[] = [
  new CategoryGroup("Subscriptions"),
  new CategoryGroup("Utilities"),
  new CategoryGroup("Debts"),
];

const manager = new BillManager(groups);
new TrackerUI(document.querySelector<HTMLDivElement>("#app")!, manager).render();