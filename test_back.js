var Crawler = require("crawler");
var redis = require("redis"),
    client=redis.createClient();
var fs = require("fs");
var array = [];
var countPage =1;

client.on("error",function(err){
  console.log("Error"+err);
})




var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{

            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $(".inner>strong").each(function(i,content){
            var obj = {"countPage":"","price":""};
            // console.log('number :' + i)
            // console.log('content :' + $(this).text());


            obj.price = $(this).text();
            obj.countPage=countPage
            // console.log('count'+obj.num)
            // console.log('price'+obj.price)
            array.push(obj);

            console.log(array[i].price)
            console.log('array.length :  '+array.length);
            })
        }
        done();
    }
});


// c.queue("http://land.naver.com/article/divisionInfo.nhn?cortarNo=1168000000&hsehCnt=1000&page=1");
scrapingLoop()
  .then(function() {
    var jsonList=JSON.stringify(array)
  fs.writeFile("like.json",jsonList);

  })





function scrapingPage(){
  return new Promise(function(resolve, reject) {
    c.queue("http://land.naver.com/article/divisionInfo.nhn?cortarNo=1168000000&hsehCnt=1000&page="+countPage)
    resolve();
});
}
function scrapingLoop(){
  return new Promise(function(resolve, reject) {
    scrapingPage()
    .then(function(){
      if(countPage<3){
        console.log('nextPage')
        countPage++;
      scrapingLoop()
      resolve()
      } else{
        resolve();
      }
    })

});
}

// function loopPage(){
// c.queue("http://land.naver.com/article/divisionInfo.nhn?cortarNo=1168000000&hsehCnt=1000&page="+countPage)
// }
