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
var list=[];
//비동기 작업
var readFile = fs.readFileSync('./seoul.json', 'utf8')
console.log(readFile);
var jsonFile = JSON.parse(readFile);
console.log('jsonfile length :' + jsonFile.length);

//page crawler
var c = new Crawler({
  // rateLimit:1300,
  maxConnections: 10,
  time:true,
  // This will be called for each crawlzed page
  callback: function(error, res, done) {
    var obj = new Object();
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
      // var i = res.options.i
      var $ = res.$;

      //해당 페이지 읽어와서 필요한 데이터 반복으로 가져오기
      $(".inner>strong").each(function(i, content) {
        ++totalCount;
// console.log('callback');
        obj.exceptionCheck = $(this).parent().parent().parent().find('.exception_none').text().trim();
        if (obj.exceptionCheck != "등록된 매물이 없습니다.") {
          var date = new Date();
          var price = $(this).text();
          if (price == null) {
            console.log('no price')
            return true;
          } else if (price == "확인매물") {
            return true;
          } else {

            obj.key = $(this).parent().parent().parent().find('.sale_title').attr('class') //
            obj.keyIndex = obj.key.indexOf('i:') + 2;
            obj.value = obj.key.substring(obj.keyIndex, obj.keyIndex + 10)

            obj.area=area;

            obj.phone = $(this).parent().parent().parent().find('.tel').text()
            obj.aptName = $(this).parent().parent().parent().find('.sale_title').text()
            if (price.indexOf("/") > 0) {
              // console.log('월세');
              return true;
              price = obj.price.substring(0, price.indexOf("/"))
            }
            obj.price = parseInt(price.replace(',', ''))
            // var y = date.getFullYear()
            // var m = date.getMonth() + 1
            // var d = date.getDate()


          sendElastic(obj)
            }
        } else {
          //console.log(area + ' : crewling 종료')
          //console.log('개수 : ' + totalCount+': 페이지수 : ' + page)

        }
      })
//해당 페이지 데이터를 다 긁어오면 다음 페이지  crewling
setTimeout(function(){
if (exceptionCheck != "등록된 매물이 없습니다.") {
  console.log(exceptionCheck)
  console.log(page+'!!!!!!!!!!!!')
  scrapingLoop(++page, key, area)
}
},30000)
    }
    done();
  }
});
//크롤러 구 갯수만큼 생성


//비동기 작업

//대한보건


//start scraping
function arealoop(jsonFile,num){

if(num<jsonFile.length){

  scrapingLoop(countPage, jsonFile[num].key, jsonFile[num].name)
log.debug('name : '+jsonFile[num].name)
  arealoop(jsonFile,++num)
}else{
  log.debug('area loop  end')
}
}
arealoop(jsonFile,0)




/////send elasticsearch
function sendElastic(obj){

  var client = new elasticsearch.Client({
      host: '192.168.0.103:9200'
          // ,log: 'trace'
  });

var start = new Date()
  var y = start.getFullYear()
  var m = start.getMonth() + 1
  var d = start.getDate()

  client.index({
    index: "test11",

    // id: area+'_'+phone+'_' +i+'_'+ page+'_'+value,
    id: obj.value + '_' + y + m + d,
    type: "price",
    body: {
      "page": obj.page,
      "price": obj.price,
      "aptName": obj.aptName,
      "area": obj.area,
      "date": start,
      "phone": obj.phone,
      "매물번호": obj.value
    },
  }, function(err, resp, status) {
    console.log(resp);
    //console.log('status : '+status)
    //console.log('err : '+ err)
    //console.log('count'+ count++)

    var end = new Date()
    console.log((end-start)+'ms')



  });


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
