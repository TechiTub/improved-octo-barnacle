// Connect to the server
const socket = io();

// DOM elements
const messageList = document.getElementById('message-list');
let ml = localStorage.getItem("chat");
if (ml) {
  messageList.innerHTML = ml;
}
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Get username from the user
let name = localStorage.getItem("name");
if (!name) {
  const username = prompt('Enter your username:');
  localStorage.setItem("name", username)
  socket.emit('newUser', username);
} else {
  socket.emit('newUser', name);
}

// Event listener for form submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the message text
  const message = messageInput.value.trim();

  // Send the message to the server
  if (message !== '') {
    socket.emit('chatMessage', message);
    displayMessage(localStorage.getItem("name"), message, 'sent'); // Display the message immediately with 'sent' class
    messageInput.value = '';
  }
});

// Function to display a message in the chat
function displayMessage(username, message, messageType) {
  const li = document.createElement('li');
  li.textContent = `${username}: ${message}`;
  li.classList.add(messageType); // Add the message type class to the li element
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
}

// Event listener for receiving messages
socket.on('chatMessage', ({ username, message }) => {
  displayMessage(username, message, 'received');
});

// Event listener for user connected
socket.on('userConnected', (username) => {
  // Create a new Date object
var currentDate = new Date();

// Get the current time components
var currentHour = currentDate.getHours();
var currentMinute = currentDate.getMinutes();
var currentSecond = currentDate.getSeconds();

// Format the time as a string (optional)
var currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;
  const li = document.createElement('li');
  li.textContent = `${username} connected at ${currentHour + ":" + currentMinute}`;
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
});

// Event listener for user disconnected
socket.on('userDisconnected', (username) => {
  const li = document.createElement('li');
  // Create a new Date object
var currentDate = new Date();

// Get the current time components
var currentHour = currentDate.getHours();
var currentMinute = currentDate.getMinutes();
var currentSecond = currentDate.getSeconds();

// Format the time as a string (optional)
var currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;
  li.textContent = `${username} disconnected at ${currentHour + ":" + currentMinute}`;
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
});

setInterval(() => {
  if (!localStorage.getItem("name")) {
    sendButton.disabled = true;
  } else if (messageInput.value == "") {
    sendButton.disabled = true;
  } else {
    sendButton.disabled = false;
  }
  localStorage.setItem("chat", messageList.innerHTML);
}, 1000);
