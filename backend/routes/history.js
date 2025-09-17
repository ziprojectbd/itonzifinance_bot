const express = require('express');
const History = require('../models/history'); // Adjust path if needed
const { sha256 } = require('crypto-hash');
const User = require('../models/User');

const route = express.Router();

route.get('/', async (req, res) => {
  try {
    const result = await History.find().limit(100).sort();
    return res.status(200).json({ status: true, message: 'hi', status_code: 200, result: result });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, status_code: 500 })
  }

});

route.get('/:uid', async (req, res) => {

  const uid = req.params.uid;

  try {
    const user = await User.findOne({ uid: Number(uid) });
    if (!user) {
      return res.status(404).json({ status: false, message: 'user not found', status_code: 404 })
    }
    const totalEarned = await History.aggregate([
      { $match: { uid, event: 'ads' } }, // or use `add` if that's the "earning"
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" }
          },
          totalEarned: { $sum: "$amount" },

        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } }
    ]);

    const totalWithdrawn = await History.aggregate([
      {
        $match: {
          uid: uid,
          event: 'ads'
        }
      },
      {
        $group: {
          _id: null,
          totalWithdrawn: { $sum: "$amount" }
        }
      }
    ]);
    const total = totalWithdrawn.length > 0 ? totalWithdrawn[0].totalWithdrawn : 0;

    const result = { dailyEarnings: totalEarned, payable: total }
    return res.status(200).json({ status: true, message: 'Total withdrawn amount fetched', status_code: 200, result: result });


  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, status_code: 500 })
  }
})


route.post('/', async (req, res) => {
  try {
    const { uid, amount, symbol } = req.body;
    const user = await User.findOne({ uid: Number(uid) });
    if (!user) {
      return res.status(404).json({ status: false, message: 'user not found', status_code: 404 })
    }
    const txid = await sha256('🦄');
    const result = await History.create({ uid, symbol, txid, amount });
    user.earn += 0.01;
    user.ads += 1;
    await user.save()
    return res.status(201).json({ status: true, message: 'created successful', status_code: 201, result: result });

  } catch (error) {
    return res.status(500).json({ status: false, message: 'error.message', status_code: 500 })
  }

});




module.exports = route;