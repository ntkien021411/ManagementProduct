module. exports.generateRandomString = (length) => { 
    const characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result
}