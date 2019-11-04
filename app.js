const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express()
const connect = "postgres://training:training@localhost/recipes";
const pool = new pg.Pool({
    connectionString: connect
})



//assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default ext .dust
app.set("view engine", 'dust');
app.set('views', __dirname + '/views');

// set public folder
app.use(express.static(path.join(__dirname, "public")));

//body middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    console.log('someone is connecting!')
    pool.connect((err, client, done) => {
        if (err) {
            return console.error(`error fetching client from pool: ${err}`);
        }
        client.query('SELECT * FROM recipe_list', (err, result) => {

            if (err) {
                return console.error(`error running query: ${err}`);
            }
            res.render('index', {
                recipes: result.rows
            })
            done();
        })
    })
})
app.post('/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error(`error fetching client from pool: ${err}`);
        }
        const {
            name,
            ingredients,
            directions
        } = req.body
        if (name.trim() != "" && ingredients.trim() != "" && directions.trim() != "") {
            client.query(`INSERT INTO recipe_list(name, ingredients, directions) VALUES('${name}', '${ingredients}', '${directions}')`);
            done();
            console.log('new recipe added!');
        }
        res.redirect('/');
    });
});
app.post('/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error(`error fetching client from pool: ${err}`);
        }
        const {
            name,
            ingredients,
            directions,
            id
        } = req.body
        if (name.trim() != "" && ingredients.trim() != "" && directions.trim() != "") {
            client.query(`UPDATE recipe_list set name='${name.trim()}', ingredients='${ingredients}', directions='${directions}' WHERE id = ${id}`);
            done();
            console.log('new recipe added!');
        }
        res.redirect('/');
    });
});
app.delete('/delete/:id', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error(`error fetching client from pool: ${err}`);
        }
        console.log(`${req.params.id} is the id`)
        try {
            client.query(`DELETE FROM recipe_list WHERE id = '${req.params.id}'`);
        } catch (e) {
            console.log(e)
        } finally {
            done();
        }
        console.log('recipe removed!');
        res.sendStatus(200);
    });
})
//server
app.listen(3000, () => {
    console.log('listening on port 3000')
})