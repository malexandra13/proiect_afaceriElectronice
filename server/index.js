import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
const app = express();
import auth from "./routes/auth.js"
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '200000mb' }));
app.use(cors());

app.use("/auth", auth);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);
// starting server 
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
});