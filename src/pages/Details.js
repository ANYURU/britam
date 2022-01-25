import { useEffect } from "react";
import { Card } from "react-bootstrap";



const Details = ({ totalStickers, totalClaims, settledClaims, organisations}) => {
    useEffect(() => {


    })

    return ( 
        <div>  
            <div style={{display:"flex", gap:"20px", padding:"10px"}}> 
                <div style={{backgroundColor:"#804C75", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>Total Claims</div>
                        <div>{totalClaims}</div>
                    </Card.Body>
                </div>
                <div style={{backgroundColor:"#FFB848", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>Settled Claims</div>
                        <div>{settledClaims}</div>
                    </Card.Body>
                </div> 
            </div>   
            <div style={{display:"flex", gap:"20px", padding:"10px"}}> 
                <div style={{backgroundColor:"#C82E29", width:"100%", borderRadius:"10px"}}>
                    <Card.Body style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                        <div> Total Stickers</div>
                        <div>{totalStickers}</div>
                    </Card.Body>
                </div>
                <div style={{backgroundColor:"#1FBBA6", width:"100%", borderRadius:"10px"}}>
                    <Card.Body>
                        <div>Organisations</div>
                        <div>{organisations}</div>
                    </Card.Body>
                </div>  
            </div>    
        </div>
    );
}
 
export default Details;
