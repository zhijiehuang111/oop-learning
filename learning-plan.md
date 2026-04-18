# OOP 學習計畫 (TypeScript)

> 為有兩年前端經驗、想往 full-stack / general SWE 發展的工程師設計。
> 每題設計為 30–60 分鐘可完成，由淺入深，涵蓋 OOP 核心觀念 + 經典設計模式。

## 學習目標

完成本計畫後，你應該能夠：

1. **熟練使用 TypeScript 的 class 語法**：constructor、屬性、方法、存取修飾子（`public` / `private` / `protected` / `readonly`）
2. **掌握 OOP 四大支柱**：封裝（Encapsulation）、繼承（Inheritance）、多型（Polymorphism）、抽象（Abstraction）
3. **理解 SOLID 原則**，尤其是單一職責（SRP）、開放封閉（OCP）、依賴反轉（DIP）
4. **會用經典設計模式**解決實際問題：Observer、Strategy、Factory、Singleton
5. **分辨「繼承 vs 組合」**的取捨，能選擇合適的建模方式

## 前置知識速查

在開始寫題之前，先熟悉這些 TypeScript 語法：

| 概念 | 關鍵字 / 語法 |
| --- | --- |
| 類別宣告 | `class Foo { ... }` |
| 建構子 | `constructor(...)` |
| 存取修飾子 | `public` / `private` / `protected` / `readonly` |
| 繼承 | `class Dog extends Animal` |
| 抽象類別 | `abstract class Shape` / `abstract method(): void` |
| 介面 | `interface Printable { print(): void }` |
| 實作介面 | `class Doc implements Printable` |
| 靜態成員 | `static count = 0` |
| Getter / Setter | `get name() {}` / `set name(v) {}` |

> 小提醒：TypeScript 裡的 `private` 是**編譯期**檢查，ES 私有欄位 `#field` 是**執行期**真正私有。兩者都會在題目中出現。

---

## Level 1 — 類別與封裝（Encapsulation）

目標：習慣用 class 組織狀態與行為，理解為什麼要隱藏內部細節。

### Exercise 1.1 — BankAccount（銀行帳戶）⭐ 經典入門題

實作一個 `BankAccount` 類別：

- 屬性：`owner`（唯讀）、`balance`（外部不能直接改）
- 方法：
  - `deposit(amount: number): void`：金額必須 > 0，否則丟錯
  - `withdraw(amount: number): void`：金額必須 > 0 且不能超過餘額
  - `getBalance(): number`
  - `transferTo(target: BankAccount, amount: number): void`
- 進階：加上 `transactionHistory`，記錄每筆交易

**學習重點**：`private` / `readonly`、為何要用 method 操作而非直接改屬性（資料完整性）。

---

### Exercise 1.2 — Stack<T> / Queue<T>（泛型資料結構）

實作一個泛型的 `Stack<T>` 與 `Queue<T>`，支援：

- `push(item: T)` / `enqueue(item: T)`
- `pop()` / `dequeue()`：回傳 `T | undefined`
- `peek()`
- `size` (getter)
- `isEmpty()`

**學習重點**：泛型類別、getter、封裝內部 array。

---

## Level 2 — 繼承與多型（Inheritance & Polymorphism）

目標：學會用繼承共用邏輯，並透過多型讓不同子類有不同行為。

### Exercise 2.1 — Shape 階層 ⭐ 經典題

設計一個 `Shape` 抽象類別，衍生出 `Circle`、`Rectangle`、`Triangle`：

- `abstract area(): number`
- `abstract perimeter(): number`
- 共用方法：`describe(): string` 回傳 `"A Circle with area 12.57 and perimeter 12.57"`

接著寫一個 `totalArea(shapes: Shape[]): number`，展示多型的威力——呼叫端不需要知道具體是哪種 Shape。

**學習重點**：`abstract class`、多型、LSP（Liskov 替換原則）。

---

### Exercise 2.2 — Employee 薪資系統

