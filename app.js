const http = require("http");
const express = require("express");
const app = express();
const router = express.Router();

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

router.route("/").get((req, res) => {
  res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
  res.write("<h1>Hello Node.js Server</h1>");
  res.write("<h3>오신것을 환영합니다!</h3>");
  res.write("<p>Node와 React를 연동하는 실습</p>");
  res.end();
});

router.route("/main").get((req, res) => {
  console.log("GET - /main");
  var objdata = { title: "main page", name: "홍길동" };
  req.app.render("main", objdata, (err, html) => {
    res.end(html);
  });
});

const car_list = [
  { no: 1, name: "Sonata", price: 2500, company: "HYUNDAI", year: 2020 },
  { no: 2, name: "Grandeur", price: 3500, company: "HYUNDAI", year: 2019 },
  { no: 3, name: "BMW", price: 5500, company: "BMW", year: 2021 },
];
// no의 시퀀스 선언
var noSequence = 4;

router.route("/car_list").get((req, res) => {
  console.log("GET - /car_list");
  var carData = { title: "Car List", car_list: car_list };
  req.app.render("car_list", carData, (err, html) => {
    res.end(html);
  });
});

router.route("/car_input").post((req, res) => {
  console.log("GET - /car_input");
  var carData = {
    no: noSequence++,
    name: req.body.name,
    price: req.body.price,
    company: req.body.company,
    year: req.body.year,
  };
  // 전송된 데이터를 car_list에 저장 해야 한다.
  // car_list페이지로 리다이렉트 해야한다.
  car_list.push(carData);
  res.redirect("/car_list"); // 리스트 페이지로 전환(새로 고침)
});

function findCarData(no) {
  var no = Number(no);
  var carData = null;
  for (var i = 0; i < car_list.length; i++) {
    if (car_list[i].no == no) {
      carData = car_list[i];
      break;
    }
  }
  return carData;
}

function findIndex(no) {
  var no = Number(no);
  var idx = null;
  for (var i = 0; i < car_list.length; i++) {
    if (car_list[i].no == no) {
      idx = i;
      break;
    }
  }
  return idx;
}

router.route("/car_detail/:no").get((req, res) => {
  console.log("GET - /car_detail");
  //res.end("query no => " + req.query.no + " / params no => " + req.params.no);
  // ejs view engine으로 보여지게 하기
  var carData = findCarData(req.params.no);
  req.app.render("car_detail", { car: carData }, (err, html) => {
    res.end(html);
  });
});

router.route("/car_modify/:no").get((req, res) => {
  console.log("GET - /car_modify/:no");
  // car_modify.ejs 페이지로 포워드 되도록 한다.
  var carData = findCarData(req.params.no);
  req.app.render("car_modify", { car: carData }, (err, html) => {
    res.end(html);
  });
});

router.route("/car_modify/").post((req, res) => {
  // 수정된 정보가 반영 되도록 한다.
  var carData = {
    no: req.body.no,
    name: req.body.name,
    price: req.body.price,
    company: req.body.company,
    year: req.body.year,
  };
  var idx = findIndex(req.body.no);
  car_list[idx] = carData;

  // 목록 페이지로 갱신
  //res.redirect("/car_list");
  res.redirect("car_detail/" + req.body.no);
});


// car_delete
router.route("/car_delete/:id").get((req, res) => {
  console.log("GET - /car_delete/ => " + req.params.id);
  // console.log(req.params.id);
  let index = findIndex(req.params.id);
  car_List = car_list.splice(index, 1);
  res.redirect('/car_list');
});


// router 패스 설정 맨 아래쪽에 router 미들웨어 등록 명령있어야 함
app.use("/", router);
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("서버 실행 중 : http://localhost:3000");
});

// nodemon : 수정 할때마다 매번 서버를 재실행 하지 않아도 된다.
// npm install nodemon --save-dev
// package.json 파일에서 script 부분 수정