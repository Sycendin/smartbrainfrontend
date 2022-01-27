import react, { Fragment } from "react";
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => {

    //<img id='inputImage' alt="generated image:" src={imageUrl} width={'500px'} height={'auto'} />

  
    return (
        <div className="center">
            <div className="absolute m2">
            <img id='inputImage' alt="generated image:" src={imageUrl} width='500px' height='auto' opacity = '0.5' />
            <div className="bounding-box" style={{ top:box.topRow, right:box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
            </div>
            </div>
            
            
        </div>
    )

}

export default FaceRecognition;