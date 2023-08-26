DROP TABLE IF EXISTS tattoo.eventview;
DROP TABLE IF EXISTS tattoo.artview;
DROP TABLE IF EXISTS tattoo.contact;
DROP TABLE IF EXISTS tattoo.art;
DROP TABLE IF EXISTS tattoo.event;
DROP TABLE IF EXISTS tattoo.user;
DROP TABLE IF EXISTS tattoo.image;

DROP SCHEMA IF EXISTS tattoo;
CREATE SCHEMA tattoo;

CREATE TABLE tattoo.user (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tattoo.event (
  id UUID PRIMARY KEY,
  user_id UUID not null,
  title TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  phone TEXT NOT NULL,
  active BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES tattoo.user(id)
);

CREATE TABLE tattoo.eventview (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (event_id) REFERENCES tattoo.event(id)
);

CREATE TABLE tattoo.image (
  id TEXT PRIMARY KEY,
  href TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE tattoo.art (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  image_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  size NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (event_id) REFERENCES tattoo.event(id),
  FOREIGN KEY (image_id) REFERENCES tattoo.image(id)
);

CREATE TABLE tattoo.artview (
  id UUID PRIMARY KEY,
  art_id UUID NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (art_id) REFERENCES tattoo.art(id)
);

CREATE TABLE tattoo.contact (
  id UUID PRIMARY KEY,
  art_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NULL,
  accept_contact BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (art_id) REFERENCES tattoo.art(id)
);
