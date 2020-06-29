class PCA{
    constructor(cols, selected_nodes){
        this.cols = cols;
        this.selected_nodes = selected_nodes;
        console.log(this.cols)

    }

    clear_canvas(){
        $("#pca_svg").remove();
    }

    draw_PCA(arr){
        console.log('pca',arr)
        this.clear_canvas();
        let arr_new = [];
        arr.split("n").forEach(d=>{
            let d_new = d.split("[")[1];
            if(d_new){
                arr_new.push(d_new.split(","))
            }
        });
        arr_new = arr_new.map(d=>d.map(n=>parseFloat(n)))

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        let margin = {"left":20, "top":20, "right":10, "bottom":15};
        let width = $(d3.select("#PCA-panel").select(".block_body-inner").node()).width();
        let height = width+5;
        let x = arr_new.map(d=>d[0]);
        let y = arr_new.map(d=>d[1]);
        let xScale = d3.scaleLinear()
            .domain([Math.min(...x), Math.max(...x)])
            .range([margin.left, width-margin.right]);
        let yScale = d3.scaleLinear()
            .domain([Math.min(...y), Math.max(...y)])
            .range([margin.top, height-margin.bottom]);
        let pca_svg = d3.select("#PCA-panel").select(".block_body-inner").append("svg")
            .attr("id", "pca_svg")
            .attr("width", width)
            .attr("height", height);
        pca_svg.append("g").attr("id","axis_group");
        pca_svg.append("g").attr("id", "circle_group");

        let cg = d3.select("#circle_group").selectAll("circle").data(arr_new);
        cg.exit().remove();
        cg = cg.enter().append("circle").merge(cg)
            .attr("cx", d=>xScale(d[0]))
            .attr("cy", d=>yScale(d[1]))
            .attr("r", 2)
            .attr("fill", d=>{
                // if(this.selected_nodes.length<=20){
                //     return color(parseInt(d[2]));
                // } else {return "none";}
                return color(parseInt(d[2]));
            })
            .attr("stroke",d=>{
                if(this.selected_nodes.length<=20){
                    return "none";
                } else {return "gray";}
            })
            
        // x-axis
        d3.select("#axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        
        // y-axis
        d3.select("#axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");
    }
}