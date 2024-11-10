const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error.js');

const createUser = async (req, res, next) => {
    const { username, email, designation, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, designation, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const validUser = await User.findOne({ email });
        
        // If user not found, return error
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Compare passwords
        const validPassword = await bcryptjs.compare(password, validUser.password);
        
        // If passwords don't match, return error
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong credentials'));
        }

        // Generate JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        
        // Set token in cookie and send response
        res.cookie('access_token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        // Handle other errors
        next(error);
    }
};


const logoutUser = (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: 'Logout successful' });
};

// other routes
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send();
    }
};

const getUserById = async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
};

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send('error: Invalid updates');
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
};

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};