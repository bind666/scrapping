import puppeteer from "puppeteer";
import * as XLSX from "xlsx";
import fs from "fs"

(async () => {

    let browser = await puppeteer.launch(
        {
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false
        }
    );
    let page = await browser.newPage();

    await page.goto("https://www.flipkart.com/");
    await page.setViewport({ width: 1000, height: 1024 });


    await page.waitForSelector("._2SmNnR .Pke_EE")
    let searchBox = await page.$("._2SmNnR .Pke_EE")
    console.log(searchBox);

    await searchBox.click();
    await page.keyboard.type(" samsung mobile", { delay: 25 })
    await page.keyboard.press("Enter");


    await page.waitForSelector("._75nlfW")
    const mobileDivArr = await page.$$("._75nlfW")


    // let MobileDetails = [];
    let range_1000_10000 = []
    let range_10001_20000 = []
    let range_20001_30000 = []
    let range_30001_40000 = []
    let range40001_above = []


    for (let i = 0; i < mobileDivArr.length; i++) {
        await page.waitForSelector("._4WELSP img")
        const img = await mobileDivArr[i].$("._4WELSP img");

        const priceElement = await mobileDivArr[i].$(".Nx9bqj")
        const MobileName = await mobileDivArr[i].$(".KzDlHZ")
        const detailsUl = await mobileDivArr[i].$(".G4BRas")
        const li = await detailsUl.$$("li");


        let imgSrc = "";
        let priseText = "";
        let mobileNameText = "";
        let detailsText = "";
        let memory = await page.evaluate(el => el.innerText, li[0])
        let screen = await page.evaluate(el => el.innerText, li[1])
        let camera = await page.evaluate(el => el.innerText, li[2])
        let battery = await page.evaluate(el => el.innerText, li[3])
        let processor = await page.evaluate(el => el.innerText, li[4])


        if (img) {
            let imgSrcHandle = await img.getProperty("src")
            imgSrc = await imgSrcHandle.jsonValue();
        }
        else {
            console.log("Image url not found", i);
        }

        if (MobileName) {
            mobileNameText = await page.evaluate(el => el.innerText, MobileName);
        } else {
            console.log("Mobile Name not found", i);
        }

        if (priceElement) {
            priseText = await page.evaluate(el => el.innerText, priceElement);

            let price = Number(priseText.split("₹")[1].split(",").join(""));

            if (price <= 10000) {
                range_1000_10000.push({
                    "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
                    "memory": memory,
                    "screen": screen,
                    "camera": camera,
                    "processor": processor,
                    "battery": battery
                })
            } else if (price <= 20000) {
                range_10001_20000.push({
                    "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
                    "memory": memory,
                    "screen": screen,
                    "camera": camera,
                    "processor": processor,
                    "battery": battery
                })
            } else if (price <= 30000) {
                range_20001_30000.push({
                    "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
                    "memory": memory,
                    "screen": screen,
                    "camera": camera,
                    "processor": processor,
                    "battery": battery
                })
            } else if (price <= 40000) {
                range_30001_40000.push({
                    "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
                    "memory": memory,
                    "screen": screen,
                    "camera": camera,
                    "processor": processor,
                    "battery": battery
                })
            } else {
                range40001_above.push({
                    "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
                    "memory": memory,
                    "screen": screen,
                    "camera": camera,
                    "processor": processor,
                    "battery": battery
                })
            }
        } else {
            console.log("prise not found", i);
        }

        // MobileDetails.push({
        //     "Image URL": imgSrc, "Price": priseText, "Mobile Name": mobileNameText,
        //     "memory": memory,
        //     "screen": screen,
        //     "camera": camera,
        //     "processor": processor,
        //     "battery": battery
        // })
    }

    // console.log(MobileDetails);


    const workbook = XLSX.utils.book_new();

    if (range_1000_10000.length > 0) {
        const worksheet1 = XLSX.utils.json_to_sheet(range_1000_10000);
        XLSX.utils.book_append_sheet(workbook, worksheet1, "1000-10000")
    }

    if (range_10001_20000.length > 0) {
        const worksheet2 = XLSX.utils.json_to_sheet(range_10001_20000);
        XLSX.utils.book_append_sheet(workbook, worksheet2, "10001_20000")
    }
    if (range_20001_30000.length > 0) {
        const worksheet3 = XLSX.utils.json_to_sheet(range_20001_30000);
        XLSX.utils.book_append_sheet(workbook, worksheet3, "20001_30000")
    }
    if (range_30001_40000.length > 0) {
        const worksheet4 = XLSX.utils.json_to_sheet(range_30001_40000);
        XLSX.utils.book_append_sheet(workbook, worksheet4, "30001_40000")
    }
    if (range40001_above.length > 0) {
        const worksheet5 = XLSX.utils.json_to_sheet(range40001_above);
        XLSX.utils.book_append_sheet(workbook, worksheet5, "40001 & above")
    }

    // // Write the workbook to a file
    XLSX.writeFile(workbook, "MobileDetails.xlsx");
    console.log(range_1000_10000);
    console.log(range_10001_20000);
    console.log(range_20001_30000);
    console.log(range_30001_40000);
    console.log(range40001_above);
    
    

    console.log("Excel file created: MobileDetails.xlsx");

    await browser.close()

})()