建立 `Employee` 基底類別，衍生出：

- `FullTimeEmployee`：固定月薪
- `PartTimeEmployee`：時薪 × 工時
- `Contractor`：按專案計費

共同介面：`calculateMonthlyPay(): number`、`getName()`。

寫一個 `Payroll` 類別，接收 `Employee[]`，算出本月總支出。

**學習重點**：繼承階層設計、以父類別型別操作子類別（多型）。

---

## Level 3 — 抽象與介面（Abstraction & Interface）

目標：理解「what」vs「how」的分離，學會用 interface 定義契約。

### Exercise 3.1 — Animal Kingdom

用 `abstract class Animal` 定義：

- `abstract makeSound(): string`
- `abstract move(): string`
- 共用 `name`、`age`

實作 `Dog`、`Cat`、`Bird`、`Fish`（每種移動與叫聲都不同）。

延伸：加上 interface `Swimmer { swim(): void }`、`Flyer { fly(): void }`，
讓 `Fish implements Swimmer`、`Bird implements Flyer`、`Duck implements Swimmer, Flyer`。

**學習重點**：abstract class vs interface 的差異、多重介面實作、能力（capability）的建模。

---

### Exercise 3.2 — Payment Gateway

定義 interface `PaymentMethod`：

```ts
interface PaymentMethod {
  pay(amount: number): Promise<PaymentResult>;
  refund(transactionId: string): Promise<void>;
}
```

實作 `CreditCardPayment`、`PayPalPayment`、`CryptoPayment`（內部實作可以用 mock 資料）。

寫一個 `Checkout` 類別，接收任何 `PaymentMethod`，完成結帳。

**學習重點**：依賴介面而非具體實作（DIP，依賴反轉原則）——這是從前端轉 backend 最重要的思維之一。

---

## Level 4 — 組合 vs 繼承、SOLID

目標：理解「is-a」vs「has-a」的取捨，開始用 SOLID 檢視自己的設計。

### Exercise 4.1 — Library System ⭐ 經典題

建模一個圖書館：

- `Book`（id、title、author、isAvailable）
- `Member`（id、name、borrowedBooks）
- `Library`（books、members）
  - `borrowBook(memberId, bookId)`：檢查書是否可借、該會員是否超過上限（例如 3 本）
  - `returnBook(memberId, bookId)`
  - `searchByAuthor(author)`

**學習重點**：物件之間的協作（collaboration）、職責分配（SRP）、如何用 class 取代散落的 function + 全域狀態。

---

### Exercise 4.2 — Vending Machine（販賣機狀態機）

販賣機有幾種狀態：`Idle`、`HasMoney`、`Dispensing`、`OutOfStock`。

- 支援：`insertCoin(amount)`、`selectProduct(id)`、`dispense()`、`refund()`
- 不同狀態下，可執行的動作不同（例如 Idle 下不能 dispense）
- 嘗試用 **State Pattern**：每個狀態一個 class，`VendingMachine` 持有 current state

**學習重點**：組合優於繼承、State 模式、把「if/else 分支」轉成「多型物件」。

---

## Level 5 — 經典設計模式

目標：認識四個前端工程師最常遇到、CP 值最高的設計模式。

### Exercise 5.1 — Observer / EventEmitter ⭐ 前端最熟

實作一個 `EventEmitter`：

```ts
class EventEmitter<EventMap extends Record<string, any[]>> {
  on<K extends keyof EventMap>(event: K, listener: (...args: EventMap[K]) => void): void;
  off<K extends keyof EventMap>(event: K, listener: (...args: EventMap[K]) => void): void;
  emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): void;
}
```

使用範例：

```ts
const bus = new EventEmitter<{
  login: [userId: string];
  logout: [];
}>();
bus.on('login', (id) => console.log(`Hello ${id}`));
bus.emit('login', 'alice');
```

**學習重點**：Observer 模式、TypeScript 進階泛型、和 React/Vue 的 event system 做對應。

