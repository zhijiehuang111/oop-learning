# Exercise 3.2 — Payment Gateway Review

> 整體：DIP 的核心抓到了——`Checkout` 依賴 `PaymentMethod` interface，三個實作可以互換。
> 但 interface 設計上偏離了原始需求，導致退款語意被簡化掉，這是這次最該抓回來的點。

---

## ✅ 做得好的

1. **`Checkout` 的依賴方向對了**（payment.ts:124）
   `constructor(private paymentMethod: PaymentMethod)` 收的是 interface，不是任何具體 class。
   這就是 DIP——`Checkout` 一行都不用改就能換 payment method。也用了 parameter property（`private` 在 constructor 參數上）省掉重複的 field 宣告，這是熟練的 TS 寫法。

2. **驗證錯誤用 `throw` 而不是回傳 `{ success: false }`**（payment.ts:35-37）
   `pay(0)` / `pay(-1)` 直接 throw，符合「呼叫端搞錯」這種 programmer error 該爆炸的語意。回傳 `success: false` 會讓呼叫端忘了檢查就出事。

3. **三個 payment method 結構一致、職責清楚**
   每個 class 自己管自己的 `lastTransactionId`，`Checkout` 不碰交易紀錄。這個分工是對的——退款怎麼做是 payment method 的事。

---

## 🔧 可以改進

### 1. ⚠️ `refund()` 失去 transactionId 參數，退款語意被閹割了

**位置：** payment.ts:19, 47, 76, 108, 131

**現況：**
```ts
interface PaymentMethod {
  refund(): Promise<void>;  // ❌ 沒有參數
}

// 各 payment 內部用 this.lastTransactionId 退款
async refund(): Promise<void> {
  if (this.lastTransactionId === null) throw ...
  // 退 lastTransactionId
}
```

**問題：**
這個設計把「退款」變成「退這個 payment method 上一次的付款」。但實際上：
- 一個 `CreditCardPayment` 物件可能被多個 `Checkout` 共用（同一張卡付不同訂單）
- 一個 `Checkout` 可能成功付了 3 筆，現在 `refundLast()` 永遠只能退最後那筆，**前 2 筆永遠退不到**
- `lastTransactionId` 還會被下一次 `pay()` 覆蓋掉，等於前一筆交易的退款權限被默默消失

**OOP 原則：** 這違反了 **SRP**——`PaymentMethod` 不該管「上一筆是哪筆」這種狀態，它的職責只是「給我 id，我退錢」。「上一筆」是 `Checkout` 的事。

**正確做法：**
```ts
interface PaymentMethod {
  pay(amount: number): Promise<PaymentResult>;
  refund(transactionId: string): Promise<void>;  // ✅ 收 id
}

class CreditCardPayment implements PaymentMethod {
  // 改成 Set，記錄所有發出去的 id
  readonly #issuedTransactions = new Set<string>();

  async pay(amount: number): Promise<PaymentResult> {
    if (amount <= 0) throw new Error(...);
    const transactionId = crypto.randomUUID();
    this.#issuedTransactions.add(transactionId);
    return { success: true, transactionId };
  }

  async refund(transactionId: string): Promise<void> {
    if (!this.#issuedTransactions.has(transactionId)) {
      throw new Error(`Unknown transaction: ${transactionId}`);
    }
    this.#issuedTransactions.delete(transactionId);
  }
}

class Checkout {
  readonly #successfulIds: string[] = [];

  async process(amount: number): Promise<PaymentResult> {
    const result = await this.#paymentMethod.pay(amount);
    if (result.success) this.#successfulIds.push(result.transactionId!);
    return result;
  }

  async refundLast(): Promise<void> {
    const id = this.#successfulIds.pop();
    if (id === undefined) throw new Error('No transaction to refund');
    await this.#paymentMethod.refund(id);  // ← 把 id 傳回去
  }
}
```

這樣才能滿足驗收條件第 4 條：「`refund` 拿到沒見過的 `transactionId` 會 reject」——你現在的 `refund()` 根本沒收參數，這條沒辦法驗。

---

### 2. `let id = 0` 是 module-level 全域可變狀態

**位置：** payment.ts:5

**問題：**
- 三個 payment method 共用同一個 counter——`CreditCardPayment` 跟 `PayPalPayment` 的交易 id 會交錯（卡 0、PayPal 1、卡 2…），實務上看起來很怪
- module 層級的 `let` 在測試時很難 reset
- 任何 import 這個 module 的人都能 `import { id }` 改它（雖然你沒 export，但這種 pattern 不健康）

**改法：**
用 `crypto.randomUUID()`（Node 18+ / 瀏覽器都有）：
```ts
const transactionId = crypto.randomUUID();
```
不需要 counter、不會碰撞、不需要全域狀態。

如果一定要用遞增 id，把 counter 放在各 class 內 `static`：
```ts
class CreditCardPayment {
  static #nextId = 0;
  // ... 用 CreditCardPayment.#nextId++
}
```
但 UUID 是更好的選擇。

---

### 3. `PaymentResult` 用 optional field，呼叫端拿 `transactionId` 要 `!` 強斷

**位置：** payment.ts:7-12

**現況：**
```ts
type PaymentResult = {
  success: boolean;
  transactionId?: number;
};

// 呼叫端：
if (result.success) {
  this.#successfulIds.push(result.transactionId!);  // ← 必須用 !
}
```

**問題：** TS 不知道 `success: true` 就一定有 `transactionId`。每次都要 `!` 是設計沒到位的訊號。

**改成 discriminated union：**
```ts
type PaymentResult =
  | { status: 'ok'; transactionId: string }
  | { status: 'failed'; reason: string };

// 呼叫端：
if (result.status === 'ok') {
  this.#successfulIds.push(result.transactionId);  // ✅ TS 自動縮窄，不用 !
}
```

不過注意：你目前的實作沒有任何「業務上失敗」的路徑（金額錯就 throw 了），所以實務上 `failed` 那一支用不到。可以先用 union 但只有 `'ok'` 一支，未來要加再擴。

---

### 4. `Checkout.refundLast` 沒 `await`，且沒實作「沒交易就 throw」

**位置：** payment.ts:130-132

**現況：**
```ts
async refundLast(): Promise<void> {
  this.paymentMethod.refund();  // ❌ 沒 await
}
```

兩個問題：
- 沒 `await`：如果底層 `refund` 之後改成真的會 reject，呼叫端的 `await checkout.refundLast()` 不會收到錯誤
- 沒記錄成功交易、也沒檢查「沒交易」的情況

驗收條件第 5 條（「`refundLast()` 沒交易時要 throw」）你目前是借用 `lastTransactionId === null` 的 throw 撐過去的，但這只是巧合——按 #1 的修正之後，這個邏輯該回到 `Checkout` 自己手上。

---

## 💡 延伸思考

`#issuedTransactions` 用 `Set` 還是 `Map`？

如果之後要加「同一筆不能重複退款」、「退款金額」、「退款時間」，`Set<string>` 就不夠了，要改 `Map<string, TransactionRecord>`。
**問題：** 你會選擇現在就用 `Map`（為未來準備）、還是先 `Set`、要的時候再改？

（提示：這牽涉到「YAGNI」vs「設計前瞻性」的取捨，沒有標準答案，但你的選擇會反映你的工程價值觀。）

---

## 收穫一句話

DIP 抓到了；下一步是練「interface 的設計也要符合 DIP」——`refund()` 收不收 id，反映的是「狀態屬於誰」這個更深的問題。
