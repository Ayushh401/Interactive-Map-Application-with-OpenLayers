"use client";

import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw, Modify } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { MapTools } from './MapTools';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Polygon, Point } from 'ol/geom';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { transform } from 'ol/proj';
import { Card } from '../ui/card';

interface Coordinate {
  lat: number;
  lng: number;
}

export function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [vectorSource] = useState(new VectorSource());
  const [draw, setDraw] = useState<Draw | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const modify = new Modify({ source: vectorSource });
    initialMap.addInteraction(modify);

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [vectorSource]);

  useEffect(() => {
    if (!map) return;

    if (draw) {
      map.removeInteraction(draw);
    }

    if (activeTool !== 'select') {
      const newDraw = new Draw({
        source: vectorSource,
        type: activeTool === 'circle' ? 'Circle' : 
              activeTool === 'line' ? 'LineString' : 
              activeTool === 'polygon' ? 'Polygon' : 
              'Point',
      });

      newDraw.on('drawend', (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        
        if (geometry instanceof LineString) {
          const length = getLength(geometry);
          console.log(`Length: ${(length / 1000).toFixed(2)} km`);
        } else if (geometry instanceof Polygon) {
          const area = getArea(geometry);
          console.log(`Area: ${(area / 1000000).toFixed(2)} km²`);
        } else if (geometry instanceof Point) {
          const coords = geometry.getCoordinates();
          const transformedCoords = transform(coords, 'EPSG:3857', 'EPSG:4326');
          setCoordinates(prev => [...prev, {
            lat: transformedCoords[1],
            lng: transformedCoords[0]
          }]);
        }
      });

      map.addInteraction(newDraw);
      setDraw(newDraw);
    }
  }, [map, activeTool, vectorSource]);

  const handleToolChange = (value: string) => {
    if (value) setActiveTool(value);
  };

  const clearFeatures = () => {
    vectorSource.clear();
    setCoordinates([]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-2rem)]">
      <div ref={mapRef} className="ol-map" />
      <MapTools activeTool={activeTool} onToolChange={handleToolChange} />
      <Button 
        variant="destructive"
        className="absolute top-4 right-4 z-10"
        onClick={clearFeatures}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear All
      </Button>
      
      {coordinates.length > 0 && (
        <Card className="absolute bottom-4 right-4 p-4 max-h-[300px] overflow-y-auto">
          <h3 className="font-semibold mb-2">Points</h3>
          <div className="space-y-2">
            {coordinates.map((coord, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">Point {index + 1}:</span>
                <div className="ml-2">
                  <div>Latitude: {coord.lat.toFixed(6)}°</div>
                  <div>Longitude: {coord.lng.toFixed(6)}°</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}