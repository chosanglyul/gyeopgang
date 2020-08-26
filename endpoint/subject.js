const isNumber = require('../lib/isNumeric');
const isArray = require('../lib/isArray');

module.exports = {
    post: async (ctx, next) => {
        if(!isNumber(ctx.request.body.classes, "4")) ctx.throw(400);
        const docNum = await ctx.state.collection.subjects.countDocuments();
        await ctx.state.collection.subjects.findOneAndUpdate({ code: docNum+1 }, {
            $setOnInsert: {
                name: ctx.request.body.name,
                classes: parseInt(ctx.request.body.classes, 10)
            }
        }, { upsert: true });
        ctx.redirect('/subject');
        await next();
    },
    delete: async(ctx, next) => {
        const isExist = await ctx.state.collection.subjects.countDocuments({ code: parseInt(ctx.params.code, 10)});
        if(!isExist) ctx.throw(400);
        await ctx.state.collection.subjects.deleteOne({ code: parseInt(ctx.params.code, 10) });
        await next();
    },
    patch: async(ctx, next) => {
        //TODO
        await next();
    },
    common: async(ctx, next) => {
        //without POST
        if(!isNumber(ctx.params.code, "4") || ctx.params.code < 0) ctx.throw(400);
        await next();
    }
}