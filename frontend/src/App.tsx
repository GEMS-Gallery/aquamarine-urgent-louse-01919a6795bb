import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { backend } from 'declarations/backend';

interface Project {
  id: number;
  title: string;
  category: string;
  author: string;
  image: string;
  featured: boolean;
  starred: boolean;
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await backend.getProjects();
      setProjects(result);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filterProjects = (category: string | null) => {
    setSelectedCategory(category);
  };

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  return (
    <div>
      <header>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9z"></path>
            <path d="M12 22V8"></path>
          </svg>
          GEM's Showcase
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search projects..." />
        </div>
        <div className="header-buttons">
          <button className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start Building
          </button>
          <button className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Learn
          </button>
        </div>
      </header>
      <div className="content">
        <aside className="sidebar">
          <h2>Categories</h2>
          <ul className="category-list">
            <li className="category-item" onClick={() => filterProjects(null)}>All Categories</li>
            {Array.from(new Set(projects.map((p) => p.category))).map((category) => (
              <li className="category-item" key={category} onClick={() => filterProjects(category)}>{category}</li>
            ))}
          </ul>
        </aside>
        <main className="main-content">
          <div className="tabs">
            <Link to="/" className={`tab ${location.pathname === '/' ? 'active' : ''}`}>FEATURED</Link>
            <Link to="/latest" className={`tab ${location.pathname === '/latest' ? 'active' : ''}`}>LATEST</Link>
            <Link to="/starred" className={`tab ${location.pathname === '/starred' ? 'active' : ''}`}>STARRED</Link>
          </div>
          <Routes>
            <Route path="/" element={<ProjectList projects={filteredProjects.filter(p => p.featured)} />} />
            <Route path="/latest" element={<ProjectList projects={[...filteredProjects].reverse()} />} />
            <Route path="/starred" element={<ProjectList projects={filteredProjects.filter(p => p.starred)} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className="projects">
      {projects.map((project) => (
        <div className="project-card" key={project.id}>
          <div className="project-image">{project.image}</div>
          <div className="project-info">
            <div className="project-title">
              <h3>{project.title}</h3>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span className="project-category">{project.category}</span>
            <div className="project-author">
              <div className="author-avatar"></div>
              <span>{project.author}</span>
            </div>
            <div className="project-actions">
              <button className="project-action">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </button>
              <button className="project-action">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Copy
              </button>
              <button className="project-action">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
