const http = require("http");
const express = require("express");
const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { isSetIterator } = require('util/types');

let db = null;
let dbUrl = 'mongodb://localhost';
let client = null;

// dbConnect 함수는 server가 실행될 때 함께 실행
const dbConnect = () => {
  MongoClient.connect(dbUrl, (err, client) => {
  if (err) {
    console.log('mongodb connect error >>> ', err);
    throw err;
  }
  db = client.db('vehicle');
  console.log('mongodb connect success');
});
}



app.use(express.static(__dirname + "/public"));
// bodyParser 미들웨어 사용 - POST 방식 전송에서 body의 데이터에 접근 가능해 진다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// app.get("/", (req, res) => {
//   res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
//   res.end("<h1>안녕하세요</h1>");
// });

// --------------- db관련 함수 --------------//
// 1. 삭제 기능
const deleteDoc = (db, objId, callback) => {
  if (db) {
    let myquery = { _id: new ObjectId(objId) };
    db.collection("car").deleteOne(myquery, function(err, result) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
  });
  } else {
    console.log('not connect mongodb');
  }
}

// 2. 수정 기능
const update = (db, carData, objId, callback) => {
  // console.log({ _id: new ObjectId(objId) }, { set: { ...carData } });
  if (db) {
    let queryObj = { _id: new ObjectId(objId) };
    let newValue = { $set: carData };
    
    db.collection('car').updateOne(queryObj, newValue, function(err, res) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, res);
  });
  } else {
    console.log('not connect mongodb');
  }
}

// 3. 입력 기능
const insert = (db, carData, callback) => {
  if (db) {
    let carRef = db.collection('car');
    carRef.insertOne(carData, function(err, result) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  } else {
    console.log('not connect mongodb');
  }
}

// 4. 전체 선택 기능 - callback은 익명함수의 참조
const selectAll = (db, callback) => {
  if (db) {
    const carRef = db.collection('car');
    carRef.find({}).toArray((err, arr) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, arr);
    });
  } else {
    console.log('not connect mongodb');
  }
}

// 5. 검색 기능
const selectOne = (db, objId, callback) => {
  if (db) {
    db.collection('car').findOne({_id: ObjectId(objId)}, (findErr, result) => {
      if (findErr) {
        callback(findErr, null)
        return;
      }
      callback(null, result);
    });
  } else {
    console.log('not connect mongodb');
  }
}


// --------------- router 설정 부분 --------------//
router.route("/").get((req, res) => {
  res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
  res.write("<h1>Hello Node.js Server</h1>");
  res.write("<h3>오신것을 환영합니다!</h3>");
  res.write("<p><a href='/main'>메인페이지로 이동</a></p>");
  res.write("<p><a href='/car_list'>카 리스트로 이동</a></p>");
  res.end();
});

router.route("/main").get((req, res) => {
  console.log("GET - /main");
  var objdata = { title: "main page", name: "홍길동" };
  req.app.render("main", objdata, (err, html) => {
    res.end(html);
  });
});

router.route("/car_list").get((req, res) => {
  console.log("GET - /car_list");
  selectAll(db, (err, car_list) => {
    if (err) throw err;
    var carData = { title: "Car List", car_list: car_list };
    req.app.render("car_list", carData, (err, html) => {
      res.end(html);
    });
  });
});

router.route("/car_input").post((req, res) => {
  console.log("GET - /car_input");
  var carData = {
    name: req.body.name,
    price: req.body.price,
    company: req.body.company,
    year: req.body.year,
  };
  insert(db, carData, (err, result) => {
    if (err) throw err;
    res.redirect("/car_list"); // 리스트 페이지로 전환(새로 고침)
  });
});

router.route("/car_detail/:objId").get((req, res) => {
  console.log("GET - /car_detail");
  selectOne(db, req.params.objId, (err, carData) => {
    if (err) throw err;
    console.log('carData => ', carData);
    req.app.render("car_detail", { car: carData }, (err2, html) => {
      if (err2) throw err2;
      res.end(html);
    });
  });
});

router.route("/car_modify/:objId").get((req, res) => {
  console.log("GET - /car_modify/:objId");
  selectOne(db, req.params.objId, (err, carData) => {
    console.log('carData => ', carData);
    if (err) throw err;
    req.app.render("car_modify", { car: carData }, (err2, html) => {
      if (err2) throw err2;
      res.end(html);
    });
  });
});

router.route("/car_modify/").post((req, res) => {
  // 수정된 정보가 반영 되도록 한다.
  var carData = {
    name: req.body.name,
    price: req.body.price,
    company: req.body.company,
    year: req.body.year,
  };
  // console.log(req.body.objId);
  const objId = req.body.objId;

  update(db, carData, req.body.objId, (err, result) => {
    if (err) throw err;
    console.log("======>", objId);
    res.redirect("car_detail/" + objId);
  });
});


// car_delete
router.route("/car_delete/:objId").get((req, res) => {
  console.log("GET - /car_delete/ => " + req.params.objId);
  deleteDoc(db, req.params.objId, (err, result) => {
    if (err) throw err;
    res.redirect('/car_list');
  });
});


// router 패스 설정 맨 아래쪽에 router 미들웨어 등록 명령있어야 함
app.use("/", router);
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("서버 실행 중 : http://localhost:3000");
  // mongodb 커넥트
  dbConnect();
});

// nodemon : 수정 할때마다 매번 서버를 재실행 하지 않아도 된다.
// npm install nodemon --save-dev
// package.json 파일에서 script 부분 수정