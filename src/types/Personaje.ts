export interface Personaje {
  id: string;
  nombre: string;
  imagen: string;
  raza: string;
  ki: string;
  afiliacion: string;
}

export interface ApiPersonaje {
  _id?: string;
  id?: string | number;
  Nombre?: string;
  nombre?: string;
  name?: string;
  Imagen?: string;
  imagen?: string;
  image?: string;
  Raza?: string;
  raza?: string;
  race?: string;
  ki?: string;
  Ki?: string;
  Afiliacion?: string;
  afiliacion?: string;
  affiliation?: string;
}
