let users=[];
const userJoin = (socketId,userId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    console.log("a User "+userId+" Connected");
    console.log("online",users)
}
const getUser = (userId) => {
    return users.find((user) => user.userId == userId);
}
const getAllUser = () => {
    return users;
}
const removeUser = (socketId) => {
   users.forEach( (user) => {
       if(user.socketId === socketId) {
           console.log("User " + socketId + " disconnected")
       }
   });

    users = users.filter((user) => user.socketId !== socketId);
}
module.exports = {
    userJoin,
    getUser,
    getAllUser,
    removeUser
}