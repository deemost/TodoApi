import React, { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap';
// import './App.css';

function HomePage() {
  const url = `http://localhost:5080/api/todoitems`;
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  function getItems() {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data);
        console.log(data);
      })
      .catch((error) => console.error("Unable to get items.", error));
  }

  function addItem({ title, description}) {

    const item = {
      isComplete: false,
      title: title,
      description: description
    };

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then(() => {
        getItems();
        // addTitleTextbox.value = "";
      })
      .catch((error) => console.error("Unable to add item.", error));
  }

  function deleteItem(id) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then(() => getItems())
      .catch((error) => console.error("Unable to delete item.", error));
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ color: '#007BFF', marginBottom: '30px' }}>📝 To-do CRUD</h1>
      
      <h3 style={{ color: '#28A745' }}>➕ Add</h3>
      <Form onSubmit={(e) => {
        e.preventDefault();
        addItem({
          title: e.target.todoTitle.value,
          description: e.target.todoDescription.value
        });
        e.target.reset(); // Clear form fields after submission
      }}>
        <Form.Group controlId="todoTitle">
          <Form.Label>Todo Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter todo title"
            style={{ borderRadius: '5px', border: '1px solid #28A745' }}
            required
          />
        </Form.Group>
        <Form.Group controlId="todoDescription">
          <Form.Label>Todo Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter todo description"
            style={{ borderRadius: '5px', border: '1px solid #28A745' }}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit">Add Todo</Button>
      </Form>

      <h3 style={{ color: '#DC3545', marginTop: '30px' }}>📋 Todo List</h3>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <strong>{todo.title}</strong> - {todo.description}
            <Button variant="danger" size="sm" style={{ marginLeft: '10px' }} onClick={() => deleteItem(todo.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
