import react from "react";
import { Fragment } from "react/cjs/react.production.min";


const Rank = ({name, entries}) => {
    return (
        <Fragment>
        <div className="white f3"> 
        {`${name}, your current entry count is: `}
        </div>  
        <div className="white f1"> 
            {`${entries} `}
        </div>  

        </Fragment>
    );
}

export default Rank;