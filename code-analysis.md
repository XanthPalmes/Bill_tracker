# Bill Tracker Code Analysis: main.ts

This document provides a comprehensive line-by-line analysis of the `main.ts` file, explaining the syntax and functionality of each line of code in the Bill Tracker application.

## File Overview

This TypeScript file implements a bill tracking application with the following key components:
- Abstract class hierarchy for different bill types (Bill, Subscription, Utility, Debt)
- Manager classes for organizing bills into categories
- UI class for handling DOM interactions and rendering
- Event handling for user interactions

---

## Line-by-Line Analysis

### 1. `import "./style.css";`
**Syntax**: ES6 import statement
**Functionality**: Imports the CSS file containing styles for the application. This ensures the styles are loaded when the JavaScript executes.

### 2. `abstract class Bill {`
**Syntax**: TypeScript class declaration with `abstract` modifier
**Functionality**: Defines an abstract base class for all bill types. Abstract classes cannot be instantiated directly and serve as blueprints for concrete implementations.

### 3. `private _id: string;`
**Syntax**: TypeScript private property declaration
**Functionality**: Declares a private instance variable to store the unique identifier for each bill. The underscore prefix is a naming convention for private properties.

### 4. `private _name: string;`
**Syntax**: TypeScript private property declaration
**Functionality**: Declares a private instance variable to store the bill name.

### 5. `private _amount: number;`
**Syntax**: TypeScript private property declaration
**Functionality**: Declares a private instance variable to store the bill amount as a number.

### 6. `constructor(id: string, name: string, baseAmount: number) {`
**Syntax**: TypeScript constructor method with typed parameters
**Functionality**: Defines the constructor that initializes new Bill instances. Takes three parameters: id, name, and baseAmount, all with explicit types.

### 7. `this._id = id;`
**Syntax**: Property assignment
**Functionality**: Assigns the constructor parameter `id` to the private `_id` property.

### 8. `this.validateName(name);`
**Syntax**: Method call
**Functionality**: Calls the validation method to ensure the name parameter is valid before storing it.

### 9. `this.validateAmount(baseAmount);`
**Syntax**: Method call
**Functionality**: Calls the validation method to ensure the amount parameter is valid before storing it.

### 10. `this._name = name;`
**Syntax**: Property assignment
**Functionality**: Assigns the validated name to the private `_name` property.

### 11. `this._amount = baseAmount;`
**Syntax**: Property assignment
**Functionality**: Assigns the validated amount to the private `_amount` property.

### 12. `public get id(): string {`
**Syntax**: TypeScript getter method
**Functionality**: Defines a public getter that returns the bill's ID. This provides read-only access to the private `_id` property.

### 13. `return this._id;`
**Syntax**: Return statement
**Functionality**: Returns the value of the private `_id` property.

### 14. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the getter method.

### 15. `public get name(): string {`
**Syntax**: TypeScript getter method
**Functionality**: Defines a public getter for the bill name.

### 16. `return this._name;`
**Syntax**: Return statement
**Functionality**: Returns the bill name.

### 17. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the name getter.

### 18. `public get amount(): number {`
**Syntax**: TypeScript getter method
**Functionality**: Defines a public getter for the bill amount.

### 19. `return this.amount;`
**Syntax**: Return statement
**Functionality**: Returns the bill amount.

### 20. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the amount getter.

### 21. `public update(name: string, amount: number): void {`
**Syntax**: Public method with typed parameters and void return type
**Functionality**: Defines a method to update both name and amount of an existing bill.

### 22. `this.validateName(name);`
**Syntax**: Method call
**Functionality**: Validates the new name before updating.

### 23. `this.validateAmount(amount);`
**Syntax**: Method call
**Functionality**: Validates the new amount before updating.

### 24. `this._name = name;`
**Syntax**: Property assignment
**Functionality**: Updates the name property.

### 25. `this._amount = amount;`
**Syntax**: Property assignment
**Functionality**: Updates the amount property.

### 26. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the update method.

### 27. `public isValid(): boolean {`
**Syntax**: Public method returning boolean
**Functionality**: Checks if the current bill instance is valid by testing its properties.

### 28. `try {`
**Syntax**: Try block for exception handling
**Functionality**: Begins a try-catch block to handle potential validation errors.

### 29. `this.validateName(this._name);`
**Syntax**: Method call
**Functionality**: Tests if the current name is valid.

### 30. `this.validateAmount(this._amount);`
**Syntax**: Method call
**Functionality**: Tests if the current amount is valid.

### 31. `return true;`
**Syntax**: Return statement
**Functionality**: Returns true if both validations pass.

### 32. `} catch {`
**Syntax**: Catch block
**Functionality**: Catches any validation errors thrown in the try block.

### 33. `return false;`
**Syntax**: Return statement
**Functionality**: Returns false if validation failed.

### 34. `}`
**Syntax**: Catch block closing brace
**Functionality**: Closes the catch block.

### 35. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the isValid method.

### 36. `private validateName(name: string): void {`
**Syntax**: Private method with void return type
**Functionality**: Validates that the name parameter is not empty or whitespace-only.

### 37. `if (!name || name.trim().length === 0) {`
**Syntax**: Conditional statement with logical operators
**Functionality**: Checks if name is falsy OR if trimmed name has zero length.

### 38. `throw new Error("Name is required");`
**Syntax**: Throw statement creating Error object
**Functionality**: Throws an exception if validation fails, preventing invalid bill creation.

### 39. `}`
**Syntax**: Conditional block closing brace
**Functionality**: Closes the if statement.

### 40. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the validateName method.

### 41. `private validateAmount(amount: number): void {`
**Syntax**: Private method with void return type
**Functionality**: Validates that the amount is not negative.

### 42. `if (amount < 0) {`
**Syntax**: Conditional statement
**Functionality**: Checks if the amount is less than zero.

### 43. `throw new Error("Amount cannot be negative");`
**Syntax**: Throw statement
**Functionality**: Throws an exception for negative amounts.

### 44. `}`
**Syntax**: Conditional block closing brace
**Functionality**: Closes the if statement.

### 45. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the validateAmount method.

### 46. `public abstract monthlyImpact(): number;`
**Syntax**: Abstract method declaration
**Functionality**: Defines an abstract method that must be implemented by subclasses. Calculates monthly financial impact.

### 47. `public abstract priority(): number;`
**Syntax**: Abstract method declaration
**Functionality**: Defines an abstract method for bill priority ranking.

### 48. `public abstract getBillTypeLabel(): string;`
**Syntax**: Abstract method declaration
**Functionality**: Defines an abstract method for human-readable bill type labels.

### 49. `}`
**Syntax**: Class closing brace
**Functionality**: Closes the Bill abstract class.

### 50. `// NOTE: Subscriptions`
**Syntax**: Single-line comment
**Functionality**: Comment indicating the start of subscription-related classes.

### 51. `abstract class Subscription extends Bill {`
**Syntax**: Abstract class extending another class
**Functionality**: Defines Subscription as an abstract subclass of Bill, inheriting all Bill properties and methods.

### 52. `private _cycle: "monthly" | "annual";`
**Syntax**: Union type property declaration
**Functionality**: Declares a private property that can only be "monthly" or "annual".

### 53. `constructor(id: string, name: string, amount: number, cycle: "monthly" | "annual") {`
**Syntax**: Constructor with union type parameter
**Functionality**: Constructor that calls parent constructor and initializes the cycle property.

### 54. `super(id, name, amount);`
**Syntax**: Super constructor call
**Functionality**: Calls the parent class constructor with inherited parameters.

### 55. `this._cycle = cycle;`
**Syntax**: Property assignment
**Functionality**: Sets the billing cycle.

### 56. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes the constructor.

### 57. `public get cycle(): "monthly" | "annual" {`
**Syntax**: Getter with union return type
**Functionality**: Public getter for the billing cycle.

### 58. `return this._cycle;`
**Syntax**: Return statement
**Functionality**: Returns the cycle value.

### 59. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes the getter.

### 60. `public changeCycle(newCycle: "monthly" | "annual"): void {`
**Syntax**: Public method with union type parameter
**Functionality**: Method to change the billing cycle.

### 61. `this._cycle = newCycle;`
**Syntax**: Property assignment
**Functionality**: Updates the cycle property.

### 62. `}`
**Syntax**: Method closing brace
**Functionality**: Closes the changeCycle method.

### 63. `public switchToAnnual(): void {`
**Syntax**: Public method
**Functionality**: Convenience method to switch to annual billing.

### 64. `this.changeCycle("annual");`
**Syntax**: Method call
**Functionality**: Calls changeCycle with "annual".

### 65. `}`
**Syntax**: Method closing brace
**Functionality**: Closes switchToAnnual.

### 66. `public switchToMonthly(): void {`
**Syntax**: Public method
**Functionality**: Convenience method to switch to monthly billing.

### 67. `this.changeCycle("monthly");`
**Syntax**: Method call
**Functionality**: Calls changeCycle with "monthly".

### 68. `}`
**Syntax**: Method closing brace
**Functionality**: Closes switchToMonthly.

### 69. `public monthlyImpact(): number {`
**Syntax**: Method implementation
**Functionality**: Implements the abstract monthlyImpact method for subscriptions.

