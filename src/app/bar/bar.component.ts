import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OfficerInvolvedShooting } from '../officer-involved-shooting.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  @Input() OfficerInvolvedShootingsGraphData: OfficerInvolvedShooting[];
  @Output() YearSearchParameter = new EventEmitter();

  public graphElement;
  // public currentSummary = "test";

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.graphElement = this.elementRef.nativeElement.querySelector('#test-bar');

    setTimeout(() => this.d3SvgBarHorizontal(this.graphElement.clientWidth), 1000);
  }

  submitForm(firstDate: string, secondDate: string) {
    this.YearSearchParameter.emit({start: firstDate, end: secondDate});
    setTimeout(() => this.d3SvgBarHorizontal(this.graphElement.clientWidth), 1000);
  }

  onResize(event) {
    this.d3SvgBarHorizontal(event.target.innerWidth);
  }

  // changeCurrentSummary(summary) {
  //   this.currentSummary = summary;
  //   console.log(this.currentSummary);
  // }

  d3SvgBarHorizontal(graphWidth) {
    var changeCurrentSummary = function(summary) {
      this.changeCurrentSummary(summary);
    }
    var w = graphWidth;
    var h = 600;
    var padding = 36;
    var barPadding = 1;
    var param = "summary";
    //declared locally because some d3 functions can't reach all the way out to component properties
    var graphData = this.OfficerInvolvedShootingsGraphData;

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(graphData, function(d) {
                     return d[param].length;
                   })])
                   .range([padding, h - padding]);

    var yAxisScale = d3.scaleLinear()
                      .domain([d3.max(graphData, function(d) {
                        return d[param].length;
                      }), 0])
                      .range([padding, h - padding]);

    var xScale = d3.scaleTime()
                   .domain([d3.min(graphData, function(d) {
                     return new Date(d.date);
                   }),
                   d3.max(graphData, function(d) {
                     return new Date(d.date);
                   })])
                   .range([padding, w - padding]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yAxisScale);

    var svg = d3.select("#test-bar")
                .html("")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    svg.selectAll("rect")
        .data(graphData)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          return xScale(new Date(d.date));
        })
        .attr("y", function(d, i) {
          return h - yScale(d[param].length);
        })
        .attr("width", function(d) {
          return w / graphData.length;
        })
        .attr("height", function(d) {
          return yScale(d[param].length) - padding;
        })
        .attr("fill", "#00888A")
        .attr("fill-opacity", "0.3")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);

    function handleClick(d, i) {
      // d3.select(this).remove();
      // changeCurrentSummary(d.summary);
      d3.select("#mouse-over-text").remove();
      svg.append("text")
      .attr("id", "mouse-over-text")
      .attr("x", 0)
      .attr("y", 50)
      .attr("word-wrap", "break-word")
      .text(function() {
        return d.summary;
      });
    }

    function handleMouseOver(d, i) {
      d3.select(this).attr("fill", "#003F40");

    }

    function handleMouseOut(d, i) {
      d3.select(this).attr("fill", "#00888A");
      d3.select("#mouse-over-text").remove();
    }

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + 0 + "," + (h - padding) + ")")
       .call(xAxis);

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + "," + 0 + ")")
      .call(yAxis);
  }
}
