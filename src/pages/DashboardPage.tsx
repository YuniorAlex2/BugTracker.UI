import IssueDetailsModal from "../components/IssueDetailsModal";
import EditIssueModal from "../components/EditIssueModal";
import { deleteIssue } from "../services/issueService";
import CreateProjectModal from "../components/CreateProjectModal";
import { useCallback } from "react";
import { Power, Plus } from "lucide-react";
import CreateIssueModal from "../components/CreateIssueModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
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

function DashboardPage() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
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

      if (loading) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);

      params.append("pageNumber", page.toString());
      params.append("pageSize", "6");

      const response = await fetch(
        `${API_BASE_URL}/issues?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data: PagedIssuesResponse = await response.json();
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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              Dashboard
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Bug Tracker</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Monitor issues, track project work, and keep progress visible with
              a clean and modern interface.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur transition hover:border-slate-700">
            {/* Current View */}
            <div className="px-3">
              <p className="text-xs text-slate-400">Current View</p>
              <p className="text-xl font-semibold">{issues.length} Issues</p>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-700" />

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-xl p-2 text-slate-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Power size={18} />
            </button>
          </div>
        </header>
        <CreateIssueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={loadIssues}
        />

        <CreateProjectModal
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
          onProjectCreated={() => {
            // for now nothing, later we refresh projects
          }}
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

              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
              >
                <Plus size={16} />
                New Project
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-900 bg-rose-950/40 p-6 text-rose-300">
                {error}
              </div>
            )}

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
    </div>
  );
}

export default DashboardPage;
