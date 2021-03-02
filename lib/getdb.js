const { MongoClient } = require("mongodb");

module.exports = async (ctx, next) => {
    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@gyeopgang-db.5hja2.gcp.mongodb.net/Gyeopgang-DB
    ?retryWrites=true&w=majority`;
    ctx.state.client = await MongoClient.connect(url);
    ctx.state.db = ctx.state.client.db("Gyeopgang-DB"); //("pebble-db");
    ctx.state.collection = {};
    ctx.state.collection.users = ctx.state.db.collection("users_G");
    ctx.state.collection.subjects = ctx.state.db.collection("subjects_G");
    await next();
}