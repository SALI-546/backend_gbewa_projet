// PaymentOrderList.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import AddPaymentOrderModal from './AddPaymentOrderModal';
import PaymentOrderDetails from './PaymentOrderDetails';

const PaymentOrderList = () => {
    // États pour les filtres
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    // États pour la gestion des modaux et des détails
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // États pour les données
    const [projects, setProjects] = useState([]);
    const [paymentOrders, setPaymentOrders] = useState([]);

    // États pour le chargement et les erreurs
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [error, setError] = useState(null);

    // Récupérer les projets depuis l'API
    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            try {
                const response = await axios.get('/api/projects');
                const data = response.data;

                const options = [
                    { value: '', label: 'Tous les projets' },
                    ...data.map((project) => ({
                        value: project.id,
                        label: project.name || project.title, 
                    })),
                ];
                setProjects(options);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets :', error);
                alert('Impossible de récupérer les projets.');
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);

    // Récupérer les ordres de paiement selon les filtres
    useEffect(() => {
        const fetchPaymentOrders = async () => {
            setLoadingOrders(true);
            setError(null);
            try {
                const params = {};

                if (selectedProject?.value) params.project_id = selectedProject.value;
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;

                console.log('Paramètres envoyés à l\'API :', params);

                const response = await axios.get('/api/payment-orders', { params });
                setPaymentOrders(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des ordres de paiement :', error);
                setError('Impossible de récupérer les ordres de paiement.');
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchPaymentOrders();
    }, [selectedProject, startDate, endDate]);

    // Gérer l'ouverture du modal pour ajouter un ordre de paiement
    const handleAddClick = () => {
        setEditingOrder(null);
        setShowModal(true);
    };

    // Gérer l'ouverture du modal pour modifier un ordre de paiement
    const handleEditClick = (order) => {
        console.log('Éditer l\'ordre :', order); // Débogage
        setEditingOrder(order);
        setShowModal(true);
    };

    // Gérer l'ouverture des détails d'un ordre de paiement
    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    // Gérer la suppression d'un ordre de paiement
    const handleDeleteClick = async (order) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ordre de paiement ?')) {
            try {
                await axios.delete(`/api/payment-orders/${order.id}`);
                alert('Ordre de paiement supprimé avec succès.');
                setPaymentOrders(paymentOrders.filter((o) => o.id !== order.id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ordre de paiement :', error);
                alert('Erreur lors de la suppression.');
            }
        }
    };

    // Fermer le modal et réinitialiser l'ordre en édition
    const closeModal = () => {
        setShowModal(false);
        setEditingOrder(null);
    };

    // Fermer les détails et réinitialiser l'ordre sélectionné
    const closeDetails = () => {
        setShowDetails(false);
        setSelectedOrder(null);
    };

    return (
        <>
            {/* Contenu principal */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {/* Section des filtres et bouton d'ajout */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold mb-4 md:mb-0">ORDRES DE PAIEMENT</h1>

                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="start-date" className="text-gray-700">Date de début:</label>
                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg text-lg px-4 py-2"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="end-date" className="text-gray-700">Date de fin:</label>
                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg text-lg px-4 py-2"
                            />
                        </div>
                        <button
                            onClick={handleAddClick}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-md"
                        >
                            <FaPlus className="mr-2" />
                            Ajouter
                        </button>
                    </div>
                </div>

                {/* Filtrer par projet */}
                <div className="mb-4">
                    <label htmlFor="project-filter" className="text-gray-700 mr-2">Filtrer par projet:</label>
                    {loadingProjects ? (
                        <p>Chargement des projets...</p>
                    ) : (
                        <Select
                            id="project-filter"
                            value={selectedProject}
                            onChange={setSelectedProject}
                            options={projects}
                            className="w-full lg:w-1/3"
                            placeholder="Sélectionner un projet"
                            isClearable
                        />
                    )}
                </div>

                {/* Tableau des ordres de paiement */}
                <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Projet</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">N° d'Ordre</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingOrders ? (
                            <tr>
                                <td colSpan="3" className="py-4 px-4 text-center text-gray-500">Chargement...</td>
                            </tr>
                        ) : paymentOrders.length > 0 ? (
                            paymentOrders.map((order) => (
                                <tr key={order.id} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                    <td className="py-2 px-4 border border-gray-300 text-gray-800">
                                        {order.project?.name || order.project?.title || 'Non défini'}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-gray-800">
                                    {order.orderNumber}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 flex justify-center space-x-4">
                                        <button
                                            onClick={() => handleViewClick(order)}
                                            className="text-gray-600 hover:text-black focus:outline-none"
                                        >
                                            <FaEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(order)}
                                            className="text-gray-600 hover:text-black focus:outline-none"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(order)}
                                            className="text-red-600 hover:text-red-800 focus:outline-none"
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-4 px-4 text-center text-gray-500">Aucun ordre de paiement trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {error && <div className="mt-4 text-red-600">{error}</div>}
            </div>

            {/* Modaux rendus en dehors du conteneur principal */}
            {showModal && (
                <AddPaymentOrderModal
                    isVisible={showModal}
                    onClose={closeModal}
                    editData={editingOrder} 
                />
            )}

            {showDetails && selectedOrder && (
                <PaymentOrderDetails
                    isVisible={showDetails}
                    order={selectedOrder}
                    onClose={closeDetails}
                />
            )}
        </>
    );
}
export default PaymentOrderList;
