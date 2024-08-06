import {Component, OnInit} from '@angular/core';
import {BookRequest} from "../../../../service/models/book-request";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookService} from "../../../../service/services/book.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit {

  errorMsg: Array<string> = [];
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  selectedBookCover: any;
  selectedPicture: string | undefined;

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      this.bookService.getBookById({
        'book-id': bookId
      }).subscribe({
        next: (book) => {
          this.bookRequest = {
            id: book.id,
            title: book.title as string,
            authorName: book.author as string,
            isbn: book.isbn as string,
            synopsis: book.synopsis as string,
            shareable: book.shareable
          }
          if (book.cover) {
            this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
          }
        }
      });
    }
  }

  saveBook() {
    console.log('Book Request:', this.bookRequest);
    this.bookService.saveBook(this.bookRequest).subscribe({
      next: (bookId) => {
        if (this.selectedBookCover) {
          this.bookService.uploadBookCoverPicture({
            'book-id': bookId,
            body: {
              file: this.selectedBookCover
            }
          }).subscribe({
            next: () => {
              this.router.navigate(['/books/my-books']);
            },
            error: (err) => {
              console.error('Error uploading cover picture:', err);
              this.errorMsg = ['Error uploading cover picture'];
            }
          });
        } else {
          this.router.navigate(['/books/my-books']);
        }
      },
      error: (err) => {
        console.error('Error saving book:', err);
        this.errorMsg = err.error?.validationErrors || ['An error occurred while saving the book'];
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);

    if (this.selectedBookCover) {

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }
}
