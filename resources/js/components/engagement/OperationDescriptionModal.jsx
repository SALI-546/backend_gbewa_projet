import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const OperationDescriptionModal = ({ onClose, engagementId }) => {
    const [operations, setOperations] = useState([]);
    const [newOperation, setNewOperation] = useState({
        designation: '',
        quantite: '',
        nombre: '',
        pu: '',
        montant: '',
        observations: '',
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Récupérer les opérations existantes pour l'engagement
        const fetchOperations = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagementId}/operations`);
                setOperations(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des opérations:', err);
            }
        };

        if (engagementId) {
            fetchOperations();
        }
    }, [engagementId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOperation({ ...newOperation, [name]: value });
    };

    const calculateMontant = () => {
        const { quantite, nombre, pu } = newOperation;
        const qte = parseFloat(quantite) || 0;
        const nbr = parseFloat(nombre) || 0;
        const price = parseFloat(pu) || 0;
        const montant = qte * nbr * price;
        return montant.toFixed(2);
    };

    const handleAddOrUpdateOperation = async () => {
        setIsSubmitting(true);
        try {
            if (editingIndex !== null) {
                // Mettre à jour l'opération existante via l'API
                const operationToUpdate = operations[editingIndex];
                const response = await axios.put(`/api/operations/${operationToUpdate.id}`, {
                    ...newOperation,
                    montant: calculateMontant(),
                });
                // Mettre à jour l'état local
                const updatedOperations = [...operations];
                updatedOperations[editingIndex] = response.data;
                setOperations(updatedOperations);
                setEditingIndex(null);
            } else {
                // Ajouter une nouvelle opération via l'API
                const response = await axios.post(`/api/engagements/${engagementId}/operations`, {
                    operations: [
                        {
                            ...newOperation,
                            montant: calculateMontant(),
                        },
                    ],
                });
                // Mettre à jour l'état local
                setOperations([...operations, ...response.data.operations]);
            }
            // Réinitialiser le formulaire
            setNewOperation({
                designation: '',
                quantite: '',
                nombre: '',
                pu: '',
                montant: '',
                observations: '',
            });
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement des opérations:', err);
            alert('Erreur lors de l\'enregistrement des opérations : ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditOperation = (index) => {
        setEditingIndex(index);
        setNewOperation(operations[index]);
    };

    const handleDeleteOperation = async (index) => {
        const operation = operations[index];
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
            try {
                await axios.delete(`/api/operations/${operation.id}`);
                const updatedOperations = operations.filter((_, i) => i !== index);
                setOperations(updatedOperations);
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'opération:', err);
                alert('Erreur lors de la suppression de l\'opération : ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSubmit = async () => {
        try {
            // Toutes les opérations ont déjà été gérées via les mises à jour individuelles
            alert('Opérations enregistrées avec succès.');
            onClose();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement des opérations:', err);
            alert('Erreur lors de l\'enregistrement des opérations : ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Description de l'opération</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black focus:outline-none">
                        &times;
                    </button>
                </div>

                {/* Lignes Ajoutées Section */}
                <p className="font-medium mb-2">Opérations ajoutées</p>
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mb-6">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">N°</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">Désignation</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">Quantité</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">Nombre</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">PU</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">Montant</th>
                            <th className="py-2 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">Observations</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((operation, index) => (
                            <tr key={operation.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.designation}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.quantite}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.nombre}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.pu}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.montant}</td>
                                <td className="py-2 px-4 border border-gray-300">{operation.observations}</td>
                                <td className="py-2 px-4 border border-gray-300 flex justify-center space-x-2">
                                    <button
                                        className="text-gray-600 hover:text-black focus:outline-none"
                                        onClick={() => handleEditOperation(index)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800 focus:outline-none"
                                        onClick={() => handleDeleteOperation(index)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Section Ajouter / Modifier une ligne */}
                <div className="mb-4">
                    <p className="font-medium mb-2">{editingIndex !== null ? 'Modifier la ligne' : 'Ajouter une ligne'}</p>

                    {/* Désignation */}
                    <div className="mb-2">
                        <label className="font-medium">Désignation</label>
                        <input
                            type="text"
                            name="designation"
                            value={newOperation.designation}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Désignation"
                        />
                    </div>

                    {/* Quantité */}
                    <div className="mb-2">
                        <label className="font-medium">Quantité</label>
                        <input
                            type="number"
                            name="quantite"
                            value={newOperation.quantite}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Quantité"
                        />
                    </div>

                    {/* Nombre */}
                    <div className="mb-2">
                        <label className="font-medium">Nombre</label>
                        <input
                            type="number"
                            name="nombre"
                            value={newOperation.nombre}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Nombre"
                        />
                    </div>

                    {/* PU */}
                    <div className="mb-2">
                        <label className="font-medium">Prix Unitaire (PU)</label>
                        <input
                            type="number"
                            name="pu"
                            value={newOperation.pu}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Prix Unitaire"
                        />
                    </div>

                    {/* Montant */}
                    <div className="mb-2">
                        <label className="font-medium">Montant</label>
                        <input
                            type="text"
                            name="montant"
                            value={calculateMontant()}
                            readOnly
                            className="w-full border rounded-lg p-2 mb-2 bg-gray-100 focus:outline-none"
                            placeholder="Montant"
                        />
                    </div>

                    {/* Observations */}
                    <div className="mb-2">
                        <label className="font-medium">Observations</label>
                        <textarea
                            name="observations"
                            value={newOperation.observations}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Observations"
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                    >
                        Précédent
                    </button>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleAddOrUpdateOperation}
                            className={`bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isSubmitting}
                        >
                            {editingIndex !== null ? 'Modifier la ligne' : 'Ajouter la ligne'}
                        </button>
                        {/* Vous pouvez ajouter un bouton pour sauvegarder toutes les opérations si nécessaire */}
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationDescriptionModal;
