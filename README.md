# Billy | Bill Tracker

Billy is a simple monthly bill tracker that lets you add bills by category (Subscriptions, Utilities, Debts), see per-category totals, and view the overall monthly expense at a glance. Entries are created via a form, grouped in cards, and can be removed with a single click.

## UML Diagram

```mermaid
classDiagram
    class Bill {
        <<abstract>>
        - _id: string
        - _name: string
        - _amount: number
        + constructor(id: string, name: string, baseAmount: number)
        + get id(): string
        + set id(value: string)
        + get name(): string
        + set name(value: string)
        + get amount(): number
        + set amount(value: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class Subscription {
        <<abstract>>
        + constructor(id: string, name: string, baseAmount: number)
    }

    class EntertainmentSubscription {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class ProductivitySubscription {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class Utility {
        <<abstract>>
        + constructor(id: string, name: string, baseAmount: number)
    }

    class EssentialUtility {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class NonEssentialUtility {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class Debts {
        <<abstract>>
        + constructor(id: string, name: string, baseAmount: number)
    }

    class OneTimeDebt {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class RecurringDebt {
        + constructor(id: string, name: string, baseAmount: number)
        + monthlyImpact(): number
        + priority(): number
    }

    class CategoryGroup {
        <<type>>
        + label: string
        + items: Bill[]
    }

    class BillManager {
        - groups: CategoryGroup[]
        + constructor(groups: CategoryGroup[])
        + getGroups(): CategoryGroup[]
        + createBill(category: string, billType: string, id: string, name: string, amount: number): Bill
        + addToGroup(label: string, bill: Bill): void
        + removeFromGroup(label: string, billId: string): void
        + getTotal(): number
        + getBillTypeLabel(bill: Bill): string
    }

    class TrackerUI {
        - _root: HTMLDivElement
        - _manager: BillManager
        - _isBound: boolean
        + constructor(root: HTMLDivElement, manager: BillManager)
        + render(): void
        - bindEvents(): void
        - updateTotals(): void
        - renderGroups(): void
        - newId(prefix: string): string
        - money(value: number): string
    }

    Bill <|-- Subscription
    Subscription <|-- EntertainmentSubscription
    Subscription <|-- ProductivitySubscription

    Bill <|-- Utility
    Utility <|-- EssentialUtility
    Utility <|-- NonEssentialUtility

    Bill <|-- Debts
    Debts <|-- OneTimeDebt
    Debts <|-- RecurringDebt

    CategoryGroup "1" --> "*" Bill
    BillManager "1" --> "*" CategoryGroup
    TrackerUI --> BillManager
```
