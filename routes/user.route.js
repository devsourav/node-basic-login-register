// Imports
const express = require('express');
const router = express.Router();
const dbService = require('../services/db.service');


/** POST Registration
* @return {Object} User
*/
router.post('/create', function (req, res, next) {
  try {
    let body = req.body;
    if (body) {
      dbService.createUser(body).then(
        (result) => {
          res.status(200).send(result);
        }, (err) => {
          res.status(301).send(err);
        }
      );
    } else {
      res.status(300).send('Invalid Data!');
    }
  } catch (err) {
    res.status(400).send('Failed!');
  }
});

/** POST Login
* @return  {Object} User with user_role
*/
router.post('/', function (req, res, next) {
  try {
    let body = req.body;
    if (body) {
      dbService.findUser(body).then(
        (result) => {
          res.status(200).send(result);
        }, (err) => {
          res.status(301).send(err);
        }
      );
    } else {
      res.status(300).send('Invalid Data!');
    }
  } catch (err) {
    res.status(400).send('Failed!');
  }
});

/** GET User List
* @return  {Array} Get user list
*/
router.get('/', function (req, res, next) {
  try {
    dbService.getUserList().then(
      (result) => {
        res.status(200).send(result);
      }, (err) => {
        res.status(301).send(err);
      }
    )
  } catch (err) {
    res.status(400).send('Failed!');
  }
});

/** GET Remove All
* @return {any} Status  
*/
router.get('/remove_all', function (req, res, next) {
  try {
    dbService.removeAllUsersAndRoles().then(
      (result) => {
        res.status(200).send(result);
      }, (err) => {
        res.status(301).send(err);
      }
    )
  } catch (err) {
    res.status(400).send('Failed!');
  }
});

//Export router
module.exports = router;
