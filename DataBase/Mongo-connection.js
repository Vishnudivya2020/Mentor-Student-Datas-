import {MongoClient} from "mongodb";

//Connecting URL and Database Name
const dbCluster ="localhost:27017";

const dbName = "Mentor&Student";

const localUri = `mongodb://${dbCluster}/${dbName}`;

const client = new MongoClient(localUri);

const db = client.db(dbName);
const connectToDB = async () => {
    try{
        //Connecting to the mongoDB server
        await client.connect();
        console.log("DB connected");
    }catch (err){
        console.log('Error connection to MongoDB',err);
        process.exit(1);
    }
};

export { client,db };

export default   connectToDB;