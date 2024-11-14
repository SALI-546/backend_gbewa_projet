import React, { useState } from 'react'; 
import Select from 'react-select'; // Importer react-select
import { FaEye, FaEdit } from 'react-icons/fa';
import { FiCornerUpLeft, FiCornerUpRight } from 'react-icons/fi'; 
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import EmployeeUpdate from './EmployeeUpdate';
import 'tailwindcss/tailwind.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
    {
      id: '01',
      nom: 'Emily',
      prenoms: 'Nelson',
      matricule: '004505',
      poste: 'Secretaire',
      email: 'nom@gmail.com',
      telephone: '98654321',
    },
   
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedGraduation, setSelectedGraduation] = useState(null); // État pour la graduation sélectionnée

  // Options pour le menu déroulant de Graduation
  const graduationOptions = [
    { value: 'A1', label: 'Graduation A1' },
    { value: 'A2', label: 'Graduation A2' },
    { value: 'A3', label: 'Graduation A3' },
  ];

  // Gestion des détails de l'employé
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  // Gestion de l'édition d'un employé
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsUpdateOpen(true);
  };

  // Mise à jour de l'employé après modification
  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsUpdateOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Titre et boutons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employés</h1>
        <div className="flex items-center space-x-2">
          {/* Menu déroulant pour trier */}
          <select className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-lg">
            <option>Trier par Nom</option>
            <option>Trier par Date</option>
          </select>
          {/* Boutons de navigation gauche et droite */}
          <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <FiCornerUpLeft className="w-6 h-6 text-gray-600" /> {/* Flèche incurvée gauche */}
          </button>
          <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <FiCornerUpRight className="w-6 h-6 text-gray-600" /> {/* Flèche incurvée droite */}
          </button>
          {/* Bouton Ajouter */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-lg flex items-center"
          >
            Ajouter <span className="ml-2 text-xl">+</span>
          </button>
        </div>
      </div>

      {/* Sélection de Graduation */}
      <div className="mb-4">
        <Select
          className="w-full border border-gray-300 text-lg"
          options={graduationOptions}
          value={selectedGraduation}
          onChange={setSelectedGraduation}
          placeholder="Choisissez une Graduation"
        />
      </div>

      {/* Render the form as a modal if isFormOpen is true */}
      {isFormOpen && <EmployeeForm closeModal={() => setIsFormOpen(false)} />}

      {/* Render the employee details as a modal if isDetailsOpen is true */}
      {isDetailsOpen && selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          closeModal={() => setIsDetailsOpen(false)}
        />
      )}

      {/* Render the employee update form as a modal if isUpdateOpen is true */}
      {isUpdateOpen && selectedEmployee && (
        <EmployeeUpdate
          employee={selectedEmployee}
          closeModal={() => setIsUpdateOpen(false)}
          updateEmployee={handleUpdateEmployee}
        />
      )}

      {/* Tableau des employés */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-lg">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">ID</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Nom</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Prénoms</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Matricule</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Poste</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Email</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Téléphone</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="py-3 px-6 text-center border-r">{employee.id}</td>
                <td className="py-3 px-6 text-center border-r">{employee.nom}</td>
                <td className="py-3 px-6 text-center border-r">{employee.prenoms}</td>
                <td className="py-3 px-6 text-center border-r">{employee.matricule}</td>
                <td className="py-3 px-6 text-center border-r">{employee.poste}</td>
                <td className="py-3 px-6 text-center border-r">{employee.email}</td>
                <td className="py-3 px-6 text-center border-r">{employee.telephone}</td>
                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                  <button
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleViewDetails(employee)}
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    className="text-gray-500 hover:text-yellow-600"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
