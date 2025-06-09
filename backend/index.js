const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const bookingRoutes = require('./routes/bookings');
const classifiedRoutes = require('./routes/classifieds');
const complaintRoutes = require('./routes/complaints');
const announcementRoutes = require('./routes/announcements');
const rulesRoutes = require('./routes/rules');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/bookings', bookingRoutes);
app.use('/classifieds', classifiedRoutes);
app.use('/complaints', complaintRoutes);
app.use('/announcements', announcementRoutes);
app.use('/rules', rulesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
