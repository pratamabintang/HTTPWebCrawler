const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }
    console.log(`actively crawling ${currentURL}`)

    pages[normalizedCurrentURL] = 1

    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log(`error fetch status ${resp.status}`)
            return pages
        }

        const pageContent = resp.headers.get('content-type')
        if(!pageContent.includes('text/html')){
            console.log(`error fetch content-type ${pageContent}`)
            return pages
        }

        const htmlBody = await resp.text()
        const nextURLS = getURLFromHtml(htmlBody, baseURL)
        for(const nextURL of nextURLS){
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch(err){
        console.log(`error fetch ${err.message} at ${baseURL}`)
    }
    return pages
}

function getURLFromHtml(htmlBody, baseURL){
    const URLS = []
    const dom = new JSDOM(htmlBody)
    const linkElmts = dom.window.document.querySelectorAll('a')
    for (const linkElmt of linkElmts){
        if(linkElmt.href.slice(0, 1) === '/'){
            try {
                URLS.push(new URL(linkElmt.href, baseURL).href)
              } catch (err){
                console.log(`${err.message}: ${linkElmt.href}`)
              }
        }else{
            try {
                URLS.push(new URL(linkElmt.href).href)
            } catch (err){
                console.log(`${err.message}: ${linkElmt.href}`)
            }
        }
    }
    return URLS
}

function normalizeURL(URLString){
    const URLObj = new URL(URLString)
    const hostPath = `${URLObj.hostname}${URLObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLFromHtml,
    crawlPage
}