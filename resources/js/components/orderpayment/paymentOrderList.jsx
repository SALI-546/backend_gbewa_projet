import React, { useState } from 'react';
import Select from 'react-select'; // Importer react-select
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import AddPaymentOrderModal from './AddPaymentOrderModal';
import PaymentOrderDetails from './PaymentOrderDetails';

const PaymentOrderList = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // État pour le projet sélectionné

    const paymentRequests = [
        { project: 'Projet 1', orderNumber: '001' },
        { project: 'Projet 2', orderNumber: '002' },
        { project: 'Projet 3', orderNumber: '003' },
    ];

    // Options pour react-select
    const projectOptions = [
        { value: '', label: 'Tous les projets' },
        { value: 'Projet 1', label: 'Projet 1' },
        { value: 'Projet 2', label: 'Projet 2' },
        { value: 'Projet 3', label: 'Projet 3' },
    ];

    // Fonction pour gérer l'ouverture du modal d'ajout
    const handleAddClick = () => {
        setEditingOrder(null);
        setShowModal(true);
    };

    // Fonction pour ouvrir le modal en mode édition
    const handleEditClick = (order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    // Fonction pour fermer le modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Fonction pour afficher les détails de la commande
    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    // Fonction pour fermer le composant de détails
    const closeDetails = () => {
        setShowDetails(false);
        setSelectedOrder(null);
    };

    // Filtrage des demandes de paiement en fonction du projet sélectionné
    const filteredRequests = paymentRequests.filter(
        (request) => !selectedProject || request.project === selectedProject.value
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Titre et conteneur pour la sélection des dates et le bouton ajouter */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">ORDRE DE PAIEMENT</h1>

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

                <button 
                    onClick={handleAddClick}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-md">
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
                            <td className="py-2 px-4 border border-gray-300 text-gray-800">{request.project}</td>
                            <td className="py-2 px-4 border border-gray-300 text-gray-800">{request.orderNumber}</td>
                            <td className="py-2 px-4 border border-gray-300 flex justify-center space-x-4">
                                <button 
                                    className="text-gray-600 hover:text-black focus:outline-none"
                                    onClick={() => handleViewClick(request)}
                                >
                                    <FaEye size={18} />
                                </button>
                                <button 
                                    className="text-gray-600 hover:text-black focus:outline-none"
                                    onClick={() => handleEditClick(request)}
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

            {/* Utilisation du Composant Modal pour Ajouter/Édition */}
            <AddPaymentOrderModal isVisible={showModal} onClose={closeModal} />

            {/* Utilisation du Composant pour les Détails */}
            <PaymentOrderDetails 
                isVisible={showDetails} 
                order={selectedOrder} 
                onClose={closeDetails} 
            />
        </div>
    );
};

export default PaymentOrderList;
