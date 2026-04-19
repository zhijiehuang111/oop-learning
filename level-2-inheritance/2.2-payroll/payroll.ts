// Exercise 2.2 — Employee 薪資系統
//
// 設計一個 Employee 繼承階層：
//   Employee (base)
//     ├─ FullTimeEmployee   固定月薪
//     ├─ PartTimeEmployee   時薪 × 工時
//     └─ Contractor         按專案計費
//
// Payroll 接收 Employee[]，算出本月總支出。
// 重點：以父類別型別操作子類別（多型）。

// TODO: 決定 Employee 是 abstract class 還是普通 class
//       （提示：calculateMonthlyPay 有通用實作嗎？）
abstract class Employee {
  // TODO: 共用屬性（name、id 之類）
  //       哪些要 readonly？哪些要 protected？哪些要 private？
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }

  // TODO: getName(): string
  // getName() {
  //   return this.name;
  // }

  // TODO: 宣告 calculateMonthlyPay() —— abstract 還是有 default？
  abstract calculateMonthlyPay(): number;
}

function assertNonNegative(value: number, name: string): void {
  if (value < 0) {
    throw new Error(`${name} cannot be negative`);
  }
}
// ---------- FullTimeEmployee ----------
// 固定月薪。constructor 收 name + monthlySalary。
class FullTimeEmployee extends Employee {
  // TODO
  private monthlySalary: number;
  constructor(name: string, monthlySalary: number) {
    super(name);
    assertNonNegative(monthlySalary, "Monthly salary");
    this.monthlySalary = monthlySalary;
  }
  calculateMonthlyPay(): number {
    return this.monthlySalary;
  }
}

// ---------- PartTimeEmployee ----------
// 時薪制。constructor 收 name + hourlyRate + hoursWorked。
// 月薪 = hourlyRate * hoursWorked
class PartTimeEmployee extends Employee {
  // TODO
  private hourlyRate: number;
  private hoursWorked: number;
  constructor(name: string, hourlyRate: number, hoursWorked: number) {
    super(name);
    assertNonNegative(hourlyRate, "Hourly rate");
    assertNonNegative(hoursWorked, "Hours worked");
    this.hourlyRate = hourlyRate;
    this.hoursWorked = hoursWorked;
  }
  calculateMonthlyPay(): number {
    return this.hourlyRate * this.hoursWorked;
  }
}

// ---------- Contractor ----------
// 按專案計費。constructor 收 name + projectFee + projectsCompletedThisMonth。
// 月薪 = projectFee * projectsCompletedThisMonth
class Contractor extends Employee {
  // TODO
  private projectFee: number;
  private projectsCompletedThisMonth: number;
  constructor(
    name: string,
    projectFee: number,
    projectsCompletedThisMonth: number,
  ) {
    super(name);
    assertNonNegative(projectFee, "Project fee");
    assertNonNegative(projectsCompletedThisMonth, "Projects completed");
    this.projectFee = projectFee;
    this.projectsCompletedThisMonth = projectsCompletedThisMonth;
  }
  calculateMonthlyPay(): number {
    return this.projectFee * this.projectsCompletedThisMonth;
  }
}

// ---------- Payroll ----------
// 接收一組 Employee，負責計算本月總支出。
// 注意：Payroll 不該 care 每個人是哪種子類別。
class Payroll {
  // TODO: 用什麼資料結構存 employees？外部能直接改嗎？
  private employees: Employee[];

  constructor(employees: Employee[] = []) {
    // TODO
    this.employees = [...employees];
  }

  // 加入員工
  addEmployee(employee: Employee): void {
    // TODO
    this.employees.push(employee);
  }

  // 本月總支出
  totalMonthlyPayout(): number {
    // TODO
    let total = 0;
    for (const employee of this.employees) {
      total += employee.calculateMonthlyPay();
    }
    return total;
  }

  // 列出每位員工的薪資明細：{ name, pay }[]
  payslips(): { name: string; pay: number }[] {
    // TODO
    return this.employees.map((employee) => ({
      name: employee.name,
      pay: employee.calculateMonthlyPay(),
    }));
  }
}

// ---------- 使用範例（寫完後取消註解測試） ----------
const alice = new FullTimeEmployee("Alice", 60000);
const bob = new PartTimeEmployee("Bob", 500, 80);
const carol = new Contractor("Carol", 15000, 3);

const payroll = new Payroll();
payroll.addEmployee(alice);
payroll.addEmployee(bob);
payroll.addEmployee(carol);

console.log(payroll.totalMonthlyPayout()); // 60000 + 40000 + 45000 = 145000
console.log(payroll.payslips());
