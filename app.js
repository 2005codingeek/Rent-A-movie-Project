const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// gpt\
const axios = require('axios');
//testing
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware to serve static files from the 'views' directory
app.use('/views', express.static(path.join(__dirname, 'views')));


// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '22108968',
    database: 'rent_a_movie'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});




// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { userid, password } = req.body;

    const query = 'SELECT * FROM user_info WHERE userid = ? AND password = ?';
    db.query(query, [userid, password], (err, results) => {
        if (err) {
            return res.status(500).send('Database error check');
        }

        if (results.length > 0) {
            res.sendFile(path.join(__dirname, 'views', 'services.html'));
        } else {
            res.sendFile(path.join(__dirname, 'views', 'login.html'), {
                errorMessage: 'Invalid user ID or password'         
            });
        
            onclick = " alert ('you have entered wrong password and user_id')"
            
        
           
        
        }
    });
});





// Serve to-do page
app.get('/to_do', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'to_do.html'));
});

// route to add a customer
app.get ( '/add', (req,res) => {
    res.sendFile(path.join ( __dirname, 'views', 'add.html' ));
});

// Serve other pages as needed (e.g., dashboard, profile, settings, etc.)
app.get('/Background', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Background.html'));
});

// Serve route back to login from the background and to-do
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve route back to main-menu services after doing a certain task
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

// route to search for movie by name, actor or type
app.get('/movie_name', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'movie_name.html'));
});

// route to go to customer_sectio
app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'customer.html'));
});
     
// route to go to search_customer
app.get('/search_customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'search_customer.html'));
});


// route to go to subscribe to ouur news letters
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news.html'));
});

// route to go to the add a movie page 
app.get('/add_movie', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add_movie.html'));
});

     

// route to go to the add a movie page 
app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'order.html'));
});


  // Handle search for movie request
  app.post('/search', (req, res) => {
    const searchQuery = req.body.query;
    const sql = `SELECT movie_name, movie_type, price FROM movie WHERE movie_name LIKE ? OR movie_type LIKE ?`;
  
    db.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.send('An error occurred while searching.');
        return;
      }
  
      if (results.length > 0) {

        res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
    <h1>Search Results:</h1>
    <table style="margin: 0 auto; border-collapse: collapse; width:100%;">
        <tr>
            <th style="border: 1px solid white; padding: 8px; color: white;">Movie Name</th>
            <th style="border: 1px solid white; padding: 8px; color: white;">Movie Type</th>
            <th style="border: 1px solid white; padding: 8px; color: white;">Price in Kwacha</th>
        </tr>
        ${results.map(movie => `
        <tr>
            <td style="border: 1px solid white; padding: 8px; color: white;">${movie.movie_name}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${movie.movie_type}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${movie.price}</td>
        </tr>`).join('')}
    </table>
    <button onclick="window.location.href='/views/movie_name.html'">Search Again</button>
</div>
`);
      } else {
        res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
                    <h1>Movie and Category Not Found</h1>
                    <p>Thanks for searching.</p>
                    <button onclick="window.location.href='/views/movie_name.html'">Search Again</button>
                  </div>`);
      }
    });
  });
  




