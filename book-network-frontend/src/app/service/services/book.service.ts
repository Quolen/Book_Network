/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpContext, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseService} from '../base-service';
import {ApiConfiguration} from '../api-configuration';
import {StrictHttpResponse} from '../strict-http-response';

import {BookResponse} from '../models/book-response';
import {BorrowBook$Params} from '../fn/book/borrow-book';
import {FindAllBooks$Params} from '../fn/book/find-all-books';
import {findAllBorrowedBooks} from '../fn/book/find-all-borrowed-books';
import {FindAllBorrowedBooks$Params} from '../fn/book/find-all-borrowed-books';
import {findAllReturnedBooks} from '../fn/book/find-all-returned-books';
import {FindAllReturnedBooks$Params} from '../fn/book/find-all-returned-books';
import {getBookById} from '../fn/book/get-book-by-id';
import {GetBookById$Params} from '../fn/book/get-book-by-id';
import {PageResponseBookResponse} from '../models/page-response-book-response';
import {PageResponseBorrowedBookResponse} from '../models/page-response-borrowed-book-response';
import {returnApprovedBorrowBook} from '../fn/book/return-approved-borrow-book';
import {ReturnApprovedBorrowBook$Params} from '../fn/book/return-approved-borrow-book';
import {returnBorrowBook} from '../fn/book/return-borrow-book';
import {ReturnBorrowBook$Params} from '../fn/book/return-borrow-book';
import {updateArchivedStatus} from '../fn/book/update-archived-status';
import {UpdateArchivedStatus$Params} from '../fn/book/update-archived-status';
import {updateShareableStatus} from '../fn/book/update-shareable-status';
import {UpdateShareableStatus$Params} from '../fn/book/update-shareable-status';
import {uploadBookCoverPicture} from '../fn/book/upload-book-cover-picture';
import {UploadBookCoverPicture$Params} from '../fn/book/upload-book-cover-picture';
import {BookRequest} from "../models/book-request";

