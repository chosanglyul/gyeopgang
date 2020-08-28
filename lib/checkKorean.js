const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

module.exports = {
    allH: string => {
        for(var i = 0; i < string.length; i++) {
            if(korean.test(string.substring(i, i+1)) === false)
                return false;
        }
        return true;
    },
    anyH: string => { return korean.test(string); }
}