// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard";
import ActionDetail from "./components/ActionDetail";
import RSEPlatform from "./RSEPlatform";
import Planning from "./components/Planning";
import Newsletter from "./components/Newsletter";
import Statistics from "./components/Statistics";

import "./App.css";



function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!user || !user.role) return <Navigate to="/login" replace />;
  
  // Normaliser le rôle de l'utilisateur
  const normalizedUserRole = user.role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Normaliser les rôles autorisés
  const allowedRoles = roles.map(role => 
    role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );
  
  // Vérifier si l'utilisateur a un rôle autorisé
  if (!allowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Étudiant/Enseignant/Admin */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["admin", "etudiant", "enseignant"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/actions/:id"
            element={
              <PrivateRoute roles={["admin", "etudiant", "enseignant"]}>
                <ActionDetail />
              </PrivateRoute>
            }
          />

          {/* Admin uniquement */}
          <Route
            path="/RSEPlatform"
            element={
              <PrivateRoute roles={["admin"]}>
                <RSEPlatform />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/planning"
            element={
              <PrivateRoute roles={["admin"]}>
                <Planning />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/newsletter"
            element={
              <PrivateRoute roles={["admin"]}>
                <Newsletter />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/statistics"
            element={
              <PrivateRoute roles={["admin"]}>
                <Statistics />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

















/*
import React, { useState, useEffect, useContext } from 'react';
import { fetchActions, createAction, updateAction, deleteAction } from './services/api';
import ActionCard from './components/ActionCard';
import ActionForm from './components/ActionForm';
import SearchBar from './components/SearchBar';

import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RSEPlatform from './RSEPlatform'; 
import Navbar from "./components/Navbar";
import Dashboard from './components/Dashboard';
import ActionDetail from './components/ActionDetail';
import Planning from './components/Planning';
import Newsletter from './components/Newsletter';
import Statistics from './components/Statistics';

/*function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

/**************

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
}
 
/***************** */ 

/****************************
  
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();   // ✅ Utilise ton hook custom

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
}


/*********


function App() {
  return (
     <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        
            {/* Accessible à tous connectés *
          <Route path="/dashboard" element={
            <PrivateRoute roles={["admin","etudiant","enseignant"]}>
              <Dashboard />
            </PrivateRoute>
          }/>
          
          <Route path="/actions/:id" element={
            <PrivateRoute roles={["admin","etudiant","enseignant"]}>
              <ActionDetail />
            </PrivateRoute>
          }/>

          {/* Accessible seulement admin *
          <Route path="/RSEPlatform" element={
            <PrivateRoute roles={["admin"]}>
              <RSEPlatform  />
            </PrivateRoute>
          }/>

          

          <Route path="/dashboard" element={<Dashboard />} /> 
           
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/planning" element={<Planning />} />
           <Route path="/actions/:id" element={<ActionDetail />} />
          
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;*/



































































































































