const {crawlPage} = require('./crawl.js')

async function main(){
    if(process.argv.length < 3){
        console.log('no web provided')
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log('too much input')
        process.exit(1)
    }
    const baseURL = process.argv[2]
    console.log(`starting crawl ${baseURL}`)
    const pages = await crawlPage(baseURL, baseURL, {})
    for(const page of Object.entries(pages)){
        console.log(page)
    }
}

main()