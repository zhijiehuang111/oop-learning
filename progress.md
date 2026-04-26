# OOP 學習進度

## 進行中

- [ ] 4.1 Library System

## 已完成

- [x] 1.1 BankAccount — 收穫：封裝基礎到位，注意 class 內部 method 之間也要避免重複驗證邏輯；API 設計避免 boolean parameter，用具名 string literal 取代
- [x] 1.2 Stack/Queue — 收穫：泛型 class 語法熟練；getter 寫 size 比 method 更符合語意；理解 is-a vs has-a，繼承表達身份、組合表達能力，不確定就用組合
- [x] 2.1 Shape hierarchy — 收穫：abstract class + Template Method 的搭配；共用常數（如 π）要用 `static readonly` 而非 instance field；constructor 內複雜驗證抽成 static helper，super() 永遠放最前
- [x] 2.2 Employee 薪資系統 — 收穫：多型取代分支（Payroll 無 instanceof）；`readonly` public field 就是 getter，不用再包一層 `getName()`；collection constructor 要 defensive copy（`[...arr]`）防 array aliasing 漏洞
- [x] 3.1 Animal Kingdom — 收穫：abstract class 建模身份、interface 建模能力；type guard 用 `in` operator 篩 Swimmer；constructor 只做 super() 呼叫時可省略；getter/setter 命名走 property 慣例（`age`），validation 集中在 setter 由 constructor 復用
- [x] 3.2 Payment Gateway — 收穫：DIP 在 Checkout 層做到了，但 interface 設計也要符合 DIP——`refund()` 該收 transactionId 而不是讓 payment method 自己記 lastTransactionId（狀態歸屬錯誤會反向限制使用情境）

## 筆記 / 重點
