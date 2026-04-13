import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Card} from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  description?: string;
}

const Projects = () => {
  const navigate =useNavigate()
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      setProjects(res.data);
    } catch (err: any) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

return (
  <div className="max-w-7xl mx-auto p-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Projects</h2>

      <button
        onClick={() => navigate("/projects/new")}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        + Create Project
      </button>
    </div>

    {projects.length === 0 ? (
      <p className="text-gray-500 mt-6">
        No projects found 🚀
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="
              p-4 
              cursor-pointer 
              border 
              rounded-xl
              transition-all duration-200 ease-in-out
              hover:shadow-lg 
              hover:scale-105
            "
          >
            <h3 className="font-semibold text-lg">
              {project.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>
          </Card>
        ))}
      </div>
    )}
  </div>
);
};

export default Projects;