/* LEAVE UNCOMMENTED UNCLESS YOU WANT TO RUN SCRAPER */

// (function(){
//   'use strict';
//   var request = require('request');
//   var cheerio = require('cheerio');
//   var Tag = require('../models/tag.server.model');


//   /* Make an http request to the StackOverflow, retrieve tags from page, and save to database */
//   var scrapeStackOverflowTags = function(url) {
//     request(url, function(error, response, html) {
//       if (!error) {
//         var $ = cheerio.load(html);
//         $('.post-tag').each(function() {
//           Tag.createOrSave($(this).text(), function(tag) {
//             // console.log(tag.get('title'));
//           });
//         });
//       }
//     });
//   };

//   var runScraper = function() {
//     console.log("BEGIN SCRAPING");
//     var count = 4;
//     (function loop() {
//       var rand = Math.round(Math.random() * (5000)) + 7500;

//       setTimeout(function() {
//         scrapeStackOverflowTags('http://stackoverflow.com/tags?page=' + count.toString() + '&tab=popular');

//         console.log(count);
//         count++;
//         if (count <= 150){
//           loop();
//         } else {
//           console.log("COMPLETE!!!!");
//         }
//       }, rand);
//     }());
//   };

//   runScraper();

// })();


