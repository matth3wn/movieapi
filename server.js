require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const movies = require("./movies.json");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use(function verifyToken(req, res, next){
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'unauthorized access'})
    }
    next();
});

app.get('/movie', function getMovie(req, res){
    let filteredMovies = movies;

    if(req.query.genre){
        filteredMovies = filteredMovies.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country){
        filteredMovies = filteredMovies.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if(req.query.avg_vote){
        filteredMovies = filteredMovies.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    }

    res.json(filteredMovies)
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
