const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { query } = require('express');

//setting up connection to database

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  let user = email.toLowerCase();

  return pool.query(`SELECT * FROM users WHERE users.email = $1`, [`${user}`])
    .then(data => {
      if (data.rows.length) {
        return data.rows[0];
      }
      return null;
    })
    .catch(error => {
      console.log(error);
    })
}


exports.getUserWithEmail = getUserWithEmail;



/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE users.id = $1`, [id])
    .then(data => {
      if (data.rows.length) {
        return data.rows[0];
      }
      return null
    })
    .catch(error => console.log(error));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  return pool.query(`INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3) RETURNING *`, [`${user.name}`, `${user.email}`, `${user.password}`])
      .then(data => data.rows[0])
      .catch(error => console.log(error));
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  return pool.query(`SELECT reservations.*, properties.*
    FROM reservations
    JOIN users
    ON guest_id = users.id
    JOIN properties
    ON properties.id = property_id
    WHERE users.id = $1
    ORDER BY reservations.start_date DESC
    LIMIT $2;`, [guest_id, limit])
    .then(data => {
      if (data.rows.length) {
        return data.rows;
      }
      return null;
    })
    .catch(error => console.log(error));

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = function (options, limit = 10) {
  
  const queryParams = [];
 
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {

    queryParams.push(options.owner_id);

    queryParams.length > 1 ? queryString += `AND owner_id = $${queryParams.length} `
      : queryString += `WHERE owner_id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night) {

    queryParams.push(Number(options.minimum_price_per_night) * 100);

    queryParams.length > 1 ? queryString += `AND cost_per_night >= $${queryParams.length} `
      : queryString += `WHERE cost_per_night >= $${queryParams.length} `
  }

  if (options.maximum_price_per_night) {

    queryParams.push(Number(options.maximum_price_per_night) * 100);

    queryParams.length > 1 ? queryString += `AND cost_per_night <= $${queryParams.length} `
      : queryString += `WHERE cost_per_night <= $${queryParams.length} `
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating))
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

 
  console.log(queryString, queryParams);


  return pool.query(queryString, queryParams).then((res) => res.rows);
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
 
  return pool.query(`INSERT INTO properties (
    title, description, owner_id, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, 
    country, city, province, post_code, active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;`, [`${property.title}`, `${property.description}`, Number(property.owner_id), Number(property.number_of_bedrooms), 
    Number(property.number_of_bathrooms), Number(property.parking_spaces), Number(property.cost_per_night) * 100, `${property.thumbnail_photo_url}`,
    `${property.cover_photo_url}`, `${property.street}`, `${property.country}`, `${property.city}`, `${property.province}`, `${property.post_code}`, 'TRUE'])
    .then(data => data.rows[0])
    .catch(error => console.log(error));
  
}
exports.addProperty = addProperty;
