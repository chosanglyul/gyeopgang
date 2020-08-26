const isNumber = require('../lib/isNumeric');
const isArray = require('../lib/isArray');

module.exports = {
    /*
    post: async (ctx, next) => {
        if(!isArray.isIntegerArray(ctx.request.body.classes) || !isArray.isIntegerArray(ctx.request.body.subjects)) ctx.throw(400);
        const isExist = await ctx.state.collection.users.countDocuments({ code: parseInt(ctx.params.code, 10)});
        if(isExist >= 1) ctx.throw(400);
        
        subjectArray = isArray.parseIntegerArray(ctx.request.body.subjects);
        classesArray = isArray.parseIntegerArray(ctx.request.body.classes);
        if(classesArray.length !== subjectArray.length) ctx.throw(400);
        const subjectInfo = await Promise.all(
            subjectArray.map(subject => { return ctx.state.collection.subjects.findOne({ code: subject }); })
        );
        subjectInfo.forEach((subject, idx) => { if(!subject || classesArray[idx] <= 0 || classesArray[idx] > subject.classes) ctx.throw(400); });

        await ctx.state.collection.users.findOneAndUpdate({ code: parseInt(ctx.params.code, 10) }, {
            $setOnInsert: {
                name: ctx.request.body.name,
                subjects: subjectArray,
                classes: classesArray
            }
        }, { upsert: true });
        await next();
    },
    */
    post: async(ctx, next) => {
        const isExist = await ctx.state.collection.users.countDocuments({ code: parseInt(ctx.request.body.code, 10)});
        if(isExist >= 1) ctx.throw(400);
        await ctx.state.collection.users.findOneAndUpdate({ code: parseInt(ctx.request.body.code, 10) }, {
            $setOnInsert: {
                name: ctx.request.body.name,
                subjects: [],
                classes: []
            }
        }, { upsert: true });
        ctx.redirect(`/profile/${ctx.request.body.code}`);
        await next();
    },
    delete: async(ctx, next) => {
        if(parseInt(ctx.request.body.code, 10) !== ctx.session.passport.user.code) ctx.throw(400);
        const isExist = await ctx.state.collection.users.countDocuments({ code: parseInt(ctx.session.passport.user.code, 10)});
        if(!isExist) ctx.throw(400);
        await ctx.state.collection.users.deleteOne({ code: parseInt(ctx.session.passport.user.code, 10) });
        ctx.logout();
        ctx.redirect('/');
        await next();
    },
    patch: async(ctx, next) => {
        if(!isNumber(ctx.request.body.class, "4") || !isNumber(ctx.request.body.subject, "4")) ctx.throw(400);
        const user = await ctx.state.collection.users.findOne({ code: ctx.session.passport.user.code});
        if(!user) ctx.throw(400);
        const subject = await ctx.state.collection.subjects.findOne({ code: parseInt(ctx.request.body.subject, 10) });
        const classnum = parseInt(ctx.request.body.class, 10);
        if(!subject || classnum <= 0 || classnum > subject.classes) ctx.throw(400);
        if(user.subjects.includes(subject.code)) ctx.throw(400);
        user.subjects.push(subject.code);
        user.classes.push(classnum);

        await ctx.state.collection.users.findOneAndUpdate({ code: ctx.session.passport.user.code }, {
            $set: { subjects: user.subjects, classes: user.classes }
        });
        ctx.redirect(`/profile/${ctx.session.passport.user.code}`);
        await next();
    },
    common: async(ctx, next) => {
        if(!isNumber(ctx.request.body.code, "4") || ctx.request.body.code < 0) ctx.throw(400);
        await next();
    },
}