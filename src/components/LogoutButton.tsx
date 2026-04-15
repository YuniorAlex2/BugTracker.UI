import { Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-400"
    >
      <Power size={18} />
    </button>
  );
}

export default LogoutButton;