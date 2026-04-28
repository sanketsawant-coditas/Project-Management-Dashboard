import { Button } from '@/components/Button/Button';
import styles from './ProjectModal.module.scss';

interface Member {
  userId: string;
  userName: string;
  userRole: string;
  projectRole: string;
  joinedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  ownerName: string;
  members: Member[];
  startDate: string;
  endDate?: string;
  budget?: number;
  technologies?: string[];
}

interface Props {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  canEdit: boolean;
}

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

export default function ProjectModal({ project, onClose, onEdit, canEdit }: Props) {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{project.name}</h2>
        <div className={styles.section}>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Status:</strong> {formatStatus(project.status)}</p>
          <p><strong>Priority:</strong> {formatPriority(project.priority)}</p>
          <p><strong>Progress:</strong> {project.progress}%</p>
          <p><strong>Owner:</strong> {project.ownerName}</p>
          <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          {project.endDate && <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>}
          {project.budget && <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>}
          {project.technologies && project.technologies.length > 0 && (
            <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
          )}
        </div>
        <div className={styles.section}>
          <strong>Team Members:</strong>
          {project.members.length === 0 ? (
            <p>No members assigned.</p>
          ) : (
            <ul className={styles.memberList}>
              {project.members.map(member => (
                <li key={member.userId}>
                  {member.userName} – {member.projectRole} ({member.userRole})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          {canEdit && <Button onClick={onEdit}>Edit Project</Button>}
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}