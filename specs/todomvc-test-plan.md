# TodoMVC Test Plan

**URL**: https://demo.playwright.dev/todomvc/
**Framework**: React TodoMVC

## Test Suites

### 1. Adding Todos
- should add a new todo item
- should add multiple todo items
- should trim whitespace from todo text
- should not add empty todos
- should clear the input field after adding a todo

### 2. Completing Todos
- should mark a todo as completed
- should unmark a completed todo
- should show completed todos with strikethrough styling

### 3. Editing Todos
- should edit a todo by double-clicking
- should save edit on Enter
- should cancel edit on Escape
- should delete todo if edited to empty string

### 4. Deleting Todos
- should delete a todo using the destroy button
- should remove the todo from the list

### 5. Filtering
- should show all todos by default
- should filter active todos
- should filter completed todos
- should highlight the active filter

### 6. Toggle All
- should mark all todos as completed
- should unmark all todos when all are completed

### 7. Clear Completed
- should clear all completed todos
- should hide the button when no todos are completed

### 8. Item Counter
- should display correct count of active items
- should use "item" for single item and "items" for multiple

### 9. Persistence
- should persist todos after page reload
