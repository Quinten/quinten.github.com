const primeNumbers = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];

let getPresentElement = (elements) => {
    if (!Array.isArray(elements) || elements.length === 0) {
        return null;
    }
    if (elements.length === 1) {
        return elements[0];
    }
    let timestamp = Date.now() / 1000;
    let present = Math.floor(timestamp / 8);
    if (elements.length < 4) {
        return elements[present % elements.length];
    }
    let offset = primeNumbers[present % primeNumbers.length];
    let index = (present + offset) % elements.length;
    return elements[index];
}

export default {
    getPresentElement
};
