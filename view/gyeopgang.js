const isNumber = require('../lib/isNumeric');

const makegyeopgang = (subjectInfo, user1, user2) => {
    var nogyeop = true;
    var html = `<h2>${user1.code} ${user1.name}와 ${user2.code} ${user2.name}의 겹강</h2>\n<ul>\n`;
    user1.subjects.forEach((subject, idx) => {
        const idx2 = user2.subjects.indexOf(subject);
        if(idx2 !== -1 && user2.classes[idx2] === user1.classes[idx]) {
            nogyeop = false;
            html += `<li>${subjectInfo[subject-1].name} ${user1.classes[idx]}분반</li>\n`;
        }
    });
    if(nogyeop) html += `<li> 노겹강 ㅠㅠ </li>\n`;
    html += `</ul>`;
    return html;
}

module.exports = async (ctx, next) => {
    if(!isNumber(ctx.params.code, "4")) ctx.throw(400);
    const user = await ctx.state.collection.users.findOne({ code: parseInt(ctx.params.code, 10) });
    if(!user) ctx.throw(400);
    const subjectInfo = await ctx.state.collection.subjects.find().toArray();
    ctx.body = makegyeopgang(subjectInfo, ctx.session.passport.user, user);
    await next();
}