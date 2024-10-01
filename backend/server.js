const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { oauth2Client, setCredentials } = require('./utils/oauthConfig.js');
require('dotenv').config();


const app = express();

app.use(cors({ origin: [`${process.env.FRONTENDURI}`, "*"], credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.error('MongoDB connection error:', err));


app.use('/api', require('./routes/index.js'));

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Something went wrong!');
});

app.get('/auth', (req, res) => {
   const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
   });
   res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
   const { code } = req.query;
   const { tokens } = await oauth2Client.getToken(code);
   setCredentials(tokens);
   console.log('Access Token:', tokens.access_token);
   console.log('Refresh Token:', tokens.refresh_token);
   res.redirect('http://localhost:5173');
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
