import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [dailyTodos, setDailyTodos] = useState([]);
  const [onceTodos, setOnceTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => {
        const todos = response.data;
        setDailyTodos(todos.filter(todo => todo.category === 'daily'));
        setOnceTodos(todos.filter(todo => todo.category === 'once'));
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = (todo) => {
    axios.post('http://localhost:5000/todos', todo)
      .then(response => {
        if (todo.category === 'daily') {
          setDailyTodos(prevTodos => [...prevTodos, response.data]);
        } else {
          setOnceTodos(prevTodos => [...prevTodos, response.data]);
        }
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const toggleTodoDone = (id, category) => {
    const todos = category === 'daily' ? dailyTodos : onceTodos;
    const updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        const updatedTodo = { ...todo, done: !todo.done, doneTimestamp: !todo.done ? new Date().toLocaleString() : null };
        axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
        return updatedTodo;
      }
      return todo;
    });
    
    if (category === 'daily') {
      setDailyTodos(updatedTodos);
    } else {
      setOnceTodos(updatedTodos);
    }
  };

  const removeTodo = (id, category) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        if (category === 'daily') {
          setDailyTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } else {
          setOnceTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        }
      })
      .catch(error => console.error('Error removing todo:', error));
  };

  const clearCompletedTodos = (category) => {
    if (category === 'daily') {
      setDailyTodos(prevTodos => prevTodos.map(todo => ({ ...todo, done: false })));
    } else {
      setOnceTodos(prevTodos => prevTodos.filter(todo => !todo.done));
    }
  };

  return (
    <TodoContext.Provider value={{ dailyTodos, onceTodos, addTodo, toggleTodoDone, removeTodo, clearCompletedTodos }}>
      {children}
    </TodoContext.Provider>
  );
};
