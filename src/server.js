import express from "express"
import morgan from "morgan"
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import { dbConnection } from "./config/db"
import postRoutes from "./resources/posts/post.routes"
import {User} from "./resources/users/user.model"
import AuthRouter  from "./utils/auth.route"


const app = express()


app.use(morgan("dev"))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))


// routes
app.use("/auth", AuthRouter)
app.use('/api/posts', postRoutes)

// app.delete('/users' , async (req, res) => {
// 	const result = await User.remove({}, (err , data) => {
// 		if(err){
// 			return res.status(400).send({err})
// 		}else{
// 			res.status(201).send({
// 				data
// 			})
// 		}

// 	})

// })


export const start = async (port) => {
    try {
        await dbConnection()
        app.listen(port, () => {
            console.log(`REST API on http://localhost:${port}/api`)
        })
    } catch (e) {
        console.error(e)
    }
}