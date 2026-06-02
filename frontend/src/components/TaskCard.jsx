const priorityConfig = {
  HIGH: {
    label: "Yuqori",
    className: "bg-red-500/20 text-red-400 border border-red-500/30",
    dot: "bg-red-400",
  },
  MEDIUM: {
    label: "O'rta",
    className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  LOW: {
    label: "Past",
    className: "bg-green-500/20 text-green-400 border border-green-500/30",
    dot: "bg-green-400",
  },
};

const statusNext = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};

const statusNextLabel = {
  TODO: "Boshlash →",
  IN_PROGRESS: "Tugatish ✓",
  DONE: "Qayta ochish ↺",
};

const statusNextColors = {
  TODO: "bg-blue-600 hover:bg-blue-500 text-white",
  IN_PROGRESS: "bg-green-600 hover:bg-green-500 text-white",
  DONE: "bg-slate-600 hover:bg-slate-500 text-white",
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const isOverdue = d < now;
  const formatted = d.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return { formatted, isOverdue };
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const dateInfo = formatDate(task.dueDate);
  const nextStatus = statusNext[task.status];

  return (
    <div className="group bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md hover:shadow-xl hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5">
      {/* Priority badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priority.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
            title="Tahrirlash"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            title="O'chirish"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold text-sm leading-snug mb-2 ${
          task.status === "DONE"
            ? "line-through text-slate-500"
            : "text-slate-100"
        }`}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due date */}
      {dateInfo && (
        <div
          className={`flex items-center gap-1.5 text-xs mb-3 ${
            dateInfo.isOverdue && task.status !== "DONE"
              ? "text-red-400"
              : "text-slate-500"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {dateInfo.isOverdue && task.status !== "DONE"
              ? "Muddati o'tdi: "
              : "Muddat: "}
            {dateInfo.formatted}
          </span>
        </div>
      )}

      {/* Status change button */}
      <button
        onClick={() => onStatusChange(task._id, nextStatus)}
        className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 ${statusNextColors[task.status]}`}
      >
        {statusNextLabel[task.status]}
      </button>
    </div>
  );
};

export default TaskCard;
