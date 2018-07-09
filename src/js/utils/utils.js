function assign(value, prevValue) {
    return typeof value == 'undefined' ? prevValue : value;
}