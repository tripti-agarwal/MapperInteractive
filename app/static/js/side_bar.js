class DataLoader{
    constructor(all_cols, categorical_cols, other_cols){
        this.all_cols = all_cols;
        this.selected_cols = all_cols.slice(0);
        this.selectable_cols = [];
        this.categorical_cols = categorical_cols;
        this.other_cols = other_cols;

        this.config = {};
  
        this.draw_clustering_params("DBSCAN");
        this.draw_all_cols();
        this.draw_selected_cols();
        this.draw_filter_dropdown();
        this.draw_filter_dropdown2();
        this.draw_label_dropdown();
        this.initialize_config();
        this.edit_param();
    }

    initialize_config(){
        let that = this;

        // 1. Normalization
        this.config.norm_type = d3.select('input[name="norm-type"]:checked').node().value;
        d3.select("#norm-type-form")
            .on("change", ()=>{
                this.config.norm_type = d3.select('input[name="norm-type"]:checked').node().value;
            })

        // 2. filtration
        d3.select("#mapper-dim-form")
            .on("change", ()=>{
                let mapper_dim = d3.select('input[name="mapper-dim"]:checked').node().value;
                let filter2 = document.getElementById("filter-inner-2");
                if(mapper_dim === "mapper_1d"){
                    that.config.filter = [filter_dropdown.options[filter_dropdown.selectedIndex].text];
                    filter2.style.maxHeight = 0;
                } else if (mapper_dim === "mapper_2d"){
                    if(this.filters.length > 1){
                        filter2.style.maxHeight = "300px";
                        this.draw_filter_dropdown2();
                        this.update_filter();
                    } else{
                        alert("Only one column selectable!");
                        d3.select("#mapper_1d").property("checked", true);
                    }
                }
            })

        let clustering_dropdown = document.getElementById("clustering_alg_selection");
        this.config.clustering_alg = "DBSCAN";
        this.config.clustering_alg_params = {};
        this.get_clustering_params("DBSCAN");
        clustering_dropdown.onchange = function(){
            let clustering_alg = clustering_dropdown.options[clustering_dropdown.selectedIndex].text;
            //console.log(clustering_alg)
            that.config.clustering_alg = clustering_alg;
            that.config.clustering_alg_params = {};
            that.draw_clustering_params(clustering_alg);
            that.get_clustering_params(clustering_alg);
            //console.log(that.config.clustering_alg_params)
        }

        // // eps
        // let eps_slider = document.getElementById("dbscan_eps-input");
        // this.config.eps = eps_slider.value;
        // eps_slider.oninput = function(){
        //     that.config.eps = this.value;
        //     d3.select("#dbscan_eps_label")
        //         .html(this.value);
        // }

        // // min samples
        // let min_samples_slider = document.getElementById("dbscan_min_samples-input");
        // this.config.min_samples = min_samples_slider.value;
        // min_samples_slider.oninput = function(){
        //     that.config.min_samples = this.value;
        //     d3.select("#dbscan_min_samples_label")
        //         .html(this.value);
        // }

        let filter_dropdown = document.getElementById("filter_function_selection");
        filter_dropdown.onchange = function(){
            let mapper_dim = d3.select('input[name="mapper-dim"]:checked').node().value;
            if(filter_dropdown.options){
                let filter = filter_dropdown.options[filter_dropdown.selectedIndex].text;
                let eccent_param_container = document.getElementById("eccent-param-container-inner");
                let density_param_container = document.getElementById("density-param-container-inner");
                if(filter === "Eccentricity"){
                    eccent_param_container.style.maxHeight = eccent_param_container.scrollHeight + "px";
                } else {
                    eccent_param_container.style.maxHeight = null;
                }
                if(filter === "Density"){
                    density_param_container.style.maxHeight = density_param_container.scrollHeight + "px";
                } else {
                    density_param_container.style.maxHeight = null;
                }
                if(mapper_dim === "mapper_1d"){
                    that.config.filter = [filter];
                } else if(mapper_dim === "mapper_2d"){
                    that.config.filter[0] = filter;
                    that.draw_filter_dropdown2();
                }
            }
        }

        let filter_dropdown2 = document.getElementById("filter_function_selection2");
        filter_dropdown2.onchange = function(){
            if(filter_dropdown2.options){
                let filter = filter_dropdown2.options[filter_dropdown2.selectedIndex].text;
                that.config.filter[1] = filter;
                let eccent_param_container = document.getElementById("eccent-param-container-inner2");
                let density_param_container = document.getElementById("density-param-container-inner2");
                if(filter === "Eccentricity"){
                    eccent_param_container.style.maxHeight = eccent_param_container.scrollHeight + "px";
                } else{
                    eccent_param_container.style.maxHeight = null;
                }
                if(filter === "Density"){
                    density_param_container.style.maxHeight = density_param_container.scrollHeight + "px";
                } else{
                    density_param_container.style.maxHeight = null;
                }
                that.draw_filter_dropdown();
            }
        }

        // the default is 1d
        if(filter_dropdown.options[filter_dropdown.selectedIndex]){
            this.config.filter = [filter_dropdown.options[filter_dropdown.selectedIndex].text];
        }

        //3. Parameters
        // interval
        let interval_slider1 = document.getElementById("interval1_input");
        this.config.interval1 = interval_slider1.value;
        interval_slider1.oninput = function(){
            that.config.interval1 = this.value;
            d3.select("#interval1_label")
                .html(this.value);
        }

        let interval_slider2 = document.getElementById("interval2_input");
        this.config.interval2 = interval_slider2.value;
        interval_slider2.oninput = function(){
            that.config.interval2 = this.value;
            d3.select("#interval2_label")
                .html(this.value);
        }

        // overlap
        let overlap_slider1 = document.getElementById("overlap1_input");
        this.config.overlap1 = overlap_slider1.value;
        overlap_slider1.oninput = function(){
            that.config.overlap1 = this.value;
            d3.select("#overlap1_label")
                .html(this.value);
        }

        let overlap_slider2 = document.getElementById("overlap2_input");
        this.config.overlap2 = overlap_slider2.value;
        overlap_slider2.oninput = function(){
            that.config.overlap2 = this.value;
            d3.select("#overlap2_label")
                .html(this.value);
        }
        //number of intervals
        let number_slider1 = document.getElementById("number1_input");
        this.config.number1 = number_slider1.value;
        number_slider1.oninput = function(){
            that.config.number1 = this.value;
            d3.select("#number1_label")
                .html(this.value);
        }

        let number_slider2 = document.getElementById("number2_input");
        this.config.number2 = number_slider2.value;
        number_slider2.oninput = function(){
            that.config.number2 = this.value;
            d3.select("#number2_label")
                .html(this.value);
        }
	//stride
        let stride_slider1 = document.getElementById("stride1_input");
        this.config.stride1 = stride_slider1.value;
        stride_slider1.oninput = function(){
            that.config.stride1 = this.value;
            d3.select("#stride1_label")
                .html(this.value);
        }

        let stride_slider2 = document.getElementById("stride2_input");
        this.config.stride2 = stride_slider2.value;
        stride_slider2.oninput = function(){
            that.config.stride2 = this.value;
            d3.select("#stride2_label")
                .html(this.value);
        }
    }

    get_clustering_params(clustering_alg) {
        let that = this;
        if(clustering_alg === "DBSCAN"){
            // eps
            let eps_slider = document.getElementById("dbscan_eps-input");
            this.config.clustering_alg_params.eps = eps_slider.value;
            eps_slider.oninput = function(){
                that.config.clustering_alg_params.eps = this.value;
                d3.select("#dbscan_eps_label").html(this.value);
            }

            // min samples
            let min_samples_slider = document.getElementById("dbscan_min_samples-input");
            this.config.clustering_alg_params.min_samples = min_samples_slider.value;
            min_samples_slider.oninput = function(){
                that.config.clustering_alg_params.min_samples = this.value;
                d3.select("#dbscan_min_samples_label").html(this.value);
            }
        } else if(clustering_alg === "Agglomerative Clustering"){
            // linkage
            let linkage_dropdown = document.getElementById("agglomerative_linkage-selection");
            this.config.clustering_alg_params.linkage = linkage_dropdown.options[linkage_dropdown.selectedIndex].text;
            linkage_dropdown.onchange = function(){
                that.config.clustering_alg_params.linkage = linkage_dropdown.options[linkage_dropdown.selectedIndex].text;
            }
            // distance threshold
            let dist_slider = document.getElementById("agglomerative_dist-input");
            this.config.clustering_alg_params.dist = dist_slider.value;
            dist_slider.oninput = function(){
                that.config.clustering_alg_params.dist = this.value;
                d3.select("#agglomerative_dist_label").html(this.value);
            }

        } else if(clustering_alg === "Mean Shift"){
            // bandwidth
            let bandwidth_slider = document.getElementById("meanshift_bandwidth-input");
            this.config.clustering_alg_params.bandwidth = bandwidth_slider.value;
            bandwidth_slider.oninput = function(){
                that.config.clustering_alg_params.bandwidth = this.value;
                d3.select("#bandwidth_slider_label").html(this.value);
            }
        }
    }

    add_range_slider(container_id, range_name, range_id, initial_val, max_val, min_val, step=0.01){
        let form_container = d3.select("#"+container_id).append("div")
            .classed("form-group", true)
            .classed("ui-form-range", true)
            .attr("id", range_id+"-form-container");
        form_container.append("label").classed("ui-form-range__label", true).html(range_name);
        form_container.append("span")
            .classed("ui-form-range__value", true)
            .attr("id", range_id+"_label")
            .html(initial_val);
        let form_limit_container = form_container.append("div")
            .classed("param-range-container_clustering", true)
            ;
        let form_limit_container_inner = form_limit_container.append("div")
            .classed("param-range-container-inner_clustering", true)
            .style("padding","0");
        form_limit_container_inner.append("span")
            .classed("param-range", true)
            .classed("left", true)
            .attr("id", range_id+"-range-left-container")
        form_limit_container_inner.append("span")
            .classed("param-range", true)
            .classed("right", true)
            .attr("id", range_id+"-range-right-container");

        $("#"+range_id+"-range-left-container").append('<input type="number" id='+range_id+'-range-left min="0.01" value='+ min_val +' step='+step+'>');
        $("#"+range_id+"-range-right-container").append('<input type="number" id='+range_id+'-range-right min="0.01" value='+ max_val +' step='+step+'>');
 
	
    

        

        $('#'+range_id+"-form-container").append('<input class="ui-form-range__input" id='+ range_id +'-input name='+ range_id +'-input type="range" value=' + initial_val +' max='+ max_val +' min='+ min_val +' step='+ step +'>');
    }

    add_dropdown(container_id, dropdown_name, dropdown_id, option_list) {
        let dropdown_container = d3.select("#"+container_id).append("div")
            .classed("row", true)
            .style("padding-top", "0px")
            .style("padding-bottom", "10px");
        dropdown_container.append("div")
            .classed("col-6", true)
            .classed("ui-form-range__label", true)
            .style("padding-top", "5px")
            .html(dropdown_name);
        let selection_container = dropdown_container.append("div")
            .classed("col-6", true)
            .attr("id", dropdown_id+"-selection-container");
        let select = selection_container.append("select")
            .classed("custom-select", true)
            .attr("name", dropdown_id+"-selection")
            .attr("id", dropdown_id+"-selection")
        let og = select.selectAll("option").data(option_list)
        og = og.enter().append("option").merge(og)
            .html(d=>d);

    }

    draw_clustering_params(clustering_alg) {
        d3.select("#clustering-paramters-inner").remove();
        d3.select("#clustering-paramters").append("div").attr("id", "clustering-paramters-inner");
        if(clustering_alg === "DBSCAN"){
            this.add_range_slider("clustering-paramters-inner", "eps", "dbscan_eps", 0.1, 0.5, 0.1);
            this.add_range_slider("clustering-paramters-inner", "Min samples", "dbscan_min_samples", 5, 10, 2, 1);
        } else if(clustering_alg === "Agglomerative Clustering"){
            this.add_dropdown("clustering-paramters-inner", "Linkage", "agglomerative_linkage", ["ward", "average", "complete", "single"]);
            this.add_range_slider("clustering-paramters-inner", "Distance threshold", "agglomerative_dist", 0.1, 0.5, 0.1);
        } else if(clustering_alg === "Mean Shift"){
            this.add_range_slider("clustering-paramters-inner", "Bandwidth", "meanshift_bandwidth", 0.1, 0.5, 0.1);
        }
    }

    draw_all_cols(){
        let ag = d3.select("#all-columns-list").select("ul").selectAll("li").data(this.all_cols);
        ag.exit().remove();
        ag = ag.enter().append("li").merge(ag)
            .html(d=>d)
            .on("click",(d)=>{
                if(this.selected_cols.indexOf(d)===-1){
                    this.selected_cols.push(d);
                    this.selectable_cols.splice(this.selectable_cols.indexOf(d),1);
                    this.draw_selected_cols();
                    this.initialize_filter();
                }
            });
    }

    draw_selected_cols(){
        let sg = d3.select("#selected-columns-list").select("ul").selectAll("li").data(this.selected_cols);
        sg.exit().remove();
        sg = sg.enter().append("li").merge(sg)
            .html(d=>d)
            .on("click",(d)=>{
                if(this.selected_cols.length>1){
                    this.selected_cols.splice(this.selected_cols.indexOf(d),1);
                    this.selectable_cols.push(d);
                    this.draw_selected_cols();
                    this.initialize_filter();
                    
                } else {
                    alert("Please select at least 1 column!")
                }
            });
    }

    initialize_filter(){
        // go back to 1d
        d3.select("#mapper_1d").property("checked", true)
        let filter_dropdown = document.getElementById("filter_function_selection");
        this.config.filter = [filter_dropdown.options[filter_dropdown.selectedIndex].text];

        this.draw_filter_dropdown();
        this.update_filter();
    }

    draw_filter_dropdown(){
        if(this.selected_cols.length >= 1){
            // this.filters = this.selectable_cols.concat(["sum", "mean", "median", "max", "min", "std"]);
            this.filters = this.all_cols.concat(["l2norm", "Density", "Eccentricity", "PC1", "PC2", "sum", "mean", "median", "max", "min", "std"]);
            if(this.all_cols.length === 1){
                this.filters = this.all_cols.concat(["l2norm", "Density", "Eccentricity", "PC1", "sum", "mean", "median", "max", "min", "std"]);
            }
        } else {
            this.filters = this.selectable_cols.slice(0);
        }
        let filter = [];
        this.filters.forEach(f=>{
            filter.push(f);
        })
        let mapper_dim = d3.select('input[name="mapper-dim"]:checked').node().value;
        if(mapper_dim === "mapper_2d"){
            let filter_dropdown2 = document.getElementById("filter_function_selection2");
            if(filter_dropdown2.options[filter_dropdown2.selectedIndex]){
                let selected_filter = filter_dropdown2.options[filter_dropdown2.selectedIndex].text;
                filter.splice(filter.indexOf(selected_filter),1);

            }
        }        

        let fg = d3.select("#filter_function_selection").selectAll("option").data(filter);
        fg.exit().remove();
        fg = fg.enter().append("option").merge(fg)
            .classed("select-items", true)
            .html(d=>d);
    }

    draw_filter_dropdown2(){
        let filter_dropdown = document.getElementById("filter_function_selection");
        if(filter_dropdown.options[filter_dropdown.selectedIndex]){
            let selected_filter = filter_dropdown.options[filter_dropdown.selectedIndex].text;
            let filter2 = [];
            this.filters.forEach(f=>{
                if(f!=selected_filter){
                    filter2.push(f);
                }
            })
            let fg2 = d3.select("#filter_function_selection2").selectAll("option").data(filter2);
            fg2.exit().remove();
            fg2 = fg2.enter().append("option").merge(fg2)
                .classed("select-items", true)
                .html(d=>d);
        }
    }

    draw_label_dropdown(){
        if(this.all_cols.length > 0){
            let label_cols = ["row index"].concat(this.categorical_cols.concat(this.all_cols).concat(this.other_cols));
            let cg = d3.select("#label_column_selection").selectAll("option").data(label_cols);
            cg.exit().remove();
            cg = cg.enter().append("option").merge(cg)
                .classed("select-items", true)
                .html(d=>d);
        }
    }

    update_filter(){
        let mapper_dim = d3.select('input[name="mapper-dim"]:checked').node().value;
        let filter_dropdown = document.getElementById("filter_function_selection");
        let filter_dropdown2 = document.getElementById("filter_function_selection2");
        if (mapper_dim === "mapper_1d") {
            this.config.filter = [filter_dropdown.options[filter_dropdown.selectedIndex].text];
        } else{
            this.config.filter = [filter_dropdown.options[filter_dropdown.selectedIndex].text, filter_dropdown2.options[filter_dropdown2.selectedIndex].text];
        }
    }

    edit_param(){
        this.edit_clustering_param();
        this.edit_filtering_param();
    }

    edit_filtering_param(){
        let filtering_param_ranges_limit = {"interval1":{"left":1, "right":100}, "overlap1":{"left":0, "right":100}, "interval2":{"left":1, "right":100}, "overlap2":{"left":0, "right":100}, "number1":{"left":1, "right":6}, "number2":{"left":1, "right":6}, "stride1":{"left":1, "right":6}, "stride2":{"left":1, "right":6}};
        let filtering_param_ranges = {}
        let filtering_params = ['interval1', 'overlap1', 'interval2', 'overlap2','number1','number2','stride1','stride2']
        for (let i=0; i<filtering_params.length; i++){
            let p = filtering_params[i];
            filtering_param_ranges[p] = {};
            filtering_param_ranges[p].left = d3.select("#range-"+p+"-left").node().value;
            filtering_param_ranges[p].right = d3.select("#range-"+p+"-right").node().value;
            d3.select("#range-"+p+"-left")
                .on("change", ()=>{
                    let v = parseFloat(d3.select("#range-"+p+"-left").node().value);
                    if(v >= filtering_param_ranges_limit[p].left && v<=filtering_param_ranges[p].right){
                        filtering_param_ranges[p].left = v;
                        d3.select("#"+p+"_label").html(d3.select("#"+p+"_input").node().value)
                        d3.select("#"+p+"_input").node().min = v;
                    } else {
                        alert("out of range!")
                    }
                })
            d3.select("#range-"+p+"-right")
                .on("change", ()=>{
                    let v = parseFloat(d3.select("#range-"+p+"-right").node().value);
                    if(v <= filtering_param_ranges_limit[p].right && v>=filtering_param_ranges[p].left){
                        filtering_param_ranges[p].right = v;
                        d3.select("#"+p+"_label").html(d3.select("#"+p+"_input").node().value)
                        d3.select("#"+p+"_input").node().max = v;
                    } else {
                        alert("out of range!")
                    }
                })
        }
    }

    edit_clustering_param(){
        let clustering_param_ranges_limit = {"dbscan_eps":{"left":0, "right":Infinity}, "dbscan_min_samples":{"left":1, "right":Infinity}};
        let clustering_param_ranges = {};
        let clustering_params = ['dbscan_eps', 'dbscan_min_samples'];
        for(let i=0; i<clustering_params.length; i++){
            let p = clustering_params[i];
            clustering_param_ranges[p] = {};
            clustering_param_ranges[p].left = d3.select("#"+p+"-range-left").node().value;
            clustering_param_ranges[p].right = d3.select("#"+p+"-range-right").node().value;
            d3.select("#"+p+"-range-left")
                .on("change", ()=>{
                    let v = parseFloat(d3.select("#"+p+"-range-left").node().value);
                    if(v >= clustering_param_ranges_limit[p].left && v<=clustering_param_ranges[p].right){
                        clustering_param_ranges[p].left = v;
                        d3.select("#"+p+"_label").html(d3.select("#"+p+"-input").node().value)
                        d3.select("#"+p+"-input").node().min = v;
                    } else {
                        alert("out of range!");
                    }
                })
            d3.select("#"+p+"-range-right")
                .on("change", ()=>{
                    let v = parseFloat(d3.select("#"+p+"-range-right").node().value);
                    if(v <= clustering_param_ranges_limit[p].right && v>=clustering_param_ranges[p].left){
                        clustering_param_ranges[p].right = v;
                        d3.select("#"+p+"_label").html(d3.select("#"+p+"-input").node().value)
                        d3.select("#"+p+"-input").node().max = v;
                    } else {
                        alert("out of range!");
                    }
                })
        }
    }

}
