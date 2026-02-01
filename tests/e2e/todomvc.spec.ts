import { test, expect, type Page } from '@playwright/test';

const TODO_ITEMS = ['Buy groceries', 'Walk the dog', 'Read a book'];

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
});

function newTodoInput(page: Page) {
  return page.getByPlaceholder('What needs to be done?');
}

async function addTodo(page: Page, text: string) {
  await newTodoInput(page).fill(text);
  await newTodoInput(page).press('Enter');
}

async function addThreeTodos(page: Page) {
  for (const item of TODO_ITEMS) {
    await addTodo(page, item);
  }
}

test.describe('Adding Todos', () => {
  test('should add a new todo item', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toHaveText([TODO_ITEMS[0]]);
  });

  test('should add multiple todo items', async ({ page }) => {
    await addThreeTodos(page);

    await expect(page.getByTestId('todo-item')).toHaveCount(3);
    await expect(page.getByTestId('todo-item')).toHaveText(TODO_ITEMS);
  });

  test('should trim whitespace from todo text', async ({ page }) => {
    await addTodo(page, '   Trimmed todo   ');

    await expect(page.getByTestId('todo-item')).toHaveText(['Trimmed todo']);
  });

  test('should not add empty todos', async ({ page }) => {
    await newTodoInput(page).press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('should clear the input field after adding a todo', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    await expect(newTodoInput(page)).toBeEmpty();
  });
});

test.describe('Completing Todos', () => {
  test('should mark a todo as completed', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    const toggle = page.getByRole('listitem').getByLabel('Toggle Todo');
    await toggle.check();

    await expect(page.getByTestId('todo-item')).toHaveClass([/completed/]);
  });

  test('should unmark a completed todo', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    const toggle = page.getByRole('listitem').getByLabel('Toggle Todo');
    await toggle.check();
    await toggle.uncheck();

    await expect(page.getByTestId('todo-item')).not.toHaveClass([/completed/]);
  });
});

test.describe('Editing Todos', () => {
  test('should edit a todo by double-clicking and saving on Enter', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('Updated todo');
    await editInput.press('Enter');

    await expect(todoItem).toHaveText(['Updated todo']);
  });

  test('should cancel edit on Escape', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('Should not save');
    await editInput.press('Escape');

    await expect(todoItem).toHaveText([TODO_ITEMS[0]]);
  });

  test('should delete todo if edited to empty string', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox');
    await editInput.fill('');
    await editInput.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });
});

test.describe('Deleting Todos', () => {
  test('should delete a todo using the destroy button', async ({ page }) => {
    await addThreeTodos(page);

    const secondItem = page.getByTestId('todo-item').nth(1);
    await secondItem.hover();
    await secondItem.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    await expect(page.getByTestId('todo-item')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });
});

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await addThreeTodos(page);
    // Complete the first todo
    await page.getByTestId('todo-item').nth(0).getByLabel('Toggle Todo').check();
  });

  test('should show all todos by default', async ({ page }) => {
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });

  test('should filter active todos', async ({ page }) => {
    await page.getByRole('link', { name: 'Active' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    await expect(page.getByTestId('todo-item')).toHaveText([TODO_ITEMS[1], TODO_ITEMS[2]]);
  });

  test('should filter completed todos', async ({ page }) => {
    await page.getByRole('link', { name: 'Completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toHaveText([TODO_ITEMS[0]]);
  });

  test('should highlight the active filter', async ({ page }) => {
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByRole('link', { name: 'Active' })).toHaveClass(/selected/);

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/);

    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByRole('link', { name: 'All' })).toHaveClass(/selected/);
  });
});

test.describe('Toggle All', () => {
  test('should mark all todos as completed', async ({ page }) => {
    await addThreeTodos(page);

    await page.getByLabel('Mark all as complete').check();

    const items = page.getByTestId('todo-item');
    for (let i = 0; i < 3; i++) {
      await expect(items.nth(i)).toHaveClass(/completed/);
    }
  });

  test('should unmark all todos when all are completed', async ({ page }) => {
    await addThreeTodos(page);

    await page.getByLabel('Mark all as complete').check();
    await page.getByLabel('Mark all as complete').uncheck();

    const items = page.getByTestId('todo-item');
    for (let i = 0; i < 3; i++) {
      await expect(items.nth(i)).not.toHaveClass(/completed/);
    }
  });
});

test.describe('Clear Completed', () => {
  test('should clear all completed todos', async ({ page }) => {
    await addThreeTodos(page);

    await page.getByTestId('todo-item').nth(0).getByLabel('Toggle Todo').check();
    await page.getByTestId('todo-item').nth(1).getByLabel('Toggle Todo').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toHaveText([TODO_ITEMS[2]]);
  });

  test('should hide the button when no todos are completed', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);

    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  });
});

test.describe('Item Counter', () => {
  test('should display correct count of active items', async ({ page }) => {
    await addThreeTodos(page);

    await expect(page.locator('.todo-count')).toContainText('3');

    await page.getByTestId('todo-item').nth(0).getByLabel('Toggle Todo').check();

    await expect(page.locator('.todo-count')).toContainText('2');
  });

  test('should use "item" for single and "items" for multiple', async ({ page }) => {
    await addTodo(page, TODO_ITEMS[0]);
    await expect(page.locator('.todo-count')).toContainText('1 item left');

    await addTodo(page, TODO_ITEMS[1]);
    await expect(page.locator('.todo-count')).toContainText('2 items left');
  });
});

test.describe('Persistence', () => {
  test('should persist todos after page reload', async ({ page }) => {
    await addThreeTodos(page);
    await page.getByTestId('todo-item').nth(0).getByLabel('Toggle Todo').check();

    await page.reload();

    await expect(page.getByTestId('todo-item')).toHaveCount(3);
    await expect(page.getByTestId('todo-item').nth(0)).toHaveClass(/completed/);
  });
});
