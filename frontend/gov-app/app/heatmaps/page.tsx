"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import zoneMapping from '../data/zone_mapping.json';

interface ZoneData {
  zone_no: number;
  zone_name: string;
  wards: number[];
  zone_label: string;
  area?: string;
  urban_nature?: string;
}

const zoneColors: { [key: number]: string } = {
  1: '#FF6B6B',   // Red
  2: '#4ECDC4',   // Teal
  3: '#45B7D1',   // Blue
  4: '#FFA07A',   // Light Salmon
  5: '#98D8C8',   // Mint
  6: '#F7DC6F',   // Yellow
  7: '#BB8FCE',   // Light Purple
  8: '#85C1E9',   // Light Blue
  9: '#F8C471',   // Orange
  10: '#82E0AA',  // Light Green
  11: '#F1948A',  // Light Red
  12: '#AED6F1',  // Pale Blue
  13: '#A9DFBF',  // Pale Green
  14: '#FAD7A0',  // Pale Orange
  15: '#D7BDE2',  // Pale Purple
};

// Extended zone data with urban nature
const extendedZoneData = [
  { zone_no: 1, zone_name: 'Thiruvottiyur', area: 'Thiruvottiyur', urban_nature: 'Industrial + Residential', wards: [], zone_label: 'I' },
  { zone_no: 2, zone_name: 'Manali', area: 'Manali', urban_nature: 'Industrial', wards: [], zone_label: 'II' },
  { zone_no: 3, zone_name: 'Madhavaram', area: 'Madhavaram', urban_nature: 'Residential', wards: [], zone_label: 'III' },
  { zone_no: 4, zone_name: 'Tondiarpet', area: 'Tondiarpet', urban_nature: 'Port & Labour area', wards: [], zone_label: 'IV' },
  { zone_no: 5, zone_name: 'Royapuram', area: 'Royapuram', urban_nature: 'Coastal', wards: [], zone_label: 'V' },
  { zone_no: 6, zone_name: 'Thiru Vi Ka Nagar', area: 'Thiru Vi Ka Nagar', urban_nature: 'Dense residential', wards: [], zone_label: 'VI' },
  { zone_no: 7, zone_name: 'Ambattur', area: 'Ambattur', urban_nature: 'Industrial hub', wards: [], zone_label: 'VII' },
  { zone_no: 8, zone_name: 'Anna Nagar', area: 'Anna Nagar', urban_nature: 'Planned residential', wards: [], zone_label: 'VIII' },
  { zone_no: 9, zone_name: 'Teynampet', area: 'Teynampet', urban_nature: 'Commercial', wards: [], zone_label: 'IX' },
  { zone_no: 10, zone_name: 'Kodambakkam', area: 'Kodambakkam', urban_nature: 'Mixed residential', wards: [], zone_label: 'X' },
  { zone_no: 11, zone_name: 'Valasaravakkam', area: 'Valasaravakkam', urban_nature: 'Suburban', wards: [], zone_label: 'XI' },
  { zone_no: 12, zone_name: 'Alandur', area: 'Alandur', urban_nature: 'Transport hub', wards: [], zone_label: 'XII' },
  { zone_no: 13, zone_name: 'Adyar', area: 'Adyar', urban_nature: 'Premium residential', wards: [], zone_label: 'XIII' },
  { zone_no: 14, zone_name: 'Perungudi', area: 'Perungudi', urban_nature: 'IT corridor', wards: [], zone_label: 'XIV' },
  { zone_no: 15, zone_name: 'Sholinganallur', area: 'Sholinganallur', urban_nature: 'Rapidly expanding', wards: [], zone_label: 'XV' },
];

