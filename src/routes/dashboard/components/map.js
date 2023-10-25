import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Splitter, SplitterPanel } from 'primereact/splitter';
import * as d3 from 'd3';
import * as api from '../../../api/api';
import * as fn from '../../../shared/fn';
import axios from 'axios';

const WorldMap = () => {
    const[dim] = useState([1200, 800]);
    const[node, setNode] = useState({});
    const[nodeId, setNodeId] = useState(-1);
    const[nodes, setNodes] = useState([]);
    const [nodeDetails, setNodeDetails] = useState([]);
    const [config] = useState({
        speed: .005,
        verticalTilt: -10,
        horizontalTilt: -315,
        markerRadius: 5,
    });
    
    const marksRef=useRef();    
    const markerGroupRef=useRef(); 

    const width = dim[0];
    const height = dim[1];
    const sensitivity = 75;
    
    //var autorotate;

    const handleNodeClick = useCallback((nodeid) => {
        nodeid=parseInt(nodeid);
        setNodeId(nodeid);
        const node = nodes.filter(x=> x.nodeid===nodeid);
        setNode(node[0]);
        getNetworkNode(nodeid);
    }, [nodes]);
    
    const drawMarkers = useCallback(async (path)=> {           
        const now=new Date().getTime();
        const lastUpdate=sessionStorage.getItem('sak-marks-fetch') ?? 0;
        const diff=now-lastUpdate;
        let points = [];
        let nodes;

        if(diff>=fn.hoursToMs(24) || !marksRef.current) {
            nodes = getNodes();
            if(nodes) {
                nodes.forEach((node , x, data)=> {
                    var coords = {
                        lon: node.coords[0],
                        lat: node.coords[1],
                        id: node.nodeid,
                        node: node
                    }
                    points.push(coords);
                });
            } 
            else {
                nodes=await getUpdatedNodes();
                nodes.forEach((node , x, data)=> {
                    var coords = {
                        lon: node.coords[0],
                        lat: node.coords[1],
                        id: node.nodeid,
                        node: node
                    }
                    points.push(coords);
                });
            }

            marksRef.current=points;
            sessionStorage.setItem('sak-marks-fetch', new Date().getTime());
        }
    
        const markers = markerGroupRef.current
                            .selectAll('circle')
                            .data(marksRef.current);
        markers
            .enter()
            .append('path')
            .merge(markers)
            .attr('class', 'faux-link')
            .attr('id', (d) => d.id)
            .attr('value', (d) => d.node)
            .attr('fill', function(d) {return "red"; })
            .datum(function(d) {
                return {type: 'Point', coordinates: [d.lon, d.lat], radius: config.markerRadius};
            })
            .attr('d', path)
            .attr('r', config.radiusSize)
            .on("click", function(d) {                
                handleNodeClick(d.target.id)                
            });

        markerGroupRef.current.each(function () {
            this.parentNode.appendChild(this);
        });
    },[config, handleNodeClick]);

    useEffect(() => {
        if(nodeId>=0) return;

        const center = [0, 0];
        const translate = [width/2, height/2];
        const rotate=[config.horizontalTilt, config.verticalTilt];

        const svg = d3.select(".world-map")
            .attr("width", width)
            .attr("height", height)

        let projection = d3.geoOrthographic()
            .scale(375)
            .center(center)            
            .rotate(rotate)
            .translate(translate);

        const initialScale = projection.scale()
        var path = d3.geoPath()
                        .projection(projection)
                        .pointRadius(function(d) { 
                            return config.markerRadius; 
                        });
        markerGroupRef.current = svg.append('g');

        let globe = svg.append("circle")
                .attr("fill", "#232D42")
                .attr("stroke", "transparent")
                .attr("class","sphere")
                .attr("stroke-width", "0.2")
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("r", initialScale)
            ;
        svg
            .call(d3.drag().on('drag', (event) => {
                const rotate = projection.rotate()
                const k = sensitivity / projection.scale()
                projection.rotate([
                    rotate[0] + event.dx * k,
                    rotate[1] - event.dy * k
                ])
                path = d3.geoPath().projection(projection);
                svg.selectAll("path").attr("d", path);
                drawMarkers(path);
            }))
        
            .call(d3.zoom().on('zoom', (evt) => {
                if(evt.transform.k > 0.3) {
                    projection.scale(initialScale * evt.transform.k)
                    path = d3.geoPath().projection(projection)
                    svg.selectAll("path").attr("d", path)
                    globe.attr("r", projection.scale());
                    drawMarkers(path);
                }
                else {
                    evt.transform.k = 0.3
                }
            }))
        
        const graticule = d3.geoGraticule().step([10, 10]);

        const g = svg.append("g");

        g.append('path')
                .attr('class', 'sphere')
                .attr('d', path({type: 'Sphere'}));

        g.append('path')
                 .datum(graticule)
                 .attr("class", "graticule")
                 .attr("d", path);        

        d3.json('world-countries.json').then((data, error) => {
            if (error) throw error;
            //console.log(data.features[176].id);     //[167].properties.name
            g.selectAll(".graticule")
                .attr("d", path);

            g.append("g")
                .attr("class", "countries" )
                .selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                
                .style('stroke-width', 0.3)
                .style("opacity",1)
                .on("click", function(e) {
                    onMapClick(e)
                    //enableRotation(0);
                });        
            
            drawMarkers(path);
            //enableRotation();
        })

        function transition(p) {
            d3.transition()
                .duration(850)
                .tween("rotate", function() {
                  var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        
                  return function(t) {
                    return function(t) {
                        projection.rotate(r(t));
                    }
                  };
                })
              .transition();
          }
        
          function onMapClick(evt) {
            var p = projection.invert(d3.pointer(evt));
        
            if (p === undefined || !p[0] || !p[1]) {
              return false;
            }
        
            transition(p);
          }

        function enableRotation(speed) {
            if(!speed)
                speed = config.speed;
            
            d3.timer(function (elapsed) {
                projection.rotate([speed * elapsed - 10, config.verticalTilt, config.horizontalTilt]);
                svg.selectAll("path").attr("d", path);
                drawMarkers(path);
                //requestAnimationFrame(enableRotation);
            });
        }
    }, [
        dim
        , height
        , width
        , nodeId
        , config
        , node
        , drawMarkers
    ]);

    const getUpdatedNodes = async() => {
        const data=await axios(`/.netlify/functions/getNodes`)
        .then(function (response) {                    
            return response;
    })
        
        return data;
    }

    function getNodes() {
        const nodes=JSON.parse(sessionStorage.getItem('sak-nodes'));
        setNodes(nodes);
        return nodes;
    }

    const getNetworkNode = async (nodeId) => {        
        const response = await api.getNetworkNode(nodeId);     
        setNodeDetails(nodeDetails => [...nodeDetails, response.data.nodes[0]]);
    }

    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`sm`}>
                    <div className={`accent nodes title`}>Nodes Map</div>
                    <Splitter className="mb-1">
                        <SplitterPanel  size={70} className="flex align-items-center justify-content-center">
                            <div className={``}>
                                <svg className={`world-map`} width={dim[0]} height={dim[1]} />                           
                            </div>
                        </SplitterPanel>
                        <SplitterPanel  size={30} className="flex align-items-center justify-content-center" style={{verticalAlign: 'top'}}>
                            <table className={`${nodeId===-1 ? 'hidden':''} node-detail p-datatable`} 
                               >
                                <thead className={`p-datatable-thead`} style={{width: '100%'}}>
                                    <tr style={{textAlign:'center'}}>
                                        <td colSpan='2'>{node.owner}</td>
                                    </tr>
                                    <tr style={{textAlign:'center'}}>
                                        <td colSpan='2'>{node.city}</td>
                                    </tr>
                                    <tr style={{textAlign:'center'}}>
                                        <td colSpan='2'>{node.sector}</td>
                                    </tr>
                                </thead>
                                <tbody className={`p-datatable-tbody`}>                                
                                    <tr className={`p-row-odd`}>
                                        <td>Node</td>
                                        <td>{nodeId}</td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>{nodeDetails[0] ?  nodeDetails[0].description : ''}</td>
                                    </tr>
                                    <tr className={`p-row-odd`}>
                                        <td>Joined</td>
                                        <td>{fn.dateToLocalDate(node.datejoined)}</td>
                                    </tr>
                                    <tr>
                                        <td>Account Id</td>
                                        <td>{nodeDetails[0] ? nodeDetails[0].node_account_id : ''}</td>
                                    </tr>
                                    <tr className={`p-row-odd`}>
                                        <td>Stake</td>
                                        <td>{nodeDetails[0] ? fn.formatHbar(nodeDetails[0].stake) : ''}</td>
                                    </tr>
                                    <tr>
                                        <td>Stake Rewarded</td>
                                        <td>{nodeDetails[0] ? fn.formatHbar(nodeDetails[0].stake_rewarded): ''}</td>
                                    </tr>
                                    <tr className={`p-row-odd`}>
                                        <td>Stake Not Rewarded</td>
                                        <td>{nodeDetails[0] ? fn.formatHbar(nodeDetails[0].stake_not_rewarded) : ''}</td>
                                    </tr>
                                    <tr>
                                        <td>Min</td>
                                        <td>{nodeDetails[0] ? fn.formatHbar(nodeDetails[0].min_stake) : ''}</td>
                                    </tr>
                                    <tr className={`p-row-odd`}>
                                        <td>Max</td>
                                        <td>{nodeDetails[0] ? fn.formatHbar(nodeDetails[0].max_stake) : ''}</td>
                                    </tr>
                                    <tr>
                                        <td>Reward Rate</td>
                                        <td>{nodeDetails[0] ? nodeDetails[0].reward_rate_start : ''}</td>
                                    </tr>
                                    <tr className={`p-row-odd`}>
                                        <td>Left</td>
                                        <td>{node.dateleft ? node.dateleft : 'n/a'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </SplitterPanel>
                    </Splitter>                    
                </div>
            </div>
        </div>
    )
  
}
export default WorldMap