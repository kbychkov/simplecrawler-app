module.exports = io => {
  io.use((socket, next) => {
    socket.feathers.id = socket.id;
    next();
  });
};
