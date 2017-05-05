const express = require('express');
const app = module.exports = express();

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/notes';


function get_all(res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      collection.find({}, {name: 1, lastname: 1, phone: 1, number: 1, _id: 0}).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(result);
        }
      });
    }
    db.close();
  });
}

app.get('/all', function(req, res) {
  get_all(res);
});

app.post('/users/find', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      let tmp = {};
      tmp[req.body.search] = req.body.for_search;
      collection.find(tmp, {name: 1, lastname: 1, phone: 1, number: 1, _id: 0}).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(result);
        }
      });
    }
    db.close();
  });
});

app.get('/users/:id', function(req, res) {
  const num = parseInt(req.params.id);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      collection.find({number: num}, {_id: 0, number: 0}).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(result);
        }
      });
    }
    db.close();
  });
});

app.post('/users', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      var num = 0;
      collection.find().count(function (err, count) {
      if (err) {
        console.log(err);
      } else {
        num = count;
        let contact = {name: req.body.name, lastname: req.body.lastname,
                        phone: req.body.phone, number: num};
        let tmp = {};
        if (req.body.new_field) {
          if (typeof(req.body.new_field) == 'string') {
            tmp[req.body.new_field] = req.body.new_value;
            Object.assign(contact, tmp);
          } else {
            for (let i = 0; i < req.body.new_field.length; i++) {
              tmp[req.body.new_field[i]] = req.body.new_value[i];
              Object.assign(contact, tmp);
            }
          }
        }
        collection.insert(contact, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            let a = [{name: result.ops[0].name, phone: result.ops[0].phone, number: result.ops[0].number, lastname: result.ops[0].lastname}];
            res.status(200).send(a);
          }
        });
      }
      db.close();
    });
    }
  });
});

app.delete('/users/:id', function(req, res) {
  const num = parseInt(req.params.id);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      collection.deleteOne({number: num} ,function(err, numberOfRemovedDocs) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send('Контакт удален');
        }
        db.close();
      });
    }
  });
});

app.put('/users/:id', function(req, res) {
  const num = parseInt(req.params.id);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Ошибка подключения к серверу MongoDB!');
      res.status(500).send('Ошибка сервера базы данных');
    } else {
      console.log('Подключено к', url);
      const collection = db.collection('contacts');
      req.body.number = parseInt(req.body.number);
      collection.updateOne({number: num}, req.body, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send('Информация обновлена');
        }
      });
    }
    db.close();
  });
});
