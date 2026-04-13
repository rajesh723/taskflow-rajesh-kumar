import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);
  const [uniqueAssignees, setUniqueAssignees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [editingTask, setEditingTask] = useState<any>(null);

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}/`);
    setProject(res.data);
    setTasks(res.data.tasks || []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        console.log("res.data",res.data)

        setUniqueAssignees(res.data); // ✅ use res.data
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter ? task.status === statusFilter : true;
    const assigneeMatch = assigneeFilter
      ? task.assignee === assigneeFilter
      : true;

    return statusMatch && assigneeMatch;
  });

  // 🎯 Priority color mapping
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "low":
          return "bg-green-100 text-green-700";
        case "medium":
          return "bg-yellow-100 text-yellow-700";
        case "high":
          return "bg-red-100 text-red-700";
        default:
          return "";
      }
    };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}/`, {
          title,
          description,
          due_date: dueDate || null,
          status,
          priority,
          assignee: assignee || null,
        });
      } else {
        await api.post(`/projects/${id}/tasks/`, {
          title,
          description,
          due_date: dueDate || null,
          status,
          priority,
          assignee: assignee || null,
        });
      }

      fetchProject();
      setIsModalOpen(false);

      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("todo");
      setPriority("medium");
      setAssignee("");
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task", err);
    }
  };

  const handleDeleteClick = (task: any) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/tasks/${taskToDelete.id}/`);
      fetchProject();
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!project) return <p className="p-6">Loading...</p>;

  console.log("fdsfdsfds",uniqueAssignees)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          className="border rounded-md px-3 py-2"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        
        <select
          className="border rounded-md px-3 py-2"
          onChange={(e) => setAssigneeFilter(e.target.value)}
        >
          <option value="">All Assignees</option>
          {uniqueAssignees.map((user: any) => (
            
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditingTask(null);
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("todo");
            setPriority("medium");
            setAssignee("");
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          + Create Task
        </button>
      </div>

      {/* KANBAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["todo", "in_progress", "done"].map((statusColumn) => (
          <div key={statusColumn}>
            <h3 className="font-semibold mb-3 capitalize">
              {statusColumn.replace("_", " ")}
            </h3>

            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.status === statusColumn)
                .map((task) => {
                  const isOverdue =
                    task.due_date &&
                    new Date(task.due_date) < new Date();

                  return (
                    <Card
                      key={task.id}
                      className="p-4 border cursor-pointer hover:shadow-md transition space-y-2"
                      onClick={() => {
                        setEditingTask(task);
                        setTitle(task.title);
                        setDescription(task.description || "");
                        setDueDate(task.due_date || "");
                        setStatus(task.status);
                        setPriority(task.priority);
                        setAssignee(task.assignee || "");
                        setIsModalOpen(true);
                      }}
                    >
                      <h4 className="font-medium">{task.title}</h4>

                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                         Description : {task.description}
                        </p>
                      )}

                      <div className="">
                        <Badge className={getPriorityColor(task.priority)}>
                         Task Priority : {task.priority}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground">
                         Assignee : {task.assignee_details?.name || "Unassigned"}
                        </span>
                      </div>

                      {task.due_date && (
                        <p
                          className={`text-xs ${
                            isOverdue ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          Due Date : {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(task);
                        }}
                        className="text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 space-y-3">
            <h3 className="font-semibold">
              {editingTask ? "Edit Task" : "Create Task"}
            </h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full border px-3 py-2 rounded-md"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded-md"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Assign to</option>
              {uniqueAssignees.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleSaveTask}
                className="bg-black text-white px-3 py-2 rounded-md"
              >
                {editingTask ? "Update" : "Create"}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="border px-3 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-72 space-y-3">
            <h3 className="font-semibold">Delete Task?</h3>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-3 py-2 rounded-md"
              >
                Confirm
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="border px-3 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;