### 70. `return this.cycle === "annual" ? this.amount / 12 : this.amount;`
**Syntax**: Ternary conditional operator
**Functionality**: Returns annual amount divided by 12 for annual subscriptions, or full amount for monthly.

### 71. `}`
**Syntax**: Method closing brace
**Functionality**: Closes monthlyImpact.

### 72. `}`
**Syntax**: Class closing brace
**Functionality**: Closes the Subscription class.

### 73. `class EntertainmentSubscription extends Subscription {`
**Syntax**: Concrete class extending abstract class
**Functionality**: Defines EntertainmentSubscription as a concrete implementation of Subscription.

### 74. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Implements the abstract priority method.

### 75. `return 2;`
**Syntax**: Return statement
**Functionality**: Returns priority value of 2 for entertainment subscriptions.

### 76. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority method.

### 77. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Implements the abstract getBillTypeLabel method.

### 78. `return "Entertainment";`
**Syntax**: Return statement
**Functionality**: Returns the label "Entertainment".

### 79. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 80. `}`
**Syntax**: Class closing brace
**Functionality**: Closes EntertainmentSubscription.

### 81. `class ProductivitySubscription extends Subscription {`
**Syntax**: Concrete class extending abstract class
**Functionality**: Defines ProductivitySubscription as another concrete implementation.

### 82. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Implements priority method.

### 83. `return 3;`
**Syntax**: Return statement
**Functionality**: Returns priority value of 3.

### 84. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority.

### 85. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Implements getBillTypeLabel.

### 86. `return "Productivity";`
**Syntax**: Return statement
**Functionality**: Returns "Productivity" label.

### 87. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 88. `}`
**Syntax**: Class closing brace
**Functionality**: Closes ProductivitySubscription.

### 89. `// NOTE: Utilities`
**Syntax**: Comment
**Functionality**: Indicates the start of utility-related classes.

### 90. `abstract class Utility extends Bill {`
**Syntax**: Abstract class extending Bill
**Functionality**: Defines Utility as an abstract subclass of Bill.

### 91. `private _isEstimated: boolean;`
**Syntax**: Private boolean property
**Functionality**: Tracks whether the utility amount is estimated.

### 92. `constructor(id: string, name: string, amount: number, isEstimated: boolean = false) {`
**Syntax**: Constructor with default parameter
**Functionality**: Constructor with optional isEstimated parameter defaulting to false.

### 93. `super(id, name, amount);`
**Syntax**: Super constructor call
**Functionality**: Calls parent constructor.

### 94. `this._isEstimated = isEstimated;`
**Syntax**: Property assignment
**Functionality**: Sets the estimated flag.

### 95. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes constructor.

### 96. `public get isEstimated(): boolean {`
**Syntax**: Boolean getter
**Functionality**: Returns whether the utility is estimated.

### 97. `return this._isEstimated;`
**Syntax**: Return statement
**Functionality**: Returns the estimated flag.

### 98. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes getter.

### 99. `public getEstimatedBuffer(): number {`
**Syntax**: Method returning number
**Functionality**: Calculates buffer amount for estimated utilities.

### 100. `return this._isEstimated ? this.amount * 0.1 : 0;`
**Syntax**: Ternary operator
**Functionality**: Returns 10% of amount if estimated, otherwise 0.

### 101. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getEstimatedBuffer.

### 102. `public monthlyImpact(): number {`
**Syntax**: Method implementation
**Functionality**: Implements monthlyImpact for utilities.

### 103. `return this._isEstimated ? this.amount * 1.1 : this.amount;`
**Syntax**: Ternary operator
**Functionality**: Returns 110% of amount if estimated (including 10% buffer), otherwise full amount.

### 104. `}`
**Syntax**: Method closing brace
**Functionality**: Closes monthlyImpact.

### 105. `}`
**Syntax**: Class closing brace
**Functionality**: Closes Utility class.

### 106. `class EssentialUtility extends Utility {`
**Syntax**: Concrete class extending Utility
**Functionality**: Defines essential utilities.

### 107. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Returns priority for essential utilities.

### 108. `return 5;`
**Syntax**: Return statement
**Functionality**: Highest priority (5) for essential utilities.

### 109. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority.

### 110. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Returns label for essential utilities.

### 111. `return "Essential";`
**Syntax**: Return statement
**Functionality**: Returns "Essential" label.

### 112. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 113. `}`
**Syntax**: Class closing brace
**Functionality**: Closes EssentialUtility.

### 114. `class NonEssentialUtility extends Utility {`
**Syntax**: Concrete class extending Utility
**Functionality**: Defines non-essential utilities.

### 115. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Returns priority for non-essential utilities.

### 116. `return 1;`
**Syntax**: Return statement
**Functionality**: Lowest priority (1) for non-essential utilities.

### 117. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority.

### 118. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Returns label for non-essential utilities.

### 119. `return "Non-essential";`
**Syntax**: Return statement
**Functionality**: Returns "Non-essential" label.

### 120. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 121. `}`
**Syntax**: Class closing brace
**Functionality**: Closes NonEssentialUtility.

### 122. `// NOTE: Debt`
**Syntax**: Comment
**Functionality**: Indicates start of debt-related classes.

### 123. `abstract class Debt extends Bill {`
**Syntax**: Abstract class extending Bill
**Functionality**: Defines Debt as abstract subclass of Bill.

### 124. `private _interestRate: number;`
**Syntax**: Private number property
**Functionality**: Stores interest rate for debt calculations.

### 125. `constructor(id: string, name: string, amount: number, interestRate: number) {`
**Syntax**: Constructor with parameters
**Functionality**: Initializes debt with interest rate.

### 126. `super(id, name, amount);`
**Syntax**: Super constructor call
**Functionality**: Calls parent constructor.

### 127. `this.validateRate(interestRate);`
**Syntax**: Method call
**Functionality**: Validates the interest rate.

### 128. `this._interestRate = interestRate;`
**Syntax**: Property assignment
**Functionality**: Sets the interest rate.

### 129. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes constructor.

### 130. `public get interestRate(): number {`
**Syntax**: Number getter
**Functionality**: Returns the interest rate.

### 131. `return this._interestRate;`
**Syntax**: Return statement
**Functionality**: Returns interest rate value.

### 132. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes getter.

### 133. `public updateInterestRate(newRate: number): void {`
**Syntax**: Method with parameter
**Functionality**: Updates the interest rate.

### 134. `this.validateRate(newRate);`
**Syntax**: Method call
**Functionality**: Validates the new rate.

### 135. `this._interestRate = newRate;`
**Syntax**: Property assignment
**Functionality**: Updates the rate.

### 136. `}`
**Syntax**: Method closing brace
**Functionality**: Closes updateInterestRate.

### 137. `public calculateTotalWithInterest(): number {`
**Syntax**: Method returning number
**Functionality**: Calculates total amount including interest.

### 138. `return this.amount + (this.amount * this.interestRate / 100);`
**Syntax**: Arithmetic expression
**Functionality**: Returns principal plus interest amount.

### 139. `}`
**Syntax**: Method closing brace
**Functionality**: Closes calculateTotalWithInterest.

### 140. `private validateRate(rate: number): void {`
**Syntax**: Private validation method
**Functionality**: Ensures interest rate is not negative.

### 141. `if (rate < 0) {`
**Syntax**: Conditional statement
**Functionality**: Checks for negative rate.

### 142. `throw new Error("Interest rate cannot be negative");`
**Syntax**: Throw statement
**Functionality**: Throws error for invalid rate.

### 143. `}`
**Syntax**: Conditional block closing brace
**Functionality**: Closes if statement.

### 144. `}`
**Syntax**: Method closing brace
**Functionality**: Closes validateRate.

### 145. `public monthlyImpact(): number {`
**Syntax**: Method implementation
**Functionality**: Implements monthlyImpact for debts.

### 146. `return this.amount + (this.amount * this.interestRate / 100);`
**Syntax**: Arithmetic expression
**Functionality**: Returns monthly payment including interest.

### 147. `}`
**Syntax**: Method closing brace
**Functionality**: Closes monthlyImpact.

### 148. `}`
**Syntax**: Class closing brace
**Functionality**: Closes Debt class.

### 149. `class OneTimeDebt extends Debt {`
**Syntax**: Concrete class extending Debt
**Functionality**: Defines one-time debt payments.

### 150. `public override monthlyImpact(): number {`
**Syntax**: Override method
**Functionality**: Overrides parent's monthlyImpact method.

### 151. `return this.amount;`
**Syntax**: Return statement
**Functionality**: Returns just the principal amount (no monthly interest calculation).

### 152. `}`
**Syntax**: Method closing brace
**Functionality**: Closes monthlyImpact.

### 153. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Returns priority for one-time debt.

### 154. `return 4;`
**Syntax**: Return statement
**Functionality**: Returns priority value of 4.

### 155. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority.

### 156. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Returns label for one-time debt.

### 157. `return "One-time";`
**Syntax**: Return statement
**Functionality**: Returns "One-time" label.

### 158. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 159. `}`
**Syntax**: Class closing brace
**Functionality**: Closes OneTimeDebt.

### 160. `class RecurringDebt extends Debt {`
**Syntax**: Concrete class extending Debt
**Functionality**: Defines recurring debt payments.

