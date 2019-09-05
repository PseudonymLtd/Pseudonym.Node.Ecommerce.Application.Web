module.exports.Parse = (int) => {
    return int.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};