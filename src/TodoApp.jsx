import React, { useState, useContext } from 'react';
import { TodoContext } from './TodoContext';
import './styles.scss'

function TodoApp() {
  const { dailyTodos, onceTodos, addTodo, toggleTodoDone, removeTodo, clearCompletedTodos } = useContext(TodoContext);

  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleAddTodo = () => {
    const todo = {
      task: newTodo,
      done: false,
      category: selectedCategory,
      isUrgent
    };
    addTodo(todo);
    setNewTodo('');
    setIsUrgent(false);
  };

  return (
    <div className='todo-list'>
    <h1>todos  - localhost:3000/todos</h1>
      <h3>New todo:</h3>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new todo"
      />

      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="once">Once</option>
      </select>

      <button onClick={handleAddTodo}>Add Todo</button>

      <h2>Daily todos</h2>
      <button onClick={() => clearCompletedTodos('daily')}>Reset done</button>
      <ul>
        {dailyTodos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodoDone(todo._id, 'daily')}
            />
            <span className={todo.done ? 'done-task' : ''}>{todo.task}</span>
            &nbsp;{todo.done && <span className={todo.done ? 'done-task' : ''}>Done on {todo.doneTimestamp}</span>}
            &nbsp;<button onClick={() => removeTodo(todo._id, 'daily')}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>Once todos</h2>
      <button onClick={() => clearCompletedTodos('once')}>Clear done</button>
      <ul>
        {onceTodos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodoDone(todo._id, 'once')}
            />
            <span className={todo.done ? 'done-task' : ''}>{todo.task}</span>
            &nbsp;{todo.done && <span className={todo.done ? 'done-task' : ''}>Done on {todo.doneTimestamp}</span>}
            &nbsp;<button onClick={() => removeTodo(todo._id, 'once')}>Remove</button>
          </li>
        ))}
      </ul>

      <hr />
    </div>
  );
}

export default TodoApp;
