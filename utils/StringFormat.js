module.exports = (string) => {
    strbs = string.replace('_', ' ')

    return strbs.charAt(0).toUpperCase() + strbs.slice(1);
}