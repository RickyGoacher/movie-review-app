export interface MovieCompaniesInterface {
    id: string;
    name: string;
}
  
export interface MovieInterface {
    cost: number;
    filmCompanyId: string;
    id: string;
    releaseYear: number;
    reviews: Array<number>;
    title: string; 
}

export interface ReviewInterface {
    movieId: string;
    movieTitle: string;
    message: string;
    review: number;
}

export interface HeadCellsInterface {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
	label: string;
}