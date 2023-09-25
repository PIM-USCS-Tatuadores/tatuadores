DROP SCHEMA tattoo CASCADE;
CREATE SCHEMA tattoo;

CREATE TABLE tattoo.user (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tattoo.artist (
  id UUID PRIMARY KEY,
  cpf TEXT,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tattoo.flashday (
  id UUID PRIMARY KEY,
  artist_id UUID not null,
  title TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  phone TEXT NOT NULL,
  active BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (artist_id) REFERENCES tattoo.artist(id)
);

CREATE TABLE tattoo.flashdayview (
  id UUID PRIMARY KEY,
  flashday_id UUID NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (flashday_id) REFERENCES tattoo.flashday(id)
);

CREATE TABLE tattoo.art (
  id UUID PRIMARY KEY,
  flashday_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  size NUMERIC NOT NULL,
  href TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (flashday_id) REFERENCES tattoo.flashday(id)
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
