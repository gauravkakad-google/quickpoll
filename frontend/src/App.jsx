import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, TextField, Card, CardContent, CardActions,
  Grid, Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, ListItemIcon, CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Poll as PollIcon, Add as AddIcon } from '@mui/icons-material';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function CreatePollForm({ handleCreatePoll, newQuestion, setNewQuestion, newOptions, handleOptionChange }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a New Poll
        </Typography>
        <TextField
          fullWidth
          label="Poll Question"
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          margin="normal"
        />
        {newOptions.map((option, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Option ${index + 1}`}
            value={option}
            onChange={e => handleOptionChange(index, e.target.value)}
            margin="normal"
          />
        ))}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCreatePoll}
          sx={{ mt: 2 }}
        >
          Create Poll
        </Button>
      </CardContent>
    </Card>
  );
}


function App() {
  const [polls, setPolls] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [selectedMenu, setSelectedMenu] = useState('active_polls');

  useEffect(() => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => setPolls(data));
  }, []);

  const handleVote = (pollId, option) => {
    fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option })
    }).then(() => {
      // Refresh results
      fetch(`/api/polls/${pollId}/results`)
        .then(res => res.json())
        .then(data => {
          setPolls(polls.map(p => p.id === pollId ? { ...p, results: data } : p));
        });
    });
  };

  const handleCreatePoll = () => {
    fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion, options: newOptions.filter(o => o) })
    }).then(() => {
      // Refresh polls
      fetch('/api/polls')
        .then(res => res.json())
        .then(data => setPolls(data));
      setNewQuestion('');
      setNewOptions(['', '']);
      setSelectedMenu('active_polls');
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    if (index === newOptions.length - 1 && value) {
      updatedOptions.push('');
    }
    setNewOptions(updatedOptions);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              QuickPoll
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem button key="active-polls" onClick={() => setSelectedMenu('active_polls')}>
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                <ListItemText primary="Active Polls" />
              </ListItem>
              <ListItem button key="create-poll" onClick={() => setSelectedMenu('create_poll')}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Poll" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {selectedMenu === 'active_polls' && (
            <Container>
              <Typography variant="h4" gutterBottom>
                Active Polls
              </Typography>
              <Grid container spacing={2} direction="column">
                {polls.map(poll => (
                  <Grid item xs={12} key={poll.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">{poll.question_text}</Typography>
                        {poll.results ? (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Results:</Typography>
                            <ul>
                              {poll.results.map(result => (
                                <li key={result.option_text}>
                                  <Typography>
                                    {result.option_text}: {result.vote_count}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        ) : (
                          <CardActions>
                            {poll.options.map(option => (
                              <Button key={option} size="small" onClick={() => handleVote(poll.id, option)}>
                                {option}
                              </Button>
                            ))}
                          </CardActions>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          )}
          {selectedMenu === 'create_poll' && (
            <Container>
              <CreatePollForm
                handleCreatePoll={handleCreatePoll}
                newQuestion={newQuestion}
                setNewQuestion={setNewQuestion}
                newOptions={newOptions}
                handleOptionChange={handleOptionChange}
              />
            </Container>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
