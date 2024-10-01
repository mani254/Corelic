const User = require('../schema/userSchema')

const register = async (req, res) => {
   try {
      const { name, email, password } = req.body
      console.log(name, email, password)

      const newUser = new User({
         name,
         email: {
            id: email,
         },
         password,
      })

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!', data: newUser });
   } catch (err) {
      console.error('Error during registration:', err.message);
      if (err.code === 11000) {
         return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
   }
}

module.exports = { register }