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

  constructor(
    readonly id: string,
    readonly title: string,
    readonly author: string,
  ) {
    // TODO
  }
}

export class Member {
  // TODO: id / name 設成 readonly public
  // TODO: borrowedBooks（提示：考慮存 Book 還是 bookId，並決定 access modifier）

  constructor(
    readonly id: string,
    readonly name: string,
  ) {
    // TODO
  }

  // TODO: 提供 Library 需要的查詢/操作 API
  //   - 例如 hasReachedLimit()、addBorrowed(book)、removeBorrowed(bookId) ...
  //   你不需要全部用上，但想清楚 Member 對外要暴露什麼。
}

export class Library {
  // TODO: books / members 用 Map<string, Book> / Map<string, Member> 比 array 好用，想想為什麼
  private bookSet: Set<string> = new Set();
  private memberSet: Set<string> = new Set();
  private borrowedBooks: Map<string, string> = new Map(); // bookId -> memberId
  private authorsBook: Map<string, Book[]> = new Map(); // author -> Book[]

  constructor(
    private books: Book[] = [],
    private members: Member[] = [],
  ) {
    // TODO
    for (const book of books) {
      this.bookSet.add(book.id);
      if (!this.authorsBook.has(book.author))
        this.authorsBook.set(book.author, []);
      this.authorsBook.get(book.author)!.push(book);
    }
    for (const member of members) {
      this.memberSet.add(member.id);
    }
  }

  borrowBook(memberId: string, bookId: string): void {
    // TODO
    // 必須處理：
    //   - memberId / bookId 找不到
    //   - 書已被借走
    //   - 會員已達上限（MAX_BORROW_PER_MEMBER）
    // 失敗時要丟 Error，且不能留下半改的狀態（atomic）
  }

  returnBook(memberId: string, bookId: string): void {
    // TODO
    // 必須處理：
    //   - memberId / bookId 找不到
    //   - 該會員沒借過這本書
  }

  searchByAuthor(author: string): Book[] {
    // TODO: 回傳該作者的所有書（不論是否可借）
    return [];
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
