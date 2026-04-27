import { useState } from 'react';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import styles from './ProjectForm.module.scss';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string;
  endDate?: string;
}

interface Props {
  project?: Project | null;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: Props) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    priority: project?.priority || 'medium',
    progress: project?.progress || 0,
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await api.patch(`/projects/${project.id}`, form);
      } else {
        await api.post('/projects', form);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{project ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {project && <input type="number" placeholder="Progress (0-100)" value={form.progress} onChange={e => setForm({...form, progress: Number(e.target.value)})} />}
          <input type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
          <input type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          <Button type="submit" loading={loading}>Save</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
        </form>
      </div>
    </div>
  );
}