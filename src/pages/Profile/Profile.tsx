import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Badge } from '@/components/Badge/Badge';
import styles from './Profile.module.scss';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  priority: string;
  progress: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        const userData = res.data;
        setProfile(userData);
        const projectsRes = await api.get('/projects?limit=100');
        const allProjects = projectsRes.data.data || []; 
        const userProjects = allProjects.filter((project: any) =>
          project.members?.some((member: any) => member.userId === userData.id)
        );
        setAssignedProjects(userProjects);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!profile) return <div className={styles.error}>Unable to load profile</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>👤</div>
          <h1>{profile.name}</h1>
          <Badge
            variant={
              profile.role === 'super-admin'
                ? 'warning'
                : profile.role === 'admin'
                ? 'success'
                : 'default'
            }
          >
            {profile.role}
          </Badge>
        </div>
        <div className={styles.info}>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <Badge variant={profile.status === 'active' ? 'success' : 'danger'}>
              {profile.status}
            </Badge>
          </p>
          <p>
            <strong>Member since:</strong>{' '}
            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className={styles.projectsCard}>
        <h2>Assigned Projects</h2>
        {assignedProjects.length === 0 ? (
          <p>No projects assigned yet.</p>
        ) : (
          <div className={styles.projectList}>
            {assignedProjects.map((project) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <strong>{project.name}</strong>
                  <div className={styles.badges}>
                    <Badge variant="default">{formatStatus(project.status)}</Badge>
                    <Badge variant="default">{project.priority}</Badge>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}