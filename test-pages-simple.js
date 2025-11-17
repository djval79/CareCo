import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const pages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Employees', path: '/employees' },
  { name: 'Departments', path: '/departments' },
  { name: 'Designations', path: '/designations' },
  { name: 'Jobs', path: '/jobs' },
  { name: 'Job Applications', path: '/job-applications' },
  { name: 'Candidate Database', path: '/candidate-database' },
  { name: 'Interview Schedule', path: '/interview-schedule' },
  { name: 'Job Skills', path: '/job-skills' },
  { name: 'Offer Letters', path: '/offer-letters' },
  { name: 'Leaves', path: '/leaves' },
  { name: 'Attendances', path: '/attendances' },
  { name: 'Holidays', path: '/holidays' },
  { name: 'Shifts', path: '/shifts' },
  { name: 'Appreciations', path: '/appreciations' },
  { name: 'Job Reports', path: '/job-reports' },
  { name: 'Letter Templates', path: '/letter-templates' },
];

async function testPage(pageInfo) {
  try {
    console.log(`\n🔍 Testing: ${pageInfo.name.padEnd(25)} ${pageInfo.path}`);
    
    const response = await axios.get(`${BASE_URL}${pageInfo.path}`, {
      timeout: 10000,
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
    });
    
    if (response.status === 200) {
      const html = response.data;
      const hasContent = html.length > 1000; // Basic HTML should be at least 1KB
      const hasReactRoot = html.includes('id="root"');
      const hasViteScript = html.includes('vite');
      
      console.log(`   ✅ HTTP 200 OK`);
      console.log(`   📄 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
      
      if (hasReactRoot) {
        console.log(`   ✅ React root element found`);
      } else {
        console.log(`   ⚠️  React root element missing`);
      }
      
      if (hasViteScript) {
        console.log(`   ✅ Vite scripts present`);
      }
      
      return { success: true, status: response.status, size: html.length };
    } else {
      console.log(`   ❌ HTTP ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting HR System Page Tests (Simple HTTP Check)\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  console.log('=' .repeat(70));
  
  const results = [];
  
  for (const pageInfo of pages) {
    const result = await testPage(pageInfo);
    results.push({ ...pageInfo, ...result });
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 TEST SUMMARY\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED PAGES:\n');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.name} (${r.path}) - ${r.error || `HTTP ${r.status}`}`);
    });
  } else {
    console.log('\n🎉 All pages returned HTTP 200! Server is responding correctly.\n');
    console.log('⚠️  Note: This test only checks HTTP responses, not JavaScript rendering.');
    console.log('   To verify pages render correctly, please open the application in a browser.\n');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
