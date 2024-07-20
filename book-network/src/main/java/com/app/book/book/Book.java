package com.app.book.book;

import com.app.book.common.BaseEntity;
import com.app.book.feedback.Feedback;
import com.app.book.history.BookTransactionHistory;
import com.app.book.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseEntity {

    private String title;
    private String author;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean shareable;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "book")
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> histories;

    @Transient
    public double getRate() {

        if (this.feedbacks == null || this.feedbacks.isEmpty()) {
            return 0.0;
        }

        var rate = this.feedbacks.stream()
                .mapToDouble(Feedback::getScore)
                .average()
                .orElse(0.0);

        return Math.round(rate * 10.0) / 10.0;
    }

}


