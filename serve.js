// contoller.js and garage.js
const mqtt = require('mqtt');
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Sockets
const io = require('socket.io')(http);
io.listen('8081');

// MQTT
const client = mqtt.connect('mqtt://192.168.0.53');
client.on('connect', () => {
  client.subscribe('/casa/living/temperature')
})

client.on('message', (topic, message) => {
  console.log('topic', topic);
  console.log('message', message.toString());

  if (topic === '/casa/living/temperature') {
    console.log(`Distance: ${message}`);

    io.emit('distance', message.toString(), 1, 2, 'abc');
    connected = (message.toString() === 'true');
  }
});

// Express
app.get('/', (req, res) => {
  res.send(`Distance: ${currentDistance}`);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('distance', 123);
  socket.on('buzzer', (topic, message) => {
    console.log('*********** BUZZER ***********')
    console.log('topic', topic);
    console.log('message', message);
    if (topic === 'ON') {
      console.log('Buzzer ON')
      client.publish('/casa/living/buzzer', 'ON');
    } else if (topic === 'OFF') {
      console.log('Buzzer OFF')
      client.publish('/casa/living/buzzer', 'OFF');
    }
  });
});
