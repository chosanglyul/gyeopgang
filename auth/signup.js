const isNumber = require('../lib/isNumeric');
const isArray = require('../lib/isArray');

module.exports = {
    post: async (ctx, next) => {
        if(!isArray.isIntegerArray(ctx.request.body.classes) || !isArray.isIntegerArray(ctx.request.body.subjects)) ctx.throw(400);
        const isExist = await ctx.state.collection.users.countDocuments({ code: parseInt(ctx.params.code, 10)});
        if(isExist >= 1) ctx.throw(400);
        subjectArray = isArray.parseIntegerArray(ctx.request.body.subjects);
        classesArray = isArray.parseIntegerArray(ctx.request.body.classes);
        if(classesArray.length !== subjectArray.length) ctx.throw(400);
        
        await ctx.state.collection.users.findOneAndUpdate({ code: parseInt(ctx.params.code, 10) }, {
            $setOnInsert: {
                name: ctx.request.body.name,
                subjects : subjectArray,
                classes: classesArray
            }
        }, { upsert: true });
        await next();
    },
    get: async(ctx, next) => {
        var user = await ctx.state.collection.users.findOne({ code: parseInt(ctx.params.code, 10) });
        if(!user) ctx.throw(400);
        ctx.body = user;
        await next();
    },
    delete: async(ctx, next) => {
        const isExist = await ctx.state.collection.users.countDocuments({ code: parseInt(ctx.params.code, 10)});
        if(!isExist) ctx.throw(400);
        await ctx.state.collection.users.deleteOne({ code: parseInt(ctx.params.code, 10) });
        await next();
    },
    common: async(ctx, next) => {
        if(!isNumber(ctx.params.code, "4") || ctx.params.code < 0) ctx.throw(400);
        await next();
    }
}