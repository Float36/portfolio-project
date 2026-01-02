import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProjectCard.css';

const ProjectCard = ({ project, children }) => {
  const [showFull, setShowFull] = useState(false);
  const [views, setViews] = useState(project.views || 0);
  const navigate = useNavigate();

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/${project.username}`);
  };

  const toggleModal = async () => {
    if (!showFull) {
      // Opening modal - increment views
      try {
        await api.post(`projects/${project.id}/increment_views/`);
        setViews(prev => prev + 1);
      } catch (err) {
        console.error("Failed to increment views", err);
      }
    }
    setShowFull(!showFull);
  };

  const truncatedDescription = project.description && project.description.length > 100
    ? project.description.substring(0, 100) + ' ...'
    : project.description;

  return (
    <>
      <div className="project-card" onClick={toggleModal}>
        <div className="project-card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3>{project.title}</h3>
            {/* View Count Badge */}
            <div className="project-views" title="Перегляди">
              {views}
            </div>
          </div>

          {/* Author Link */}
          {project.username && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {project.profile_picture ? (
                  <img
                    src={project.profile_picture}
                    alt={project.username}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.7rem' }}>👤</span>
                )}
              </div>
              <p
                className="project-author"
                onClick={handleAuthorClick}
                title="Перейти до профілю"
                style={{ margin: 0 }}
              >
                {project.username}
              </p>
            </div>
          )}

          <p>{truncatedDescription || "Опис відсутній..."}</p>

          {/* Technology Tags on Card */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="project-card-technologies">
              {project.technologies.slice(0, 4).map(tech => (
                <span key={tech.id} className="project-tech-tag">{tech.name}</span>
              ))}
            </div>
          )}

          <div className="project-links">
            <a href={project.github_link} target="_blank" rel="noreferrer" className="project-link" onClick={e => e.stopPropagation()}>GitHub</a>
            {project.live_link && (
              <a href={project.live_link} target="_blank" rel="noreferrer" className="project-link" onClick={e => e.stopPropagation()}>Демо</a>
            )}
          </div>
          {children && <div className="project-actions-container" onClick={e => e.stopPropagation()}>{children}</div>}
        </div>
      </div>

      {/* Full Project Modal */}
      {showFull && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content project-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={toggleModal}>×</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{project.title}</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{views}</span>
            </div>
            {project.username && (
              <p className="project-author-modal" onClick={() => { toggleModal(); navigate(`/${project.username}`); }}>
                Автор: @{project.username}
              </p>
            )}

            <div className="modal-body">
              <p className="full-description">{project.description || "Опис відсутній."}</p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="tech-stack">
                  <h4>Технології:</h4>
                  <div className="tech-tags">
                    {project.technologies.map(tech => (
                      <span key={tech.id} className="tech-tag">{tech.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="project-links-modal">
              <a href={project.github_link} target="_blank" rel="noreferrer" className="btn-primary">GitHub</a>
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noreferrer" className="btn-outline">Live Demo</a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;