import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
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

interface Comment {
  id: number;
  projectId: number;
  author: string;
  content: string;
  timestamp: bigint;
}

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
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

  const fetchComments = async (projectId: number) => {
    try {
      const result = await backend.getComments(projectId);
      setComments(result);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async () => {
    if (selectedProject && newComment.trim()) {
      try {
        await backend.addComment(selectedProject.id, 'Anonymous', newComment.trim());
        await fetchComments(selectedProject.id);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const filterProjects = (category: string | null) => {
    setSelectedCategory(category);
  };

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  const categoryIcons: { [key: string]: JSX.Element } = {
    Corporate: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    Creative: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    ),
    Entertainment: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
      </svg>
    ),
    Retail: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
  };

  return (
    <div>
      <header>
        <div className="logo">GEM's Showcase</div>
        <div className="search-bar">
          <input type="text" placeholder="Search projects..." />
        </div>
        <div className="header-buttons">
          <button className="btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start Building
          </button>
          <button className="btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <li className="category-item" onClick={() => filterProjects(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              All Categories
            </li>
            {Array.from(new Set(projects.map((p) => p.category))).map((category) => (
              <li className="category-item" key={category} onClick={() => filterProjects(category)}>
                {categoryIcons[category] || (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                )}
                {category}
              </li>
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
            <Route path="/" element={<ProjectList projects={filteredProjects.filter(p => p.featured)} onCommentClick={(project) => { setSelectedProject(project); setIsCommentModalOpen(true); fetchComments(project.id); }} />} />
            <Route path="/latest" element={<ProjectList projects={[...filteredProjects].reverse()} onCommentClick={(project) => { setSelectedProject(project); setIsCommentModalOpen(true); fetchComments(project.id); }} />} />
            <Route path="/starred" element={<ProjectList projects={filteredProjects.filter(p => p.starred)} onCommentClick={(project) => { setSelectedProject(project); setIsCommentModalOpen(true); fetchComments(project.id); }} />} />
          </Routes>
        </main>
      </div>
      <Modal
        isOpen={isCommentModalOpen}
        onRequestClose={() => setIsCommentModalOpen(false)}
        contentLabel="Comment Modal"
        className="comment-modal"
      >
        <h2>Comments for {selectedProject?.title}</h2>
        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.content}</p>
              <small>{comment.author} - {new Date(Number(comment.timestamp)).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={addComment}>Submit Comment</button>
        </div>
      </Modal>
    </div>
  );
};

const ProjectList: React.FC<{ projects: Project[], onCommentClick: (project: Project) => void }> = ({ projects, onCommentClick }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});

  const handleCopy = (project: Project) => {
    navigator.clipboard.writeText(project.title).then(() => {
      setCopiedStates({ ...copiedStates, [project.id]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [project.id]: false });
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="projects">
      {projects.map((project) => (
        <div className="project-card" key={project.id}>
          <div className="project-image">{project.image}</div>
          <div className="project-info">
            <div className="project-title">
              <h3>{project.title}</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </button>
              <button className={`project-action ${copiedStates[project.id] ? 'copied' : ''}`} onClick={() => handleCopy(project)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                {copiedStates[project.id] ? 'Copied!' : 'Copy'}
              </button>
              <button className="project-action" onClick={() => onCommentClick(project)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
