// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 90, left: 40 },
  width = 860 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("./sugar.csv", function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1);

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3
    .map(data, function (d) {
      return d;
    })
    .keys();

  // Add X axis

  console.log(groups);
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 80]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xSubgroup));

  // color palette = one color per subgroup
  var color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#e47d1a",
      "#1ae4e2",
      "#e21ae4",
      "#7d1ae4",
      "#e4e21a"
    ]);

  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d.state) + ",0)";
    })
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xSubgroup(d.key);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d) {
      return color(d.key);
    })

    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("id", function (d, i) {
      return i;
    })
    .on("mouseover", function () {
      d3.select(this).attr("fill", "black");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("fill", function () {
        return "" + color(this.id) + "";
      });
    });
});
