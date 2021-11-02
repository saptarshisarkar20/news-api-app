const express = require("express");
const xss = require("xss");
const newsRouter = express.Router();
const axios = require("axios");
require("dotenv").config();

newsRouter.get("", async (req, res) => {
    try {
        const newsAPI = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.API_KEY}`
        );
        // console.log(newsAPI.data.articles);
        var articles = newsAPI.data.articles;
        let filteredArticle = articles.map((article) => {
            if (article.title != null) {
                article.title = article.title
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }
            if (article.description != null) {
                article.description = article.description
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }
            return {
                url: article.url,
                urlToImage: article.urlToImage,
                title: xss(article.title),
                description: xss(article.description),
            };
        });
        // console.log(filteredArticle);
        res.render("news", { articles: filteredArticle });
    } catch (err) {
        if (err.response) {
            res.render("news", { articles: null });
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if (err.request) {
            res.render("news", { articles: null });
            console.log(err.request);
        } else {
            res.render("news", { articles: null });
            console.error("Error", err.message);
        }
    }
});

newsRouter.post("", async (req, res) => {
    let search = req.body.search;
    try {
        const newsAPI = await axios.get(
            `https://newsapi.org/v2/everything?q=${search}&apiKey=${process.env.API_KEY}`
        );
        var articles = newsAPI.data.articles;
        let filteredArticle = articles.map((article) => {
            if (article.title != null) {
                article.title = article.title
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }
            if (article.description != null) {
                article.description = article.description
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }
            return {
                url: article.url,
                urlToImage: article.urlToImage,
                title: xss(article.title),
                description: xss(article.description),
            };
        });
        // console.log(filteredArticle);
        res.render("news", { articles: filteredArticle });
    } catch (err) {
        if (err.response) {
            res.render("newsSearch", { articles: null });
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if (err.request) {
            res.render("newsSearch", { articles: null });
            console.log(err.request);
        } else {
            res.render("newsSearch", { articles: null });
            console.error("Error", err.message);
        }
    }
});

module.exports = newsRouter;
