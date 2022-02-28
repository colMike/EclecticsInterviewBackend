const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(
	cors({
		origin : [ 'http://localhost:4200' ]
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes')(app);

app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
