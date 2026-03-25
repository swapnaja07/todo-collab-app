import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const Board = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");

    const columns = ["backlog", "todo", "inprogress", "done"];

    const fetchTasks = async () => {
        const res = await API.get("tasks/");
        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!input) return;

        await API.post("tasks/", {
            title: input,
            column: "backlog",
        });

        setInput("");
        fetchTasks();
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newColumn = result.destination.droppableId;

        await API.patch(`tasks/${taskId}/`, {
            column: newColumn,
        });

        fetchTasks();
    };

    return (
        <div className="h-screen bg-gray-100">
            <Navbar />

            {/* ADD TASK */}
            <div className="p-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter task..."
                    className="border p-2 rounded w-64"
                />
                <button onClick={addTask} className="bg-blue-600 text-white px-4 rounded">
                    Add Task
                </button>
            </div>

            {/* KANBAN */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 p-4 overflow-x-auto">
                    {columns.map((col) => (
                        <Droppable key={col} droppableId={col}>
                            {(provided) => (
                                <div
                                    className="bg-gray-200 p-4 rounded w-64"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="font-bold capitalize mb-3">{col}</h2>

                                    {tasks
                                        .filter((t) => t.column === col)
                                        .map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="bg-white p-2 rounded mb-2 shadow"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {task.title}
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
    );
};

export default Board;