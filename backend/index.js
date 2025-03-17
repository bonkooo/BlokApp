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
    let sql = "INSERT INTO USER (username, password, email, bodovi) VALUES (?, ?, ?, 0)";
    con.query(sql, [req.body.username, hashedPassword, req.body.email], function(err, result) {
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
    console.log('login gotten')
     const accessToken = jwt.sign({username: req.body.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "1y"});
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
        const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "1y"});
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

function authChanger(req, res, next) {
    let sql1 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = 1";
    
    con.query(sql1, [req.user.username], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if (result && result.length > 0) {
            return next(); // User is in group 1, proceed
        }

        let sql2 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = 6";
        con.query(sql2, [req.user.username], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (!result || result.length === 0) {
                return res.sendStatus(403); // User is neither in group 1 nor group 6
            }

            let sql3 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = ?";
            con.query(sql3, [req.user.username, req.body.idGroup], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if (!result || result.length === 0) {
                    return res.sendStatus(403); // User is not in the requested group
                }
                return next(); // User is authorized, proceed
            });
        });
    });
}

function auth2(req, res, next) {
    let sql1 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = 1";
    
    con.query(sql1, [req.user.username], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if (result && result.length > 0) {
            return next(); // User is in group 1, proceed
        }

        let sql2 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = 6";
        con.query(sql2, [req.user.username], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (!result || result.length === 0) {
                return res.sendStatus(403); // User is neither in group 1 nor group 6
            }

            let sql3 = "SELECT * FROM U_GRUPI JOIN USER USING(idUser) WHERE username = ? AND idGroup = 2";
            con.query(sql3, [req.user.username], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if (!result || result.length === 0) {
                    return res.sendStatus(403); // User is not in the requested group
                }
                return next(); // User is authorized, proceed
            });
        });
    });
}


app.post('/set_group', authToken, authChanger, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(500);
    
    let idUser = req.body.idUser;
    let idGroup = req.body.idGroup;
    
    let sql = "INSERT INTO U_GRUPI (idUser, idGroup) VALUES (?, ?)";
    let userData = await getUserData(token);
    
    con.query(sql, [req.body.idUser, req.body.idGroup], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        let sql2 = "SELECT * FROM CHAT_GROUP WHERE idGroup = ?";
        con.query(sql2, [idGroup], (err, chatGroups) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }

            if (chatGroups.length === 0) {
                return res.sendStatus(200); // No chats to add
            }

            // Store promises to track insertions
            let insertPromises = chatGroups.map(chat => {
                return new Promise((resolve, reject) => {
                    con.query("INSERT INTO HAS_CHAT (idUser, idChat) VALUES (?, ?)", [req.body.idUser, chat.idChat], (err, result) => {
                        if(err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Wait for all insertions to finish before sending response
            Promise.all(insertPromises)
                .then(() => res.sendStatus(200))
                .catch(err => res.sendStatus(500));
        });
        con.query("DELETE FROM PRIJAVA_ZA_GRUPU WHERE idUser = ? AND idGroup = ?", [req.body.idUser, req.body.idGroup], (err, result) => {
        })
    });
});


app.post('/deny_submission', authToken, authChanger, (req, res) => {
    con.query("DELETE FROM PRIJAVA_ZA_GRUPU WHERE idUser = ? AND idGroup = ?", [req.body.idUser, req.body.idGroup], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    })
})


app.get('/get_all_groups', authToken, async (req, res) => {
    let sql = "SELECT * FROM GRUPA";
    con.query(sql, [], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.json(result).status(200);
    })
})


app.post('/submit_group_application', authToken, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(500);
    let sql = "INSERT INTO PRIJAVA_ZA_GRUPU (ime, prezime, idUser, idGroup, fakultet, indeks) VALUES (?, ?, ?, ?, ?, ?)";
    userData = await getUserData(token)
    // napraviti funkciju koja vraca sve grupe u paru sa njihovim idevima
    con.query(sql, [req.body.ime, req.body.prezime, userData[0].idUser, req.body.idGroup, req.body.fakultet, req.body.indeks], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    })
})

app.get('/get_group_applications', authToken, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(500);
    userData = await getUserData(token)
    let sql = "SELECT * FROM U_GRUPI WHERE idUser = ? AND idGroup = 1";
    con.query(sql, [userData[0].idUser], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result && result.length > 0) {
            con.query("SELECT * FROM PRIJAVA_ZA_GRUPU", [], (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                }
                return res.json(result).status(200);
            })
        } else {
            con.query("SELECT * FROM U_GRUPI WHERE idUser = ? AND (idGroup = 6 OR idGroup = 2)", [userData[0].idUser], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if(result && result.length >= 2) {
                    con.query("SELECT * FROM PRIJAVA_ZA_GRUPU WHERE idGroup = 7 OR idGroup = 2 UNION SELECT * FROM PRIJAVA_ZA_GRUPU WHERE idGroup IN (SELECT idGroup FROM U_GRUPI WHERE idUser = ?)", [userData[0].idUser], (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        return res.json(result).status(200);
                    })
                } else {
                    con.query("SELECT * FROM PRIJAVA_ZA_GRUPU WHERE idGroup IN (SELECT idGroup FROM U_GRUPI WHERE idUser = ?) AND 6 IN (SELECT idGroup FROM U_GRUPI WHERE idUser = ?)", [userData[0].idUser, userData[0].idUser], (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        return res.json(result).status(200);
                    }) 
                }
            })
    }
    })
    
    
})

