import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Rating, TableSortLabel, Box, SortDirection } from '@mui/material';
import { MovieInterface } from '../../App.types';
import { useState, useMemo } from 'react';
import { visuallyHidden } from '@mui/utils';
import './style.css';
import { Messages } from '../Messages/Messages';

interface EnhancedTableCells {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

interface EnhancedTableProps {
    HeadCells: Array<EnhancedTableCells>;
    GetMovieData: Array<MovieInterface>;
    SetSelectedMovie: (move:MovieInterface) => void;
    GetSelectedMovie: MovieInterface | undefined;
    GetAverage: (array:Array<number>) => number;
    GetFilmCompany: (id:string) => string;
    GetReviewModal: boolean;
    SetReviewModal: (value: boolean) => void;
    GetMovieCompaniesError: boolean;
}

type Order = 'asc' | 'desc';

export const EnhancedTable = ({
    HeadCells,
    GetMovieData,
    SetSelectedMovie,
    GetSelectedMovie,
    GetAverage,
    GetFilmCompany,
    GetReviewModal,
    SetReviewModal,
    GetMovieCompaniesError
}:EnhancedTableProps) => {

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof MovieInterface>('reviews');

    const handleRequestSort = (
        property: keyof MovieInterface,
      ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T):number {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    function getComparator(
        order: string | SortDirection,
        orderBy: keyof MovieInterface,
    ): (
        a: MovieInterface,
        b: MovieInterface,
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const visibleRows = useMemo(() => {
        return [...GetMovieData].sort(getComparator(order, orderBy))
    }, [order, orderBy]);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            HeadCells.map((HeadCell) => {
                                return (
                                    <TableCell 
                                        key={HeadCell.id}
                                        align={HeadCell.numeric ? 'right' : 'left'}
                                        padding={HeadCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === HeadCell.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === HeadCell.id}
                                                direction={orderBy === HeadCell.id ? order: 'asc'}
                                                onClick={() => handleRequestSort(HeadCell.id as keyof MovieInterface)}
                                            >
                                                {HeadCell.label}
                                                {orderBy === HeadCell.id ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                    </TableCell>
                                );
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {GetMovieData && visibleRows.map((movie) => (
                        <TableRow
                            className={GetSelectedMovie?.title === movie.title ? 'table-row Mui-selected' : 'table-row'}
                            onClick={() => {
                                SetSelectedMovie(movie)
                                SetReviewModal(!GetReviewModal)
                            }}
                            key={movie.title}
                            tabIndex={-1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {movie.title}
                            </TableCell>
                            <TableCell align="right">
                                <div className='rating-container'>
                                    <Rating name="read-only" value={Number(GetAverage(movie.reviews))} max={10} readOnly /> 
                                    <span className='number'>({GetAverage(movie.reviews)})</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                {GetMovieCompaniesError ? <Messages Message="Unable to Fetch." Type="error" /> : GetFilmCompany(movie.filmCompanyId)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}