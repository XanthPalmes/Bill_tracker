# main.ts explanation

This file contains the main logic for the bill tracker app.

It controls:

- bill classes
- bill categories
- bill creation
- totals
- sorting
- rendering
- form behavior
- delete behavior

The HTML gives the app a structure. This file makes that structure interactive.

## Importing the CSS

The file starts by importing `style.css`.

This lets Vite bundle the CSS with the app.

Without this import, the page would still work, but it would not have the intended styling.

## The Bill base class

The app uses an abstract class called `Bill`.

A `Bill` is the parent class for every kind of bill in the app.

It stores three shared pieces of data:

- `id`
- `name`
- `amount`

The ID is used to identify a bill, especially when deleting it.

The name is what the user typed into the form.

The amount is the monthly cost.

## Private fields

The fields use names like `_id`, `_name`, and `_amount`.

They are marked as `private`.

That means other code should not directly change them.

Instead, the code uses getters and setters.

This is an object-oriented programming idea called encapsulation.

It protects the data inside the class.

## Constructor

The constructor runs when a new bill object is created.

It receives:

- `id`
- `name`
- `baseAmount`

Then it stores those values inside the object.

`baseAmount` is the value passed into the constructor.

Inside the class, it is stored as `_amount`.

## Getters and setters

The class has getters and setters for:

- `id`
- `name`
- `amount`

A getter reads a value.

A setter updates a value.

Example:

`bill.name`

uses the getter.

`bill.name = "Netflix"`

uses the setter.

## Abstract methods

The `Bill` class has two abstract methods:

- `monthlyImpact()`
- `priority()`

An abstract method is a method that the parent class requires, but does not define.

Every child class must provide its own version.

`monthlyImpact()` tells the app how much the bill adds to the monthly total.

`priority()` tells the app how important the bill is when sorting.

Higher priority bills appear first.

## Subscription class

`Subscription` extends `Bill`.

That means a subscription is a type of bill.

It does not add new behavior yet, but it helps group subscription-related classes.

This is useful because the app has different subscription types.

## EntertainmentSubscription

`EntertainmentSubscription` is a specific kind of subscription.

It represents bills like:

- Netflix
- Spotify
- Disney+

Its `monthlyImpact()` returns the bill amount.

Its `priority()` returns `2`.

This means it is important, but not as important as productivity subscriptions.

## ProductivitySubscription

`ProductivitySubscription` is another specific kind of subscription.

It represents bills like:

- Google Workspace
- Notion
- GitHub
- Canva

Its `monthlyImpact()` also returns the bill amount.

Its `priority()` returns `3`.

That means productivity subscriptions appear before entertainment subscriptions.

## Utility class

`Utility` extends `Bill`.

It represents bills related to services or utilities.

Like `Subscription`, it does not add new logic by itself.

It acts as a parent for utility bill types.

## EssentialUtility

`EssentialUtility` represents important utilities.

Examples:

- electricity
- water
- internet

Its `monthlyImpact()` returns the amount.

Its `priority()` returns `5`.

This makes it one of the highest priority bill types.

## NonEssentialUtility

`NonEssentialUtility` represents less critical utilities.

Examples:

- extra service plans
- optional household services

Its `monthlyImpact()` returns the amount.

Its `priority()` returns `1`.

This means it appears lower in the list.

## Debts class

`Debts` extends `Bill`.

It groups debt-related bill types.

The name is plural, but it is being used as a parent class for debt bills.

A cleaner class name would be `Debt`, but the current code uses `Debts`.

## OneTimeDebt

`OneTimeDebt` represents a debt paid once.

Its `monthlyImpact()` returns the amount.

Its `priority()` returns `4`.

This means it is more important than subscriptions, but lower than recurring debt.

## RecurringDebt

`RecurringDebt` represents debt that repeats monthly.

Examples:

- loan payment
- installment payment
- credit card payment plan

Its `monthlyImpact()` returns the amount.

Its `priority()` returns `5`.

This puts it near the top of the list.

## CategoryGroup type

`CategoryGroup` defines the shape of each category.

Each group has:

- `label`
- `items`

`label` is the group name.

Example:

`Subscriptions`

`items` is the list of bills inside that group.

Example:

A Subscriptions group may contain Netflix, Spotify, and Canva.

## BillManager class

`BillManager` controls the app data.

It is responsible for managing the bill groups.

It does not directly handle HTML.

Its job is data and bill logic.

## groups property

`BillManager` stores a private `groups` array.

This array contains all category groups:

- Subscriptions
- Utilities
- Debts

Each group starts with an empty `items` array.

## getGroups()

`getGroups()` returns all the groups.

The UI uses this method when it needs to render the page.

This keeps the UI from directly touching the private `groups` property.

## createBill()

`createBill()` is the method that decides which class to use.

It receives:

- category
- billType
- id
- name
- amount

Then it creates the correct bill object.

For example:

If the category is `Subscriptions` and the bill type is `ProductivitySubscription`, it creates a `ProductivitySubscription`.

If the category is `Utilities` and the bill type is `EssentialUtility`, it creates an `EssentialUtility`.

This method works like a simple factory.

A factory is code that creates objects for us.

## addToGroup()

`addToGroup()` adds a bill to the correct category.

It finds the group by its label.

