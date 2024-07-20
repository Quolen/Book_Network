package com.app.book.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {

    private List<T> content;
    private long number;
    private long size;
    private long totalElements;
    private long totalPages;
    private boolean first;
    private boolean last;

}
