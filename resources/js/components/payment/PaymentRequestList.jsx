// PaymentRequestList.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'; // Importer axios
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import PaymentRequestForm from './PaymentRequestForm'; // Formulaire de création/modification
import PaymentRequestDetails from './PaymentRequestDetails'; // Détails de la demande de paiement

const PaymentRequestList = () => {
    // États pour les filtres
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // Projet sélectionné pour le filtre

    // États pour la gestion des modaux/formulaires
    const [showForm, setShowForm] = useState(false); // Afficher/masquer le formulaire
    const [showDetails, setShowDetails] = useState(false); // Afficher/masquer les détails
    const [selectedRequestId, setSelectedRequestId] = useState(null); // ID de la demande sélectionnée pour les actions

    // États pour les données
    const [projects, setProjects] = useState([]); // Liste des projets pour le filtre
    const [paymentRequests, setPaymentRequests] = useState([]); // Liste des demandes de paiement

    // État pour déclencher le rafraîchissement des données
    const [refresh, setRefresh] = useState(false);

    // États pour le chargement et les erreurs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Récupérer les projets depuis l'API lors du montage du composant
    useEffect(() => {
        const fetchProjects = async () => {
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
            }
        };

        fetchProjects();
    }, []);

    // Récupérer les demandes de paiement depuis l'API avec les filtres
    useEffect(() => {
        const fetchPaymentRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const projectId = selectedProject ? selectedProject.value : '';
                const params = {};

                if (projectId) params.project_id = projectId;
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;

                console.log('Paramètres de filtre envoyés à l\'API :', params); // Log pour débogage

                const response = await axios.get('/api/payment-requests', { params });
                const data = response.data;

                console.log('PaymentRequests récupérés depuis l\'API :', data); // Log pour débogage
                setPaymentRequests(data.data); // Utiliser data.data
            } catch (error) {
                console.error('Erreur lors de la récupération des demandes de paiement :', error);
                setError('Impossible de récupérer les demandes de paiement.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentRequests();
    }, [selectedProject, startDate, endDate, refresh]);

    // Fonction pour ouvrir le formulaire de création
    const handleAddClick = () => {
        setSelectedRequestId(null); 
        setShowForm(true);
    };

    // Fonction pour ouvrir le formulaire de modification
    const handleEditClick = (request) => {
        setSelectedRequestId(request.id);
        setShowForm(true);
    };

    // Fonction pour ouvrir les détails de la demande
    const handleViewClick = (requestId) => {
        console.log('Voir les détails de la demande:', requestId); // Log pour débogage
        setSelectedRequestId(requestId);
        setShowDetails(true);     
    };

    // Fonction pour supprimer une demande de paiement
    const handleDeleteClick = async (request) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de paiement ?')) {
            try {
                const response = await axios.delete(`/api/payment-requests/${request.id}`);
                if (response.status === 200 || response.status === 204) {
                    alert('Demande de paiement supprimée avec succès.');
                    setRefresh(!refresh); 
                } else {
                    throw new Error('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de la demande de paiement:', error);
                alert('Erreur lors de la suppression de la demande de paiement: ' + error.message);
            }
        }
    };

    // Fonction pour fermer le formulaire
    const closeForm = () => {
        setShowForm(false);
        setRefresh(!refresh); 
    };

    // Fonction pour fermer les détails
    const closeDetails = () => {
        setShowDetails(false);
        setSelectedRequestId(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {!showDetails && (
                <>
                    {/* Section des filtres et bouton d'ajout */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold mb-4 md:mb-0">DEMANDE DE PAIEMENT</h1>

                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                            {/* Sélecteur de date de début */}
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
                            {/* Sélecteur de date de fin */}
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
                            {/* Bouton pour ajouter une nouvelle demande */}
                            <button
                                onClick={handleAddClick}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-md"
                            >
                                <FaPlus className="mr-2" /> {/* Icône pour ajouter */}
                                Ajouter
                            </button>
                        </div>
                    </div>

                    {/* Sélecteur pour filtrer par projet */}
                    <div className="mb-4">
                        <label htmlFor="project-filter" className="text-gray-700 mr-2">Filtrer par projet:</label>
                        <Select
                            id="project-filter"
                            value={selectedProject}
                            onChange={setSelectedProject}
                            options={projects}
                            className="w-full lg:w-1/3"
                            placeholder="Sélectionner un projet"
                            isClearable
                        />
                    </div>

                    {/* Affichage du formulaire de création/modification */}
                    {showForm && (
                        <PaymentRequestForm
                            onClose={closeForm}
                            editData={selectedRequestId ? paymentRequests.find(req => req.id === selectedRequestId) : null}
                        />
                    )}

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
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">Chargement des demandes de paiement...</td>
                                </tr>
                            ) : paymentRequests.length > 0 ? (
                                paymentRequests.map((request) => (
                                    <tr key={request.id} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                        <td className="py-2 px-4 border border-gray-300 text-gray-800">
                                            {request.project.name || request.project.title}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 text-gray-800">
                                            {request.orderNumber} {/* Utiliser camelCase */}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 flex justify-center space-x-4">
                                            <button
                                                onClick={() => handleViewClick(request.id)}
                                                className="text-gray-600 hover:text-black focus:outline-none"
                                                title="Visualiser"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(request)}
                                                className="text-gray-600 hover:text-black focus:outline-none"
                                                title="Modifier"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(request)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                                title="Supprimer"
                                            >
                                                <FaTrashAlt size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">Aucune demande de paiement trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Affichage des erreurs */}
                    {error && (
                        <div className="mt-4 text-red-600">
                            {error}
                        </div>
                    )}
                </>
            )}

            {/* Affichage des détails de la demande de paiement */}
            {showDetails && selectedRequestId && (
                <PaymentRequestDetails requestId={selectedRequestId} onClose={closeDetails} />
            )}
        </div>
    );

};

export default PaymentRequestList;
