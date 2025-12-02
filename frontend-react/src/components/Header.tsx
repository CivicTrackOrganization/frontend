import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types";

interface HeaderProps {
  username: string;
  reputation: number;
  role: UserRole;
  onToggleModerator: () => void;
}

function Header(props: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="CivicTrack" className="w-10 h-10 rounded-md" />
        <div>
          <h1 className="text-lg font-semibold">CivicTrack</h1>
          <p className="text-xs text-gray-500">City issue reporting system</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{props.username} {props.role === 'moderator' && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Moderator</span>}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={props.onToggleModerator}
            className="px-3 py-1 text-sm bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
          >
            {props.role === 'moderator' ? 'Switch to user' : 'Switch to moderator'}
          </button>
          <button onClick={() => navigate('/register-login', {replace: true})} className="px-4 py-2 bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-50">Log out</button>
        </div>
      </div>
    </header>
  );
}

export default Header;