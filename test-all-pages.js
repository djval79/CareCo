import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

const pages = [
  { name: 'Dashboard', path: '/', expectedTitle: 'Dashboard' },
  { name: 'Employees', path: '/employees', expectedTitle: 'Employees' },
  { name: 'Departments', path: '/departments', expectedTitle: 'Departments' },
  { name: 'Designations', path: '/designations', expectedTitle: 'Designations' },
  { name: 'Jobs', path: '/jobs', expectedTitle: 'Jobs' },
  { name: 'Job Applications', path: '/job-applications', expectedTitle: 'Job Applications' },
  { name: 'Candidate Database', path: '/candidate-database', expectedTitle: 'Candidate Database' },
  { name: 'Interview Schedule', path: '/interview-schedule', expectedTitle: 'Interview Schedule' },
  { name: 'Job Skills', path: '/job-skills', expectedTitle: 'Job Skills' },
  { name: 'Offer Letters', path: '/offer-letters', expectedTitle: 'Offer Letters' },
  { name: 'Leaves', path: '/leaves', expectedTitle: 'Leaves' },
  { name: 'Attendances', path: '/attendances', expectedTitle: 'Attendance' },
  { name: 'Holidays', path: '/holidays', expectedTitle: 'Holidays' },
  { name: 'Shifts', path: '/shifts', expectedTitle: 'Shifts' },
  { name: 'Appreciations', path: '/appreciations', expectedTitle: 'Appreciations' },
  { name: 'Job Reports', path: '/job-reports', expectedTitle: 'Job Reports' },
  { name: 'Letter Templates', path: '/letter-templates', expectedTitle: 'Letter Templates' },
];

async function testPage(browser, pageInfo) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const consoleMessages = [];
  
  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleMessages.push(`[${type.toUpperCase()}] ${msg.text()}`);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    console.log(`\n🔍 Testing: ${pageInfo.name} (${pageInfo.path})`);
    
    // Navigate to page
    const response = await page.goto(`${BASE_URL}${pageInfo.path}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Check response status
    if (!response.ok()) {
      errors.push(`HTTP Error: ${response.status()} ${response.statusText()}`);
      console.log(`   ❌ Failed with HTTP ${response.status()}`);
      return { success: false, errors, consoleMessages };
    }
    
    // Wait for h1 to appear (main page heading)
    try {
      await page.waitForSelector('h1', { timeout: 10000 });
    } catch (e) {
      errors.push('No h1 heading found - possible blank page');
      console.log(`   ❌ No heading found - possible blank page`);
      return { success: false, errors, consoleMessages };
    }
    
    // Get page title
    const h1Text = await page.locator('h1').first().textContent();
    console.log(`   ✅ Page loaded successfully`);
    console.log(`   📄 Heading: "${h1Text}"`);
    
    // Check for blank page (white screen)
    const bodyContent = await page.locator('body').textContent();
    if (!bodyContent || bodyContent.trim().length < 50) {
      errors.push('Page appears to be blank or has minimal content');
      console.log(`   ⚠️  Warning: Page has very little content`);
    }
    
    // Check if sidebar is present
    const hasSidebar = await page.locator('nav').count() > 0;
    if (!hasSidebar) {
      errors.push('Navigation sidebar not found');
      console.log(`   ⚠️  Warning: No navigation sidebar found`);
    } else {
      console.log(`   ✅ Navigation sidebar present`);
    }
    
    // Take a screenshot
    await page.screenshot({ 
      path: `/tmp/screenshot-${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false
    });
    console.log(`   📸 Screenshot saved`);
    
    if (errors.length === 0 && consoleMessages.length === 0) {
      console.log(`   ✅ No errors detected`);
    }
    
    if (consoleMessages.length > 0) {
      console.log(`   ⚠️  Console messages (${consoleMessages.length}):`);
      consoleMessages.slice(0, 3).forEach(msg => {
        console.log(`      ${msg}`);
      });
    }
    
    await context.close();
    return { success: true, errors, consoleMessages, heading: h1Text };
    
  } catch (error) {
    errors.push(`Test Error: ${error.message}`);
    console.log(`   ❌ Test failed: ${error.message}`);
    await context.close();
    return { success: false, errors, consoleMessages };
  }
}

async function runTests() {
  console.log('🚀 Starting HR System Page Tests\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  console.log('=' .repeat(70));
  
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  for (const pageInfo of pages) {
    const result = await testPage(browser, pageInfo);
    results.push({ ...pageInfo, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
  
  await browser.close();
  
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
      console.log(`   • ${r.name} (${r.path})`);
      r.errors.forEach(err => console.log(`     - ${err}`));
    });
  }
  
  if (successful === results.length) {
    console.log('\n🎉 All pages loaded successfully!\n');
  }
  
  // Return exit code
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
