-- Practice queries for backend_internship database

-- All users
SELECT * FROM users;

-- All projects
SELECT * FROM projects;

-- All tasks
SELECT * FROM tasks;

-- Only names and emails (avoids exposing password_hash)
SELECT name, email FROM users;

-- Tasks for one specific project
SELECT * FROM tasks WHERE project_id = 2;

-- Tasks joined with their project name
SELECT tasks.title, tasks.status, projects.name AS project_name
FROM tasks
JOIN projects ON tasks.project_id = projects.id;

-- Projects joined with their owner
SELECT projects.name AS project_name, users.name AS owner_name
FROM projects
JOIN users ON projects.owner_id = users.id;

-- Update a task's status
UPDATE tasks SET status = 'done' WHERE id = 4;

-- Pagination: page 1 (first 5 tasks)
SELECT id, title FROM tasks ORDER BY id LIMIT 5;

-- Pagination: page 2 (next 5 tasks)
SELECT id, title FROM tasks ORDER BY id LIMIT 5 OFFSET 5;

-- Count of tasks per project
SELECT projects.name, COUNT(tasks.id) AS task_count
FROM projects
JOIN tasks ON tasks.project_id = projects.id
GROUP BY projects.name;

-- Index added to speed up filtering tasks by project
CREATE INDEX idx_tasks_project_id ON tasks(project_id);