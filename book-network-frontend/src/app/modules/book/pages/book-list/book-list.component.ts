import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BookService} from "../../../../service/services/book.service";
import {PageResponseBookResponse} from "../../../../service/models/page-response-book-response";
import {NgForOf, NgIf} from "@angular/common";
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {BookResponse} from "../../../../service/models/book-response";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgForOf,
    BookCardComponent,
    NgIf
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 1;
  message = '';
  level = 'success';

  constructor(
    private router: Router,
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.bookResponse = res;
      }
    })
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  goToPage(number: number) {
    this.page = number;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks()
  }

  goToLastPage() {
    this.page = this.bookResponse.totalPages as number -1;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.bookResponse.totalPages as number -1;
  }

  borrowBook(book: BookResponse) {
    this.message = '';
    this.bookService.borrowBook({
      'book-id': book.id as number,
    }).subscribe({
      next: () => {
        this.level = "success";
        this.message = "Book successfully added to your list";
      },
      error: (err) => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    })
  }
}
