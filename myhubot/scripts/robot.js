var exec = require('child_process').exec;
var stop;
function startChild(){
return new Promise(function(resolve, reject) {
console.log('bit coin 가격')
child = exec('node testCase/alarmBit.js',function(error,stdout,stderr)
{
  console.log('stdout'+stdout);
  console.log('stderr'+stderr);
  resolve(stdout);
  if(error !==null){
    console.log('exec error + errorad');
    reject();
  }

});
});
}

module.exports = function(robot){
  console.log('robot'+robot)
   robot.hear(/naver/, function(msg) {
    console.log('msg');
     return msg.send("https://www.google.co.kr");
});

   robot.hear(/bit/, function(msg){
     startChild().then(function(bitValue){
       console.log('bitvalue : '+bitValue)
       return msg.send(bitValue);
     });

    stop=setInterval(function(){
    startChild().then(function(bitValue){
      console.log('bitvalue : '+bitValue)
      return msg.send(bitValue);
    });

  },1800000)//setInterval
  });

  robot.hear(/서울부동산/,function(msg){
    console.log('msg:'+msg);
    return msg.send("http://112.223.76.76:9098/app/kibana#/dashboard/e01f87f0-653e-11e7-8d92-fd9c5a17d3ec?_g=()&_a=(filters:!(),options:(darkTheme:!f),panels:!((col:1,id:'2679bb60-62ee-11e7-92de-3d9e35cecc62',panelIndex:1,row:1,size_x:6,size_y:3,type:visualization),(col:7,id:a3c78cd0-62eb-11e7-9455-19905ad16e8f,panelIndex:2,row:1,size_x:6,size_y:3,type:visualization),(col:1,id:ed7da630-62ef-11e7-92de-3d9e35cecc62,panelIndex:3,row:4,size_x:6,size_y:3,type:visualization)),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:%EC%84%9C%EC%9A%B8%EB%B6%80%EB%8F%99%EC%82%B0,uiState:(),viewMode:view)")
  })

  robot.hear(/부동산/,function(msg){
    console.log('msg:'+msg);

    return msg.send("서울부동산")
  })

  robot.hear(/bitstop/,function(msg){
    clearInterval(stop);
    msg.send('bitbot 이 멈췄습니다.')
  });
}
