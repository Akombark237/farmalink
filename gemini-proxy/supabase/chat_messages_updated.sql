-- First, check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'chat_messages') THEN
        -- Create chat_messages table if it doesn't exist
        CREATE TABLE chat_messages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX chat_messages_session_id_idx ON chat_messages(session_id);
        CREATE INDEX chat_messages_timestamp_idx ON chat_messages(timestamp);
        
        -- Enable Row Level Security
        ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
        CREATE POLICY chat_messages_policy ON chat_messages
            USING (true)
            WITH CHECK (true);
        
        -- Grant access
        GRANT ALL ON chat_messages TO authenticated, anon;
        
        RAISE NOTICE 'Created new chat_messages table';
    ELSE
        -- Table exists, check if session_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'chat_messages' AND column_name = 'session_id'
        ) THEN
            -- Add session_id column if it doesn't exist
            ALTER TABLE chat_messages ADD COLUMN session_id TEXT;
            -- Update existing rows with a default value
            UPDATE chat_messages SET session_id = 'legacy_' || id::text WHERE session_id IS NULL;
            -- Make it NOT NULL after updating
            ALTER TABLE chat_messages ALTER COLUMN session_id SET NOT NULL;
            -- Create index
            CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
            
            RAISE NOTICE 'Added session_id column to existing table';
        END IF;
        
        -- Check if role column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'chat_messages' AND column_name = 'role'
        ) THEN
            -- Add role column if it doesn't exist
            ALTER TABLE chat_messages ADD COLUMN role TEXT DEFAULT 'user';
            -- Update existing rows with a default value
            UPDATE chat_messages SET role = 'user' WHERE role IS NULL;
            -- Make it NOT NULL after updating
            ALTER TABLE chat_messages ALTER COLUMN role SET NOT NULL;
            
            RAISE NOTICE 'Added role column to existing table';
        END IF;
        
        -- Check if content column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'chat_messages' AND column_name = 'content'
        ) THEN
            -- Add content column if it doesn't exist
            ALTER TABLE chat_messages ADD COLUMN content TEXT DEFAULT '';
            -- Make it NOT NULL after updating
            ALTER TABLE chat_messages ALTER COLUMN content SET NOT NULL;
            
            RAISE NOTICE 'Added content column to existing table';
        END IF;
        
        -- Check if timestamp column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'chat_messages' AND column_name = 'timestamp'
        ) THEN
            -- Add timestamp column if it doesn't exist
            ALTER TABLE chat_messages ADD COLUMN timestamp TIMESTAMPTZ DEFAULT NOW();
            -- Make it NOT NULL after updating
            ALTER TABLE chat_messages ALTER COLUMN timestamp SET NOT NULL;
            -- Create index
            CREATE INDEX IF NOT EXISTS chat_messages_timestamp_idx ON chat_messages(timestamp);
            
            RAISE NOTICE 'Added timestamp column to existing table';
        END IF;
        
        -- Ensure RLS is enabled
        ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
        
        -- Create policy if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_messages_policy'
        ) THEN
            CREATE POLICY chat_messages_policy ON chat_messages
                USING (true)
                WITH CHECK (true);
                
            RAISE NOTICE 'Created RLS policy';
        END IF;
        
        -- Grant access
        GRANT ALL ON chat_messages TO authenticated, anon;
        
        RAISE NOTICE 'Updated existing chat_messages table';
    END IF;
END
$$;