---

### Exercise 5.2 — Strategy Pattern（排序策略）

實作一個 `Sorter<T>`，接收一個 `CompareStrategy<T>`：

```ts
interface CompareStrategy<T> {
  compare(a: T, b: T): number;
}
```

提供 `AscendingNumber`、`DescendingNumber`、`AlphabeticalString`、`ByPropertyStrategy<T, K>` 等策略。

**學習重點**：Strategy 模式、用介面把「行為」當成物件傳遞。這是取代 `if/else` 分支最常見的技巧。

---

### Exercise 5.3 — Factory Pattern

設計一個 `NotificationFactory`，根據 config 建立不同的通知通道：
`EmailNotification`、`SMSNotification`、`PushNotification`、`SlackNotification`。

```ts
const notifier = NotificationFactory.create({ type: 'email', to: 'a@b.com' });
notifier.send('Hello');
```

**學習重點**：Factory 模式、把物件建立的複雜度集中管理。

---

### Exercise 5.4 — Singleton（Logger / Config）

實作一個全域唯一的 `Logger`：

- `Logger.getInstance()` 永遠回傳同一個實例
- 支援 `info`、`warn`、`error` 三種等級
- 可設定輸出目的地（console / memory buffer）

**學習重點**：Singleton 的利與弊（測試友善度差、隱式全域狀態），知道什麼時候**不該**用它。

---

## 建議的學習順序與節奏

1. **先寫完 Level 1–2**（大約 4–6 小時），建立對 class 的肌肉記憶
2. **Level 3**（約 2 小時），特別停下來想「interface 和 abstract class 差在哪？什麼時候用哪個？」
3. **Level 4**（約 3 小時），開始練習「拆類別、分職責」
4. **Level 5**（約 4 小時），每個模式寫完後，回想你在前端框架裡有沒有看過類似的結構（其實超多）

## 檔案結構建議

每一題各自獨立一個子資料夾，方便放多個檔案、未來加測試或筆記：

```
oop-learning/
├── learning-plan.md            # ← 這份計畫
├── progress.md                 # ← 練習進度
├── level-1-encapsulation/
│   ├── 1.1-bank-account/
│   │   └── bank-account.ts
│   └── 1.2-stack-queue/
│       ├── stack.ts
│       └── queue.ts
├── level-2-inheritance/
│   ├── 2.1-shapes/
│   │   └── shapes.ts
│   └── 2.2-payroll/
│       └── payroll.ts
├── level-3-abstraction/
│   ├── 3.1-animals/
│   │   └── animals.ts
│   └── 3.2-payment/
│       └── payment.ts
├── level-4-composition/
│   ├── 4.1-library/
│   │   └── library.ts
│   └── 4.2-vending-machine/
│       └── vending-machine.ts
└── level-5-patterns/
    ├── 5.1-event-emitter/
    │   └── event-emitter.ts
    ├── 5.2-sorter-strategy/
    │   └── sorter-strategy.ts
    ├── 5.3-notification-factory/
    │   └── notification-factory.ts
    └── 5.4-logger-singleton/
        └── logger-singleton.ts
```

## 給你的幾個觀念提醒

1. **不要過度繼承**：繼承超過 2 層通常是警訊，優先考慮組合。
2. **先想介面、再想實作**：設計 class 時先問「別人會怎麼用它？」再決定內部細節。
3. **private 是設計決策，不是麻煩**：每個 public 方法都是對外承諾，能 private 就 private。
4. **不確定時，寫測試**：即使只是 `console.assert`，也能幫你驗證設計合不合理。
5. **OOP 是工具不是宗教**：TypeScript 混合了 FP 與 OOP，不需要什麼都硬塞成 class。

---

準備好之後，告訴我你想從哪一題開始，或直接說「開始 Exercise 1.1」，我會補上題目的 starter code、驗收條件，以及你寫完後幫你 code review。
