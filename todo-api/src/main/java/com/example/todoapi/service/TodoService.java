package com.example.todoapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todoapi.domain.Todo;
import com.example.todoapi.repository.TodoRepository;
import com.example.todoapi.web.dto.CreateTodoRequest;
import com.example.todoapi.web.dto.TodoResponse;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional(readOnly = true) 
    public List<TodoResponse> findAll() {
        return todoRepository.findAll().stream()
        .map(this::toResponse)
        .toList();
    }

    public TodoResponse create(CreateTodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        Todo saved = todoRepository.save(todo);
        return toResponse(saved);
    }

    private TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
            todo.getId(),
            todo.getTitle(),
            todo.isCompleted(),
            todo.getCreatedAt(),
            todo.getUpdatedAt()
        );
    }
}