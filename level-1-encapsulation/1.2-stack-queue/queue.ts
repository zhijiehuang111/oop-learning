class Queue<T> {
  private _items: T[];
  constructor() {
    this._items = [];
  }
  enqueue(item: T): void {
    this._items.push(item);
  }
  dequeue(): T | undefined {
    return this._items.shift();
  }
  peek(): T | undefined {
    return this._items[0];
  }
  isEmpty(): boolean {
    return this._items.length === 0;
  }
  get size(): number {
    return this._items.length;
  }
}

const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.peek());
console.log(queue.dequeue());
console.log(queue.size);
