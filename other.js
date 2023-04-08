//use for  time
const moment = require("moment");

//set chatHistory to empty
const chatHistory = [];

//array of all users that are active in the chat
const users = [];


//the first call for message
function formatMessageFirst(username, text) {
    //set values for username, text message and the time
    const values = {
        username,
        text,
        time: moment().format('h:mm a')
    };
    //add to history array
    chatHistory.push(values);
    //return the values
    return values;
}

//second call for message, just return values
function formatMessageSecond(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

//join user to chat 
function userJoin(id, username, color) {
    const user = { id, username, color };
    //adds user to array
    users.push(user);
    //returns current user
    return user;
}

function getCurrentUser(id) {
    //for each user, choose id that matches
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    //get undex based on the id of the user
    const index = users.findIndex(user => user.id === id);
    //index will now have the value of an index, but if it equals -1 then it means the user was not in users, so they left
    if (index !== -1) {
        const user = users.splice(index, 1);
        //return user rather than the array
        return user[0];
    }
}
// Get room users
function getUsers() {
    return users;
}


//export both functions
module.exports = {
    formatMessageFirst,
    formatMessageSecond,
    chatHistory,
    userJoin,
    getCurrentUser,
    userLeave,
    getUsers,
}