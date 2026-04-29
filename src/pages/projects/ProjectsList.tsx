import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import ProjectForm from './ProjectForm';
import ProjectModal from './ProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { formatStatus, formatPriority, statusColor, priorityColor } from '@/utils/formatters';
import { projectService } from '@/services/projectService';
import styles from './ProjectsList.module.scss';
import type { Project } from '@/types';

export default function ProjectsList() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
const [editingProject, setEditingProject] = useState<Project | null>(null);
const [modalProject, setModalProject] = useState<Project | null>(null);

const { projects, totalPages, loading, refetch } = useProjects(page, 10, statusFilter, priorityFilter);

  const canEdit = user?.role === 'admin' || user?.role === 'super-admin';
  const canDelete = user?.role === 'super-admin';

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await projectService.delete(id);
    refetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Projects</h1>
        {canEdit && (
          <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
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
        <Button variant="secondary" onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>
          Clear Filters
        </Button>
      </div>

      {loading && <div>Loading...</div>}

      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.card} onClick={() => setModalProject(p)}>
            <div className={styles.cardHeader}>
              <h3>{p.name}</h3>
              <div className={styles.badges}>
                <Badge variant={statusColor[p.status]}>{formatStatus(p.status)}</Badge>
                <Badge variant={priorityColor[p.priority]}>{formatPriority(p.priority)}</Badge>
              </div>
            </div>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: `${p.progress}%` }} />
              <span>{p.progress}%</span>
            </div>
            <div className={styles.details}>
              <div>Owner: {p.ownerName}</div>
              <div>Team: {p.members?.length || 0} members</div>
              <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>
            </div>
            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
              {canEdit && (
                <Button variant="secondary" onClick={(e) => {
                  e.stopPropagation();
                  setEditingProject(p);
                  setShowForm(true);
                }}>
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p.id);
                }}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            // You can add a refetch trigger here; for simplicity, reload
            window.location.reload();
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