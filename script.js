const username = localStorage.getItem('username') || 'Guest';
const isAdmin = localStorage.getItem('isAdmin') === 'true';
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const announcementDiv = document.getElementById('announcement');

if (isAdmin && document.getElementById('adminPanel')) {
  document.getElementById('adminPanel').style.display = 'block';
}

const ws = new WebSocket('ws://' + location.hostname + ':3000');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'message') {
    const msg = document.createElement('div');
    msg.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } else if (data.type === 'announcement') {
    announcementDiv.textContent = data.text;
    announcementDiv.classList.remove('hidden');
  }
};

function sendMessage() {
  const text = input.value.trim();
  if (text) {
    ws.send(JSON.stringify({ type: 'message', user: username, text }));
    input.value = '';
  }
}

function postAnnouncement() {
  const text = document.getElementById('adminMessage').value;
  if (text) {
    ws.send(JSON.stringify({ type: 'announcement', text }));
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}