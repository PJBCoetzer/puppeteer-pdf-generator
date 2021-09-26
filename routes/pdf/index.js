'use strict';
const express = require('express');
const router = express.Router();
const puppeteer = require("puppeteer");

function validPageUrl (url) {
    return /^((?:(https?):\/\/)?((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9]))|(?:(?:(?:\w+\.){1,2}[\w]{2,3})))(?::(\d+))?((?:\/[\w]+)*)(?:\/|(\/[\w]+\.[\w]{3,4})|(\?(?:([\w]+=[\w]+)&)*([\w]+=[\w]+))?|\?(?:(wsdl|wadl))))$/gi.test(url);
}

router.get('/', async function (req, res) {

    try {

        let PageURL = '';
        let PageFormat = 'A4';
        let bIncludeFooter = true;
        let bPrintBackground = true;
        let bPrintLandscape = false;
        let bShrink = false;
        let sPageMarginTop = '5px';
        let sPageMarginRight = '5px';
        let sPageMarginBottom = '5px';
        let sPageMarginLeft = '5px';

        if (validPageUrl(String(req.query.page_url).trim())){
            PageURL = String(req.query.page_url).trim();
        }else {
            return res.status(400).json({ status: "Error - Input", message: "Page URL is invalid" }).end();
        }

        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();

        await page.goto(PageURL, {
            waitUntil: "networkidle2"
        });
        await page.setViewport({ width: 1200, height: 800 });                
        let datestring = new Date();
        
        const pdfBuffer = await page.pdf({
            format: PageFormat,
            landscape: bPrintLandscape,
            preferCSSPageSize: bShrink,
            printBackground: bPrintBackground,
            displayHeaderFooter: bIncludeFooter,
            headerTemplate: `<p></p>`,
            footerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:10px;margin-right:10px;width:100%;">
                                Generated: ${datestring}
                                <span style="display:inline-block;float:right;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
                            </div>`,
            margin: {
                top: sPageMarginTop,
                right: sPageMarginRight,
                bottom: sPageMarginBottom,
                left: sPageMarginLeft
            }
        });

        await page.close();
        await browser.close();
        
        res.set({
            "Content-Type": "application/pdf",
            "Content-Length": pdfBuffer.length
            });

        return res.status(200).send(pdfBuffer).end();

    }
    catch (e) {
        console.error(e);
        return res.status(500).end(); 
    }

});

module.exports = router;