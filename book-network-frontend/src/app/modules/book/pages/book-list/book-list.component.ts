import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BookService} from "../../../../service/services/book.service";
import {PageResponseBookResponse} from "../../../../service/models/page-response-book-response";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;

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
        this.bookResponse = res;
      }
    })
  }
}
