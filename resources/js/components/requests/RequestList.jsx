import React, { useState } from 'react';
import { FaEye, FaEdit } from 'react-icons/fa';
import RequestDetails from './RequestDetails'; // Importation du composant RequestDetails
import EvaluationForm from './EvaluationForm'; // Importation du composant EvaluationForm
import RecusList from './RecusList'; // Importation du nouveau composant RecusList
import Select from 'react-select'; // Importation de React Select

const RequestList = () => {
    const [requests] = useState([
        { id: 1266665, demandeur: 'SINSIN Daniel', type: 'Diagnostique', status: 'En attente', date: '12 décembre 2023 à 14h' },
        { id: 5236665, demandeur: 'SINSIN Daniel', type: 'Formative', status: 'En attente', date: '12 décembre 2023 à 14h' },
        { id: 4756665, demandeur: 'SINSIN Daniel', type: 'Sommatif', status: 'Rejeté', date: '12 décembre 2023 à 14h' },
        { id: 8526665, demandeur: 'SINSIN Daniel', type: 'Diagnostique', status: 'Approuvé', date: '12 décembre 2023 à 14h' },
        { id: 4256665, demandeur: 'SINSIN Daniel', type: 'Sommatif', status: 'Approuvé', date: '12 décembre 2023 à 14h' },
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [showRecusList, setShowRecusList] = useState(false); // État pour basculer entre les listes
    const [activeTab, setActiveTab] = useState('soumis'); // État pour gérer quel bouton est actif

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setShowEvaluationForm(false); // Fermer la fenêtre modale du formulaire d'évaluation
    };

    const handleEvaluateRequest = (request) => {
        setSelectedRequest(request);
        setShowEvaluationForm(true); // Afficher le formulaire d'évaluation lors du clic sur "Traiter"
    };

    const handleRecusClick = () => {
        setActiveTab('recus'); // Activer l'onglet Recus
        setShowRecusList(false); // Inverser : afficher la liste des soumis (ancien comportement de "Soumis")
    };

    const handleSoumisClick = () => {
        setActiveTab('soumis'); // Activer l'onglet Soumis
        setShowRecusList(true); // Inverser : afficher la liste des recus (ancien comportement de "Recus")
    };

    // Options pour le dropdown React Select
    const options = [
        { value: 'demande-evaluation', label: 'Formulaire de demande d’évaluation du personnel' },
        { value: 'besoins-personnel', label: 'Formulaire d’expression de besoins en personnel additionnel' },
        { value: 'conges-administratif', label: 'Formulaire de demande de Congés administratif' },
        { value: 'absence-poste', label: 'Formulaire de demande d\'absence au poste' },
        { value: 'explication-faute', label: 'Formulaire de demande d’explication pour faute/manquement' },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Boutons de bascule Soumis / Recus */}
            <div className="flex justify-end mb-8">
                <button
                    onClick={handleSoumisClick}
                    className={`px-8 py-3 text-lg font-semibold rounded-l-lg ${activeTab === 'soumis' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border'}`}
                >
                    Soumis
                </button>
                <button
                    onClick={handleRecusClick}
                    className={`px-8 py-3 text-lg font-semibold rounded-r-lg ${activeTab === 'recus' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border'}`}
                >
                    Recus
                </button>
            </div>

            {!showRecusList && (
                <>
                    {/* Dropdown avec React Select */}
                    <div className="mb-6">
                        <Select
                            className="w-full border border-gray-300 rounded-lg text-lg" // Applique les styles de bordure et agrandit le texte
                            options={options}
                            placeholder="Choisissez un formulaire"
                        />
                    </div>

                    {/* Tableau des demandes */}
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-lg">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Références</th>
                                <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Demandeur</th>
                                <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Type d’évaluation</th>
                                <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Date</th>
                                <th className="py-3 px-6 text-center font-medium text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-100 border-b border-gray-200">
                                    <td className="py-3 px-6 text-center border-r">{request.id}</td>
                                    <td className="py-3 px-6 text-center border-r">{request.demandeur}</td>
                                    <td className="py-3 px-6 text-center border-r">{request.type}</td>
                                    <td className="py-3 px-6 text-center border-r">{request.date}</td>
                                    <td className="py-3 px-6 text-center flex justify-center space-x-4">
                                        <button
                                            className="text-gray-500 hover:text-blue-600"
                                            onClick={() => handleViewDetails(request)}
                                        >
                                            <FaEye size={20} />
                                        </button>
                                        {request.status === 'En attente' && (
                                            <button
                                                className="text-gray-500 border border-gray-300 px-3 py-2 rounded hover:bg-gray-200"
                                                onClick={() => handleEvaluateRequest(request)}
                                            >
                                                Traiter
                                            </button>
                                        )}
                                        {request.status === 'Approuvé' && (
                                            <span className="text-green-500 bg-green-100 px-3 py-2 rounded">
                                                Approuvé
                                            </span>
                                        )}
                                        {request.status === 'Rejeté' && (
                                            <span className="text-red-500 bg-red-100 px-3 py-2 rounded">
                                                Rejeté
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Fenêtre modale pour les détails de la demande */}
                    {selectedRequest && !showEvaluationForm && (
                        <RequestDetails request={selectedRequest} closeModal={closeModal} />
                    )}

                    {/* Fenêtre modale pour le formulaire d'évaluation */}
                    {selectedRequest && showEvaluationForm && (
                        <EvaluationForm request={selectedRequest} closeModal={closeModal} />
                    )}
                </>
            )}

            {/* Affichage de la liste des demandes recus */}
            {showRecusList && <RecusList />}
        </div>
    );
};

export default RequestList;
