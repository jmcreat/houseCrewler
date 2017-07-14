var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '192.168.0.103:9200',
    log: 'trace'
});


// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: 1000
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });






//---------------------------
// 1. create 를 하고
client.indices.create({
  index: 'test11'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});
// 2. index 생성

client.index({
  index: 'test11',
  id: '1',
  type: 'constituencies',
  body: {
    "ConstituencyName": "Ipswich",
    "ConstituencyID": "E14000761",
    "ConstituencyType": "Borough",
    "Electorate": 111,
    "ValidVotes": 111,
  }
},function(err,resp,status) {
    console.log(resp);
});
// 3 json type
var bodyJson = {
  "ConstituencyName": "abc",
  "Electorate": 111,
  "ValidVotes": 111,
}
client.index({
  index: 'test11',
  id: '2',
  type: 'constituencies',
  body: bodyJson
},function(err,resp,status) {
    console.log(resp);
});


//데이터 삭제

//curl -XDELETE 192.168.0.103:9200/test11
//---------------------------


            // client.bulk({
            //   body: [
            //     // action description
            //     { index:  'myindex'},
            //      // the document to index
            //     { title: 'foo' }
            //     // action description
            //     // { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
            //     // // the document to update
            //     // { doc: { title: 'foo' } }
            //     // action description
            //     // { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
            //     // no document needed for this delete
            //   ]
            // }, function (err, resp) {
            //   // ...
            // });

            //
            //
            // client.count({
            //   index: 'myindex',
            //   body: {
            //     query: {
            //       filtered: {
            //         filter: {
            //           terms: {
            //             foo: ['bar']
            //           }
            //         }
            //       }
            //     }
            //   }
            // }, function (err, response) {
            //   // ...
            // });


            //
            // client.explain({
            //   index: 'myindex1',
            //   type: 'mytype',
            //   id: '1',
            //   body: {
            //     query: {
            //       match: { title: 'test' }
            //     }
            //   }
            // }, function (error, response) {
            //   // ...
            // });

            // client.create({
            //   index: 'myindex',
            //   type: 'mytype11',
            //   id: '1',
            //   body: {
            //     title: 'Test 1',
            //     tags: ['y', 'z'],
            //     published: true,
            //     published_at: '2013-01-01',
            //     counter: 1
            //   }
            // }, function (error, response) {
            //   // ...
            //   console.log(response);
            //   console.log(error);
            // });

            //
            // client.deleteByQuery({
            //   index: 'myindex',
            //   q: 'test'
            // }, function (error, response) {
            //   // ...
            // });

            // client.delete({
            //   index: 'myindex',
            //   type: 'mytype',
            //   id: '1'
            // }, function (error, response) {
            //   // ...
            // });

            // client.search({
            //   index: 'myindex',
            //   body: {
            //     query: {
            //       match: {
            //         title: 'test'
            //       }
            //     },
            //     facets: {
            //       tags: {
            //         terms: {
            //           field: 'tags'
            //         }
            //       }
            //     }
            //   }
            // }, function (error, response) {
            //   // ...
            // });

            // client.explain({
            //   // the document to test
            //   index: 'myindex',
            //   type: 'mytype',
            //   id: '1',
            //
            //   // the query to score it against
            //   q: 'field:value'
            // }, function (error, response) {
            //   // ...
            // });



            // client.count(function (error, response, status) {
            //   // check for and handle error
            //   var count = response.count;
            // });
            // client.get({
            //   index: 'myindex1',
            //   type: 'mytype',
            //   id: 1
            // }, function (error, response) {
            //   // ...
            // });

            //


            //
            // client.count({
            //   index: 'myindex',
            //   body: {
            //     query: {
            //       filtered: {
            //         filter: {
            //           terms: {
            //             foo: ['bar']
            //           }
            //         }
            //       }
            //     }
            //   }
            // }, function (err, response) {
            //   // ...
            // });
