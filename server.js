const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json('Welcome')
})

server.get('/api/accounts', async (req, res) => {
  try {
      res.status(200).json(await db.select('*').from('accounts'))
      console.log(await db.select('*').from('accounts'))
  } catch (error) {
      res.status(500).json({ message: 'error getting accounts', error: error});
  }
})

server.get('/api/accounts/:id', async (req, res) => {
  const {id} = req.params
  try {
      const [getID] = await db.select('*').from('accounts').where({id});

      if(getID) {
          res.status(200).json(getID);
      } else {
          res.status(404).json({message: `could not find ${id}`});
      }
  } catch (error) {
      res.status(500).json({message: `Invalid ${id}`, error: error });
  }
})

server.post('/api/accounts', async (req, res) => {
  const postBody = req.body;

  try {
      const NewAccount = await db.select('*').from('accounts').insert(postBody);

      res.status(201).json(NewAccount);
  } catch (error) {
      res.status(500).json({message: 'error adding account', error: error});
  }
})

server.put('/api/accounts/:id', async (req, res) => {
  const {id} = req.params;
  const updatedBody = req.body;

  try {
      const updated = await db.select('*').from('accounts').where({id}).update(updatedBody);

      if (updated) {
          res.status(201).json(updated);
      } else {
          res.status(404).json({message: `could not update #${id}`});
      }
  } catch (error) {
      res.status(500).json({message: 'Could not update post', error: error});
  }
})

server.delete('/api/accounts/:id', async (req, res) => {
  const {id} = req.params;

  try {
      const deleted = await db.select('*').from('accounts').where({id}).del();

      if (deleted) {
          res.status(200).json({message: `Deleted #${id}`});
      } else {
          res.status(404).json({message: `could not find #${id}`});
      } 
  } catch (error) {
      res.status(500).json({message: 'account could not be deleted', error: error });
  }
})


module.exports = server;