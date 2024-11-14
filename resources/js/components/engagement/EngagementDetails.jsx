// EngagementDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetTrackingDetails from './BudgetTrackingDetails';
import AccountingImputationDetails from './AccountingImputationDetails';

const EngagementDetails = ({ engagement, onClose, activeTab, onTabChange }) => {
    const [engagementDetails, setEngagementDetails] = useState(null);

    useEffect(() => {
        const fetchEngagementDetails = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagement.id}`);
                setEngagementDetails(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des détails de l’engagement:', err);
            }
        };

        if (engagement) {
            fetchEngagementDetails();
        }
    }, [engagement]);

    if (!engagementDetails) {
        return <div>Chargement des détails...</div>;
    }

    const handleTabClick = (tab) => {
        onTabChange(tab);
    };

    // Calcul du total des montants des opérations
    const totalMontant = engagementDetails.engagement_operations
        ? engagementDetails.engagement_operations.reduce(
              (total, operation) => total + parseFloat(operation.montant),
              0
          ).toFixed(2)
        : '0.00';

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Affichage des détails de l'engagement */}
            <div className="flex justify-between mb-6">
                {/* Colonne de gauche */}
                <div>
                    <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {engagementDetails.date || 'N/A'}
                    </p>
                    <p>
                        <span className="font-semibold">WBS:</span> {engagementDetails.wbs || 'N/A'}
                    </p>
                    <p>
                        <span className="font-semibold">Référence:</span>{' '}
                        {engagementDetails.reference || 'N/A'}
                    </p>
                </div>
                {/* Colonne de droite */}
                <div>
                    <p>
                        <span className="font-semibold">Service demandeur:</span>{' '}
                        {engagementDetails.service_demandeur || 'N/A'}
                    </p>
                    <p>
                        <span className="font-semibold">Motif de la demande:</span>{' '}
                        {engagementDetails.motif_demande || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Navigation des onglets */}
            <div className="flex mb-4">
                <button
                    className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'description' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => handleTabClick('description')}
                >
                    Description de l'Opération
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'suivie' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => handleTabClick('suivie')}
                >
                    Suivi Budgétaire
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'imputation' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => handleTabClick('imputation')}
                >
                    Imputation Comptable
                </button>
            </div>

            {/* Contenu dynamique basé sur l'onglet actif */}
            <div className="p-4 border border-t-0 rounded-b-lg bg-gray-50">
                {activeTab === 'description' && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">Description de l'Opération</h3>
                        <div className="relative">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan="8"
                                            className="py-2 px-4 bg-gray-200 text-center text-lg font-bold border-b border-gray-300"
                                        >
                                            Description de l'Opération
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-300">N°</th>
                                        <th className="py-2 px-4 border border-gray-300">Désignation</th>
                                        <th className="py-2 px-4 border border-gray-300">Quantité</th>
                                        <th className="py-2 px-4 border border-gray-300">Nombre</th>
                                        <th className="py-2 px-4 border border-gray-300">PU</th>
                                        <th className="py-2 px-4 border border-gray-300">Montant</th>
                                        <th className="py-2 px-4 border border-gray-300">Observations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {engagementDetails.engagement_operations &&
                                        engagementDetails.engagement_operations.map((operation, index) => (
                                            <tr key={operation.id}>
                                                <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.designation}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.quantite}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.nombre}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.pu}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.montant}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.observations}</td>
                                            </tr>
                                        ))}
                                    {/* Affichage du total */}
                                    <tr>
                                        <td className="py-2 px-4 border border-gray-300 font-bold" colSpan="5">
                                            Total
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 font-bold">
                                            {totalMontant}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300"></td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Informations complémentaires */}
                            <div className="flex justify-end mt-4">
                                <div className="text-right">
                                    <p>Émetteur: (signature et date)</p>
                                    <p style={{ marginBottom: '20px' }}>Le chargé de logistique:</p>
                                    <p>SINSIN Daniel</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'suivie' && <BudgetTrackingDetails engagementId={engagement.id} />}
                {activeTab === 'imputation' && <AccountingImputationDetails engagementId={engagement.id} />}
            </div>

            {/* Bouton de fermeture */}
            <button
                onClick={onClose}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
                Fermer
            </button>
        </div>
    );
};

export default EngagementDetails;
