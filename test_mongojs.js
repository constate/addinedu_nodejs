// npm install mongojs --save
// npm install mongodb --save
// npm install mongoose -S

// mongojs 모듈 테스트
const mongojs = require('mongojs');

// db 및 컬렉션 지정
const db = mongojs('vehicle', ['car']);

// 컬렉션 검색하기
// nodejs에서 콜백함수의 첫번째 인자는 보통 err이다
db.car.find((err, data) => {
  console.log(data);
  // db 연결 끊기
  db.close();
});