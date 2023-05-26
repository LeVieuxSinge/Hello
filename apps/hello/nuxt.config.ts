import vuetify from "vite-plugin-vuetify";
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
    app: {
        baseURL: "/Hello/",

        head: {
            title: "Hello",
            htmlAttrs: {
                lang: "en"
            },
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { hid: "description", name: "description", content: "" }
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
            ]
        },
    },

    build: {
        transpile: [
            "vuetify",
        ],
    },

    css: [
        resolve("./assets/scss/reset.scss"),
        "vuetify/lib/styles/main.sass",
        "@mdi/font/css/materialdesignicons.min.css",
    ],

    hooks: {
        "vite:extendConfig": (config) => {
            config.plugins?.push(
                vuetify({
                    styles: { configFile: resolve("./assets/vuetify/settings.scss") },
                })
            );
            config.css = config.css || {};
            config.css.preprocessorOptions = config.css.preprocessorOptions || {};
            config.css.preprocessorOptions.scss = config.css.preprocessorOptions.scss || {};
            config.css.preprocessorOptions.scss.additionalData = `@import "${resolve("./assets/scss/variables.scss")}";`;
        },
    },

    modules: [
        "@hypernym/nuxt-anime",
    ],

    sourcemap: {
        server: false,
        client: false,
    },

    vite: {
        define: {
            "process.env.DEBUG": false,
        },
    },
});
