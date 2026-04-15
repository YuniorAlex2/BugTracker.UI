import { X } from "lucide-react";
import type { Issue } from "../services/issueService";

type IssueDetailsModalProps = {
  isOpen: boolean;
  issue: Issue | null;
  onClose: () => void;
};

function IssueDetailsModal({
  isOpen,
  issue,
  onClose,
}: IssueDetailsModalProps) {
  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Issue Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400">Title</p>
            <p className="text-white">{issue.title}</p>
          </div>

          <div>
            <p className="text-slate-400">Description</p>
            <p className="text-white">{issue.description}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>
            <p className="text-white">{issue.status}</p>
          </div>

          <div>
            <p className="text-slate-400">Priority</p>
            <p className="text-white">{issue.priority}</p>
          </div>

          <div>
            <p className="text-slate-400">Project</p>
            <p className="text-white">{issue.projectName}</p>
          </div>

          <div>
            <p className="text-slate-400">Created</p>
            <p className="text-white">{new Date(issue.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetailsModal;