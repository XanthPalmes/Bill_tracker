import "./style.css";

abstract class Bill {
  //* Private fields
  private _id: string;
  private _name: string;
  private _amount: number;

  constructor(id: string, name: string, baseAmount: number) {
    this._id = id;
    this._name = name;
    this._amount = baseAmount;
  }

  //* Basic getters and setters
  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get amount(): number {
    return this._amount;
  }

  public set amount(value: number) {
    this._amount = value;
  }

  //* Abstract methods
  public abstract monthlyImpact(): number;

  public abstract priority(): number;
}

//* Subscription classes
abstract class Subscription extends Bill {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }
}

class EntertainmentSubscription extends Subscription {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 2;
  }
}

class ProductivitySubscription extends Subscription {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 3;
  }
}

//* Utility classes
abstract class Utility extends Bill {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }
}

class EssentialUtility extends Utility {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 5;
  }
}

class NonEssentialUtility extends Utility {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 1;
  }
}

//* Debt classes
abstract class Debts extends Bill {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }
}

class OneTimeDebt extends Debts {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 4;
  }
}

class RecurringDebt extends Debts {
  constructor(id: string, name: string, baseAmount: number) {
    super(id, name, baseAmount);
  }

  public monthlyImpact(): number {
    return this.amount;
  }

  public priority(): number {
    return 5;
  }
}

type CategoryGroup = {
  label: string;
  items: Bill[];
};

//* Manager class
class BillManager {
  //* Private fields
  private groups: CategoryGroup[];

  constructor(groups: CategoryGroup[]) {
    this.groups = groups;
  }

  //* Public methods
  public getGroups(): CategoryGroup[] {
    return this.groups;
  }

  //* Methods
  public createBill(
    category: string,
    billType: string,
    id: string,
    name: string,
    amount: number,
  ): Bill {
    if (category === "Subscriptions") {
      return billType === "ProductivitySubscription"
        ? new ProductivitySubscription(id, name, amount)
        : new EntertainmentSubscription(id, name, amount);
    }

    if (category === "Utilities") {
      return billType === "NonEssentialUtility"
        ? new NonEssentialUtility(id, name, amount)
        : new EssentialUtility(id, name, amount);
    }

    if (category === "Debts") {
      return billType === "RecurringDebt"
        ? new RecurringDebt(id, name, amount)
        : new OneTimeDebt(id, name, amount);
    }

    return new EntertainmentSubscription(id, name, amount);
  }

  public addToGroup(label: string, bill: Bill): void {
    const group = this.groups.find((item) => item.label === label);
    if (!group) return;
    group.items.push(bill);
  }

  public removeFromGroup(label: string, billId: string): void {
    const group = this.groups.find((item) => item.label === label);
    if (!group) return;
    group.items = group.items.filter((item) => item.id !== billId);
  }

  public getTotal(): number {
    return this.groups
      .flatMap((group) => group.items)
      .reduce((sum, item) => sum + item.monthlyImpact(), 0);
  }

  public getBillTypeLabel(bill: Bill): string {
    switch (bill.constructor.name) {
      case "EntertainmentSubscription":
        return "Entertainment";
      case "ProductivitySubscription":
        return "Productivity";
      case "EssentialUtility":
        return "Essential";
      case "NonEssentialUtility":
        return "Non-essential";
      case "OneTimeDebt":
        return "One-time";
      case "RecurringDebt":
        return "Recurring";
      default:
        return bill.constructor.name.replace("Bill", "");
    }
  }
}

//* UI class
class TrackerUI {
  //* Private fields
  private _root: HTMLDivElement;
  private _manager: BillManager;
  private _isBound = false;
  private _formCategory: HTMLSelectElement | null;
  private _formType: HTMLSelectElement | null;
  private _formTypeField: HTMLElement | null;
  private _formEl: HTMLFormElement | null;

  constructor(root: HTMLDivElement, manager: BillManager) {
    this._root = root;
    this._manager = manager;
    this._formCategory =
      this._root.querySelector<HTMLSelectElement>("[data-category]");
    this._formType = this._root.querySelector<HTMLSelectElement>("[data-type]");
    this._formTypeField =
      this._root.querySelector<HTMLElement>("[data-type-field]");
    this._formEl = this._root.querySelector<HTMLFormElement>("[data-form]");
    this.bindEvents();
  }

