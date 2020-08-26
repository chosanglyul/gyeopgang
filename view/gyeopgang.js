module.exports = async (ctx, next) => {
    ctx.body = ``;
    await next();
}