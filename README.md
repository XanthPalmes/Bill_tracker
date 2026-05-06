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
    }

    class EntertainmentSubscription {
        + monthlyImpact(): number
        + priority(): number
    }

    class ProductivitySubscription {
        + monthlyImpact(): number
        + priority(): number
    }

    class Utility {
        <<abstract>>
    }

    class EssentialUtility {
        + monthlyImpact(): number
        + priority(): number
    }

    class NonEssentialUtility {
        + monthlyImpact(): number
        + priority(): number
    }

    class Debts {
        <<abstract>>
    }

    class OneTimeDebt {
        + monthlyImpact(): number
        + priority(): number
    }

    class RecurringDebt {
        + monthlyImpact(): number
        + priority(): number
    }

    class CategoryGroup {
        + key: string
        + title: string
        + bills: Bill[]
    }

    class BillManager {
        - groups: CategoryGroup[]
        + getGroups(): CategoryGroup[]
        + createBill(category: string, type: string, id: string, name: string, amount: number): Bill
        + addToGroup(category: string, bill: Bill): void
        + removeFromGroup(category: string, id: string): void
        + getTotal(): number
        + getBillTypeLabel(bill: Bill): string
    }

    class TrackerUI {
        - _root: HTMLDivElement
        - _manager: BillManager
        - _isBound: boolean
        + render(): void
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
