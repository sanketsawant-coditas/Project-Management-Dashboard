import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import ProjectForm from './ProjectForm';
import styles from './ProjectDetails.module.scss';

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
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'super-admin';
  const canDelete = user?.role === 'super-admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, usersRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/users?limit=100'),
        ]);
        setProject(projectRes.data);
        setAllUsers(usersRes.data.users || usersRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await api.post(`/projects/${id}/members/${selectedUserId}`);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setSelectedUserId('');
      setAddingMember(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project permanently?')) return;
    await api.delete(`/projects/${id}`);
    navigate('/projects');
  };

  const refreshProject = async () => {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data);
  };

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

  if (loading) return <div className={styles.loading}>Loading project...</div>;
  if (!project) return <div className={styles.error}>Project not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/projects" className={styles.backLink}>
          ← Back to Projects
        </Link>
        <div className={styles.actions}>
          {canEdit && <Button onClick={() => setShowEditModal(true)}>Edit Project</Button>}
          {canDelete && <Button variant="danger" onClick={handleDelete}>Delete Project</Button>}
        </div>
      </div>

      <div className={styles.card}>
        <h1>{project.name}</h1>
        <div className={styles.badges}>
          <Badge variant={statusColor[project.status]}>{formatStatus(project.status)}</Badge>
          <Badge variant={priorityColor[project.priority]}>{formatPriority(project.priority)}</Badge>
        </div>
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div style={{ width: `${project.progress}%` }}></div>
          </div>
          <span>{project.progress}%</span>
        </div>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.details}>
          <div><strong>Owner:</strong> {project.ownerName}</div>
          <div><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</div>
          {project.endDate && <div><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</div>}
          {project.budget && <div><strong>Budget:</strong> ${project.budget.toLocaleString()}</div>}
          {project.technologies && project.technologies.length > 0 && (
            <div><strong>Technologies:</strong> {project.technologies.join(', ')}</div>
          )}
        </div>
      </div>

      <div className={styles.teamCard}>
        <div className={styles.teamHeader}>
          <h2>Team Members ({project.members.length})</h2>
          {canEdit && (
            <Button variant="secondary" onClick={() => setAddingMember(!addingMember)}>
              {addingMember ? 'Cancel' : 'Add Member'}
            </Button>
          )}
        </div>
        {addingMember && canEdit && (
          <div className={styles.addMember}>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">Select user...</option>
              {allUsers
                .filter((u) => !project.members.some((m) => m.userId === u.id))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
            <Button onClick={handleAddMember} disabled={!selectedUserId}>Add</Button>
          </div>
        )}
        {project.members.length === 0 ? (
          <p>No team members assigned.</p>
        ) : (
          <ul className={styles.memberList}>
            {project.members.map((member) => (
              <li key={member.userId} className={styles.memberItem}>
                <div>
                  <strong>{member.userName}</strong>
                  {member.projectRole && <span className={styles.role}> • {member.projectRole}</span>}
                </div>
                {canEdit && (
                  <Button variant="danger" onClick={() => handleRemoveMember(member.userId)}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showEditModal && (
        <ProjectForm
          project={project}
          onClose={() => {
            setShowEditModal(false);
            refreshProject();
          }}
        />
      )}
    </div>
  );
}