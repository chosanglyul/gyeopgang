const isNumber = require('../lib/isNumeric');
//const isArray = require('../lib/isArray');

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
        if(isExist >= 1) {
            ctx.flash('error', '이미 가입된 학번입니다.');
            return ctx.redirect('/signup');
        }
        await ctx.state.collection.users.findOneAndUpdate({ code: parseInt(ctx.request.body.code, 10) }, {
            $setOnInsert: {
                name: ctx.request.body.name,
                subjects: [],
                classes: []
            }
        }, { upsert: true });
        ctx.flash('success', '회원가입에 성공했습니다. 로그인해주세요.');
        return ctx.redirect('/');
    },
    delete: async(ctx, next) => {
        if(parseInt(ctx.request.body.code, 10) !== ctx.session.passport.user.code) ctx.throw(401);
        await ctx.state.collection.users.deleteOne({ code: parseInt(ctx.session.passport.user.code, 10) });
        ctx.logout();
        return ctx.redirect('/');
    },
    common: async(ctx, next) => {
        if(!isNumber(ctx.request.body.code, "4") || ctx.request.body.code < 0) {
            ctx.flash('error', '잘못된 학번입니다.');
            return ctx.redirect('/signup');
        }
        await next();
    },
}