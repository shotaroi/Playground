package com.example.todoapi.web.dto;

import java.time.Instant;

public record TodoResponse(
    Long id,
    String title,
    boolean completed,
    Instant createdAt,
    Instant updatedAt
) {}