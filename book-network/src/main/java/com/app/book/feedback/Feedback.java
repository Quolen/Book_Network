package com.app.book.feedback;

import com.app.book.book.Book;
import com.app.book.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
public class Feedback extends BaseEntity {

    private Double score;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

}