### 161. `public priority(): number {`
**Syntax**: Method implementation
**Functionality**: Returns priority for recurring debt.

### 162. `return 5;`
**Syntax**: Return statement
**Functionality**: Returns highest priority (5) for recurring debt.

### 163. `}`
**Syntax**: Method closing brace
**Functionality**: Closes priority.

### 164. `public getBillTypeLabel(): string {`
**Syntax**: Method implementation
**Functionality**: Returns label for recurring debt.

### 165. `return "Recurring";`
**Syntax**: Return statement
**Functionality**: Returns "Recurring" label.

### 166. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getBillTypeLabel.

### 167. `}`
**Syntax**: Class closing brace
**Functionality**: Closes RecurringDebt.

### 168. `class CategoryGroup {`
**Syntax**: Class declaration
**Functionality**: Defines a container class for grouping bills by category.

### 169. `public label: string;`
**Syntax**: Public property
**Functionality**: Stores the category name/label.

### 170. `public items: Bill[] = [];`
**Syntax**: Public array property with initialization
**Functionality**: Stores array of Bill objects, initialized as empty array.

### 171. `constructor(label: string) {`
**Syntax**: Constructor with parameter
**Functionality**: Initializes CategoryGroup with a label.

### 172. `this.label = label;`
**Syntax**: Property assignment
**Functionality**: Sets the label property.

### 173. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes constructor.

### 174. `public addBill(bill: Bill): void {`
**Syntax**: Public method
**Functionality**: Adds a bill to the group's items array.

### 175. `this.items.push(bill);`
**Syntax**: Array push method
**Functionality**: Appends the bill to the items array.

### 176. `}`
**Syntax**: Method closing brace
**Functionality**: Closes addBill.

### 177. `public removeBill(billId: string): void {`
**Syntax**: Public method
**Functionality**: Removes a bill by ID from the group.

### 178. `this.items = this.items.filter((item) => item.id !== billId);`
**Syntax**: Array filter method
**Functionality**: Creates new array excluding the bill with matching ID.

### 179. `}`
**Syntax**: Method closing brace
**Functionality**: Closes removeBill.

### 180. `public getTotalMonthlyImpact(): number {`
**Syntax**: Method returning number
**Functionality**: Calculates total monthly impact of all bills in group.

### 181. `return this.items.reduce((sum, item) => sum + item.monthlyImpact(), 0);`
**Syntax**: Array reduce method
**Functionality**: Sums up monthlyImpact of all items, starting with 0.

### 182. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getTotalMonthlyImpact.

### 183. `public isOverBudget(budget: number): boolean {`
**Syntax**: Method returning boolean
**Functionality**: Checks if group total exceeds budget.

### 184. `return this.getTotalMonthlyImpact() > budget;`
**Syntax**: Comparison and return
**Functionality**: Returns true if total impact exceeds budget.

### 185. `}`
**Syntax**: Method closing brace
**Functionality**: Closes isOverBudget.

### 186. `public findDuplicate(name: string): Bill | null {`
**Syntax**: Method returning union type
**Functionality**: Finds bill with matching name (case-insensitive).

### 187. `const normalized = name.trim().toLowerCase();`
**Syntax**: String manipulation
**Functionality**: Normalizes search term by trimming and lowercasing.

### 188. `return this.items.find((item) => item.name.trim().toLowerCase() === normalized) ?? null;`
**Syntax**: Array find with nullish coalescing
**Functionality**: Returns matching bill or null if not found.

### 189. `}`
**Syntax**: Method closing brace
**Functionality**: Closes findDuplicate.

### 190. `}`
**Syntax**: Class closing brace
**Functionality**: Closes CategoryGroup.

### 191. `// NOTE: Manager class`
**Syntax**: Comment
**Functionality**: Indicates start of manager class.

### 192. `class BillManager {`
**Syntax**: Class declaration
**Functionality**: Defines the main manager class for bill operations.

### 193. `private _groups: CategoryGroup[];`
**Syntax**: Private array property
**Functionality**: Stores array of CategoryGroup objects.

### 194. `private _totalBudget: number = 0;`
**Syntax**: Private property with initialization
**Functionality**: Stores total budget amount, initialized to 0.

### 195. `private _categoryBudgets: Record<string, number> = {`
**Syntax**: Private Record type property with initialization
**Functionality**: Stores budget amounts per category using string keys.

### 196. `"Subscriptions": 0,`
**Syntax**: Object property
**Functionality**: Initializes Subscriptions budget to 0.

### 197. `"Utilities": 0,`
**Syntax**: Object property
**Functionality**: Initializes Utilities budget to 0.

### 198. `"Debts": 0,`
**Syntax**: Object property
**Functionality**: Initializes Debts budget to 0.

### 199. `};`
**Syntax**: Object closing brace
**Functionality**: Closes the categoryBudgets object.

### 200. `private _pendingBill: { bill: Bill; category: string; } | null = null;`
**Syntax**: Private union type property
**Functionality**: Stores pending bill data or null, used for duplicate handling.

### 201. `constructor(groups: CategoryGroup[]) {`
**Syntax**: Constructor with array parameter
**Functionality**: Initializes BillManager with category groups.

### 202. `this._groups = groups;`
**Syntax**: Property assignment
**Functionality**: Sets the groups property.

### 203. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes constructor.

### 204. `public getGroups(): CategoryGroup[] {`
**Syntax**: Public getter returning array
**Functionality**: Returns the groups array.

### 205. `return this._groups;`
**Syntax**: Return statement
**Functionality**: Returns the groups.

### 206. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes getGroups.

### 207. `public get totalBudget(): number {`
**Syntax**: Public getter
**Functionality**: Returns total budget amount.

### 208. `return this._totalBudget;`
**Syntax**: Return statement
**Functionality**: Returns total budget.

### 209. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes totalBudget getter.

### 210. `public getCategoryBudget(category: string): number {`
**Syntax**: Public method with parameter
**Functionality**: Returns budget for specific category.

### 211. `return this._categoryBudgets[category] || 0;`
**Syntax**: Property access with fallback
**Functionality**: Returns category budget or 0 if not found.

### 212. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getCategoryBudget.

### 213. `public createBill(`
**Syntax**: Method signature start
**Functionality**: Factory method for creating different bill types.

### 214. `billType: string,`
**Syntax**: Parameter declaration
**Functionality**: Bill type identifier.

### 215. `id: string,`
**Syntax**: Parameter declaration
**Functionality**: Unique bill identifier.

### 216. `name: string,`
**Syntax**: Parameter declaration
**Functionality**: Bill name.

### 217. `amount: number,`
**Syntax**: Parameter declaration
**Functionality**: Bill amount.

### 218. `billingCycle: "monthly" | "annual" = "monthly",`
**Syntax**: Parameter with default value
**Functionality**: Billing cycle with default of "monthly".

### 219. `interestRate: number`
**Syntax**: Parameter declaration
**Functionality**: Interest rate for debt bills.

### 220. `): Bill {`
**Syntax**: Method signature completion
**Functionality**: Returns Bill object.

### 221. `switch (billType) {`
**Syntax**: Switch statement
**Functionality**: Determines which bill type to create based on string.

### 222. `case "ProductivitySubscription":`
**Syntax**: Case statement
**Functionality**: Matches ProductivitySubscription type.

### 223. `return new ProductivitySubscription(id, name, amount, billingCycle);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns ProductivitySubscription instance.

### 224. `case "EntertainmentSubscription":`
**Syntax**: Case statement
**Functionality**: Matches EntertainmentSubscription type.

### 225. `return new EntertainmentSubscription(id, name, amount, billingCycle);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns EntertainmentSubscription instance.

### 226. `case "EssentialUtility":`
**Syntax**: Case statement
**Functionality**: Matches EssentialUtility type.

### 227. `return new EssentialUtility(id, name, amount);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns EssentialUtility instance.

### 228. `case "NonEssentialUtility":`
**Syntax**: Case statement
**Functionality**: Matches NonEssentialUtility type.

### 229. `return new NonEssentialUtility(id, name, amount);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns NonEssentialUtility instance.

### 230. `case "OneTimeDebt":`
**Syntax**: Case statement
**Functionality**: Matches OneTimeDebt type.

### 231. `return new OneTimeDebt(id, name, amount, interestRate);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns OneTimeDebt instance.

### 232. `case "RecurringDebt":`
**Syntax**: Case statement
**Functionality**: Matches RecurringDebt type.

### 233. `return new RecurringDebt(id, name, amount, interestRate);`
**Syntax**: Return with object instantiation
**Functionality**: Creates and returns RecurringDebt instance.

### 234. `default:`
**Syntax**: Default case
**Functionality**: Handles unknown bill types.

### 235. `throw new Error(\`Unknown bill type: ${billType}\`);`
**Syntax**: Throw statement with template literal
**Functionality**: Throws error for invalid bill type.

### 236. `}`
**Syntax**: Switch closing brace
**Functionality**: Closes switch statement.

### 237. `}`
**Syntax**: Method closing brace
**Functionality**: Closes createBill method.

### 238. `public addToGroup(label: string, bill: Bill): void {`
**Syntax**: Public method
**Functionality**: Adds bill to specified category group.

