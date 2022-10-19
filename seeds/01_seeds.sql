INSERT INTO users (name, email, password) VALUES
  ('JOHN', 'hi', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('mary', 'why', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('roman', 'bye', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
cost_per_night, parking_spaces, number_of_bathrooms,
country, street, city, province, post_code, active) VALUES
  (1, 'SILLY HOUSE', 'description', 'url', 'url', 100, 65, 78, 'silly country', 'fun street', 'hi city', 'fun province', '12345', TRUE),
  (2, 'SILLY SE', 'description', 'url', 'url', 100, 5, 7, 'silly country', 'fun street', 'hi city', 'fun province', '1245', TRUE),
  (3, 'S HOUSE', 'description', 'url', 'url', 10, 6, 8, 'silly country', 'fun street', 'hi city', 'fun province', '1245', TRUE);

INSERT INTO reservations (property_id, guest_id, start_date, end_date) VALUES 
  (1, 2, '2019-03-15', '2019-03-17'),
  (3, 1, '2019-03-15', '2019-03-17'),
  (2, 1, '2019-03-15', '2019-03-17');
