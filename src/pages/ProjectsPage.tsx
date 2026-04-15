import { useCallback, useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import { getProjects, getProjectIssues } from "../services/projectService";
import type { Project } from "../services/projectService";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [issueCounts, setIssueCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);

      const projectsData = await getProjects();
      setProjects(projectsData);

      const countsEntries = await Promise.all(
        projectsData.map(async (project) => {
          try {
            const issues = await getProjectIssues(project.id);
            return [project.id, issues.length] as const;
          } catch (error) {
            console.error(
              `Failed to load issues for project ${project.id}`,
              error,
            );
            return [project.id, 0] as const;
          }
        }),
      );

      setIssueCounts(Object.fromEntries(countsEntries));
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="px-2 py-4 text-white md:px-0">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Organize work by project and explore issue activity inside each one.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Plus size={16} />
          New Project
        </button>
      </header>

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={() => {
          setIsCreateProjectOpen(false);
          loadProjects();
        }}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          No projects found.
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-slate-700"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {project.description}
                  </p>
                </div>

                <FolderKanban size={18} className="text-cyan-400" />
              </div>

              <div className="mb-4 text-sm text-slate-400">
                Owner: <span className="text-slate-300">{project.owner}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm text-slate-500">
                <span>Created: {formatDate(project.createdAt)}</span>
                <span>{issueCounts[project.id] ?? 0} issues</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

export default ProjectsPage;
