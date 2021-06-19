const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const samples = {
  compName: '제 99회 전국 라인트레이서 로봇 경연 대회',
  compEvents: ['freshman', 'expert-dc', 'expert-step', 'senior'],
  compDate: {
    registerStart: '2021-06-01T09:00:00',
    registerEnd: '2021-06-30T18:00:00',
    compStart: '2021-07-12T09:00:00',
    compEnd: '2021-07-12T18:00:00',
  },
  participantLimit: 100,
  participants: [
    {
      name: '홍길동',
      email:'email1@e.mail',
      group: '한국대학교 로봇 동아리',
      robotName: '내가일등',
      cpu: 'STM32F407IG',
      ram: 'built-in',
      rom: 'built-in',
      motor: 'KH42JM2-901',
      motorDriver: 'SLA7026M',
      adc: 'built-in',
      sensor: 'IR 8',
      event: 'freshman',
      order: 20,
      comment: '열심히 하겠습니다!',
    },
    {
      name: '홍길순',
      email:'email2@e.mail',
      group: '한국대학교 마이크로 로봇 동아리',
      robotName: '제일빨라',
      cpu: 'ATmega128',
      ram: 'built-in',
      rom: 'built-in',
      motor: 'KH42JM2-901',
      motorDriver: 'SLA7033',
      adc: 'built-in',
      sensor: 'IR 8',
      event: 'freshman',
      order: 10,
      comment: '꼭 상을 타겠습니다!',
    },
    {
      name: '아무개',
      email:'email3@e.mail',
      group: '아무대학교 밴드부',
      robotName: 'Muse',
      cpu: 'STM32F407IG',
      ram: 'built-in',
      rom: 'built-in',
      motor: 'RE25',
      motorDriver: 'LMD18200',
      adc: 'built-in',
      sensor: 'IR 16',
      event: 'expert',
      order: 60,
      comment: 'Time is running out',
    },
  ],
};

// http://guswnsxodlf.github.io/enable-CORS-on-express
// app.use(cors);
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/data', function (req, res) {
  res.json(samples);
});

server.listen(8000, function () {
  console.log('express server listening on port ' + server.address().port);
});