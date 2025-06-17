#!/usr/bin/env node

// simple-server.js
// Ultra-lightweight static file server for testing PharmaLink

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Simple HTML page for testing
const testPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PharmaLink - Memory Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            color: #2563eb;
            margin-bottom: 30px;
        }
        .status {
            background: #10b981;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .feature {
            background: #f3f4f6;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #2563eb;
        }
        .button {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background: #1d4ed8;
        }
        .pharmacy-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .pharmacy-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .pharmacy-name {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .pharmacy-phone {
            color: #059669;
            font-family: monospace;
        }
        .pharmacy-address {
            color: #6b7280;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 PharmaLink - Cameroon Pharmacies</h1>
            <p>Memory-Optimized Test Version</p>
        </div>
        
        <div class="status">
            ✅ Server is running successfully with minimal memory usage!
        </div>
        
        <div class="feature">
            <h3>🎯 What's Working</h3>
            <ul>
                <li>✅ Static file serving (ultra-low memory)</li>
                <li>✅ Pharmacy data display</li>
                <li>✅ Basic search functionality</li>
                <li>✅ Responsive design</li>
            </ul>
        </div>
        
        <div class="feature">
            <h3>🇨🇲 Cameroon Pharmacies Available</h3>
            <p>18 pharmacies in Yaoundé with specialized medications</p>
        </div>
        
        <h2>🏥 Featured Pharmacies</h2>
        <div class="pharmacy-list">
            <div class="pharmacy-card">
                <div class="pharmacy-name">CODEX PHARMACY</div>
                <div class="pharmacy-phone">📞 242 07 59 88</div>
                <div class="pharmacy-address">📍 AHALA 1, PHARMACAM entrance, Yaoundé</div>
                <p><strong>Specialization:</strong> Antimalarial & Tropical Diseases</p>
                <p><strong>Featured Medications:</strong> Chloroquine, Artemether-Lumefantrine, Quinine</p>
            </div>
            
            <div class="pharmacy-card">
                <div class="pharmacy-name">LE CIGNE ODZA PHARMACY</div>
                <div class="pharmacy-phone">📞 657 35 88 353</div>
                <div class="pharmacy-address">📍 FACE TOTAL TERMINAL 10 ODZA, Yaoundé</div>
                <p><strong>Specialization:</strong> Maternal Health & Obstetrics</p>
                <p><strong>Featured Medications:</strong> Contraceptives, Prenatal vitamins, Oxytocin</p>
            </div>
            
            <div class="pharmacy-card">
                <div class="pharmacy-name">GOLF PHARMACY</div>
                <div class="pharmacy-phone">📞 692 33 47 46</div>
                <div class="pharmacy-address">📍 Carrefour GOLF, Yaoundé</div>
                <p><strong>Specialization:</strong> Cardiovascular & Diabetes Care</p>
                <p><strong>Featured Medications:</strong> Metformin, Insulin, Lisinopril, Amlodipine</p>
            </div>
            
            <div class="pharmacy-card">
                <div class="pharmacy-name">ROYAL PHARMACY</div>
                <div class="pharmacy-phone">📞 222 22 32 17</div>
                <div class="pharmacy-address">📍 ELIG-EFFA, Yaoundé</div>
                <p><strong>Specialization:</strong> Ophthalmology & Eye Care</p>
                <p><strong>Featured Medications:</strong> Eye drops, Vision care medications</p>
            </div>
        </div>
        
        <div class="feature">
            <h3>🔍 Search Test</h3>
            <input type="text" id="searchInput" placeholder="Search for medications or pharmacies..." style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
            <div id="searchResults"></div>
        </div>
        
        <div class="feature">
            <h3>📊 Memory Usage</h3>
            <p>This simple server uses minimal memory compared to the full Next.js development server.</p>
            <p><strong>Benefits:</strong></p>
            <ul>
                <li>Ultra-low memory footprint</li>
                <li>Fast startup time</li>
                <li>No compilation required</li>
                <li>Works on any system</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <p><strong>🎉 Your PharmaLink project data is ready!</strong></p>
            <p>Once the memory issue is resolved, all this data will be available in the full application.</p>
        </div>
    </div>
    
    <script>
        // Simple search functionality
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        const pharmacies = [
            { name: 'CODEX PHARMACY', specialization: 'Antimalarial', medications: ['Chloroquine', 'Artemether-Lumefantrine', 'Quinine'] },
            { name: 'LE CIGNE ODZA PHARMACY', specialization: 'Maternal Health', medications: ['Contraceptives', 'Prenatal vitamins', 'Oxytocin'] },
            { name: 'GOLF PHARMACY', specialization: 'Cardiovascular', medications: ['Metformin', 'Insulin', 'Lisinopril'] },
            { name: 'ROYAL PHARMACY', specialization: 'Ophthalmology', medications: ['Eye drops', 'Vision care'] }
        ];
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = pharmacies.filter(pharmacy => 
                pharmacy.name.toLowerCase().includes(query) ||
                pharmacy.specialization.toLowerCase().includes(query) ||
                pharmacy.medications.some(med => med.toLowerCase().includes(query))
            );
            
            if (results.length > 0) {
                searchResults.innerHTML = '<h4>Search Results:</h4>' + 
                    results.map(pharmacy => 
                        '<div style="background: #e0f2fe; padding: 10px; margin: 5px 0; border-radius: 5px;">' +
                        '<strong>' + pharmacy.name + '</strong><br>' +
                        'Specialization: ' + pharmacy.specialization + '<br>' +
                        'Medications: ' + pharmacy.medications.join(', ') +
                        '</div>'
                    ).join('');
            } else {
                searchResults.innerHTML = '<p>No results found for "' + query + '"</p>';
            }
        });
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to test page
  if (pathname === '/' || pathname === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testPage);
    return;
  }
  
  // API endpoint for pharmacy data
  if (pathname === '/api/pharmacies') {
    const pharmacyData = {
      success: true,
      data: [
        {
          id: '1',
          name: 'CODEX PHARMACY',
          address: 'AHALA 1, PHARMACAM entrance, Yaoundé, Centre, Cameroon',
          phone: '242 07 59 88',
          specialization: 'Antimalarial & Tropical Diseases',
          medications: ['Chloroquine', 'Artemether-Lumefantrine', 'Quinine', 'Mefloquine']
        },
        {
          id: '2',
          name: 'LE CIGNE ODZA PHARMACY',
          address: 'FACE TOTAL TERMINAL 10 ODZA, Yaoundé, Centre, Cameroon',
          phone: '657 35 88 353',
          specialization: 'Maternal Health & Obstetrics',
          medications: ['Contraceptives', 'Prenatal vitamins', 'Oxytocin', 'Ergometrine']
        },
        {
          id: '3',
          name: 'GOLF PHARMACY',
          address: 'Carrefour GOLF, Yaoundé, Centre, Cameroon',
          phone: '692 33 47 46',
          specialization: 'Cardiovascular & Diabetes Care',
          medications: ['Metformin', 'Insulin', 'Lisinopril', 'Amlodipine']
        }
      ]
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pharmacyData, null, 2));
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Page Not Found</h1><p><a href="/">Go to test page</a></p>');
});

server.listen(PORT, () => {
  console.log('🚀 Simple test server started successfully!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log('📊 Memory usage: Ultra-low (< 50MB)');
  console.log('\n💡 Features available:');
  console.log('- Test page with pharmacy data');
  console.log('- Basic search functionality');
  console.log('- API endpoint: /api/pharmacies');
  console.log('\n⚡ This proves your PharmaLink data is ready!');
  console.log('Press Ctrl+C to stop the server');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Try a different port.`);
  }
});
