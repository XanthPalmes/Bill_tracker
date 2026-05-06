# Billy | Bill Tracker

Billy is a simple monthly bill tracker that lets you add bills by category (Subscriptions, Utilities, Debts), see per-category totals, and view the overall monthly expense at a glance. Entries are created via a form, grouped in cards, and can be removed with a single click.

## UML Diagram

```mermaid
classDiagram
    class Bill {
      -string _id
      -string _name
      -number _amount
      +id() string
      +setId(id: string) void
      +name() string
      +setName(name: string) void
      +amount() number
      +setAmount(amount: number) void
      +monthlyImpact() number
    }

    class Subscription
    class EntertainmentSubscription
    class ProductivitySubscription

    class Utility
    class EssentialUtility
    class NonEssentialUtility

    class Debts
    class OneTimeDebt
    class RecurringDebt

    class BillManager {
      -CategoryGroup[] groups
      +getGroups() CategoryGroup[]
      +createBill(category: string, billType: string, id: string, name: string, amount: number) Bill
      +addToGroup(label: string, bill: Bill) void
      +removeFromGroup(label: string, billId: string) void
      +getTotal() number
      +getBillTypeLabel(bill: Bill) string
    }

    class TrackerUI {
      -HTMLDivElement _root
      -BillManager _manager
      -boolean _isBound
      +render() void
    }

    class CategoryGroup {
      +string label
      +Bill[] items
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

    BillManager o-- CategoryGroup
    CategoryGroup o-- Bill
    TrackerUI --> BillManager
```
