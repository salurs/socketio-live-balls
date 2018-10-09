const colors = ['blue', 'green', 'red'];

const rondomColor = () =>{
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = rondomColor;