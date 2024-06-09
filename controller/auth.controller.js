const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, findUser?.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ _id: findUser?._id, role: findUser?.role, email: findUser?.email }, "secret");
        await findUser.save()
        res.status(200).json({ message: "Sign in successful", data: { user: findUser, token } });
    } catch (err) {
        console.log("🚀 ~ signIn ~ err:", err)
        res.status(500).json({ error: err.message });
    }
}





// register a new user to system
const register = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ email: req?.body?.email });
        if (findAdmin) {
            return res.status(400).json({ message: "User already exist" });

        }
        const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
        const user = new User({
            ...req?.body,
            password: hashedPassword,
        });
        await user.save();
        res.status(200).json({ message: "User registered successfully", data: { user } });

    } catch (err) {
        console.log("🚀 ~ signIn ~ err:", err)
        res.status(500).json({ error: err.message });
    }
}

// generate a new toke if last in expires


module.exports = { signIn, register }