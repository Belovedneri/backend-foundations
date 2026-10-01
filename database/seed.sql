-- Sample data for backend_internship database
-- Run with: psql -U postgres -d backend_internship -f database/seed.sql

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Sam Carter', 'sam@example.com', 'placeholder_hash_1', 'admin'),
  ('Alex Rivera', 'alex@example.com', 'placeholder_hash_2', 'user'),
  ('Jordan Lee', 'jordan@example.com', 'placeholder_hash_3', 'user'),
  ('Priya Patel', 'priya@example.com', 'placeholder_hash_4', 'user'),
  ('Chidi Okafor', 'chidi@example.com', 'placeholder_hash_5', 'user');

INSERT INTO projects (name, description, owner_id) VALUES
  ('Website Redesign', 'Refresh the company website', 1),
  ('Mobile App', 'Build the iOS and Android app', 2),
  ('Internal Tools', 'Improve internal developer tooling', 1);

INSERT INTO tasks (title, description, status, project_id, assigned_to) VALUES
  ('Design homepage mockup', 'Create initial design in Figma', 'done', 1, 3),
  ('Set up hosting', 'Configure production hosting', 'in-progress', 1, 2),
  ('Write homepage copy', 'Draft marketing copy for homepage', 'todo', 1, 4),
  ('Build contact form', 'Add contact form with validation', 'done', 1, NULL),
  ('Set up React Native project', 'Initialize the mobile app repo', 'done', 2, 2),
  ('Design app navigation', 'Plan tab and stack navigation', 'in-progress', 2, 3),
  ('Build login screen', 'Implement login UI and logic', 'todo', 2, 5),
  ('Set up push notifications', 'Integrate push notification service', 'todo', 2, NULL),
  ('Audit CI pipeline', 'Review and speed up build times', 'in-progress', 3, 1),
  ('Write onboarding docs', 'Document dev environment setup', 'todo', 3, 4),
  ('Upgrade Node version', 'Move all services to latest LTS', 'done', 3, 1),
  ('Add linting rules', 'Standardize ESLint config across repos', 'todo', 3, NULL);