type Transaction = {
  type: "deposit" | "withdraw" | "transfer-in" | "transfer-out";
  amount: number;
  date: Date;
  description: string;
};

class BankAccount {
  // TODO: 宣告屬性
  //   - owner: 外部可讀但不可改（readonly）
  //   - balance: 外部完全不能直接存取（private）
  //   - transactionHistory: 外部不能直接改（private）
  readonly owner: string;
  private balance: number;
  private transactionHistory: Transaction[];

  constructor(owner: string, initialBalance: number = 0) {
    // TODO: 初始化屬性
    this.owner = owner;
    this.balance = initialBalance;
    this.transactionHistory = [];
  }

  deposit(amount: number, type: "deposit" | "transfer-in" = "deposit"): void {
    // TODO: 金額必須 > 0，否則丟 Error
    // 成功後記錄到 transactionHistory
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than 0");
    }
    this.balance += amount;
    this.transactionHistory.push({
      type: type,
      amount,
      date: new Date(),
      description: "Deposit",
    });
  }

  withdraw(
    amount: number,
    type: "withdraw" | "transfer-out" = "withdraw",
  ): void {
    // TODO: 金額必須 > 0，且不能超過餘額，否則丟 Error
    // 成功後記錄到 transactionHistory
    if (amount <= 0 || amount > this.balance) {
      throw new Error("Invalid withdraw amount");
    }
    this.balance -= amount;
    this.transactionHistory.push({
      type: type,
      amount,
      date: new Date(),
      description: "Withdraw",
    });
  }

  getBalance(): number {
    // TODO
    return this.balance;
  }

  getTransactionHistory(): readonly Transaction[] {
    // TODO: 回傳 history 的唯讀副本，避免外部直接 mutate 內部陣列
    return this.transactionHistory.slice(); // 或者使用 Object.freeze([...this.transactionHistory])
  }

  transferTo(target: BankAccount, amount: number): void {
    // TODO: 從自己帳戶提款，存入對方帳戶
    // 提示：如果提款失敗，對方帳戶不應該有任何變動（atomic）
    this.withdraw(amount, "transfer-out");
    target.deposit(amount, "transfer-in");
  }
}

// ====== 試跑區（完成後取消註解來測試）======
//
const alice = new BankAccount("Alice", 1000);
const bob = new BankAccount("Bob", 500);

alice.deposit(200);
console.log(alice.getBalance()); // 1200

alice.withdraw(100);
console.log(alice.getBalance()); // 1100

alice.transferTo(bob, 300);
console.log(alice.getBalance()); // 800
console.log(bob.getBalance()); // 800

console.log(alice.getTransactionHistory());
//
// // 以下應該會報錯：
// alice.deposit(-100);
// alice.withdraw(9999);
// (alice as any).balance = 999999; // 如果用 #balance 則 runtime 也擋
