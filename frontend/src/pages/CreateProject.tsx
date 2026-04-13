import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending:", { name, description });

      await api.post("/projects/create/", {
        name,
        description,
      });

      navigate("/projects"); // 🔥 go back after create
    } catch {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h2>Create Project</h2>

      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
};

export default CreateProject;