"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@sonolus/express");
const core_1 = require("@sonolus/core");
const express_2 = __importDefault(require("express"));
const sonolus = new express_1.Sonolus({ fallbackLocale: "en", address: "https://d4dj.sonolus.gorenganhunter.my.id" });
sonolus.load('./pack');
sonolus.serverInfoHandler = ({ session }) => ({
    title: sonolus.title,
    description: sonolus.description,
    banner: sonolus.banner,
    buttons: [
        { type: "post" },
        { type: "playlist" },
        { type: "level" },
        { type: "skin" },
        { type: "background" },
        { type: "effect" },
        { type: "particle" },
        { type: "engine" },
    ]
});
function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
}
sonolus.level.detailsHandler = ({ itemName }) => {
    const item = sonolus.level.items.find(({ name }) => name === itemName);
    if (!item)
        return undefined;
    const otherDiff = sonolus.level.items.filter(({ name }) => (name.split("-")[1] == itemName.split("-")[1]) && (name !== itemName));
    const sameArtists = sonolus.level.items.filter(({ artists, name }) => (artists.jp == item.artists.jp) && (name !== itemName));
    const sameAuthor = sonolus.level.items.filter(({ author, name }) => (author.jp == item.author.jp) && (name !== itemName));
    const sameRating = sonolus.level.items.filter(({ rating, name }) => (rating == item.rating) && (name !== itemName));
    const sameCategory = sonolus.level.items.filter(({ tags, name }) => (tags[1].title.jp == item.tags[1].title.jp) && (name !== itemName));
    shuffle(sameAuthor);
    shuffle(sameRating);
    shuffle(sameArtists);
    shuffle(sameCategory);
    return { item, description: item.description, hasCommunity: false, sections: [
            {
                title: { en: core_1.Text.OtherDifficulties },
                items: otherDiff
            },
            {
                title: { en: core_1.Text.SameArtists },
                items: sameArtists.slice(0, 5)
            },
            {
                title: { en: core_1.Text.SameCategory },
                items: sameCategory.slice(0, 5)
            },
            {
                title: { en: core_1.Text.SameRating },
                items: sameRating.slice(0, 5)
            },
            {
                title: { en: core_1.Text.SameAuthor },
                items: sameAuthor.slice(0, 5)
            },
        ], leaderboards: [] };
};
const sonolusShare = new express_1.SonolusSpaShare('./public');
const sonolusRedirect = new express_1.SonolusRedirectShare("d4dj.sonolus.gorenganhunter.my.id");
const port = 8080;
const app = (0, express_2.default)();
app.use(sonolus.router);
app.use(sonolusShare.router);
app.use(sonolusRedirect.router);
app.listen(port, () => {
    console.log('Server listening at port', port);
});
