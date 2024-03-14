import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** Middleware for verifying user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;
    // check the user existence
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication error" });
  }
}

/** POST: http://localhost:8080/api/register
 * @param: {
 * "username": "example123",
 * "password": "admin123",
 * "email": "example@gmail.com",
 * "firstName": "bill",
 * "lastName": "William",
 * "mobile": 80098605560,
 * "address": "Apt. 556, Kulas Light, Gwenborough",
 * "profile": ""
 * }
 */
export async function register(req, res, next) {
  try {
    const { username, password, profile, email } = req.body;
    //check existing user
    const existUsername = await UserModel.findOne({ username });

    //check existing email
    const existEmail = await UserModel.findOne({ email });

    // Check if both username and email are unique
    if (existUsername || existEmail) {
      const message = existUsername
        ? "Please use unique Username"
        : "Please use unique Email";
      return res.status(400).send({ error: message });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username: username,
        password: hashedPassword,
        profile: profile || "",
        email: email,
      });

      try {
        const savedUser = await user.save();
        return res
          .status(201)
          .send({ msg: "User Register Successful", user: savedUser });
      } catch (error) {
        return res.status(500).send({ error });
      }
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** POST: http://localhost:8080/api/login
 * @param: {
 * "username": "example123",
 * "password": "admin123"
 * }
 */
export async function login(req, res, next) {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have password" });
            // create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res, next) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });
    const user = await UserModel.findOne({ username }, { password: 0 }); // Wait for results
    if (!user) return res.status(501).send({ error: "Couldn't find the user" });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(404).send({ error: "Cannot find user data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser
 * @param: {
 *    "id": "<userid>"
 * }
 * body: {
 *    firstName: '',
 *    address: '',
 *    profile: ''
 * }
 */
export async function updateUser(req, res, next) {
  try {
    // const id = req.query.id;
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ error: "User not found!" });
    }
    const body = req.body;
    // Use await with updateOne to handle the promise asynchronously
    const updatedUser = await UserModel.updateOne({ _id: userId }, body);
    if (!updatedUser || updatedUser.modifiedCount === 0) {
      return res.status(404).send({ error: "User update failed!" });
    }
    return res.status(201).send({ msg: "Record Updated!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res, next) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res, next) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successfully" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid.
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res, next) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "access granted!" });
  }
  return res.status(440).send({ error: "Session expired!" });
}

// update the password when we have valid session.
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res, next) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    // Find the user using findOne() and handle potential errors
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password using updateOne() and handle errors
    await UserModel.updateOne({ username }, { password: hashedPassword });

    req.app.locals.resetSession = false;

    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ error: "An error occurred." }); // Provide generic error message for the user
  }
}
