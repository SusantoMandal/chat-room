<template src="./home-page.html">
</template>

<script>
// @ is an alias to /src
import { io } from 'socket.io-client';

const Chance = require('chance');

const chance = new Chance();

// const socket = io('http://localhost:3000');
const socket = io('https://global-chat-socket.herokuapp.com/');

export default {
  name: 'Home',
  data() {
    return {
      userName: '',
      messages: [],
      currentMessage: '',
      currentRoom: ''
    };
  },
  methods: {
    displayMessage() {
      if (this.currentMessage !== '') {
        const data = {
          from: 'self',
          message: this.currentMessage
        };
        this.messages.push(data);
        socket.emit('send-message', this.currentMessage, this.userName, this.currentRoom);
        this.currentMessage = '';
      }
    },
    addMessage(message, userName) {
      const data = {
        from: userName,
        message
      };
      this.messages.push(data);
    },
    roomNotification(message) {
      const data = {
        from: 'notification',
        message
      };
      this.messages.push(data);
    },
    joinRoom() {
      if (this.currentRoom !== '') {
        socket.emit('join-room', this.currentRoom, (message) => {
          this.roomNotification(message);
        });
      }
    }
  },
  beforeMount() {
    socket.on('connect', async () => {
      this.roomNotification(`You are connected with id ${socket.id}`);
      this.userName = chance.name();
    });
    socket.on('revieve-message', (message, userName) => {
      this.addMessage(message, userName);
    });
  }
};
</script>

<style lang="scss" src="./home-page.scss">
</style>
