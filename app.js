const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3002, () => {
      console.log('Success')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

const convertObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const a = `SELECT
   *
    FROM
     cricket_team;`
  const b = await db.all(a)
  response.send(b.map(i => convertObjectToResponseObject(i)))
})

app.post('/players/', async (request, response) => {
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  const api2 = `
  INSERT INTO 
  cricket_team (player_name,jersey_number,role)
  VALUES (

    '${playerName}' ,
    ${jerseyNumber},
    '${role}'
  );`
  const db3 = await db.run(api2)

  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const api3 = `SELECT ;
  * 
  FROM
   cricket_team 
   WHERE 
   player_id=${playerId};`
  const db2 = await db.get(api3)
  response.send(convertObjectToResponseObject(db2))
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  const api4 = `
    UPDATE cricket_team 
    SET player_name= '${playerName}'
      jersey_number = ${jerseyNumber}
      role= '${role}'
    WHERE player_id = ${playerId};
  `
  await db.run(api4)
  response.send('Player Details Updated')
})

app.delete('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const api5 = `
    DELETE 
    FROM 
    cricket_team 
    WHERE
     player_id=${playerId}
  `
  await db.run(api5)
  response.send('Player Removed')
})
module.exports = app
