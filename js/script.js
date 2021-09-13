mapboxgl.accessToken = 'pk.eyJ1IjoiZGF5dGNodyIsImEiOiJja2s2emc2ODUwNmJ5MnZtZnBtYnJ2cmRrIn0.6HMlBD4cqhHS6mc8AQzpPA';

const bounds = [
[-189.6576, -2.8113], // Southwest coordinates  
[-25.544, 73.5284] // Northeast coordinates  
];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/daytchw/ckss67q672xht17n0cvr9vvgu',
  center: [-96.82258199476341, 38.61088854842071],
  pitch: 45,
  bearing: 0,
  zoom: 4,
  maxBounds: bounds 
});

//map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

// Sidebar Code


// Geocoder Code

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  marker: false,
  countries: 'US',
  mapboxgl: mapboxgl,
  placeholder: 'Find an Address or Place'
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', () => {

  map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
  });

  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });

  //3d Buildings Code//
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field']
  ).id;
  //End 3d Buildings//

  map.addSource('gbstates', {
    type: 'geojson',
    data: 'https://dwatts.github.io/GEOJSON/Greenbook_States.geojson',
  });

  map.addSource('gbsites', {
    type: 'geojson',
    data: 'https://dwatts.github.io/GEOJSON/Greenbook_Sites.geojson',
    cluster: true,
    clusterMaxZoom: 13,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'gbsites',
    filter: ['has', 'point_count'],
      paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#b8b8b8',
        50,
        '#b8b8b8',
        100,
        '#b8b8b8',
        750,
        '#b8b8b8'
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            50,
            20,
            100,
            25,
            750,
            35
        ],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#404040'
      }     
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'gbsites',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Overpass Black', 'Arial Unicode MS Bold'],
      'text-size': 14
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'gbsites',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-radius': {
            'base': 4,
            'stops': [
              [10, 4],
              [17, 12],
            ]
        },
        'circle-color': [
            'match',
            ['get', 'cat_type'],
            'Eating & Drinking',
            '#E41A1C',
            'Entertainment',
            '#377eb8',
            'Lodging',
            '#4daf4a',
            'Retail',
            '#984ea3',
            'Services',
            '#ff7f00',
            'Transportation',
            '#ffff33',
            '#000'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#404040'
    }
  });

  map.addLayer({
    'id': 'greenbook-states',
    'type': 'fill',
    'source': 'gbstates',
    'layout': {},
    'paint': {
      'fill-color': '#404040',
      'fill-opacity': 0.01,
    }
  });

  map.addLayer({
    'id': 'state-borders',
    'type': 'line',
    'source': 'gbstates',
    'layout': {},
    'paint': {
      'line-color': '#000',
      'line-width': 0.5
    }
  });

//map.setLayoutProperty('greenbook-states', 'visibility', 'none');
//map.setLayoutProperty('state-borders', 'visibility', 'none');

// Unused rendering code

/*map.on('click', 'greenbook-states', (e) => {
  const states = e.features[0].properties.NAME;
  
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`<h1>${states}</h1>`)
    .addTo(map);
});*/

/*map.addLayer({
  'id': 'unclustered-point',
  'type': 'symbol',
  'source': 'gbsites',
  'filter': ['!', ['has', 'point_count']],
  'layout': {
    'icon-image': [
      'match',
          ['get', 'cat_type'],
          'Eating & Drinking',
          'rail',
          'Entertainment',
          'airport',
          'Lodging',
          'rail',
          'Retail',
          'airport',
          'Services',
          'campsite',
          'Transportation',
          'lodging',
          'lodging'
    ],
    'icon-size': 1
  },
  'paint': {
      'icon-color': [
          'match',
          ['get', 'cat_type'],
          'Eating & Drinking',
          '#E41A1C',
          'Entertainment',
          '#377EB8',
          'Lodging',
          '#4DAF4A',
          'Retail',
          '#984EA3',
          'Services',
          '#FF7F00',
          'Transportation',
          '#FFFF33',
          '#000'
      ],
  }
});*/

/*const images = [
  {url: '/icons/Eat_Drink.png', id: 'image_1'},
  {url: '/icons/Entertainment.png', id: 'image_2'},
  {url: '/icons/Lodging.png', id: 'image_3'},
  {url: '/icons/Retail.png', id: 'image_4'},
  {url: '/icons/Services.png', id: 'image_5'},
  {url: '/icons/Transportation.png', id: 'image_6'},
]

Promise.all(
  images.map(img => new Promise((resolve, reject) => {
      map.loadImage(img.url, function (error, res) {
          map.addImage(img.id, res)
          resolve();
      })
  }))
)

map.addLayer({
  'id': 'unclustered-point',
  'type': 'symbol',
  'source': 'gbsites',
  'filter': ['!', ['has', 'point_count']],
  'layout': {
    'icon-image': [
      'match',
          ['get', 'cat_type'],
          'Eating & Drinking',
          'image_1',
          'Entertainment',
          'image_2',
          'Lodging',
          'image_3',
          'Retail',
          'image_4',
          'Services',
          'image_5',
          'Transportation',
          'image_6',
          'image_1'
    ],
    'icon-size': {
      'base': 0.2,
      'stops': [
        [10, 0.25],
        [12, 0.30],
        [17, 0.40],
      ]
    }
  },
});*/


