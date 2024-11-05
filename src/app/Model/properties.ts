export interface PropertiesModel {
  id?: number;
  city: string;
  name: string;
  shared: string;
  location: string;
  image: string;
  discription: string;
  detailes: string;
  rent: number;
  furnished: string;
  favorite: boolean;
  comments?: CommentModel[];
  amenities?: AmenityModel[] | string[];
}

export interface CommentModel {
  user: string;
  text: string;
  date: string;
}

export interface AmenityModel {
  item: string;
}
