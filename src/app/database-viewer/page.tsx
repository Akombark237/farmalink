'use client';

import React, { useState, useEffect } from 'react';

interface TableData {
  table_name: string;
  column_count: number;
  row_count: number;
}

interface DatabaseStats {
  total_tables: number;
  total_rows: number;
  database_size: string;
}

export default function DatabaseViewer() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('Testing connection...');
      
      // Test database connection first
      const testResponse = await fetch('/api/database/test');
      const testData = await testResponse.json();
      
      if (testData.success) {
        setConnectionStatus('Connected ✅');
        console.log('Database connection successful:', testData);
        
        // Mock data for now since we don't have the full database API yet
        setTables([
          { table_name: 'users', column_count: 8, row_count: 0 },
          { table_name: 'pharmacies', column_count: 12, row_count: 0 },
          { table_name: 'medications', column_count: 10, row_count: 0 },
          { table_name: 'orders', column_count: 9, row_count: 0 },
          { table_name: 'prescriptions', column_count: 7, row_count: 0 },
          { table_name: 'reviews', column_count: 6, row_count: 0 }
        ]);
        
        setStats({
          total_tables: 6,
          total_rows: 0,
          database_size: '8.2 MB'
        });
      } else {
        setConnectionStatus('Connection failed ❌');
        setError(testData.error || 'Database connection failed');
      }

    } catch (err) {
      setConnectionStatus('Connection failed ❌');
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading database information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Viewer</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Connection Status:</span>
          <span className="font-medium">{connectionStatus}</span>
          <button 
            onClick={testDatabaseConnection}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="text-red-600 font-medium mb-2">Database Error</div>
          <div className="text-red-700">{error}</div>
          <button 
            onClick={testDatabaseConnection}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* Database Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Total Tables</h3>
                <div className="text-2xl font-bold text-blue-600">{stats.total_tables}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Total Rows</h3>
                <div className="text-2xl font-bold text-green-600">{stats.total_rows.toLocaleString()}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-2">Database Size</h3>
                <div className="text-2xl font-bold text-purple-600">{stats.database_size}</div>
              </div>
            </div>
          )}

          {/* Tables List */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Database Tables</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Table Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Columns</th>
                      <th className="text-left py-3 px-4 font-semibold">Rows</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-blue-600">
                          {table.table_name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {table.column_count}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {table.row_count.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View Schema
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {tables.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tables found in the database
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
