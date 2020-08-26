const isNumber = require('../lib/isNumeric');

const makedropdown = arr => {
    var html = ``;
    arr.forEach((element, idx) => { html += `<option value=${idx+1}>${element}</option>\n`; });
    return html;
}

const makeprofile = (user, subjectArray, subjectName) => {
    const subjectdropdown = makedropdown(subjectName);
    const classdropdown = makedropdown(Array.from(Array(15), (e,i) => i+1));
    var html = `<h2>${user.code} ${user.name}</h2>\n<ul>\n`;
    subjectArray.forEach((subject, idx) => {
        html += `<li>${subject.name} ${user.classes[idx]}분반</li>\n`;
    });
    html += `</ul>\n<h2> 과목 추가하기 </h2>`;
    html += `<form action="/endpoint/signup" method="post"><input name="_method" type="hidden" value="patch">
        <select name="subject"> ${subjectdropdown} </select>
        <select name="class"> ${classdropdown} </select>
        <p><input type="submit", value="과목 추가"></p>
    </form>`;
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
        const subjectAll = await ctx.state.collection.subjects.find();
        console.log(subjectAll);
        const subjectName = subjectAll.map(subject => subject.name);
        ctx.body = makeprofile(user, subjectArray, subjectName);
        await next();
    }
}