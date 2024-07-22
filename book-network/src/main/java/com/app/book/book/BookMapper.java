package com.app.book.book;

import com.app.book.file.FileUtils;
import com.app.book.history.BookTransactionHistory;
import org.springframework.stereotype.Service;

@Service
public class BookMapper {

    public Book toBook(BookRequest request) {

        return Book.builder()
                .id(request.id())
                .title(request.title())
                .author(request.authorName())
                .isbn(request.isbn())
                .synopsis(request.synopsis())
                .archived(false)
                .shareable(request.shareable())
                .build();

    }

    public BookResponse toBookResponse(Book book) {

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .rate(book.getRate())
                .archived(book.isArchived())
                .shareable(book.isShareable())
                .owner(book.getOwner().fullName())
                .synopsis(book.getSynopsis())
                .cover(FileUtils.readFileFromLocation(book.getBookCover()))
                .build();

    }

    public BorrowedBookResponse toBorrowedBookResponse(BookTransactionHistory history) {

        return BorrowedBookResponse.builder()
                .id(history.getId())
                .title(history.getBook().getTitle())
                .author(history.getBook().getAuthor())
                .isbn(history.getBook().getIsbn())
                .rate(history.getBook().getRate())
                .returned(history.isReturned())
                .returnApproved(history.isReturnApproved())
                .build();

    }
}
