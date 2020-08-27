const isNumber = require('../lib/isNumeric');

module.exports = {
    add: async (ctx, next) => {
        if(!isNumber(ctx.request.body.class, "4") || !isNumber(ctx.request.body.subject, "4")) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }
        const subject = await ctx.state.collection.subjects.findOne({ code: parseInt(ctx.request.body.subject, 10) });
        const classnum = parseInt(ctx.request.body.class, 10);
        if(!subject || classnum <= 0 || classnum > subject.classes || ctx.session.passport.user.subjects.includes(subject.code)) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }
        ctx.session.passport.user.subjects.push(subject.code);
        ctx.session.passport.user.classes.push(classnum);

        await ctx.state.collection.users.findOneAndUpdate({ code: ctx.session.passport.user.code }, {
            $set: { subjects: ctx.session.passport.user.subjects, classes: ctx.session.passport.user.classes }
        });
        ctx.flash('success', '과목 추가에 성공했습니다.');
        return ctx.redirect('/profile');
    },
    delete: async (ctx, next) => {
        if(!isNumber(ctx.request.body.subject, "4")) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }
        const idx = ctx.session.passport.user.subjects.indexOf(parseInt(ctx.request.body.subject, 10));
        if(idx === -1) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }

        ctx.session.passport.user.subjects.splice(idx, 1);
        ctx.session.passport.user.classes.splice(idx, 1);

        await ctx.state.collection.users.findOneAndUpdate({ code: ctx.session.passport.user.code }, {
            $set: { subjects: ctx.session.passport.user.subjects, classes: ctx.session.passport.user.classes }
        });
        ctx.flash('success', '과목 삭제에 성공했습니다.');
        return ctx.redirect('/profile');
    },
    patch: async (ctx, next) => {
        if(!isNumber(ctx.request.body.subject, "4") || !isNumber(ctx.request.body.class, "4")) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }
        const idx = ctx.session.passport.user.subjects.indexOf(parseInt(ctx.request.body.subject, 10));
        if(idx === -1) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }

        const subject = await ctx.state.collection.subjects.findOne({ code: parseInt(ctx.request.body.subject, 10) });
        const classnum = parseInt(ctx.request.body.class, 10);
        if(!subject || classnum <= 0 || classnum > subject.classes) {
            ctx.flash('error', '잘못된 요청입니다.');
            return ctx.redirect('/profile');
        }

        ctx.session.passport.user.classes.splice(idx, 1, classnum);

        await ctx.state.collection.users.findOneAndUpdate({ code: ctx.session.passport.user.code }, {
            $set: { classes: ctx.session.passport.user.classes }
        });
        ctx.flash('success', '분반 수정에 성공했습니다.');
        return ctx.redirect('/profile');
    }
}