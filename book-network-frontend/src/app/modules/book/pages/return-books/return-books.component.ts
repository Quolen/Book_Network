import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBorrowedBookResponse} from "../../../../service/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../service/models/borrowed-book-response";
import {BookService} from "../../../../service/services/book.service";

@Component({
  selector: 'app-return-books',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './return-books.component.html',
  styleUrl: './return-books.component.scss'
})
export class ReturnBooksComponent implements OnInit{
  returnedBooks: PageResponseBorrowedBookResponse = {};
  page = 0;
  size = 1;
  selectedBook: BorrowedBookResponse | undefined = undefined;
  message = '';
  level = 'success';

  constructor(
    private bookService: BookService
  ) {
  }

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.returnedBooks = resp;
      }
    });
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToPage(number: number) {
    this.page = number;
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks.totalPages as number - 1;
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if(!book.returned) {
      this.level = 'error';
      this.message = 'The book is not yet returned';
      return;
    }
    this.bookService.returnApprovedBorrowBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book return approved';
        this.findAllReturnedBooks();
      }
    })
  }
}