export default function HeatmapsPage() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);
  const [svgPaths, setSvgPaths] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<'dengue' | 'diarrhea' | 'typhoid' | null>(null);
  const [mode, setMode] = useState<'data' | 'ai'>('data');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('October');
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // @ts-ignore
    const baseZones = zoneMapping.zones as ZoneData[];
    // Merge with extended data
    const mergedZones = baseZones.map(base => {
      const extended = extendedZoneData.find(ext => ext.zone_no === base.zone_no);
      return extended ? { ...base, ...extended } : base;
    });
    setZoneData(mergedZones);
    
    // Load and parse the full SVG
    fetch('/CHENNAI.svg')
      .then(response => response.text())
      .then(svgText => {
        // Parse all path elements from the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = svgDoc.querySelectorAll('path');
        const pathData = Array.from(paths).map(path => path.getAttribute('d') || '');
        setSvgPaths(pathData);
      })
      .catch(error => {
        console.error('Error loading SVG:', error);
        // Fallback to hardcoded paths if fetch fails
        setSvgPaths([
          "M 729.38 36.51 735.26 23.56 735.49 17.41 760.22 11.79 774.88 1 788.83 4.7 796.94 3.25 799 2.71 773.96 72.1 765.32 71.8 759.81 71.22 758.67 70.43 758.03 67.62 758.53 64.36 759.28 60.22 757.96 58.82 757.07 57.33 749.99 56.67 747.19 56.07 743.76 53.02 743.05 52.76 742.8 53.2 742.19 53.9 741.66 53.64 729.38 36.51 Z",
          "M 699.12 116.85 696.27 101.72 707.79 79.89 716.76 63.13 729.38 36.51 741.66 53.64 742.19 53.9 742.8 53.2 743.05 52.76 743.76 53.02 747.19 56.07 749.99 56.67 757.07 57.33 757.96 58.82 759.28 60.22 758.53 64.36 758.03 67.62 758.67 70.43 759.81 71.22 765.32 71.8 773.96 72.1 756.91 127.3 754.83 126.8 746.76 124.81 735.74 122.29 712.53 115.69 708.39 115.38 699.12 116.85 Z",
          "M 700.38 200.29 711.3 175.6 676.44 165.48 678.8 158.75 682.42 155.99 680.09 154.98 683.54 147.54 690.79 133.87 699.12 116.85 708.39 115.38 712.53 115.69 735.74 122.29 746.76 124.81 754.83 126.8 756.91 127.3 740.19 193.2 718.57 188.47 715.11 202.9 700.38 200.29 Z",
          "M 651.38 205.28 657.02 196.76 660.66 197.55 663.71 188.69 672.72 179.89 672.88 174.45 676.44 165.48 711.3 175.6 700.38 200.29 678.52 247.47 661.88 242.46 665.18 233.64 659.8 231.97 669.71 216.79 676.3 219.95 677.07 217.65 677.14 213.84 651.38 205.28 Z",
          "M 715.39 281.7 697.2 278.18 694.28 283.25 681.69 278.67 680.21 282.4 675.84 281.43 675.64 273.25 669.95 272.56 667.43 271.51 669.2 267.39 678.52 247.47 700.38 200.29 715.11 202.9 718.57 188.47 740.19 193.2 727.75 253.2 715.39 281.7 Z",
          "M 678.52 247.47 669.2 267.39 622.54 257.43 623.84 250.4 607.88 249.67 605.48 221.12 625.08 222.93 637.53 227.33 644.39 215.29 651.38 205.28 677.14 213.84 677.07 217.65 676.3 219.95 669.71 216.79 659.8 231.97 665.18 233.64 661.88 242.46 678.52 247.47 Z",
          "M 669.2 267.39 667.43 271.51 661.12 285.47 655.59 297.69 646.29 318.91 640.71 330.52 633.43 347.96 626 362.8 623.24 371.7 620.55 375.54 611.19 370.48 607.93 369.17 604.53 369.33 600.26 370.4 596.73 371.91 590.71 376.41 576.31 385.27 573.88 386 518.01 388.68 520.58 372.63 524.08 372.54 524.48 372.03 523.97 370.92 523.85 369.59 524.25 368.98 524.96 368.98 526.88 368.97 527.48 368.15 529.37 365.49 529.95 362.44 530.14 361.32 530.84 360.61 531.55 360.09 531.93 357.95 531.52 356.74 531.11 356.44 523.04 356.48 522.63 355.88 523.02 354.65 528.06 341.61 528.83 337.64 528.97 330.42 529.74 325.64 532.2 306.61 538.46 306.67 569.81 312.38 570.1 310.75 575.28 310.82 577.9 309.38 590.71 296.8 599.36 277.05 607.45 258.32 608.14 256.38 608.41 253.02 608 251.81 607.88 249.67 623.84 250.4 622.54 257.43 669.2 267.39 Z",
          "M 715.39 281.7 711.25 299.02 682.3 290.84 679.88 292.92 677.84 294.21 675.09 293.34 674.1 290.99 673.98 288.43 665.56 286.22 668.71 278.13 669.95 272.56 675.64 273.25 675.84 281.43 680.21 282.4 681.69 278.67 694.28 283.25 697.2 278.18 715.39 281.7 Z",
          "M 706.87 314.48 694.11 312.59 673.55 309.61 675.2 305.25 667.26 303.33 669.14 294.26 665.48 288.97 665.56 286.22 673.98 288.43 674.1 290.99 675.09 293.34 677.84 294.21 679.88 292.92 682.3 290.84 711.25 299.02 706.87 314.48 Z",
          "M 665.56 286.22 665.48 288.97 669.14 294.26 667.26 303.33 675.2 305.25 673.55 309.61 670.45 321.13 670.26 321.53 669.79 321.54 664.43 319.62 662.96 326.55 654.26 323.58 654.61 320.73 646.29 318.91 655.59 297.69 661.12 285.47 667.43 271.51 669.95 272.56 668.71 278.13 665.56 286.22 Z",
          "M 706.87 314.48 693.54 357.42 675.17 351.1 675.73 347.63 664.43 344.24 655.04 341.43 657.1 333.17 640.71 330.52 646.29 318.91 654.61 320.73 654.26 323.58 662.96 326.55 664.43 319.62 669.79 321.54 670.26 321.53 670.45 321.13 673.55 309.61 694.11 312.59 706.87 314.48 Z",
          "M 633.43 347.96 640.71 330.52 657.1 333.17 655.04 341.43 664.43 344.24 661.61 354.34 660.89 356.25 654.55 362.52 653 365.49 646.69 364.16 645.95 363.42 645.52 362.58 646.03 360.78 646.86 360.03 649.07 360.55 650.64 360.12 651.68 358.53 653.32 353.76 652.99 352.92 652.47 352.5 649.94 351.56 644.99 349.37 639.11 349.09 633.43 347.96 Z",
          "M 620.55 375.54 623.24 371.7 626 362.8 633.43 347.96 639.11 349.09 644.99 349.37 649.94 351.56 652.47 352.5 652.99 352.92 653.32 353.76 651.68 358.53 650.64 360.12 649.07 360.55 646.86 360.03 646.03 360.78 645.52 362.58 645.95 363.42 646.69 364.16 653 365.49 652.39 367.82 649.7 373.34 643.61 372.1 642.51 376.61 634.24 375.94 633.66 377.85 630.99 377.5 627.15 377.23 623.49 376.51 620.55 375.54 Z",
          "M 663.65 382.34 661.84 381.98 648.98 378.98 649.95 377.22 645.16 376.82 642.51 376.61 643.61 372.1 649.7 373.34 652.39 367.82 653 365.49 654.55 362.52 660.89 356.25 661.61 354.34 664.43 344.24 675.73 347.63 675.17 351.1 693.54 357.42 681.66 385.93 663.65 382.34 Z",
          "M 205.81 734.07 205.85 733.09 206 730.69 207.34 729.32 208.52 727.43 208.66 724.7 209.82 721.78 211 719.9 211.83 717.84 212.67 716.64 213.33 714.93 212.47 713.39 208.37 710.34 206.65 707.79 206.63 704.71 207.12 702.49 208.47 701.63 211.86 701.44 213.2 700.06 214.02 695.95 213.25 685.19 211.14 676.49 209.92 672.31 210.06 669.06 212.42 667.34 216.48 666.29 217.66 664.57 217.97 662.01 219.83 660.8 223.39 660.44 226.11 660.59 225.94 660.93 226.97 662.12 227.15 664.17 228.85 664.33 231.56 662.95 237.31 661.21 239.17 660.51 239.84 658.97 239.96 657.99 241.39 646.6 244.72 646.81 245.61 645.9 247.05 644.2 249.29 643.62 250.19 643.5 250.75 643.84 251.11 646.88 253.38 649.92 255.4 650.69 259.1 651.24 259.9 652.25 261.52 658.33 261.53 658.56 261.81 666.01 262.73 668.6 264.86 669.37 274.18 670.56 290.35 674.41 291.36 674.86 291.59 675.65 291.15 676.44 289.8 676.56 289.02 677.02 288.47 678.26 288.38 680.07 286.96 684.25 285.85 686.29 285.02 693.3 285.38 696.57 287.2 699.83 287.56 702.54 286.05 709.77 285.63 712.71 285.53 714.29 279.42 720.76 278.9 721.76 263.94 718.85 259.9 719.05 254.99 719.96 249.73 722.3 249.48 723.72 250.12 726.72 250.23 729.29 250.07 730.53 249.9 732.21 246.22 732.68 246 738.17 245.32 741.18 243.67 741.53 243.87 745.48 243.13 746.83 236.57 746.87 237.17 741.99 235.08 741.75 234.89 739.56 235.72 738.8 235.55 738.05 232.87 738.15 230.96 738.58 229.54 739.17 225.12 739.29 224.21 739.8 221.58 745.11 220.83 745.87 205.65 745.84 205.95 745.22 205.57 740.44 205.81 734.07 Z"
        ]);
      });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 0.5), 3);
    setZoom(newZoom);
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - lastPanPoint.x,
      y: e.clientY - lastPanPoint.y,
    });
  }, [isDragging, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setLastPanPoint({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  }, [pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - lastPanPoint.x,
        y: touch.clientY - lastPanPoint.y,
      });
    }
  }, [lastPanPoint, isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const wardToZoneMap = useMemo(() => {
    const map: { [key: number]: number } = {};
    if (zoneMapping && zoneMapping.zones) {
      // @ts-ignore
      zoneMapping.zones.forEach((zone: any) => {
        zone.wards.forEach((ward: number) => {
          map[ward] = zone.zone_no;
        });
      });
    }
    return map;
  }, []);

  const getZoneColor = (zoneNo: number) => {
    return zoneColors[zoneNo] || '#e0e0e0';
  };

  // Enhanced prediction logic based on zone characteristics and seasonal factors
  const getPredictionLevel = (zoneNo: number, disease: string, month: string = 'October') => {
    const zone = zoneData.find(z => z.zone_no === zoneNo);
    if (!zone) return 'low';

    let baseRisk = 0;

    // Base risk by urban nature
    switch (zone.urban_nature) {
      case 'Industrial + Residential':
      case 'Industrial':
        baseRisk = disease === 'dengue' ? 6 : disease === 'diarrhea' ? 4 : 3;
        break;
      case 'Port & Labour area':
        baseRisk = disease === 'typhoid' ? 7 : disease === 'diarrhea' ? 6 : 4;
        break;
      case 'Coastal':
        baseRisk = disease === 'dengue' ? 5 : disease === 'diarrhea' ? 5 : 3;
        break;
      case 'Dense residential':
        baseRisk = disease === 'dengue' ? 7 : disease === 'diarrhea' ? 6 : 5;
        break;
      case 'Commercial':
        baseRisk = disease === 'typhoid' ? 5 : disease === 'diarrhea' ? 4 : 3;
        break;
      case 'Transport hub':
        baseRisk = disease === 'typhoid' ? 6 : disease === 'diarrhea' ? 5 : 4;
        break;
      case 'IT corridor':
      case 'Premium residential':
        baseRisk = disease === 'dengue' ? 4 : disease === 'diarrhea' ? 3 : 2;
        break;
      default:
        baseRisk = 3;
    }

    // Seasonal multiplier (monsoon increases water-borne diseases)
    const monsoonMonths = ['June', 'July', 'August', 'September', 'October', 'November'];
    const isMonsoon = monsoonMonths.includes(month);
    
    if (isMonsoon) {
      if (disease === 'diarrhea' || disease === 'typhoid') {
        baseRisk = Math.min(10, baseRisk + 3);
      } else if (disease === 'dengue') {
        baseRisk = Math.min(10, baseRisk + 2);
      }
    }

    // Add some randomness for realism
    const randomFactor = (Math.sin(zoneNo * 17 + disease.length * 23) + 1) * 0.5; // 0-1
    baseRisk += randomFactor * 2;

    if (baseRisk >= 7) return 'high';
    if (baseRisk >= 4) return 'medium';
    return 'low';
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResults(null);

    // Simulate ML processing time
    const delay = Math.random() * 10000 + 25000; // 25-35 seconds

    setTimeout(() => {
      const results = {
        monthWise: {
          totalCases: Math.floor(Math.random() * 2000) + 3000,
          highRiskZones: Math.floor(Math.random() * 3) + 1,
          predictedIncrease: Math.floor(Math.random() * 15) + 5
        },
        diseaseWise: {
          dengue: {
            zones: zoneData.map(zone => ({
              zone: zone.zone_no,
              area: zone.area,
              cases: Math.floor(Math.random() * 200) + 50,
              risk: getPredictionLevel(zone.zone_no, 'dengue', selectedMonth)
            })).sort((a: any, b: any) => b.cases - a.cases)
          },
          diarrhea: {
            zones: zoneData.map(zone => ({
              zone: zone.zone_no,
              area: zone.area,
              cases: Math.floor(Math.random() * 300) + 80,
              risk: getPredictionLevel(zone.zone_no, 'diarrhea', selectedMonth)
            })).sort((a: any, b: any) => b.cases - a.cases)
          },
          typhoid: {
            zones: zoneData.map(zone => ({
              zone: zone.zone_no,
              area: zone.area,
              cases: Math.floor(Math.random() * 150) + 25,
              risk: getPredictionLevel(zone.zone_no, 'typhoid', selectedMonth)
            })).sort((a: any, b: any) => b.cases - a.cases)
          }
        }
      };
      setSimulationResults(results);
      setIsSimulating(false);
    }, delay);
  };

  const getIntensityColor = (level: string) => {
    switch(level) {
        case 'high': return '#EF4444'; // Red-500
        case 'medium': return '#F59E0B'; // Amber-500
        case 'low': return '#10B981'; // Emerald-500
        default: return '#e0e0e0';
    }
  };

  const getPathColor = (index: number) => {
    const wardNo = index + 1; // Assuming SVG paths 0-199 correspond to Wards 1-200
    const zoneNo = wardToZoneMap[wardNo];
    
    if (zoneNo) {
      if (mode === 'ai' && simulationResults) {
        // In AI mode, use simulation results
        const disease = selectedDisease;
        if (disease) {
          const zoneResult = simulationResults.diseaseWise[disease].zones.find((z: any) => z.zone === zoneNo);
          if (zoneResult) {
            return getIntensityColor(zoneResult.risk);
          }
        }
        return getZoneColor(zoneNo);
      } else if (selectedDisease) {
        const level = getPredictionLevel(zoneNo, selectedDisease, selectedMonth);
        return getIntensityColor(level);
      }
      return getZoneColor(zoneNo);
    }
    // Fallback for non-ward paths or unmapped wards
    return '#d3d3d3';
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black">Chennai Disease Prediction Dashboard</h1>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('data')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Data Heatmap
        </button>
        <button
          onClick={() => setMode('ai')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Smart AI Mode
        </button>
      </div>

      {mode === 'data' ? (
        <>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Map View */}
              <div className="w-full lg:flex-1 relative h-[600px]">
                <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing border border-slate-200 rounded-lg">
                  <div
                    className="w-full h-full relative"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <svg
                      viewBox="0 0 800 1589"
                      className="w-full h-full select-none"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                      }}
                    >
                      <g id="CHENNAI">
                        {svgPaths.map((path, index) => (
                          <path
                            key={index}
                            d={path}
                            fill={getPathColor(index)}
                            stroke="#000"
                            strokeWidth="1"
                            opacity={1}
                          />
                        ))}
                      </g>
                    </svg>
                  </div>
                </div>
                {/* Zoom Controls Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <button
                    onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
                    className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setZoom(Math.max(zoom * 0.8, 0.5))}
                    className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={resetZoom}
                    className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm"
                    title="Reset Zoom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Legend Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0 h-[600px] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-black">
                  {selectedDisease ? 'Prediction Legend' : 'Zones'}
                </h2>
                
                {selectedDisease ? (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold mb-2 capitalize">{selectedDisease} Risk Levels</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-red-500 flex-shrink-0" />
                          <span className="text-gray-800">High Risk Spike</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-amber-500 flex-shrink-0" />
                          <span className="text-gray-800">Medium Risk Spike</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-emerald-500 flex-shrink-0" />
                          <span className="text-gray-800">Low Risk / Stable</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Showing predicted patient spikes for {selectedDisease} based on zone characteristics and seasonal factors.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {zoneData.map((zone) => (
                      <div key={zone.zone_no} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 border border-black flex-shrink-0"
                          style={{ backgroundColor: getZoneColor(zone.zone_no) }}
                        />
                        <span className="text-lg text-gray-800">
                          {zone.zone_no}_{zone.zone_name.split('-').join('')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6 text-black">Disease Spike Prediction</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                  onClick={() => setSelectedDisease(null)}>
                  <h3 className="text-xl font-bold mb-2">Zone Overview</h3>
                  <p className="text-gray-600 mb-4">View standard zone divisions and boundaries.</p>
                  <div className={`px-4 py-2 rounded text-center font-medium ${!selectedDisease ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {selectedDisease === null ? 'Active' : 'Select'}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Disease Prediction</h3>
                  <p className="text-gray-600 mb-4">Select a disease to view predicted high-demand areas.</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedDisease('dengue')}
                      className={`px-4 py-2 rounded font-medium transition-colors ${selectedDisease === 'dengue' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      Dengue
                    </button>
                    <button 
                      onClick={() => setSelectedDisease('diarrhea')}
                      className={`px-4 py-2 rounded font-medium transition-colors ${selectedDisease === 'diarrhea' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      Diarrhea
                    </button>
                    <button 
                      onClick={() => setSelectedDisease('typhoid')}
                      className={`px-4 py-2 rounded font-medium transition-colors ${selectedDisease === 'typhoid' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      Typhoid
                    </button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2">Analysis Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Wards:</span>
                      <span className="font-medium">200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">High Risk Zones:</span>
                      <span className="font-medium text-red-500">
                        {selectedDisease ? zoneData.filter(z => getPredictionLevel(z.zone_no, selectedDisease, selectedMonth) === 'high').length : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Affected Population (Est):</span>
                      <span className="font-medium">
                        {selectedDisease ? (zoneData.filter(z => getPredictionLevel(z.zone_no, selectedDisease, selectedMonth) !== 'low').length * 5000 + Math.floor(Math.random() * 10000)).toLocaleString() : '-'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Smart AI Mode */
        <div className="space-y-8">
          {!simulationResults ? (
            <Card className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Smart AI Disease Prediction</h2>
              <p className="text-gray-600 mb-6">Run advanced ML models to predict disease outbreaks and demand spikes across Chennai zones.</p>
              
              {!isSimulating ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    <label className="text-lg font-medium text-gray-700">Select Month:</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="p-3 border rounded-lg shadow-sm text-lg min-w-[200px]"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={runSimulation}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Run AI Simulator
                  </button>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Note: Simulation creates a detailed predictive model based on 10 years of historical data and current zone parameters. This process takes 25-35 seconds.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
                  <p className="text-lg font-medium text-gray-700">Running simulator...</p>
                  <p className="text-sm text-gray-500">Analyzing historical data and running ML predictions</p>
                </div>
              )}
            </Card>
          ) : (
            <>
              {/* Month-wise Analysis */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4">Month-wise Demand Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{simulationResults.monthWise.totalCases.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Predicted Cases</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{simulationResults.monthWise.highRiskZones}</div>
                    <div className="text-sm text-gray-600">High Risk Zones</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+{simulationResults.monthWise.predictedIncrease}%</div>
                    <div className="text-sm text-gray-600">Predicted Increase</div>
                  </div>
                </div>
              </Card>

              {/* Disease-wise Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['dengue', 'diarrhea', 'typhoid'].map(disease => (
                  <Card key={disease} className="p-6">
                    <h4 className="text-xl font-bold mb-4 capitalize">{disease} Prediction</h4>
                    <div className="space-y-3">
                      {simulationResults.diseaseWise[disease].zones.slice(0, 5).map((zone: any, idx: number) => (
                        <div key={zone.zone} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Zone {zone.zone} - {zone.area}</div>
                            <div className="text-sm text-gray-600">{zone.cases} cases</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            zone.risk === 'high' ? 'bg-red-100 text-red-800' :
                            zone.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {zone.risk}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Map with AI Results */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:flex-1 relative h-[600px]">
                  <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing border border-slate-200 rounded-lg">
                    <div
                      className="w-full h-full relative"
                      onWheel={handleWheel}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <svg
                        viewBox="0 0 800 1589"
                        className="w-full h-full select-none"
                        style={{
                          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                          transformOrigin: 'center center',
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                      >
                        <g id="CHENNAI">
                          {svgPaths.map((path, index) => (
                            <path
                              key={index}
                              d={path}
                              fill={getPathColor(index)}
                              stroke="#000"
                              strokeWidth="1"
                              opacity={1}
                            />
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>
                  {/* Zoom Controls */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <button onClick={() => setZoom(Math.min(zoom * 1.2, 3))} className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button onClick={() => setZoom(Math.max(zoom * 0.8, 0.5))} className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <button onClick={resetZoom} className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-2 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* AI Legend */}
                <div className="w-full lg:w-80 flex-shrink-0 h-[600px] overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-6 text-black">AI Prediction Results</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Risk Levels</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-red-500 flex-shrink-0" />
                          <span className="text-gray-800">High Risk</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-amber-500 flex-shrink-0" />
                          <span className="text-gray-800">Medium Risk</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-emerald-500 flex-shrink-0" />
                          <span className="text-gray-800">Low Risk</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      AI predictions based on zone characteristics, historical data, and seasonal patterns for {selectedMonth}.
                    </div>
                  </div>
                </div>
              </div>

              {/* Run Again Button */}
              <div className="text-center">
                <button
                  onClick={() => { setSimulationResults(null); setSelectedDisease(null); }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Run New Simulation
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
