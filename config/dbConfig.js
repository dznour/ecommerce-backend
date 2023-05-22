const { default: mongoose } = require("mongoose")

const dbName = 'ecommerce';
const userName = 'kasevn';
const password = process.env.PASSWORD;
const dbConnect = () => {
    try {
        const conn = mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.itofvo0.mongodb.net/${dbName}?retryWrites=true&w=majority`);
        //console.log(`mongodb+srv://${userName}:${password}@cluster0.itofvo0.mongodb.net/${dbName}?retryWrites=true&w=majority`);
        console.log('Database Connected Successfully!');
    } catch (err) {
        throw new Error(err);
        console.log('error here');
    }
}

module.exports = dbConnect;