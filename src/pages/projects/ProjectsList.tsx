import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';

import styles from './ProjectsList.module.scss';
import ProjectForm from './ProjectForm';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  owner: { id: string; name: string };
  teamMembers: { id: string; name: string }[];
  startDate: string;
  endDate?: string;
}

export default function ProjectsList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `/projects?page=${page}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;
      const res = await api.get(url);
      setProjects(res.data.projects || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, statusFilter, priorityFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'super-admin';
  const canDelete = user?.role === 'super-admin';

  const statusColors: Record<string, string> = {
    planning: 'default',
    'in-progress': 'warning',
    'on-hold': 'default',
    completed: 'success',
    cancelled: 'danger',
  };
  const priorityColors: Record<string, string> = {
    low: 'default',
    medium: 'default',
    high: 'warning',
    urgent: 'danger',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Projects</h1>
        {canEdit && <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>Create Project</Button>}
      </div>
      <div className={styles.filters}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <Button variant="secondary" onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>Clear Filters</Button>
      </div>
      {loading && <div>Loading...</div>}
      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{p.name}</h3>
              <div className={styles.badges}>
                <Badge variant={statusColors[p.status]}>{p.status}</Badge>
                <Badge variant={priorityColors[p.priority]}>{p.priority}</Badge>
              </div>
            </div>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: `${p.progress}%` }}></div>
              <span>{p.progress}%</span>
            </div>
            <div className={styles.details}>
              <div>Owner: {p.owner.name}</div>
              <div>Team: {p.teamMembers.length} members</div>
              <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>
            </div>
            <div className={styles.actions}>
              {canEdit && <Button variant="secondary" onClick={() => { setEditingProject(p); setShowForm(true); }}>Edit</Button>}
              {canDelete && <Button variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p-1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next</button>
      </div>
      {showForm && <ProjectForm project={editingProject} onClose={() => { setShowForm(false); fetchProjects(); }} />}
    </div>
  );
}