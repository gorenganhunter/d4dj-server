"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIndexes = exports.randomizeItems = exports.toOptionValues = void 0;
const express_1 = require("@sonolus/express");
const core_1 = require("@sonolus/core");
const express_2 = __importDefault(require("express"));
const object_1 = require("./object");
// const artists: any[] = [];
// const category: any[] = [];
// const diff = [Text.Easy, Text.Normal, Text.Hard, Text.Expert];
// db.levels.forEach((level) => {
//     if (!artists.find(({ jp }) => jp === level.artists.jp))
//         artists.push(level.artists);
//     if (!category.find(({ jp }) => jp === level.tags[1].title.jp))
//         category.push(level.tags[1].title);
// });
// (function () {
//   if (typeof Object.defineProperty === "function") {
//     try {
//       Object.defineProperty(Array.prototype, "sortBy", { value: sb });
//     } catch (e) {}
//   }
//   if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;
//   function sb(f) {
//     for (var i = this.length; i; ) {
//       var o = this[--i];
//       this[i] = [].concat(f.call(o, o, i), o);
//     }
//     this.sort(function (a, b) {
//       for (var i = 0, len = a.length; i < len; ++i) {
//         if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
//       }
//       return 0;
//     });
//     for (var i = this.length; i; ) {
//       this[--i] = this[i][this[i].length - 1];
//     }
//     return this;
//   }
// })();
const toOptionValues = (objects) => Object.values(objects).map((object) => ({
    title: object.title,
    def: true,
}));
exports.toOptionValues = toOptionValues;
const difficulties = ["easy", "normal", "hard", "expert"];
const diffs = (0, object_1.mapValues)({
    easy: { en: core_1.Text.Easy },
    normal: { en: core_1.Text.Normal },
    hard: { en: core_1.Text.Hard },
    expert: { en: core_1.Text.Expert },
}, (_, title, index) => ({ title, index }));
const sonolus = new express_1.Sonolus({
    address: "https://d4dj.sonolus.gorenganhunter.my.id",
    fallbackLocale: "en",
    level: {
        searches: {
            advanced: {
                title: { en: core_1.Text.Advanced },
                icon: core_1.Icon.Advanced,
                requireConfirmation: false,
                options: {
                    keywords: {
                        name: { en: core_1.Text.Keywords },
                        required: false,
                        type: "text",
                        placeholder: { en: core_1.Text.KeywordsPlaceholder },
                        def: "",
                        limit: 0,
                        shortcuts: [],
                    },
                    artists: {
                        name: { en: core_1.Text.Artists },
                        required: false,
                        type: "multi",
                        values: [],
                    },
                    categories: {
                        name: { en: core_1.Text.Category },
                        required: false,
                        type: "multi",
                        values: [],
                    },
                    difficulties: {
                        name: { en: core_1.Text.Difficulty },
                        required: false,
                        type: "multi",
                        values: (0, exports.toOptionValues)(diffs),
                    },
                    minRating: {
                        name: { en: core_1.Text.RatingMinimum },
                        required: false,
                        type: "slider",
                        def: 0,
                        min: 0,
                        max: 0,
                        step: 0.5,
                    },
                    maxRating: {
                        name: { en: core_1.Text.RatingMaximum },
                        required: false,
                        type: "slider",
                        def: 0,
                        min: 0,
                        max: 0,
                        step: 0.5,
                    },
                    random: {
                        name: { en: core_1.Text.Random },
                        required: false,
                        type: "toggle",
                        def: false,
                    },
                },
            },
        },
    },
});
sonolus.load("./pack");
const playlists = new Map();
for (const level of sonolus.level.items) {
    const playlist = playlists.get(level.meta.music.id);
    if (playlist) {
        playlist.levels.push(level.name);
    }
    else {
        playlists.set(level.meta.music.id, {
            name: `d4dj-${level.name.split("-")[1]}`,
            version: 1,
            title: level.title,
            subtitle: level.artists,
            author: level.author,
            tags: level.tags.slice(1),
            description: level.description,
            levels: [level.name],
            meta: {
                music: {
                    id: level.meta.music.id,
                    publishedAt: level.meta.music.publishedAt,
                    artist: level.meta.music.artist,
                    category: level.meta.music.category,
                    order: level.meta.music.order
                },
            },
        });
    }
}
sonolus.playlist.items = [...playlists.values()];
let minRating = Number.POSITIVE_INFINITY;
let maxRating = Number.NEGATIVE_INFINITY;
for (const level of sonolus.level.items) {
    minRating = Math.min(minRating, level.rating);
    maxRating = Math.max(maxRating, level.rating);
}
sonolus.level.searches.advanced.options.minRating.min = minRating;
sonolus.level.searches.advanced.options.minRating.def = minRating;
sonolus.level.searches.advanced.options.minRating.max = maxRating;
sonolus.level.searches.advanced.options.maxRating.min = minRating;
sonolus.level.searches.advanced.options.maxRating.def = maxRating;
sonolus.level.searches.advanced.options.maxRating.max = maxRating;
let artists = [];
let category = [
    {
        ja: "オリジナル",
        en: "Original"
    },
    {
        ja: "カバー",
        en: "Cover"
    },
    {
        ja: "カバー",
        en: "Game"
    },
    {
        ja: "インスト",
        en: "Instrumental"
    },
    {
        ja: "原曲",
        en: "Collabo"
    }
];
sonolus.level.items.forEach((level) => {
    if (!artists.find(({ ja, en }) => ja === level.artists.ja && en === level.artists.en))
        artists.push(level.artists);
    // if (!category.find(({ ja, en }: { ja: String, en: String }) => ja === level.tags[1].title.ja && en === level.tags[1].title.en))
    //     category.push(level.tags[1].title);
});
// console.log(artists)
// console.log(category)
artists = (0, object_1.mapValues)(Object.assign({}, artists), (_, title, index) => ({ title, index }));
category = (0, object_1.mapValues)(Object.assign({}, category), (_, title, index) => ({ title, index }));
console.log(artists);
// console.log(category)
sonolus.level.searches.advanced.options.artists.values = (0, exports.toOptionValues)(artists);
sonolus.level.searches.advanced.options.categories.values = (0, exports.toOptionValues)(category);
// sonolus.authenticateHandler = (ctx) => {
//     return {
//         session: ctx.session,
//         expiration: 1
//     }
// }
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
        { type: "configuration" },
    ],
    configuration: {
        options: [],
    },
});
const randomize = (items, count) => {
    const pool = [...items];
    const result = [];
    while (pool.length && result.length < count) {
        const index = Math.floor(Math.random() * pool.length);
        result.push(...pool.splice(index, 1));
    }
    return result;
};
const randomizeItems = (items) => {
    if (!items.length)
        return {
            pageCount: 0,
            items: [],
        };
    return {
        pageCount: 1,
        items: randomize(items, 20),
    };
};
exports.randomizeItems = randomizeItems;
function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}
function sort(arr) {
    return arr.sort((a, b) => b.meta.music.order - a.meta.music.order ||
        difficulties.findIndex((diff) => diff === b.name.split("-")[2]) -
            difficulties.findIndex((diff) => diff === a.name.split("-")[2]));
}
function highest(arr) {
    return arr.filter((lvl) => {
        const diff = difficulties.findIndex((name) => lvl.name.split("-")[2] === name);
        if (diff === 3)
            return true;
        for (let i = diff + 1; i < 4; i++) {
            if (arr.find((obj) => obj.name ===
                lvl.name.replace(lvl.name.split("-")[2], difficulties[i])))
                return false;
        }
        return true;
    });
}
let sorted = sort(sonolus.level.items);
let high = highest(sorted);
const toIndexes = (values) => values
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => value)
    .map(({ index }) => index);
