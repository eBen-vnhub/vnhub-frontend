import { MoreVertical } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-hover/30 text-xs text-muted uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">User</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-surface-hover/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-main">{u.name}</div>
                <div className="text-xs text-muted mt-1">{u.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-brand/10 text-brand text-xs font-bold rounded-md">
                  {u.role.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {u.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-muted">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
