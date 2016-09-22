var express = require('express');
var router = express.Router();
var global = require('../global.js');

/* GET home page. */
router.get('/getDevices', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM users;', function(err, result) {
      //call `done()` to release the client back to the pool
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query', err);
      }
    //output: 1
    });
  });
});

/* Update log with:
 * LOG_USERID
 * LOG_EQUIPMENTID
 * LOG_ISCHECKINGOUT
 * LOG_EQUIPMENTCONDITION
 */
router.post('/updateLog', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var userId = req.query.LOG_USERID;
    var equipmentId = req.query.LOG_EQUIPMENTID;
    var isCheckingOut = req.query.LOG_ISCHECKINGOUT;
    var equipmentCond = req.query.LOG_EQUIPMENTCONDITION;
    var query = 'insert into log (LOG_USERID, LOG_EQUIPMENTID, LOG_ISCHECKINGOUT, LOG_EQUIPMENTCONDITION) '
	+ 'values (' + userId  + ',' + equipmentId + ',' + isCheckingOut + ',' + equipmentCond +');';

    console.log('userId: ' + userId + '\nequipmentId: ' + equipmentId + '\nisCheckingOut: ' +
        isCheckingOut + '\nequipmentCond: ' + equipmentCond);
    console.log('update log query: ' + query);

    client.query(query, function(err, result) {
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query: updateLog', err);
      }
    });
  });
});

//TODO
router.get('/getLog', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var deviceName = req.query.deviceID;
    var query = 'select * from log l inner join ';

    console.log('get log query: ' + query);

    client.query(query, function(err, result) {
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query: updateLog', err);
      }
    });
  });
});

/* 
 * Attempts to retrieve user information given the correct
 * user email and password. Returns no rows if incorrect.
 * ex:
 * ec2-52-42-46-135.us-west-2.compute.amazonaws.com:8080/loginUser?USERS_EMAIL=jessica1@pecdb.com&USERS_PASSWORD=hunter2
 * GET
 */
router.get('/loginUser', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var email = req.query.USERS_EMAIL;
    var password = req.query.USERS_PASSWORD;

    var query = 'select * from users where USERS_EMAIL = ' + "'" + email + "'" + ' and USERS_PASSWORD = ' +
	"'" + password + "'" + ';';

    console.log(' user login query: ' + query);

    client.query(query, function(err, result) {
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query: verifyUser', err);
      }
    });
  });
});

/* 
 * Returns equipment information given the equipment ID
 * ex:
 * ec2-52-42-46-135.us-west-2.compute.amazonaws.com:8080/getSingleItem?EQUIPMENT_UNIQUE_ID=1
 * GET
 */
router.get('/getSingleItem', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var itemID = req.query.EQUIPMENT_UNIQUE_ID;

    var query = 'select * from equipment where EQUIPMENT_UNIQUE_ID = ' + itemID + ';';

    console.log('single item query: ' + query);

    client.query(query, function(err, result) {
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query: get single item', err);
      }
    });
  });
});

/* 
 * Retires the item based on item id
 * ex: 
 * ec2-52-42-46-135.us-west-2.compute.amazonaws.com:8080/retireItem?EQUIPMENT_UNIQUE_ID=1
 * POST
 */
router.post('/retireItem', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var itemID = req.query.EQUIPMENT_UNIQUE_ID;

    var query = 'UPDATE equipment SET EQUIPMENT_ISACTIVE = false WHERE equipment_unique_id = ' + itemID + ';';

    console.log('retire item query: ' + query);

    client.query(query, function(err, result) {
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query: retire item', err);
      }
    });
  });
});

router.get('/getStatistics', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postNewDevice', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postUpdateCheckout', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postUpdateDeviceUser', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getAllDevices', function(req, res, next) {
  global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('select equipment_unique_id, equipment_name, EQUIPMENT_ISCHECKEDOUT from equipment;', function(err, result) {
      //call `done()` to release the client back to the pool
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query', err);
      }
    //output: 1
    });
  });
});

router.get('/createNewItem', function(req, res, next) {
//insert into EQUIPMENT (EQUIPMENT_NAME,EQUIPMENT_TYPE,EQUIPMENT_BRAND,EQUIPMENT_DESCRIPTION) values ('Blue Wrench','Wrench','Altendorf','A blue wrench');
    var equipmentName  = req.query.EQUIPMENT_NAME;
    var equipmentType = req.query.EQUIPMENT_TYPE;
    var equipmentBrand = req.query.EQUIPMENT_BRAND
    var equipmentDesc = req.query.EQUIPMENT_DESCRIPTION;

    global.postPool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var queryURL = `insert into EQUIPMENT (EQUIPMENT_NAME,EQUIPMENT_TYPE,EQUIPMENT_BRAND,EQUIPMENT_DESCRIPTION) values ('${equipmentName}','${equipmentType}','${equipmentBrand}','${equipmentDesc}');`;	
    console.log(queryURL);
    client.query(queryURL , function(err, result) {
      //call `done()` to release the client back to the pool
      res.send(JSON.stringify(result, null, 2));
      done();  
      if(err) {
        return console.error('error running query', err);
      }
    //output: 1
    });
  });
});

module.exports = router;
