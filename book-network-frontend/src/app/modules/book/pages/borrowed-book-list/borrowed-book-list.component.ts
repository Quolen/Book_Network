import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBorrowedBookResponse} from "../../../../service/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../service/models/borrowed-book-response";
import {BookService} from "../../../../service/services/book.service";
import {FormsModule} from "@angular/forms";
import {FeedbackRequest} from "../../../../service/models/feedback-request";
import {RatingComponent} from "../../components/rating/rating.component";
import {RouterLink} from "@angular/router";
import {FeedbackService} from "../../../../service/services/feedback.service";

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    RatingComponent,
    RouterLink
  ],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit {

  borrowedBooks: PageResponseBorrowedBookResponse = {};
  feedbackRequest: FeedbackRequest = {bookId: 0, comment: "", score: 0};
  page = 0;
  size = 1;
  selectedBook: BorrowedBookResponse | undefined = undefined;

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {
  }

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  returnBorrowBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.borrowedBooks = resp;
      }
    });
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToPage(number: number) {
    this.page = number;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks()
  }

  goToLastPage() {
    this.page = this.borrowedBooks.totalPages as number - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.borrowedBooks.totalPages as number - 1;
  }

  returnBook(withFeedback: boolean) {
    this.bookService.returnBorrowBook({
      'book-id': this.selectedBook?.id as number
    }).subscribe({
      next: (resp) => {
        if (withFeedback) {
          this.giveFeedback();
        }
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      }
    })
  }

  private giveFeedback() {
    this.feedbackService.createFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next: () => {
      }
    });
  }
}
