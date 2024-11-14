import React, { useState } from 'react';
import Select from 'react-select'; // Importer react-select
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import PaymentRequestForm from './PaymentRequestForm'; // Form component
import PaymentRequestDetails from './PaymentRequestDetails'; // Details component

const PaymentRequestList = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // État pour le projet sélectionné
    const [showForm, setShowForm] = useState(false); // État pour afficher le formulaire
    const [showDetails, setShowDetails] = useState(false); // État pour afficher les détails
    const [selectedRequest, setSelectedRequest] = useState(null); // Données pour les détails ou l'édition

    // Données simulées des demandes de paiement
    const paymentRequests = [
        { projet: 'Projet 1', orderNumber: '001', date: '09/10/2024 00:00', operation: 'Frais de communication', beneficiary: 'MOOV BENIN', invoice: 'EM100234-23 du 12/10/2024', budgetLine: 'A0.12', quality: 'Chargé de la Logistique' },
        { projet: 'Projet 2', orderNumber: '002', date: '10/10/2024 10:00', operation: 'Déplacement', beneficiary: 'TRANSPORT SA', invoice: 'EM100235-23 du 13/10/2024', budgetLine: 'B0.34', quality: 'Responsable Financier' },
        { projet: 'Projet 3', orderNumber: '003', date: '11/10/2024 11:00', operation: 'Achats de fournitures', beneficiary: 'PAPETERIE SARL', invoice: 'EM100236-23 du 14/10/2024', budgetLine: 'C1.56', quality: 'Chef de Projet' },
    ];

    // Options pour react-select
    const projectOptions = [
        { value: '', label: 'Tous les projets' },
        { value: 'Projet 1', label: 'Projet 1' },
        { value: 'Projet 2', label: 'Projet 2' },
        { value: 'Projet 3', label: 'Projet 3' },
    ];

    // Filtrer les demandes de paiement en fonction du projet sélectionné
    const filteredRequests = paymentRequests.filter((request) => 
        !selectedProject || request.projet === selectedProject.value
    );

    // Gestion du clic pour ajouter une demande de paiement
    const handleAddClick = () => {
        setSelectedRequest(null);
        setShowForm(true);
    };

    // Gestion du clic pour éditer une demande de paiement
    const handleEditClick = (request) => {
        setSelectedRequest(request);
        setShowForm(true);
    };

    // Gestion du clic pour afficher les détails d'une demande
    const handleViewClick = (request) => {
        setSelectedRequest(request);
        setShowDetails(true);
    };

    const closeForm = () => {
        setShowForm(false);
    };

    const closeDetails = () => {
        setShowDetails(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {!showDetails && (
                <>
                    {/* Titre et le conteneur pour la sélection des dates et le bouton ajouter */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">DEMANDE DE PAIEMENT</h1>

                        {/* Conteneur pour la sélection des dates */}
                        <div className="bg-white border border-gray-300 rounded-lg flex items-center space-x-4 p-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg text-lg px-4 py-2"
                                placeholder="Date de début"
                            />
                            <span>-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg text-lg px-4 py-2"
                                placeholder="Date de fin"
                            />
                        </div>

                        {/* Bouton Ajouter */}
                        <button
                            onClick={handleAddClick}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-md"
                        >
                            <span className="mr-2">Ajouter</span>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>

                    {/* Formulaire de filtre par projet avec react-select */}
                    <div className="mb-4">
                        <label htmlFor="project-filter" className="text-gray-700 mr-2">Filtrer par projet:</label>
                        <Select
                            id="project-filter"
                            value={selectedProject}
                            onChange={(selectedOption) => setSelectedProject(selectedOption)}
                            options={projectOptions}
                            className="w-full lg:w-1/3"
                            placeholder="Sélectionner un projet"
                            isClearable
                        />
                    </div>

                    {/* Affichage du formulaire si showForm est true */}
                    {showForm && <PaymentRequestForm onClose={closeForm} editData={selectedRequest} />}

                    {/* Tableau des demandes de paiement */}
                    <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Projet</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">N° d'Ordre</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request, index) => (
                                <tr key={index} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                    <td className="py-2 px-4 border border-gray-300 text-gray-800">{request.projet}</td>
                                    <td className="py-2 px-4 border border-gray-300 text-gray-800">{request.orderNumber}</td>
                                    <td className="py-2 px-4 border border-gray-300 flex justify-center space-x-4">
                                        <button
                                            onClick={() => handleViewClick(request)}
                                            className="text-gray-600 hover:text-black focus:outline-none"
                                        >
                                            <FaEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(request)}
                                            className="text-gray-600 hover:text-black focus:outline-none"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 focus:outline-none">
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Affichage des détails de la demande de paiement si showDetails est true */}
            {showDetails && <PaymentRequestDetails request={selectedRequest} onClose={closeDetails} />}
        </div>
    );
};

export default PaymentRequestList;
