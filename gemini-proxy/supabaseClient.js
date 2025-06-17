// Supabase client for conversation history storage
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lfcbxeqfbvvvfqxnwrxr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY2J4ZXFmYnZ2dmZxeG53cnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzA0NzcsImV4cCI6MjAzMTAwNjQ3N30.Nh83ebqzf1iGHTaGzK0LUEbxcwFb8HWAL9ZqAZKLvQE';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to save a conversation message
async function saveMessage(sessionId, message) {
  try {
    // Check if the table exists first
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('chat_messages')
      .select('id')
      .limit(1);

    // If there's an error that's not just "no rows returned", the table might not exist
    if (tableCheckError && !tableCheckError.message.includes('no rows')) {
      console.error('Error checking chat_messages table:', tableCheckError);
      console.log('Attempting to continue anyway...');
    }

    // Prepare the message content
    const messageContent = message.parts
      ? JSON.stringify(message.parts)
      : JSON.stringify([{ text: message.text }]);

    // Try to insert with session_id first (new schema)
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            role: message.role,
            content: messageContent,
            timestamp: new Date().toISOString()
          }
        ]);

      if (!error) {
        return true;
      }

      // If there's an error with session_id, it might be using the old schema
      if (error.message.includes('session_id')) {
        console.warn('Falling back to old schema without session_id');

        // Try inserting without session_id (old schema)
        const { data: oldData, error: oldError } = await supabase
          .from('chat_messages')
          .insert([
            {
              role: message.role,
              content: messageContent,
              timestamp: new Date().toISOString()
            }
          ]);

        if (oldError) {
          console.error('Error saving message with old schema:', oldError);
          return false;
        }

        return true;
      } else {
        console.error('Error saving message to Supabase:', error);
        return false;
      }
    } catch (insertError) {
      console.error('Exception during insert:', insertError);
      return false;
    }
  } catch (error) {
    console.error('Exception saving message to Supabase:', error);
    return false;
  }
}

// Function to get conversation history
async function getConversationHistory(sessionId) {
  try {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('timestamp', { ascending: true });

    // Try to query with session_id first
    try {
      // Check if session_id column exists by trying to use it
      const { data, error } = await query.eq('session_id', sessionId);

      if (!error) {
        // Convert from database format to the format expected by the API
        return data.map(message => {
          try {
            const content = JSON.parse(message.content);
            return {
              role: message.role,
              parts: Array.isArray(content) ? content : [{ text: content }]
            };
          } catch (e) {
            // Fallback if JSON parsing fails
            return {
              role: message.role,
              parts: [{ text: message.content }]
            };
          }
        });
      }

      // If there's an error with session_id, it might be using the old schema
      if (error.message.includes('session_id')) {
        console.warn('Falling back to old schema without session_id filter');

        // Just get all messages (not ideal but works for demo)
        const { data: oldData, error: oldError } = await supabase
          .from('chat_messages')
          .select('*')
          .order('timestamp', { ascending: true })
          .limit(50); // Limit to avoid too many messages

        if (oldError) {
          console.error('Error fetching messages with old schema:', oldError);
          return [];
        }

        // Convert from database format to the format expected by the API
        return oldData.map(message => {
          try {
            const content = JSON.parse(message.content);
            return {
              role: message.role,
              parts: Array.isArray(content) ? content : [{ text: content }]
            };
          } catch (e) {
            // Fallback if JSON parsing fails
            return {
              role: message.role,
              parts: [{ text: message.content }]
            };
          }
        });
      } else {
        console.error('Error fetching conversation history from Supabase:', error);
        return [];
      }
    } catch (queryError) {
      console.error('Exception during query:', queryError);
      return [];
    }
  } catch (error) {
    console.error('Exception fetching conversation history from Supabase:', error);
    return [];
  }
}

// Function to clear conversation history
async function clearConversationHistory(sessionId) {
  try {
    // Try to delete with session_id first
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      if (!error) {
        return true;
      }

      // If there's an error with session_id, it might be using the old schema
      if (error.message.includes('session_id')) {
        console.warn('Falling back to old schema without session_id for deletion');

        // For old schema, we can't safely delete just one conversation
        // This is a limitation of the demo - in production you'd need to add session_id
        console.error('Cannot safely clear specific conversation without session_id column');
        return false;
      } else {
        console.error('Error clearing conversation history from Supabase:', error);
        return false;
      }
    } catch (deleteError) {
      console.error('Exception during delete:', deleteError);
      return false;
    }
  } catch (error) {
    console.error('Exception clearing conversation history from Supabase:', error);
    return false;
  }
}

module.exports = {
  supabase,
  saveMessage,
  getConversationHistory,
  clearConversationHistory
};
