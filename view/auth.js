module.exports = {
    login: async (ctx, next) => {
        ctx.body = `<form action="/endpoint/login" method="post">
            <p><input type="text" name="code" placeholder="학번"></p>
            <p><input type="text" name="name" placeholder="이름"></p>
            <p><input type="submit", value="로그인"></p>
        </form>`;
        await next();
    },
    signup: async (ctx, next) => {
        ctx.body = `<form action="/endpoint/signup" method="post">
            <p><input type="text" name="code" placeholder="학번"></p>
            <p><input type="text" name="name" placeholder="이름"></p>
            <p><input type="submit", value="회원 가입"></p>
        </form>`;
        await next();
    }
}