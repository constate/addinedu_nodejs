const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let db = null;
let dbUrl = 'mongodb://localhost';
let client = null;

MongoClient.connect(dbUrl, (err, _client) => {
  if (err) {
    console.log('mongodb connect error >>> ', err);
    throw err;
  }

  client = _client
  db = client.db('vehicle');
  console.log('mongodb connect success');

  // let carData = {
  //   name:'SM6', price: 4000, company:'SAMSUNG', year:2019
  // }
  //전체 목록 검색
  // selectAll(db);
  
  //입력하기
  // insert(db, carData);

  //검색하기
  // selectOne(db, '61a823e764c0f24bc9bbabaf'); // k7 검색

  //수정하기
  // update(db, carData, '61a851e7f193796936bfa456');

  //삭제하기
  // deleteDoc(db, '61a851e7f193796936bfa456');
});

const deleteDoc = (db, objId) => {
  if (db) {
    let myquery = { _id: new ObjectId(objId) };
    db.collection("car").deleteOne(myquery, function(err, result) {
      if (err) throw err;
      console.log("1 document deleted", result);
      selectAll(db);
      client.close();
  });
  } else {
    console.log('not connect mongodb');
  }
}

const update = (db, carData, objId) => {
  // console.log({ _id: new ObjectId(objId) }, { set: { ...carData } });
  if (db) {
    let queryObj = { _id: new ObjectId(objId) };
    // let newValue = { $set: carData };
    
    db.collection('car').updateOne(queryObj, { $set: carData }, function(err, res) {
      if (err) throw err;
      console.log("1 document updated", res);
      selectAll(db);
      // client.close();
  });
  } else {
    console.log('not connect mongodb');
  }
}

const insert = (db, carData) => {
  if (db) {
    let carRef = db.collection('car');
    carRef.insertOne(carData, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted", result);
      //결과확인
      selectAll(db);
      client.close();
    });
  } else {
    console.log('not connect mongodb');
  }
}

const selectAll = db => {
  if (db) {
    const carRef = db.collection('car');
    carRef.find({}).toArray((err, arr) => {
      console.log(arr);
      client.close();
    });
  } else {
    console.log('not connect mongodb');
  }
}

const selectOne = (db, objId) => {
  if (db) {
    db.collection('car').findOne({_id: ObjectId(objId)}, (findErr, result) => {
      if (findErr) {
        throw findErr;
      }
      console.log(result.name, result);
      // db 접속 종료
      client.close();
    });
  } else {
    console.log('not connect mongodb');
  }
}
