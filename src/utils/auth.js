import config from '../config/secrets'
import { User } from '../resources/users/user.model'
import jwt from 'jsonwebtoken'
import {forgotPasswordMail, TokenForPassword, verifyEmailToken} from "./mailer";

export const newToken = user => {
    console.log(user);
    return jwt.sign({ id: user.id }, config.JWT_TOKEN, {
        expiresIn: config.JWT_TIME
    })
}

export const verifyToken = token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_TOKEN, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

export const signup = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ data: 'need email and password' })
    }

    try {
        const user = await User.create(req.body)
        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        return res.status(500).send({ e })
    }
}

export const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ data: 'need email and password' })
    }
    const invalid = { data: 'Invalid email and password combination' }
    try {
        const user = await User.findOne({ email: req.body.email })
            .select('email password')
            .exec()
        if (!user) {
            return res.status(401).send(invalid)
        }
        const match = await user.checkPassword(req.body.password)
        if (!match) {
            return res.status(401).send(invalid)
        }
        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export const protect = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).end()
    }

    const token = bearer.split('Bearer ')[1].trim()
    let payload
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res.status(401).end()
    }

    const user = await User.findById(payload.id)
        .select('-password')
        .lean()
        .exec()

    if (!user) {
        return res.status(401).end()
    }

    req.user = user
    next()
}


export const newEmail = async (req, res) => {
	let user;
	try {
	let userId = await verifyEmailToken(req.headers.recoverytoken);
	  user = await User.findOne({ _id: userId }).exec();
      if (req.headers.recoverytoken === user.token.recoveryToken.toString()) {
		let password = await user.newPassword(req.body.password)
		let response = await User.findByIdAndUpdate(
			{_id: userId}, 
			{password, $set:{'token.recoveryToken': ""}},
			{new:true})
		res.status(201).send({data: newToken(response) })
      }else{
		return res.status(400).send({ error:"" });
	  }
    } catch (error) {
      res.status(400).send({ error, details: "user not found" });
	}    
  }

  
export const forgotEmail = async(req, res) => {
	const email = req.body.email;
    try {
      const user = await User.findOne({ email })
        .select("email id token")
        .exec();
      if (user) {
        let token = TokenForPassword(user);
        if (forgotPasswordMail(user.email, token)) {
          user.token.recoveryToken = token;
          await user.save();
          res.status(200).send({ data: "mail sent" });
        } else {
          res.status(400).end();
        }
      } else {
        return res.status(400).end()
      }
    } catch (e) {
      res.status(400).end();
    }
}