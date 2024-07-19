package com.app.book.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum BusinessErrorCodes {

    NO_CODE(0, NOT_IMPLEMENTED, "No code"),
    INCORRECT_CURRENT_PASSWORD(1001, HttpStatus.BAD_REQUEST, "Incorrect current password"),
    NEW_PASSWORD_DOES_NOT_MATCH(1002, HttpStatus.BAD_REQUEST, "New passwords do not match"),
    ACCOUNT_LOCKED(1003, HttpStatus.FORBIDDEN, "Account is locked"),
    ACCOUNT_DISABLED(1004, HttpStatus.FORBIDDEN, "Account is disabled"),
    BAD_CREDENTIALS(1005, HttpStatus.UNAUTHORIZED, "Invalid credentials"),
    ;

    private final int code;

    private final String description;

    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