@Injectable({providedIn: 'root'})
export class BookService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `findAllBooks()` */
  static readonly FindAllBooksPath = '/books';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllBooks()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBooks$Response(params?: FindAllBooks$Params, context?: HttpContext): Observable<HttpResponse<PageResponseBookResponse>> {
    return this.http.get<PageResponseBookResponse>(`${this.rootUrl}${BookService.FindAllBooksPath}`, {
      params: this.createHttpParams(params),
      observe: 'response',
      context
    });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllBooks$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBooks(params?: FindAllBooks$Params, context?: HttpContext): Observable<PageResponseBookResponse> {
    return this.findAllBooks$Response(params, context).pipe(
      map((response: HttpResponse<PageResponseBookResponse>): PageResponseBookResponse => {
        console.log('FindAllBooks Response:', response); // Log response for debugging
        return response.body!;
      })
    );
  }

  /**
   * Helper method to create HttpParams object
   */
  private createHttpParams(params?: FindAllBooks$Params): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.append('page', params.page.toString());
      }
      if (params.size !== undefined) {
        httpParams = httpParams.append('size', params.size.toString());
      }
    }
    return httpParams;
  }


  /** Path part for operation `saveBook()` */
  static readonly SaveBookPath = '/books';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveBook()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveBook$Response(bookRequest: BookRequest, context?: HttpContext): Observable<HttpResponse<number>> {
    const url = `${this.rootUrl}${BookService.SaveBookPath}`;
    return this.http.post<number>(url, bookRequest, { observe: 'response', context });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveBook$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveBook(bookRequest: BookRequest, context?: HttpContext): Observable<number> {
    return this.saveBook$Response(bookRequest, context).pipe(
      map((response: HttpResponse<number>): number => {
        console.log('SaveBook Response:', response); // Optional logging for debugging
        return response.body!;
      })
    );
  }

  /** Path part for operation `uploadBookCoverPicture()` */
  static readonly UploadBookCoverPicturePath = '/books/cover/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadBookCoverPicture()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadBookCoverPicture$Response(params: UploadBookCoverPicture$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
    return uploadBookCoverPicture(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadBookCoverPicture$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadBookCoverPicture(params: UploadBookCoverPicture$Params, context?: HttpContext): Observable<{}> {
    return this.uploadBookCoverPicture$Response(params, context).pipe(
      map((r: StrictHttpResponse<{}>): {} => r.body)
    );
  }

  /** Path part for operation `borrowBook()` */
  static readonly BorrowBookPath = '/books/borrow/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `borrowBook()` instead.
   *
   * This method doesn't expect any request body.
   */
  borrowBook$Response(params: BorrowBook$Params, context?: HttpContext): Observable<HttpResponse<number>> {
    // Construct the full URL with the book-id parameter
    const url = `${this.rootUrl}${BookService.BorrowBookPath.replace('{book-id}', encodeURIComponent(String(params['book-id'])))}`;

    // Use HttpClient directly for full response
    return this.http.post<number>(url, null, {observe: 'response', context});
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `borrowBook$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  borrowBook(params: BorrowBook$Params, context?: HttpContext): Observable<number> {
    return this.borrowBook$Response(params, context).pipe(
      map((response: HttpResponse<number>): number => {
        console.log('BorrowBook Response:', response); // Optional logging for debugging
        return response.body!;
      })
    );
  }

  /** Path part for operation `updateShareableStatus()` */
  static readonly UpdateShareableStatusPath = '/books/shareable/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateShareableStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateShareableStatus$Response(params: UpdateShareableStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return updateShareableStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateShareableStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateShareableStatus(params: UpdateShareableStatus$Params, context?: HttpContext): Observable<number> {
    return this.updateShareableStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `returnBorrowBook()` */
  static readonly ReturnBorrowBookPath = '/books/borrow/return/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `returnBorrowBook()` instead.
   *
   * This method doesn't expect any request body.
   */
  returnBorrowBook$Response(params: ReturnBorrowBook$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return returnBorrowBook(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `returnBorrowBook$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  returnBorrowBook(params: ReturnBorrowBook$Params, context?: HttpContext): Observable<number> {
    return this.returnBorrowBook$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `returnApprovedBorrowBook()` */
  static readonly ReturnApprovedBorrowBookPath = '/books/borrow/return/approved/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `returnApprovedBorrowBook()` instead.
   *
   * This method doesn't expect any request body.
   */
  returnApprovedBorrowBook$Response(params: ReturnApprovedBorrowBook$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return returnApprovedBorrowBook(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `returnApprovedBorrowBook$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  returnApprovedBorrowBook(params: ReturnApprovedBorrowBook$Params, context?: HttpContext): Observable<number> {
    return this.returnApprovedBorrowBook$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `updateArchivedStatus()` */
  static readonly UpdateArchivedStatusPath = '/books/archived/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateArchivedStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateArchivedStatus$Response(params: UpdateArchivedStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return updateArchivedStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateArchivedStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateArchivedStatus(params: UpdateArchivedStatus$Params, context?: HttpContext): Observable<number> {
    return this.updateArchivedStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getBookById()` */
  static readonly GetBookByIdPath = '/books/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getBookById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getBookById$Response(params: GetBookById$Params, context?: HttpContext): Observable<HttpResponse<BookResponse>> {
    const url = `${this.rootUrl}${BookService.GetBookByIdPath.replace('{book-id}', encodeURIComponent(String(params['book-id'])))}`;

    // Use HttpClient directly for full response
    return this.http.get<BookResponse>(url, {observe: 'response', context});
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getBookById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getBookById(params: GetBookById$Params, context?: HttpContext): Observable<BookResponse> {
    return this.getBookById$Response(params, context).pipe(
      map((r: HttpResponse<BookResponse>): BookResponse => r.body!)
    );
  }

  /** Path part for operation `findAllReturnedBooks()` */
  static readonly FindAllReturnedBooksPath = '/books/returned';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllReturnedBooks()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllReturnedBooks$Response(params?: FindAllReturnedBooks$Params, context?: HttpContext): Observable<HttpResponse<PageResponseBorrowedBookResponse>> {
    const url = `${this.rootUrl}${BookService.FindAllReturnedBooksPath}`;

    // Use HttpClient directly for full response
    return this.http.get<PageResponseBookResponse>(url, {observe: 'response', context});
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllReturnedBooks$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllReturnedBooks(params?: FindAllReturnedBooks$Params, context?: HttpContext): Observable<PageResponseBorrowedBookResponse> {
    return this.findAllReturnedBooks$Response(params, context).pipe(
      map((r: HttpResponse<PageResponseBorrowedBookResponse>): PageResponseBorrowedBookResponse => r.body!)
    );
  }

  /** Path part for operation `findAllBooksByOwner()` */
  static readonly FindAllBooksByOwnerPath = '/books/owner';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllBooksByOwner()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBooksByOwner$Response(params?: any, context?: HttpContext): Observable<HttpResponse<PageResponseBookResponse>> {
    const url = `${this.rootUrl}${BookService.FindAllBooksByOwnerPath}`;
    return this.http.get<PageResponseBookResponse>(url, { params, observe: 'response', context });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllBooksByOwner$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBooksByOwner(params?: any, context?: HttpContext): Observable<PageResponseBookResponse> {
    return this.findAllBooksByOwner$Response(params, context).pipe(
      map((response: HttpResponse<PageResponseBookResponse>): PageResponseBookResponse => response.body!)
    );
  }

  /** Path part for operation `findAllBorrowedBooks()` */
  static readonly FindAllBorrowedBooksPath = '/books/borrowed';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllBorrowedBooks()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBorrowedBooks$Response(params?: FindAllBorrowedBooks$Params, context?: HttpContext): Observable<HttpResponse<PageResponseBorrowedBookResponse>> {

    const url = `${this.rootUrl}${BookService.FindAllBorrowedBooksPath}`;

    // Use HttpClient directly for full response
    return this.http.get<PageResponseBookResponse>(url, {observe: 'response', context});
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllBorrowedBooks$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllBorrowedBooks(params?: FindAllBorrowedBooks$Params, context?: HttpContext): Observable<PageResponseBorrowedBookResponse> {
    return this.findAllBorrowedBooks$Response(params, context).pipe(
      map((r: HttpResponse<PageResponseBorrowedBookResponse>): PageResponseBorrowedBookResponse => r.body!)
    );
  }

}
