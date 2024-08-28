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
        <div className="logo">GEM's Showcase</div>
        <div className="search-bar">
          <input type="text" placeholder="Search projects..." />
        </div>
        <div className="header-buttons">
          <button className="btn">Start Building</button>
          <button className="btn">Learn</button>
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
            </div>
            <span className="project-category">{project.category}</span>
            <div className="project-author">
              <div className="author-avatar"></div>
              <span>{project.author}</span>
            </div>
            <div className="project-actions">
              <button className="project-action">GitHub</button>
              <button className="project-action">Copy</button>
              <button className="project-action">Comment</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
