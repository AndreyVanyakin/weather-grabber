const {DB_NAME, DB_URL} = require('./config');
const _ = require('lodash');

const MongoClient = require('mongodb').MongoClient;
let client = new MongoClient(DB_URL);
let db;

const initDB = async () => {
    try {

        // CREATE DB
        await client.connect();
        console.log('[db] Connected to server');
        db = client.db(DB_NAME);

        const existingColls = (await db.listCollections({}, {nameOnly: true}).toArray()).map(collObj => collObj.name);

        // check if exist
        if (!_.includes(existingColls, 'current')) {
            const collection = await db.createCollection('current');    
            await collection.createIndex({ 'location.name': 1, 'current.last_updated_epoch': -1 });

            console.log('[db] Created _current_ collection');
        } else {
            console.log('[db] _current_ collection was created before');
        }
        
        console.log('[db] Db and all collections initialised sucessfully');
        // await client.close();
    
    } catch (err) {
        console.error(err);
    }
};



const write = async (data) => {
    try {   
        

        //Check if document exists
        const {location, current} = data;
        const isRepeat = (await db.collection('current').find({'location.name': location.name, 'current.last_updated_epoch': current.last_updated_epoch}).limit(1).toArray()).length > 0;

        if (!isRepeat) {
            await db.collection('current').insertOne(data);
            console.log('[db] Inserted and resting');
        } else {
            console.log('[db] Did not insert');
        }

    } catch (err) {
        console.error(err);
    }
}





module.exports = {initDB, write};