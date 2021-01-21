const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 1
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 2
    },
    {
        name: "charlie menek",
        number: "6122066496",
        id: 3
    }
]

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
}

const app = express()
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.get('/api/persons', (req, res) => res.json(persons) )
app.get('/api/info', (req, res) => {
    let count = persons.length
    res.send(`<h3>Phonebook has info for ${count} people</h3><h3>${new Date}</h3>`)
})
app.get('/api/persons/:id',(req, res) => {
    const person = persons.find(e => e.id === Number(req.params.id))
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    } else {
        if (persons.some(e => e.name === body.name)) return res.status(400).json({ error: 'name must be unique' })
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
        persons.push(person)
        res.json(person)     
    }
})
app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(e => e.id !== Number(req.params.id))
    res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)
})
