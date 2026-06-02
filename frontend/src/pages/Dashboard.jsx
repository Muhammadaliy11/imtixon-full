import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../api/axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Vazifalarni yuklab olish
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.data || []);
    } catch (error) {
      console.error("Vazifalarni yuklashda xato:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Vazifalarni status bo'yicha filtrlash
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  // Yangi vazifa yoki tahrirlash modal ochish
  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Vazifa yaratish yoki yangilash
  const handleSubmitTask = async (formData) => {
    setModalLoading(true);
    try {
      if (editingTask) {
        // Yangilash
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        // Yaratish
        await api.post("/tasks", formData);
      }
      await fetchTasks();
      handleCloseModal();
    } catch (error) {
      alert(
        error.response?.data?.message || "Vazifani saqlashda xato yuz berdi"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Status o'zgartirish
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.message || "Statusni o'zgartirishda xato yuz berdi"
      );
    }
  };

  // O'chirish (tasdiqlash bilan)
  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `"${task.title}" vazifasini o'chirishga ishonchingiz komilmi?`
    );
    if (!confirmed) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.message || "Vazifani o'chirishda xato yuz berdi"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + New Task button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Mening vazifalarim
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Jami {tasks.length} ta vazifa
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-900/40"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Yangi vazifa
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-10 h-10 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-slate-400 text-sm">Yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-800 border border-slate-700 rounded-2xl">
                <svg
                  className="w-16 h-16 text-slate-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-slate-400 text-lg font-medium mb-2">
                  Hali vazifa yo'q
                </p>
                <p className="text-slate-500 text-sm mb-6">
                  Yangi vazifa qo'shish uchun yuqoridagi tugmani bosing
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all duration-200"
                >
                  Birinchi vazifani yaratish
                </button>
              </div>
            )}

            {/* Kanban Board - 3 ustun */}
            {tasks.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* TODO ustuni */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                    <h2 className="text-lg font-semibold text-slate-300">
                      Bajarilmagan
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs font-medium">
                      {todoTasks.length}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 min-h-[200px]">
                    {todoTasks.length === 0 ? (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">
                          Vazifa yo'q
                        </p>
                      </div>
                    ) : (
                      todoTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleOpenModal}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* IN_PROGRESS ustuni */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <h2 className="text-lg font-semibold text-slate-300">
                      Jarayonda
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs font-medium border border-blue-700/30">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 min-h-[200px]">
                    {inProgressTasks.length === 0 ? (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">
                          Vazifa yo'q
                        </p>
                      </div>
                    ) : (
                      inProgressTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleOpenModal}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* DONE ustuni */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <h2 className="text-lg font-semibold text-slate-300">
                      Bajarilgan
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 text-xs font-medium border border-green-700/30">
                      {doneTasks.length}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 min-h-[200px]">
                    {doneTasks.length === 0 ? (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">
                          Vazifa yo'q
                        </p>
                      </div>
                    ) : (
                      doneTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleOpenModal}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;
