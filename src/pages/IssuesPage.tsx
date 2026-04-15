import { getIssues } from "../services/issueService";
import { Plus } from "lucide-react";
import IssueDetailsModal from "../components/IssueDetailsModal";
import EditIssueModal from "../components/EditIssueModal";
import { deleteIssue } from "../services/issueService";
import { useCallback } from "react";
import CreateIssueModal from "../components/CreateIssueModal";
import { useEffect, useState } from "react";
import type { Issue, PagedIssuesResponse } from "../services/issueService";

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

function IssuesPage() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  async function handleDeleteIssue() {
    if (!issueToDelete) return;

    try {
      await deleteIssue(issueToDelete.id);
      setIssueToDelete(null);
      loadIssues();
    } catch (err) {
      console.error(err);
    }
  }

  const loadIssues = useCallback(async () => {
    try {
      setError("");

      if (!loading) {
        setIsFetching(true);
      }

      const data: PagedIssuesResponse = await getIssues({
        search,
        status,
        priority,
        pageNumber: page,
        pageSize: 6,
      });

      setIssues(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load issues.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [search, status, priority, page, loading]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  return (
    <div className="px-2 py-4 text-white md:px-0">
      <header className="mb-8">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Issues</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Search, filter, create, and manage issues across your projects.
          </p>
        </div>
      </header>
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={loadIssues}
      />

      <EditIssueModal
        isOpen={!!issueToEdit}
        issue={issueToEdit}
        onClose={() => setIssueToEdit(null)}
        onUpdated={() => {
          setIssueToEdit(null);
          loadIssues();
        }}
      />

      <IssueDetailsModal
        isOpen={!!selectedIssue}
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      {issueToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Delete Issue
            </h2>

            <p className="mb-6 text-sm text-slate-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                "{issueToDelete.title}"
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIssueToDelete(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteIssue}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isFetching && !loading && (
        <p className="mb-4 text-sm text-slate-400">Updating results...</p>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Loading issues...
        </div>
      )}

      {!loading && (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search issues..."
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-400"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <Plus size={16} />
              New Issue
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-900 bg-rose-950/40 p-6 text-rose-300">
              {error}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Issue List</h2>
            <p className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </p>
          </div>

          <section
            className={`grid gap-5 transition-opacity duration-200 md:grid-cols-2 xl:grid-cols-3 ${
              isFetching ? "opacity-70" : "opacity-100"
            }`}
          >
            {issues.map((issue) => (
              <article
                key={issue.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-slate-700"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">
                      {issue.projectName}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {issue.title}
                    </h2>
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
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setIssueToEdit(issue)}
                    className="text-xs text-yellow-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setIssueToDelete(issue)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-slate-400">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default IssuesPage;
