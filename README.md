# LIGO Gravitational Wave Signal Classifier

A machine learning system for classifying gravitational-wave signals and distinguishing astrophysical events from detector noise.

The project applies feature engineering and supervised machine learning to gravitational-wave signal data from LIGO observatory datasets.

---

## Overview

Gravitational-wave detectors are affected by different forms of noise that can make astrophysical event detection challenging.

This project investigates whether engineered signal features can be used to distinguish meaningful astrophysical events from detector noise.

---

## Objectives

- Process gravitational-wave signal data
- Engineer informative signal features
- Visualize analytical results
- Reduce noise-related effects
- Train a supervised classifier
- Evaluate classification performance


---

## Machine Learning Pipeline

```text
LIGO Dataset
     ↓
Data Preprocessing
     ↓
Signal Feature Engineering
     ↓
Visualization
     ↓
Train / Test Split
     ↓
Random Forest
     ↓
Model Evaluation
     
