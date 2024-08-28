import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, List, ListItem, ListItemText } from '@mui/material';
import { Star, GitHub, ContentCopy, Comment } from '@mui/icons-material';
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">GEM's Showcase</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <List>
              <ListItem button onClick={() => filterProjects(null)}>
                <ListItemText primary="All Categories" />
              </ListItem>
              {Array.from(new Set(projects.map((p) => p.category))).map((category) => (
                <ListItem button key={category} onClick={() => filterProjects(category)}>
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={9}>
            <Routes>
              <Route path="/" element={<ProjectList projects={filteredProjects} />} />
              <Route path="/featured" element={<ProjectList projects={filteredProjects.filter((p) => p.featured)} />} />
              <Route path="/latest" element={<ProjectList projects={[...filteredProjects].reverse()} />} />
              <Route path="/starred" element={<ProjectList projects={filteredProjects.filter((p) => p.starred)} />} />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card>
            <CardMedia
              component="div"
              style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontSize: '2em' }}
            >
              {project.image}
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.author}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <Button startIcon={<GitHub />} size="small">GitHub</Button>
                <Button startIcon={<ContentCopy />} size="small">Copy</Button>
                <Button startIcon={<Comment />} size="small">Comment</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default App;
