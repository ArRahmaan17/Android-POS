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

export { phone_number, buatSingkatan, debounce, formatPrice }