package com.app.book.book;

import com.app.book.common.PageResponse;
import com.app.book.exception.OperationNotPermittedException;
import com.app.book.file.FileStorageService;
import com.app.book.history.BookTransactionHistory;
import com.app.book.history.BookTransactionHistoryRepository;
import com.app.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
    private final FileStorageService fileStorageService;

    public Long save(BookRequest request, Authentication connectedUser) {

        User user = ((User) connectedUser.getPrincipal());
        Book book = bookMapper.toBook(request);
        book.setOwner(user);

        return bookRepository.save(book).getId();
    }

    public BookResponse findBookById(Long id) {
        return bookRepository.findById(id)
                .map(bookMapper::toBookResponse)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + id));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable, user.getId());
        List<BookResponse> bookResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(BookSpecification.withOwnerId(user.getId()), pageable);
        List<BookResponse> booksResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                booksResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {

        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllBorrowedBooks(pageable, user.getId());

        List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );

    }

    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {

        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allReturnedBooks = bookTransactionHistoryRepository.findAllReturnedBooks(pageable, user.getId());

        List<BorrowedBookResponse> bookResponse = allReturnedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponse,
                allReturnedBooks.getNumber(),
                allReturnedBooks.getSize(),
                allReturnedBooks.getTotalElements(),
                allReturnedBooks.getTotalPages(),
                allReturnedBooks.isFirst(),
                allReturnedBooks.isLast()
        );

    }

    public Long updateShareableStatus(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        User user = ((User) connectedUser.getPrincipal());

        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update book shareable status");
        }

        book.setShareable(!book.isShareable());
        return bookRepository.save(book).getId();
    }

    public Long updateArchivedStatus(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        User user = ((User) connectedUser.getPrincipal());

        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update book archived status");
        }

        book.setArchived(!book.isArchived());
        return bookRepository.save(book).getId();
    }

    public Long borrowBook(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        User user = ((User) connectedUser.getPrincipal());

        log.info(user.getId().toString());

        if (!book.isShareable() || book.isArchived()) {
            throw new OperationNotPermittedException("You cannot borrow archived or non shareable book");
        }

        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot borrow your own book");
        }

        final boolean isAlreadyBorrowed = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId, user.getId());
        if (isAlreadyBorrowed) {
            throw new OperationNotPermittedException("You cannot borrow book which is already borrowed");
        }

        BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                .user(user)
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();

        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Long returnBorrowBook(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        if (!book.isShareable() || book.isArchived()) {
            throw new OperationNotPermittedException("You cannot return archived or non shareable book");
        }

        User user = ((User) connectedUser.getPrincipal());
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot return your own book");
        }

        BookTransactionHistory history = bookTransactionHistoryRepository.findByBookIdAndUserId(bookId, user.getId())
                .orElseThrow(() -> new OperationNotPermittedException("You did not borrow the book"));

        history.setReturned(true);
        return bookTransactionHistoryRepository.save(history).getId();
    }

    public Long returnApprovedBorrowBook(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot approve the return of books you don't own");
        }

        BookTransactionHistory history = bookTransactionHistoryRepository.findByBookIdAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new OperationNotPermittedException("The book is not returned yet. You cannot approve its return"));

        history.setReturnApproved(true);
        return bookTransactionHistoryRepository.save(history).getId();
    }


    public void uploadBookCoverPicture(Long bookId, Authentication connectedUser, MultipartFile file) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        User user = ((User) connectedUser.getPrincipal());

        var bookCover = fileStorageService.saveFile(file, user.getId());
        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}
