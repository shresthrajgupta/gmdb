function importAll(r) {
    let images = {};
    r.keys().map((item, index) => images[item.replace('./', '')] = r(item));
    return images;
}

const covers = importAll(require.context('../assets/covers', false, /\.(png|jpe?g|webp|svg)$/));

export default covers;