app.post('/post_news', authToken, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    sql = "SELECT * FROM U_GRUPI WHERE idUser = ? AND (idGroup = 1 OR idGroup = 6)";
    userData = await getUserData(token);
    con.query(sql, [userData[0].idUser], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result && result.length == 0 || !result) return res.sendStatus(500);
        con.query("INSERT INTO VESTI (tekst, datum, username, naslov) VALUES (?, ?, ?, ?)", [req.body.tekst, moment().format('YYYY-MM-DD'), userData[0].username, req.body.naslov], (err, result) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        })
    })
})
app.get('/get_news', authToken, async (req, res) => {
    sql = "SELECT * FROM VESTI ORDER BY DATUM ASC"
    con.query(sql, [], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.json(result).status(200)
    })
})

app.get('/user_info', authToken, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    userData = await getUserData(token);
    return res.json(userData[0]).status(200)
})

app.post('/register_assignment', authToken,  async (req, res) => {
    console.log("here")
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    userData = await getUserData(token)
    con.query("SELECT * FROM U_GRUPI WHERE idUser = ? AND idGroup = 1", [userData[0].idUser], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result && result.length >= 1) {
            con.query("INSERT INTO ZADUZENJE (naslov, tekst, datum, idGroup, max, idPoster, brojPrijavljenih) VALUES (?, ?, ?, ?, ?, ?, 0)", [req.body.naslov, req.body.tekst, req.body.datum, req.body.idGroup, req.body.max, userData[0].idUser], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            })
        } else {
            con.query("SELECT * FROM U_GRUPI WHERE idUser = ? AND idGroup = 6", [userData[0].idUser], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if(result && result.length >= 1) {
                    con.query("SELECT idGroup FROM U_GRUPI WHERE idUser = ? AND idGroup = ?", [userData[0].idUser, req.body.idGroup], (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        if(result && result.length >= 1) {
                            con.query("INSERT INTO ZADUZENJE (naslov, tekst, datum, idGroup, max, idPoster, brojPrijavljenih) VALUES (?, ?, ?, ?, ?, ?, 0)", [req.body.naslov, req.body.tekst, req.body.datum, req.body.idGroup, req.body.max, userData[0].idUser], (err, result) => {
                                if(err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                }
                                return res.sendStatus(200);
                            })
                        } else {
                            return res.sendStatus(500);
                        }
                    })
                } else {
                    return res.sendStatus(500);
                }
            })
        }
    })
})

app.post('/apply_for_assignment', authToken, async (req, res) => {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    userData = await getUserData(token)
    con.query("SELECT * FROM PRIJAVLJENI_NA_ZADUZENJU WHERE idZad = ? AND idUser = ?", [req.body.idZad, userData[0].idUser], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(result.length > 0) {
            console.log(1);
            return res.sendStatus(500);
        } else {
            con.query("SELECT * FROM ZADUZENJE WHERE idGroup IN (SELECT idGroup FROM U_GRUPI WHERE idUser = ?) AND brojPrijavljenih < max AND idZad = ?", [userData[0].idUser, req.body.idZad], (err, result) => {
                if(err) {
                    console.log(2);
                    return res.sendStatus(500);
                }
                if(result.length == 0) {
                    console.log(3);
                    return res.sendStatus(500);
                } else {
                    con.query("UPDATE ZADUZENJE SET brojPrijavljenih = ? + 1 WHERE idZad = ?", [result[0].brojPrijavljenih, req.body.idZad], (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            con.query("UPDATE USER SET bodovi = ? + 1 WHERE idUser = ?", [userData[0].bodovi, userData[0].idUser], (err, result) => {
                                if(err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } 
                                con.query("INSERT INTO PRIJAVLJENI_NA_ZADUZENJU (idUser, idZad) VALUES (?, ?)", [userData[0].idUser, req.body.idZad], (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        return res.sendStatus(500);
                                    } 
                                    return res.sendStatus(200);
                                })
                            })
                        }
                    })
                    
                }
            })
        }
    })
})

app.get("/list_all_assignments", authToken, async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403);
    userData = await getUserData(token)
    con.query("SELECT * FROM ZADUZENJE WHERE idGroup IN (SELECT idGroup FROM U_GRUPI WHERE idUser = ?) AND idGroup NOT IN (SELECT idGroup FROM PRIJAVLJENI_NA_ZADUZENJU JOIN ZADUZENJE USING(idZad))", [userData[0].idUser], (err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.json(result).status(200);
    })
})



console.log("Listening on port 4000");