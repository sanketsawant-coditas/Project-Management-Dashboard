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
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user profile
        const res = await api.get('/users/me');
        setProfile(res.data);

        // Fetch all projects and filter those where user is a team member
        // (if backend doesn't provide endpoint for user's projects)
        const projectsRes = await api.get('/projects?limit=100');
        const projects = projectsRes.data.projects || projectsRes.data;
        const userProjects = projects.filter((p: any) =>
          p.teamMembers?.some((member: any) => member.id === res.data.id)
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

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!profile) return <div className={styles.error}>Unable to load profile</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>👤</div>
          <h1>{profile.name}</h1>
          <Badge variant={profile.role === 'super-admin' ? 'warning' : profile.role === 'admin' ? 'success' : 'default'}>
            {profile.role}
          </Badge>
        </div>
        <div className={styles.info}>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Status:</strong> <Badge variant={profile.status === 'active' ? 'success' : 'danger'}>{profile.status}</Badge></p>
          <p><strong>Member since:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
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
                    <Badge variant={project.status}>{project.status}</Badge>
                    <Badge variant={project.priority}>{project.priority}</Badge>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div className={styles.progressBar} style={{ width: `${project.progress}%` }}></div>
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