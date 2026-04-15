import { useEffect, useState } from "react";
import { Bug, FolderKanban, CircleDashed, CheckCircle2 } from "lucide-react";
import { getProjects } from "../services/projectService";
import { getIssues } from "../services/issueService";
import type { Project } from "../services/projectService";
import type { Issue } from "../services/issueService";

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const [projectsData, issuesResponse] = await Promise.all([
          getProjects(),
          getIssues({ pageNumber: 1, pageSize: 100 }),
        ]);

        setProjects(projectsData);
        setIssues(issuesResponse.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const pendingCount = issues.filter(
    (issue) => issue.status.toLowerCase() === "pending"
  ).length;

  const inProgressCount = issues.filter(
    (issue) => issue.status.toLowerCase() === "inprogress"
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status.toLowerCase() === "resolved"
  ).length;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="px-2 py-4 text-white md:px-0">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
          Overview
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          A quick summary of projects and issue activity across your bug tracker.
        </p>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Loading dashboard...
        </div>
      ) : (
        <>
          <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-400">Total Issues</p>
                <Bug size={18} className="text-cyan-400" />
              </div>
              <p className="text-3xl font-bold">{issues.length}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-400">Projects</p>
                <FolderKanban size={18} className="text-cyan-400" />
              </div>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-400">Pending</p>
                <CircleDashed size={18} className="text-amber-400" />
              </div>
              <p className="text-3xl font-bold">{pendingCount}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-400">Resolved</p>
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <p className="text-3xl font-bold">{resolvedCount}</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Issues</h2>
                <p className="text-sm text-slate-400">{recentIssues.length} shown</p>
              </div>

              {recentIssues.length === 0 ? (
                <p className="text-slate-400">No issues available yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-400">{issue.projectName}</p>
                          <h3 className="text-lg font-semibold text-white">
                            {issue.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          #{issue.id}
                        </span>
                      </div>

                      <p className="mb-3 text-sm text-slate-400">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Status: {issue.status}</span>
                        <span>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
              <h2 className="mb-5 text-xl font-semibold">Status Summary</h2>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-amber-300">
                    {pendingCount}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">In Progress</p>
                  <p className="mt-1 text-2xl font-bold text-sky-300">
                    {inProgressCount}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Resolved</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-300">
                    {resolvedCount}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;