import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { MovieInterface } from "../../App.types";
import { TextareaAutosize, Rating, Button } from '@mui/material';
import { useEffect, useRef } from "react";
import "./style.css";

interface ReviewFormInterface {
    GetSelectedMovie: MovieInterface;
    PostReview: (value:any) => void;
    GetReviewModal: boolean;
    SetReviewModal: (value: boolean) => void;
}

interface Inputs {
    message: string;
    rating: number;
}

export const ReviewForm = ({GetSelectedMovie, PostReview, GetReviewModal, SetReviewModal}: ReviewFormInterface) => {

    const ref = useRef<HTMLDivElement>(null);

    function outsideClickHandler(e:Event):void {
        if (ref.current && !ref.current.contains(e.target as HTMLDivElement)) {
            SetReviewModal(false);
        } 
    }

    useEffect(() => {
        GetReviewModal && window.addEventListener("mousedown", outsideClickHandler);
        return (() => {
            window.removeEventListener("mousedown", outsideClickHandler);
        });
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
      } = useForm<Inputs>()
      const onSubmit: SubmitHandler<Inputs> = (data) => {
        PostReview({
            movieId: GetSelectedMovie.id,
            movieTitle: GetSelectedMovie.title,
            message: data.message,
            rating: data.rating
        });
        SetReviewModal(false);
    }
    
    return (
        <div className={GetReviewModal ? "review-form-container active" : "review-form-container"}>
            <div className="overlay"></div>
            <div ref={ref} className="review-form-wrapper">
                <div className="close-wrapper">
                    <span className="close" onClick={() => SetReviewModal(false)}>Close</span>
                </div>
                {GetSelectedMovie ? GetSelectedMovie.title as string ? "You have selected " +  GetSelectedMovie.title  as string : "No Movie Title" : "No Movie Seelcted"}
                {GetSelectedMovie && <p>Please leave a review below</p> }
                {GetSelectedMovie && 
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>                               
                        <Controller 
                            control={control}
                            name={"rating"} 
                            rules={{ required: {value: true, message: "Please Select a Rating."} }}
                            render={({field: {onChange, value} })=> <Rating name={"rating"} max={10} precision={0.5} onChange={onChange} value={Number(value)}/>}
                        />
                        {errors.rating && <span className="error">{errors.rating.message}</span>}
                        <TextareaAutosize 
                            {...register("message", { maxLength: {
                                value: 100,
                                message: "Too Many Characters"
                            }})}
                            placeholder="Please enter your review..."
                        />
                        {errors.message && <span className="error">{errors.message.message}</span>}
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>  
                </> 
            }
            </div>
        </div>
    );
}