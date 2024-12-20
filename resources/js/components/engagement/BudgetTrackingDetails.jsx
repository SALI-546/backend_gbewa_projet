import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetTrackingDetails = ({ engagementId }) => {
    const [budgetTracking, setBudgetTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Engagement ID:', engagementId); // Vérifiez que c'est bien 8
        const fetchBudgetTracking = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagementId}/budget-tracking`);
                console.log('BudgetTracking Response:', response.data); // Vérifiez les données reçues
                setBudgetTracking(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors de la récupération du suivi budgétaire:', err);
                setError(err.response?.data?.message || 'Erreur lors de la récupération des données.');
                setLoading(false);
            }
        };

        if (engagementId) {
            fetchBudgetTracking();
        }
    }, [engagementId]);

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    if (!budgetTracking) {
        return <div>Aucun suivi budgétaire disponible.</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Suivi Budgétaire</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <tbody>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Ligne Budgétaire</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.budget_line || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Montant inscrit au budget</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_allocated !== null ? budgetTracking.amount_allocated : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Montant déjà dépensé</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_spent !== null ? budgetTracking.amount_spent : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Montant accordé</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_approved !== null ? budgetTracking.amount_approved : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Ancien Solde</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.old_balance !== null ? budgetTracking.old_balance : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Nouveau Solde</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.new_balance !== null ? budgetTracking.new_balance : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Fournisseurs/Prestataire</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.fournisseurs_prestataire || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Moyens de paiement</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.moyens_de_paiement || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTrackingDetails;
