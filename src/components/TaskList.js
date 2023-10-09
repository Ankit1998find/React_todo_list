import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import "./tasklist.css";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editedTask, setEditedTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/task");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [setTasks]);

  useEffect(() => {
    fetchData();
  }, [tasks, fetchData]);

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await axios.post("/api/task", { taskTitle: newTask });
        setTasks([...tasks, response.data]);
        setNewTask("");

        if ((tasks.length + 1) % tasksPerPage === 1 && tasks.length !== 0) {
          setCurrentPage(currentPage + 1);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const editTask = (index) => {
    setEditedTask(tasks[index].taskTitle);
    setEditIndex(index);
  };

  const updateTask = async () => {
    if (editedTask.trim() !== "") {
      try {
        await axios.put(`/api/task/${tasks[editIndex]._id}`, {
          taskTitle: editedTask,
        });

        const updatedTasks = [...tasks];
        updatedTasks[editIndex].taskTitle = editedTask;
        setTasks(updatedTasks);
        setEditedTask("");
        setEditIndex(null);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const deleteTask = async (index) => {
    try {
      const taskId = tasks[index]._id;
      await axios.delete(`/api/task/${taskId}`);
      const updatedTasks = tasks.filter((task, i) => i !== index);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="d-block text-center font-bold sm:w-fit sm:m-auto sm:mt-10 md:mt-20 border-pink-500 border-solid border-2 rounded-lg h-[100vh] sm:h-[100vh] sm:mb-5">
      <div className="bg-pink-500">
        <div className="flex items-center justify-center gap-3 flex-1 shadow-lg h-20 mt-0 sm:px-8">
          <input
            className="h-10"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="bg-white btn" onClick={addTask}>
            Add
          </button>
        </div>
      </div>

      <ul className="bg-slate-50 shadow-lg py-10">
        {currentTasks.map((task, index) => (
          <li key={index}>
            {index === editIndex ? (
              <div className="flex items-center justify-center gap-2 shadow-lg h-10 mt-10 sm:px-2 py-5 mr-7">
                <input
                  className="border-black border-solid border-2 h-8"
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button
                  className="btn btn-sm"
                  style={{ background: "#FF4B91" }}
                  onClick={updateTask}
                >
                  Update
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-center gap-10 p-15 mr-7 shadow-lg mt-10 border-pink-500 border-solid border-1 py-8 sm:px-5 sm:py-5 taskbox rounded-lg">
                <div className="text-lg sm:text-sm font-semibold w-28 sm:w-50 inline">
                  {task.taskTitle}
                </div>
                <button
                  className="btn btn-sm"
                  style={{ background: "#FF4B91" }}
                  onClick={() => editTask(index)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: "#FF4B91" }}
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center mt-4">
        <button
          className="btn btn-sm"
          style={{ background: "#FF4B91" }}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="mx-4 text-lg">Page {currentPage}</div>
        <button
          className="btn btn-sm"
          style={{ background: "#FF4B91" }}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentTasks.length < tasksPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
