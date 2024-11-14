import React, { useState } from 'react';
import { FaEye, FaEdit } from 'react-icons/fa';
import Select from 'react-select'; // Importation de React Select

const RecusList = () => {
    const [selectedForm, setSelectedForm] = useState({ value: 'evaluation-personnel', label: 'Formulaire de demande d’évaluation du personnel' });
    const [showForm, setShowForm] = useState(false);  // État pour afficher/cacher le formulaire
    const [selectedRequest, setSelectedRequest] = useState(null);  // État pour la demande sélectionnée
    const [isEditing, setIsEditing] = useState(false);  // État pour savoir si on est en mode édition

    const requests = [
        { id: 1266665, demandeur: 'SINSIN Daniel', type: 'Diagnostique', status: 'En attente', date: '12 décembre 2023 à 14h' },
        { id: 5236665, demandeur: 'SINSIN Daniel', type: 'Formative', status: 'En attente', date: '12 décembre 2023 à 14h' },
        { id: 4756665, demandeur: 'SINSIN Daniel', type: 'Sommatif', status: 'Rejeté', date: '12 décembre 2023 à 14h' },
        { id: 8526665, demandeur: 'SINSIN Daniel', type: 'Diagnostique', status: 'Approuvé', date: '12 décembre 2023 à 14h' },
        { id: 4256665, demandeur: 'SINSIN Daniel', type: 'Sommatif', status: 'Approuvé', date: '12 décembre 2023 à 14h' },
    ];

    // Options pour le dropdown React Select
    const formOptions = [
        { value: 'evaluation-personnel', label: 'Formulaire de demande d’évaluation du personnel' },
        { value: 'besoins-personnel', label: 'Formulaire d’expression de besoins en personnel additionnel' },
        { value: 'conges-administratif', label: 'Formulaire de demande de Congés administratif' },
        { value: 'absence-poste', label: 'Formulaire de demande d\'absence au poste' },
        { value: 'explication-faute', label: 'Formulaire de demande d’explication pour faute/manquement' },
    ];

    // Fonction pour afficher les détails de la demande (mode vue)
    const handleViewDetails = (request) => {
        setSelectedRequest(request);  // Stocker la demande sélectionnée
        setIsEditing(false);  // Désactiver le mode édition (vue seulement)
        setShowForm(true);  // Afficher la modale
    };

    // Fonction pour gérer la modification (mode édition)
    const handleEditRequest = (request) => {
        setSelectedRequest(request);  // Stocker la demande sélectionnée pour édition
        setIsEditing(true);  // Activer le mode édition
        setShowForm(true);  // Afficher le formulaire
    };

    // Fonction pour gérer l'ajout d'une nouvelle demande
    const handleAddRequest = () => {
        setSelectedRequest(null);  // Aucune demande n'est sélectionnée (pour une nouvelle)
        setIsEditing(true);  // Activer le mode édition
        setShowForm(true);  // Afficher le formulaire
    };

    const handleCloseForm = () => {
        setShowForm(false);  // Fermer le formulaire ou la vue
        setIsEditing(false);  // Sortir du mode édition
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Bouton Ajouter */}
            <div className="flex justify-end mb-6">
                <button
                    className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600"
                    onClick={handleAddRequest}  // Gestion de l'ajout
                >
                    Ajouter +
                </button>
            </div>

            {/* Dropdown du formulaire avec React Select */}
            <div className="mb-6">
                <Select
                    className="w-full border border-gray-300 rounded-lg text-lg"  // Augmenter la taille du texte
                    value={selectedForm}
                    onChange={setSelectedForm}
                    options={formOptions}
                    placeholder="Choisissez un formulaire"
                />
            </div>

            {/* Tableau des demandes */}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-lg">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Références</th>
                        <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Type d’évaluation</th>
                        <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Statut</th>
                        <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Date</th>
                        <th className="py-3 px-6 text-center font-medium text-gray-600">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-100 border-b border-gray-200">
                            <td className="py-3 px-6 text-center border-r">{request.id}</td>
                            <td className="py-3 px-6 text-center border-r">{request.type}</td>
                            <td className="py-3 px-6 text-center border-r">
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
                                {request.status === 'En attente' && (
                                    <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded">
                                        En attente
                                    </span>
                                )}
                            </td>
                            <td className="py-3 px-6 text-center border-r">{request.date}</td>
                            <td className="py-3 px-6 text-center flex justify-center space-x-4">
                                <button
                                    className="text-gray-500 hover:text-blue-600"
                                    onClick={() => handleViewDetails(request)}  // Mode vue
                                >
                                    <FaEye size={20} />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-gray-600"
                                    onClick={() => handleEditRequest(request)}  // Mode édition
                                >
                                    <FaEdit size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Affichage des détails en mode vue */}
            {showForm && !isEditing && selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg rounded-lg w-1/2 p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">Demande {selectedRequest.id}</h2>
                            <h3 className="text-xl text-gray-600">Demande d’évaluation du personnel</h3>
                            <span className="text-green-500 bg-green-100 px-3 py-2 rounded">Approuvé</span>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Demandeur</h4>
                            <p className="font-medium">{selectedRequest.demandeur}</p>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Qualité du demandeur</h4>
                            <p className="text-gray-600">Chef Comptable et Logistique</p>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Catégorie d’acteurs à évaluer</h4>
                            <p className="text-gray-600">Assistants Comptable</p>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Service ou département concerné</h4>
                            <p className="text-gray-600">Finance</p>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Employé concerné</h4>
                            <p className="text-gray-600">Assistant Financière du Projet YEWA2</p>
                        </div>
                        <div className="border-t pt-4 pb-4">
                            <h4 className="text-lg font-semibold">Type d’évaluation</h4>
                            <p className="text-gray-600">{selectedRequest.type}</p>
                        </div>
                        <div className="text-right mt-6">
                            <button
                                onClick={handleCloseForm}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Affichage du formulaire en mode modification ou ajout */}
            {showForm && isEditing && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg rounded-lg w-1/2 p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">Formulaire</h2>
                            <h3 className="text-xl text-gray-600">Demande d’évaluation du personnel</h3>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Demandeur</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={selectedRequest ? selectedRequest.demandeur : ''}  // Vider pour un ajout
                                    disabled={!!selectedRequest}  // Désactivé si en mode édition
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Qualité du demandeur</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value="Chef Comptable et Logistique"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Catégorie d’acteurs à évaluer</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value="Assistants Comptable"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Service ou département concerné</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value="Finance"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Employé concerné</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value="Assistant Financière du Projet YEWA2"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-semibold mb-2">Type d’évaluation</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="evaluation" value="Diagnostique" />
                                        <span>Diagnostique</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="evaluation" value="Formative" />
                                        <span>Formative</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="evaluation" value="Sommatif" />
                                        <span>Sommatif</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    OK
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecusList;
