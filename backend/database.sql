-- Drop tables if they exist to ensure a clean slate.
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS poll_options;
DROP TABLE IF EXISTS polls;

-- Create the polls table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the poll_options table
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
);

-- Create the votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_option_id INTEGER NOT NULL,
    FOREIGN KEY (poll_option_id) REFERENCES poll_options (id) ON DELETE CASCADE
);
