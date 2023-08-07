const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const teamworkUserRoutes = require('./routes/teamwork.user.routes');
const teamworkArticleRoutes = require('./routes/teamwork.article.routes');
const teamworkGifRoutes = require('./routes/teamwork.gif.routes');
const teamworkFeedRoutes = require('./routes/teamwork.feed.routes');

const app = express();

const port = process.env.PORT || 3000; 

const corsOptions = {
	origin: 'https://tehzz-teamwork.netlify.app' 
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '50mb'}));
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50mb'
	})
);

app.get('/', (request, response) => {
	response.json({ info: 'we\'re live' });
});

app.use('/api/v1', teamworkUserRoutes);
app.use('/api/v1', teamworkArticleRoutes);
app.use('/api/v1', teamworkGifRoutes);
app.use('/api/v1', teamworkFeedRoutes);

app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});
