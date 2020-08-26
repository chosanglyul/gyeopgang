const isNumber = require('../lib/isNumeric');

const makedropdown = {
    arr: arr => {
        var html = ``;
        arr.forEach((element, idx) => { html += `<option value=${idx+1}>${element}</option>\n`; });
        return html;
    },
    exclude: (arr, exclude) => {
        var html = ``;
        arr.forEach((subject, idx) => {
            if(!(exclude.includes(subject.code)))
            html += `<option value=${idx+1}>${subject.name}</option>\n`;
        });
        return html;
    }
}

const makeprofile = (user, subjectArray, subjectAll) => {
    var html = `<h2>${user.code} ${user.name}</h2>\n<h3> 수강 과목 </h3>\n<ul>\n`;
    subjectArray.forEach((subject, idx) => {
        html += `<li>${subject.name} ${user.classes[idx]}분반</li>\n`;
    });
    if(subjectAll !== undefined) {
        const subjectdropdown = makedropdown.exclude(subjectAll, user.subjects);
        const classdropdown = makedropdown.arr(Array.from(Array(15), (e,i) => i+1));
        html += `</ul>\n<h3> 과목 추가하기 </h3>`;
        html += `<form action="/endpoint/add_subject" method="post">
            <select name="subject"> ${subjectdropdown} </select>
            <select name="class"> ${classdropdown} </select> 분반
            <p><input type="submit", value="과목 추가"></p>
        </form>`;
    }
    return html;
};

module.exports = {
    index: async (ctx, next) => {
        ctx.redirect(`/profile/${ctx.session.passport.user.code}`);
        await next();
    },
    user: async(ctx, next) => {
        if(!isNumber(ctx.params.code, "4")) ctx.throw(400);
        const user = await ctx.state.collection.users.findOne({ code: parseInt(ctx.params.code, 10) });
        if(!user) ctx.throw(400);
        const subjectArray = await Promise.all(
            user.subjects.map( subject => { return ctx.state.collection.subjects.findOne({ code: subject }); } )
        );
        if(ctx.session.passport.user.code === parseInt(ctx.params.code, 10)) {
            const subjectAll = await ctx.state.collection.subjects.find().toArray();
            ctx.body = makeprofile(user, subjectArray, subjectAll);
        } else ctx.body = makeprofile(user, subjectArray, undefined);
        await next();
    }
}