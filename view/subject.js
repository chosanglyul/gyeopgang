const makeindex = subjectArray => {
    var html = `<h2> 과목 정보 </h2>\n<h3> 등록된 과목 목록 </h3>\n<ul>\n`;
    subjectArray.forEach(subject => {
        html += `<li>과목명 : ${subject.name}, 총 분반 수 : ${subject.classes}</li>\n`;
    });
    html += `</ul>
    <h3> 새 과목 등록하기 </h3>
    <form action="/endpoint/subject" method="post">
        <p><input type="text" name="name" placeholder="과목명"></p>
        <p><input type="text" name="classes" placeholder="분반 수"></p>
        <p><input type="submit", value="등록"></p>
    </form>`;
    return html;
}

module.exports = {
    index: async (ctx, next) => {
        const subjectArray = await ctx.state.collection.subjects.find().toArray();
        ctx.body = makeindex(subjectArray);
        await next();
    },
    subject: async (ctx, next) => {
        
        await next();
    }
};