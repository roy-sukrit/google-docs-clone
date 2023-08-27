const mongoose = require('mongoose');
require('dotenv').config()


class Database {

    constructor() {
        this.connect();
    }
    async connect() {

        try {
            console.log("url",process.env);
            await mongoose.connect(`${process.env.DATABASE_URL}`)
            console.log("Db Connection Success");

        } catch (error) {
            console.log("Db Connection Error",error);

        }
    }
}


module.exports = new Database();