### 239. `const group = this._groups.find((item) => item.label === label);`
**Syntax**: Array find method
**Functionality**: Finds group with matching label.

### 240. `if (group) {`
**Syntax**: Conditional statement
**Functionality**: Checks if group was found.

### 241. `group.items.push(bill);`
**Syntax**: Array push
**Functionality**: Adds bill to group's items array.

### 242. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes if statement.

### 243. `}`
**Syntax**: Method closing brace
**Functionality**: Closes addToGroup.

### 244. `public removeFromGroup(label: string, billId: string): void {`
**Syntax**: Public method
**Functionality**: Removes bill from specified group.

### 245. `const group = this._groups.find((item) => item.label === label);`
**Syntax**: Array find method
**Functionality**: Finds group with matching label.

### 246. `if (group) {`
**Syntax**: Conditional statement
**Functionality**: Checks if group was found.

### 247. `group.items = group.items.filter((item) => item.id !== billId);`
**Syntax**: Array filter
**Functionality**: Removes bill with matching ID from group.

### 248. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes if statement.

### 249. `}`
**Syntax**: Method closing brace
**Functionality**: Closes removeFromGroup.

### 250. `public getTotal(): number {`
**Syntax**: Public method
**Functionality**: Calculates total monthly impact across all groups.

### 251. `return this._groups.reduce((sum, group) => sum + group.getTotalMonthlyImpact(), 0);`
**Syntax**: Array reduce method
**Functionality**: Sums monthly impact of all groups.

### 252. `}`
**Syntax**: Method closing brace
**Functionality**: Closes getTotal.

### 253. `public findDuplicate(name: string): Bill | null {`
**Syntax**: Public method with union return type
**Functionality**: Finds duplicate bill by name across all groups.

### 254. `const normalized = name.trim().toLowerCase();`
**Syntax**: String manipulation
**Functionality**: Normalizes search term.

### 255. `return this._groups`
**Syntax**: Method chain start
**Functionality**: Begins method chain on groups array.

### 256. `.flatMap((group) => group.items)`
**Syntax**: Array flatMap method
**Functionality**: Flattens all bill items from all groups into single array.

### 257. `.find((item) => item.name.trim().toLowerCase() === normalized) ?? null;`
**Syntax**: Array find with nullish coalescing
**Functionality**: Finds bill with matching name or returns null.

### 258. `}`
**Syntax**: Method closing brace
**Functionality**: Closes findDuplicate.

### 259. `public getPendingBill(): { bill: Bill; category: string; } | null {`
**Syntax**: Public getter with complex return type
**Functionality**: Returns pending bill data or null.

### 260. `return this._pendingBill;`
**Syntax**: Return statement
**Functionality**: Returns pending bill.

### 261. `}`
**Syntax**: Getter closing brace
**Functionality**: Closes getPendingBill.

### 262. `public setBudgets(total: number, subs: number, utils: number, debts: number): void {`
**Syntax**: Public method with multiple parameters
**Functionality**: Sets budget amounts for total and categories.

### 263. `this._totalBudget = total;`
**Syntax**: Property assignment
**Functionality**: Sets total budget.

### 264. `this._categoryBudgets["Subscriptions"] = subs;`
**Syntax**: Object property assignment
**Functionality**: Sets subscriptions budget.

### 265. `this._categoryBudgets["Utilities"] = utils;`
**Syntax**: Object property assignment
**Functionality**: Sets utilities budget.

### 266. `this._categoryBudgets["Debts"] = debts;`
**Syntax**: Object property assignment
**Functionality**: Sets debts budget.

### 267. `}`
**Syntax**: Method closing brace
**Functionality**: Closes setBudgets.

### 268. `public setPendingBill(bill: Bill, category: string): void {`
**Syntax**: Public method
**Functionality**: Sets pending bill for duplicate handling.

### 269. `this._pendingBill = { bill, category };`
**Syntax**: Object assignment
**Functionality**: Stores bill and category as pending.

### 270. `}`
**Syntax**: Method closing brace
**Functionality**: Closes setPendingBill.

### 271. `public clearPendingBill(): void {`
**Syntax**: Public method
**Functionality**: Clears pending bill data.

### 272. `this._pendingBill = null;`
**Syntax**: Property assignment
**Functionality**: Sets pending bill to null.

### 273. `}`
**Syntax**: Method closing brace
**Functionality**: Closes clearPendingBill.

### 274. `public updateBill(existingBillId: string, newBill: Bill, targetCategory: string): void {`
**Syntax**: Public method
**Functionality**: Updates existing bill with new data.

### 275. `for (const group of this._groups) {`
**Syntax**: For-of loop
**Functionality**: Iterates through all groups.

### 276. `const index = group.items.findIndex((item) => item.id === existingBillId);`
**Syntax**: Array findIndex
**Functionality**: Finds index of bill with matching ID.

### 277. `if (index !== -1) {`
**Syntax**: Conditional statement
**Functionality**: Checks if bill was found.

### 278. `group.items.splice(index, 1);`
**Syntax**: Array splice
**Functionality**: Removes bill from its current group.

### 279. `break;`
**Syntax**: Break statement
**Functionality**: Exits the loop after finding and removing the bill.

### 280. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes if statement.

### 281. `}`
**Syntax**: For loop closing brace
**Functionality**: Closes for loop.

### 282. `const targetGroup = this._groups.find((g) => g.label === targetCategory);`
**Syntax**: Array find
**Functionality**: Finds target category group.

### 283. `if (targetGroup) {`
**Syntax**: Conditional statement
**Functionality**: Checks if target group exists.

### 284. `targetGroup.items.push(newBill);`
**Syntax**: Array push
**Functionality**: Adds updated bill to target group.

### 285. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes if statement.

### 286. `}`
**Syntax**: Method closing brace
**Functionality**: Closes updateBill.

### 287. `}`
**Syntax**: Class closing brace
**Functionality**: Closes BillManager class.

### 288. `interface HistoryEntry {`
**Syntax**: TypeScript interface declaration
**Functionality**: Defines structure for history entries.

### 289. `name: string;`
**Syntax**: Interface property
**Functionality**: History entry name field.

### 290. `category: string;`
**Syntax**: Interface property
**Functionality**: History entry category field.

### 291. `amount: string;`
**Syntax**: Interface property
**Functionality**: History entry amount field (as formatted string).

### 292. `type: string;`
**Syntax**: Interface property
**Functionality**: History entry type field.

### 293. `}`
**Syntax**: Interface closing brace
**Functionality**: Closes HistoryEntry interface.

### 294. `class TrackerUI {`
**Syntax**: Class declaration
**Functionality**: Defines the UI management class.

### 295. `private _root: HTMLDivElement;`
**Syntax**: Private typed property
**Functionality**: Stores reference to root DOM element.

### 296. `private _manager: BillManager;`
**Syntax**: Private typed property
**Functionality**: Stores reference to BillManager instance.

### 297. `private _isBound = false;`
**Syntax**: Private boolean property with initialization
**Functionality**: Tracks whether event listeners are bound.

### 298. `private _formCategory: HTMLSelectElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to category select element.

### 299. `private _formType: HTMLSelectElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to bill type select element.

### 300. `private _formTypeField: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to bill type field container.

### 301. `private _formCycleField: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to billing cycle field container.

### 302. `private _formEl: HTMLFormElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to main form element.

### 303. `private _formInterestRateField: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to interest rate field container.

### 304. `private _budgetFormEl: HTMLFormElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to budget form element.

### 305. `private _budgetErrorEl: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to budget error message element.

### 306. `private _totalBudgetEl: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to total budget display element.

### 307. `private _remainingEl: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to remaining budget display element.

### 308. `private _duplicateBillId: string | null = null;`
**Syntax**: Private union type property with initialization
**Functionality**: Stores ID of duplicate bill being handled.

### 309. `private _history: HistoryEntry[] = [];`
**Syntax**: Private array property with initialization
**Functionality**: Stores history of added bills.

### 310. `private _historyListEl: HTMLElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to history list container.

### 311. `private _clearHistoryBtn: HTMLButtonElement | null;`
**Syntax**: Private union type property
**Functionality**: Stores reference to clear history button.

### 312. `constructor(root: HTMLDivElement, manager: BillManager) {`
**Syntax**: Constructor with typed parameters
**Functionality**: Initializes TrackerUI with DOM root and manager.

### 313. `this._root = root;`
**Syntax**: Property assignment
**Functionality**: Sets root element reference.

### 314. `this._manager = manager;`
**Syntax**: Property assignment
**Functionality**: Sets manager reference.

### 315. `this._formCategory = this._root.querySelector<HTMLSelectElement>("[data-category]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores category select element.

### 316. `this._formType = this._root.querySelector<HTMLSelectElement>("[data-type]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores bill type select element.

### 317. `this._formTypeField = this._root.querySelector<HTMLElement>("[data-type-field]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores bill type field container.

### 318. `this._formCycleField = this._root.querySelector<HTMLElement>("[data-billing-cycle-field]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores billing cycle field container.

### 319. `this._formEl = this._root.querySelector<HTMLFormElement>("[data-form]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores main form element.

