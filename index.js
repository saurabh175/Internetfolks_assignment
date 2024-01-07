const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


mongoose.connect('mongodb://localhost:27017/assignment', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());


const authRouter = require('./routes/auth');
const communityRouter = require('./routes/community');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const useMember=require("./routes/member")



app.use('/auth', authRouter);
app.use('/community', communityRouter);
app.use('/role', roleRouter);
app.use('/user', userRouter);
app.use('/member', useMember);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
