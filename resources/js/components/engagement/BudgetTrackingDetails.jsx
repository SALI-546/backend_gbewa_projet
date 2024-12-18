import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetTrackingDetails = ({ engagementId }) => {
    const [budgetTracking, setBudgetTracking] = useState(null);

    useEffect(() => {
        const fetchBudgetTracking = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagementId}/budget-tracking`);
                setBudgetTracking(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération du suivi budgétaire:', err);
            }
        };

        if (engagementId) {
            fetchBudgetTracking();
        }
    }, [engagementId]);

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
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_allocated || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Montant déjà dépensé</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_spent || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Montant accordé</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.amount_approved || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Ancien Solde</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.old_balance || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Nouveau Solde</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.new_balance || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Fournisseurs/Prestataire</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.fournisseurs_prestataire || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Avis</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.avis || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Moyens de paiement</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.moyens_de_paiement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 font-semibold border-b border-gray-300">Signature</td>
                        <td className="py-2 px-4 border-b border-gray-300">{budgetTracking.signature || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTrackingDetails;
