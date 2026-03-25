import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    DragDropContext,
    Droppable,
    Draggable
} from "react-beautiful-dnd";
import {
    FiPlus,
    FiTrash2,
    FiEdit2,
    FiX
} from "react-icons/fi";
import Navbar from "../components/Navbar";

const API = "http://127.0.0.1:8000/api";

const Dashboard = () => {
    const [lists, setLists] = useState([]);
    const [listTitle, setListTitle] = useState("");
    const [selectedList, setSelectedList] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const columns = ["backlog", "todo", "inprogress", "done"];

    // ================= FETCH LISTS =================

    const createList = async () => {
        if (!listTitle) return;

        const res = await axios.post(
            `${API}/lists/create/`,
            { title: listTitle },
            { headers }
        );

        setLists(prev => [...prev, res.data]);

        // AUTO SELECT NEW LIST 🔥
        setSelectedList(res.data.id);
        setListTitle("");
    };
    const fetchLists = async () => {
        const res = await axios.get(`${API}/lists/`, { headers });
        setLists(res.data);
    };

    useEffect(() => {
        fetchLists();
    }, []);
    useEffect(() => {
        if (lists.length > 0 && !selectedList) {
            setSelectedList(lists[0].id);
            loadTasks(lists[0].id);
        }
    }, [lists]);

    // ================= LOAD TASKS =================
    const loadTasks = async (listId) => {
        setSelectedList(listId);
        const res = await axios.get(`${API}/tasks/${listId}/`, { headers });
        setTasks(res.data);
    };
    useEffect(() => {
        if (lists.length > 0 && !selectedList) {
            setSelectedList(lists[0].id);
            loadTasks(lists[0].id);
        }
    }, [lists]);

    // ================= CREATE TASK =================
    const createTask = async () => {
        if (!title || !selectedList) {
            alert("Select a list first");
            return;
        }

        const res = await axios.post(
            `${API}/tasks/create/`,
            { title, list_id: selectedList },
            { headers }
        );

        setTasks(prev => [...prev, res.data]);
        setTitle("");
        setShowTaskModal(false);
    };

    // ================= DELETE TASK =================
    const deleteTask = async (id) => {
        await axios.delete(`${API}/tasks/delete/${id}/`, { headers });
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    // ================= EDIT TASK =================
    const editTask = async (task) => {
        const newTitle = prompt("Edit Task", task.title);
        if (!newTitle) return;

        await axios.put(
            `${API}/tasks/update/${task.id}/`,
            { title: newTitle },
            { headers }
        );

        setTasks(prev =>
            prev.map(t => t.id === task.id ? { ...t, title: newTitle } : t)
        );
    };

    // ================= SHARE =================
    const shareList = async () => {
        if (!email || !selectedList) {
            alert("Select a list first");
            return;
        }

        await axios.post(
            `${API}/share/`,
            { email, list_id: selectedList },
            { headers }
        );

        setEmail("");
        setShowShareModal(false);
    };
    // ================= DRAG =================
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const id = parseInt(draggableId);

        axios.put(
            `${API}/tasks/update/${id}/`,
            { column: destination.droppableId },
            { headers }
        );

        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, column: destination.droppableId } : t
            )
        );
    };

    return (
        <> <Navbar />
            <div className="flex h-screen bg-gray-100">

                {/* ================= SIDEBAR ================= */}
                <div className="w-64 bg-white shadow-lg p-4">
                    <h2 className="text-xl font-bold mb-4">Boards</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                            placeholder="New list"
                            className="border p-2 rounded w-full"
                        />
                        <button
                            onClick={createList}
                            className="bg-blue-500 text-white px-3 rounded"
                        >
                            +
                        </button>
                    </div>

                    {lists.map(list => (
                        <div
                            key={list.id}
                            onClick={() => loadTasks(list.id)}
                            className={`p-2 rounded cursor-pointer mb-2 ${selectedList === list.id
                                ? "bg-blue-100"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {list.title}
                        </div>
                    ))}
                </div>

                {/* ================= MAIN ================= */}
                <div className="flex-1 flex flex-col">

                    {/* NAVBAR */}
                    <div className="flex justify-between items-center p-4 bg-white shadow">
                        <h1 className="text-xl font-bold">🚀 Collaborative Board</h1>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Share
                            </button>

                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                <FiPlus /> Create Task
                            </button>
                        </div>
                    </div>

                    {/* BOARD */}
                    <div className="p-6 overflow-auto flex-1">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="grid grid-cols-4 gap-4">

                                {columns.map(col => (
                                    <Droppable droppableId={col} key={col}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="bg-white p-3 rounded shadow min-h-[400px]"
                                            >
                                                <h3 className="font-bold mb-3 capitalize">{col}</h3>

                                                {tasks
                                                    .filter(t => t.column === col)
                                                    .map((task, index) => (
                                                        <Draggable
                                                            key={task.id.toString()}
                                                            draggableId={task.id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="bg-gray-100 p-3 rounded mb-2 shadow hover:bg-gray-200"
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <span>{task.title}</span>

                                                                        <div className="flex gap-2">
                                                                            <FiEdit2
                                                                                className="cursor-pointer"
                                                                                onClick={() => editTask(task)}
                                                                            />
                                                                            <FiTrash2
                                                                                className="cursor-pointer text-red-500"
                                                                                onClick={() => deleteTask(task.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}

                            </div>
                        </DragDropContext>
                    </div>
                </div>

                {/* ================= CREATE TASK MODAL ================= */}
                {showTaskModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded w-96">
                            <div className="flex justify-between mb-4">
                                <h2 className="font-bold">Create Task</h2>
                                <FiX onClick={() => setShowTaskModal(false)} className="cursor-pointer" />
                            </div>

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Task title"
                                className="w-full border p-2 rounded mb-4"
                            />

                            <button
                                onClick={createTask}
                                className="bg-green-500 text-white px-4 py-2 rounded w-full"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= SHARE MODAL ================= */}
                {showShareModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded w-96">
                            <div className="flex justify-between mb-4">
                                <h2 className="font-bold">Share List</h2>
                                <FiX onClick={() => setShowShareModal(false)} className="cursor-pointer" />
                            </div>

                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full border p-2 rounded mb-4"
                            />

                            <button
                                onClick={shareList}
                                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;