### 320. `this._formInterestRateField = this._root.querySelector<HTMLElement>("[data-interest-rate-field]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores interest rate field container.

### 321. `this._budgetFormEl = this._root.querySelector<HTMLFormElement>("[data-budget-form]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores budget form element.

### 322. `this._budgetErrorEl = this._root.querySelector<HTMLElement>("#budget-error");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores budget error element.

### 323. `this._totalBudgetEl = this._root.querySelector<HTMLElement>("[data-total-budget]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores total budget display element.

### 324. `this._remainingEl = this._root.querySelector<HTMLElement>("[data-remaining]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores remaining budget display element.

### 325. `this._historyListEl = this._root.querySelector<HTMLElement>("[data-history-list]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores history list container.

### 326. `this._clearHistoryBtn = this._root.querySelector<HTMLButtonElement>("[data-clear-history-btn]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds and stores clear history button.

### 327. `this.bindEvents();`
**Syntax**: Method call
**Functionality**: Binds event listeners to DOM elements.

### 328. `}`
**Syntax**: Constructor closing brace
**Functionality**: Closes constructor.

### 329. `public render(): void {`
**Syntax**: Public method
**Functionality**: Main render method that updates all UI components.

### 330. `this.updateTotals();`
**Syntax**: Method call
**Functionality**: Updates budget and total displays.

### 331. `this.renderGroups();`
**Syntax**: Method call
**Functionality**: Renders bill groups/categories.

### 332. `this.renderHistory();`
**Syntax**: Method call
**Functionality**: Renders history list.

### 333. `}`
**Syntax**: Method closing brace
**Functionality**: Closes render method.

### 334. `private renderHistory(): void {`
**Syntax**: Private method
**Functionality**: Renders the history list in the DOM.

### 335. `if (!this._historyListEl) return;`
**Syntax**: Early return guard
**Functionality**: Exits if history list element not found.

### 336. `this._historyListEl.replaceChildren();`
**Syntax**: DOM manipulation
**Functionality**: Clears all existing history list items.

### 337. `if (this._history.length === 0) {`
**Syntax**: Conditional statement
**Functionality**: Checks if history is empty.

### 338. `const emptyItem = document.createElement("li");`
**Syntax**: DOM element creation
**Functionality**: Creates empty state list item.

### 339. `emptyItem.className = "history-empty";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class for styling.

### 340. `emptyItem.textContent = "No bills added yet";`
**Syntax**: Property assignment
**Functionality**: Sets display text.

### 341. `this._historyListEl.appendChild(emptyItem);`
**Syntax**: DOM manipulation
**Functionality**: Adds empty state to history list.

### 342. `return;`
**Syntax**: Return statement
**Functionality**: Exits method after showing empty state.

### 343. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes empty check.

### 344. `this._history.forEach((entry) => {`
**Syntax**: Array forEach method
**Functionality**: Iterates through history entries.

### 345. `const listItem = document.createElement("li");`
**Syntax**: DOM element creation
**Functionality**: Creates list item for each history entry.

### 346. `listItem.className = "history-item";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class.

### 347. `listItem.innerHTML = \``
**Syntax**: Template literal start
**Functionality**: Begins HTML template for list item content.

### 348. `<div>`
**Syntax**: HTML element
**Functionality**: Container div for item content.

### 349. `<span class="history-item-name">${entry.name}</span>`
**Syntax**: HTML with interpolation
**Functionality**: Displays bill name with styling.

### 350. `<div class="history-item-meta">${entry.type} in ${entry.category}</div>`
**Syntax**: HTML with interpolation
**Functionality**: Displays bill type and category.

### 351. `</div>`
**Syntax**: HTML closing tag
**Functionality**: Closes content container.

### 352. `<span class="history-item-amount">${entry.amount}</span>`
**Syntax**: HTML with interpolation
**Functionality**: Displays formatted amount.

### 353. `\`;`
**Syntax**: Template literal end
**Functionality**: Closes HTML template.

### 354. `this._historyListEl?.appendChild(listItem);`
**Syntax**: DOM manipulation with optional chaining
**Functionality**: Adds list item to history list.

### 355. `});`
**Syntax**: forEach closing
**Functionality**: Closes forEach loop.

### 356. `}`
**Syntax**: Method closing brace
**Functionality**: Closes renderHistory method.

### 357. `private bindEvents(): void {`
**Syntax**: Private method
**Functionality**: Sets up all event listeners for UI interactions.

### 358. `if (this._isBound) {`
**Syntax**: Conditional statement
**Functionality**: Prevents duplicate event binding.

### 359. `return;`
**Syntax**: Return statement
**Functionality**: Exits if already bound.

### 360. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes guard check.

### 361. `this._formCategory?.addEventListener("change", this.onCategoryChange);`
**Syntax**: Event listener with optional chaining
**Functionality**: Binds category change handler.

### 362. `this._root.querySelectorAll<HTMLUListElement>("[data-group-list]").forEach((listEl) => {`
**Syntax**: DOM query and forEach
**Functionality**: Finds all group lists and binds click handlers.

### 363. `listEl.addEventListener("click", this.onListClick);`
**Syntax**: Event listener
**Functionality**: Binds list click handler to each group list.

### 364. `});`
**Syntax**: forEach closing
**Functionality**: Closes forEach loop.

### 365. `this._formEl?.addEventListener("submit", this.onFormSubmit);`
**Syntax**: Event listener with optional chaining
**Functionality**: Binds form submit handler.

### 366. `this._budgetFormEl?.addEventListener("submit", this.onBudgetSubmit);`
**Syntax**: Event listener with optional chaining
**Functionality**: Binds budget form submit handler.

### 367. `this.syncTypeOptions("");`
**Syntax**: Method call
**Functionality**: Initializes form type options.

### 368. `this._isBound = true;`
**Syntax**: Property assignment
**Functionality**: Marks events as bound.

### 369. `document.getElementById("alert-cancel")?.addEventListener("click", () => {`
**Syntax**: Event listener on global document
**Functionality**: Binds cancel button for duplicate alerts.

### 370. `this._manager.clearPendingBill();`
**Syntax**: Method call
**Functionality**: Clears pending bill state.

### 371. `this.hideDuplicateAlert();`
**Syntax**: Method call
**Functionality**: Hides duplicate alert modal.

### 372. `});`
**Syntax**: Event listener closing
**Functionality**: Closes cancel button handler.

### 373. `document.getElementById("alert-add-anyway")?.addEventListener("click", () => {`
**Syntax**: Event listener
**Functionality**: Binds "add anyway" button for duplicates.

### 374. `const pending = this._manager.getPendingBill();`
**Syntax**: Variable assignment
**Functionality**: Gets pending bill data.

### 375. `if (pending) {`
**Syntax**: Conditional statement
**Functionality**: Checks if pending bill exists.

### 376. `this._manager.addToGroup(pending.category, pending.bill);`
**Syntax**: Method call
**Functionality**: Adds pending bill to group.

### 377. `this._manager.clearPendingBill();`
**Syntax**: Method call
**Functionality**: Clears pending state.

### 378. `this.hideDuplicateAlert();`
**Syntax**: Method call
**Functionality**: Hides alert modal.

### 379. `if (this._formEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if form exists.

### 380. `this._formEl.reset();`
**Syntax**: Method call
**Functionality**: Resets form fields.

### 381. `this.syncTypeOptions("");`
**Syntax**: Method call
**Functionality**: Resets form type options.

### 382. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes form reset check.

### 383. `this.render();`
**Syntax**: Method call
**Functionality**: Re-renders UI.

### 384. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes pending check.

### 385. `});`
**Syntax**: Event listener closing
**Functionality**: Closes add-anyway handler.

### 386. `document.querySelector(".alert-modal")?.addEventListener("click", (e) => {`
**Syntax**: Event listener
**Functionality**: Binds modal background click to close.

### 387. `if (e.target === document.querySelector(".alert-modal")) {`
**Syntax**: Conditional statement
**Functionality**: Checks if click was on modal background.

### 388. `this._manager.clearPendingBill();`
**Syntax**: Method call
**Functionality**: Clears pending bill.

### 389. `this.hideDuplicateAlert();`
**Syntax**: Method call
**Functionality**: Hides alert modal.

### 390. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes background click check.

### 391. `});`
**Syntax**: Event listener closing
**Functionality**: Closes modal click handler.

### 392. `document.getElementById("alert-update")?.addEventListener("click", () => {`
**Syntax**: Event listener
**Functionality**: Binds update button for duplicate handling.

### 393. `const pending = this._manager.getPendingBill();`
**Syntax**: Variable assignment
**Functionality**: Gets pending bill data.

### 394. `if (pending && this._duplicateBillId) {`
**Syntax**: Conditional statement
**Functionality**: Checks if pending bill and duplicate ID exist.

### 395. `this._manager.updateBill(this._duplicateBillId, pending.bill, pending.category);`
**Syntax**: Method call
**Functionality**: Updates existing bill with pending data.

### 396. `this._manager.clearPendingBill();`
**Syntax**: Method call
**Functionality**: Clears pending state.

### 397. `this.hideDuplicateAlert();`
**Syntax**: Method call
**Functionality**: Hides alert modal.

### 398. `if (this._formEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if form exists.

