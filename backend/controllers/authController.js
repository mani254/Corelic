const User = require('../schema/userSchema')
const sendMail = require('../utils/sendMail')
require('dotenv').config()

const createActivationLink = (email, otp) => {
   return `${process.env.FRONTENDURI}/accountactivation?email=${email}&activationcode=${otp}`;
};

const sendActivationEmail = async (user) => {
   const activationLink = createActivationLink(user.email.id, user.otp.code);
   const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ccc; border-radius: 10px;">
         <h1 style="color: #333;">Welcome, ${user.name}!</h1>
         <p>Thank you for registering with us. Please activate your account by clicking the button below:</p>
         <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Activate Account</a>
         <p>If you did not create an account, please ignore this email.</p>
         <p>Best regards,<br>Your Company Name</p>
      </div>`;

   await sendMail({ to: user.email.id, subject: 'Account Activation', html });
};

const register = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ 'email.id': email });

      if (existingUser) {
         if (!existingUser.email.verified) {
            await existingUser.generateOtp();
            await existingUser.save()
            sendActivationEmail(existingUser);
            return res.status(200).json({ message: 'Activation email sent again. Please check your inbox.' });
         } else {
            return res.status(400).json({ error: 'Email already exists and is verified.' });
         }
      }

      const newUser = new User({
         name,
         email: { id: email },
         password,
      });
      await newUser.generateOtp();
      await newUser.save();

      sendActivationEmail(newUser);

      res.status(201).json({ message: 'User registered successfully! Please check your email to activate your account.' });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(400).json({ error: 'Email already exists' });
      }
      console.error('Error during registration:', err.message);
      res.status(500).json({ error: 'Internal server error' });
   }
}

const activateUser = async (req, res) => {
   try {
      const { email, activationcode } = req.query;

      if (!email || !activationcode) {
         return res.status(400).json({ error: 'Invalid Activation Link' });
      }

      const user = await User.findOne({ 'email.id': email });

      if (!user) {
         return res.status(404).json({ error: 'User not found. Try creating an account again.' });
      }

      if (user.email.verified) {
         return res.status(400).json({ error: 'User already activated.' });
      }

      const validOtp = user.validateOtp(Number(activationcode));
      if (!validOtp) {
         return res.status(400).json({ error: 'Link expired or invalid. Try registering again.' });
      }

      user.email.verified = true;
      user.otp = null;
      await user.save();

      return res.status(200).json({ message: 'Account activated successfully.' });

   } catch (err) {
      console.error('Error during user activation:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
   }
}

const sendPasswordResetEmail = async (user, otp) => {
   const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ccc; border-radius: 10px;">
         <h1 style="color: #333;">Password Reset Request</h1>
         <p>Hi ${user.name},</p>
         <p>You requested a password reset for your account. Please use the OTP below to proceed:</p>
         <p style="font-size: 24px; font-weight: bold; color: #28a745;">${otp}</p>
         <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
         <p>Best regards,<br>Your Company Name</p>
      </div>`;

   await sendMail({ to: user.email.id, subject: 'Your OTP for Password Reset', html });
};

const requestOtp = async (req, res) => {
   try {
      const { email } = req.body;

      const user = await User.findOne({ 'email.id': email });

      if (!user) {
         return res.status(404).json({ error: 'email does not exists' })
      }

      user.generateOtp()
      await user.save()

      console.log(user)

      sendPasswordResetEmail(user, user.otp.code)

      res.status(200).send({ message: 'Otp sent Successfully' })

   } catch (err) {
      console.error('Error while sending otp:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
   }
}

const verifyOtp = async (req, res) => {
   try {
      const { email, otp } = req.body;

      const user = await User.findOne({ 'email.id': email });

      if (!user) {
         return res.status(404).json({ error: 'Email does not exist' });
      }

      const validOtp = user.validateOtp(Number(otp));
      if (!validOtp) {
         return res.status(400).json({ error: "Invalid OTP or expired" });
      }

      res.status(200).json({ message: 'OTP validated successfully' });
   } catch (err) {
      console.error('Error while verifying OTP:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
   }
}

const passwordChange = async (req, res) => {
   try {
      const { email, otp, password } = req.body;

      const user = await User.findOne({ 'email.id': email });

      if (!user) {
         return res.status(404).json({ error: 'Email does not exist' });
      }

      const validOtp = user.validateOtp(Number(otp));
      if (!validOtp) {
         return res.status(400).json({ error: "Invalid OTP or expired" });
      }

      user.password = password
      await user.save()


      res.status(200).json({ message: 'password changed succesfully' });
   } catch (err) {
      console.error('Error while changing passsword:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
   }
}


module.exports = { register, activateUser, requestOtp, verifyOtp, passwordChange };

