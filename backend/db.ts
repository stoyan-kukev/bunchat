import { randomUUIDv7 } from "bun";
import { Database } from "bun:sqlite";

export const db = new Database(":memory:");

db.run(`
CREATE TABLE user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL
);
`);

db.run(`
CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);
`);

db.run(`
CREATE TABLE room (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);    
`);

db.run(`
CREATE TABLE message (
    id TEXT NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL
);
`);

db.run(`
INSERT INTO room VALUES ("${randomUUIDv7()}", "test room");
`);
