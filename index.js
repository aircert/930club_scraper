// const rp = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './csv/shows.csv',
  header: [
    {id: 'event', title: 'EVENT'},
    {id: 'description', title: 'DESCRIPTION'},
    {id: 'from_url', title: 'FROM_URL'},
    {id: 'date', title: 'DATE'},
    {id: 'times', title: 'TIMES'},
    {id: 'image', title: 'IMAGE'},
    {id: 'reservation_url', title: 'RESERVATION_URL'}
  ]
});
// offline read because firewall issue
var uri = "https://www.930.com";
$ = cheerio.load(fs.readFileSync('./9_30.html'));

/* 
1. Name of event 
2. Description of the event 
3. Url you are on 
4. Datetime(s) of event 
5. Image url of the event 
6. Reservation link
*/
shows = [];
$('.upcoming-shows').find('#upcoming-listview').find('.list-view-item').each(function(i, show) {
	show = $(show);
	shows.push({
		event: show.find('.headliners a').text(),
		description: show.find('.description a').text(),
		from_url: show.find('a').attr('href'),
		date: show.find('.dates').text(),
		times: show.find('.times').text(),
		image: removeUndefined((removeCurrentDir(show.find('a').find('img').attr('src')))),
		reservation_url: removeUndefined(show.find('.ticket-link .tickets').attr('href'))
	});
});
 
csvWriter.writeRecords(shows)       // returns a promise
  .then(() => {
  	console.log('...Done');
 });

function removeCurrentDir(url) {
	// Only replace the first instance;
	return uri + url.replace('.', ''); 
}

function removeUndefined(str) {
	return str ? str : 'Not Found';
}


//// FIREWALLL SOLUTION

// const options = {
//   uri: `https://www.930.com/randomwords&numbers/../`,
//   transform: function (body) {
//     return cheerio.load(body);
//   }
// };

// rp(options)
//   .then(($) => {
//     console.log($);
//   })
//   .catch((err) => {
//     $ = cheerio.load(err);
//     $('.')
//   });


