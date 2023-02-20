const { urlencoded } = require("express");
const express = require("express")
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const admin = require("firebase-admin")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const serviceAccount = require("./serviceAccountKey.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();


function run() {
    try {
        // users collection
        const usersCollection = db.collection('users');


        // users save to firestore database
        app.post('/users', async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await usersCollection.add(data)
            res.send(result)
        })

        // read all users from database
        app.get("/users", async (req, res) => {
            const allUsers = await usersCollection.get();
            let allUsersArray = [];
            allUsers.forEach(doc => {

                const user = {
                    data: doc.data(),
                    id: doc.id
                }
                allUsersArray.push(user)

            })
            res.send(allUsersArray)
        })

        // read single user by id from database
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const docRef = await usersCollection.doc(id).get()

            const user = {
                data: docRef.data(),
                id: docRef.id
            }
            res.send(user)
        })

        // update single user by id

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const docRef = await usersCollection.doc(id);

            const updatedUser = docRef.update(
                req.body
            )
            res.send({ updatedUser, message: "user updated successfully" })

        })

        // delete single users by id 
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id
            const docRef = await usersCollection.doc(id);
            const deletedUser = docRef.delete();

            res.send({ message: "user  deleted successfully" })

        })

    } catch (error) {
        console.log(error)
    }
} run()
// .catch(error => console.log(error))




app.get('/', (req, res) => {
    res.send("doyo pet server is running")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})