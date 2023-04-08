const chatForm = document.getElementById('inputForm');
const chatMessages = document.querySelector('.chatTexts');
const usersInChat = document.getElementById('onlineUsers');

//arrays for randomizing the usernames
const firstNameArray = ['Joe', 'Kyle', 'Ruben', 'Vincent', 'Joao', 'David', 'Bernardo', 'Kevin', 'Phil', 'Sergio', 'Raheem'];
const secondNameArray = ['Hart', 'Walker', 'Dias', 'Kompany', 'Cancelo', 'Silva', 'Fernandinho', 'DeBruyne', 'Foden', 'Aguero', 'Sterling'];
const numberArray = ['1', '2', '3', '4', '27', '21', '20', '25', '17', '47', '10', '7'];

// Get username and color from URL
var { username, color } = Qs.parse(location.search, {
    //this will ignore all the query details and just get the username and color
    ignoreQueryPrefix: true,
});
//check if the username was ' '
changeUsername(username);

//set up socket
const socket = io();

//join chatroom with username and color details
socket.emit('joinRoom', { username, color });

//get users
socket.on('chatUsers', ({ users }) => {
    //call function to show all users
    outputUsers(users);
})

//show message sent as some other user
socket.on('otherMessage', message => {
    outputOtherMessage(message);
    //scrollDown
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
//show message sent as your own user
socket.on('yourMessage', message => {
    //check if they tried to change the message
    if (message.text.includes('<') && message.text.includes('>') && (message.text.indexOf('<') + 1 < message.text.indexOf('>'))) {
        if (message.text.includes("newusername")) {
            var newUsername = message.text.slice(message.text.indexOf('<') + 1, message.text.indexOf('>'));
            changeUsername(newUsername);
        }
        else if (message.text.includes("newcolor")) {
            console.log(color);
        }
    }
    //output the message using the funtion
    else {
        outputYourMessage(message);
        //scrollDown
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

//message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    //emitting message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



//FUNCTIONS
//output your message to dom
function outputYourMessage(message) {
    const div = document.createElement('div');
    div.classList.add('yourMessage');
    div.innerHTML =
        `<p id="yourName" style="color:rgb(${color});" ><b>${message.username}</b></p>
         <p id="yourMessageBox" style="background-color:rgb(${color});"><b>${message.text}</b></p>
         <p id="yourMessageTime">${message.time}</p>`

    document.querySelector('.chatTexts').appendChild(div);
}

//output other message to dom
function outputOtherMessage(message) {
    const div = document.createElement('div');
    div.classList.add('otherMessage');
    div.innerHTML =
        `<p id="otherName">${message.username}</p>
         <p id="otherMessageBox">${message.text}</p>
         <p id="otherMessageTime">${message.time}</p>`

    document.querySelector('.chatTexts').appendChild(div);
}
//will map through the lists of users and dsiplay them "user"
function outputUsers(users) {
    usersInChat.innerHTML = `${users.map(user => `"${user.username}" `).join('')}`
}
function changeUsername(name) {
    //check if username is ' '
    if (name === ' ') {
        //if so, call function to randomize name and set it as the new username
        console.log("hey1")
        //this wont work, gave up trying to figure out why
        username = randomizeName();
    }
    //else change username to name provided
    else {
        console.log("hey2")
        //this wont work, gave up trying to figure out why
        username = name;
    }
}

//get own name based off math library random function and the three array lists
function randomizeName() {
    var name = firstNameArray.at(getRandomArbitrary(0, 11)) +
        secondNameArray.at(getRandomArbitrary(0, 11)) +
        numberArray.at(getRandomArbitrary(0, 11));
    return name;
}

//code from 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random'
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}