### 399. `this._formEl.reset();`
**Syntax**: Method call
**Functionality**: Resets form fields.

### 400. `this.syncTypeOptions("");`
**Syntax**: Method call
**Functionality**: Resets form type options.

### 401. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes form reset check.

### 402. `this.render();`
**Syntax**: Method call
**Functionality**: Re-renders UI.

### 403. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes pending check.

### 404. `});`
**Syntax**: Event listener closing
**Functionality**: Closes update handler.

### 405. `this._clearHistoryBtn?.addEventListener("click", () => {`
**Syntax**: Event listener with optional chaining
**Functionality**: Binds clear history button click handler.

### 406. `this.clearHistory();`
**Syntax**: Method call
**Functionality**: Clears history array and re-renders.

### 407. `});`
**Syntax**: Event listener closing
**Functionality**: Closes clear history handler.

### 408. `}`
**Syntax**: Method closing brace
**Functionality**: Closes bindEvents method.

### 409. `private showDuplicateAlert(existingBill: Bill, newName: string): void {`
**Syntax**: Private method
**Functionality**: Shows duplicate bill alert modal.

### 410. `const modal = document.querySelector(".alert-modal") as HTMLElement;`
**Syntax**: DOM query with type assertion
**Functionality**: Finds alert modal element.

### 411. `const textEl = document.querySelector(".alert-text") as HTMLElement;`
**Syntax**: DOM query with type assertion
**Functionality**: Finds alert text element.

### 412. `if (modal && textEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if elements exist.

### 413. `const existingType = existingBill.getBillTypeLabel();`
**Syntax**: Variable assignment
**Functionality**: Gets existing bill type label.

### 414. `const existingAmount = this.money(existingBill.monthlyImpact());`
**Syntax**: Variable assignment
**Functionality**: Formats existing bill amount.

### 415. `textEl.textContent = \`A bill named "${existingBill.name}" already exists (${existingType} - ${existingAmount}/month). Do you still want to add "${newName}"?\`;`
**Syntax**: Property assignment with template literal
**Functionality**: Sets alert message text.

### 416. `modal.classList.add("active");`
**Syntax**: DOM class manipulation
**Functionality**: Shows the alert modal.

### 417. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes element check.

### 418. `}`
**Syntax**: Method closing brace
**Functionality**: Closes showDuplicateAlert.

### 419. `private hideDuplicateAlert(): void {`
**Syntax**: Private method
**Functionality**: Hides duplicate bill alert modal.

### 420. `const modal = document.querySelector(".alert-modal") as HTMLElement;`
**Syntax**: DOM query with type assertion
**Functionality**: Finds alert modal element.

### 421. `if (modal) {`
**Syntax**: Conditional statement
**Functionality**: Checks if modal exists.

### 422. `modal.classList.remove("active");`
**Syntax**: DOM class manipulation
**Functionality**: Hides the alert modal.

### 423. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes modal check.

### 424. `}`
**Syntax**: Method closing brace
**Functionality**: Closes hideDuplicateAlert.

### 425. `private clearHistory(): void {`
**Syntax**: Private method
**Functionality**: Clears the history array and re-renders.

### 426. `this._history = [];`
**Syntax**: Array assignment
**Functionality**: Empties the history array.

### 427. `this.renderHistory();`
**Syntax**: Method call
**Functionality**: Re-renders the history list.

### 428. `}`
**Syntax**: Method closing brace
**Functionality**: Closes clearHistory.

### 429. `private onBudgetSubmit = (event: Event): void => {`
**Syntax**: Private arrow function property
**Functionality**: Handles budget form submission.

### 430. `event.preventDefault();`
**Syntax**: Method call
**Functionality**: Prevents default form submission.

### 431. `if (!this._budgetFormEl) {`
**Syntax**: Conditional statement
**Functionality**: Guards against missing form element.

### 432. `return;`
**Syntax**: Return statement
**Functionality**: Exits if form not found.

### 433. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes guard check.

### 434. `const formData = new FormData(this._budgetFormEl);`
**Syntax**: Object instantiation
**Functionality**: Creates FormData from budget form.

### 435. `const total = Number(formData.get("totalBudget"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts total budget value.

### 436. `const subs = Number(formData.get("subBudget"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts subscriptions budget.

### 437. `const utils = Number(formData.get("utilBudget"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts utilities budget.

### 438. `const debts = Number(formData.get("debtBudget"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts debts budget.

### 439. `if (subs + utils + debts > total) {`
**Syntax**: Conditional statement
**Functionality**: Checks if category budgets exceed total.

### 440. `if (this._budgetErrorEl)  {`
**Syntax**: Conditional statement
**Functionality**: Checks if error element exists.

### 441. `this._budgetErrorEl.style.display = "block";`
**Syntax**: Property assignment
**Functionality**: Shows budget error message.

### 442. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes error element check.

### 443. `return;`
**Syntax**: Return statement
**Functionality**: Exits on validation failure.

### 444. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes budget validation check.

### 445. `if (this._budgetErrorEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if error element exists.

### 446. `this._budgetErrorEl.style.display = "none";`
**Syntax**: Property assignment
**Functionality**: Hides budget error message.

### 447. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes error element check.

### 448. `this._manager.setBudgets(total, subs, utils, debts);`
**Syntax**: Method call
**Functionality**: Updates budget values in manager.

### 449. `this.render();`
**Syntax**: Method call
**Functionality**: Re-renders UI with new budget data.

### 450. `}`
**Syntax**: Method closing brace
**Functionality**: Closes onBudgetSubmit.

### 451. `private onCategoryChange = (): void => {`
**Syntax**: Private arrow function property
**Functionality**: Handles category select change.

### 452. `if (this._formCategory) {`
**Syntax**: Conditional statement
**Functionality**: Checks if category element exists.

### 453. `this.syncTypeOptions(this._formCategory.value);`
**Syntax**: Method call
**Functionality**: Updates form type options based on category.

### 454. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes element check.

### 455. `}`
**Syntax**: Method closing brace
**Functionality**: Closes onCategoryChange.

### 456. `private onListClick = (event: Event): void => {`
**Syntax**: Private arrow function property
**Functionality**: Handles clicks on bill list items.

### 457. `const target = event.target as HTMLElement | null;`
**Syntax**: Type assertion
**Functionality**: Casts event target to HTMLElement.

### 458. `const deleteButton = target?.closest<HTMLButtonElement>("[data-delete-id]");`
**Syntax**: DOM query with optional chaining
**Functionality**: Finds delete button in event path.

### 459. `if (!deleteButton) {`
**Syntax**: Conditional statement
**Functionality**: Checks if delete button was clicked.

### 460. `return;`
**Syntax**: Return statement
**Functionality**: Exits if not a delete action.

### 461. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes delete button check.

### 462. `const billId = deleteButton.getAttribute("data-delete-id");`
**Syntax**: DOM attribute access
**Functionality**: Gets bill ID from button attribute.

### 463. `const groupLabel = deleteButton.getAttribute("data-group");`
**Syntax**: DOM attribute access
**Functionality**: Gets group label from button attribute.

### 464. `if (billId && groupLabel) {`
**Syntax**: Conditional statement
**Functionality**: Checks if both attributes exist.

### 465. `this._manager.removeFromGroup(groupLabel, billId);`
**Syntax**: Method call
**Functionality**: Removes bill from group.

### 466. `this.render();`
**Syntax**: Method call
**Functionality**: Re-renders UI.

### 467. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes attribute check.

### 468. `}`
**Syntax**: Method closing brace
**Functionality**: Closes onListClick.

### 469. `private onFormSubmit = (event: Event): void => {`
**Syntax**: Private arrow function property
**Functionality**: Handles main bill form submission.

### 470. `event.preventDefault();`
**Syntax**: Method call
**Functionality**: Prevents default form submission.

### 471. `if (!this._formEl) {`
**Syntax**: Conditional statement
**Functionality**: Guards against missing form.

### 472. `return;`
**Syntax**: Return statement
**Functionality**: Exits if form not found.

### 473. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes guard check.

### 474. `const formData = new FormData(this._formEl);`
**Syntax**: Object instantiation
**Functionality**: Creates FormData from main form.

### 475. `const name = String(formData.get("name") ?? "").trim();`
**Syntax**: Type conversion and string manipulation
**Functionality**: Gets and trims bill name.

### 476. `const category = String(formData.get("category") ?? "").trim();`
**Syntax**: Type conversion and string manipulation
**Functionality**: Gets and trims category.

### 477. `const billType = String(formData.get("billType") ?? "").trim();`
**Syntax**: Type conversion and string manipulation
**Functionality**: Gets and trims bill type.

### 478. `const amountValue = Number(formData.get("amount"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts amount.

### 479. `const billingCycle = (formData.get("billingCycle") as "monthly" | "annual") ?? "monthly";`
**Syntax**: Type assertion with fallback
**Functionality**: Gets billing cycle with default.

### 480. `const interestRate = Number(formData.get("interestRate"));`
**Syntax**: Type conversion
**Functionality**: Gets and converts interest rate.

### 481. `if (!name || !category || !billType || Number.isNaN(amountValue)) {`
**Syntax**: Conditional statement
**Functionality**: Validates required form fields.

