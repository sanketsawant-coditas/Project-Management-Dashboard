import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import styles from './ProjectForm.module.scss';
import { projectSchema, type FormData } from '@/schemas/project.schema';
import type { ProjectFormProps } from './props.types';
import { toast } from 'react-hot-toast/headless';

export default function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      progress: 0,
      startDate: '',
      endDate: '',
      budget: undefined,
      technologies: '',
    },
  });

  useEffect(() => {
    if (project) {
      setValue('name', project.name);
      setValue('description', project.description);
      setValue('status', project.status as any);
      setValue('priority', project.priority as any);
      setValue('progress', project.progress);
      setValue('startDate', project.startDate.split('T')[0]);
      if (project.endDate) setValue('endDate', project.endDate.split('T')[0]);
      if (project.budget) setValue('budget', project.budget);
      if (project.technologies) setValue('technologies', project.technologies.join(', '));
    }
  }, [project, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : [],
        budget: data.budget ? Number(data.budget) : undefined,
        progress: data.progress || 0,
      };
      let response;
      if (project) {
        response = await api.patch(`/projects/${project.id}`, payload);
      } else {
        response = await api.post('/projects', payload);
      }
      if (onSuccess && !project) onSuccess(response.data);
      toast.success(project ? 'Project updated successfully' : 'Project created successfully');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save project');
      toast.error(err.response?.data?.message || 'Failed to save project');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{project ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input placeholder="Name" {...register('name')} />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          </div>
          <div>
            <textarea placeholder="Description" {...register('description')} rows={3} />
            {errors.description && <span className={styles.error}>{errors.description.message}</span>}
          </div>
          <div>
            <select {...register('status')}>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          {project && (
            <div>
              <input type="number" placeholder="Progress (0-100)" {...register('progress', { valueAsNumber: true })} />
              {errors.progress && <span className={styles.error}>{errors.progress.message}</span>}
            </div>
          )}
          <div>
            <input type="date" {...register('startDate')} />
            {errors.startDate && <span className={styles.error}>{errors.startDate.message}</span>}
          </div>
          <div>
            <input type="date" {...register('endDate')} />
          </div>
          <div>
            <input type="number" placeholder="Budget" {...register('budget', { valueAsNumber: true })} />
          </div>
          <div>
            <input placeholder="Technologies (comma separated)" {...register('technologies')} />
          </div>
          <div className={styles.buttons}>
            <Button type="submit" loading={isSubmitting}>
              {project ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}