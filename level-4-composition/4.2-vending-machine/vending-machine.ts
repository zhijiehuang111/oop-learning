/**
 * Exercise 4.2 — Vending Machine（State Pattern）
 *
 * 把「販賣機在不同狀態下行為不同」這件事，從 if/else 分支
 * 改寫成「每個狀態一個 class」，VendingMachine 持有 current state
 * 並把所有動作 delegate 給它。
 */

// ──────────────────────────────────────────────────────────
// Domain types
// ──────────────────────────────────────────────────────────

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface Inventory {
  /** 還剩幾個（0 代表缺貨） */
  getStock(productId: string): number;
  decrementStock(productId: string): void;
  getProduct(productId: string): Product | undefined;
  /** 是否「整台機器」都沒貨（所有 product 都 0） */
  isEmpty(): boolean;
}

// ──────────────────────────────────────────────────────────
// State interface
// ──────────────────────────────────────────────────────────

/**
 * 每個狀態都實作這四個動作。
 * 在「不該執行」的狀態下，請丟 Error（例如 Idle 下不能 dispense）。
 *
 * 提示：state 物件需要能改變 machine 的 current state，所以
 * 可以讓 method 接收 machine 參考，或在建構時注入。自己決定。
 */
export interface VendingMachineState {
  insertCoin(amount: number): void;
  selectProduct(productId: string): void;
  dispense(): void;
  refund(): void;

  /** 給外部觀察用（例如顯示在螢幕上） */
  readonly name: 'Idle' | 'HasMoney' | 'Dispensing' | 'OutOfStock';
}

// ──────────────────────────────────────────────────────────
// VendingMachine（context）
// ──────────────────────────────────────────────────────────

export class VendingMachine {
  // TODO: 持有 current state、inventory、目前投入的金額、目前選擇的 product
  // TODO: 提供一個給 state 物件用的 setState() 或類似方法
  // TODO: 對外暴露 insertCoin / selectProduct / dispense / refund
  //       全部 delegate 給 currentState
  // TODO: 暴露一些 read-only getter 讓 state class 讀內部資料
  //       （例如 currentBalance、selectedProductId、inventory）

  constructor(inventory: Inventory) {
    // TODO
  }

  // 範例 API（簽章自己決定，但對外行為要對）
  insertCoin(amount: number): void {
    // TODO
  }

  selectProduct(productId: string): void {
    // TODO
  }

  dispense(): void {
    // TODO
  }

  refund(): void {
    // TODO
  }

  /** 取得目前狀態名稱（debug / UI 用） */
  get stateName(): VendingMachineState['name'] {
    // TODO
    throw new Error('not implemented');
  }
}

// ──────────────────────────────────────────────────────────
// 各狀態實作（每個狀態一個 class）
// ──────────────────────────────────────────────────────────

// TODO: class IdleState implements VendingMachineState
//   - insertCoin: 累加金額，切到 HasMoney
//   - selectProduct: 丟錯（還沒投錢）
//   - dispense: 丟錯
//   - refund: 不做事（沒錢可退）或丟錯，自己選一致的設計

// TODO: class HasMoneyState implements VendingMachineState
//   - insertCoin: 繼續累加
//   - selectProduct: 檢查 product 是否存在、是否有庫存、金額是否足夠
//                    若 OK，切到 Dispensing
//   - dispense: 丟錯（要先 selectProduct）
//   - refund: 退錢、清空 selected，切回 Idle

// TODO: class DispensingState implements VendingMachineState
//   - insertCoin / selectProduct / refund: 在出貨中通常都不允許，丟錯
//   - dispense: 扣庫存、找零、清空狀態
//                若 inventory.isEmpty() 切到 OutOfStock，否則切回 Idle

// TODO: class OutOfStockState implements VendingMachineState
//   - 所有「會推進交易」的動作都丟錯
//   - 唯一例外：如果還有錢沒退，refund 應該能退錢

// ──────────────────────────────────────────────────────────
// Usage（寫完取消註解試跑）
// ──────────────────────────────────────────────────────────

// const inventory: Inventory = /* TODO: 自己做一個簡單實作或 mock */;
// const vm = new VendingMachine(inventory);
//
// vm.insertCoin(50);
// vm.insertCoin(50);
// vm.selectProduct('coke');
// vm.dispense();
// console.log(vm.stateName); // 'Idle' or 'OutOfStock'
//
// // 錯誤情境：
// // vm.dispense();              // Idle 下丟錯
// // vm.selectProduct('coke');   // Idle 下丟錯
