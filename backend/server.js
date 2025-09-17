const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserStats');
const TelegramBot = require('node-telegram-bot-api');
const historyRoute = require('./routes/history')
 
dotenv.config(); // Load .env first

const app = express();

// Middleware
app.use(cors());

    app.use(bodyParser.json());
    app.use(express.json()); // Or  for older versions
 // For parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true })); // Or app.use(bodyParser.urlencoded({ extended: true }));
       app.use(express.raw({ type: '*/*' })); // Parses all content types as raw
    // Or specify a specific content type:
    // app.use(express.raw({ type: 'application/octet-stream' }));
app.use(express.raw({ type: '*/*' }));
app.use('/api/history', historyRoute)
// Telegram Bot setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const REQUIRED_CHANNEL = process.env.REQUIRED_CHANNEL || '@iTonziFinanceChannel';
let botStatus = 'not initialized';
let bot;
if (botToken) {
  bot = new TelegramBot(botToken, { polling: true });
  botStatus = 'running';
  bot.on('polling_error', (err) => {
    botStatus = 'error';
    console.error('Telegram bot polling error:', err);
  });
  // Welcome message on /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUser = msg.from;
    const User = require('./models/User');
    try {
      // Check if user already exists
      let user = await User.findOne({ uid: telegramUser.id });
      if (!user) {
        user = new User({
          uid: telegramUser.id,
          userName: telegramUser.username || `user${telegramUser.id}`,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name
        });
        await user.save();
        function onlyAlpha(str) {
          return (str || '').replace(/[^a-zA-Z]/g, '');
        }
        const firstName = onlyAlpha(telegramUser.first_name).toUpperCase();
        const lastName = telegramUser.last_name ? ` ${onlyAlpha(telegramUser.last_name).toUpperCase()}` : '';
        const name = `${firstName}${lastName}`.trim();
        const welcomeMsg = `🎉 *Welcome to iTonziFI!*\n\nHey, *${name}* — your account has been created successfully!\n\n✨ What you can do next:\n• Explore our features and stay updated\n• Earn, track, and manage inside the bot\n• Get exclusive news from our announcement channel\n\n🕒 *Registration Time:* ${new Date().toLocaleString()}\n\nLet’s get you started! 🚀`;
        await bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });

        const joinMsg = `🔔 *One last step!*\n\nPlease join our announcement channel to receive important updates and to access the bot:\n👉 [iTonziFinance Announcement](https://t.me/iTonziFinanceChannel)\n\nAfter joining, tap *✅ Verify* below.`;
        bot.sendMessage(chatId, joinMsg, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📢 iTonziFinance Announcement', url: 'https://t.me/iTonziFinanceChannel' }],
              [{ text: '✅ Verify', callback_data: 'verify_join' }]
            ]
          }
        });
      } else {
        function onlyAlpha(str) {
          return (str || '').replace(/[^a-zA-Z]/g, '');
        }
        const firstName = onlyAlpha(telegramUser.first_name).toUpperCase();
        const lastName = telegramUser.last_name ? ` ${onlyAlpha(telegramUser.last_name).toUpperCase()}` : '';
        const name = `${firstName}${lastName}`.trim();
        if (user.verified) {
          // Auto re-check membership on each /start if previously verified
          let stillMember = false;
          try {
            const member = await bot.getChatMember(REQUIRED_CHANNEL, telegramUser.id);
            const status = member?.status;
            stillMember = ['member', 'administrator', 'creator'].includes(status);
          } catch (err) {
            console.error('Auto recheck getChatMember failed:', err?.response?.body || err.message || err);
          }

          if (stillMember) {
            // Backfill channelJoinedAt if missing
            if (!user.channelJoinedAt) {
              try { user.channelJoinedAt = new Date(); await user.save(); } catch (e) { console.error('Failed to backfill channelJoinedAt:', e); }
            }
            const registeredAt = user.joinedAt ? new Date(user.joinedAt).toLocaleString() : 'N/A';
            const channelJoinedAt = user.channelJoinedAt ? new Date(user.channelJoinedAt).toLocaleString() : 'N/A';
            bot.sendMessage(chatId, `👋 *Welcome back, ${name}!*\n\n✅ *Status:* Verified\n📢 *Channel:* ${channelJoinedAt}\n📅 *Registered:* ${registeredAt}\n\nTap below to open the app and continue your journey! 🚀`, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [[
                  { text: 'OPEN BOT', web_app: { url: 'https://itrustonzikrulislam.vercel.app' } }
                ]]
              }
            });
          } else {
            // User left the channel: mark as unverified and show verification flow again
            try {
              const User = require('./models/User');
              await User.updateOne({ uid: telegramUser.id }, { $set: { verified: false } });
            } catch (e) {
              console.error('Failed to unset verified on auto recheck:', e);
            }
            const promptMsg = `👋 *Welcome back, ${name}!*\n\n⚠️ It looks like you're not a member of our channel anymore.\n\nPlease re-join the channel below and tap *✅ Verify* to continue:\n👉 [iTonziFinance Announcement](https://t.me/iTonziFinanceChannel)`;
            bot.sendMessage(chatId, promptMsg, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '📢 iTonziFinance Announcement', url: 'https://t.me/iTonziFinanceChannel' }],
                  [{ text: '✅ Verify', callback_data: 'verify_join' }]
                ]
              }
            });
          }
        } else {
          const promptMsg = `👋 *Welcome back, ${name}!*\n\nTo continue, please join our announcement channel first:\n👉 [iTonziFinance Announcement](https://t.me/iTonziFinanceChannel)\n\nThen tap *✅ Verify* to continue.`;
          bot.sendMessage(chatId, promptMsg, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '📢 iTonziFinance Announcement', url: 'https://t.me/iTonziFinanceChannel' }],
                [{ text: '✅ Verify', callback_data: 'verify_join' }]
              ]
            }
          });
        }
      }
    } catch (err) {
      console.error('User registration error:', err);
      bot.sendMessage(chatId, 'Registration failed. Please try again later.');
    }
  });

  // Verify channel membership
  bot.on('callback_query', async (query) => {
    try {
      if (query.data === 'verify_join') {
        const userId = query.from.id;
        const chatId = query.message.chat.id;
        // Attempt to get member status from the required channel
        let isMember = false;
        try {
          const member = await bot.getChatMember(REQUIRED_CHANNEL, userId);
          const status = member?.status;
          isMember = ['member', 'administrator', 'creator'].includes(status);
        } catch (err) {
          console.error('getChatMember failed:', err?.response?.body || err.message || err);
        }

        if (isMember) {
          // Persist verification and channel joined time (if not already set)
          try {
            const User = require('./models/User');
            const u = await User.findOne({ uid: userId });
            if (u) {
              u.verified = true;
              if (!u.channelJoinedAt) u.channelJoinedAt = new Date();
              await u.save();
            }
          } catch (e) {
            console.error('Failed to update user verified/channelJoinedAt:', e);
          }
          await bot.answerCallbackQuery(query.id, { text: 'Verified ✅', show_alert: false });
          try {
            await (require('./models/User')).findOne({ uid: userId });
            await bot.sendMessage(chatId, `🎯 *Verification Successful!*\n\nYou have been successfully verified.\nTap the button below to open the app.`, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [[
                  { text: 'OPEN BOT', web_app: { url: 'https://itrustonzikrulislam.vercel.app' } }
                ]]
              }
            });
          } catch (_) {
            await bot.sendMessage(chatId, '✅ You are verified! Tap below to open the app:', {
              reply_markup: { inline_keyboard: [[ { text: 'OPEN BOT', web_app: { url: 'https://itrustonzikrulislam.vercel.app' } } ]] }
            });
          }
        } else {
          await bot.answerCallbackQuery(query.id, { text: 'Not verified yet. Please join the channel first, then tap Verify again.', show_alert: true });
          await bot.sendMessage(chatId, '📢 Please join our announcement channel first, then press *✅ Verify*:', {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '📢 iTonziFinance Announcement', url: 'https://t.me/iTonziFinanceChannel' }],
                [{ text: '✅ Verify', callback_data: 'verify_join' }]
              ]
            }
          });
        }
      }
    } catch (e) {
      console.error('Error handling callback_query:', e);
    }
  });

  // Manual re-check command
  bot.onText(/\/(verify|recheck)/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    try {
      let isMember = false;
      try {
        const member = await bot.getChatMember(REQUIRED_CHANNEL, userId);
        const status = member?.status;
        isMember = ['member', 'administrator', 'creator'].includes(status);
      } catch (err) {
        console.error('getChatMember (manual) failed:', err?.response?.body || err.message || err);
      }

      const User = require('./models/User');
      if (isMember) {
        try {
          const u = await User.findOne({ uid: userId });
          if (u) {
            u.verified = true;
            if (!u.channelJoinedAt) u.channelJoinedAt = new Date();
            await u.save();
          }
        } catch (e) {
          console.error('Failed to set verified/channelJoinedAt in /verify:', e);
        }
        try {
          await bot.sendMessage(chatId, `🎯 *Verification Successful!*\n\nYou have been successfully verified.\nTap the button below to open the app.`, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: 'OPEN BOT', web_app: { url: 'https://itrustonzikrulislam.vercel.app' } }
              ]]
            }
          });
        } catch (_) {
          await bot.sendMessage(chatId, '✅ Verification rechecked: You are a member. Tap below to open the app:', {
            reply_markup: { inline_keyboard: [[ { text: 'OPEN BOT', web_app: { url: 'https://itrustonzikrulislam.vercel.app' } } ]] }
          });
        }
      } else {
        await User.updateOne({ uid: userId }, { $set: { verified: false } });
        await bot.sendMessage(chatId, '❗ You are not a member yet. Please join our announcement channel and press *✅ Verify* again.', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📢 iTonziFinance Announcement', url: 'https://t.me/iTonziFinanceChannel' }],
              [{ text: '✅ Verify', callback_data: 'verify_join' }]
            ]
          }
        });
      }
    } catch (e) {
      console.error('Error in /verify command:', e);
      await bot.sendMessage(chatId, 'Something went wrong while rechecking. Please try again.');
    }
  });

  // Admin panel command
  bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🔐 *Admin Panel Access*\n\nTap the button below to open the admin panel.\n\n*Note:* You will need user ID and Password  to access the admin panel.', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Admin Panel', web_app: { url: 'https://itrustonzikrulislam.vercel.app/admin' } }
        ]]
      }
    });
  });
} else {
  console.warn('TELEGRAM_BOT_TOKEN not set in .env. Telegram bot not started.');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Bot status endpoint
app.get('/bot-status', (req, res) => {
  res.json({ botStatus });
});

// User routes
app.use('/api/user', userRoutes);

//api/user/100000

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  if (bot) console.log('🤖 Telegram bot started!');
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});
