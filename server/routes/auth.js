import CryptoJS from "crypto-js";
import { Router } from 'express';
import { User } from '../sequelize.js';
import jwt from 'jsonwebtoken';
const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, password, email, role,} = req.body;
    if (role === 'admin') {
      const admin = await User.findOne({ where: { role: 'admin' } });
      if (admin) {
        return res.status(200).json({ message: "Admin deja înregistrat." });
      }
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Ai deja cont!" });
    }
    const newUser = await User.create({
      first_name, last_name, 
      password: CryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC
      ).toString(), email, role
    });
    const savedUser = await newUser.save();

    return res.status(200).json(savedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'A apărut o eroare la crearea utilizatorului.' + err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ message: "Contul nu există!" });
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json({ message: "Parolă greșită!" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.role == "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
   return res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
