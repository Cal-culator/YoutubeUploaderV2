const puppeteer = require("puppeteer-extra");
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path');
const format = require('string-format')
const config = require('./config.json');
const editJsonFile = require("edit-json-file");



puppeteer.use(StealthPlugin());

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//moves the $file to $dir2
var moveFile = async (file, dir2)=>{
  //include the fs, path modules

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.renameSync(file, dest, (err)=>{
    if (err) throw err;
    else console.log('Successfully moved');
  });
    sleep
    
    return;
};




var game = process.argv[2];
const username = config[game].username;
const password = config[game].password;
const tags = config[game].tags;


var upload = async (page, filePath, creatorName, videoTitle) =>
{

    await page.waitForSelector('ytcp-icon-button[aria-label="Upload videos"]');
    await page.click('ytcp-icon-button[aria-label="Upload videos"]');
    
    await page.waitFor(2000);

    const elementHandle = await page.$("input[type=file]");
    await elementHandle.uploadFile(filePath); //'./test.mp4'

    await page.waitFor(5000);

    //get title and description page
    var inputBoxes = await page.$$('ytcp-mention-input[class="style-scope ytcp-mention-textbox"]');
    title = inputBoxes[0];
    description = inputBoxes[1];
    
    //rename title
    page.waitFor(1000);
    //const input = await page.$('ytcp-mention-input[class="style-scope ytcp-mention-textbox"]');
    
    await title.click({ clickCount: 3 });
    await title.type(videoTitle);
    
    await page.waitFor(500);
    
    //const input = await page.$('ytcp-mention-input[class="style-scope ytcp-mention-textbox"]'[1]);
    await description.click({ clickCount: 3 });
    await description.type(`Hello everyone! Welcome to the ggTV's official youtube channel. I do not take credit for any of the clips.\n\nOur app is coming soon! Visit www.ggtv.co for more information!\n\nEmail: ggtvdotin@gmail.com\nIG: https://www.instagram.com/ggtv_app/\nDiscord: https://discord.gg/T9AVnNJ3NW\n\nVideo Credit: ${creatorName}\n\nThanks for watching and consider subscribing for more such videos.`);
    
    //click not made for kids
    await page.waitFor(1000);
    await page.click('paper-radio-button[name="NOT_MADE_FOR_KIDS"]');
    
    //click More Options
    await page.waitFor(1000);
    await page.click('ytcp-button[label="More options"]');

    //add Tags
    await page.waitFor(1000);
    await page.type('input[placeholder="Add tag"]', tags);

    //select Language
    await page.waitFor(1000);
    await page.click('ytcp-form-select[class="style-scope ytcp-form-language-input"]');
    await page.waitFor(1000);
    //await page.select('#paper-list', 'English');
   
    var languages = await page.$$('yt-formatted-string[class="style-scope ytcp-text-menu"]');
    
    await page.waitFor(500);
    //loop until English
    for (i in languages)
    {
        language = await (await(languages[i].getProperty('textContent'))).jsonValue();
        if (language == 'English')
        {
            console.log(i);
            await languages[i].click();
        }
    }
    
    //pick Minecraft 2011
    await page.waitForSelector('ytcp-form-select[id="category"]');
    await page.click('ytcp-form-select[id="category"]');
    await page.waitFor(1000);
    var gameCategories = await page.$$('yt-formatted-string[class="style-scope ytcp-text-menu"]');
    
    await page.waitFor(500);
    //loop until English
    for (i in gameCategories)
    {
        gameCategory = await (await(gameCategories[i].getProperty('textContent'))).jsonValue();
        if (gameCategory == 'Gaming')
        {
            console.log(i);
            await gameCategories[i].click();
        }
    }
    
    await page.type('input[aria-label="Game title (optional)"]', game);
    await page.waitFor(2000);
    
    await page.keyboard.press('ArrowDown');
    await page.waitFor(100);
    await page.keyboard.press('ArrowDown');
    if (game == "PUBGM")
    {
        await page.waitFor(100);
        await page.keyboard.press('ArrowDown');
    }
    
    await page.keyboard.press(String.fromCharCode(13));

    await page.waitFor(1000);
    await page.click('ytcp-button[id="next-button"]');



    //need to add cards later
    await page.waitFor(1000);
    await page.click('ytcp-button[id="next-button"]');
    
    //click Public    await page.waitFor(500);
    await page.click('paper-radio-button[name="PUBLIC"]');
    
    //click publish
    await page.click('ytcp-button[id="done-button"]');

    //click close
    await page.waitForSelector('ytcp-button[id="close-button"]');
    await page.click('ytcp-button[id="close-button"]');
    
    await page.waitFor(1000);
}

