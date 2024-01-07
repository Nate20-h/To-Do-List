import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task === '') {
      alert("You must write something!");
    } else {
      const newTask = { text: task, completed: false };
      setTasks([...tasks, newTask]);

      const apiRequest = async () => {
        await fetch(`https://0i7css5smi.execute-api.us-east-2.amazonaws.com/test/tasks?task=${task}`, {
          method: "POST"
        });
      };
      apiRequest();
      setTask(""); // Clear the input after adding
    }
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((t, i) => {
      if (i === index) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(newTasks);
  };

  function removeTask(taskToRemove) {
    const newTasks = tasks.filter(t => t.text !== taskToRemove.text);
    setTasks(newTasks);

    async function apiRequest() {
      try {
        const response = await fetch(`https://0i7css5smi.execute-api.us-east-2.amazonaws.com/test/tasks?task=${taskToRemove.text}&delete=true`, {
          method: "POST",
          mode: "cors"
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error(`Error deleting task: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    apiRequest();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://0i7css5smi.execute-api.us-east-2.amazonaws.com/test/tasks', {
          method: 'GET',
          mode: 'cors',
        });
        const data = await response.json();
        setTasks(data.map(item => ({ text: item.task, completed: false }))); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="todo-app">
          <h2> To-Do List <img className="image-class" src="C:\Users\hagem\OneDrive\Desktop\project\shows-webpage\src\list.png" alt="list" /></h2>
          <div className="row">
            <input type="text" required value={task} onChange={e => setTask(e.target.value)} placeholder="Add your text" />
            <button onClick={addTask}>Add</button>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className={task.completed ? "checked" : ""} onClick={() => toggleTask(index)}>
                {task.text}
                <span onClick={(e) => { e.stopPropagation(); removeTask(task); }}>&times;</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
