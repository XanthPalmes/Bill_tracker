# index.html explanation

This file is the main HTML page for the bill tracker app.

It does not contain the app logic. It only sets up the page structure that the TypeScript file will control.

## Page setup

The file starts with the normal HTML document setup:

- `<!doctype html>` tells the browser this is an HTML5 page.
- `<html lang="en">` sets the page language to English.
- `<meta charset="UTF-8" />` allows special characters like `₱`.
- `<meta name="viewport"...>` makes the layout work better on mobile screens.
- `<title>` sets the browser tab name.

## Main app container

The main content is wrapped in:

`<main id="app" class="app-shell">`

This is important because the TypeScript code looks for `#app`.

Once TypeScript finds this element, it can attach behavior to the page.

## Hero section

The hero section contains the app title and the main monthly total.

It shows:

- the app name, `Billy`
- the heading, `Monthly Bill Tracker`
- the total monthly expenses

The total starts as:

`₱0.00`

The element has `data-total`, which works like a hook for TypeScript.

TypeScript later finds this element and replaces the text with the real total.

## Bill overview section

The overview section shows the three bill categories:

- Subscriptions
- Utilities
- Debts

Each category card has:

- a category title
- a category total
- an empty list

Example:

`data-group-card="Subscriptions"`

This tells TypeScript which card belongs to which bill group.

Each card also has:

`data-group-total`

This is where TypeScript displays the category total.

And:

`data-group-list`

This is where TypeScript inserts the bills added by the user.

At first, the lists are empty because no bills have been added yet.

## Add bill form

The form lets the user add a new bill.

It collects:

- bill name
- monthly cost
- category
- bill type

The form uses `data-form`, which TypeScript uses to listen for submissions.

## Name input

The name input stores the name of the bill.

Example values:

- Netflix
- Electricity
- Credit card

It is marked as `required`, so the user cannot submit the form without filling it in.

## Amount input

The amount input stores the monthly cost.

It uses:

- `type="number"` so the browser expects a number
- `min="0"` so negative values are not allowed
- `step="0.01"` so decimal values can be entered
- `required` so the field cannot be empty

## Category dropdown

The category dropdown lets the user choose the main group.

The choices are:

- Subscriptions
- Utilities
- Debts

This field has `data-category`.

TypeScript watches this field. When the user chooses a category, TypeScript updates the bill type dropdown.

## Bill type dropdown

The bill type field is hidden at first.

It only appears after the user selects a category.

Each bill type option has a `data-category` value.

That value tells TypeScript which category the option belongs to.

For example:

- `EntertainmentSubscription` belongs to `Subscriptions`
- `EssentialUtility` belongs to `Utilities`
- `RecurringDebt` belongs to `Debts`

When the user selects `Utilities`, TypeScript hides the subscription and debt options.

## Submit button

The button submits the form.

When clicked, TypeScript reads the form values, creates the correct bill object, adds it to the correct group, and updates the page.

## Script tag

At the bottom, this line loads the TypeScript app:

`<script type="module" src="/src/main.ts"></script>`

Vite handles this file during development and builds it for the browser.

## Summary

The HTML file provides the structure.

It creates:

- the app container
- the total display
- the category cards
- the form fields
- the data attributes used by TypeScript

The HTML does not calculate totals or store bills.

That work happens in `main.ts`.