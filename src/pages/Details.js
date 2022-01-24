import { useEffect } from "react";
import { Card } from "react-bootstrap";



const Details = ({ stickers }) => {
    useEffect(() => {


    })

    return ( 
        <div>  
            <div style={{display:"flex", gap:"20px", padding:"10px"}}> 
                <div style={{backgroundColor:"#804C75", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>Total Claims </div>
                        <div>0</div>
                    </Card.Body>
                </div>
                <div style={{backgroundColor:"#FFB848", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>Settled Claims</div>
                        <div>0</div>
                    </Card.Body>
                </div> 
            </div>   
            <div style={{display:"flex", gap:"20px", padding:"10px"}}> 
                <div style={{backgroundColor:"#C82E29", width:"100%", borderRadius:"10px"}}>
                    <Card.Body style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                        <div> Total Stickers</div>
                        <div>{stickers}</div>
                    </Card.Body>
                </div>
                <div style={{backgroundColor:"#1FBBA6", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>settledStickers</div>
                        <div>0</div>
                    </Card.Body>
                </div>  
            </div>    
        </div>
    );
}
 
export default Details;
