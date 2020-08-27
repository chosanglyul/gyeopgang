const isNumber = require('../lib/isNumeric');
const makeButton = require('../lib/makeButton');

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
    html += `</ul>\n<h3> 기타 메뉴 </h3>\n`;
    html += makeButton('/profile', 'GET', '마이페이지');
    html += makeButton('/', 'GET', '홈으로');
    html += makeButton('/endpoint/logout', 'POST', '로그아웃');
    return html;
}

module.exports = async (ctx, next) => {
    if(!ctx.request.query || !isNumber(ctx.request.query.code, "4")) {
        ctx.flash('error', '잘못된 학번입니다.');
        return ctx.redirect('/profile');
    }
    const user = await ctx.state.collection.users.findOne({ code: parseInt(ctx.request.query.code, 10) });
    if(!user) {
        ctx.flash('error', '존재하지 않는 사용자입니다.');
        return ctx.redirect('/profile');
    }
    const subjectInfo = await ctx.state.collection.subjects.find().toArray();
    ctx.body = makegyeopgang(subjectInfo, ctx.session.passport.user, user);
    await next();
}