exports.toIndexes = toIndexes;
function getDiff(name) {
    const d = name.split("-")[2];
    return d === "easy" ? 1 : d === "normal" ? 2 : d === "hard" ? 3 : d === "expert" ? 4 : 0;
}
sonolus.level.listHandler = ({ search: { type, options }, page }) => {
    if (type === 'quick')
        return Object.assign(Object.assign({}, (0, express_1.paginateItems)((0, express_1.filterLevels)(sonolus.level.items, options.keywords), page)), { searches: sonolus.level.searches });
    // console.log(options)
    const characterIndexes = (0, exports.toIndexes)(options.artists).map(i => artists[i].title);
    const categoryIndexes = (0, exports.toIndexes)(options.categories).map(i => i + 1);
    const difficultyIndexes = (0, exports.toIndexes)(options.difficulties).map(i => i + 1);
    // console.log(characterIndexes, categoryIndexes, difficultyIndexes)
    const items = (0, express_1.filterLevels)(sonolus.level.items.filter(({ name, rating, meta, artists }) => (characterIndexes.filter(({ ja, en }) => artists.ja === ja || artists.en === en).length > 0) &&
        categoryIndexes.includes(meta.music.category) &&
        difficultyIndexes.includes(getDiff(name)) &&
        rating >= options.minRating &&
        rating <= options.maxRating), options.keywords);
    return Object.assign(Object.assign({}, (options.random ? (0, exports.randomizeItems)(items) : (0, express_1.paginateItems)(items, page))), { searches: sonolus.level.searches });
};
sonolus.level.detailsHandler = ({ itemName }) => {
    const item = sonolus.level.items.find(({ name }) => name === itemName);
    if (!item)
        return 404;
    const otherDiff = sonolus.level.items.filter(({ name }) => name.split("-")[1] == itemName.split("-")[1] && name !== itemName);
    const sameArtists = sonolus.level.items.filter(({ artists, name }) => artists.ja === item.artists.ja &&
        name !== itemName &&
        name.split("-")[2] === itemName.split("-")[2]);
    const sameAuthor = sonolus.level.items.filter(({ author, name }) => author.ja === item.author.ja &&
        name !== itemName &&
        name.split("-")[2] === itemName.split("-")[2]);
    const sameRating = sonolus.level.items.filter(({ rating, name }) => rating === item.rating && name !== itemName);
    const sameCategory = sonolus.level.items.filter(({ tags, name }) => tags[1].title.ja === item.tags[1].title.ja &&
        name !== itemName &&
        name.split("-")[2] === itemName.split("-")[2]);
    shuffle(sameAuthor);
    shuffle(sameRating);
    shuffle(sameArtists);
    shuffle(sameCategory);
    return {
        item,
        description: item.description,
        hasCommunity: false,
        sections: [
            {
                title: { en: core_1.Text.OtherDifficulties },
                items: otherDiff,
                itemType: "level",
            },
            {
                title: { en: core_1.Text.SameArtists },
                items: sameArtists.slice(0, 5),
                itemType: "level",
            },
            {
                title: { en: core_1.Text.SameCategory },
                items: sameCategory.slice(0, 5),
                itemType: "level",
            },
            {
                title: { en: core_1.Text.SameRating },
                items: sameRating.slice(0, 5),
                itemType: "level",
            },
            {
                title: { en: core_1.Text.SameAuthor },
                items: sameAuthor.slice(0, 5),
                itemType: "level",
            },
        ],
        leaderboards: [],
        actions: [],
    };
};
sonolus.level.infoHandler = (ctx) => {
    const random = [...high];
    shuffle(random);
    return {
        sections: [
            {
                title: { en: core_1.Text.Random },
                icon: core_1.Icon.Shuffle,
                items: random.slice(0, 5),
                itemType: "level",
            },
            {
                title: { en: core_1.Text.Newest },
                icon: core_1.Icon.Level,
                items: high.slice(0, 5),
                itemType: "level",
            },
        ],
        searches: sonolus.level.searches,
        banner: sonolus.banner,
    };
};
const sonolusShare = new express_1.SonolusSpaShare("./public");
const sonolusRedirect = new express_1.SonolusRedirectShare("d4dj.sonolus.gorenganhunter.my.id");
const port = 8080;
const app = (0, express_2.default)();
// app.use((req, res, next) => {
//     console.log(req.url)
//     next()
// })
app.use(sonolus.router);
app.use(sonolusShare.router);
app.use(sonolusRedirect.router);
app.listen(port, () => {
    console.log("Server listening at port", port);
});
