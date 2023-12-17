import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./styles.css";

function HomePage() {
  const url = `http://localhost:5080/api/todoitems`;
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

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

  function addItem({ title, description }) {
    const item = {
      isComplete: false,
      title: title,
      description: description,
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

  function updateItem(id, title, description, isComplete) {
    const item = {
      id: id,
      title: title,
      description: description,
      isComplete: isComplete,
    };

    fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then(() => getItems())
      .catch((error) => console.error("Unable to update item.", error));
  }

  const handleEditClick = (id, title, description) => {
    setEditingId(id);
    setEditedTitle(title);
    setEditedDescription(description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleSaveEdit = () => {
    updateItem(editingId, editedTitle, editedDescription);
    console.log(
      `Editing ID: ${editingId}, Title: ${editedTitle}, Description: ${editedDescription}`
    );
    // Clear the editing state
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleCheckboxChange = (id) => {
    updateItem(
      id,
      todos.find((todo) => todo.id === id).title,
      todos.find((todo) => todo.id === id).description,
      !todos.find((todo) => todo.id === id).isComplete
    );
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ color: "#007BFF", marginBottom: "30px" }}>📝 To-do CRUD</h1>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingId !== null) {
            
            console.log(
              `Editing ID: ${editingId}, Title: ${editedTitle}, Description: ${editedDescription}`
            );
            // Clear the editing state
            setEditingId(null);
            setEditedTitle("");
            setEditedDescription("");
          } else {
            addItem({
              title: e.target.todoTitle.value,
              description: e.target.todoDescription.value,
            });
            e.target.reset(); // Clear form fields after submission
          }
        }}
      >
        <Form.Group controlId="todoTitle">
          <Form.Label>Todo Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter todo title"
            style={{ borderRadius: "5px"}}
            required
            value={editingId !== null ? editedTitle : undefined}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="todoDescription">
          <Form.Label>Todo Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter todo description"
            style={{ borderRadius: "5px"}}
            required
            value={editingId !== null ? editedDescription : undefined}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </Form.Group>
        {editingId !== null ? (
          <>
            <Button variant="success" onClick={handleSaveEdit}>
              Save Edit
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancelEdit}
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </Button>
          </>
        ) : (
          <Button variant="success" type="submit">
            Add Todo
          </Button>
        )}
      </Form>

      <h3 style={{ marginTop: "30px" }}>📋 Todo List</h3>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <Form.Check
              type="checkbox"
              id={`checkbox-${todo.id}`}
              checked={todo.isComplete}
              onChange={() => handleCheckboxChange(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <strong>{todo.title}</strong> - {todo.description}
              </>
            ) : (
              <>
                <strong>{todo.title}</strong> - {todo.description}
                <Button
                  variant="primary"
                  size="sm"
                  style={{ marginLeft: "10px" }}
                  onClick={() =>
                    handleEditClick(todo.id, todo.title, todo.description)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  style={{ marginLeft: "10px" }}
                  onClick={() => deleteItem(todo.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
