-- Create chat_messages table for storing conversation history
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Add indexes for faster queries
  CONSTRAINT valid_role CHECK (role IN ('user', 'model', 'assistant'))
);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);

-- Create index on timestamp for sorting
CREATE INDEX IF NOT EXISTS chat_messages_timestamp_idx ON chat_messages(timestamp);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for simplicity)
-- In a production environment, you would want more restrictive policies
CREATE POLICY chat_messages_policy ON chat_messages
  USING (true)
  WITH CHECK (true);

-- Grant access to authenticated and anon users
GRANT ALL ON chat_messages TO authenticated, anon;
