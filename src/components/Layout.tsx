import LogoutButton from "./LogoutButton";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Bug } from "lucide-react";

function Layout() {
  const location = useLocation();

  function getLinkClasses(path: string) {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-cyan-500 text-slate-950"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-6">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:w-64 lg:flex-col lg:shrink-0">
          <div className="mb-4 lg:mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Bug Tracker
            </p>
            <h1 className="mt-2 text-xl font-bold sm:text-2xl">Workspace</h1>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <Link to="/" className={getLinkClasses("/")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link to="/issues" className={getLinkClasses("/issues")}>
              <Bug size={18} />
              Issues
            </Link>

            <Link to="/projects" className={getLinkClasses("/projects")}>
              <FolderKanban size={18} />
              Projects
            </Link>
          </nav>

          <div className="mt-4 border-t border-slate-800 pt-4 lg:mt-auto">
            <LogoutButton />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
