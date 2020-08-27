module.exports = (url, method, value) => {
    return `<form action="${url}" method="${method}">
        <p><input type="submit", value="${value}"></p>
    </form>`;
}