class Stack<T> {
  private _items: T[];
  constructor() {
    this._items = [];
  }
  push(item: T): void {
    this._items.push(item);
  }
  pop(): T | undefined {
    return this._items.pop();
  }
  peek(): T | undefined {
    return this._items[this._items.length - 1];
  }
  isEmpty(): boolean {
    return this._items.length === 0;
  }
  get size(): number {
    return this._items.length;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.peek());
console.log(stack.pop());
console.log(stack.size);
