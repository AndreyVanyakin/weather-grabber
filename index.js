const cron = require('node-cron');


const {KEY, URL, DB_URL, DB_NAME, LOCATIONS, CRON} = require('./config');
const fetch = require('./fetch');
const { initDB, write } = require('./database');


// request data and store it in mongo
const grab = async () => {
    await initDB(DB_URL, DB_NAME);

    await cron.schedule(CRON, async () => {

        try {
            
            // Fetch data for each location

            await LOCATIONS.forEach(async loc => {
                const data = await fetch(URL, KEY, loc);
                console.log(`[API] New Incoming for ${loc}`)
                // console.log(res);
                await write(data);
            })
        } catch (err) {

            console.error(err);

        }
       

    })
    
}

grab();




