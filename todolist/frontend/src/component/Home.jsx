import React, { useState, useEffect, useRef } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskService";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await getTasks();
            setTodos(res.data);
        } catch (err) {
            console.error("❌ Lỗi load tasks:", err);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        const text = query.trim();
        if (!text) return;
        try {
            await createTask({ title: text });
            setQuery("");
            fetchTasks();
        } catch (err) {
            console.error("❌ Lỗi tạo task:", err);
        }
    };

    const toggleDone = async (id, done) => {
        try {
            await updateTask(id, { completed: !done });
            fetchTasks();
        } catch (err) {
            console.error("❌ Lỗi update task:", err);
        }
    };

    const removeTodo = async (id) => {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            console.error("❌ Lỗi xóa task:", err);
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditingText(todo.title);
    };

    const saveEdit = async (id) => {
        const text = editingText.trim();
        if (!text) {
            removeTodo(id);
        } else {
            try {
                await updateTask(id, { title: text });
            } catch (err) {
                console.error("❌ Lỗi edit task:", err);
            }
        }
        setEditingId(null);
        setEditingText("");
        fetchTasks();
    };

    const clearCompleted = async () => {
        try {
            const completed = todos.filter((t) => t.completed);
            await Promise.all(completed.map((t) => deleteTask(t._id)));
            fetchTasks();
        } catch (err) {
            console.error("❌ Lỗi clear completed:", err);
        }
    };

    const filtered = todos.filter((t) => {
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
                <header className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Todo</h1>
                </header>

                {/* Add form */}
                <form onSubmit={addTodo} className="flex gap-3 mb-4">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 rounded-lg border border-slate-200 p-3 shadow-sm focus:ring-2 focus:ring-sky-300 outline-none"
                        aria-label="Add todo"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium shadow hover:bg-sky-700 transition"
                    >
                        Add
                    </button>
                </form>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>{todos.filter((t) => !t.completed).length} left</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 rounded ${filter === "all" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("active")}
                                className={`px-3 py-1 rounded ${filter === "active" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter("completed")}
                                className={`px-3 py-1 rounded ${filter === "completed" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                Promise.all(todos.map((t) => updateTask(t._id, { completed: true }))).then(fetchTasks)
                            }
                            className="text-sm px-3 py-1 rounded hover:bg-slate-50"
                        >
                            Mark all
                        </button>
                        <button
                            onClick={clearCompleted}
                            className="text-sm px-3 py-1 rounded hover:bg-slate-50"
                        >
                            Clear completed
                        </button>
                    </div>
                </div>

                {/* Todo list */}
                <ul className="divide-y divide-slate-100 border rounded-lg overflow-hidden overflow-y-auto max-h-96">
                    {filtered.length === 0 && (
                        <li className="p-6 text-center text-slate-400">No tasks — add your first task</li>
                    )}

                    {filtered.map((todo) => (
                        <li key={todo._id} className="flex items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-3 flex-1">
                                {/* Checkbox riêng */}
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleDone(todo._id, todo.completed)}
                                    className="w-5 h-5 rounded-md"
                                />

                                {/* Text (có thể edit) */}
                                {editingId === todo._id ? (
                                    <input
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        onBlur={() => saveEdit(todo._id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveEdit(todo._id);
                                            if (e.key === "Escape") {
                                                setEditingId(null);
                                                setEditingText("");
                                            }
                                        }}
                                        autoFocus
                                        className="flex-1 rounded p-2 border border-slate-200 outline-none"
                                    />
                                ) : (
                                    <div
                                        onDoubleClick={() => startEdit(todo)}
                                        className={`flex-1 text-sm ${todo.completed ? "line-through text-slate-400" : "text-slate-800"
                                            }`}
                                    >
                                        {todo.title}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => removeTodo(todo._id)}
                                    className="px-2 py-1 text-xs rounded hover:bg-rose-50 text-rose-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <footer className="mt-4 text-sm text-slate-500 flex items-center justify-between">
                    <span>Made by reinekaiser</span>
                    <span>Tip: double-click a task to edit</span>
                </footer>
            </div>
        </div>
    );
};

export default Home;