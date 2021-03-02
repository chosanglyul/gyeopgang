const isNumber = require('../lib/isNumeric');
const makeButton = require('../lib/makeButton');

const makedropdown = {
    arr: arr => {
        var html = ``;
        arr.forEach((element, idx) => { html += `<option value=${idx+1}>${element}</option>\n`; });
        return html;
    },
    exclude: (arr, exclude) => {
        var html = ``;
        arr.forEach((subject, idx) => {
            if(!(exclude.includes(subject.code))) html += `<option value=${idx+1}>${subject.name}</option>\n`;
        });
        return html;
    },
    concat: (subjects, classes) => {
        var html = ``;
        subjects.forEach((subject, idx) => {
            html += `<option value=${subject.code}>${subject.name} ${classes[idx]}분반</option>\n`;
        });
        return html;
    }
}

const makeprofile = (user, subjectArray, subjectAll, successFlash, failureFlash) => {
    var html = ``;
    if(successFlash.length > 0) html += `<div style="color:green;">${successFlash[0]}</div>`;
    if(failureFlash.length > 0) html += `<div style="color:red;">${failureFlash[0]}</div>`;
    html += `<h2>${user.code} ${user.name}</h2>\n<h3> 수강 과목 </h3>\n<ul>\n`;
    subjectArray.forEach((subject, idx) => {
        html += `<li>${subject.name} ${user.classes[idx]}분반</li>\n`;
    });
    if(subjectAll !== undefined) {
        const subjectdropdown = makedropdown.exclude(subjectAll, user.subjects);
        const classdropdown = makedropdown.arr(Array.from(Array(15), (e,i) => i+1));
        const concatdropdown = makedropdown.concat(subjectArray, user.classes);
        html += `</ul>\n<h3> 과목 추가/삭제, 분반 수정하기 </h3>\n`;
        html += `<form action="/endpoint/usersubject/add" method="post">
            <select name="subject"> ${subjectdropdown} </select>
            <select name="class"> ${classdropdown} </select> 분반
            <input type="submit", value="과목 추가">
        </form>`;
        html += `<form action="/endpoint/usersubject/delete" method="post">
            <select name="subject"> ${concatdropdown}} </select>
            <input type="submit", value="과목 삭제">
        </form>`;
        html += `<form action="/endpoint/usersubject/patch" method="post">
            <select name="subject"> ${concatdropdown} </select>
            ==> <select name="class"> ${classdropdown} </select> 분반
            <input type="submit", value="분반 수정">
        </form>`;
    }
    html += '<h3> 기타 메뉴 </h3>\n';
    html += makeButton('/', 'GET', '홈으로');
    html += makeButton('/endpoint/logout', 'POST', '로그아웃');
    html += `<form action="/gyeopgang" method="GET">
        <input type="text" name="code" placeholder="학번/이름">
        <input type="submit", value="겹강 찾기">
    </form>`;
    return html;
};

module.exports = {
    index: async (ctx, next) => {
        ctx.redirect(`/profile/${ctx.session.passport.user.code}`);
        await next();
    },
    user: async(ctx, next) => {
        if(!isNumber(ctx.params.code, "4")) {
            ctx.flash('error', '잘못된 학번입니다.');
            return ctx.redirect('/profile');
        }
        const user = await ctx.state.collection.users.findOne({ code: parseInt(ctx.params.code, 10) });
        if(!user) {
            ctx.flash('error', '존재하지 않는 사용자입니다.');
            return ctx.redirect('/profile');
        }
        const subjectArray = await Promise.all(
            user.subjects.map( subject => { return ctx.state.collection.subjects.findOne({ code: subject }); } )
        );
        if(ctx.session.passport.user.code === parseInt(ctx.params.code, 10)) {
            const subjectAll = await ctx.state.collection.subjects.find().toArray();
            ctx.body = makeprofile(user, subjectArray, subjectAll, ctx.flash('success'), ctx.flash('error'));
        } else ctx.body = makeprofile(user, subjectArray, undefined, [], []);
        await next();
    }
}