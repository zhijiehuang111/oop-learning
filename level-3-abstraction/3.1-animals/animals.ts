// Exercise 3.1 — Animal Kingdom
//
// 重點：abstract class 定義「身份」（是什麼動物），interface 定義「能力」（會做什麼）。
// 這題要你體驗兩者的差異：繼承階層負責共用狀態 + 必實作行為，
// interface 則把跨階層的能力（游泳、飛行）拆出來當 mixin 用。

// ---------- Part 1: abstract class ----------

export abstract class Animal {
  // TODO: 共用屬性 name、age
  //  - name 為 readonly（命名後不可改）
  //  - age 可被更新（例如每年過生日），但不能從外部任意設成負數
  //  - 思考：age 要 public、private + getter/setter，還是 protected？選一個並說明
  //    （寫在旁邊 comment 也可以）
  readonly name: string;
  private _age!: number;

  constructor(name: string, age: number) {
    // TODO
    this.name = name;
    this.age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(newAge: number) {
    if (newAge < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = newAge;
  }

  // 每種動物叫聲不同：Dog "Woof"、Cat "Meow"、Bird "Tweet"、Fish "..."
  abstract makeSound(): string;

  // 每種動物移動方式不同：Dog "running"、Cat "walking"、Bird "flying"、Fish "swimming"
  abstract move(): string;

  // 共用方法：回傳類似 "Rex the Dog says Woof and is running"
  // 提示：this.constructor.name 可以拿到子類別名稱，但也可以選擇讓每個子類自己回傳 species
  describe(): string {
    // TODO
    return `${this.name} the ${this.constructor.name} says ${this.makeSound()} and is ${this.move()}`;
  }
}

// ---------- Part 2: interfaces（能力） ----------

// TODO: interface Swimmer { swim(): string }
interface Swimmer {
  swim(): string;
}
// TODO: interface Flyer { fly(): string }
interface Flyer {
  fly(): string;
}

// ---------- Part 3: 具體動物 ----------

// TODO: class Dog extends Animal
class Dog extends Animal {
  makeSound(): string {
    return "Woof";
  }
  move(): string {
    return "running";
  }
}

class Cat extends Animal {
  makeSound(): string {
    return "Meow";
  }
  move(): string {
    return "walking";
  }
}

class Bird extends Animal implements Flyer {
  makeSound(): string {
    return "Tweet";
  }
  move(): string {
    return "flying";
  }
  fly(): string {
    return "Soaring through the sky";
  }
}

class Fish extends Animal implements Swimmer {
  makeSound(): string {
    return "...";
  }
  move(): string {
    return "swimming";
  }
  swim(): string {
    return "Gliding through the water";
  }
}

class Duck extends Animal implements Swimmer, Flyer {
  makeSound(): string {
    return "Quack";
  }
  move(): string {
    return "waddling";
  }
  swim(): string {
    return "Paddling in the pond";
  }
  fly(): string {
    return "Flying in the sky";
  }
}
//
// 思考點：
// - Duck 的 move() 要回傳什麼？牠既會飛又會游，這就是為什麼 move/swim/fly 是三個不同方法
//   （能力 ≠ 預設行為）。
// - Fish 的 move() 和 swim() 回傳的字串該一樣嗎？差別在哪？

// ---------- Part 4: 使用範例（寫完後取消註解試試） ----------

const animals: Animal[] = [
  new Dog("Rex", 3),
  new Cat("Whiskers", 5),
  new Bird("Tweety", 1),
  new Fish("Nemo", 2),
  new Duck("Donald", 4),
];
//
for (const a of animals) {
  console.log(a.describe());
}
//
// // 能力篩選：只有 Swimmer 能呼叫 swim()
function letThemSwim(swimmers: Swimmer[]) {
  swimmers.forEach((s) => console.log(s.swim()));
}
//
// // 注意：這裡要怎麼從 animals 篩出 Swimmer？想想 type guard 怎麼寫
const swimmers = animals.filter((a): a is Animal & Swimmer => "swim" in a);
letThemSwim(swimmers);
