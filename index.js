const axios = require('axios');
const cheerio = require('cheerio');

const records = [];

axios.get('https://axios-http.com/docs/example')
    .then( (response) => {
        return response.data;
    })
    .catch( (error) => {
        console.log(error);
    })
    .then( (html) => {
        const $ = cheerio.load(html);
        $('.aside-container').each((i, el) => {
            let groupName = $(el).find('.group-name').text();
            console.log(groupName);
        });
    });
