const {createRequire}=require('node:module');
const path=require('node:path');
const testRequire=createRequire(path.join(process.env.PORTFOLIO_TEST_DEPS||path.resolve(__dirname,'..'),'package.json'));
const {chromium}=testRequire('playwright');
process.chdir(path.resolve(__dirname,'..'));
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:950},reducedMotion:'reduce'}); const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/?revision=9',{waitUntil:'networkidle'});
 await p.screenshot({path:'assets/cinematic-desktop.png'});
 await p.locator('#project-index').scrollIntoViewIfNeeded();await p.screenshot({path:'assets/cinematic-gallery.png'});
 await p.locator('[data-filter="design"]').click();
 const filtered=await p.locator('.archive-list [data-project]:visible').count();
 await p.locator('.archive-list [data-project="sports"]').click();const dialog=await p.locator('#project-dialog').evaluate(e=>e.open);await p.locator('#dialog-close').click();
 await p.locator('[data-filter="all"]').click();await p.locator('.archive-list').hover();await p.mouse.wheel(0,450);await p.waitForTimeout(300);const wheel=await p.locator('.archive-list').evaluate(e=>e.scrollLeft);
 const widths=[];for(const width of [320,390,768,1440,3840]){await p.setViewportSize({width,height:width===3840?2160:950});await p.waitForTimeout(100);widths.push({width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
 await p.setViewportSize({width:390,height:844});await p.goto('http://127.0.0.1:4173/?revision=9');await p.screenshot({path:'assets/cinematic-mobile.png'});await p.locator('.menu-toggle').click();const menu=await p.locator('#navigation').isVisible();await p.locator('#navigation a[href="#profile"]').click();await p.locator('#recognition summary').click();const recognition=await p.locator('#recognition').evaluate(e=>e.open);
 const resume=await p.request.get('http://127.0.0.1:4173/assets/projects/roshan-raj-resume.pdf');
 console.log(JSON.stringify({errors,filtered,dialog,wheel,widths,menu,recognition,resume:resume.status()},null,2));await b.close();
})();
