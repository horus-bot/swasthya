"use client";
import { useState, useEffect } from 'react';
import './tracker.css';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  value: number;
  notes?: string;
}

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: 'heart-rate',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      target: 70,
      icon: '💗',
      color: '#ef4444',
      trend: 'stable',
      lastUpdated: '2 hours ago'
    },
    {
      id: 'blood-pressure',
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      target: 120,
      icon: '🫀',
      color: '#3b82f6',
      trend: 'up',
      lastUpdated: '1 day ago'
    },
    {
      id: 'weight',
      name: 'Weight',
      value: 70.5,
      unit: 'kg',
      target: 68,
      icon: '⚖️',
      color: '#10b981',
      trend: 'down',
      lastUpdated: '3 hours ago'
    },
    {
      id: 'steps',
      name: 'Daily Steps',
      value: 8420,
      unit: 'steps',
      target: 10000,
      icon: '👟',
      color: '#f59e0b',
      trend: 'up',
      lastUpdated: '30 min ago'
    },
    {
      id: 'sleep',
      name: 'Sleep',
      value: 7.5,
      unit: 'hours',
      target: 8,
      icon: '😴',
      color: '#8b5cf6',
      trend: 'stable',
      lastUpdated: 'Today'
    },
    {
      id: 'water',
      name: 'Water Intake',
      value: 2.1,
      unit: 'liters',
      target: 2.5,
      icon: '💧',
      color: '#06b6d4',
      trend: 'up',
      lastUpdated: '1 hour ago'
    }
  ]);

  const [healthRecords] = useState<HealthRecord[]>([
    { id: '1', date: '2026-02-04', type: 'Heart Rate', value: 72, notes: 'Normal range' },
    { id: '2', date: '2026-02-04', type: 'Weight', value: 70.5, notes: 'Morning measurement' },
    { id: '3', date: '2026-02-03', type: 'Blood Pressure', value: 118, notes: 'Slightly low' },
    { id: '4', date: '2026-02-03', type: 'Steps', value: 9850, notes: 'Good activity day' },
    { id: '5', date: '2026-02-02', type: 'Sleep', value: 8.2, notes: 'Excellent rest' }
  ]);

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="tracker-page">
      {/* Header Section */}
      <div className="tracker-header">
        <div className="header-content">
          <h1 className="page-title">Health Tracker</h1>
          <p className="page-subtitle">
            Monitor your health metrics and track your wellness journey
          </p>
        </div>
        <div className="header-stats">
          <div className="quick-stat">
            <span className="stat-icon">🎯</span>
            <div className="stat-info">
              <span className="stat-number">85%</span>
              <span className="stat-label">Goals Met</span>
            </div>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">📊</span>
            <div className="stat-info">
              <span className="stat-number">6</span>
              <span className="stat-label">Metrics Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📈 Metrics
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 History
        </button>
        <button 
          className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Goals
        </button>
      </div>

      <div className="tracker-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="metrics-grid">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="metric-card">
                  <div className="metric-header">
                    <div className="metric-icon" style={{background: `${metric.color}20`}}>
                      {metric.icon}
                    </div>
                    <div className="metric-trend" style={{color: getTrendColor(metric.trend)}}>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="metric-info">
                    <h3 className="metric-name">{metric.name}</h3>
                    <div className="metric-value">
                      <span className="value-number">{metric.value}</span>
                      <span className="value-unit">{metric.unit}</span>
                    </div>
                    <div className="metric-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${getProgressPercentage(metric.value, metric.target)}%`,
                            background: metric.color
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        Target: {metric.target} {metric.unit}
                      </span>
                    </div>
                    <div className="metric-timestamp">
                      Last updated: {metric.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="daily-summary">
              <h2 className="section-title">Today's Summary</h2>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-icon">🏃‍♀️</div>
                  <div className="summary-content">
                    <h4>Activity Level</h4>
                    <p>Moderate - You're doing great!</p>
                    <div className="summary-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '75%', background: '#f59e0b'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">🥗</div>
                  <div className="summary-content">
                    <h4>Nutrition</h4>
                    <p>Good hydration, balanced intake</p>
                    <div className="summary-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '85%', background: '#10b981'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">😌</div>
                  <div className="summary-content">
                    <h4>Wellness</h4>
                    <p>Excellent sleep quality</p>
                    <div className="summary-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '90%', background: '#8b5cf6'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="metrics-section">
            <div className="metrics-detailed">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="detailed-metric-card">
                  <div className="metric-chart-header">
                    <div className="chart-title">
                      <span className="chart-icon">{metric.icon}</span>
                      <h3>{metric.name}</h3>
                    </div>
                    <div className="chart-value" style={{color: metric.color}}>
                      {metric.value} {metric.unit}
                    </div>
                  </div>
                  <div className="metric-chart">
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        {[...Array(7)].map((_, index) => (
                          <div 
                            key={index} 
                            className="chart-bar"
                            style={{
                              height: `${Math.random() * 80 + 20}%`,
                              background: `${metric.color}${Math.floor(Math.random() * 5 + 3)}0`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="chart-labels">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                  <div className="metric-actions">
                    <button className="action-btn">📝 Log Data</button>
                    <button className="action-btn">📊 View Trends</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-header">
              <h2 className="section-title">Health History</h2>
              <div className="history-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">This Week</button>
                <button className="filter-btn">This Month</button>
              </div>
            </div>
            <div className="history-timeline">
              {healthRecords.map((record) => (
                <div key={record.id} className="history-item">
                  <div className="history-date">
                    <div className="date-circle"></div>
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="history-content">
                    <h4 className="history-type">{record.type}</h4>
                    <p className="history-value">
                      {record.value} {healthMetrics.find(m => m.name === record.type)?.unit || ''}
                    </p>
                    {record.notes && (
                      <p className="history-notes">{record.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="goals-section">
            <div className="goals-header">
              <h2 className="section-title">Health Goals</h2>
              <button className="add-goal-btn">+ Add Goal</button>
            </div>
            <div className="goals-grid">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="goal-card">
                  <div className="goal-header">
                    <span className="goal-icon">{metric.icon}</span>
                    <h4 className="goal-name">{metric.name}</h4>
                  </div>
                  <div className="goal-progress">
                    <div className="goal-values">
                      <span className="current-value">Current: {metric.value} {metric.unit}</span>
                      <span className="target-value">Target: {metric.target} {metric.unit}</span>
                    </div>
                    <div className="goal-progress-bar">
                      <div 
                        className="goal-progress-fill"
                        style={{
                          width: `${getProgressPercentage(metric.value, metric.target)}%`,
                          background: metric.color
                        }}
                      ></div>
                    </div>
                    <div className="goal-percentage">
                      {Math.round(getProgressPercentage(metric.value, metric.target))}% Complete
                    </div>
                  </div>
                  <div className="goal-actions">
                    <button className="goal-action-btn">✏️ Edit</button>
                    <button className="goal-action-btn">📊 Track</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