  //* Public methods
  public render(): void {
    this.updateTotals();
    this.renderGroups();
  }

  //* Private methods
  private bindEvents(): void {
    if (this._isBound) return;

    this._formCategory?.addEventListener("change", this.onCategoryChange);

    this._root
      .querySelectorAll<HTMLUListElement>("[data-group-list]")
      .forEach((listEl) => {
        listEl.addEventListener("click", this.onListClick);
      });

    this._formEl?.addEventListener("submit", this.onFormSubmit);

    this.syncTypeOptions("");

    this._isBound = true;
  }

  private onCategoryChange = (): void => {
    if (!this._formCategory) return;
    this.syncTypeOptions(this._formCategory.value);
  };

  private onListClick = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    const deleteButton = target?.closest<HTMLButtonElement>("[data-delete-id]");
    if (!deleteButton) return;
    const billId = deleteButton.getAttribute("data-delete-id");
    const groupLabel = deleteButton.getAttribute("data-group");
    if (!billId || !groupLabel) return;
    this._manager.removeFromGroup(groupLabel, billId);
    this.render();
  };

  private onFormSubmit = (event: Event): void => {
    event.preventDefault();
    if (!this._formEl) return;
    const formData = new FormData(this._formEl);
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const billType = String(formData.get("billType") ?? "").trim();
    const amountValue = Number(formData.get("amount"));

    if (!name || !category || !billType || Number.isNaN(amountValue)) {
      return;
    }

    const bill = this._manager.createBill(
      category,
      billType,
      this.newId("bill"),
      name,
      amountValue,
    );
    this._manager.addToGroup(category, bill);
    this._formEl.reset();
    this.syncTypeOptions("");
    this.render();
  };

  private syncTypeOptions(category: string): void {
    if (!this._formType || !this._formTypeField) return;

    const hasCategory = category.length > 0;
    this._formTypeField.hidden = !hasCategory;

    Array.from(this._formType.options).forEach((option) => {
      const isMatch = option.dataset.category === category;
      option.hidden = !isMatch;
      option.disabled = !isMatch;
    });

    if (!hasCategory) {
      this._formType.value = "";
      return;
    }

    const firstMatchingType = Array.from(this._formType.options).find(
      (option) => option.dataset.category === category,
    );
    if (firstMatchingType) {
      this._formType.value = firstMatchingType.value;
    }
  }

  private updateTotals(): void {
    const totalValueEl = this._root.querySelector<HTMLElement>("[data-total]");
    if (!totalValueEl) return;
    totalValueEl.textContent = this.money(this._manager.getTotal());
  }

  private renderGroups(): void {
    this._root
      .querySelectorAll<HTMLElement>("[data-group-card]")
      .forEach((card) => {
        const label = card.getAttribute("data-group-card") ?? "";
        const totalEl = card.querySelector<HTMLElement>("[data-group-total]");
        const listEl =
          card.querySelector<HTMLUListElement>("[data-group-list]");
        if (!label || !totalEl || !listEl) return;
        const group = this._manager
          .getGroups()
          .find((item) => item.label === label);
        if (!group) return;
        const total = group.items.reduce(
          (sum, item) => sum + item.monthlyImpact(),
          0,
        );
        totalEl.textContent = this.money(total);
        listEl.replaceChildren();
        const sortedItems = [...group.items].sort(
          (a, b) => b.priority() - a.priority(),
        );
        sortedItems.forEach((item) => {
          const listItem = document.createElement("li");
          const billTypeLabel = this._manager.getBillTypeLabel(item);
          listItem.setAttribute("data-bill-type", billTypeLabel);
          const content = document.createElement("div");
          const name = document.createElement("p");
          name.className = "bill-name";
          name.textContent = item.name;
          content.appendChild(name);
          const note = document.createElement("p");
          note.className = "bill-note";
          note.textContent = billTypeLabel;
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

//* Initialization
const groups: CategoryGroup[] = [
  {
    label: "Subscriptions",
    items: [],
  },
  {
    label: "Utilities",
    items: [],
  },
  {
    label: "Debts",
    items: [],
  },
];

const root = document.querySelector<HTMLDivElement>("#app");

if (root) {
  const manager = new BillManager(groups);
  const ui = new TrackerUI(root, manager);
  ui.render();
}
