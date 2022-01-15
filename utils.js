const fs = require('fs');

const getUserData = () => {
  try {
    const dataBuffer = fs.readFileSync('./db/users.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    [];
  }
};

const saveData = (data) => {
  const newData = JSON.stringify(data);
  fs.writeFile('./db/users.json', newData, (err) => {
    if (err) return;
  });
};

module.exports = {
  getUserData: getUserData,
  saveData: saveData,
};
