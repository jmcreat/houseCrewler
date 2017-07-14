var Crawler = require("crawler");
var elasticsearch = require("elasticsearch");
var fs = require("fs");
var bunyan = require("bunyan")
var countPage = 1;
var n = 0;
var count =0;
// var client = new elasticsearch.Client({
//     host: '192.168.0.103:9200'
//         // ,log: 'trace'
// });
var log = bunyan.createLogger({
  name: 'houseInfo',
  level: 'debug'

})

//비동기 작업
var readFile = fs.readFileSync('./seoul.json', 'utf8')
console.log(readFile);
var jsonFile = JSON.parse(readFile);
console.log('jsonfile length :' + jsonFile.length);


var c = new Crawler({
  rateLimit:1300,
  maxConnections: 10,
  time:true,
  // This will be called for each crawlzed page
  callback: function(error, res, done) {

    var start = new Date()
    var exceptionCheck;
    var totalCount = 0;
    if (error) {
      console.log(error);
    } else {
      var uri = res.options.uri
      var key = res.options.key
      var area = res.options.param
      var page = res.options.page
      var n = res.options.n
      var $ = res.$;

      var client = new elasticsearch.Client({
          host: '192.168.0.103:9200'
              // ,log: 'trace'
      });
      $(".inner>strong").each(function(i, content) {
// console.log('callback');
        ++totalCount;
        exceptionCheck = $(this).parent().parent().parent().find('.exception_none').text().trim();
        if (exceptionCheck != "등록된 매물이 없습니다.") {
          var date = new Date();
          price = $(this).text();
          if (price == null) {
            console.log('no price')
            return true;
          } else if (price == "확인매물") {
            return true;
          } else {
            var key = $(this).parent().parent().parent().find('.sale_title').attr('class') //
            var keyIndex = key.indexOf('i:') + 2;
            var value = key.substring(keyIndex, keyIndex + 10)
            // console.log('number :'+key.indexOf('i:')+' :매물번호111'+key)
            // console.log('key : '+ key.substring(keyIndex,keyIndex+10));
            var phone = $(this).parent().parent().parent().find('.tel').text()
            var aptName = $(this).parent().parent().parent().find('.sale_title').text()
            if (price.indexOf("/") > 0) {
              // console.log('월세');
              return true;
              price = price.substring(0, price.indexOf("/"))
            }
            price = parseInt(price.replace(',', ''))
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            var d = date.getDate()

            client.index({
              index: "test11",

              // id: area+'_'+phone+'_' +i+'_'+ page+'_'+value,
              id: value + '_' + y + m + d,
              type: "price",
              body: {
                "page": page,
                "price": price,
                "aptName": aptName,
                "area": area,
                "date": date,
                "phone": phone,
                "매물번호": value
              },
            }, function(err, resp, status) {
              console.log(resp);
              //console.log('status : '+status)
              //console.log('err : '+ err)
              //console.log('count'+ count++)

              var end = new Date()
              console.log((end-start)+'ms')
              //console.log(uri)

            });
          }
        } else {
          //console.log(area + ' : crewling 종료')
          //console.log('개수 : ' + totalCount+': 페이지수 : ' + page)
        }
    })
//페이지 비동기 작업
    }
    done();
    if (exceptionCheck != "등록된 매물이 없습니다.") {
      scrapingLoop(++page, key, area);
    }
  }
});
//크롤러 구 갯수만큼 생성
for (var i = 0; i < jsonFile.length; i++) {
  //비동기 작업
    scrapingLoop(countPage, jsonFile[i].key, jsonFile[i].name)

}
//각각의 크롤러가
function scrapingLoop(pagenum, key, name) {
  c.queue({
    uri: "http://land.naver.com/article/divisionInfo.nhn?cortarNo=" + key + "&hsehCnt=1000&page=" + pagenum,
    key: key,
    param: name,
    page: pagenum
  })
}
//curl -XDELETE 192.168.0.103:9200/test11
