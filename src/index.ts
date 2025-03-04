import express from  "express";
import cors from "cors";
import { AdminModel, IdModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { z } from "zod"

const app = express();
dotenv.config();
const url: string = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
const requiredBody = z.object({
    username: z.string().min(5).max(25),
    password: z.string().min(5).max(20)
})

const parseBody = requiredBody.safeParse(req.body);

if(!parseBody.success){
    res.status(401).json({
        message: "Check the credentials"
    })
}

    try{ 
        const { username, password } = req.body;

        await UserModel.create({
            username: username,
            password: password
        })
        res.status(200).json({
            message: "Signed up successfully"
        })
    } catch(e){
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post('/signin', async(req, res) => {
    const requiredBody = z.object({
        username: z.string().min(5).max(25),
        password: z.string().min(5).max(20)
    })

    const parseBody = requiredBody.safeParse(req.body);

    if(!parseBody.success){
        res.status(401).json({
            message: "Check the credentials "
        })
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({
        username, 
        password
    })

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_PASSWORD)

        res.json({
            token: token
        })
    } else{
        res.status(411).json({
            message: "Invalid Credentials"
        })
    }
})

app.post('/enterdata', userMiddleware, async(req, res) => {
    const Id = req.body.Id;

    await IdModel.create({
        Id
    })

    res.status(200).json({
        message: "data added"
    })
})

app.get('/data', userMiddleware, async(req, res) => {
    const userId = req.userId;

    const data = await IdModel.find({
        userId
    })

    res.json({
        data
    })
})

app.put('/content', userMiddleware, async(req, res) => {
    const contentId = req.body.contentId;

    await IdModel.findOneAndDelete({
        _id: contentId
    },{
        userId: req.userId
    })
    
    res.json({
        message: "content deleted"
    })
})

async function main() {
    await mongoose.connect(url);
    app.listen(3000);
}

main();

