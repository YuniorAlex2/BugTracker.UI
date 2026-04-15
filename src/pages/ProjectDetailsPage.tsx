import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProjectById, getProjectIssues } from "../services/projectService";
import type { Project } from "../services/projectService";
import type { Issue } from "../services/issueService";

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
    case "todo":
      return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30";
    case "inprogress":
      return "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30";
    case "resolved":
    case "done":
      return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30";
  }
}

function getPriorityClasses(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30";
    case "medium":
      return "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30";
    case "low":
      return "bg-green-500/15 text-green-300 ring-1 ring-green-400/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

function ProjectDetailsPage() {
  const { id } = useParams();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;

      try {
        setLoading(true);
        const projectData = await getProjectById(Number(id));
        const issuesData = await getProjectIssues(Number(id));

        setProject(projectData);
        setIssues(issuesData);
      } catch (error) {
        console.error("Failed to load project", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        Project not found.
      </div>
    );
  }

  return (
    <div className="px-2 py-4 text-white md:px-0">
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
          Project Details
        </p>
        <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-3 max-w-3xl text-slate-400">{project.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Owner</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {project.owner}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Created</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatDate(project.createdAt)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Issues</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {issues.length}
            </p>
          </div>
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Project Issues</h2>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No issues found for this project.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {issues.map((issue) => (
              <article
                key={issue.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {issue.title}
                    </h3>
                  </div>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    #{issue.id}
                  </span>
                </div>

                <p className="mb-5 text-sm leading-6 text-slate-400">
                  {issue.description}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      issue.status,
                    )}`}
                  >
                    {issue.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                      issue.priority,
                    )}`}
                  >
                    {issue.priority} Priority
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4 text-sm text-slate-500">
                  Created: {formatDate(issue.createdAt)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectDetailsPage;
