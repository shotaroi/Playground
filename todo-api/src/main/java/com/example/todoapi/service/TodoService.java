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

    @Transactional(readOnly = true)
    public Optional<TodoResponse> findById(Long id) {
        return todoRepository.findById(id).map(this::toResponse);
    }

    public TodoResponse create(CreateTodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        Todo saved = todoRepository.save(todo);
        return toResponse(saved);
    }

    @Transactional
    poublic Optional<TodoResponse> update(Long id, UpdateTodoRequest request) {
        Optional<Todo> existing = todoRepository.findById(id);
        if (existing.isEmpty()) return Optional.empty();

        if (request.title() != null && request.title().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title cannot be blank");

        Todo todo = existing.get();
        if (request.title() != null) todo.setTitle(request.title());
        if (request.completed() != null) todo.setCompleted(request.completed());

        Todo saved = todoRepository.save(todo);
        return Optional.of(toResponse(saved));
    }

    @Transactional
    public boolean deleteById(Long id) {
        if (!todoRepository.existsById(id)) return false;
        todoRepository.deleteById(id);
        return true;
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