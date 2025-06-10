// // src/App.js
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import AdminDashboard from './pages/AdminDashboard';
// import MentorDashboard from './pages/MentorDashboard';
// import ProtectedRoute from './routes/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />

//           <Route path="/admin" element={
//             <ProtectedRoute allowedRole="RP">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }/>

//           <Route path="/mentor" element={
//             <ProtectedRoute allowedRole="mentor">
//               <MentorDashboard />
//             </ProtectedRoute>
//           }/>

//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// src/App.jsx
import DoubtsPage from './pages/DoubtsPage';

function App() {
  return <DoubtsPage />;
}

export default App;
