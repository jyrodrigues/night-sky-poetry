import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');

async function waitForApp(page, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 5000 });
      console.log('App is ready!');
      return true;
    } catch (error) {
      console.log(`Waiting for app to start... (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('App failed to start');
}

async function captureScreenshot(page, name = 'screenshot') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  
  await page.screenshot({ 
    path: filepath,
    fullPage: true 
  });
  
  console.log(`Screenshot saved: ${filename}`);
  return filename;
}

async function runLiveMode() {
  console.log('Starting Puppeteer in live development mode...');
  console.log(`Connecting to: ${APP_URL}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Wait for app to be ready
    await waitForApp(page);
    
    // Take initial screenshot
    await captureScreenshot(page, 'initial');
    
    // Keep the browser open and listen for commands
    console.log('Puppeteer is ready for commands...');
    console.log('Available commands:');
    console.log('- screenshot: Take a screenshot');
    console.log('- reload: Reload the page');
    console.log('- viewport <width> <height>: Change viewport size');
    console.log('- evaluate <code>: Run JavaScript in the page');
    console.log('- exit: Close the browser');
    
    // Set up stdin for commands
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (data) => {
      const command = data.trim();
      const [cmd, ...args] = command.split(' ');
      
      try {
        switch (cmd) {
          case 'screenshot':
            await captureScreenshot(page);
            break;
            
          case 'reload':
            await page.reload({ waitUntil: 'networkidle2' });
            console.log('Page reloaded');
            break;
            
          case 'viewport':
            const width = parseInt(args[0]) || 1280;
            const height = parseInt(args[1]) || 800;
            await page.setViewport({ width, height });
            console.log(`Viewport set to ${width}x${height}`);
            break;
            
          case 'evaluate':
            const code = args.join(' ');
            const result = await page.evaluate(code);
            console.log('Result:', result);
            break;
            
          case 'exit':
            await browser.close();
            process.exit(0);
            break;
            
          default:
            console.log('Unknown command:', cmd);
        }
      } catch (error) {
        console.error('Error executing command:', error.message);
      }
    });
    
    // Keep the process alive
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
    process.exit(1);
  }
}

// Start the live mode
runLiveMode();