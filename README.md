# Bill_tracker
Se finals backup. a bill tracker

# 💸 Billy

**Billy** is a smart, comprehensive financial management tool designed to track, predict, and organize your monthly cash flow. Going beyond simple budgeting, Billy categorizes your outgoings into recurring subscriptions, fluctuating utilities, and debt repayments, applying specialized mathematical logic to calculate the exact financial impact of each.

This project was built to demonstrate advanced, production-ready **Object-Oriented Programming (OOP)** principles in a strict TypeScript environment.

---

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Markup/Styling:** HTML5 & CSS3
* **Bundler:** Vite
* **Architecture:** Strictly Typed Object-Oriented Programming (OOP) / MVC Pattern

---

## 🎓 Object-Oriented Architecture 

This application features a robust class hierarchy designed to model real-world financial data, adhering strictly to the four pillars of OOP:

### 1. Abstraction & Encapsulation
* **Abstract Base Class:** The core `Expense` class acts as an abstract blueprint, defining standard properties (`id`, `name`, `baseAmount`) and enforcing the implementation of the `calculateMonthlyImpact()` method across all subclasses.
* **Encapsulation:** State mutation is strictly controlled. All class properties are `private` or `protected`, accessible only through explicitly defined `public` getter and setter methods to maintain data integrity.

### 2. Inheritance
The application expands upon standard requirements to feature a logical, multi-branch inheritance tree:
* **Parent Classes:** `RecurringSubscription`, `VariableUtility`, and `DebtRepayment` inherit from `Expense`, extending it with category-specific logic.
* **Child Classes:** Specialized classes such as `DigitalMedia`, `MeteredUtility`, and `CreditCard` inherit from their respective parents, ensuring DRY (Don't Repeat Yourself) code organization.

### 3. Polymorphism
* **Method Overriding:** The abstract method `calculateMonthlyImpact()` is uniquely overridden in every single child class. 
  * *Example:* A `CreditCard` calculates compound interest based on minimum payments, a `MeteredUtility` multiplies usage by per-unit rates, and a `DigitalMedia` subscription divides flat costs among shared users.

### 4. Separation of Concerns
* **Business Logic vs. UI:** The core mathematical models are entirely decoupled from HTML DOM manipulation. A dedicated UI controller handles event listeners and rendering, ensuring the business logic remains modular and testable.

---

## 📊 UML Architecture Diagram

Below is the Unified Modeling Language (UML) diagram representing the system's class hierarchy.

```mermaid
classDiagram
    class Expense {
        <<abstract>>
        - id: string
        - name: string
        - baseAmount: number
        + getId(): string
        + getName(): string
        + getBaseAmount(): number
        + calculateMonthlyImpact()* number
    }

    %% Parent Classes
    class RecurringSubscription {
        <<abstract>>
        - billingCycle: string
        + getBillingCycle(): string
    }

    class VariableUtility {
        <<abstract>>
        - usageUnitLabel: string
        + getUsageUnitLabel(): string
    }

    class DebtRepayment {
        <<abstract>>
        - interestRate: number
        + getInterestRate(): number
    }

    %% Subscription Children
    class DigitalMedia {
        - familyMembersShared: number
        + calculateMonthlyImpact(): number
    }
    class SoftwareLicense {
        - annualRenewalFee: number
        + calculateMonthlyImpact(): number
    }
    class PhysicalDelivery {
        - shippingCost: number
        + calculateMonthlyImpact(): number
    }
    class Membership {
        - cancellationFee: number
        + calculateMonthlyImpact(): number
    }

    %% Utility Children
    class MeteredUtility {
        - unitsUsed: number
        - costPerUnit: number
        + calculateMonthlyImpact(): number
    }
    class TieredUtility {
        - dataCap: number
        - overagePenalty: number
        + calculateMonthlyImpact(): number
    }

    %% Debt Children
    class CreditCard {
        - currentBalance: number
        - minimumPaymentPercent: number
        + calculateMonthlyImpact(): number
    }
    class FixedLoan {
        - remainingTermMonths: number
        + calculateMonthlyImpact(): number
    }

    %% Relationships
    Expense <|-- RecurringSubscription
    Expense <|-- VariableUtility
    Expense <|-- DebtRepayment

    RecurringSubscription <|-- DigitalMedia
    RecurringSubscription <|-- SoftwareLicense
    RecurringSubscription <|-- PhysicalDelivery
    RecurringSubscription <|-- Membership

    VariableUtility <|-- MeteredUtility
    VariableUtility <|-- TieredUtility

    DebtRepayment <|-- CreditCard
    DebtRepayment <|-- FixedLoan