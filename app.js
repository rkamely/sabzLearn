const express = require("express");
const authRouter = require("./routes/v1/auth");
const userRouter = require("./routes/v1/user");
const simCardRouter = require("./routes/v1/sim-card");
const categoryRouter = require("./routes/v1/category");
const courseRouter = require("./routes/v1/course");
const commentRouter = require("./routes/v1/comment");
const contactRouter = require("./routes/v1/contact");
const searchRouter = require("./routes/v1/search");
const notificationRouter = require("./routes/v1/notification");
const voucherRouter = require("./routes/v1/voucher");
const articleRouter = require("./routes/v1/article");
const orderRouter = require("./routes/v1/order");
const ticketRouter = require("./routes/v1/ticket");
const menuRouter = require("./routes/v1/menu");

const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(
  "/courses/covers",
  express.static(path.join(__dirname, "public", "courses", "covers")),
);
app.use(
  "/articles/covers",
  express.static(path.join(__dirname, "public", "articles", "covers")),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/sim-cards", simCardRouter);



app.use("/v1/category", categoryRouter);
app.use("/v1/courses", courseRouter);
app.use("/v1/comments", commentRouter);
app.use("/v1/contact", contactRouter);
app.use("/v1/search", searchRouter);
app.use("/v1/notification", notificationRouter);
app.use("/v1/voucher", voucherRouter);
app.use("/v1/article", articleRouter);
app.use("/v1/orders", orderRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/menu", menuRouter);

module.exports = app;
