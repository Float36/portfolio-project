import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    const fetchProjects = async (urlOverride = null) => {
      setLoading(true); // Set loading true on each search
      try {
        let url = urlOverride;
        if (!url) {
          url = searchQuery
            ? `http://127.0.0.1:8000/api/v1/projects/?search=${encodeURIComponent(searchQuery)}`
            : 'http://127.0.0.1:8000/api/v1/projects/';
        }

        const response = await axios.get(url);

        // Handle pagination response structure
        if (response.data.results) {
          setProjects(response.data.results);
          setNextPage(response.data.next);
          setPrevPage(response.data.previous);
        } else {
          // Fallback if pagination is inexplicably off, though we just turned it on
          setProjects(response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Помилка завантаження проєктів:", err);
        setError("Не вдалося завантажити проєкти. Перевірте, чи запущено бекенд.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500); // Debounce duration


    window.fetchProjectsPage = fetchProjects;

    return () => {
      clearTimeout(delayDebounceFn);
      delete window.fetchProjectsPage;
    }
  }, [searchQuery]);

  const handlePageChange = (url) => {
    if (window.fetchProjectsPage) window.fetchProjectsPage(url);
  };

  if (loading) return <div className="container"><h2>Завантаження проєктів...</h2></div>;
  if (error) return <div className="container" style={{ color: 'red' }}><h2>{error}</h2></div>;

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <h1>Досліджуйте проєкти</h1>
      <p style={{ color: 'var(--text-muted)' }}>Роботи розробників нашої спільноти.</p>

      <div style={{ margin: '30px 0', maxWidth: '600px' }}>
        <input
          type="text"
          placeholder="Пошук проєктів..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px',
            fontSize: '1rem',
            borderRadius: '25px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px',
        marginTop: '40px',
        paddingBottom: '50px'
      }}>
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>Проєктів поки немає.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
        <button
          disabled={!prevPage}
          onClick={() => handlePageChange(prevPage)}
          className="btn-outline"
          style={{ opacity: !prevPage ? 0.5 : 1, cursor: !prevPage ? 'default' : 'pointer' }}
        >
          Назад
        </button>
        <button
          disabled={!nextPage}
          onClick={() => handlePageChange(nextPage)}
          className="btn-outline"
          style={{ opacity: !nextPage ? 0.5 : 1, cursor: !nextPage ? 'default' : 'pointer' }}
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default Explore;