### 482. `return;`
**Syntax**: Return statement
**Functionality**: Exits on validation failure.

### 483. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes validation check.

### 484. `const bill = this._manager.createBill(billType, this.newId("bill"), name, amountValue, billingCycle, interestRate);`
**Syntax**: Method call
**Functionality**: Creates new bill instance.

### 485. `const duplicate = this._manager.findDuplicate(name);`
**Syntax**: Method call
**Functionality**: Checks for duplicate bill names.

### 486. `if (duplicate) {`
**Syntax**: Conditional statement
**Functionality**: Handles duplicate bill scenario.

### 487. `this._duplicateBillId = duplicate.id;`
**Syntax**: Property assignment
**Functionality**: Stores duplicate bill ID.

### 488. `this._manager.setPendingBill(bill, category);`
**Syntax**: Method call
**Functionality**: Sets bill as pending for duplicate handling.

### 489. `this.showDuplicateAlert(duplicate, name);`
**Syntax**: Method call
**Functionality**: Shows duplicate alert modal.

### 490. `return;`
**Syntax**: Return statement
**Functionality**: Exits to allow user decision on duplicate.

### 491. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes duplicate check.

### 492. `this._manager.addToGroup(category, bill);`
**Syntax**: Method call
**Functionality**: Adds bill to appropriate category group.

### 493. `this._history.unshift({`
**Syntax**: Array unshift method
**Functionality**: Adds new entry to beginning of history array.

### 494. `name: bill.name,`
**Syntax**: Object property
**Functionality**: Sets history entry name.

### 495. `category,`
**Syntax**: Object property
**Functionality**: Sets history entry category.

### 496. `amount: this.money(bill.monthlyImpact()),`
**Syntax**: Object property with method call
**Functionality**: Sets formatted amount.

### 497. `type: bill.getBillTypeLabel()`
**Syntax**: Object property with method call
**Functionality**: Sets bill type label.

### 498. `});`
**Syntax**: Object closing brace and method call closing
**Functionality**: Closes history entry object and unshift call.

### 499. `this._history = this._history.slice(0, 10);`
**Syntax**: Array slice assignment
**Functionality**: Limits history to 10 most recent entries.

### 500. `this.renderHistory();`
**Syntax**: Method call
**Functionality**: Re-renders history list.

### 501. `this._formEl.reset();`
**Syntax**: Method call
**Functionality**: Resets form fields.

### 502. `this.syncTypeOptions("");`
**Syntax**: Method call
**Functionality**: Resets form type options.

### 503. `this.render();`
**Syntax**: Method call
**Functionality**: Re-renders entire UI.

### 504. `}`
**Syntax**: Method closing brace
**Functionality**: Closes onFormSubmit.

### 505. `private syncTypeOptions(category: string): void {`
**Syntax**: Private method
**Functionality**: Updates form type options based on selected category.

### 506. `if (!this._formType || !this._formTypeField || !this._formCycleField || !this._formInterestRateField ) {`
**Syntax**: Conditional statement
**Functionality**: Guards against missing form elements.

### 507. `return;`
**Syntax**: Return statement
**Functionality**: Exits if elements not found.

### 508. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes guard check.

### 509. `const hasCategory = category.length > 0;`
**Syntax**: Variable assignment
**Functionality**: Checks if a category is selected.

### 510. `this._formTypeField.hidden = !hasCategory;`
**Syntax**: Property assignment
**Functionality**: Shows/hides bill type field based on category selection.

### 511. `this._formCycleField.hidden = category !== "Subscriptions";`
**Syntax**: Property assignment
**Functionality**: Shows billing cycle field only for subscriptions.

### 512. `this._formInterestRateField.hidden = category !== "Debts";`
**Syntax**: Property assignment
**Functionality**: Shows interest rate field only for debts.

### 513. `Array.from(this._formType.options).forEach((option) => {`
**Syntax**: Array conversion and forEach
**Functionality**: Iterates through all bill type options.

### 514. `const isMatch = option.dataset.category === category;`
**Syntax**: Variable assignment
**Functionality**: Checks if option matches selected category.

### 515. `option.hidden = !isMatch;`
**Syntax**: Property assignment
**Functionality**: Hides option if it doesn't match category.

### 516. `option.disabled = !isMatch;`
**Syntax**: Property assignment
**Functionality**: Disables option if it doesn't match category.

### 517. `});`
**Syntax**: forEach closing
**Functionality**: Closes option iteration.

### 518. `if (!hasCategory) {`
**Syntax**: Conditional statement
**Functionality**: Handles case when no category is selected.

### 519. `this._formType.value = "";`
**Syntax**: Property assignment
**Functionality**: Clears bill type selection.

### 520. `} else {`
**Syntax**: Else statement
**Functionality**: Handles case when category is selected.

### 521. `const firstMatch = Array.from(this._formType.options).find((opt) => opt.dataset.category === category);`
**Syntax**: Array find method
**Functionality**: Finds first option that matches category.

### 522. `if (firstMatch) {`
**Syntax**: Conditional statement
**Functionality**: Checks if matching option found.

### 523. `this._formType.value = firstMatch.value;`
**Syntax**: Property assignment
**Functionality**: Selects the first matching option.

### 524. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes option check.

### 525. `}`
**Syntax**: Else closing brace
**Functionality**: Closes category check.

### 526. `}`
**Syntax**: Method closing brace
**Functionality**: Closes syncTypeOptions.

### 527. `private updateTotals(): void {`
**Syntax**: Private method
**Functionality**: Updates budget and total displays.

### 528. `const totalValueEl = this._root.querySelector<HTMLElement>("[data-total]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds total expenses display element.

### 529. `const totalExp = this._manager.getTotal();`
**Syntax**: Variable assignment
**Functionality**: Gets total monthly expenses.

### 530. `const totalBudg = this._manager.totalBudget;`
**Syntax**: Variable assignment
**Functionality**: Gets total budget amount.

### 531. `const remaining = totalBudg - totalExp;`
**Syntax**: Arithmetic expression
**Functionality**: Calculates remaining budget.

### 532. `if (totalValueEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if total element exists.

### 533. `totalValueEl.textContent = this.money(totalExp);`
**Syntax**: Property assignment
**Functionality**: Updates total expenses display.

### 534. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes element check.

### 535. `if (this._totalBudgetEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if budget element exists.

### 536. `this._totalBudgetEl.textContent = this.money(totalBudg);`
**Syntax**: Property assignment
**Functionality**: Updates total budget display.

### 537. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes element check.

### 538. `if (this._remainingEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if remaining element exists.

### 539. `this._remainingEl.textContent = this.money(remaining);`
**Syntax**: Property assignment
**Functionality**: Updates remaining budget display.

### 540. `if (remaining < 0) {`
**Syntax**: Conditional statement
**Functionality**: Checks if budget is exceeded.

### 541. `this._remainingEl.style.color = remaining < 0 ? "#dc2626" : "inherit";`
**Syntax**: Property assignment with ternary
**Functionality**: Sets red color for negative remaining budget.

### 542. `this._remainingEl.style.fontWeight = remaining < 0 ? "700" : "500";`
**Syntax**: Property assignment with ternary
**Functionality**: Sets bold font for negative remaining budget.

### 543. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes budget check.

### 544. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes element check.

### 545. `}`
**Syntax**: Method closing brace
**Functionality**: Closes updateTotals.

### 546. `private renderGroups(): void {`
**Syntax**: Private method
**Functionality**: Renders all bill category groups.

### 547. `this._root`
**Syntax**: Property access
**Functionality**: Starts DOM query chain.

### 548. `.querySelectorAll<HTMLElement>("[data-group-card]")`
**Syntax**: DOM query with type assertion
**Functionality**: Finds all group card elements.

### 549. `.forEach((card) => {`
**Syntax**: forEach method
**Functionality**: Iterates through each group card.

### 550. `const label = card.getAttribute("data-group-card") ?? "";`
**Syntax**: DOM attribute access with nullish coalescing
**Functionality**: Gets group label from element attribute.

### 551. `const totalEl = card.querySelector<HTMLElement>("[data-group-total]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds total display element within card.

### 552. `const listEl =`
**Syntax**: Variable declaration start
**Functionality**: Begins list element query.

### 553. `card.querySelector<HTMLUListElement>("[data-group-list]");`
**Syntax**: DOM query with type assertion
**Functionality**: Finds list element within card.

### 554. `if (!label || !totalEl || !listEl) {`
**Syntax**: Conditional statement
**Functionality**: Guards against missing elements.

### 555. `return;`
**Syntax**: Return statement
**Functionality**: Skips this card if elements missing.

### 556. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes guard check.

### 557. `const group = this._manager`
**Syntax**: Method chain start
**Functionality**: Begins manager method call.

### 558. `.getGroups()`
**Syntax**: Method call
**Functionality**: Gets all category groups.

### 559. `.find((item) => item.label === label);`
**Syntax**: Array find method
**Functionality**: Finds group matching the card's label.

### 560. `if (!group) {`
**Syntax**: Conditional statement
**Functionality**: Guards against missing group.

### 561. `return;`
**Syntax**: Return statement
**Functionality**: Skips if group not found.

### 562. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes group check.

### 563. `const total = group.getTotalMonthlyImpact();`
**Syntax**: Variable assignment
**Functionality**: Calculates group's total monthly impact.

