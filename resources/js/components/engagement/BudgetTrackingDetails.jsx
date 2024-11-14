import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const BudgetTrackingDetails = ({ engagementId }) => {
    // État pour stocker les valeurs éditables
    const [values, setValues] = useState({
        budget_line: '',
        amount_allocated: '',
        amount_spent: '',
        amount_approved: '',
        old_balance: '',
        new_balance: '',
        fournisseurs_prestataire: '',
        avis: '',
        moyens_de_paiement: '',
        signature: '',
    });

    // État pour déterminer quel champ est en mode édition
    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        const fetchBudgetTracking = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagementId}/budget-tracking`);
                if (response.data) {
                    setValues(response.data);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération du suivi budgétaire:', err);
            }
        };

        if (engagementId) {
            fetchBudgetTracking();
        }
    }, [engagementId]);

    const handleChange = (e) => {
        setValues({ ...values, [editingField]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (values.id) {
                // Mettre à jour le suivi budgétaire existant
                await axios.put(`/api/budget-trackings/${values.id}`, values);
            } else {
                // Créer un nouveau suivi budgétaire
                const response = await axios.post(`/api/engagements/${engagementId}/budget-tracking`, values);
                setValues(response.data);
            }
            setEditingField(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du suivi budgétaire:', err);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    // Liste des champs à afficher
    const fields = [
        { label: 'Ligne Budgétaire', name: 'budget_line' },
        { label: 'Montant inscrit au budget', name: 'amount_allocated' },
        { label: 'Montant déjà dépensé', name: 'amount_spent' },
        { label: 'Montant accordé', name: 'amount_approved' },
        { label: 'Ancien Solde', name: 'old_balance' },
        { label: 'Nouveau Solde', name: 'new_balance' },
        { label: 'Fournisseurs/Prestataire', name: 'fournisseurs_prestataire' },
        { label: 'Avis', name: 'avis' },
        { label: 'Moyens de paiement', name: 'moyens_de_paiement' },
        { label: 'Signature', name: 'signature' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Suivi Budgétaire</h3>

            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <tbody>
                    {fields.map((field) => (
                        <tr key={field.name}>
                            <td className="py-2 px-4 font-semibold border-b border-gray-300">{field.label}</td>
                            <td className="py-2 px-4 border-b border-gray-300 flex items-center justify-end space-x-2">
                                {editingField === field.name ? (
                                    <>
                                        <input
                                            type="text"
                                            value={values[field.name] || ''}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                                        />
                                        <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                                            <FaSave />
                                        </button>
                                        <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                                            <FaTimes />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{values[field.name]}</span>
                                        <FaEdit
                                            className="text-gray-500 cursor-pointer"
                                            onClick={() => setEditingField(field.name)}
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTrackingDetails;
