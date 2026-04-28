import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import ProjectForm from './ProjectForm';
import ProjectModal from './ProjectModal';
import styles from './ProjectsList.module.scss';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  ownerName: string;
  members: Array<{
    userId: string;
    userName: string;
    userRole: string;
    projectRole: string;
    joinedAt: string;
  }>;
  startDate: string;
  endDate?: string;
  technologies?: string[];
  budget?: number;
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
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `/projects?page=${page}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;
      const res = await api.get(url);
      setProjects(res.data.data || []);
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

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      in_progress: 'In Progress',
      on_hold: 'On Hold',
      planning: 'Planning',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status] || status;
  };

  const formatPriority = (priority: string) => {
    const map: Record<string, string> = {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      urgent: 'Urgent',
    };
    return map[priority] || priority;
  };

  const statusColor: Record<string, string> = {
    planning: 'default',
    in_progress: 'warning',
    on_hold: 'default',
    completed: 'success',
    cancelled: 'danger',
  };

  const priorityColor: Record<string, string> = {
    low: 'default',
    medium: 'default',
    high: 'warning',
    urgent: 'danger',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Projects</h1>
        {canEdit && (
          <Button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
          >
            Create Project
          </Button>
        )}
      </div>

      <div className={styles.filters}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
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
        <Button
          variant="secondary"
          onClick={() => {
            setStatusFilter('');
            setPriorityFilter('');
          }}
        >
          Clear Filters
        </Button>
      </div>

      {loading && <div>Loading...</div>}

      <div className={styles.grid}>
        {projects.map((p) => (
          <div
            key={p.id}
            className={styles.card}
            onClick={() => setModalProject(p)}
          >
            <div className={styles.cardHeader}>
              <h3>{p.name}</h3>
              <div className={styles.badges}>
                <Badge variant={statusColor[p.status]}>{formatStatus(p.status)}</Badge>
                <Badge variant={priorityColor[p.priority]}>{formatPriority(p.priority)}</Badge>
              </div>
            </div>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: `${p.progress}%` }}></div>
              <span>{p.progress}%</span>
            </div>
            <div className={styles.details}>
              <div>Owner: {p.ownerName}</div>
              <div>Team: {p.members?.length || 0} members</div>
              <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>
            </div>
            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
              {canEdit && (
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(p);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            fetchProjects();
          }}
        />
      )}

      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          onEdit={() => {
            setModalProject(null);
            setEditingProject(modalProject);
            setShowForm(true);
          }}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}