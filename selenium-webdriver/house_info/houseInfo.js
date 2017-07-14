var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var inter;
var b = 2;
var fs = require('fs');
var num = 1;
var driver = new webdriver.Builder()
    .forBrowser('chrome').build(); //forBrowser 로 브라우저 설정후 Build
var util = require('util');
var path = 1168000000;//강남구
//

page_loop(path)
    .then(function() {
        console.log('process end');
        driver.quit();
    })

.catch(function(e) {
    driver.quit();
    console.error('e =' + e);
    console.log('false');

});



function page_loop(path) {
    return new Promise(function(resolve, reject) {
        console.log(path)
        driver.get('http://land.naver.com/article/divisionInfo.nhn?cortarNo=' + path + '&hsehCnt=1000&page=' + num++);
        if (num < 300) {

            driver.findElement(By.xpath("//tbody")).getText()
                .then(function(list) {
                    var jsonList = JSON.stringify(list);
                    console.log('1 : ' + jsonList)
                    if (num == 1) {
                        console.log('2');
                        fs.writeFile('test.json', jsonList);
                    } else {
                        fs.appendFile('test.json', jsonList);
                        console.log('3')
                        console.log('list : ' + list);
                        if (list === "등록된 매물이 없습니다.") {

                          console.log('프로세스 종료');
                          driver.quit();
                        }
                    }

                    page_loop(path);
                })
        } else {
            resolve();
        }
    });
}

function check_title() {
    var promise = new Promise(function(resolve, reject) {
        driver.getTitle().then(function(title) {
            console.log('title = ' + title);
            resolve();
        }, function(e) {
            reject();
        })
    });
    return promise;
}
