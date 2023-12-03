import useOnDraw from "./Hooks"

const Canvas = (width:number, height:number) =>{
    
    
    function drawRectangle(ctx:any, point:any) {
        const recHeight = 80
        const recWidth = 50
        if(point != null){
            ctx.beginPath();
            ctx.rect(point.x - recWidth/2,point.y - recHeight/2, recWidth, recHeight)
            ctx.stroke()
        } else {
            console.log("point not possible")
        }
    }

    const setCanvasRef = useOnDraw(drawRectangle, width, height);

    return (
        <canvas
            width={width}
            height={height}
            style={canvasStyle}
            ref={setCanvasRef}
        />)
}

export default Canvas;

const canvasStyle = {
    border: "1px solid black"
}