//Add 3D Buildings//

  map.addLayer(
      {
          'id': 'add-3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
              'fill-extrusion-color': '#D8B384',
              'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
              ],
              'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.3
          }
      },
      labelLayerId
  );

  // inspect a cluster on click
  /*map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
  });

  const clusterId = features[0].properties.cluster_id;

  map.getSource('gbsites').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
    if (err) return;
    
    map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
      }
    );
  });*/

  /*map.on('click', 'greenbook-states', (e) => {
    const states = e.features[0].properties.NAME;
    
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<h1>${states}</h1>`)
      .addTo(map);
  });


  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.biz_name;
    const add = e.features[0].properties.address === 'null' ? 'Address Not Listed' : e.features[0].properties.address;
    const approx = e.features[0].properties.Location === 'Approx' ? '(Location Approximate)' : '';
    const city = e.features[0].properties.city;
    const state = e.features[0].properties.state;
    const type = e.features[0].properties.spec_type;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
    `<h1>${type}</h1><hr><h2>${name}</h2><h3>${add} ${approx}</h3><h3>${city}, ${state}</h3>`
    )
    .addTo(map);
  });*/


 map.on('click', function (e) {
    var pointFeatures = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });
    //$('.mapboxgl-popup-content').height(100);

    if (pointFeatures.length > 0) {
        var feature = pointFeatures[0];
        // Populate the popup and set its coordinates

        const name = feature.properties.biz_name;
        const add = feature.properties.address === 'null' ? 'Address Not Listed' : feature.properties.address;
        const approx = feature.properties.Location === 'Approx' ? '(Location Approximate)' : '';
        const city = feature.properties.city;
        const state = feature.properties.state;
        const type = feature.properties.spec_type;
    
        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(`<h1>${type}</h1><hr><h2>${name}</h2><h3>${add} ${approx}</h3><h3>${city}, ${state}</h3>`)
            .addTo(map);

        return; // don't display any more pop ups
    }

    var clusterFeatures =  map.queryRenderedFeatures(e.point, { layers: ['clusters'] });

    if (clusterFeatures.length > 0) {
      var feature = clusterFeatures[0];

      const clusterId = feature.properties.cluster_id;

      map.getSource('gbsites').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
        if (err) return;
          
        map.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom
          });
        }
      );
          
      return;  
    }

    var polygonFeatures = map.queryRenderedFeatures(e.point, { layers: ['greenbook-states'] });

    if (!polygonFeatures.length) {
        return;   
    }

    var feature = polygonFeatures[0];
    const states = feature.properties.NAME;
    const total = feature.properties.gb_sites;

    const eatdrink = feature.properties.eat_drink;
    const entertain = feature.properties.entertain;
    const lodging = feature.properties.lodging;
    const retail = feature.properties.retail;
    const services = feature.properties.services;
    const transport = feature.properties.transport; 

    var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))
        .setHTML(`<h1>${states}</h1><h3>Total number of Green Book businesses: <b>${total}</b></h3><h2>Businesses by Type</h2><hr><div class="chartHolder"><canvas class="chart"></canvas></div>`)
        .addTo(map);

    const projCanvas = popup.getElement().getElementsByClassName("chart")[0];

    var data = {
      labels: [
        'Eating & Drinking',
        'Entertainment', 
        'Lodging',
        'Retail',
        'Services',
        'Transportation',   
      ],        
      datasets:[
        {
            //label: "Business Type",
            data: [eatdrink, entertain, lodging, retail, services, transport],
            //stack: "Stack 0",    
            backgroundColor: ["rgba(228, 26, 28,0.8)", "rgba(55, 126, 184,0.8)", "rgba(77, 175, 74,0.8)", "rgba(152, 78, 163,0.8)", "rgba(255, 127, 0,0.8)", "rgba(255, 255, 51,0.8)"],
            borderColor: "#404040",
            borderWidth: .5,
            hoverBorderWidth: 1
        },
      ],
      };

      var options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                ticks: {
                  beginAtZero: true,
                  stepSize: 2,
                  maxTicksLimit: 8, 
                  fontSize: 12,    
                }
            }],
            yAxes: [{
                ticks: {
                  fontSize: 12,
                }
                
            }]
        },
        title: {
            display: 'false',            
        },
        animation: {
            duration: 900,
            easing: 'linear',
            //animateScale: true
        },
        hover: {
          onHover: function(e) {
              var point = this.getElementAtEvent(e);
              if (point.length) e.target.style.cursor = 'pointer';
              else e.target.style.cursor = 'default';
           }
        },
        tooltips: {
            backgroundColor: 'rgba(232, 232, 232, 0.9)',   
            titleFontSize: 12,
            titleFontColor: "#404040",
            bodyFontSize: 11,
            bodyFontColor: "#404040" 
        },
        layout: {
          padding: {
            top: -100,
          }
        }
};

    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 10;
    };

    Chart.defaults.global.defaultFontFamily="'Overpass'";
  
    mybarChart = new Chart(projCanvas.getContext("2d"), {
      type: "horizontalBar",
      data: data,
      options: options,   
    });

  });

  // Pointer code for points and clusters

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
      
  map.on('mouseenter', 'unclustered-point', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'greenbook-states', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'greenbook-states', () => {
    map.getCanvas().style.cursor = '';
  });


  // States Layer Toggle

  const button = document.getElementById("layerButton");

  button.addEventListener("click", function() {
      if (map.getLayoutProperty('greenbook-states', 'visibility') === 'none') {
        map.setLayoutProperty('greenbook-states', 'visibility', 'visible');
        map.setLayoutProperty('state-borders', 'visibility', 'visible');
        $(".switchText").html("Toggle State Data [ ON ]");
      } else {
        
        map.setLayoutProperty('greenbook-states', 'visibility', 'none');
        map.setLayoutProperty('state-borders', 'visibility', 'none');
        $(".switchText").html("Toggle State Data [ OFF ]");
      }
  });


});

// Info Panel Code 

function toggleInfo() {
  var element = document.getElementById("myInfopanel");
  element.classList.toggle("infoExpand");
}