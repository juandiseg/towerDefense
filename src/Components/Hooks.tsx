import { useRef } from "react";

export default function useOnDraw(onDraw:any, width:number, height:number){

    const canvasRef = useRef(null);
    
    function setCanvasRef(ref:any){
        if(!ref) return;
        canvasRef.current = ref;
        //initMouseMoveListener()
        initClickListener()
    }

    function initMouseMoveListener(){
        const mouseMoveListener = (e:any) => {
            const coordinates = computePointInCanvas(e.clientX, e.clientY)
            // do smtg with it
        }
        window.addEventListener("mousemove", mouseMoveListener)
    }

    function initClickListener(){
        const clickListener = (e:any) => {
            const coordinates = computePointInCanvas(e.clientX, e.clientY)
            if(coordinates == null){
                console.log("You clicked outside the canvas...")
            } else {
                console.log(coordinates)
                const ctx = canvasRef.current.getContext('2d');
                if(onDraw){
                    onDraw(ctx, coordinates);
                }
            }
        }
        window.addEventListener("click", clickListener)
    }

    function computePointInCanvas(asbX:number, absY:number){
        if(canvasRef.current){
            const boundingRect = canvasRef.current.getBoundingClientRect();
            let relativeCoord = {
                x: asbX-boundingRect.left,
                y: absY-boundingRect.top, 
            }
            if(relativeCoord.x < 0 || relativeCoord.x > width){
                return null;
            }
            if(relativeCoord.y<0 || relativeCoord.y > height){
                return null;
            }
            return relativeCoord
        }
        return null;
    }

    //function draw

    return setCanvasRef;
}