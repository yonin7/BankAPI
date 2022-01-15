const path = require('path');
const express = require('express');
const { getUserData, saveData } = require('./utils');
let userData = getUserData();
const parseFloats = [1, 2, 3, 4, 5, 6];

const app = express();
app.use(express.json());

app.get('/user', (req, res) => {
  res.status(200).send(userData);
  // console.log(res.params);
});
app.get('/user/:id', (req, res) => {
  try {
    if (req.params.id && !req.params.id in userData) {
      res.status(200).send(userData[req.params.id]);
    } else return res.status(400).send('user not exists');
  } catch (err) {
    return res.status(500).send(`can't find user`);
  }
});

app.post('/user', (req, res) => {
  try {
    if (req.body.id && !(req.body.id in userData)) {
      const newUser = {
        id: req.body.id,
        cash: 0,
        credit: 0,
      };

      userData[req.body.id] = newUser;
      saveData(userData);
      res.status(200).send(newUser);
    } else return res.status(400).send('user already exists');
  } catch (err) {
    return res.status(500).send(`can't create user`);
  }
});

app.put('/user/deposit/:id', (req, res) => {
  try {
    if (req.params.id && req.params.id in userData) {
      try {
        const cash = parseFloat(req.body.cash);
        userData[req.params.id]['cash'] += cash;
        saveData(userData);
        res.status(200).send(userData[req.params.id]);
      } catch (err) {
        return res.status(400).send('wrong cash parameter');
      }
    } else return res.status(400).send('user not found');
  } catch (err) {
    return res.status(500).send(`can't Deposit cash`);
  }
});

app.put('/user/updatecredit/:id', (req, res) => {
  try {
    if (req.params.id && req.params.id in userData) {
      try {
        const credit = parseFloat(req.body.credit);
        userData[req.params.id]['credit'] = credit;
        saveData(userData);
        res.status(200).send(userData[req.params.id]);
      } catch (err) {
        return res.status(400).send('wrong credit parameter');
      }
    } else return res.status(400).send('user not found');
  } catch (err) {
    return res.status(500).send(`can't update credit`);
  }
});

app.put('/user/withdraw/:id', (req, res) => {
  try {
    if (req.params.id && req.params.id in userData) {
      try {
        const withdrawMoney = parseFloat(req.body.money);
        const credit = userData[req.params.id]['credit'];
        let cash = userData[req.params.id]['cash'];

        if (credit + cash >= withdrawMoney) {
          cash -= withdrawMoney;
          userData[req.params.id]['cash'] = cash;
          saveData(userData);
          return res.status(200).send(userData[req.params.id]);
        }

        return res.status(400).send('not enough money');
      } catch (err) {
        return res.status(400).send('wrong money parameter');
      }
    } else return res.status(400).send('user not found');
  } catch (err) {
    return res.status(500).send(`can't Withdraw money `);
  }
});

app.put('/user/transfer/:id1/:id2', (req, res) => {
  try {
    if (
      req.params.id1 &&
      req.params.id1 in userData &&
      req.params.id2 &&
      req.params.id2 in userData
    ) {
      try {
        const transfermoney = parseFloat(req.body.money);
        const credit = userData[req.params.id1]['credit'];
        let cash = userData[req.params.id1]['cash'];

        if (credit + cash >= transfermoney) {
          cash -= transfermoney;
          userData[req.params.id1]['cash'] = cash;
          userData[req.params.id2]['cash'] += transfermoney;

          saveData(userData);
          return res
            .status(200)
            .send([userData[req.params.id1], userData[req.params.id2]]);
        }

        return res.status(400).send('not enough money');
      } catch (err) {
        return res.status(400).send('wrong money parameter');
      }
    } else return res.status(400).send('user not found');
  } catch (err) {
    return res.status(500).send(`can't transfer money `);
  }
});

app.listen(3000, () => {
  console.log('server is up on port 3000');
});
