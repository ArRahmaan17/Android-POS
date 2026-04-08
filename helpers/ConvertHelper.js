function phone_number(value) {
    return `62${value}`.replace(/(\d{2})(\d{3})(\d{3})(\d{3,4})/, '+($1) $2-$3-$4');
}
const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

function buatSingkatan(kalimat) {
    return kalimat
        .split(" ")
        .map(kata => kata.slice(0, 2))
        .join("")
        .toUpperCase();
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function wordBreak(str, limit = 10) {
    return str.trim().slice(0, limit) + '....';
}

function removeTandaHubung(string) {
    return string.replace(/[^a-zA-Z0-9]/g, ' ');
}
function toKebabCase(string) {
    return string.replace(/([A-Z])/g, '-$1').toLowerCase();
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function appendObjectToArrayOfObject(objects, keys, opt = {}) {
    const { strict = true, missingValue = null } = opt
    if (!Array.isArray(objects) || !Array.isArray(keys)) {
        throw new TypeError('objects and keys must be an arrays');
    }
    if (objects.length !== keys.length) {
        throw new Error('objects and keys must be equal')
    }
    if (objects.length === 0) return [];

    let tempArray = [];
    let result = [];
    tempArray.push(...objects.map((obj) => Object.values(obj)));
    for (let jindex = 0; jindex < tempArray[0].length; jindex++) {
        const combined = {};
        for (let index = 0; index < keys.length; index++) {
            combined[keys[index]] = tempArray[index][jindex];
        }
        result.push(combined);
    }
    return result;
}
export { wordBreak, phone_number, buatSingkatan, debounce, formatPrice, removeTandaHubung, capitalizeFirstLetter, toKebabCase, appendObjectToArrayOfObject }