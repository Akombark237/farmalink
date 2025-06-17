-- Check if chat_messages table exists and get its structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_messages';