Then it pushes the new bill into that group’s `items` array.

Example:

If the label is `Subscriptions`, the bill is added to the Subscriptions group.

## removeFromGroup()

`removeFromGroup()` deletes a bill from a group.

It receives:

- the group label
- the bill ID

It finds the matching group.

Then it filters out the bill with that ID.

This creates a new list that contains every bill except the deleted one.

## getTotal()

`getTotal()` calculates the total monthly expenses.

It does this in three steps:

1. Get all groups
2. Combine all bills into one list
3. Add each bill’s monthly impact

It uses `monthlyImpact()` instead of directly using `amount`.

That is good design because some bill types could later calculate monthly impact differently.

For example, a future credit card bill could include interest.

## getBillTypeLabel()

`getBillTypeLabel()` turns class names into readable labels.

Example:

`EntertainmentSubscription`

becomes:

`Entertainment`

This method is used when rendering the bill list.

It prevents ugly class names from showing in the UI.

## TrackerUI class

`TrackerUI` controls the page.

It connects the data from `BillManager` to the HTML.

This class handles:

- reading form values
- updating totals
- showing bills
- deleting bills
- changing bill type options based on category

## root property

`_root` stores the main app element from `index.html`.

This is the element with:

`id="app"`

All DOM searches happen inside this root element.

That keeps the UI code focused on this app only.

## manager property

`_manager` stores the `BillManager`.

The UI asks the manager for data and tells it when to add or remove bills.

## isBound property

`_isBound` prevents event listeners from being added more than once.

Without this, the same click or submit event could accidentally run multiple times.

Tiny bug prevention. Good stuff.

## TrackerUI constructor

The constructor receives:

- the root HTML element
- the bill manager

It stores both.

Then it calls `bindEvents()`.

That connects the form and delete buttons to the app behavior.

## render()

`render()` refreshes the visible app.

It calls:

- `updateTotals()`
- `renderGroups()`

This keeps rendering simple.

One method updates totals.

The other updates the category cards.

## bindEvents()

`bindEvents()` attaches event listeners.

An event listener waits for something to happen.

Examples:

- user changes category
- user submits form
- user clicks delete

This method is where the page becomes interactive.

## Category change behavior

When the category dropdown changes, the app updates the bill type dropdown.

If the user selects `Subscriptions`, only subscription types are shown.

If the user selects `Utilities`, only utility types are shown.

If the user selects `Debts`, only debt types are shown.

This prevents the user from selecting mismatched options.

For example, it prevents choosing `RecurringDebt` under `Subscriptions`.

## syncTypeOptions()

`syncTypeOptions()` handles the bill type dropdown.

It checks the selected category.

Then it hides and disables type options that do not belong to that category.

If no category is selected, the type field stays hidden.

If a category is selected, the first matching type is automatically selected.

## Delete behavior

The app listens for clicks inside each bill list.

When the user clicks a delete button, the app reads:

- the bill ID
- the group label

Then it calls `removeFromGroup()`.

After deleting, it calls `render()` again.

That refreshes the page.

## Form submit behavior

When the form is submitted, the app prevents the browser from refreshing the page.

Then it reads the form data:

- name
- category
- bill type
- amount

It validates the values.

If anything important is missing, it stops.

If the data is valid, it creates a new bill.

Then it adds the bill to the correct group.

After that, it resets the form and re-renders the page.

## updateTotals()

`updateTotals()` updates the main monthly total.

It finds the element with `data-total`.

Then it sets the text to the result of `BillManager.getTotal()`.

The number is formatted using the `money()` helper.

## renderGroups()

`renderGroups()` updates each category card.

For every group card, it:

1. Finds the matching data group
2. Calculates that group’s total
3. Clears the old list
4. Sorts the bills by priority
5. Creates new list items
6. Adds delete buttons

This is the main display method.

## Sorting by priority

Bills are sorted using this idea:

Higher priority comes first.

Example order:

- Essential utilities
- Recurring debts
- One-time debts
- Productivity subscriptions
- Entertainment subscriptions
- Non-essential utilities

This helps important bills appear first.

## Creating bill list items

For each bill, the UI creates new HTML elements using JavaScript.

It creates:

- a list item
- a bill name
- a bill type note
- a formatted amount
- a delete button

This is called DOM manipulation.

The app does not use hardcoded HTML for each bill.

It builds the bill list dynamically based on the data.

## newId()

`newId()` creates a unique ID for each bill.

It uses:

`crypto.randomUUID()`

This helps make sure each bill has a different ID.

The delete feature depends on this ID.

## money()

`money()` formats a number as Philippine pesos.

Example:

`1500`

becomes:

`₱1500.00`

It always uses two decimal places.

## App startup

At the bottom of the file, the app creates the starting groups:

- Subscriptions
- Utilities
- Debts

Each group starts empty.

Then it looks for the `#app` element in the HTML.

If the app element exists:

1. It creates a `BillManager`
2. It creates a `TrackerUI`
3. It calls `render()`

That starts the app.

## Summary

`main.ts` is the brain of the app.

It defines the bill types, stores the data, handles user actions, and updates the HTML.

The main flow is:

1. User fills out the form
2. TypeScript reads the form
3. A bill object is created
4. The bill is added to a group
5. Totals are recalculated
6. The page updates