// Route to handle form submission
app.post('/submit', (req, res) => {
    const { First_name, Last_name, Phhone_number,Street_address ,city, state, Zip_code } = req.body;

    // Insert into MySQL database
    db.query(
        'INSERT INTO customer (First_name, Last_name, Phhone_number, Street_address, city, state, Zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [First_name, Last_name, Phhone_number,Street_address ,city, state, Zip_code],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Failed to insert data into database');
                return;
            }
            // res.send('Data inserted successfully');
            res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
                <h1>Customer information Added successfully</h1>
                <p>Thanks for adding .</p>
                <button onclick="window.location.href='/views/add.html'">Add-Again</button>
              </div>`);
        }
    );
});


// Route to handle form submission for new letters
app.post('/news', (req, res) => {
    const { First_name, Last_name, Phhone_number,Street_address ,city, state, Zip_code } = req.body;

    // Insert into MySQL database
    db.query(
        'INSERT INTO customer (First_name, Last_name, Phhone_number, Street_address, city, state, Zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [First_name, Last_name, Phhone_number,Street_address ,city, state, Zip_code],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Failed to insert data into database');
                return;
            }
            // res.send('Data inserted successfully');
            res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
                <h1> information Added successfully</h1>
                <p>Thanks for subscribing to our news letters .</p>
                <button onclick="window.location.href='/views/login.html"> Home </button>
              </div>`);
        }
    );
});




  // route to handle search for customer request
  app.post('/details', (req, res) => {
    const searchQuery = req.body.query;
    const sql = `SELECT * FROM customer WHERE phhone_number = ? OR last_name = ?`;
  
    db.query(sql, [`${searchQuery}`, `${searchQuery}`], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.send('An error occurred while searching.');
        return;
      }
  
      if (results.length > 0) {
        res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center; width: 100%;">
    <h1>Search Results:</h1>
    <h2> Customer infomation </h2>
    <table style="width: 100%; border: 1px solid white; border-collapse: collapse;">
            <tr>
                <th  style="border: 1px solid white; padding: 8px; color: white;>customer_id</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>first_name</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>last_name</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>phone_number</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>street_address</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>city</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>state</th>
                <th  style="border: 1px solid white; padding: 8px; color: white;>Zip_code</th>
            </tr>
        
            ${results.map(customer => `
                <tr>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.customer_id}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.First_name}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.Last_name}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.Phhone_number}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.Street_address}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.city}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.state}</td>
                    <td style="border: 1px solid white; padding: 8px; color: white;>${customer.Zip_code}</td>
                </tr>
            `).join('')}

    </table>
    <button onclick="window.location.href='/views/search_customer.html'">Search Again</button>
</div>
`);
      } else {
        res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
                    <h1> customer  information does not exist </h1>
                    <h2> you can go to the add menu and click the button to add a customer information </h2>
                    <p>Thanks for searching.</p>
                    <button onclick="window.location.href='/views/search_customer.html'">Search Again</button>
                  </div>`);
      }
    });
  });
  





// Route to handle form for adding a movie 
app.post('/movie', (req, res) => {
    const {  movie_name, movie_type, price, tax} = req.body;

    // Insert into MySQL database
    db.query(
        'INSERT INTO movie ( movie_name, movie_type, price, tax  ) VALUES (?, ?, ?, ? )',
        [movie_name, movie_type, price, tax],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Failed to insert data into database');
                return;
            }
            // res.send('Data inserted successfully');
            res.send(`<div style="color: white; text-align: center; background-color: black; align-items: center;">
                <h1>Movie Added successfully</h1>
                <p>Thanks for adding .</p>
                <button onclick="window.location.href='/views/add_movie.html'">Add-Again</button>
              </div>`);
        }
    );
});





// route for ssrc 

// server.js (additional code)
// const ssrsReportUrl = 'YOUR_SSRS_REPORT_URL'; // URL to the SSRS report

// app.get('/ssrs-report', (req, res) => {
//     res.json({ embedUrl: ssrsReportUrl });
// });





// ssrs testing one two 
// server.js (additional code)
// const powerBIEmbedToken = 'YOUR_POWERBI_EMBED_TOKEN'; // Generate this from Power BI Service

// app.get('/powerbi-report', async (req, res) => {
//     try {
//         const reportId = 'YOUR_REPORT_ID';
//         const groupId = 'YOUR_GROUP_ID';
//         const response = await axios.get(`https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`, {
//             headers: { 'Authorization': `Bearer ${powerBIEmbedToken}` }
//         });
//         const embedUrl = response.data.embedUrl;
//         res.json({ embedUrl });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });



// Route to handle form submission
app.post('/order', async (req, res) => {
    const { customer_Id, movie_Id, price, tax } = req.body;
    const rentalDate = new Date();
    const totalPrice = parseFloat(price) + parseFloat(tax);

    try {
        // Insert into rental table
        const rentalResult = await db.query(
            'INSERT INTO rental (customer_id, rental_date, total_price) VALUES ($1, $2, $3) RETURNING rental_id',
            [customer_Id, rental_Date, total_Price]
        );
        const rentalId = rentalResult.rows[0].rental_id;

        // Insert into rental_details table
        await db.query(
            'INSERT INTO rental_details (rental_id, movie_id, price, tax, total_price) VALUES ($1, $2, $3, $4, $5)',
            [rental_Id, movie_Id, price, tax, totalPrice]
        );

        res.status(200).send('Order placed successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error placing order');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});