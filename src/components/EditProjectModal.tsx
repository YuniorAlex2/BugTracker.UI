import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { updateProject } from "../services/projectService";
import type { Project, UpdateProjectDto } from "../services/projectService";

type EditProjectModalProps = {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdated: () => void;
};

function EditProjectModal({
  isOpen,
  project,
  onClose,
  onUpdated,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<UpdateProjectDto>({
    name: "",
    description: "",
    owner: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !project) return;

    setFormData({
      name: project.name,
      description: project.description,
      owner: project.owner,
    });
  }, [isOpen, project]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!project) return;

    try {
      setSubmitting(true);
      setError("");

      await updateProject(project.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update project.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Project</h2>
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
            <label className="mb-1 block text-sm text-slate-300">
              Project Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Owner</label>
            <input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              type="text"
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none"
              required
            />
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

export default EditProjectModal;
