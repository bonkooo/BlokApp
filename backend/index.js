const express = require("express");
const app = express();
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require("cors");
require('dotenv').config()
const moment = require('moment');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sys"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to sql");
})

app.use(express.json());
app.use(cors());

app.listen(4000, '192.168.255.63', () => {
    console.log(`Server running on port 4000`);
});



app.get('/user_exists', (req, res) => {
    let sql = "SELECT * FROM USER WHERE id = ?";
    con.query(sql, [req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.json((result != null && result.length > 0) ? "true" : "false");
    });
});

app.post('/register', async (req, res) => {
    try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let sql = "INSERT INTO USER (username, password) VALUES (?, ?)";
    con.query(sql, [req.body.username, hashedPassword], function(err, result) {
        if(err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
    } catch {
        res.status(500);
    }
})

async function authUser(req, res, next) {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(hashedPassword)
        let sql = "SELECT * FROM USER WHERE username = ?";
        con.query(sql, [req.body.username], async (err, result) => {
            if(err) {
                console.log(err)
                return res.status(500).send("Login failed.");
            }
            if(result && result.length == 0 || !result) return res.status(401).send("Login info invalid");
            if(await bcrypt.compare(req.body.password, result[0].password)) {
                next();
                return;
            }
            return res.status(500).send("Login failed");
        })
     } catch {
        return res.status(500).send("Login failed");
     }
}
async function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user
        next();
    })
}

app.post('/login', authUser, async (req, res) => {
     const accessToken = jwt.sign({username: req.body.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});
     const refreshToken = jwt.sign({username: req.body.username}, process.env.REFRESH_TOKEN_SECRET);
     let sql = "INSERT INTO REFRESH_TOKEN (token) VALUES (?)";
     con.query(sql, [refreshToken], (err, result) => {
        if(err) {
            console.log(err)
            return res.sendStatus(500);
        }
     })
     res.json({accessToken, refreshToken}).status(200);
})

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token
    let sql = "DELETE FROM REFRESH_TOKEN WHERE token = ?";
    con.query(sql, [refreshToken], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })
    return res.sendStatus(200);
})

app.post('/token', (req, res) => {
    console.log('here')
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401);
    let sql = "SELECT * FROM REFRESH_TOKEN WHERE token = ?";
    username = null;
    con.query(sql, [refreshToken], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result.length == 0) return res.sendStatus(404);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            username = user.username;
        })      
        const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});
        return res.json({accessToken}).status(200);
    })
})

app.get('/test', (req, res) => {
    console.log('test')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send("Token invalid.");
        else return res.status(200).send("Token valid.");
    })
    return res.sendStatus(200);
})

app.get('/chats', authToken, (req, res) => {
    let sql = "SELECT chatName, idChat FROM HAS_CHAT JOIN USER USING (IdUser) JOIN CHAT USING (idChat) WHERE username = ?";
    console.log(req.user);
    con.query(sql, [req.user.username], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.json(result).status(200);
    })
})

app.post('/chat_messages', authToken, (req, res) => {
    let sql = "SELECT idChat FROM HAS_CHAT JOIN USER USING(idUser) WHERE username = ? AND idChat = ?";
    con.query(sql, [req.user.username, req.body.idChat], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result.length > 0 && result[0].idChat == req.body.idChat) {
            let sql = "SELECT * FROM MESSAGE JOIN CHAT USING(idChat) JOIN USER ON(User.IdUser = MESSAGE.IdSender) WHERE idChat = ?";
            con.query(sql, [req.body.idChat], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(result);
                return res.json(result).status(200);
            })
        } else {
            return res.sendStatus(500);
        }
    });
})

app.get('/username', authToken, (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) res.sendStatus(500);
        return res.json({username: user.username}).status(200);
    })
})

function getUserData(token) {
    return new Promise((resolve, reject) => {
        if (!token) return resolve(null);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err || !user || !user.username) return resolve(null);

            let sql = "SELECT * FROM USER WHERE username = ?";
            con.query(sql, [user.username], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });
}

async function fetchUserData(token) {
    let userData = null;
    try {
        userData = await getUserData(token);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
    return userData[0];
}


app.post('/send_message', authToken, async (req, res) => {
    let sql = "INSERT INTO MESSAGE (idSender, idChat, messageText, messageDate) VALUES (?, ?, ?, ?)"
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    user = await fetchUserData(token);
    con.query("SELECT * FROM HAS_CHAT WHERE idUser = ? AND idChat = ?", [user.idUser, req.body.idChat], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })
    con.query(sql, [user.idUser, req.body.idChat, req.body.messageText, moment().format('YYYY-MM-DD HH:mm:ss')], (err, result) => {
        if(err) {
            console.log(err)
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    });
})

console.log("Listening on port 4000");