(async () => {
    //launches Firefox Nightly


    
    //console.log(count);
    const browser = await puppeteer.launch({
            //product: 'firefox',
            args: [
                  '-wait-for-browser',
                   '--no-sandbox',
                   '--single-process',
                   '--disable-dev-shm-usage',
                   '--shm-size=3gb',
                   '--disable-web-security',
                   
                  ],
            ignoreDefaultArgs: ["--enable-automation"],
            executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            headless: false,
        });



    
    
    
    const page = await browser.newPage();
    navigationPromise = page.waitForNavigation();
    await page.goto("https://youtube.com");
    await navigationPromise;
    //press sign in
    await page.waitForSelector('paper-button[aria-label="Sign in"]');
    await page.click('paper-button[aria-label="Sign in"]');
    await page.waitFor(1000);
    
    //type in login credentials
    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    await page.type('input[type="email"]', username);
    await page.keyboard.press(String.fromCharCode(13));
    
    await page.waitFor(2000);
    
    await page.waitForSelector('input[type="password"]');
    await page.click('input[type="password"]');
    await page.waitFor(500);
    await page.type('input[type="password"]', password);
    await page.keyboard.press(String.fromCharCode(13));
    
    await page.waitFor(10000);
    

    

    if (game == "Minecraft")
    {
        //await page.waitForSelector('input[value="112345903986598661235"]');
        //await page.click('input[value="112345903986598661235"]');
        await page.waitForSelector('yt-formatted-string[id="channel-title"]');
        var channels = await page.$$('yt-formatted-string[id="channel-title"]');
        
        //console.log("HERE");
        for (i in channels)
        {
            var channelName = await (await(channels[i].getProperty('textContent'))).jsonValue();
            //console.log(channelName);
            if (channelName == 'ggTV: Minecraft')
            {
                await page.waitFor(1000);
                await channels[i].click();
                break;
            }
        }

        await page.waitFor(8000);
    }
    if (game == "PUBGM")
    {
        //await page.waitForSelector('input[value="112345903986598661235"]');
        //await page.click('input[value="112345903986598661235"]');
        await page.waitForSelector('yt-formatted-string[id="channel-title"]');
        var channels = await page.$$('yt-formatted-string[id="channel-title"]');
        
        //console.log("HERE");
        for (i in channels)
        {
            var channelName = await (await(channels[i].getProperty('textContent'))).jsonValue();
            //console.log(channelName);
            if (channelName == 'ggTV: PUBG Mobile')
            {
                await page.waitFor(1000);
                await channels[i].click();
                break;
            }
        }

        await page.waitFor(8000);
    }
    if (game == "COD Mobile")
    {
        //await page.waitForSelector('input[value="112345903986598661235"]');
        //await page.click('input[value="112345903986598661235"]');
        await page.waitForSelector('yt-formatted-string[id="channel-title"]');
        var channels = await page.$$('yt-formatted-string[id="channel-title"]');
        
        //console.log("HERE");
        for (i in channels)
        {
            var channelName = await (await(channels[i].getProperty('textContent'))).jsonValue();
            //console.log(channelName);
            if (channelName == 'ggTV: Call of Duty: Mobile')
            {
                await page.waitFor(1000);
                await channels[i].click();
                break;
            }
        }

        await page.waitFor(8000);
    }

    
    await page.waitForSelector('img[alt="Avatar image"]');
    await page.click('img[alt="Avatar image"]');
    
    await page.waitFor(1000);
    
    
    await page.waitForSelector('a[href="https://studio.youtube.com/"]');
    await page.click('a[href="https://studio.youtube.com/"]');

    await page.waitFor(10000);
    
    await page.setBypassCSP(true)
    
    //Where I cut
    for (let i=0; i < 60; i++)
    {
        let file = editJsonFile('./config.json');
        console.log(i);
        const files = fs.readdirSync(`/Users/calvinchen/dropbox/${game}/`);
        const numFiles = files.length;
        var number = Math.floor(Math.random() * numFiles);

        //check trimmed
        var f = files[number];
        console.log("random is "+number);
        console.log("Length is "+numFiles);
        
        var creatorName=f.split('-')[0];
        console.log(creatorName);
        var title=f.split('-')[1];
        console.log(title);
        filePath = `/Users/calvinchen/dropbox/${game}/${files[number]}`;
        console.log(filePath);
        await upload(page, filePath, creatorName, title);
        //update json file
        
//        await file.set(game,
//        {
//            "username": username,
//            "password": password,
//            "fileNumber": count
//
//        });
//        await file.save();
        await moveFile(filePath, `/Users/calvinchen/dropbox/${game} Uploaded`);
    }

    
    await page.waitFor(20000);
    
    await browser.close();
})();
