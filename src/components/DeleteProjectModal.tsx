import { deleteProject } from "../services/projectService";
import type { Project } from "../services/projectService";

type DeleteProjectModalProps = {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onDeleted: () => void;
};

function DeleteProjectModal({
  isOpen,
  project,
  onClose,
  onDeleted,
}: DeleteProjectModalProps) {
  async function handleDelete() {
    if (!project) return;

    try {
      await deleteProject(project.id);
      onDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  }

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-3 text-lg font-semibold text-white">Delete Project</h2>

        <p className="mb-6 text-sm text-slate-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">"{project.name}"</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProjectModal;