import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getProjects } from "../services/projectService";
import type { Project } from "../services/projectService";
import { updateIssue } from "../services/issueService";
import type { Issue, UpdateIssueRequest } from "../services/issueService";

type EditIssueModalProps = {
  isOpen: boolean;
  issue: Issue | null;
  onClose: () => void;
  onUpdated: () => void;
};

function EditIssueModal({
  isOpen,
  issue,
  onClose,
  onUpdated,
}: EditIssueModalProps) {
  const [formData, setFormData] = useState<UpdateIssueRequest>({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    projectId: 0,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !issue) return;

    setFormData({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      projectId: issue.projectId,
    });
  }, [isOpen, issue]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects.");
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, [isOpen]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "projectId" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!issue) return;

    try {
      setSubmitting(true);
      setError("");

      await updateIssue(issue.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update issue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Issue</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white"
              required
              disabled={loadingProjects || projects.length === 0}
            >
              {loadingProjects ? (
                <option value={0}>Loading projects...</option>
              ) : (
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIssueModal;