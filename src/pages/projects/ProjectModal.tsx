import { useState, useEffect } from 'react';
import { Button } from '@/components/Button/Button';
import { projectService } from '@/services/projectService';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';
import styles from './ProjectModal.module.scss';
import type { ProjectModalProps } from './props.types';

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

export default function ProjectModal({ project, onClose, onEdit, canEdit, onUpdate }: ProjectModalProps) {
  const [members, setMembers] = useState(project.members);
  const [allUsers, setAllUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // Fetch all users for the dropdown
  useEffect(() => {
    if (!canEdit) return; 
    const fetchUsers = async () => {
      try {
        const res = await userService.getAll(1, 100);
        setAllUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [canEdit]);

  const refreshProject = async () => {
    try {
      const res = await projectService.getById(project.id);
      setMembers(res.data.members);
      if (onUpdate) onUpdate(res.data);   
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await projectService.addMember(project.id, selectedUserId);
      toast.success('Member added successfully');
      await refreshProject();
      setSelectedUserId('');
      setAddingMember(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectService.removeMember(project.id, userId);
      toast.success('Member removed');
      await refreshProject();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

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
          <div className={styles.teamHeader}>
            <strong>Team Members ({members.length})</strong>
            {canEdit && (
              <Button variant="secondary" onClick={() => setAddingMember(!addingMember)}>
                {addingMember ? 'Cancel' : 'Add Member'}
              </Button>
            )}
          </div>

          {addingMember && canEdit && (
            <div className={styles.addMember}>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Select a user...</option>
                {allUsers
                  .filter((u) => !members.some((m) => m.userId === u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
              </select>
              <Button onClick={handleAddMember} disabled={!selectedUserId}>Add</Button>
            </div>
          )}

          {members.length === 0 ? (
            <p>No members assigned.</p>
          ) : (
            <ul className={styles.memberList}>
              {members.map((member) => (
                <li key={member.userId}>
                  <span>{member.userName} – {member.projectRole} ({member.userRole})</span>
                  {canEdit && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      Remove
                    </button>
                  )}
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