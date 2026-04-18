// Exercise 2.1 — Shape 階層
// 練習重點：abstract class、多型、LSP
abstract class Shape {
  // TODO: 定義 abstract area() 與 perimeter()
  abstract area(): number;
  abstract perimeter(): number;
  abstract getShapeName(): string;
  // TODO: 實作 describe()，格式：
  //   "A Circle with area 12.57 and perimeter 12.57"
  //   數字保留兩位小數
  //   想一下：Shape 名稱要怎麼拿？
  describe(): string {
    return `A ${this.getShapeName()} with area ${this.area().toFixed(2)} and perimeter ${this.perimeter().toFixed(2)}`;
  }
}
class Circle extends Shape {
  // TODO: constructor 收 radius，實作 area() 與 perimeter()
  private radius: number;
  private static readonly PI = Math.PI;
  constructor(radius: number) {
    super();
    this.radius = radius;
  }
  area(): number {
    let r = this.radius;
    return r * r * Circle.PI;
  }
  perimeter(): number {
    return this.radius * Circle.PI * 2;
  }
  getShapeName(): string {
    return "Circle";
  }
}
class Rectangle extends Shape {
  // TODO: constructor 收 width, height，實作 area() 與 perimeter()
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }
  area(): number {
    return this.width * this.height;
  }
  perimeter(): number {
    return (this.width + this.height) * 2;
  }
  getShapeName(): string {
    return "Rectangle";
  }
}
class Triangle extends Shape {
  // TODO: constructor 收 a, b, c
  //   - 驗證三邊能構成三角形（任兩邊和 > 第三邊），否則丟 Error
  //   - area() 用海龍公式：s = (a+b+c)/2; area = sqrt(s(s-a)(s-b)(s-c))
  private a: number;
  private b: number;
  private c: number;
  constructor(a: number, b: number, c: number) {
    super();
    if (!Triangle.isValid(a, b, c)) throw new Error("not valid");
    this.a = a;
    this.b = b;
    this.c = c;
  }
  static isValid(a: number, b: number, c: number): boolean {
    return a + b > c && a + c > b && b + c > a;
  }
  area(): number {
    let s = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }
  perimeter(): number {
    return this.a + this.b + this.c;
  }
  getShapeName(): string {
    return "Triangle";
  }
}
// TODO: 寫一個獨立 function，不是 method
function totalArea(shapes: Shape[]): number {
  let total = 0;
  for (let s of shapes) {
    total += s.area();
  }
  return total;
}
// ---- 寫完後解除註解，跑跑看 ----
const shapes: Shape[] = [
  new Circle(2),
  new Rectangle(3, 4),
  new Triangle(3, 4, 5),
];
shapes.forEach((s) => console.log(s.describe()));
console.log("total area:", totalArea(shapes));
try {
  new Triangle(1, 2, 10); // 應該丟 Error
} catch (e) {
  console.log("caught:", (e as Error).message);
}
export { Shape, Circle, Rectangle, Triangle, totalArea };
