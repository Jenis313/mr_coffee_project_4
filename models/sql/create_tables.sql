DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS schedules(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    day VARCHAR(9) NOT NULL,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
                ON DELETE CASCADE
);
