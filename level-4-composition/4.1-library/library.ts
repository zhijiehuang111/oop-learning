// Exercise 4.1 — Library System
//
// 重點：物件協作（collaboration）、職責分配（SRP）、組合（has-a）。
// 在你動手之前，先問自己：
//   - 「借書」這個行為，應該寫在 Library / Member / Book 哪一個 class？為什麼？
//   - Member 的 borrowedBooks 應該存 Book 物件，還是只存 bookId？差別在哪？
//   - 誰負責維護 isAvailable 的正確性？

const MAX_BORROW_PER_MEMBER = 3;

export class Book {
  // TODO: id / title / author 設成 readonly public
  // TODO: isAvailable 預設 true，思考它應該由誰來修改（Library? Book 自己?）
  private _isAvailable: boolean = true;
  constructor(
    readonly id: string,
    readonly title: string,
    readonly author: string,
  ) {
    // TODO
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  markBorrowed(): void {
    if (!this._isAvailable) {
      throw new Error(`Book with id ${this.id} is already borrowed`);
    }
    this._isAvailable = false;
  }
  markReturned(): void {
    if (this._isAvailable) {
      throw new Error(`Book with id ${this.id} is not borrowed`);
    }
    this._isAvailable = true;
  }
}

export class Member {
  // TODO: id / name 設成 readonly public
  // TODO: borrowedBooks（提示：考慮存 Book 還是 bookId，並決定 access modifier）
  private _borrowedBooks: Set<string> = new Set();
  constructor(
    readonly id: string,
    readonly name: string,
  ) {
    // TODO
  }
  get borrowedBooks(): ReadonlySet<string> {
    return new Set(this._borrowedBooks);
  }
  hasReachedLimit(): boolean {
    return this._borrowedBooks.size >= MAX_BORROW_PER_MEMBER;
  }
  addBorrowed(bookId: string): void {
    this._borrowedBooks.add(bookId);
  }
  removeBorrowed(bookId: string): void {
    this._borrowedBooks.delete(bookId);
  }

  // TODO: 提供 Library 需要的查詢/操作 API
  //   - 例如 hasReachedLimit()、addBorrowed(book)、removeBorrowed(bookId) ...
  //   你不需要全部用上，但想清楚 Member 對外要暴露什麼。
}

export class Library {
  // TODO: books / members 用 Map<string, Book> / Map<string, Member> 比 array 好用，想想為什麼
  private booksMap: Map<string, Book> = new Map();
  private membersMap: Map<string, Member> = new Map();
  constructor(books: Book[] = [], members: Member[] = []) {
    // TODO
    this.booksMap = new Map(books.map((b) => [b.id, b]));
    this.membersMap = new Map(members.map((m) => [m.id, m]));
  }

  borrowBook(memberId: string, bookId: string): void {
    // TODO
    // 必須處理：
    //   - memberId / bookId 找不到
    const member = this.membersMap.get(memberId);
    const book = this.booksMap.get(bookId);
    if (!member) {
      throw new Error(`Member with id ${memberId} not found`);
    }
    if (!book) {
      throw new Error(`Book with id ${bookId} not found`);
    }
    //   - 書已被借走
    if (!book.isAvailable) {
      throw new Error(`Book with id ${bookId} is not available`);
    }
    //   - 會員已達上限（MAX_BORROW_PER_MEMBER）
    if (member.hasReachedLimit()) {
      throw new Error(
        `Member with id ${memberId} has reached the borrow limit`,
      );
    }
    book.markBorrowed();
    member.addBorrowed(bookId);
  }

  returnBook(memberId: string, bookId: string): void {
    // TODO
    // 必須處理：
    //   - memberId / bookId 找不到
    const member = this.membersMap.get(memberId);
    const book = this.booksMap.get(bookId);
    if (!member) {
      throw new Error(`Member with id ${memberId} not found`);
    }
    if (!book) {
      throw new Error(`Book with id ${bookId} not found`);
    }
    //   - 該會員沒借過這本書
    if (!member.borrowedBooks.has(bookId)) {
      throw new Error(
        `Member with id ${memberId} has not borrowed book with id ${bookId}`,
      );
    }
    book.markReturned();
    member.removeBorrowed(bookId);
  }

  searchByAuthor(author: string): Book[] {
    // TODO: 回傳該作者的所有書（不論是否可借）
    const result: Book[] = [];
    for (const book of this.booksMap.values()) {
      if (book.author === author) {
        result.push(book);
      }
    }
    return result;
  }
}

// ---------- 試試看 ----------
const lib = new Library(
  [
    new Book("b1", "Clean Code", "Robert Martin"),
    new Book("b2", "Refactoring", "Martin Fowler"),
    new Book("b3", "The Pragmatic Programmer", "Andrew Hunt"),
    new Book("b4", "Domain-Driven Design", "Eric Evans"),
  ],
  [new Member("m1", "Alice"), new Member("m2", "Bob")],
);

lib.borrowBook("m1", "b1");
lib.borrowBook("m1", "b2");
lib.borrowBook("m1", "b3");
lib.borrowBook("m1", "b4"); // 應該丟錯（達上限）
lib.borrowBook("m2", "b1"); // 應該丟錯（已被借走）
lib.returnBook("m1", "b1");
lib.borrowBook("m2", "b1"); // 現在 OK
console.log(lib.searchByAuthor("Martin Fowler"));
