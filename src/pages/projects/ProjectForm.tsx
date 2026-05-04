import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import styles from './ProjectForm.module.scss';
import { projectSchema, type FormData } from '@/schemas/project.schema';
import type { ProjectFormProps } from './props.types';
import toast from 'react-hot-toast';   // ✅ fixed import

export default function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const progressValue = watch('progress'); // to display live value

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
        toast.success('Project updated successfully');
        if (onSuccess) onSuccess(response.data);   // ✅ added for edit
      } else {
        response = await api.post('/projects', payload);
        toast.success('Project created successfully');
        if (onSuccess) onSuccess(response.data);   // already present
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save project';
      toast.error(msg);
    }
  };

  const isEditMode = !!project;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Two‑column layout for basic info */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Project Name</label>
              <input placeholder="e.g., E‑Commerce Platform" {...register('name')} />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Budget (optional)</label>
              <input type="number" placeholder="$" {...register('budget', { valueAsNumber: true })} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea placeholder="Describe the project..." {...register('description')} rows={3} />
            {errors.description && <span className={styles.error}>{errors.description.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Status</label>
              <select {...register('status')}>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Priority</label>
              <select {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start Date</label>
              <input type="date" {...register('startDate')} />
              {errors.startDate && <span className={styles.error}>{errors.startDate.message}</span>}
            </div>
            <div className={styles.field}>
              <label>End Date (optional)</label>
              <input type="date" {...register('endDate')} />
            </div>
          </div>

          {/* 🔁 Progress slider – only in edit mode */}
          {isEditMode && (
            <div className={styles.field}>
              <label>Progress: {progressValue}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                {...register('progress', { valueAsNumber: true })}
                className={styles.slider}
              />
              {errors.progress && <span className={styles.error}>{errors.progress.message}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label>Technologies (comma separated)</label>
            <input placeholder="React, TypeScript, Tailwind" {...register('technologies')} />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" loading={isSubmitting}>
              {isEditMode ? 'Update Project' : 'Create Project'}
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