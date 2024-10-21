import { useRef, useState, useEffect, useCallback} from 'react';
import { Button } from '@mui/material';
import { MovieCompaniesInterface, MovieInterface, ReviewInterface, HeadCellsInterface } from './App.types';
import { EnhancedTable } from './components/EnhancedTable/EnhancedTable';
import { ReviewForm } from './components/ReviewForm/ReviewForm';
import { Messages } from './components/Messages/Messages';
import CircularProgress from '@mui/material/CircularProgress';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4321';

const HeadCells:Array<HeadCellsInterface> = [
	{
		  id: 'title',
		  numeric: false,
		  disablePadding: false,
		  label: 'Title'
	},
	{
		  id: 'reviews',
		  numeric: true,
		  disablePadding: false,
		  label: 'Review'
	},
	{
		  id: 'filmCompanyId',
		  numeric: true,
		  disablePadding: false,
		  label: 'Film Company'
	}
];

export const App = () =>  {

	const [getMovieCompanyData, setMovieCompanyData] = useState<Array<MovieCompaniesInterface>>();
	const [getMovieData, setMovieData] = useState<Array<MovieInterface>>();
	const [getSelectedMovie, setSelectedMovie] = useState<MovieInterface | undefined>();
	const [getReviewModal, setReviewModal] = useState<boolean>(false);
	const movieLength = useRef<number>(0);
	const [getFormSubmit, setFormSubmit] = useState<{message: string} | undefined>();
	const [getMovieCompaniesError, setMovieCompaniesError] = useState<boolean>(false);
	const [getMoviesError, setMoviesError] = useState<boolean>(false);

	useEffect(() => {
    	getMovieCompanies();
    	getMovies();
  	}, []);

  	const getMovieCompanies = async () => {
    	const Response:Array<MovieCompaniesInterface> = await fetch(`${BASE_URL}/movieCompanies`).then(function(response) {
    		if(response.status === 200) {
        		setMovieCompaniesError(false);
        		return response.json();
      		}
      		throw new Error('Something went wrong! Unable to fetch Movie Companies.');
    	}).then(function(data) {
    		return data;
    	}).catch(function(error) {
    		console.error('Request Failed ', error);
    		setMovieCompaniesError(true);
    	});
    	setMovieCompanyData(Response);
	}

	const getMovies = async () => {
    	const Response:Array<MovieInterface> = await fetch(`${BASE_URL}/movies`).then(function(response) {
    		if(response.status === 200) {
        		setMoviesError(false);
        		return response.json();
      		}
      		throw new Error('Something went wrong! Unable to fetch Movies.');
    	}).then(function(data) {
			movieLength.current = data?.length;
      		return data;
    	}).catch(function(error) {
			movieLength.current = 0;
      		console.log('Request Failed ', error);
      		setMoviesError(true);
    	});
    	setMovieData(Response);
  	}

	async function postReviews(message:ReviewInterface) {
    	const config = {
      		method: 'POST',
      		headers: {
          		'Accept': 'application/json',
          		'Content-Type': 'application/json',
      		},
      		body: JSON.stringify(message)
    	}
    	const Response = await fetch(`${BASE_URL}/submitReview`, config).then((response) => {
      		if(response.status === 200) {
        		return response.json();
      		} 
			throw new Error('Something went wrong! Unable to Submit Review.');
    	}).then((data) => {
			setSelectedMovie(undefined);
			return data;
    	}).catch(function(error) {
      		console.error('Request Failed ', error);
    	});
		setFormSubmit(Response);
  	}

  	const getAverage = useCallback((numbers:Array<number>):number => {
    	const Average = numbers.reduce((a:number, b:number) => a + b) / numbers.length;
    	return Number(Average.toFixed(1));
  	},[]);

  	const getFilmCompany = useCallback((id:string):string => {
    	const Company = getMovieCompanyData?.find(item => item.id == id);
    	return Company && Company.name || "";
  	}, [getMovieCompanyData])

  	const refreshButton = useCallback((buttonText: any) => {
    	return <Button variant="contained" onClick={() => {
      		getMovies();
      		getMovieCompanies();
      		setSelectedMovie(undefined);
			setFormSubmit(undefined);
    	}}>{buttonText}</Button>;
  	}, [getMovieData]);

 	return (
    	<div className='movies-container'>
      		<h2>Welcome to Movie database!</h2>
      		<div className='refresh-button-container'>
        		{refreshButton("Refresh")}
      		</div>
      		<p>Total movies displayed {movieLength.current}</p>
      
      		{getMovieData ?
        		<EnhancedTable 
          			HeadCells={HeadCells}
          			GetMovieData={getMovieData} 
          			SetSelectedMovie={setSelectedMovie} 
          			GetSelectedMovie={getSelectedMovie} 
          			GetAverage={getAverage} 
          			GetFilmCompany={getFilmCompany} 
          			GetReviewModal={getReviewModal} 
          			SetReviewModal={setReviewModal}
          			GetMovieCompaniesError={getMovieCompaniesError}
        		/> : getMoviesError ?
        		<div className='movies-error-container'>
            		<Messages Message='Unable to Load Movies' Type="error" />
            		<p>Please Refresh</p>
            		{refreshButton("Refresh")}
        		</div> :
				<div className='loader-container'>
					<p>Loading...</p>
					<CircularProgress />
				</div>
      		}

      		{getSelectedMovie && 
        		<ReviewForm 
          			GetSelectedMovie={getSelectedMovie}
          			PostReview={postReviews} 
          			GetReviewModal={getReviewModal} 
          			SetReviewModal={setReviewModal}
        		/>
      		}

      		{getFormSubmit && 
        		<div className='submit-success-container'>
          			<Messages Message={getFormSubmit.message} Type="success"/>
        		</div>
      		}
    
    	</div>
  	);
}