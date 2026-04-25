// Exercise 3.2 — Payment Gateway
// 學習重點：DIP（依賴反轉）—— Checkout 依賴 interface，不依賴具體實作

// ---------- Types ----------
let id = 0;

export type PaymentResult = {
  // TODO: 設計這個 type
  // 想想：成功/失敗都要回傳同一種型別嗎？還是用 discriminated union？
  success: boolean;
  transactionId?: number; // 成功時有 transactionId，失敗時沒有
};

// ---------- Interface ----------

export interface PaymentMethod {
  // TODO: 定義 pay 和 refund 的 signature
  pay(amount: number): Promise<PaymentResult>;
  refund(): Promise<void>;
}

// ---------- Concrete payment methods ----------

export class CreditCardPayment implements PaymentMethod {
  // TODO
  // constructor 收 cardNumber, cvv

  private lastTransactionId: number | null = null;
  constructor(
    private cardNumber: string,
    private cvv: string,
  ) {}
  // pay 內部 mock：產 transactionId、模擬成功
  async pay(amount: number): Promise<PaymentResult> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    console.log(
      `Processing credit card payment of $${amount} for card ${this.cardNumber} with CVV ${this.cvv}`,
    );
    const lastId = id++;
    this.lastTransactionId = lastId;
    return { success: true, transactionId: lastId };
  }
  // refund 內部 mock：transactionId 沒見過要 reject
  async refund(): Promise<void> {
    if (this.lastTransactionId === null)
      throw new Error("No transactions to refund");

    console.log(
      `Refunding credit card payment with transaction ID ${this.lastTransactionId} for card ${this.cardNumber}`,
    );
  }
}

export class PayPalPayment implements PaymentMethod {
  private lastTransactionId: number | null = null;
  // TODO: constructor 收 email
  constructor(private email: string) {}

  // pay 內部 mock：產 transactionId、模擬成功
  async pay(amount: number): Promise<PaymentResult> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    console.log(
      `Processing PayPal payment of $${amount} for email ${this.email}`,
    );
    const lastId = id++;
    this.lastTransactionId = lastId;
    return { success: true, transactionId: lastId };
  }
  // refund 內部 mock：transactionId 沒見過要 reject
  async refund(): Promise<void> {
    if (this.lastTransactionId === null)
      throw new Error("No transactions to refund");

    console.log(
      `Refunding PayPal payment with transaction ID ${this.lastTransactionId} for email ${this.email}`,
    );
  }
}

export class CryptoPayment implements PaymentMethod {
  private lastTransactionId: number | null = null;
  // TODO: constructor 收 walletAddress, currency ('BTC' | 'ETH')
  constructor(
    private walletAddress: string,
    private currency: "BTC" | "ETH",
  ) {}

  // pay 內部 mock：產 transactionId、模擬成功
  async pay(amount: number): Promise<PaymentResult> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    console.log(
      `Processing ${this.currency} payment of $${amount} for wallet ${this.walletAddress}`,
    );
    const lastId = id++;
    this.lastTransactionId = lastId;
    return { success: true, transactionId: lastId };
  }
  // refund 內部 mock：transactionId 沒見過要 reject
  async refund(): Promise<void> {
    if (this.lastTransactionId === null)
      throw new Error("No transactions to refund");

    console.log(
      `Refunding ${this.currency} payment with transaction ID ${this.lastTransactionId} for wallet ${this.walletAddress}`,
    );
  }
}

// ---------- Checkout ----------

export class Checkout {
  // TODO
  // constructor 接受任何 PaymentMethod

  constructor(private paymentMethod: PaymentMethod) {}
  // process(amount): 呼叫 pay，記錄成功的交易
  async process(amount: number): Promise<PaymentResult> {
    return this.paymentMethod.pay(amount);
  }
  // refundLast(): 退款最近一筆成功的交易，沒有就 throw
  async refundLast(): Promise<void> {
    this.paymentMethod.refund();
  }
}

// ---------- 使用範例（寫完後解開來試）----------

async function demo() {
  const card = new CreditCardPayment("4242-4242-4242-4242", "123");
  const paypal = new PayPalPayment("alice@example.com");

  const checkout1 = new Checkout(card);
  const r1 = await checkout1.process(100);
  console.log(r1);
  await checkout1.refundLast();

  // 同一個 Checkout 介面，換成 PayPal 也能用
  const checkout2 = new Checkout(paypal);
  await checkout2.process(50);
}

demo();
