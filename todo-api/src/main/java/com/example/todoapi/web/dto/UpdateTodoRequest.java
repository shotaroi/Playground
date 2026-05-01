package com.example.todoapi.web.dto;

import jakarta.validation.constraints.Size;

public record UpdateTodoRequest(
    @Size(max = 500, message = "Title must be at most 500 characters")
    String title,
    Boolean completed
) {}