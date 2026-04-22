package com.example.todoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import src.main.java.com.example.todoapi.domain.Todo;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByCompleted(boolean completed);
}