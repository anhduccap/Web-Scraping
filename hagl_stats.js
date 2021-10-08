const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    header: [
        {id: 'index', title: 'INDEX'},
        {id: 'name', title: 'NAME'},
        {id: 'number', title: 'NUMBER'},
        {id: 'height', title: 'HEIGHT'},
        {id: 'weight', title: 'WEIGHT'},
        {id: 'position', title: 'POSITION'},
        {id: 'dob', title: 'DOB'},
        {id: 'goals', title: 'GOALS'},
    ],
    path: 'hagl.csv'
});

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const list = [];

axios.get('https://vpf.vn/team/hoang-anh-gia-lai/', {httpsAgent})
    .then( (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('.table.table-striped.cansorttbl tbody tr').each((i, el) => {
            let name = $(el).find('.js_div_particName a').text().trim();
            let number = $(el).find('td:nth-child(2)').text().replace(/\s/g, ''); //remove spaces
            let height = $(el).find('td:nth-child(3)').text().replace(/\s/g, '');
            let weight = $(el).find('td:nth-child(4)').text().replace(/\s/g, '');
            let position = $(el).find('td:nth-child(5)').text().trim(); 
            //trim() removes whitespace from the beginning and end of strings... including newlines.
            let dob = $(el).find('td:nth-child(6)').text().trim();
            let goals = $(el).find('td:nth-child(8)').text().trim();
            // console.log(`${name},${number},${height},${weight},${position},${dob},${goals}`);
            let data = {
                index: '',
                name: name, 
                number: number,
                height: height,
                weight: weight,
                position: position,
                dob: dob,
                goals: goals,
            };
            list.push(data);
        });
        let index = 1;
        const records = list.filter(item => {
            if(item.number !== ''){
                item.index = index;
                index++;
                return item;
            }
        });
        csvWriter.writeRecords(records)
            .then(() => {
                console.log('...Done');
            }); 
    })
    .catch( (error) => {
        console.log(error);
    });