### 564. `totalEl.textContent = this.money(total);`
**Syntax**: Property assignment
**Functionality**: Updates total display.

### 565. `const budgetVal = this._manager.getCategoryBudget(label);`
**Syntax**: Variable assignment
**Functionality**: Gets budget for this category.

### 566. `const budgetDisplayEl = card.querySelector<HTMLElement>(\`[data-group-budget="${label}"]\`);`
**Syntax**: DOM query with template literal
**Functionality**: Finds budget display element for this category.

### 567. `if (budgetDisplayEl) {`
**Syntax**: Conditional statement
**Functionality**: Checks if budget element exists.

### 568. `budgetDisplayEl.textContent = this.money(budgetVal);`
**Syntax**: Property assignment
**Functionality**: Updates budget display.

### 569. `if (total > budgetVal && budgetVal > 0) {`
**Syntax**: Conditional statement
**Functionality**: Checks if budget is exceeded.

### 570. `budgetDisplayEl.style.color = "#dc2626";`
**Syntax**: Property assignment
**Functionality**: Sets red color for exceeded budget.

### 571. `budgetDisplayEl.style.fontWeight = "bold";`
**Syntax**: Property assignment
**Functionality**: Sets bold font for exceeded budget.

### 572. `} else {`
**Syntax**: Else statement
**Functionality**: Handles case when budget is not exceeded.

### 573. `budgetDisplayEl.style.color = "var(--muted)";`
**Syntax**: Property assignment
**Functionality**: Sets muted color for normal budget.

### 574. `budgetDisplayEl.style.fontWeight = "normal";`
**Syntax**: Property assignment
**Functionality**: Sets normal font weight.

### 575. `}`
**Syntax**: Else closing brace
**Functionality**: Closes budget check.

### 576. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes budget element check.

### 577. `listEl.replaceChildren();`
**Syntax**: DOM manipulation
**Functionality**: Clears existing list items.

### 578. `const sortedItems = [...group.items].sort(`
**Syntax**: Array spread and sort
**Functionality**: Creates sorted copy of group items.

### 579. `(a, b) => b.priority() - a.priority(),`
**Syntax**: Arrow function comparator
**Functionality**: Sorts by priority descending (higher priority first).

### 580. `);`
**Syntax**: Method call closing
**Functionality**: Closes sort method.

### 581. `sortedItems.forEach((item) => {`
**Syntax**: Array forEach
**Functionality**: Iterates through sorted items.

### 582. `const listItem = document.createElement("li");`
**Syntax**: DOM element creation
**Functionality**: Creates list item element.

### 583. `const billTypeLabel = item.getBillTypeLabel();`
**Syntax**: Variable assignment
**Functionality**: Gets human-readable bill type.

### 584. `let cycleIndicator = "";`
**Syntax**: Variable declaration
**Functionality**: Initializes cycle indicator string.

### 585. `if (item instanceof Subscription) {`
**Syntax**: Type guard with instanceof
**Functionality**: Checks if item is a subscription.

### 586. `cycleIndicator = \` (${item.cycle === "annual" ? "Annual" : "Monthly"})\`;`
**Syntax**: Template literal assignment
**Functionality**: Sets cycle indicator based on subscription type.

### 587. `}`
**Syntax**: Conditional closing brace
**Functionality**: Closes subscription check.

### 588. `listItem.setAttribute("data-bill-type", billTypeLabel);`
**Syntax**: DOM attribute setting
**Functionality**: Sets data attribute for styling.

### 589. `const content = document.createElement("div");`
**Syntax**: DOM element creation
**Functionality**: Creates content container.

### 590. `content.className = "bill-name";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class.

### 591. `content.textContent = item.name;`
**Syntax**: Property assignment
**Functionality**: Sets bill name text.

### 592. `listItem.appendChild(content);`
**Syntax**: DOM manipulation
**Functionality**: Adds content to list item.

### 593. `const note = document.createElement("p");`
**Syntax**: DOM element creation
**Functionality**: Creates note paragraph.

### 594. `note.className = "bill-note";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class.

### 595. `note.textContent = \`${billTypeLabel}${cycleIndicator}\`;`
**Syntax**: Template literal assignment
**Functionality**: Sets note text with type and cycle.

### 596. `listItem.appendChild(note);`
**Syntax**: DOM manipulation
**Functionality**: Adds note to list item.

### 597. `const value = document.createElement("span");`
**Syntax**: DOM element creation
**Functionality**: Creates value span.

### 598. `value.className = "bill-value";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class.

### 599. `value.textContent = this.money(item.monthlyImpact());`
**Syntax**: Property assignment
**Functionality**: Sets formatted amount.

### 600. `listItem.appendChild(value);`
**Syntax**: DOM manipulation
**Functionality**: Adds value to list item.

### 601. `const deleteButton = document.createElement("button");`
**Syntax**: DOM element creation
**Functionality**: Creates delete button.

### 602. `deleteButton.className = "delete-button";`
**Syntax**: Property assignment
**Functionality**: Sets CSS class.

### 603. `deleteButton.type = "button";`
**Syntax**: Property assignment
**Functionality**: Sets button type.

### 604. `deleteButton.textContent = "Delete";`
**Syntax**: Property assignment
**Functionality**: Sets button text.

### 605. `deleteButton.setAttribute("aria-label", \`Delete ${item.name}\`);`
**Syntax**: DOM attribute setting
**Functionality**: Sets accessibility label.

### 606. `deleteButton.setAttribute("data-delete-id", item.id);`
**Syntax**: DOM attribute setting
**Functionality**: Sets bill ID for deletion.

### 607. `deleteButton.setAttribute("data-group", group.label);`
**Syntax**: DOM attribute setting
**Functionality**: Sets group label for deletion.

### 608. `listItem.appendChild(deleteButton);`
**Syntax**: DOM manipulation
**Functionality**: Adds delete button to list item.

### 609. `listEl.appendChild(listItem);`
**Syntax**: DOM manipulation
**Functionality**: Adds list item to list.

### 610. `});`
**Syntax**: forEach closing
**Functionality**: Closes item iteration.

### 611. `});`
**Syntax**: forEach closing
**Functionality**: Closes card iteration.

### 612. `}`
**Syntax**: Method closing brace
**Functionality**: Closes renderGroups.

### 613. `private newId(prefix: string): string {`
**Syntax**: Private method
**Functionality**: Generates unique IDs with prefix.

### 614. `return \`${prefix}-${crypto.randomUUID()}\`;`
**Syntax**: Template literal return
**Functionality**: Returns prefixed UUID.

### 615. `}`
**Syntax**: Method closing brace
**Functionality**: Closes newId.

### 616. `private money(value: number): string {`
**Syntax**: Private method
**Functionality**: Formats numbers as currency.

### 617. `return \`₱${value.toFixed(2)}\`;`
**Syntax**: Template literal return
**Functionality**: Returns peso-formatted string with 2 decimal places.

### 618. `}`
**Syntax**: Method closing brace
**Functionality**: Closes money.

### 619. `}`
**Syntax**: Class closing brace
**Functionality**: Closes TrackerUI class.

### 620. `// NOTE: Initialization`
**Syntax**: Comment
**Functionality**: Indicates application initialization section.

### 621. `const groups: CategoryGroup[] = [`
**Syntax**: Array declaration with type annotation
**Functionality**: Creates array of category groups.

### 622. `new CategoryGroup("Subscriptions"),`
**Syntax**: Object instantiation
**Functionality**: Creates subscriptions group.

### 623. `new CategoryGroup("Utilities"),`
**Syntax**: Object instantiation
**Functionality**: Creates utilities group.

### 624. `new CategoryGroup("Debts"),`
**Syntax**: Object instantiation
**Functionality**: Creates debts group.

### 625. `];`
**Syntax**: Array closing
**Functionality**: Closes groups array.

### 626. `const manager = new BillManager(groups);`
**Syntax**: Object instantiation
**Functionality**: Creates bill manager instance.

### 627. `new TrackerUI(document.querySelector<HTMLDivElement>("#app")!, manager).render();`
**Syntax**: Object instantiation and method call
**Functionality**: Creates UI instance and renders the application.

---

## Key Design Patterns and Concepts

1. **Object-Oriented Design**: Abstract classes with inheritance hierarchy
2. **Factory Pattern**: BillManager.createBill() method
3. **Observer Pattern**: UI updates through render() calls
4. **Strategy Pattern**: Different monthlyImpact calculations per bill type
5. **Template Method Pattern**: Abstract methods defining required implementations
6. **Composition over Inheritance**: CategoryGroup containing Bill arrays
7. **TypeScript Features**: Union types, generics, type assertions, optional chaining

## Error Handling

- Input validation with custom error messages
- Null/undefined guards throughout DOM manipulation
- Try-catch blocks for validation testing
- Graceful degradation when DOM elements are missing

## Performance Considerations

- History limited to 10 entries to prevent memory bloat
- Efficient DOM queries using data attributes
- Minimal re-renders through targeted updates
- Event delegation for dynamic content

This comprehensive analysis shows how the Bill Tracker application implements a robust, type-safe bill management system with a clean separation of concerns between data management, business logic, and UI rendering.